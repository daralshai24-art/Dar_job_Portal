// src/services/email/index.js
/**
 * Email Service - Main Export (Facade Pattern)
 * Clean, simple API that hides complexity
 */

// Import all methods
import * as applicantEmails from "./methods/applicantEmails.js";
import * as managerEmails from "./methods/managerEmails.js";
import * as committeeEmails from "./methods/committeeEmails.js";

import * as hiringEmails from "./methods/hiringEmails.js";
import * as internalEmails from "./methods/internalEmails.js";

// Import utilities
import { sendEmail, sendEmailWithoutTracking } from "./emailSender.js";
import * as emailTracker from "./emailTracker.js";
import * as emailValidator from "./emailValidator.js";
import EMAIL_CONFIG from "./config/emailConfig.js";

/**
 * Email Service Class
 * Provides clean interface to all email functionality
 */
class EmailService {
  // ==================== APPLICANT EMAILS ====================

  sendApplicationReceived = applicantEmails.sendApplicationReceived;
  sendInterviewScheduled = applicantEmails.sendInterviewScheduled;
  sendInterviewRescheduled = applicantEmails.sendInterviewRescheduled;
  sendApplicationRejected = applicantEmails.sendApplicationRejected;
  sendApplicationAccepted = applicantEmails.sendApplicationAccepted;

  // ==================== MANAGER EMAILS ====================

  sendManagerFeedbackRequest = managerEmails.sendManagerFeedbackRequest;

  // ==================== COMMITTEE EMAILS ====================

  sendCommitteeCompleted = committeeEmails.sendCommitteeCompleted;

  // ==================== HIRING EMAILS ====================

  sendNewHiringRequest = hiringEmails.sendNewHiringRequest;
  sendHiringRequestDecision = hiringEmails.sendHiringRequestDecision;

  // ==================== INTERNAL ALERTS ====================

  sendNewApplicationAlert = internalEmails.sendNewApplicationAlert;
  sendInterviewScheduledAlert = internalEmails.sendInterviewScheduledAlert;
  sendInterviewRescheduledAlert = internalEmails.sendInterviewRescheduledAlert;
  sendApplicationAcceptedAlert = internalEmails.sendApplicationAcceptedAlert;
  sendApplicationRejectedAlert = internalEmails.sendApplicationRejectedAlert;

  // ==================== UTILITIES ====================

  // Core sending
  sendEmail = sendEmail;
  sendEmailWithoutTracking = sendEmailWithoutTracking;

  // Tracking
  wasEmailAlreadySent = emailTracker.wasEmailAlreadySent;
  getEmailStats = emailTracker.getEmailStats;
  getFailedEmails = emailTracker.getFailedEmails;

  // Validation
  validateEmail = emailValidator.validateEmailAddress;
  validateEmailPayload = emailValidator.validateEmailPayload;

  // Configuration
  config = EMAIL_CONFIG;
  emailTypes = EMAIL_CONFIG.types;
  recipientTypes = EMAIL_CONFIG.recipientTypes;
}

// Export singleton instance
const emailService = new EmailService();

export default emailService;

// Also export individual functions for tree-shaking
export {
  applicantEmails,
  managerEmails,
  committeeEmails,

  hiringEmails,
  internalEmails,

  sendEmail,
  sendEmailWithoutTracking,

  emailTracker,
  emailValidator,
  EMAIL_CONFIG,
};