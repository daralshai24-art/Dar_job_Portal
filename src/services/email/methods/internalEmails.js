// src/services/email/methods/internalEmails.js
import { sendEmail, getEmailSettings } from "../emailSender.js";
import emailRoutingService from "../EmailRoutingService.js";
import { newApplicationAlertTemplate } from "../templates/admin/newApplicationAlert.js";

/**
 * Alert internal staff about a new application
 * Logic:
 * 1. Checks Notification Rules in Settings
 * 2. Checks Individual Preferences (Opt-out)
 * 3. Batches sends
 */
export async function sendNewApplicationAlert({ application, triggeredBy }) {
    const settings = await getEmailSettings();

    // 1. Resolve Recipients
    const recipients = await emailRoutingService.getRecipientsForAlert(
        "new_application",
        {
            application,
            department: application.jobId?.department
        }
    );

    if (recipients.length === 0) {
        console.log("No recipients found for new_application alert");
        return { success: true, count: 0 };
    }

    // 2. Prepare content
    const html = newApplicationAlertTemplate(application, {
        logoUrl: settings.companyLogo,
        appUrl: settings.appUrl
    });

    const subject = `[تنبيه] طلب توظيف جديد: ${application.jobId?.title}`;

    // 3. Batched Sending
    // Note: We send individually to ensure privacy and correct unsubscribe links per user if we added them later
    const results = await Promise.all(recipients.map(recipient =>
        sendEmail({
            to: recipient.email,
            toName: recipient.name,
            subject,
            html,
            applicationId: application._id,
            emailType: "new_application_alert", // tracking code
            recipientType: "admin", // generic type for staff
            metadata: { role: recipient.role }
        })
    ));

    const successCount = results.filter(r => r.success).length;

    console.log(`[InternalEmails] Sent new_application alert to ${successCount}/${recipients.length} admins/managers`);

    return { success: true, count: successCount, total: recipients.length };
}

export default {
    sendNewApplicationAlert
};
