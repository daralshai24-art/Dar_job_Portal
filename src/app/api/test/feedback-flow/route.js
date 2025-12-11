import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import ApplicationCommittee from "@/models/ApplicationCommittee";
import feedbackOrchestratorService from "@/services/committee/FeedbackOrchestratorService";
import emailService from "@/services/email";

export async function GET(req) {
    try {
        await connectDB();

        // 1. Find a test candidate
        // Find an application with a committee that has pending members
        const committee = await ApplicationCommittee.findOne({
            "members.status": "pending"
        }).populate("applicationId").populate("members.userId");

        if (!committee) {
            return NextResponse.json({ message: "No suitable committee found for testing" });
        }

        const pendingMember = committee.members.find(m => m.status === "pending");
        if (!pendingMember || !pendingMember.userId) {
            return NextResponse.json({ message: "No pending member found with valid user" });
        }

        const logs = [];
        const log = (msg) => logs.push(msg);

        log(`Found Committee: ${committee._id} for App: ${committee.applicationId.name}`);
        log(`Testing Member: ${pendingMember.userId.email} (${pendingMember.role})`);

        // 2. Test Resend (Unlimited)
        log("--- Testing Unlimited Resend ---");
        try {
            const resendResult = await emailService.sendManagerFeedbackRequest({
                application: committee.applicationId,
                managerEmail: pendingMember.userId.email,
                managerName: pendingMember.userId.name,
                managerRole: pendingMember.role,
                triggeredBy: "TEST_SCRIPT",
                metadata: { forceSend: true } // THE KEY TEST
            });

            if (resendResult.duplicate) {
                log("❌ FAIL: Force send was blocked as duplicate!");
            } else if (resendResult.success) {
                log("✅ SUCCESS: Force send bypassed duplicate check.");
                log(`   Token ID: ${resendResult.metadata?.tokenId}`);
            } else {
                log(`❌ ERROR: ${resendResult.error}`);
            }
        } catch (e) {
            log(`❌ EXCEPTION in Resend: ${e.message}`);
        }

        // 3. Test Notification Trigger (Dry Run)
        log("--- Testing Notification Recipient Resolution ---");
        // We won't actually submit feedback to avoid messing up data, 
        // but we will check if the service can find HR recipients.

        const { getRecipientsByRole } = require("@/services/email/EmailRoutingService").default; // Dynamic import if needed or use imported service
        // Actually we imported feedbackOrchestratorService, let's use the routing service directly
        const emailRoutingService = require("@/services/email/EmailRoutingService").default;

        const recipients = await emailRoutingService.getRecipientsByRole("hr_manager", "feedback_received");
        log(`Found ${recipients.length} HR recipients for notification.`);
        recipients.forEach(r => log(`   - ${r.email} (${r.name})`));

        return NextResponse.json({
            message: "Test Sequence Complete",
            logs
        });

    } catch (error) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
