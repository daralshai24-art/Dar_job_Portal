import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import hiringRequestService from "@/services/hiring/HiringRequestService";

export async function PATCH(req, props) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { role, id: userId } = session.user;
        if (!["hr_manager", "admin", "super_admin"].includes(role)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id } = params;
        const body = await req.json();
        const { decision, notes } = body;

        if (!decision) {
            return NextResponse.json({ message: "Decision required" }, { status: 400 });
        }

        const request = await hiringRequestService.reviewRequest(id, userId, decision, notes);

        // If approved, maybe convert to job if flag sent?
        if (decision === "approved" && body.createJob) {
            const { job } = await hiringRequestService.convertToJob(id, userId);
            return NextResponse.json({ message: "Request approved and job created", data: { request, job } });
        }

        return NextResponse.json({ message: "Request updated", data: request });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req, props) {
    const params = await props.params;
    // Can implement single get if needed
    return NextResponse.json({ message: "Not implemented" });
}
