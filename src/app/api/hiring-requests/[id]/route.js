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
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = params;

        // Use service or model directly if service doesn't have getById
        // Importing model dynamically to avoid top-level issues if any
        const HiringRequest = (await import("@/models/HiringRequest")).default;

        const request = await HiringRequest.findById(id)
            .populate("requestedBy", "name email department")
            .populate("category", "name")
            .populate("reviewedBy", "name")
            .populate("jobId", "title status");

        if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

        // Access Check
        const { role, id: userId } = session.user;
        const isHR = ["admin", "super_admin", "hr_manager"].includes(role);
        const isOwner = request.requestedBy._id.toString() === userId;

        if (!isHR && !isOwner) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ data: request });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
