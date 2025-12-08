import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import applicationCommitteeService from "@/services/committee/ApplicationCommitteeService";
import feedbackOrchestratorService from "@/services/committee/FeedbackOrchestratorService";

export async function POST(req, props) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { role, id: userId } = session.user;
        if (!["hr_manager", "admin", "hr_specialist", "super_admin"].includes(role)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id: applicationId } = params;
        const body = await req.json();
        const { committeeId, members, settings } = body;

        let appCommittee;
        if (committeeId) {
            appCommittee = await applicationCommitteeService.assignCommittee(applicationId, committeeId);
        } else if (members && members.length > 0) {
            appCommittee = await applicationCommitteeService.createCustomCommittee(applicationId, members, settings);
        } else {
            return NextResponse.json({ message: "Missing committeeId or members" }, { status: 400 });
        }

        // Trigger feedback requests immediately? Or separate step?
        // Often user might want to review before sending. 
        // But for this flow, let's assume we trigger immediately or based on a flag.
        // For now, let's just create it. The UI can have a separate "Send Requests" button 
        // OR we trigger it if `autoSend: true` is passed.

        if (body.autoSend) {
            await feedbackOrchestratorService.sendFeedbackRequests(appCommittee._id, userId);
        }

        return NextResponse.json({ message: "Committee assigned successfully", data: appCommittee });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, props) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { role, id: userId } = session.user;
        if (!["hr_manager", "admin", "hr_specialist", "super_admin"].includes(role)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id: applicationId } = params;

        // Find the active committee for this application
        const appCommittee = await applicationCommitteeService.getByApplicationId(applicationId);
        if (!appCommittee) {
            return NextResponse.json({ message: "No active committee found" }, { status: 404 });
        }

        await applicationCommitteeService.cancelCommittee(appCommittee._id, userId, "Manual removal by admin");

        return NextResponse.json({ message: "Committee removed successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
