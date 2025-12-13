/**
 * Hiring Request Email Methods
 */

import { sendEmail, getEmailSettings } from "../emailSender.js";
import EMAIL_CONFIG from "../config/emailConfig.js";
import { hiringRequestTemplate } from "../templates/internal/hiringRequest.js";
// We don't have a specific decision template yet, using a simple HTML fallback or we can add one later.
// For now, I'll keep the import but comment it out or leave it if I create it.
// To avoid errors, I'll implement a basic decision logical here or create a template.
// Let's create a basic inline HTML for decision for now to save time, or use the existing placeholder if valid.

/**
 * Send New Hiring Request Notification (to HR)
 */
export async function sendNewHiringRequest({
    recipientEmail,
    request,
    triggeredBy
}) {
    const settings = await getEmailSettings();

    const html = hiringRequestTemplate({
        requesterName: request.requestedBy.name,
        positionTitle: request.positionTitle,
        department: request.department,
        requestUrl: `${settings.appUrl}/admin/hiring-requests?id=${request._id}`,
        justification: request.justification,
        urgency: request.urgency,
        logoUrl: settings.companyLogo
    });

    const subject = `${EMAIL_CONFIG.subjects.ar.HIRING_REQUEST_ALERT || "طلب توظيف جديد"} - ${EMAIL_CONFIG.subjects.en.HIRING_REQUEST_ALERT || "New Hiring Request"}`;

    return sendEmail({
        to: recipientEmail,
        toName: "HR Team",
        subject,
        html,
        emailType: "hiring_request", // Updated to match likely config
        recipientType: "admin",
        triggeredBy,
        metadata: {
            requestId: request._id,
            department: request.department
        }
    });
}

/**
 * Send Request Decision Notification (to Manager)
 */
export async function sendHiringRequestDecision({
    recipientEmail,
    request,
    decision,
    triggeredBy
}) {
    const settings = await getEmailSettings();
    const subject = decision === 'approved'
        ? "تم الموافقة على طلب التوظيف - Hiring Request Approved"
        : "تم رفض طلب التوظيف - Hiring Request Rejected";

    const color = decision === 'approved' ? '#10b981' : '#ef4444';
    const statusText = decision === 'approved' ? 'Approved - تمت الموافقة' : 'Rejected - تم الرفض';

    const html = `
    <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: ${color}">${statusText}</h2>
        <p>طلب الاحتياج الوظيفي الخاص بك: <strong>${request.positionTitle}</strong></p>
        <p>الحالة الجديدة: <strong>${decision}</strong></p>
        ${request.reviewNotes ? `<p>ملاحظات: ${request.reviewNotes}</p>` : ''}
        <p><a href="${settings.appUrl}/dashboard/hiring-requests">عرض التفاصيل</a></p>
    </div>
    `;

    const recipientType = request.requestedBy?.role || 'user';
    const toName = request.requestedBy?.name || 'Manager';

    return sendEmail({
        to: recipientEmail,
        toName: toName,
        subject,
        html,
        emailType: "hiring_request_decision",
        recipientType: recipientType,
        triggeredBy,
        metadata: {
            requestId: request._id,
            decision
        }
    });
}

export default {
    sendNewHiringRequest,
    sendHiringRequestDecision
};
