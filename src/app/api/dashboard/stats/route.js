import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import HiringRequest from "@/models/HiringRequest";
import Committee from "@/models/Committee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { user } = session;
        const isDeptManager = user.role === 'department_manager';
        const deptFilter = isDeptManager ? { "jobId.department": user.department } : {};

        // 1. Applications Count
        // Note: This requires population if filtering by job department, verifying schema first is safer
        // tailored simple count for now
        const newApplications = await Application.countDocuments({ status: 'pending' });

        // 2. Upcoming Interviews
        const upcomingInterviews = await Application.countDocuments({
            status: 'interview_scheduled',
            interviewDate: { $gte: new Date() }
        });

        // 3. Active Committees
        // If dept manager, found committees where they are a member
        const activeCommitteesQuery = isDeptManager
            ? { "members.userId": user.id, isActive: true }
            : { isActive: true };
        const activeCommittees = await Committee.countDocuments(activeCommitteesQuery);

        // 4. Tasks (Mocked logic for pending feedback)
        // In real implementation, check FeedbackToken where status=pending for this user

        return NextResponse.json({
            newApplications,
            upcomingInterviews,
            activeCommittees,
            pendingTasks: 0, // Placeholder
            tasks: []
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
