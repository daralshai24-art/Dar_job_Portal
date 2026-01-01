// src/services/email/methods/managerEmails.js
/**
 * Manager Email Methods
 * All email methods related to managers/reviewers
 */

import { sendEmail, getEmailSettings } from "../emailSender.js";
import { connectDB } from "@/lib/db";
import FeedbackToken from "@/models/FeedbackToken";
import EMAIL_CONFIG from "../config/emailConfig.js";
import { feedbackRequestTemplate } from "../templates/manager/feedbackRequest.js";

/**
 * Send feedback request to manager
 */
export async function sendManagerFeedbackRequest({
  application,
  managerEmail,
  managerName,
  managerRole = "technical_reviewer",
  message = "",
  expiresInDays = 7,
  triggeredBy,
  metadata = {},
  applicationCommitteeId // [ADDED]
}) {
  try {
    await connectDB();

    // Create secure token
    const tokenDoc = await FeedbackToken.createToken({
      applicationId: application._id,
      managerEmail,
      managerName,
      managerRole,
      expiresInDays,
      createdBy: triggeredBy,
      applicationCommitteeId // [ADDED]
    });

    // Generate feedback URL
    const feedbackUrl = `${EMAIL_CONFIG.app.url}/feedback/${tokenDoc.token}`;

    // Get email settings
    const settings = await getEmailSettings();

    // Get email template
    const html = feedbackRequestTemplate({
      application,
      managerName,
      feedbackUrl,
      message,
      expiresInDays,
      logoUrl: settings.companyLogo,
    });

    const subject = `${EMAIL_CONFIG.subjects.ar.MANAGER_FEEDBACK_REQUEST} - ${EMAIL_CONFIG.subjects.en.MANAGER_FEEDBACK_REQUEST}`;

    // Send email
    const result = await sendEmail({
      to: managerEmail,
      toName: managerName,
      subject,
      html,
      applicationId: application._id,
      emailType: EMAIL_CONFIG.types.MANAGER_FEEDBACK_REQUEST,
      recipientType: EMAIL_CONFIG.recipientTypes.MANAGER,
      triggeredBy,
      metadata: {
        ...metadata, // Mix in passed metadata (like forceSend)
        tokenId: tokenDoc._id,
        managerRole,
        expiresAt: tokenDoc.expiresAt,
      },
    });

    // Update token with email sent time
    if (result.success) {
      tokenDoc.emailSentAt = new Date();
      await tokenDoc.save();
    }

    return { ...result, token: tokenDoc.token, feedbackUrl };
  } catch (error) {
    console.error("Manager feedback request error:", error);
    return { success: false, error: error.message };
  }
}

export default {
  sendManagerFeedbackRequest,
};