import { sendEmail } from "../emailSender.js";
import EmailRoutingService from "../EmailRoutingService.js";
import { newApplicationAlertTemplate } from "../templates/admin/newApplicationAlert.js";
import { statusChangeAlertTemplate } from "../templates/admin/statusChangeAlert.js";
import EMAIL_CONFIG from "../config/emailConfig.js";

/**
 * Send New Application Alert to Internal Staff
 */
export const sendNewApplicationAlert = async ({ application, triggeredBy }) => {
    const alertType = "new_application";

    // 1. Resolve Recipients
    const recipients = await EmailRoutingService.getRecipientsForAlert(alertType, {
        department: application.jobId?.department,
        categoryId: application.jobId?.category,
        applicationId: application._id
    });

    if (!recipients.length) {
        console.log(`[InternalEmails] ⚠️ SKIPPING ${alertType}: No recipients resolved.`);
        return { success: true, recipients: 0 };
    }

    console.log(`[InternalEmails] 📨 Sending '${alertType}' to ${recipients.length} recipients: [${recipients.map(r => r.email).join(", ")}]`);

    // 2. Prepare Content
    const htmlContent = newApplicationAlertTemplate(application, {
        logoUrl: EMAIL_CONFIG.app.logoUrl,
        appUrl: EMAIL_CONFIG.app.url
    });

    // 3. Send Emails
    const results = [];
    if (process.env.NODE_ENV === 'development') {
        console.log(`[InternalEmails] 🐌 Dev Mode: Sending sequentially to avoid rate limits...`);
        for (const recipient of recipients) {
            const res = await sendEmail({
                to: recipient.email,
                subject: EMAIL_CONFIG.subjects.ar.NEW_APPLICATION_ALERT,
                html: htmlContent,
                toName: recipient.name,
                recipientType: EMAIL_CONFIG.recipientTypes.ADMIN,
                emailType: EMAIL_CONFIG.types.NEW_APPLICATION_ALERT,
                applicationId: application._id,
                triggeredBy
            });
            results.push(res);
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    } else {
        const promises = recipients.map(recipient =>
            sendEmail({
                to: recipient.email,
                subject: EMAIL_CONFIG.subjects.ar.NEW_APPLICATION_ALERT,
                html: htmlContent,
                toName: recipient.name,
                recipientType: EMAIL_CONFIG.recipientTypes.ADMIN,
                emailType: EMAIL_CONFIG.types.NEW_APPLICATION_ALERT,
                applicationId: application._id,
                triggeredBy
            })
        );
        const resolved = await Promise.all(promises);
        results.push(...resolved);
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`[InternalEmails] ✅ SUMMARY for '${alertType}': ${successful} sent, ${failed} failed.`);

    return { success: true, sentCount: successful };
};

// ==================== NEW ALERTS ====================

/**
 * Generic helper for status alerts
 */
const sendStatusAlert = async ({ application, triggeredBy, alertType, emailType, subject, title, message }) => {
    // 1. Resolve Recipients
    const recipients = await EmailRoutingService.getRecipientsForAlert(alertType, {
        department: application.jobId?.department,
        categoryId: application.jobId?.category,
        applicationId: application._id
    });

    if (!recipients.length) {
        console.log(`[InternalEmails] ⚠️ SKIPPING ${alertType}: No recipients resolved.`);
        return { success: true, recipients: 0 };
    }

    console.log(`[InternalEmails] 📨 Sending '${alertType}' to ${recipients.length} recipients: [${recipients.map(r => r.email).join(", ")}]`);

    // 2. Prepare Content
    const htmlContent = statusChangeAlertTemplate(application, {
        logoUrl: EMAIL_CONFIG.app.logoUrl,
        appUrl: EMAIL_CONFIG.app.url,
        title,
        message
    });

    // 3. Send
    // 3. Send
    const results = [];
    if (process.env.NODE_ENV === 'development') {
        // Sequential for Dev to avoid Rate Limits (2 req/sec)
        console.log(`[InternalEmails] 🐌 Dev Mode: Sending sequentially to avoid rate limits...`);
        for (const recipient of recipients) {
            const res = await sendEmail({
                to: recipient.email,
                subject: subject,
                html: htmlContent,
                toName: recipient.name,
                recipientType: EMAIL_CONFIG.recipientTypes.ADMIN,
                emailType: emailType,
                applicationId: application._id,
                triggeredBy
            });
            results.push(res);
            // Tiny delay
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    } else {
        // Parallel for Prod
        const promises = recipients.map(recipient =>
            sendEmail({
                to: recipient.email,
                subject: subject,
                html: htmlContent,
                toName: recipient.name,
                recipientType: EMAIL_CONFIG.recipientTypes.ADMIN,
                emailType: emailType,
                applicationId: application._id,
                triggeredBy
            })
        );
        const resolved = await Promise.all(promises);
        results.push(...resolved);
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`[InternalEmails] ✅ SUMMARY for '${alertType}': ${successful} sent, ${failed} failed.`);

    return { success: true, sentCount: successful };
};

export const sendInterviewScheduledAlert = async ({ application, triggeredBy }) => {
    const dateStr = new Date(application.interviewDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return sendStatusAlert({
        application,
        triggeredBy,
        alertType: 'interview_scheduled',
        emailType: EMAIL_CONFIG.types.INTERVIEW_SCHEDULED_ALERT,
        subject: EMAIL_CONFIG.subjects.ar.INTERVIEW_SCHEDULED_ALERT,
        title: "تم جدولة مقابلة",
        message: `تم تحديد موعد لمقابلة المرشح ${application.name} بتاريخ ${dateStr} الساعة ${application.interviewTime}.`
    });
};

export const sendInterviewRescheduledAlert = async ({ application, triggeredBy }) => {
    const dateStr = new Date(application.interviewDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return sendStatusAlert({
        application,
        triggeredBy,
        alertType: 'interview_rescheduled',
        emailType: EMAIL_CONFIG.types.INTERVIEW_RESCHEDULED_ALERT,
        subject: EMAIL_CONFIG.subjects.ar.INTERVIEW_RESCHEDULED_ALERT,
        title: "تحديث موعد المقابلة",
        message: `تم تغيير موعد مقابلة المرشح ${application.name} إلى ${dateStr} الساعة ${application.interviewTime}.`
    });
};

export const sendApplicationAcceptedAlert = async ({ application, triggeredBy }) => {
    return sendStatusAlert({
        application,
        triggeredBy,
        alertType: 'application_accepted',
        emailType: EMAIL_CONFIG.types.APPLICATION_ACCEPTED_ALERT,
        subject: EMAIL_CONFIG.subjects.ar.APPLICATION_ACCEPTED_ALERT,
        title: "تم قبول المرشح",
        message: `تم تغيير حالة طلب المرشح ${application.name} إلى (مقبول/Hired). يرجى البدء في إجراءات التعيين.`
    });
};

export const sendApplicationRejectedAlert = async ({ application, triggeredBy }) => {
    return sendStatusAlert({
        application,
        triggeredBy,
        alertType: 'application_rejected',
        emailType: EMAIL_CONFIG.types.APPLICATION_REJECTED_ALERT,
        subject: EMAIL_CONFIG.subjects.ar.APPLICATION_REJECTED_ALERT,
        title: "تم رفض الطلب",
        message: `تم تغيير حالة طلب المرشح ${application.name} إلى (مرفوض).`
    });
};
