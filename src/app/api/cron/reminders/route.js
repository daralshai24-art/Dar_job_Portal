import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ApplicationCommittee from "@/models/ApplicationCommittee";
import feedbackOrchestratorService from "@/services/committee/FeedbackOrchestratorService";

/**
 * Cron Job Endpoint for Reminders
 * Should be called daily by an external scheduler (e.g. Vercel Cron, GitHub Actions)
 */
export async function GET(req) {
    try {
        // Secure this endpoint (e.g. check for a secret header)
        const authHeader = req.headers.get("authorization");
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find committees active and near deadline (e.g. < 2 days left)
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

        const committees = await ApplicationCommittee.find({
            status: "active",
            deadline: { $lte: twoDaysFromNow, $gt: new Date() } // Not expired yet
        });

        let totalReminders = 0;

        for (const committee of committees) {
            // Logic handled in orchestrator
            const res = await feedbackOrchestratorService.sendReminders(committee._id, "system_cron");
            totalReminders += (res.count || 0);
        }

        return NextResponse.json({
            success: true,
            committeesProcessed: committees.length,
            remindersSent: totalReminders
        });

    } catch (error) {
        console.error("Reminder cron failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
