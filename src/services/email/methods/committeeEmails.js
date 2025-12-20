import { sendEmail } from "../emailSender.js";
import committeeCompletedTemplate from "../templates/committee/committeeCompleted.js";
import feedbackReceivedTemplate from "../templates/committee/feedbackReceived.js";
import Settings from "../../../models/settings.js";
import EMAIL_CONFIG from "../config/emailConfig.js";

/**
 * Fetch settings helper
 */
async function getSettings() {
    const settings = await Settings.findOne();
    return {
        appUrl: EMAIL_CONFIG.app.url,
        ...settings?.toObject()?.general,
        logoUrl: settings?.email?.logoUrl,
        companyName: settings?.general?.name || "Company"
    };
}

/**
 * Send Committee Completed Email
 */
export async function sendCommitteeCompleted({
    recipientEmail,
    recipientName,
    committee,
    application
}) {
    const settings = await getSettings();

    const html = committeeCompletedTemplate({
        settings,
        committee, // Expect fully populated
        application // Expect populated
    });

    return sendEmail({
        to: recipientEmail,
        subject: `اكتمال تقييم اللجنة - ${application.name} - Committee Evaluation Completed`,
        html,
        // Add necessary metadata for tracking
        applicationId: application._id,
        emailType: "committee_completed",
        recipientType: "hr"
    });
}

/**
 * Send Feedback Received Notification (To HR)
 */
export async function sendFeedbackReceivedNotification({
    recipientEmail,
    application,
    managerName,
    role
}) {
    const settings = await getSettings();

    const html = feedbackReceivedTemplate({
        settings,
        application,
        managerName,
        role,
        feedbackUrl: `${settings.appUrl}/admin/applications/${application._id}/reviews`
    });

    return sendEmail({
        to: recipientEmail,
        subject: `تقييم جديد مستلم - ${application.name}`,
        html,
        applicationId: application._id,
        emailType: "feedback_received_alert",
        recipientType: "hr"
    });
}


