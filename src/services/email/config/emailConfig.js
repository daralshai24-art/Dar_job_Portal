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
    name: process.env.COMPANY_NAME || "شركتنا",
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
    },
    en: {
      APPLICATION_RECEIVED: "Application Received",
      INTERVIEW_SCHEDULED: "Interview Scheduled",
      INTERVIEW_RESCHEDULED: "Interview Rescheduled",
      APPLICATION_REJECTED: "Application Update",
      APPLICATION_ACCEPTED: "Congratulations!",
      MANAGER_FEEDBACK_REQUEST: "Candidate Feedback Request",
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