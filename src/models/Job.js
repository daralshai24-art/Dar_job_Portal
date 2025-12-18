// models/Job.js
import mongoose from "mongoose";

import { JOB_DEPARTMENTS, JOB_TYPES, JOB_LEVELS } from "@/lib/constants";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "closed"],
      default: "draft"
    },
    department: {
      type: String,
      enum: JOB_DEPARTMENTS,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      default: "Full-time"
    },
    experience: {
      type: String,
      enum: JOB_LEVELS,
      default: "Entry Level"
    },
    requirements: { type: String, default: "" },

    // Applications tracking
    applicationsCount: { type: Number, default: 0 },
    lastApplicationDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", jobSchema);