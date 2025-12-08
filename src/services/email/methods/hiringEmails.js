import { sendEmail } from "../emailSender.js";
import newHiringRequestTemplate from "../templates/hiring/newHiringRequest.js";
import requestDecisionTemplate from "../templates/hiring/requestDecision.js";
import Settings from "../../../models/settings.js";

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
 * Send New Hiring Request Notification (to HR)
 */
export async function sendNewHiringRequest({
    recipientEmail,
    request // Populated
}) {
    const settings = await getSettings();
    const html = newHiringRequestTemplate({ settings, request });

    return sendEmail({
        to: recipientEmail,
        subject: `طلب توظيف جديد - ${request.positionTitle} - New Hiring Request`,
        html,
        emailType: "new_hiring_request",
        recipientType: "hr"
    });
}

/**
 * Send Request Decision Notification (to Manager)
 */
export async function sendHiringRequestDecision({
    recipientEmail,
    request, // Populated
    decision
}) {
    const settings = await getSettings();
    const html = requestDecisionTemplate({ settings, request, decision });

    return sendEmail({
        to: recipientEmail,
        subject: `تحديث حالة طلب التوظيف - ${request.positionTitle} - Hiring Request Update`,
        html,
        emailType: "hiring_request_decision",
        recipientType: "manager"
    });
}
