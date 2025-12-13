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
        const managerRoles = ["department_manager", "head_of_department", "direct_manager"];
        const isManager = managerRoles.includes(user.role);

        if (isManager) {
            // Manager Specific Stats
            const myPendingRequests = await HiringRequest.countDocuments({ requestedBy: user.id, status: "pending" });
            const myApprovedRequests = await HiringRequest.countDocuments({ requestedBy: user.id, status: "approved" });
            const myRejectedRequests = await HiringRequest.countDocuments({ requestedBy: user.id, status: "rejected" });

            // Get last 5 requests for activity feed
            const recentActivity = await HiringRequest.find({ requestedBy: user.id })
                .sort({ updatedAt: -1 })
                .limit(5)
                .select("positionTitle status updatedAt department");

            return NextResponse.json({
                myPendingRequests,
                myApprovedRequests,
                myRejectedRequests,
                recentActivity,
                isManager: true
            });
        }

        const newApplications = await Application.countDocuments({ status: 'pending' });

        const upcomingInterviews = await Application.countDocuments({
            status: 'interview_scheduled',
            interviewDate: { $gte: new Date() }
        });

        const activeCommittees = await Committee.countDocuments({ isActive: true });

        return NextResponse.json({
            newApplications,
            upcomingInterviews,
            activeCommittees,
            pendingTasks: 0,
            tasks: [],
            isManager: false
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
