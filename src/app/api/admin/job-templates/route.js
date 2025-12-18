import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import JobTemplate from "@/models/JobTemplate";
import Category from "@/models/Category"; // Ensure model is registered

export async function GET(request) {
    try {
        await connectDB();

        const templates = await JobTemplate.find({ isActive: true })
            .populate("category", "name")
            .sort({ title: 1 });

        return NextResponse.json(templates);
    } catch (error) {
        console.error("GET Job Templates Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch templates" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // Basic validation could go here, but Mongoose will handle most schema constraints
        // We can add a duplicate check explicitly if needed for better error msg
        const existing = await JobTemplate.findOne({ title: body.title });
        if (existing) {
            return NextResponse.json(
                { error: "A template with this title already exists" },
                { status: 400 }
            );
        }

        const template = await JobTemplate.create(body);

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error("CREATE Job Template Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create template" },
            { status: 400 }
        );
    }
}
