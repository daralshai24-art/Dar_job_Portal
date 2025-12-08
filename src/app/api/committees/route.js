import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import committeeService from "@/services/committee/CommitteeService";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { role, id: userId } = session.user;
        if (!["hr_manager", "admin", "super_admin"].includes(role)) {
            return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 });
        }

        const body = await req.json();
        const committee = await committeeService.createCommittee({
            ...body,
            createdBy: userId
        });

        return NextResponse.json(
            { message: "Committee created successfully", data: committee },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Committee Error:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("category");
        const department = searchParams.get("department");

        let committees;
        if (categoryId) {
            committees = await committeeService.findByCategory(categoryId);
            // standardize to array
            committees = committees ? [committees] : [];
        } else if (department) {
            committees = await committeeService.findByDepartment(department);
        } else {
            committees = await committeeService.getActiveCommittees();
        }

        return NextResponse.json(
            { message: "Committees retrieved successfully", data: committees },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get Committees Error:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
