// src/services/email/templates/index.js
/**
 * Templates Index
 * Central export for all email templates
 */

// Base templates
export { baseEmailTemplate } from "./base/baseTemplate.js";
export * as emailComponents from "./base/emailComponents.js";

// Applicant templates
export { applicationReceivedTemplate } from "./applicant/applicationReceived.js";
export { interviewScheduledTemplate } from "./applicant/interviewScheduled.js";
export { interviewRescheduledTemplate } from "./applicant/interviewRescheduled.js";
export { applicationRejectedTemplate } from "./applicant/applicationRejected.js";
export { applicationAcceptedTemplate } from "./applicant/applicationAccepted.js";

// Manager templates
export { feedbackRequestTemplate } from "./manager/feedbackRequest.js";

// Default export with all templates organized
export default {
  base: {
    baseEmailTemplate: require("./base/baseTemplate.js").baseEmailTemplate,
    components: require("./base/emailComponents.js"),
  },
  applicant: {
    applicationReceived: require("./applicant/applicationReceived.js").applicationReceivedTemplate,
    interviewScheduled: require("./applicant/interviewScheduled.js").interviewScheduledTemplate,
    interviewRescheduled: require("./applicant/interviewRescheduled.js").interviewRescheduledTemplate,
    applicationRejected: require("./applicant/applicationRejected.js").applicationRejectedTemplate,
    applicationAccepted: require("./applicant/applicationAccepted.js").applicationAcceptedTemplate,
  },
  manager: {
    feedbackRequest: require("./manager/feedbackRequest.js").feedbackRequestTemplate,
  },
};