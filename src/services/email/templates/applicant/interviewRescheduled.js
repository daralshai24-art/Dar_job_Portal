// src/services/email/templates/applicant/interviewRescheduled.js
import { baseEmailTemplate } from "../base/baseTemplate.js";
import {
  emailHeader,
  emailFooter,
  greeting,
  highlightedBox,
  infoItem,
  signature,
} from "../base/emailComponents.js";

export function interviewRescheduledTemplate(application) {
  const jobTitle = application.jobId?.title || "الوظيفة";
  const date = new Date(application.interviewDate).toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const header = emailHeader({
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    icon: "🔄",
    title: "تم تغيير موعد المقابلة",
    subtitle: "Interview Rescheduled",
  });

  const newSchedule = `
    ${infoItem({ label: "التاريخ الجديد", value: date, icon: "📅" })}
    ${infoItem({
      label: "الوقت الجديد",
      value: application.interviewTime,
      icon: "🕒",
    })}
  `.replace(/margin-bottom: 15px;/g, "margin-bottom: 15px; margin-top: 0;");

  const body = `
    ${greeting(application.name)}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
      نعتذر عن التغيير في الموعد. تم تحديث موعد مقابلتك لوظيفة <strong>${jobTitle}</strong> إلى الموعد التالي:
    </p>
    
    ${highlightedBox({
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      title: "📅 الموعد الجديد",
      content: newSchedule,
    })}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 30px 0 0 0;">
      نقدر تفهمك ونتطلع للقائك في الموعد الجديد! 🌟
    </p>
    
    ${signature({ teamName: "فريق التوظيف", color: "#f59e0b" })}
  `;

  const footer = emailFooter({});

  return baseEmailTemplate({ header, body, footer });
}

export default interviewRescheduledTemplate;