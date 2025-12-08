import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import committeeService from "@/services/committee/CommitteeService";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { role: userRole, id: adminId } = session.user;
        if (!["hr_manager", "admin", "super_admin"].includes(userRole)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id } = params;
        const body = await req.json();

        const committee = await committeeService.addMember(id, body, adminId);

        return NextResponse.json({ message: "Member added", data: committee });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
