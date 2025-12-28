import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import VisitorLog from '@/models/VisitorLog';
import Job from '@/models/Job';

export async function GET(req) {
    try {
        await connectDB();

        // Time ranges
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // 1. Total Visits (Last 30 Days) & Trend
        // We can aggregate by day for a chart
        const dailyVisits = await VisitorLog.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$visitorId" }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: "$_id",
                    visits: "$count",
                    unique: { $size: "$uniqueVisitors" }
                }
            }
        ]);

        // 2. Top Pages (Last 30 Days)
        const topPagesRaw = await VisitorLog.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            { $group: { _id: "$path", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Enrich with Job Titles
        const enrichWithTitles = async (items, pathKey = '_id') => {
            return await Promise.all(items.map(async (item) => {
                // Handle mongoose document or POJO
                const path = item[pathKey] || (item.toObject ? item.toObject()[pathKey] : null);
                if (!path) return item;

                let title = null;

                // Check if it's a job path: /jobs/ObjectId
                if (path.startsWith('/jobs/') && path.split('/').length === 3) {
                    const jobId = path.split('/')[2];
                    // basic mongo id regex check
                    if (/^[0-9a-fA-F]{24}$/.test(jobId)) {
                        try {
                            const job = await Job.findById(jobId).select('title');
                            if (job) title = job.title;
                        } catch (e) { /* ignore */ }
                    }
                }

                // Return enhanced object
                const result = item.toObject ? item.toObject() : { ...item };
                if (title) result.title = title;
                return result;
            }));
        };

        const topPages = await enrichWithTitles(topPagesRaw, '_id');

        // 3. Device Stats
        const deviceStats = await VisitorLog.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            { $group: { _id: "$deviceType", count: { $sum: 1 } } }
        ]);

        // 4. Quick Summary
        const totalVisitsAllTime = await VisitorLog.countDocuments();
        const activeNow = await VisitorLog.distinct('visitorId', {
            timestamp: { $gte: new Date(now - 5 * 60 * 1000) } // Last 5 mins
        });

        // 5. Recent Activity (Raw Logs)
        const recentVisitsRaw = await VisitorLog.find()
            .sort({ timestamp: -1 })
            .limit(20)
            .select('path ip userAgent deviceType timestamp');

        const recentVisits = await enrichWithTitles(recentVisitsRaw, 'path');

        return NextResponse.json({
            success: true,
            data: {
                dailyVisits,
                topPages: topPages.map(p => ({ path: p._id, views: p.count, title: p.title })),
                deviceStats: deviceStats.map(d => ({ device: d._id, count: d.count })),
                recentVisits,
                summary: {
                    totalVisits: totalVisitsAllTime,
                    activeUsers: activeNow.length // Approximation
                }
            }
        });

    } catch (error) {
        console.error('Analytics Stats Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        // Optional: Check for admin session/permissions here if needed
        // For now, assuming protected via middleware or UI checks

        await VisitorLog.deleteMany({});

        return NextResponse.json({ success: true, message: 'All visitor logs cleared' });
    } catch (error) {
        console.error('Clear Analytics Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to clear logs' }, { status: 500 });
    }
}
