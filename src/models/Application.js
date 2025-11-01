  // src/models/Application.js
  import mongoose from "mongoose";

  const applicationSchema = new mongoose.Schema(
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
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

      createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
  );

  // Normalize before saving
  applicationSchema.pre("save", function(next) {
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

  export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
