// src/models/EmailNotification.js
import mongoose from "mongoose";

/**
 * EmailNotification Model
 * Tracks all emails sent from the system
 * Helps with debugging, auditing, and preventing duplicate sends
 */
const emailNotificationSchema = new mongoose.Schema(
  {
    // ==================== REFERENCE ====================
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true
    },

    // ==================== EMAIL DETAILS ====================
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    recipientName: {
      type: String,
      required: true
    },
    recipientType: {
      type: String,
      enum: ["applicant", "manager", "admin"],
      required: true
    },

    // ==================== EMAIL CONTENT ====================
    emailType: {
      type: String,
      enum: [
        // Applicant notifications
        "application_received",
        "application_under_review",
        "interview_scheduled",
        "interview_rescheduled",
        "interview_reminder",
        "application_rejected",
        "application_accepted",

        // Manager notifications
        "manager_feedback_request",
        "manager_feedback_reminder",

        // Internal notifications
        "new_application_alert",
        "hiring_request_alert",
        "interview_scheduled_alert",
        "interview_rescheduled_alert",
        "application_accepted_alert",
        "application_rejected_alert"
      ],
      required: true,
      index: true
    },
    subject: {
      type: String,
      required: true
    },

    // ==================== DELIVERY STATUS ====================
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "bounced"],
      default: "pending",
      index: true
    },
    sentAt: {
      type: Date
    },
    failedAt: {
      type: Date
    },
    errorMessage: {
      type: String
    },

    // ==================== PROVIDER INFO ====================
    provider: {
      type: String,
      default: "resend"
    },
    providerMessageId: {
      type: String  // Resend's message ID for tracking
    },

    // ==================== METADATA ====================
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // Who triggered this email
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

// ==================== INDEXES ====================
emailNotificationSchema.index({ applicationId: 1, emailType: 1 });
emailNotificationSchema.index({ recipientEmail: 1, createdAt: -1 });
emailNotificationSchema.index({ status: 1, emailType: 1 });

// ==================== STATIC METHODS ====================

/**
 * Check if a specific email type was already sent
 */
emailNotificationSchema.statics.wasAlreadySent = async function (
  applicationId,
  emailType,
  recipientEmail
) {
  /*
   * Allow specific types to be sent multiple times (e.g. Rescheduling)
   */
  const repeatableTypes = [
    "interview_rescheduled",
    "interview_rescheduled_alert",
    "manager_feedback_reminder",
    "interview_reminder"
  ];

  if (repeatableTypes.includes(emailType)) {
    return false; // Always allow sending these
  }

  const sent = await this.findOne({
    applicationId,
    emailType,
    recipientEmail,
    status: "sent"
  });
  return !!sent;
};

/**
 * Get failed emails that need retry
 */
emailNotificationSchema.statics.getFailedEmails = async function (limit = 100) {
  return this.find({
    status: "failed",
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24h
  })
    .limit(limit)
    .sort({ createdAt: -1 });
};

export default mongoose.models.EmailNotification ||
  mongoose.model("EmailNotification", emailNotificationSchema);