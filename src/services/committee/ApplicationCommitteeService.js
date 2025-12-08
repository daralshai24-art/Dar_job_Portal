import ApplicationCommittee from "@/models/ApplicationCommittee";
import Application from "@/models/Application";
import User from "@/models/user";
import { connectDB } from "@/lib/db";

class ApplicationCommitteeService {
    /**
     * Assign a Committee Template to an Application
     */
    async assignCommittee(applicationId, committeeId) {
        await connectDB();

        // Check if already assigned
        const existing = await ApplicationCommittee.findOne({ applicationId });
        if (existing) throw new Error("Committee already assigned to this application");

        // Create from Template
        const appCommittee = await ApplicationCommittee.createFromTemplate(applicationId, committeeId);

        // Ensure HR Manager is included (Policy requirement often implies HR oversight)
        await this.ensureHRManagerIncluded(appCommittee);

        // Link Application
        await Application.findByIdAndUpdate(applicationId, {
            applicationCommitteeId: appCommittee._id
        });

        return appCommittee.populate("members.userId", "name email role");
    }

    /**
     * Create Custom Ad-hoc Committee
     */
    async createCustomCommittee(applicationId, members, settings) {
        await connectDB();

        const existing = await ApplicationCommittee.findOne({ applicationId });
        if (existing) throw new Error("Committee already assigned to this application");

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + (settings?.feedbackDeadlineDays || 7));

        const appCommittee = await ApplicationCommittee.create({
            applicationId,
            members: members.map(m => ({
                userId: m.userId,
                role: m.role,
                status: "pending"
            })),
            settings: {
                minFeedbackRequired: settings?.minFeedbackRequired || 2,
                requireAllFeedback: settings?.requireAllFeedback || false,
                feedbackDeadline: deadline,
                votingMechanism: settings?.votingMechanism || "average"
            },
            votingResults: {
                totalMembers: members.length
            }
        });

        await this.ensureHRManagerIncluded(appCommittee);

        await Application.findByIdAndUpdate(applicationId, {
            applicationCommitteeId: appCommittee._id
        });

        return appCommittee.populate("members.userId", "name email role");
    }

    /**
     * Ensure an active HR Manager is part of the committee
     */
    async ensureHRManagerIncluded(appCommittee) {
        // Check if HR Manager exists in members
        const hasHR = appCommittee.members.some(m => m.role === "hr_manager");
        if (hasHR) return;

        // Find an HR Manager
        const hrManager = await User.findOne({ role: "hr_manager", status: "active" });
        if (hrManager) {
            appCommittee.members.push({
                userId: hrManager._id,
                role: "hr_manager",
                status: "pending",
                reminderCount: 0
            });
            appCommittee.votingResults.totalMembers = appCommittee.members.length;
            await appCommittee.save();
        }
    }

    /**
     * Record Feedback from a member
     */
    async recordFeedback(applicationCommitteeId, userId, feedbackData) {
        await connectDB();
        const committee = await ApplicationCommittee.findById(applicationCommitteeId);
        if (!committee) throw new Error("Committee not found");

        // Record logic (status update)
        await committee.recordFeedback(userId, feedbackData);

        // Sync to Application Model (Denormalization)
        await this.updateApplicationCommitteeStatus(committee);

        return committee;
    }

    /**
     * Denormalize status to Application
     */
    async updateApplicationCommitteeStatus(committee) {
        await Application.findByIdAndUpdate(committee.applicationId, {
            committeeStatus: {
                totalMembers: committee.votingResults.totalMembers,
                feedbacksReceived: committee.votingResults.submittedCount,
                averageScore: committee.votingResults.averageScore,
                recommendation: committee.votingResults.recommendation,
                lastFeedbackAt: new Date()
            }
        });
    }

    /**
     * Get Committee Results
     */
    async calculateVotingResults(committeeId) {
        await dbConnect();
        const committee = await ApplicationCommittee.findById(committeeId);
        if (!committee) throw new Error("Committee not found");

        await committee.calculateVotingResults();
        await committee.save();

        return committee.votingResults;
    }

    async isComplete(committeeId) {
        await dbConnect();
        const committee = await ApplicationCommittee.findById(committeeId);
        return committee?.isComplete;
    }

    async getProgress(committeeId) {
        await dbConnect();
        const committee = await ApplicationCommittee.findById(committeeId)
            .populate("members.userId", "name email");

        if (!committee) return null;

        return {
            totalMembers: committee.votingResults.totalMembers,
            submittedCount: committee.votingResults.submittedCount,
            pendingCount: committee.pendingMembers.length,
            progress: committee.progress,
            isComplete: committee.isComplete,
            pendingMembers: committee.pendingMembers,
            submittedMembers: committee.submittedMembers,
            deadline: committee.settings.feedbackDeadline
        };
    }

    async getByApplicationId(applicationId) {
        await dbConnect();
        return ApplicationCommittee.findOne({ applicationId })
            .populate("committeeId", "name")
            .populate("members.userId", "name email role department")
            .populate({
                path: "applicationId",
                populate: { path: "jobId", populate: { path: "category" } }
            });
    }

    async cancelCommittee(applicationCommitteeId, userId, reason) {
        await dbConnect();
        const committee = await ApplicationCommittee.findById(applicationCommitteeId);
        if (!committee) throw new Error("Committee not found");

        committee.status = "cancelled";
        committee.cancelledAt = new Date();
        committee.cancelledBy = userId;
        committee.cancellationReason = reason;

        await committee.save();

        // Reset Application link
        await Application.findByIdAndUpdate(committee.applicationId, {
            applicationCommitteeId: null,
            committeeStatus: null
        });

        return committee;
    }
}

const applicationCommitteeService = new ApplicationCommitteeService();
export default applicationCommitteeService;
