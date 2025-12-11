import ApplicationCommittee from "@/models/ApplicationCommittee";
import FeedbackToken from "@/models/FeedbackToken";
import User from "@/models/user";
import Timeline from "@/models/Timeline";
import { connectDB } from "@/lib/db";
import emailService from "@/services/email"; // Central Index
import emailRoutingService from "@/services/email/EmailRoutingService";
import applicationCommitteeService from "./ApplicationCommitteeService";

class FeedbackOrchestratorService {
    /**
     * Send Feedback Requests to all pending committee members
     */
    async sendFeedbackRequests(applicationCommitteeId, triggeredBy) {
        console.log(`[FeedbackOrchestrator] Starting feedback requests for Committee: ${applicationCommitteeId}`);
        await connectDB();
        const committee = await ApplicationCommittee.findById(applicationCommitteeId)
            .populate("members.userId")
            .populate({
                path: "applicationId",
                populate: { path: "jobId", populate: { path: "category" } }
            });

        if (!committee) {
            console.error(`[FeedbackOrchestrator] Committee ${applicationCommitteeId} not found!`);
            throw new Error("Committee not found");
        }
        const application = committee.applicationId;
        console.log(`[FeedbackOrchestrator] Found Application: ${application._id} (${application.name})`);

        let sentCount = 0;
        let failedCount = 0;
        const results = [];

        console.log(`[FeedbackOrchestrator] Processing ${committee.members.length} members...`);

        for (let member of committee.members) {
            console.log(`[FeedbackOrchestrator] Checking member: ${member.userId?._id || 'Unknown'} (Role: ${member.role}, Status: ${member.status})`);

            if (member.status !== "pending") {
                console.log(`[FeedbackOrchestrator] Skipping member ${member.userId?.email} - Status is ${member.status}`);
                continue;
            }
            if (member.feedbackTokenId) {
                console.log(`[FeedbackOrchestrator] Skipping member ${member.userId?.email} - Already has token`);
                continue;
            }

            try {
                const user = member.userId;
                if (!user) {
                    console.warn(`[FeedbackOrchestrator] Member user not found/populated`);
                    continue;
                }

                console.log(`[FeedbackOrchestrator] Sending to: ${user.email} (${user.name})`);

                // 1. Check Preferences
                const { shouldSend } = await emailRoutingService.shouldSendEmail(
                    user._id,
                    "feedback_request",
                    { application }
                );

                if (!shouldSend) {
                    console.log(`[FeedbackOrchestrator] Email preference disabled for ${user.email}`);
                    results.push({ email: user.email, success: false, reason: "preference_disabled" });
                    continue;
                }

                // 2. Create Token
                // Map Committee Roles to Token Roles if needed
                let tokenRole = "technical_reviewer";
                if (member.role === "hr_manager") tokenRole = "hr_reviewer";
                if (member.role === "manager") tokenRole = "hiring_manager";

                console.log(`[FeedbackOrchestrator] Creating token with role: ${tokenRole}`);

                const token = await FeedbackToken.createToken({
                    applicationId: application._id,
                    managerEmail: user.email,
                    managerName: user.name,
                    managerRole: tokenRole,
                    expiresInDays: 7, // or committee settings
                    createdBy: triggeredBy
                });

                token.applicationCommitteeId = committee._id;
                token.committeeRole = member.role;
                await token.save();

                // 3. Send Email
                console.log(`[FeedbackOrchestrator] Dispatching email to ${user.email}...`);
                await emailService.sendManagerFeedbackRequest({ // Using existing email function
                    application,
                    managerEmail: user.email,
                    managerName: user.name,
                    managerRole: tokenRole,
                    message: "You have been assigned to evaluate this candidate as part of the hiring committee.",
                    expiresInDays: 7,
                    triggeredBy
                });

                // 4. Update Member
                member.feedbackTokenId = token._id;
                member.notifiedAt = new Date();

                sentCount++;
                results.push({ email: user.email, success: true, tokenId: token._id });
                console.log(`[FeedbackOrchestrator] Success for ${user.email}`);

            } catch (error) {
                console.error(`[FeedbackOrchestrator] Failed to send feedback request to ${member.userId?.email}`, error);
                failedCount++;
                results.push({ email: member.userId?.email, success: false, error: error.message });
            }
        }

        await committee.save();
        console.log(`[FeedbackOrchestrator] Finished. Sent: ${sentCount}, Failed: ${failedCount}`);

        // Timeline Record
        await Timeline.create({
            applicationId: application._id,
            action: "committee_assigned",
            status: application.status,
            notes: `Committee assigned with ${committee.members.length} members`,
            details: { committeeId: committee._id, memberCount: committee.members.length, sentCount },
            performedBy: triggeredBy
        });

        return { success: true, results, totalSent: sentCount, totalFailed: failedCount };
    }

    /**
     * Send Reminders to pending members
     */
    async sendReminders(applicationCommitteeId, triggeredBy) {
        await connectDB();
        const committee = await ApplicationCommittee.findById(applicationCommitteeId)
            .populate("members.userId")
            .populate("applicationId"); // need deep populate usually, assuming basic for now

        if (!committee) throw new Error("Committee not found");
        const activeMembers = committee.pendingMembers;

        // Logic similar to above but check for existing token and resend
        // Simplified for this implementation
        return { count: activeMembers.length };
    }

    /**
     * Process a Submission
     */
    async processFeedbackSubmission(tokenId, feedbackData) {
        await connectDB();
        const token = await FeedbackToken.findById(tokenId).populate("applicationCommitteeId");

        if (!token) throw new Error("Token not found");

        // Find User by email (since token is email-based)
        const user = await User.findOne({ email: token.managerEmail });
        if (!user) throw new Error("Reviewer user account not found");

        if (token.applicationCommitteeId) {
            await applicationCommitteeService.recordFeedback(
                token.applicationCommitteeId._id,
                user._id,
                feedbackData
            );

            const committee = await ApplicationCommittee.findById(token.applicationCommitteeId._id)
                .populate("applicationId"); // Ensure app is available

            // Notify HR about this specific feedback
            // Broaden scope to HR Managers, Admins, and Super Admins
            const hrRecipients = await emailRoutingService.getRecipientsByRole("hr_manager", "feedback_received");
            const adminRecipients = await emailRoutingService.getRecipientsByRole("admin", "feedback_received");
            const superAdminRecipients = await emailRoutingService.getRecipientsByRole("super_admin", "feedback_received");

            // Merge and deduplicate by email
            const allRecipients = [...hrRecipients, ...adminRecipients, ...superAdminRecipients];
            const uniqueRecipients = Array.from(new Map(allRecipients.map(u => [u.email, u])).values());

            console.log(`[FeedbackOrchestrator] Notification Targets: HR(${hrRecipients.length}), Admin(${adminRecipients.length}), SuperAdmin(${superAdminRecipients.length}). Total Unique: ${uniqueRecipients.length}`);

            if (uniqueRecipients.length === 0) {
                console.warn("[FeedbackOrchestrator] WARNING: No valid recipients found for feedback notification!");
            }

            for (const recipient of uniqueRecipients) {
                try {
                    const emailResult = await emailService.sendFeedbackReceivedNotification({
                        recipientEmail: recipient.email,
                        application: committee.applicationId,
                        managerName: user.name,
                        role: token.committeeRole || "reviewer"
                    });
                    console.log(`[FeedbackOrchestrator] Notification sent to ${recipient.email}:`, emailResult.success);
                } catch (error) {
                    console.error("Failed to send feedback received notification:", error);
                }
            }

            if (committee.isComplete) {
                await this.handleCommitteeCompletion(committee._id);
            }

            return { success: true, isComplete: committee.isComplete, votingResults: committee.votingResults };
        }

        return { success: true };
    }

    /**
     * Handle Completion (Notify HR)
     */
    async handleCommitteeCompletion(applicationCommitteeId) {
        const committee = await ApplicationCommittee.findById(applicationCommitteeId)
            .populate("members.userId")
            .populate({
                path: "applicationId",
                populate: { path: "jobId" }
            });

        if (!committee) return;

        await committee.markComplete();
        await committee.save();

        // Notify HR
        const recipients = await emailRoutingService.getRecipientsByRole("hr_manager", "committee_completed");

        for (const recipient of recipients) {
            try {
                await emailService.sendCommitteeCompleted({
                    recipientEmail: recipient.email,
                    recipientName: recipient.name,
                    committee,
                    application: committee.applicationId
                });
            } catch (error) {
                console.error("Failed to send committee completion email:", error);
            }
        }
    }
}

const feedbackOrchestratorService = new FeedbackOrchestratorService();
export default feedbackOrchestratorService;
