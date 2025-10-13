// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
      trim: true
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", categorySchema);