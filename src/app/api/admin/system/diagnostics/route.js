import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/settings";
import Application from "@/models/Application";
import Job from "@/models/Job";
import User from "@/models/user";
import ApplicationCommittee from "@/models/ApplicationCommittee";

export async function GET() {
    try {
        await connectDB();

        const checks = {
            settings: { status: "unknown", details: "" },
            jobs: { status: "unknown", count: 0, orphanApplications: 0 },
            committees: { status: "unknown", count: 0, active: 0 },
            roles: { status: "unknown", distribution: {} }
        };

        // 1. Settings Check
        const settings = await Settings.findOne();
        if (settings) {
            checks.settings.status = "ok";
            checks.settings.details = `Provider: ${settings.email?.provider || 'default'}, Maintenance: ${settings.general?.maintenanceMode}`;
        } else {
            checks.settings.status = "warning";
            checks.settings.details = "No settings document found. Using code defaults.";
        }

        // 2. Job & Application Integrity
        const jobCount = await Job.countDocuments();
        const appCount = await Application.countDocuments();
        // Check orphans (Apps with invalid Job ID) - simplistic check
        // Group by jobId
        const appsByJob = await Application.aggregate([
            {
                $group: {
                    _id: "$jobId",
                    count: { $sum: 1 }
                }
            }
        ]);

        let orphanCount = 0;
        for (const group of appsByJob) {
            const jobExists = await Job.exists({ _id: group._id });
            if (!jobExists) orphanCount += group.count;
        }

        checks.jobs.status = orphanCount === 0 ? "ok" : "warning";
        checks.jobs.count = jobCount;
        checks.jobs.orphanApplications = orphanCount;

        // 3. Committees
        const committeeCount = await ApplicationCommittee.countDocuments();
        const activeCommittees = await ApplicationCommittee.countDocuments({ status: "active" });
        checks.committees.count = committeeCount;
        checks.committees.active = activeCommittees;
        checks.committees.status = "ok";

        // 4. Role Integrity
        const roleStats = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);
        const dist = {};
        roleStats.forEach(r => dist[r._id] = r.count);
        checks.roles.distribution = dist;
        checks.roles.status = "ok";

        return NextResponse.json({
            success: true,
            timestamp: new Date(),
            checks
        });

    } catch (error) {
        console.error("Diagnostics error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
