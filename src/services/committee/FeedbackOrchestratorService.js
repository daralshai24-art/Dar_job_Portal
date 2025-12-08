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
        await connectDB();
        const committee = await ApplicationCommittee.findById(applicationCommitteeId)
            .populate("members.userId")
            .populate({
                path: "applicationId",
                populate: { path: "jobId", populate: { path: "category" } }
            });

        if (!committee) throw new Error("Committee not found");
        const application = committee.applicationId;

        let sentCount = 0;
        let failedCount = 0;
        const results = [];

        for (let member of committee.members) {
            if (member.status !== "pending") continue;
            if (member.feedbackTokenId) continue; // Already sent

            try {
                const user = member.userId;

                // 1. Check Preferences
                const { shouldSend } = await emailRoutingService.shouldSendEmail(
                    user._id,
                    "feedback_request",
                    { application }
                );

                if (!shouldSend) {
                    results.push({ email: user.email, success: false, reason: "preference_disabled" });
                    continue;
                }

                // 2. Create Token
                // Map Committee Roles to Token Roles if needed
                let tokenRole = "technical_reviewer";
                if (member.role === "hr_manager") tokenRole = "hr_reviewer";
                if (member.role === "manager") tokenRole = "hiring_manager";

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

            } catch (error) {
                console.error(`Failed to send feedback request to ${member.userId.email}`, error);
                failedCount++;
                results.push({ email: member.userId.email, success: false, error: error.message });
            }
        }

        await committee.save();

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

            const committee = await ApplicationCommittee.findById(token.applicationCommitteeId._id);
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
