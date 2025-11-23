// src/services/email/templates/base/baseTemplate.js
/**
 * Base Email Template
 * Wraps all email content with consistent structure
 */

/**
 * Base HTML wrapper for all emails
 */
export function baseEmailTemplate({ header, body, footer }) {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Email</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); max-width: 600px;">
              
              ${header}
              
              <tr>
                <td style="padding: 40px 30px;">
                  ${body}
                </td>
              </tr>
              
              ${footer}
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export default baseEmailTemplate;