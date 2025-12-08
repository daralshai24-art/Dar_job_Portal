// src/models/Application.js (UPDATED VERSION)
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    city: { type: String, required: true },
    cv: {
      filename: String,
      originalName: String,
      path: String,
      size: Number
    },

    // status & rejection
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "interview_scheduled",
        "interview_completed",
        "rejected",
        "hired"
      ],
      default: "pending"
    },
    rejectionReason: { type: String, trim: true },

    // feedback & notes
    hrNotes: String,
    technicalNotes: String,
    finalFeedback: String,

    // ==================== NEW: Manager Feedbacks ====================
    managerFeedbacks: [{
      managerName: String,
      managerEmail: String,
      managerRole: {
        type: String,
        enum: ["technical_reviewer", "hr_reviewer", "hiring_manager", "department_head"]
      },
      technicalNotes: String,
      strengths: [String],
      weaknesses: [String],
      recommendation: {
        type: String,
        enum: ["recommend", "not_recommend", "pending"]
      },
      overallScore: Number,
      submittedAt: Date
    }],

    // interview info
    interviewDate: Date,
    interviewTime: String,
    interviewType: {
      type: String,
      enum: ["in_person", "online", "phone"],
      default: "in_person"
    },
    interviewLocation: String,
    interviewNotes: String,
    interviewFeedback: String,

    // interview results
    interviewScore: Number,
    strengths: [String],
    weaknesses: [String],

    // ==================== NEW: Committee Info (Denormalized) ====================
    applicationCommitteeId: { type: mongoose.Schema.Types.ObjectId, ref: "ApplicationCommittee" },
    committeeStatus: {
      totalMembers: Number,
      feedbacksReceived: Number,
      averageScore: Number,
      recommendation: String,
      lastFeedbackAt: Date
    },

    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Normalize before saving
applicationSchema.pre("save", function (next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
  if (this.phone) this.phone = this.phone.replace(/\D/g, "");
  next();
});

// Indexes
applicationSchema.index({ jobId: 1, email: 1 });
applicationSchema.index({ jobId: 1, phone: 1 });
applicationSchema.index({ jobId: 1, createdAt: -1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ interviewDate: 1 });
applicationSchema.index({ applicationCommitteeId: 1 });

// ==================== VIRTUAL FIELDS ====================
applicationSchema.virtual("hasManagerFeedback").get(function () {
  return this.managerFeedbacks && this.managerFeedbacks.length > 0;
});

applicationSchema.virtual("averageFeedbackScore").get(function () {
  if (!this.managerFeedbacks || this.managerFeedbacks.length === 0) return null;

  const scores = this.managerFeedbacks
    .map(f => f.overallScore)
    .filter(s => s !== null && s !== undefined);

  if (scores.length === 0) return null;

  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
});

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);