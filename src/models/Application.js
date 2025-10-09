import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Job", 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String 
    },
    cv: {
      filename: String,
      originalName: String,
      path: String,
      size: Number
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "interview_scheduled", "interview_completed", "rejected", "hired"],
      default: "pending"
    },
    // HR Notes & Feedback
    hrNotes: String,
    technicalNotes: String,
    finalFeedback: String,
    
    // Interview Scheduling
    interviewDate: Date,
    interviewTime: String,
    interviewType: {
      type: String,
      enum: ["in_person", "online", "phone"],
      default: "in_person"
    },
    interviewLocation: String, // For online: meeting link, for in-person: address
    interviewNotes: String, // Notes before interview
    interviewFeedback: String, // Notes after interview
    
    // Interview Results
    interviewScore: Number, // 1-10 scale
    strengths: [String],
    weaknesses: [String],
    
    // Timeline
    timeline: [{
      action: String,
      status: String,
      notes: String,
      date: { type: Date, default: Date.now },
      performedBy: String // HR person name
    }],
    
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

//  THIS PRE-SAVE MIDDLEWARE FOR DATA NORMALIZATION (AFTER SCHEMA, BEFORE INDEXES)
applicationSchema.pre('save', function(next) {
  // Normalize email: lowercase and trim
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  
  // Normalize phone: remove all non-digit characters
  if (this.phone) {
    this.phone = this.phone.replace(/\D/g, '');
  }
  
  next();
});

applicationSchema.index({ jobId: 1, email: 1 });
applicationSchema.index({ jobId: 1, phone: 1 });

// Create index for better performance
applicationSchema.index({ jobId: 1, createdAt: -1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ interviewDate: 1 });

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);