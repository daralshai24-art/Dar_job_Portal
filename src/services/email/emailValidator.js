// src/services/email/emailValidator.js
/**
 * Email Validator
 * Validates email inputs before sending
 */

/**
 * Validate email address format
 */
export function validateEmailAddress(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
}

/**
 * Validate email subject
 */
export function validateSubject(subject) {
  if (!subject || typeof subject !== "string") {
    return { valid: false, error: "Subject is required" };
  }

  if (subject.length < 3) {
    return { valid: false, error: "Subject too short" };
  }

  if (subject.length > 200) {
    return { valid: false, error: "Subject too long (max 200 chars)" };
  }

  return { valid: true };
}

/**
 * Validate HTML content
 */
export function validateHtmlContent(html) {
  if (!html || typeof html !== "string") {
    return { valid: false, error: "HTML content is required" };
  }

  if (html.length < 50) {
    return { valid: false, error: "HTML content too short" };
  }

  return { valid: true };
}

/**
 * Validate complete email payload
 */
export function validateEmailPayload({
  to,
  toName,
  subject,
  html,
  emailType,
  recipientType,
}) {
  const errors = [];

  // Validate email
  const emailValidation = validateEmailAddress(to);
  if (!emailValidation.valid) {
    errors.push(emailValidation.error);
  }

  // Validate subject
  const subjectValidation = validateSubject(subject);
  if (!subjectValidation.valid) {
    errors.push(subjectValidation.error);
  }

  // Validate HTML
  const htmlValidation = validateHtmlContent(html);
  if (!htmlValidation.valid) {
    errors.push(htmlValidation.error);
  }

  // Validate recipient name
  if (!toName || typeof toName !== "string") {
    errors.push("Recipient name is required");
  }

  // Validate email type
  if (!emailType || typeof emailType !== "string") {
    errors.push("Email type is required");
  }

  // Validate recipient type
  if (!recipientType || typeof recipientType !== "string") {
    errors.push("Recipient type is required");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

export default {
  validateEmailAddress,
  validateSubject,
  validateHtmlContent,
  validateEmailPayload,
};