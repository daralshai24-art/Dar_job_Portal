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
import Settings from "@/models/settings";
import { connectDB } from "@/lib/db";

/**
 * Get email settings from DB or fallback to config
 */
export async function getEmailSettings() {
  try {
    await connectDB();
    const settings = await Settings.findOne();

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

    if (settings && settings.email) {
      return {
        apiKey: settings.email.resendApiKey || EMAIL_CONFIG.provider.apiKey,
        fromEmail: settings.email.fromEmail || EMAIL_CONFIG.sender.email,
        fromName: settings.email.fromName || EMAIL_CONFIG.sender.name,
        companyLogo:
          settings.email.companyLogo ||
          `${appUrl}/images/logo-darelshai.png`,
        appUrl,
      };
    }
  } catch (error) {
    console.error("Error fetching email settings:", error);
  }

  const fallbackAppUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

  return {
    apiKey: EMAIL_CONFIG.provider.apiKey,
    fromEmail: EMAIL_CONFIG.sender.email,
    fromName: EMAIL_CONFIG.sender.name,
    companyLogo:
      process.env.COMPANY_LOGO_URL ||
      `${fallbackAppUrl}/images/logo-darelshai.png`,
    appUrl: fallbackAppUrl,
  };
}


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
    // Step 0: Get Settings
    const settings = await getEmailSettings();

    if (!settings.apiKey) {
      return {
        success: false,
        error: "Email service not configured (missing API Key)",
      };
    }

    const resend = new Resend(settings.apiKey);

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
    console.log(`[Email Debug] Sending email...`);
    console.log(`[Email Debug] API Key starts with: ${settings.apiKey?.substring(0, 5)}...`);
    console.log(`[Email Debug] From: ${settings.fromName} <${settings.fromEmail}>`);
    console.log(`[Email Debug] To: ${to}`);

    const { data, error } = await resend.emails.send({
      from: `${settings.fromName} <${settings.fromEmail}>`,
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
    const settings = await getEmailSettings();

    if (!settings.apiKey) {
      return { success: false, error: "Missing API Key" };
    }

    const resend = new Resend(settings.apiKey);

    const { data, error } = await resend.emails.send({
      from: `${settings.fromName} <${settings.fromEmail}>`,
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
  getEmailSettings,
};