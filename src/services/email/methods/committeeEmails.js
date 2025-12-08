import { sendEmail } from "../emailSender.js";
import committeeCompletedTemplate from "../templates/committee/committeeCompleted.js";
import { getEmailSettings } from "../../../models/settings.js"; // or wherever it is
import Settings from "../../../models/settings.js"; // Direct model access if helper not available

/**
 * Fetch settings helper
 */
async function getSettings() {
    const settings = await Settings.findOne();
    return {
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
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
