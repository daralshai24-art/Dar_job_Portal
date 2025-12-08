import mongoose from "mongoose";

const hiringRequestSchema = new mongoose.Schema(
    {
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        department: {
            type: String,
            enum: ["HR", "IT", "Finance", "Operations", "Marketing", "Sales", "Other"],
            required: true,
            index: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        positionTitle: { type: String, required: true, trim: true },
        positionDescription: { type: String, required: true },
        requiredSkills: [String],

        experience: {
            type: String,
            enum: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
            default: "Mid Level"
        },
        employmentType: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
            default: "Full-time"
        },
        location: String,

        urgency: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
            index: true
        },
        justification: { type: String, required: true },

        budgetApproved: { type: Boolean, default: false },
        headcount: { type: Number, default: 1, min: 1 },
        expectedStartDate: Date,

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "in_review"],
            default: "pending",
            index: true
        },

        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewedAt: Date,
        reviewNotes: String,

        // Linked Job after approval
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }
    },
    { timestamps: true }
);

// Indexes
hiringRequestSchema.index({ status: 1, createdAt: -1 });
hiringRequestSchema.index({ department: 1, status: 1 });

// Methods
hiringRequestSchema.methods.approve = function (reviewerId, notes) {
    this.status = "approved";
    this.reviewedBy = reviewerId;
    this.reviewedAt = new Date();
    this.reviewNotes = notes;
    return this.save();
};

hiringRequestSchema.methods.reject = function (reviewerId, notes) {
    this.status = "rejected";
    this.reviewedBy = reviewerId;
    this.reviewedAt = new Date();
    this.reviewNotes = notes;
    return this.save();
};

hiringRequestSchema.methods.linkJob = function (jobId) {
    this.jobId = jobId;
    return this.save();
};

// Statics
hiringRequestSchema.statics.getPendingRequests = function () {
    return this.find({ status: "pending" })
        .populate("requestedBy", "name email department")
        .populate("category", "name")
        .sort({ urgency: -1, createdAt: 1 });
};

hiringRequestSchema.statics.getRequestsByDepartment = function (department) {
    return this.find({ department })
        .populate("requestedBy", "name")
        .populate("category", "name")
        .populate("reviewedBy", "name")
        .sort({ createdAt: -1 });
};

hiringRequestSchema.statics.getRequestsByUser = function (userId) {
    return this.find({ requestedBy: userId })
        .populate("category", "name")
        .populate("reviewedBy", "name")
        .sort({ createdAt: -1 });
};

export default mongoose.models.HiringRequest || mongoose.model("HiringRequest", hiringRequestSchema);
