import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { 
      type: String, 
      enum: ["draft", "active", "inactive", "closed"], 
      default: "draft" 
    },
    category: { type: String, default: "" },
    jobType: { 
      type: String, 
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      default: "Full-time" 
    },
    experience: { 
      type: String, 
      enum: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
      default: "Entry Level" 
    },
    requirements: { type: String, default: "" },
    
    //  Applications tracking
    applicationsCount: { type: Number, default: 0 },
    lastApplicationDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", jobSchema);