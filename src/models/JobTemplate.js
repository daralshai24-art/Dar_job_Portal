import mongoose from "mongoose";
import { JOB_DEPARTMENTS, JOB_LEVELS, JOB_TYPES } from "@/lib/constants";

const jobTemplateSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true, trim: true },

        // Categorization
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

        // Job Details
        description: { type: String, required: true }, // Rich text
        requirements: { type: String, required: true }, // Rich text (e.g. lists, formatting)
        skills: [String], // Array of strings for tagging/filtering

        // Defaults to pre-fill
        jobType: {
            type: String,
            enum: JOB_TYPES,
            default: "Full-time"
        },
        experience: {
            type: String,
            enum: JOB_LEVELS,
            default: "Mid Level"
        },

        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.models.JobTemplate || mongoose.model("JobTemplate", jobTemplateSchema);
