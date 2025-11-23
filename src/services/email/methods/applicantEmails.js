// src/services/email/methods/applicantEmails.js
/**
 * Applicant Email Methods
 * All email methods related to applicants
 */

import { sendEmail } from "../emailSender.js";
import EMAIL_CONFIG from "../config/emailConfig.js";
import { applicationReceivedTemplate } from "../templates/applicant/applicationReceived.js";
import { interviewScheduledTemplate } from "../templates/applicant/interviewScheduled.js";
import { interviewRescheduledTemplate } from "../templates/applicant/interviewRescheduled.js";
import { applicationRejectedTemplate } from "../templates/applicant/applicationRejected.js";
import { applicationAcceptedTemplate } from "../templates/applicant/applicationAccepted.js";

/**
 * Send application received confirmation
 */
export async function sendApplicationReceived({ application, triggeredBy }) {
  const html = applicationReceivedTemplate(application);
  const subject = `${EMAIL_CONFIG.subjects.ar.APPLICATION_RECEIVED} - ${EMAIL_CONFIG.subjects.en.APPLICATION_RECEIVED}`;

  return sendEmail({
    to: application.email,
    toName: application.name,
    subject,
    html,
    applicationId: application._id,
    emailType: EMAIL_CONFIG.types.APPLICATION_RECEIVED,
    recipientType: EMAIL_CONFIG.recipientTypes.APPLICANT,
    triggeredBy,
  });
}

/**
 * Send interview scheduled notification
 */
export async function sendInterviewScheduled({ application, triggeredBy }) {
  const html = interviewScheduledTemplate(application);
  const subject = `${EMAIL_CONFIG.subjects.ar.INTERVIEW_SCHEDULED} - ${EMAIL_CONFIG.subjects.en.INTERVIEW_SCHEDULED}`;

  return sendEmail({
    to: application.email,
    toName: application.name,
    subject,
    html,
    applicationId: application._id,
    emailType: EMAIL_CONFIG.types.INTERVIEW_SCHEDULED,
    recipientType: EMAIL_CONFIG.recipientTypes.APPLICANT,
    triggeredBy,
    metadata: {
      interviewDate: application.interviewDate,
      interviewTime: application.interviewTime,
      interviewType: application.interviewType,
    },
  });
}

/**
 * Send interview rescheduled notification
 */
export async function sendInterviewRescheduled({ application, triggeredBy }) {
  const html = interviewRescheduledTemplate(application);
  const subject = `${EMAIL_CONFIG.subjects.ar.INTERVIEW_RESCHEDULED} - ${EMAIL_CONFIG.subjects.en.INTERVIEW_RESCHEDULED}`;

  return sendEmail({
    to: application.email,
    toName: application.name,
    subject,
    html,
    applicationId: application._id,
    emailType: EMAIL_CONFIG.types.INTERVIEW_RESCHEDULED,
    recipientType: EMAIL_CONFIG.recipientTypes.APPLICANT,
    triggeredBy,
    metadata: {
      interviewDate: application.interviewDate,
      interviewTime: application.interviewTime,
    },
  });
}

/**
 * Send application rejected notification
 */
export async function sendApplicationRejected({ application, triggeredBy }) {
  const html = applicationRejectedTemplate(application);
  const subject = `${EMAIL_CONFIG.subjects.ar.APPLICATION_REJECTED} - ${EMAIL_CONFIG.subjects.en.APPLICATION_REJECTED}`;

  return sendEmail({
    to: application.email,
    toName: application.name,
    subject,
    html,
    applicationId: application._id,
    emailType: EMAIL_CONFIG.types.APPLICATION_REJECTED,
    recipientType: EMAIL_CONFIG.recipientTypes.APPLICANT,
    triggeredBy,
  });
}

/**
 * Send application accepted notification
 */
export async function sendApplicationAccepted({ application, triggeredBy }) {
  const html = applicationAcceptedTemplate(application);
  const subject = `${EMAIL_CONFIG.subjects.ar.APPLICATION_ACCEPTED} - ${EMAIL_CONFIG.subjects.en.APPLICATION_ACCEPTED}`;

  return sendEmail({
    to: application.email,
    toName: application.name,
    subject,
    html,
    applicationId: application._id,
    emailType: EMAIL_CONFIG.types.APPLICATION_ACCEPTED,
    recipientType: EMAIL_CONFIG.recipientTypes.APPLICANT,
    triggeredBy,
  });
}

export default {
  sendApplicationReceived,
  sendInterviewScheduled,
  sendInterviewRescheduled,
  sendApplicationRejected,
  sendApplicationAccepted,
};