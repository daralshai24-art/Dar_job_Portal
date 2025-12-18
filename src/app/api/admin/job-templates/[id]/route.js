import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import JobTemplate from "@/models/JobTemplate";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const template = await JobTemplate.findById(id).populate("category");
        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }
        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Prevent title duplicates if title is changing
        if (body.title) {
            const existing = await JobTemplate.findOne({
                title: body.title,
                _id: { $ne: id }
            });
            if (existing) {
                return NextResponse.json(
                    { error: "Another template with this title already exists" },
                    { status: 400 }
                );
            }
        }

        const template = await JobTemplate.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error("UPDATE Template Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update template" },
            { status: 400 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const template = await JobTemplate.findByIdAndDelete(id);

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error("DELETE Template Error:", error);
        return NextResponse.json(
            { error: "Failed to delete template" },
            { status: 500 }
        );
    }
}
