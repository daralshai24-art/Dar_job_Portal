// src/services/email/templates/applicant/interviewScheduled.js
/**
 * Interview Scheduled Email Template
 */

import { baseEmailTemplate } from "../base/baseTemplate.js";
import {
  emailHeader,
  emailFooter,
  greeting,
  highlightedBox,
  infoItem,
  alertBox,
  signature,
  list,
} from "../base/emailComponents.js";

export function interviewScheduledTemplate(application, { logoUrl } = {}) {
  const jobTitle = application.jobId?.title || "الوظيفة";
  const date = new Date(application.interviewDate).toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const interviewTypeMap = {
    in_person: "مقابلة شخصية 🏢",
    online: "مقابلة عبر الإنترنت 💻",
    phone: "مقابلة هاتفية 📱",
  };

  const interviewTypeText =
    interviewTypeMap[application.interviewType] || "مقابلة";

  const header = emailHeader({
    gradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    icon: "🎉",
    title: "تم جدولة المقابلة!",
    subtitle: "Interview Scheduled",
    logoUrl,
  });

  const interviewDetails = `
    ${infoItem({ label: "التاريخ", value: date, icon: "📅" })}
    ${infoItem({
    label: "الوقت",
    value: application.interviewTime,
    icon: "🕒",
  })}
    ${infoItem({ label: "نوع المقابلة", value: interviewTypeText, icon: "" })}
  `.replace(/margin-bottom: 15px;/g, "margin-bottom: 15px; margin-top: 0;");

  const body = `
    ${greeting(application.name)}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
      يسعدنا إبلاغك بأنه تم جدولة مقابلة معك لوظيفة <strong>${jobTitle}</strong>. 
      نحن متحمسون للقائك ومعرفة المزيد عنك!
    </p>
    
    ${highlightedBox({
    gradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    title: "📅 تفاصيل المقابلة",
    content: interviewDetails,
  })}
    
    ${application.interviewLocation
      ? alertBox({
        type: "success",
        title: "📍 الموقع",
        content: `<p style="margin: 0;">${application.interviewLocation}</p>`,
      })
      : ""
    }
    
    ${application.interviewNotes
      ? alertBox({
        type: "warning",
        title: "⚠️ ملاحظات هامة",
        content: `<p style="margin: 0;">${application.interviewNotes}</p>`,
      })
      : ""
    }
    
    ${alertBox({
      type: "info",
      title: "💡 نصائح للتحضير",
      content: list({
        items: [
          "راجع سيرتك الذاتية ومؤهلاتك",
          "اطلع على معلومات عن الشركة والوظيفة",
          "حضّر إجابات لأسئلة المقابلة الشائعة",
          "احرص على الحضور قبل الموعد بـ 10 دقائق",
        ],
        color: "#2c5282",
      }),
    })}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 30px 0 0 0;">
      نتطلع بشوق للقائك ومناقشة مؤهلاتك وخبراتك. حظاً موفقاً! 🍀
    </p>
    
    ${signature({ teamName: "فريق التوظيف", color: "#48bb78" })}
  `;

  const footer = emailFooter({ logoUrl });

  return baseEmailTemplate({ header, body, footer });
}

export default interviewScheduledTemplate;