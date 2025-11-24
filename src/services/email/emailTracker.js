// src/services/email/emailTracker.js
/**
 * Email Tracker
 * Handles email notification tracking in database
 */

import { connectDB } from "@/lib/db";
import EmailNotification from "@/models/EmailNotification";

/**
 * Check if email was already sent
 */
export async function wasEmailAlreadySent(applicationId, emailType, recipientEmail) {
  try {
    await connectDB();
    return await EmailNotification.wasAlreadySent(
      applicationId,
      emailType,
      recipientEmail
    );
  } catch (error) {
    console.error("Error checking email status:", error);
    return false; // Fail open - allow sending
  }
}

/**
 * Create email notification record
 */
export async function createEmailNotification({
  applicationId,
  recipientEmail,
  recipientName,
  recipientType,
  emailType,
  subject,
  triggeredBy,
  metadata = {},
}) {
  try {
    await connectDB();
    
    return await EmailNotification.create({
      applicationId,
      recipientEmail,
      recipientName,
      recipientType,
      emailType,
      subject,
      status: "pending",
      triggeredBy,
      metadata,
    });
  } catch (error) {
    console.error("Error creating email notification:", error);
    throw error;
  }
}

/**
 * Mark email as sent
 */
export async function markEmailAsSent(notificationId, providerMessageId) {
  try {
    await connectDB();
    
    const notification = await EmailNotification.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.status = "sent";
    notification.sentAt = new Date();
    notification.providerMessageId = providerMessageId;
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error marking email as sent:", error);
    throw error;
  }
}

/**
 * Mark email as failed
 */
export async function markEmailAsFailed(notificationId, errorMessage) {
  try {
    await connectDB();
    
    const notification = await EmailNotification.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.status = "failed";
    notification.failedAt = new Date();
    notification.errorMessage = errorMessage;
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error marking email as failed:", error);
    throw error;
  }
}

/**
 * Get failed emails for retry
 */
export async function getFailedEmails(limit = 100) {
  try {
    await connectDB();
    return await EmailNotification.getFailedEmails(limit);
  } catch (error) {
    console.error("Error getting failed emails:", error);
    return [];
  }
}

/**
 * Get email statistics for an application
 */
export async function getEmailStats(applicationId) {
  try {
    await connectDB();
    
    const stats = await EmailNotification.aggregate([
      { $match: { applicationId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error getting email stats:", error);
    return {};
  }
}

export default {
  wasEmailAlreadySent,
  createEmailNotification,
  markEmailAsSent,
  markEmailAsFailed,
  getFailedEmails,
  getEmailStats,
};