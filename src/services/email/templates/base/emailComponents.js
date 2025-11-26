// src/services/email/templates/base/emailComponents.js (TRULY FIXED - Visibility Issue)
/**
 * Reusable Email Components - FIXED TEXT VISIBILITY
 */

import EMAIL_CONFIG from "../../config/emailConfig.js";

/**
 * Email Header Component (with logo)
 */
export function emailHeader({ gradient, icon, title, subtitle, showLogo = true }) {
  const logoUrl = process.env.COMPANY_LOGO_URL || EMAIL_CONFIG.app.logoUrl;
  
  return `
    <tr>
      <td style="background: ${gradient}; padding: 40px 30px; text-align: center;">
        ${showLogo && logoUrl ? `
          <img src="${logoUrl}" alt="Logo" style="max-width: 120px; height: auto; margin-bottom: 20px;" />
        ` : ''}
        <div style="font-size: 48px; margin-bottom: 10px;">${icon}</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">${title}</h1>
        <p style="color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 16px;">${subtitle}</p>
      </td>
    </tr>
  `;
}

/**
 * Email Footer Component (with logo)
 */
export function emailFooter({ companyName = EMAIL_CONFIG.app.name, showLogo = false }) {
  const logoUrl = process.env.COMPANY_LOGO_URL || EMAIL_CONFIG.app.logoUrl;
  
  return `
    <tr>
      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        ${showLogo && logoUrl ? `
          <img src="${logoUrl}" alt="Logo" style="max-width: 80px; height: auto; margin-bottom: 15px; opacity: 0.7;" />
        ` : ''}
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
export function infoCard({ title, items, borderColor = "#667eea", icon = "📋" }) {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="color: #718096; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>${item.label}:</strong></td>
      <td style="color: #2d3748; font-size: 14px; text-align: left; padding: 8px 0; vertical-align: top;">${item.value}</td>
    </tr>
  `
    )
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; margin: 30px 0; border-right: 4px solid ${borderColor};">
      <tr>
        <td style="padding: 25px;">
          <h3 style="margin: 0 0 20px 0; color: ${borderColor}; font-size: 20px; font-weight: 600;">${icon} ${title}</h3>
          <table width="100%" cellpadding="8" cellspacing="0">
            ${rows}
          </table>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Highlighted Box Component - FIXED: Proper text visibility
 */
export function highlightedBox({ gradient, title, items }) {
  // Create each item with FIXED visibility
  const itemsHtml = items.map((item, index) => {
    const isLast = index === items.length - 1;
    return `
      <tr>
        <td style="padding-bottom: ${isLast ? '0' : '15px'};">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.25); border-radius: 12px;">
            <tr>
              <td style="padding: 20px;">
                <p style="margin: 0 0 8px 0; color: rgba(255,255,255,0.95); font-size: 14px; font-weight: 500;">${item.label}</p>
                <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${item.icon} ${item.value}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" style="background: ${gradient}; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
            <tr>
              <td style="padding: 30px;">
                <h2 style="color: #ffffff; margin: 0 0 25px 0; font-size: 22px; text-align: center; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${title}</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHtml}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Info Item Component (DEPRECATED - kept for backward compatibility)
 * Use highlightedBox with items array instead
 */
export function infoItem({ label, value, icon = "" }) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
      <tr>
        <td style="background-color: rgba(255,255,255,0.15); padding: 20px; border-radius: 12px;">
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 5px;">${label}</p>
          <p style="margin: 0; color: white; font-size: 20px; font-weight: 600;">${icon} ${value}</p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Alert Box Component
 */
export function alertBox({ type = "info", title, content, icon = "" }) {
  const styles = {
    info: {
      bg: "#ebf4ff",
      border: "#bee3f8",
      color: "#2c5282",
      defaultIcon: "ℹ️"
    },
    warning: {
      bg: "#fffbeb",
      border: "#fbbf24",
      color: "#92400e",
      defaultIcon: "⚠️"
    },
    success: {
      bg: "#e6fffa",
      border: "#319795",
      color: "#134e4a",
      defaultIcon: "✅"
    },
  };

  const style = styles[type] || styles.info;
  const displayIcon = icon || style.defaultIcon;

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${style.bg}; border-radius: 12px; margin: 25px 0; border: 2px solid ${style.border};">
      <tr>
        <td style="padding: 25px;">
          <h3 style="margin: 0 0 15px 0; color: ${style.color}; font-size: 18px; font-weight: 600;">${displayIcon} ${title}</h3>
          <div style="margin: 0; color: ${style.color}; font-size: 15px; line-height: 1.8;">${content}</div>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Button Component - FIXED for better email client support
 */
export function button({ url, text, color = "#667eea" }) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background: ${color}; border-radius: 8px; text-align: center;">
                <a href="${url}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif;" target="_blank">
                  ${text}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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