// src/services/email/config/emailConfig.js
/**
 * Email Service Configuration
 * Centralized configuration for all email-related settings
 */

export const EMAIL_CONFIG = {
  // Provider settings
  provider: {
    name: "resend",
    apiKey: process.env.RESEND_API_KEY,
  },

  // Sender information
  sender: {
    email: process.env.FROM_EMAIL || "noreply@resend.dev",
    name: process.env.COMPANY_NAME || "شركتنا",
  },

  // Application settings
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    name: process.env.COMPANY_NAME || "شركة دار الشاي العربي للتجارة",
    logoUrl: process.env.COMPANY_LOGO_URL || "",
  },

  // Email types (for tracking)
  types: {
    // Applicant emails
    APPLICATION_RECEIVED: "application_received",
    INTERVIEW_SCHEDULED: "interview_scheduled",
    INTERVIEW_RESCHEDULED: "interview_rescheduled",
    INTERVIEW_REMINDER: "interview_reminder",
    APPLICATION_REJECTED: "application_rejected",
    APPLICATION_ACCEPTED: "application_accepted",

    // Manager emails
    MANAGER_FEEDBACK_REQUEST: "manager_feedback_request",
    MANAGER_FEEDBACK_REMINDER: "manager_feedback_reminder",

    // Internal emails
    NEW_APPLICATION_ALERT: "new_application_alert",
    HIRING_REQUEST_ALERT: "hiring_request_alert",
    INTERVIEW_SCHEDULED_ALERT: "interview_scheduled_alert",
    INTERVIEW_RESCHEDULED_ALERT: "interview_rescheduled_alert",
    APPLICATION_ACCEPTED_ALERT: "application_accepted_alert",
    APPLICATION_REJECTED_ALERT: "application_rejected_alert",
  },

  // Recipient types
  recipientTypes: {
    APPLICANT: "applicant",
    MANAGER: "manager",
    ADMIN: "admin",
  },

  // Email subjects (can be customized)
  subjects: {
    ar: {
      APPLICATION_RECEIVED: "تم استلام طلبك",
      INTERVIEW_SCHEDULED: "تم جدولة المقابلة",
      INTERVIEW_RESCHEDULED: "تم تغيير موعد المقابلة",
      APPLICATION_REJECTED: "تحديث حول طلبك",
      APPLICATION_ACCEPTED: "مبروك! تم قبول طلبك",
      MANAGER_FEEDBACK_REQUEST: "طلب تقييم مرشح",
      NEW_APPLICATION_ALERT: "تنبيه: طلب توظيف جديد",
      HIRING_REQUEST_ALERT: "طلب احتياج وظيفي جديد",
      INTERVIEW_SCHEDULED_ALERT: "تنبيه: تم جدولة مقابلة",
      INTERVIEW_RESCHEDULED_ALERT: "تنبيه: تحديث موعد مقابلة",
      APPLICATION_ACCEPTED_ALERT: "تنبيه: تم قبول مرشح",
      APPLICATION_REJECTED_ALERT: "تنبيه: تم رفض طلب",
    },
    en: {
      APPLICATION_RECEIVED: "Application Received",
      INTERVIEW_SCHEDULED: "Interview Scheduled",
      INTERVIEW_RESCHEDULED: "Interview Rescheduled",
      APPLICATION_REJECTED: "Application Update",
      APPLICATION_ACCEPTED: "Congratulations!",
      MANAGER_FEEDBACK_REQUEST: "Candidate Feedback Request",
      NEW_APPLICATION_ALERT: "New Job Application",
      HIRING_REQUEST_ALERT: "New Hiring Request",
      INTERVIEW_SCHEDULED_ALERT: "Interview Scheduled Alert",
      INTERVIEW_RESCHEDULED_ALERT: "Interview Updated Alert",
      APPLICATION_ACCEPTED_ALERT: "Candidate Hired Alert",
      APPLICATION_REJECTED_ALERT: "Application Rejected Alert",
    },
  },

  // Retry settings (for failed emails)
  retry: {
    maxAttempts: 3,
    delayMs: 5000, // 5 seconds
  },

  // Timeout settings
  timeout: {
    sendEmail: 10000, // 10 seconds
  },
};

// Export individual configs for convenience
export const { types: EMAIL_TYPES, recipientTypes: RECIPIENT_TYPES } = EMAIL_CONFIG;

export default EMAIL_CONFIG;