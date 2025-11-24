// src/services/email/templates/base/emailComponents.js
/**
 * Reusable Email Components
 * DRY principle - build emails from reusable parts
 */

import EMAIL_CONFIG from "../../config/emailConfig.js";

/**
 * Email Header Component
 */
export function emailHeader({ gradient, icon, title, subtitle }) {
  return `
    <tr>
      <td style="background: ${gradient}; padding: 40px 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">${icon}</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">${title}</h1>
        <p style="color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 16px;">${subtitle}</p>
      </td>
    </tr>
  `;
}

/**
 * Email Footer Component
 */
export function emailFooter({ companyName = EMAIL_CONFIG.app.name }) {
  return `
    <tr>
      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
          ${companyName}
        </p>
        <p style="margin: 0; color: #a0aec0; font-size: 13px;">
          هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه
        </p>
      </td>
    </tr>
  `;
}

/**
 * Greeting Component
 */
export function greeting(name, color = "#667eea") {
  return `
    <p style="font-size: 18px; color: #1a202c; line-height: 1.6; margin: 0 0 20px 0;">
      عزيزي/عزيزتي <strong style="color: ${color};">${name}</strong>،
    </p>
  `;
}

/**
 * Info Card Component
 */
export function infoCard({ title, items, borderColor = "#667eea" }) {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="color: #718096; font-size: 14px; padding: 8px 0;"><strong>${item.label}:</strong></td>
      <td style="color: #2d3748; font-size: 14px; text-align: left; padding: 8px 0;">${item.value}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-right: 4px solid ${borderColor};">
      <h3 style="margin: 0 0 20px 0; color: ${borderColor}; font-size: 20px; font-weight: 600;">${title}</h3>
      <table width="100%" cellpadding="8" cellspacing="0">
        ${rows}
      </table>
    </div>
  `;
}

/**
 * Highlighted Box Component
 */
export function highlightedBox({ gradient, title, content }) {
  return `
    <div style="background: ${gradient}; padding: 30px; border-radius: 16px; margin: 35px 0; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
      <h2 style="color: white; margin: 0 0 25px 0; font-size: 22px; text-align: center; font-weight: 600;">${title}</h2>
      ${content}
    </div>
  `;
}

/**
 * Info Item Component (for use inside highlighted box)
 */
export function infoItem({ label, value, icon = "" }) {
  return `
    <div style="background-color: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 20px; border-radius: 12px; margin-bottom: 15px;">
      <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 5px;">${label}</p>
      <p style="margin: 0; color: white; font-size: 20px; font-weight: 600;">${icon} ${value}</p>
    </div>
  `;
}

/**
 * Alert Box Component
 */
export function alertBox({ type = "info", title, content }) {
  const styles = {
    info: {
      bg: "#ebf4ff",
      border: "#bee3f8",
      color: "#2c5282",
    },
    warning: {
      bg: "#fffbeb",
      border: "#fbbf24",
      color: "#92400e",
    },
    success: {
      bg: "#e6fffa",
      border: "#319795",
      color: "#134e4a",
    },
  };

  const style = styles[type] || styles.info;

  return `
    <div style="background-color: ${style.bg}; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid ${style.border};">
      <h3 style="margin: 0 0 15px 0; color: ${style.color}; font-size: 18px; font-weight: 600;">${title}</h3>
      <div style="margin: 0; color: ${style.color}; font-size: 15px; line-height: 1.8;">${content}</div>
    </div>
  `;
}

/**
 * Button Component
 */
export function button({ url, text, color = "#667eea" }) {
  return `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="display: inline-block; background: ${color}; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
        ${text}
      </a>
    </div>
  `;
}

/**
 * Signature Component
 */
export function signature({ teamName = "فريق التوظيف", color = "#667eea" }) {
  return `
    <p style="font-size: 16px; color: #2d3748; margin: 30px 0 0 0; font-weight: 500;">
      مع أطيب التحيات،<br>
      <strong style="color: ${color};">${teamName}</strong>
    </p>
  `;
}

/**
 * List Component
 */
export function list({ items, color = "#2c5282" }) {
  const listItems = items
    .map((item) => `<li style="margin-bottom: 10px;">${item}</li>`)
    .join("");

  return `
    <ul style="margin: 0; padding: 0 0 0 20px; color: ${color}; line-height: 1.8;">
      ${listItems}
    </ul>
  `;
}

export default {
  emailHeader,
  emailFooter,
  greeting,
  infoCard,
  highlightedBox,
  infoItem,
  alertBox,
  button,
  signature,
  list,
};