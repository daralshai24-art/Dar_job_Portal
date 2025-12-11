import mongoose from "mongoose";

const applicationCommitteeSchema = new mongoose.Schema(
    {
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
            unique: true,
            index: true
        },
        committeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Committee",
            index: true
        },

        // Active Members for this specific application
        members: [{
            _id: false,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            role: {
                type: String,
                enum: ["supervisor", "manager", "head_department", "department_manager", "interviewer", "technical_reviewer", "hr_reviewer", "decision_maker", "hr_manager", "hr_specialist"],
                required: true
            },
            status: {
                type: String,
                enum: ["pending", "submitted", "skipped"],
                default: "pending",
                index: true
            },
            feedbackTokenId: { type: mongoose.Schema.Types.ObjectId, ref: "FeedbackToken" },
            notifiedAt: Date,
            submittedAt: Date,
            reminderSentAt: Date,
            reminderCount: { type: Number, default: 0 }
        }],

        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active",
            index: true
        },

        // Aggregated Results
        votingResults: {
            totalMembers: { type: Number, default: 0 },
            submittedCount: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 },
            recommendation: {
                type: String,
                enum: ["hire", "reject", "pending"],
                default: "pending"
            },
            recommendations: {
                recommend: { type: Number, default: 0 },
                not_recommend: { type: Number, default: 0 },
                pending: { type: Number, default: 0 }
            },
            lastCalculatedAt: Date
        },

        // Instance-specific settings (copied from template)
        settings: {
            minFeedbackRequired: { type: Number, default: 2 },
            requireAllFeedback: { type: Boolean, default: false },
            feedbackDeadline: Date,
            votingMechanism: {
                type: String,
                enum: ["average", "majority", "consensus"],
                default: "average"
            }
        },

        completedAt: Date,
        cancelledAt: Date,
        cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        cancellationReason: String
    },
    { timestamps: true }
);

// Indexes
applicationCommitteeSchema.index({ status: 1, createdAt: -1 });
applicationCommitteeSchema.index({ "members.userId": 1, status: 1 });
// removed duplicate index for members.status

// Virtuals
applicationCommitteeSchema.virtual("isComplete").get(function () {
    if (this.status === "completed") return true;

    const { submittedCount, totalMembers } = this.votingResults;
    const { requireAllFeedback, minFeedbackRequired } = this.settings;

    if (requireAllFeedback) {
        return submittedCount === totalMembers;
    }
    return submittedCount >= minFeedbackRequired;
});

applicationCommitteeSchema.virtual("pendingMembers").get(function () {
    return this.members.filter(m => m.status === "pending");
});

applicationCommitteeSchema.virtual("submittedMembers").get(function () {
    return this.members.filter(m => m.status === "submitted");
});

applicationCommitteeSchema.virtual("progress").get(function () {
    if (this.votingResults.totalMembers === 0) return 0;
    return Math.round((this.votingResults.submittedCount / this.votingResults.totalMembers) * 100);
});

// Methods
applicationCommitteeSchema.methods.recordFeedback = async function (userId, feedbackData) {
    console.log(`[ApplicationCommittee] recordFeedback called for committee ${this._id}, user ${userId}`);

    // 1. Validate membership
    const memberIndex = this.members.findIndex(m => m.userId.toString() === userId.toString());
    if (memberIndex === -1) {
        console.error(`[ApplicationCommittee] User ${userId} not found in members:`, this.members.map(m => m.userId));
        throw new Error("User is not a member of this committee");
    }

    const member = this.members[memberIndex];
    if (member.status === "submitted") {
        console.warn(`[ApplicationCommittee] Feedback already submitted for user ${userId}`);
        // throw new Error("Feedback already submitted");
    }

    // 2. Atomic Update to persist status safely
    console.log(`[ApplicationCommittee] Executing findOneAndUpdate...`);
    const freshCommittee = await this.constructor.findOneAndUpdate(
        { _id: this._id, "members.userId": userId },
        {
            $set: {
                "members.$.status": "submitted",
                "members.$.submittedAt": new Date()
            }
        },
        { new: true }
    );

    if (!freshCommittee) {
        console.error(`[ApplicationCommittee] Update failed. freshCommittee is null.`);
        throw new Error("Update failed: Committee or Member not found in DB");
    }
    console.log(`[ApplicationCommittee] Atomic update successful. Status: submitted`);

    // 3. Calculate with fresh data (in memory)
    await freshCommittee.calculateVotingResults();

    // 4. Persist Results ONLY (Do NOT call save() on the full doc)
    const updates = {
        votingResults: freshCommittee.votingResults,
        // If calculation marked it complete, persist that too
        status: freshCommittee.status
    };
    if (freshCommittee.completedAt) updates.completedAt = freshCommittee.completedAt;

    await this.constructor.updateOne(
        { _id: this._id },
        { $set: updates }
    );
    console.log(`[ApplicationCommittee] Results persisted via updateOne.`);

    return freshCommittee;
};

applicationCommitteeSchema.methods.calculateVotingResults = async function () {
    // Need to populate application to get manager feedbacks
    await this.populate("applicationId");

    const feedbacks = this.applicationId.managerFeedbacks || [];
    // We need to match feedbacks to members. Ideally feedback records store userId or we check email/name
    // Assuming feedbacks have managerEmail matching User email
    // This part requires Application to be populated with ManagerFeedbacks

    // NOTE: Application model `managerFeedbacks` has `managerEmail`. We should match that with member User email.
    // This requires populating members.userId to get emails.
    await this.populate("members.userId");

    const memberEmails = this.members.map(m => m.userId.email.toLowerCase());

    const committeeFeedbacks = feedbacks.filter(f => memberEmails.includes(f.managerEmail.toLowerCase()));

    // Calculate Stats
    const scores = committeeFeedbacks
        .map(f => f.overallScore)
        .filter(s => s != null);

    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const recs = {
        recommend: committeeFeedbacks.filter(f => f.recommendation === "recommend").length,
        not_recommend: committeeFeedbacks.filter(f => f.recommendation === "not_recommend").length,
        pending: this.members.filter(m => m.status === "pending").length
    };

    this.votingResults.submittedCount = this.members.filter(m => m.status === "submitted").length;
    // totalMembers is already set
    this.votingResults.averageScore = parseFloat(avg.toFixed(1));
    this.votingResults.recommendations = recs;
    this.votingResults.lastCalculatedAt = new Date();

    // Determine Overall Recommendation
    if (this.settings.votingMechanism === "average") {
        this.votingResults.recommendation = avg >= 6 ? "hire" : "reject";
    } else if (this.settings.votingMechanism === "majority") {
        if (recs.recommend > recs.not_recommend) this.votingResults.recommendation = "hire";
        else if (recs.not_recommend > recs.recommend) this.votingResults.recommendation = "reject";
        else this.votingResults.recommendation = "pending";
    } else if (this.settings.votingMechanism === "consensus") {
        const hasRejects = recs.not_recommend > 0;
        const allRecommend = recs.recommend > 0 && recs.not_recommend === 0 && recs.pending === 0;
        if (allRecommend) this.votingResults.recommendation = "hire";
        else if (hasRejects && recs.pending === 0) this.votingResults.recommendation = "reject";
        else this.votingResults.recommendation = "pending";
    }
};

applicationCommitteeSchema.methods.markComplete = function () {
    this.status = "completed";
    this.completedAt = new Date();
};

applicationCommitteeSchema.methods.needsReminder = function () {
    if (this.status !== "active" || !this.settings.feedbackDeadline) return false;

    const now = new Date();
    const deadline = new Date(this.settings.feedbackDeadline);
    const threshold = new Date(deadline);
    threshold.setDate(threshold.getDate() - 2); // 2 days before

    return now >= threshold && now <= deadline;
};

// Statics
applicationCommitteeSchema.statics.createFromTemplate = async function (applicationId, committeeId) {
    const Committee = mongoose.model("Committee");
    const template = await Committee.findById(committeeId).populate("members.userId");

    if (!template) throw new Error("Committee template not found");

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (template.settings.feedbackDeadlineDays || 7));

    const members = template.members.map(m => ({
        userId: m.userId._id,
        role: m.role,
        status: "pending",
        reminderCount: 0
    }));

    return this.create({
        applicationId,
        committeeId,
        members,
        status: "active",
        votingResults: {
            totalMembers: members.length,
            submittedCount: 0
        },
        settings: {
            ...template.settings,
            feedbackDeadline: deadline
        }
    });
};

applicationCommitteeSchema.statics.findNeedingReminders = function () {
    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    return this.find({
        status: "active",
        "settings.feedbackDeadline": { $gte: now, $lte: twoDaysFromNow }
    }).populate("members.userId applicationId");
};

// Prevent model overwrite warning and force basic hot reload in dev
if (process.env.NODE_ENV !== 'production') delete mongoose.models.ApplicationCommittee;
export default mongoose.models.ApplicationCommittee || mongoose.model("ApplicationCommittee", applicationCommitteeSchema);
