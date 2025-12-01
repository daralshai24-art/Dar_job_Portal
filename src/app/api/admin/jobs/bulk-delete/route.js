import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Job from "@/models/Job";

export async function POST(request) {
    try {
        await connectDB();

        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "Invalid request: ids array is required" },
                { status: 400 }
            );
        }

        const result = await Job.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} jobs`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("Bulk delete jobs error:", error);
        return NextResponse.json(
            { error: "Failed to delete jobs" },
            { status: 500 }
        );
    }
}
