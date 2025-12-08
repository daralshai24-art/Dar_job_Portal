import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import hiringRequestService from "@/services/hiring/HiringRequestService";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id: userId, role } = session.user;
        // Allowed: department_manager, hr, admin
        // Typically managers create requests

        const body = await req.json();
        const request = await hiringRequestService.createRequest(userId, body);

        return NextResponse.json({ message: "Request created", data: request }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { role, id: userId, department } = session.user;
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let filters = { status };

        if (role === "department_manager") {
            filters.requestedBy = userId; // or department based
        } else if (!["admin", "super_admin", "hr_manager"].includes(role)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const requests = await hiringRequestService.getAllRequests(filters);

        return NextResponse.json({ data: requests });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
