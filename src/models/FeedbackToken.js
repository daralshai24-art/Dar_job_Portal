// src/models/FeedbackToken.js
import mongoose from "mongoose";
import crypto from "crypto";
import "@/models/Application";
import "@/models/Job"
import "@/models/Category"
/**
 * FeedbackToken Model
 * Generates secure, time-limited tokens for manager feedback links
 * No login required - token provides access
 */
const feedbackTokenSchema = new mongoose.Schema(
  {
    // ==================== TOKEN ====================
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    
    // ==================== REFERENCE ====================
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true
    },
    
    // ==================== MANAGER INFO ====================
    managerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    managerName: {
      type: String,
      required: true
    },
    managerRole: {
      type: String,
      enum: ["technical_reviewer", "hr_reviewer", "hiring_manager", "department_head"],
      default: "technical_reviewer"
    },
    
    // ==================== TOKEN STATUS ====================
    isUsed: {
      type: Boolean,
      default: false,
      index: true
    },
    usedAt: {
      type: Date
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    
    // ==================== FEEDBACK TRACKING ====================
    feedbackSubmitted: {
      type: Boolean,
      default: false
    },
    feedbackSubmittedAt: {
      type: Date
    },
    
    // ==================== METADATA ====================
    emailSentAt: {
      type: Date
    },
    lastAccessedAt: {
      type: Date
    },
    accessCount: {
      type: Number,
      default: 0
    },
    
    // Who created this token (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { 
    timestamps: true 
  }
);

// ==================== INDEXES ====================
feedbackTokenSchema.index({ token: 1, expiresAt: 1 });
feedbackTokenSchema.index({ applicationId: 1, managerEmail: 1 });
feedbackTokenSchema.index({ isUsed: 1, expiresAt: 1 });

// ==================== STATIC METHODS ====================

/**
 * Generate a new secure token
 */
feedbackTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Create a new feedback token
 */
feedbackTokenSchema.statics.createToken = async function({
  applicationId,
  managerEmail,
  managerName,
  managerRole = "technical_reviewer",
  expiresInDays = 7,
  createdBy
}) {
  const token = this.generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  
  return this.create({
    token,
    applicationId,
    managerEmail,
    managerName,
    managerRole,
    expiresAt,
    createdBy
  });
};

/**
 * Verify and get token (checks expiry and usage)
 */
feedbackTokenSchema.statics.verifyToken = async function(token) {
  const feedbackToken = await this.findOne({ 
    token,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  }).populate({
    path: "applicationId",
    populate: {
      path: "jobId",
      select: "title location category",
      populate: { path: "category", select: "name" }
    }
  });
  
  if (!feedbackToken) {
    return { valid: false, reason: "invalid_or_expired" };
  }
  
  // Update access tracking
  feedbackToken.lastAccessedAt = new Date();
  feedbackToken.accessCount += 1;
  await feedbackToken.save();
  
  return { valid: true, token: feedbackToken };
};

/**
 * Mark token as used
 */
feedbackTokenSchema.methods.markAsUsed = async function() {
  this.isUsed = true;
  this.usedAt = new Date();
  this.feedbackSubmitted = true;
  this.feedbackSubmittedAt = new Date();
  return this.save();
};

/**
 * Check if token is valid
 */
feedbackTokenSchema.methods.isValid = function() {
  return !this.isUsed && this.expiresAt > new Date();
};

/**
 * Get expired tokens for cleanup
 */
feedbackTokenSchema.statics.getExpiredTokens = async function() {
  return this.find({
    expiresAt: { $lt: new Date() },
    isUsed: false
  });
};

export default mongoose.models.FeedbackToken || 
  mongoose.model("FeedbackToken", feedbackTokenSchema);