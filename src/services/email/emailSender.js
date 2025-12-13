// [Modified] emailSender.js to support SMTP

import { Resend } from "resend";
import nodemailer from "nodemailer";
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
        provider: settings.email.provider || "resend",
        apiKey: settings.email.resendApiKey || EMAIL_CONFIG.provider.apiKey,
        smtp: {
          host: settings.email.smtpHost,
          port: settings.email.smtpPort,
          user: settings.email.smtpUsername,
          pass: settings.email.smtpPassword,
        },
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
    provider: "resend",
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
 * Send email functionality abstraction
 */
async function sendViaProvider(settings, { to, subject, html }) {
  // Option 1: Resend
  if (settings.provider === "resend") {
    if (!settings.apiKey) throw new Error("Missing Resend API Key");

    const resend = new Resend(settings.apiKey);
    const { data, error } = await resend.emails.send({
      from: `${settings.fromName} <${settings.fromEmail}>`,
      to,
      subject,
      html,
    });

    if (error) throw new Error(error.message);
    return data?.id;
  }

  // Option 2: SMTP
  if (settings.provider === "smtp") {
    if (!settings.smtp?.host) throw new Error("Missing SMTP Host");

    const transporter = nodemailer.createTransport({
      host: settings.smtp.host,
      port: settings.smtp.port || 587,
      secure: settings.smtp.port === 465, // true for 465, false for other ports
      auth: {
        user: settings.smtp.user,
        pass: settings.smtp.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to,
      subject,
      html,
    });

    return info.messageId;
  }

  throw new Error(`Unknown provider: ${settings.provider}`);
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
      console.error(`[EmailSender] ❌ VALIDATION FAILED for '${emailType}' to '${to}':`, validation.errors);
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(", ")}`,
      };
    }

    // Step 2: Check for duplicates
    // [MODIFIED] Unlimited emails requested by user - bypassing duplicate check
    /*
    if (!metadata?.forceSend) {
      const alreadySent = await wasEmailAlreadySent(applicationId, emailType, to);
      if (alreadySent) {
        console.log(`✓ Email already sent: ${emailType} to ${to}`);
        return { success: true, duplicate: true };
      }
    } else {
      console.log(`[EmailSender] Force send enabled for ${emailType} to ${to} - Bypassing duplicate check`);
    }
    */

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

    // Step 4: Send via provider
    console.log(`[Email Debug] Sending via ${settings.provider}...`);

    try {
      const messageId = await sendViaProvider(settings, { to, subject, html });

      await markEmailAsSent(notification._id, messageId);
      console.log(`✓ Email sent via ${settings.provider}: ${emailType} to ${to}`);

      return {
        success: true,
        messageId: messageId,
        notificationId: notification._id,
      };
    } catch (error) {
      await markEmailAsFailed(notification._id, error.message);
      console.error(`✗ Email failed: ${emailType} to ${to}`, error);
      return { success: false, error: error.message };
    }

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
    const messageId = await sendViaProvider(settings, { to, subject, html });
    return { success: true, messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default {
  sendEmail,
  sendEmailWithoutTracking,
  getEmailSettings,
};