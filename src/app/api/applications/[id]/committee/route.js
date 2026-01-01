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
            appCommittee = await applicationCommitteeService.assignCommittee(applicationId, committeeId, userId);
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

        // Automation is now handled inside ApplicationCommitteeService
        // if (body.autoSend) { ... }

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

export async function GET(req, props) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Allow any authenticated user to view committee assignment? 
        // Or restrict to HR/Admin + Committee Members?
        // For now, let's allow HR/Admins as per other methods.
        const { role, id: userId } = session.user;
        if (!["hr_manager", "admin", "hr_specialist", "super_admin"].includes(role)) {
            // Also allow if the user is a member of the committee? 
            // For now, stick to admin roles as this is admin UI.
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id: applicationId } = params;

        const appCommittee = await applicationCommitteeService.getByApplicationId(applicationId);

        // If no committee, we return null or empty object, but 200 OK so frontend doesn't crash on .json()
        // If we return 404, we must ensure frontend handles it. 
        // Best to return { committee: null } if not found.

        if (!appCommittee) {
            return NextResponse.json({ committee: null });
        }

        // We might want to populate members user details if not already done by service
        // The service might retun Mongoose document. 
        // Let's ensure it's populated. 
        // applicationCommitteeService.getByApplicationId uses 'findOne'
        // Let's modify service or just populate here? 
        // Service should probably handle it, but let's check what it returns or just populate here if needed.
        // Assuming service returns basic doc. We can populate.
        // But appCommittee is likely a POJO if service uses .lean(), or a Document.
        // Let's rely on service or if it's a doc, we can't populate after await. 
        // Let's assume service does enough or we might need to fix it.
        // Actually, let's use the model directly to be sure or check logic.
        // But better practice: Use the service. 

        // [SELF-HEALING] Force recalculation of stats to ensure they match Application feedbacks
        // This fixes cases where feedback was submitted but stats weren't updated (e.g. unlinked tokens)
        if (appCommittee) {
            // We need to call the method on the document. getByApplicationId returns a Query, so we trigger it properly.
            // But wait, getByApplicationId uses findOne... does it return a POJO or Doc? 
            // Default Mongoose queries return Hydrated Documents (unless .lean() is used).
            // ApplicationCommitteeService.getByApplicationId does NOT use .lean().

            try {
                // Check if it has the method (is a Mongoose Doc)
                if (typeof appCommittee.calculateVotingResults === 'function') {
                    await appCommittee.calculateVotingResults();
                    await appCommittee.save();
                }
            } catch (calcError) {
                console.error("Auto-calc stats failed:", calcError);
            }
        }

        return NextResponse.json({ committee: appCommittee });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
