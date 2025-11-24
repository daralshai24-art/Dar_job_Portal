// src/services/email/emailSender.js
/**
 * Email Sender
 * Core logic for sending emails via provider (Resend)
 */

import { Resend } from "resend";
import EMAIL_CONFIG from "./config/emailConfig.js";
import { validateEmailPayload } from "./emailValidator.js";
import {
  wasEmailAlreadySent,
  createEmailNotification,
  markEmailAsSent,
  markEmailAsFailed,
} from "./emailTracker.js";

// Initialize Resend provider
const resend = new Resend(EMAIL_CONFIG.provider.apiKey);

/**
 * Send email with full tracking and validation
 */
export async function sendEmail({
  to,
  toName,
  subject,
  html,
  applicationId,
  emailType,
  recipientType,
  triggeredBy = null,
  metadata = {},
}) {
  try {
    // Step 1: Validate payload
    const validation = validateEmailPayload({
      to,
      toName,
      subject,
      html,
      emailType,
      recipientType,
    });

    if (!validation.valid) {
      console.error("Email validation failed:", validation.errors);
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(", ")}`,
      };
    }

    // Step 2: Check for duplicates
    const alreadySent = await wasEmailAlreadySent(applicationId, emailType, to);
    if (alreadySent) {
      console.log(`✓ Email already sent: ${emailType} to ${to}`);
      return { success: true, duplicate: true };
    }

    // Step 3: Create tracking record
    const notification = await createEmailNotification({
      applicationId,
      recipientEmail: to,
      recipientName: toName,
      recipientType,
      emailType,
      subject,
      triggeredBy,
      metadata,
    });

    // Step 4: Send via provider (Resend)
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.sender.email,
      to,
      subject,
      html,
    });

    // Step 5: Handle result
    if (error) {
      await markEmailAsFailed(notification._id, error.message);
      console.error(`✗ Email failed: ${emailType} to ${to}`, error);
      return { success: false, error: error.message };
    }

    await markEmailAsSent(notification._id, data?.id);
    console.log(`✓ Email sent: ${emailType} to ${to}`);
    
    return {
      success: true,
      messageId: data?.id,
      notificationId: notification._id,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send email without tracking (for testing purposes)
 */
export async function sendEmailWithoutTracking({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.sender.email,
      to,
      subject,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default {
  sendEmail,
  sendEmailWithoutTracking,
};