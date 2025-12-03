// src/services/email/templates/base/emailComponents.js
import EMAIL_CONFIG from "../../config/emailConfig.js";

/**
 * Reusable Email Components - Defensive & Outlook-friendly
 *
 * Notes:
 * - Components accept both `items` (array) and `content` (HTML string) where applicable.
 * - All functions defensively handle undefined inputs so .map() never throws.
 * - Keep API/backwards-compatibility: infoItem is still exported.
 */

// --------------- Helpers -----------------

const safe = (v) => (v ?? "").toString().trim();
const raw = (v) => (v === undefined || v === null ? "" : v); // allow HTML strings to pass through
const logoUrl = process.env.COMPANY_LOGO_URL || EMAIL_CONFIG.app.logoUrl || "";

// A base inline font + direction helper for Arabic RTL emails
const baseFont =
  "font-family: Arial, Helvetica, sans-serif; direction: rtl; text-align: right; line-height: 1.6;";

/* ============================
   Components
   ============================ */

/**
 * Email Header Component (with logo)
 */
/**
 * Email Header Component (with logo)
 */
export function emailHeader({
  gradient = "#667eea",
  icon = "",
  title = "",
  subtitle = "",
  showLogo = true,
  logoUrl: propLogoUrl, // Allow overriding logo
}) {
  const displayLogoUrl = propLogoUrl || logoUrl;

  return `
    <tr>
      <td style="background: ${safe(gradient)}; padding: 40px 30px; text-align: center;">
        ${showLogo && displayLogoUrl
      ? `
         <!-- Outlook-friendly logo -->
         <img src="${displayLogoUrl}" alt="Logo"
           width="150" height="150"
           style="display:block; margin:0 auto 20px auto; width:150px; height:auto; max-width:150px; max-height:150px;" />
        `
      : ``
    }
        <div style="${baseFont} font-size: 42px; margin-bottom: 10px; color: #ffffff;">${safe(icon)}</div>
        <h1 style="${baseFont} color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">${safe(title)}</h1>
        <p style="${baseFont} color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 16px;">${safe(subtitle)}</p>
      </td>
    </tr>
  `;
}

/**
 * Email Footer Component
 */
export function emailFooter({
  companyName = EMAIL_CONFIG.app.name,
  showLogo = false,
  logoUrl: propLogoUrl,
} = {}) {
  const displayLogoUrl = propLogoUrl || logoUrl;

  return `
    <tr>
      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        ${showLogo && displayLogoUrl
      ? `
          <!-- Outlook-friendly logo -->
          <img src="${displayLogoUrl}" alt="Logo"
            width="80" height="80"
            style="display:block; margin:0 auto 15px auto; width:80px; height:auto; max-width:80px; max-height:80px; opacity:0.8;" />
        `
      : ``
    }
        <p style="${baseFont} margin: 0 0 10px 0; color: #718096; font-size: 14px;">${safe(companyName)}</p>
        <p style="${baseFont} margin: 0; color: #a0aec0; font-size: 13px;">هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه</p>
      </td>
    </tr>
  `;
}

/**
 * Greeting Component
 */
export function greeting(name = "", color = "#667eea") {
  return `
    <p style="${baseFont} font-size: 18px; color: #1a202c; line-height: 1.6; margin: 0 0 20px 0;">
      عزيزي/عزيزتي <strong style="color: ${safe(color)};">${safe(name)}</strong>، 
    </p>
  `;
}

/**
 * Info Card Component
 * - items: array of { label, value }
 * Defensive: items default to []
 */
export function infoCard({
  title = "",
  items = [],
  borderColor = "#667eea",
  icon = "📋",
} = {}) {
  if (!Array.isArray(items)) items = [];

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="${baseFont} color: #718096; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>${safe(item.label)}:</strong></td>
        <td style="${baseFont} color: #2d3748; font-size: 14px; text-align: left; padding: 8px 0; vertical-align: top;">${safe(item.value)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; margin: 30px 0; border-right: 4px solid ${safe(borderColor)};">
      <tr>
        <td style="padding: 25px;">
          <h3 style="${baseFont} margin: 0 0 20px 0; color: ${safe(borderColor)}; font-size: 20px; font-weight: 600;">${safe(icon)} ${safe(title)}</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${rows}
          </table>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Highlighted Box Component
 * - Prefer `items` (array). For backward compatibility, you may pass `content` (HTML string).
 * - If `items` exists and is an array it will be used; else `content` will be injected as-is.
 */
export function highlightedBox({
  gradient = "#667eea",
  title = "",
  items = undefined,
  content = undefined,
} = {}) {
  // Normalize items: if not an array, set to empty array (so .map won't fail)
  const useItems = Array.isArray(items) ? items : [];

  // If items provided -> render them; else render `content` (raw HTML allowed)
  const innerHtml = useItems.length
    ? useItems
      .map((item, index) => {
        const isLast = index === useItems.length - 1;
        return `
            <tr>
              <td style="padding-bottom: ${isLast ? "0" : "15px"};">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.12); border-radius: 12px;">
                  <tr>
                    <td style="padding: 18px;">
                      <p style="${baseFont} margin: 0 0 8px 0; color: rgba(255,255,255,0.95); font-size: 14px; font-weight: 500;">${safe(item.label)}</p>
                      <p style="${baseFont} margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.08);">${safe(item.icon ?? "")} ${safe(item.value)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `;
      })
      .join("")
    : // fallback to raw content (allow HTML)
    `<tr><td style="padding: 8px 0;">${raw(content) || ""}</td></tr>`;

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" style="background: ${safe(gradient)}; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.10);">
            <tr>
              <td style="padding: 26px;">
                <h2 style="${baseFont} color: #ffffff; margin: 0 0 18px 0; font-size: 20px; text-align: center; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.06);">${safe(title)}</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${innerHtml}
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
 * infoItem (DEPRECATED)
 * Kept for backward compatibility because other templates still import it.
 * Use highlightedBox(items:[]) or infoCard for richer UI.
 */
export function infoItem({ label = "", value = "", icon = "" } = {}) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
      <tr>
        <td style="background-color: rgba(255,255,255,0.12); padding: 14px; border-radius: 12px;">
          <p style="${baseFont} margin: 0 0 6px 0; color: rgba(0,0,0,0.65); font-size: 14px;">${safe(label)}</p>
          <p style="${baseFont} margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${safe(icon)} ${safe(value)}</p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Alert Box Component
 */
export function alertBox({
  type = "info",
  title = "",
  content = "",
  icon = "",
} = {}) {
  const styles = {
    info: {
      bg: "#ebf4ff",
      border: "#bee3f8",
      color: "#2c5282",
      defaultIcon: "ℹ️",
    },
    warning: {
      bg: "#fffbeb",
      border: "#fbbf24",
      color: "#92400e",
      defaultIcon: "⚠️",
    },
    success: {
      bg: "#e6fffa",
      border: "#319795",
      color: "#134e4a",
      defaultIcon: "✅",
    },
  };

  const style = styles[type] || styles.info;
  const displayIcon = icon || style.defaultIcon;

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${style.bg}; border-radius: 12px; margin: 20px 0; border: 2px solid ${style.border};">
      <tr>
        <td style="padding: 20px;">
          <h3 style="${baseFont} margin: 0 0 10px 0; color: ${style.color}; font-size: 17px; font-weight: 600;">${displayIcon} ${safe(title)}</h3>
          <div style="${baseFont} color: ${style.color}; font-size: 15px; line-height: 1.8;">${raw(content)}</div>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Button Component (table-wrapped for Outlook compatibility)
 */
export function button({ url = "#", text = "Click", color = "#667eea" } = {}) {
  return `
  <!--[if mso]>
  <center>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${safe(url)}"
    style="height:48px;v-text-anchor:middle;width:260px;" arcsize="15%" stroke="f" fillcolor="${safe(color)}">
    <w:anchorlock/>
    <center style="color:#ffffff;font-size:17px;font-weight:bold;">
      ${safe(text)}
    </center>
  </v:roundrect>
  </center>
  <![endif]-->

  <!--[if !mso]><!-- -->
    <a href="${safe(url)}"
      style="${baseFont}
        display:inline-block;
        background:${safe(color)};
        padding:15px 36px;
        color:#ffffff !important;
        text-decoration:none;
        font-size:17px;
        font-weight:700;
        border-radius:10px;
      ">
      ${safe(text)}
    </a>
  <!--<![endif]-->
  `;
}



/**
 * Signature Component
 */
export function signature({
  teamName = "فريق التوظيف",
  color = "#667eea",
} = {}) {
  return `
    <p style="${baseFont} font-size: 15px; margin: 28px 0 0;">
      مع أطيب التحيات،<br/>
      <strong style="color: ${safe(color)};">${safe(teamName)}</strong>
    </p>
  `;
}

/**
 * List Component
 * Defensive: items default to []
 */
export function list({ items = [], color = "#2c5282" } = {}) {
  if (!Array.isArray(items)) items = [];

  const listItems = items
    .map((item) => `<li style="margin-bottom: 10px;">${safe(item)}</li>`)
    .join("");

  return `
    <ul style="${baseFont} margin: 0; padding: 0 0 0 20px; color: ${safe(color)}; line-height: 1.8;">
      ${listItems}
    </ul>
  `;
}

/* ============================
   Default export (keep compatibility)
   ============================ */
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
