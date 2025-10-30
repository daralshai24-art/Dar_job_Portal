// src/models/Timeline.js
import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true
    },
    action: { type: String, required: true },
    status: { type: String },
    notes: { type: String, trim: true },
    changes: { type: Array, default: [] },
    score: { type: Number },
    details: mongoose.Schema.Types.Mixed,
    date: { type: Date, default: Date.now },

    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    performedByName: { type: String, default: "System" }
  },
  { timestamps: true }
);

export default mongoose.models.Timeline || mongoose.model("Timeline", timelineSchema);
