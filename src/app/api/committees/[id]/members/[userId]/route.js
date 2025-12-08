import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import committeeService from "@/services/committee/CommitteeService";

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { role: userRole } = session.user;
        if (!["hr_manager", "admin", "super_admin"].includes(userRole)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id, userId } = params;
        const committee = await committeeService.removeMember(id, userId);

        return NextResponse.json({ message: "Member removed", data: committee });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
