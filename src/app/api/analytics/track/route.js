import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import VisitorLog from '@/models/VisitorLog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

// Helper to determine device type roughly from User Agent
// Helper to determine device type roughly from User Agent
function getDeviceType(ua) {
    if (!ua) return 'unknown';
    const uaLower = ua.toLowerCase();

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(uaLower)) {
        return 'tablet';
    }

    // Explicitly check for 'iphone', 'android', 'mobile'
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini|fennec|windows phone|kindle|silk|maemo|palm|symbian|javame|midp|wap/.test(uaLower)) {
        return 'mobile';
    }

    return 'desktop';
}

export async function POST(req) {
    try {
        await connectDB();

        // Get session for user mapping if logged in
        let userId = null;
        try {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
            }
        } catch (e) {
            // failed to get session, ignore
        }

        const body = await req.json();
        const { visitorId, path } = body;

        // Headers extraction
        const userAgent = req.headers.get('user-agent') || '';
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

        // Create Log
        await VisitorLog.create({
            visitorId,
            userId,
            path,
            ip: ip.split(',')[0].trim(), // Take first IP if multiple
            userAgent,
            deviceType: getDeviceType(userAgent),
            timestamp: new Date()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Tracking Error:', error);
        // Return 200 even on error to not break the client experience
        return NextResponse.json({ success: false }, { status: 200 });
    }
}
