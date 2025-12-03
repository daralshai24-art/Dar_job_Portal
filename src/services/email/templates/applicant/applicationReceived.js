// src/services/email/templates/applicant/applicationReceived.js
/**
 * Application Received Email Template
 */

import { baseEmailTemplate } from "../base/baseTemplate.js";
import {
  emailHeader,
  emailFooter,
  greeting,
  infoCard,
  alertBox,
  signature,
  list,
} from "../base/emailComponents.js";

export function applicationReceivedTemplate(application, { logoUrl } = {}) {
  const jobTitle = application.jobId?.title || "الوظيفة";
  const jobLocation = application.jobId?.location || "غير محدد";
  const applicationDate = new Date(application.createdAt).toLocaleDateString(
    "ar-SA",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const header = emailHeader({
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: "✅",
    title: "تم استلام طلبك بنجاح",
    subtitle: "Application Received Successfully",
    logoUrl,
  });

  const body = `
    ${greeting(application.name)}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
      شكراً لتقديمك على وظيفة <strong>${jobTitle}</strong>. 
      تم استلام طلبك بنجاح وسيتم مراجعته من قبل فريق التوظيف لدينا في أقرب وقت ممكن.
    </p>
    
    ${infoCard({
    title: "📋 تفاصيل الطلب",
    items: [
      { label: "الوظيفة", value: jobTitle },
      { label: "الموقع", value: jobLocation },
      { label: "تاريخ التقديم", value: applicationDate },
      { label: "البريد الإلكتروني", value: application.email },
    ],
    borderColor: "#667eea",
  })}
    
    ${alertBox({
    type: "info",
    title: "🔄 الخطوات القادمة",
    content: list({
      items: [
        "سيقوم فريقنا بمراجعة سيرتك الذاتية ومؤهلاتك",
        "سنتواصل معك خلال 5-7 أيام عمل في حال تطابقت مؤهلاتك",
        "يرجى متابعة بريدك الإلكتروني للحصول على التحديثات",
      ],
      color: "#2c5282",
    }),
  })}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 30px 0 0 0;">
      نقدر اهتمامك بالانضمام إلى فريقنا ونتمنى لك التوفيق! 🌟
    </p>
    
    ${signature({ teamName: "فريق التوظيف", color: "#667eea" })}
  `;

  const footer = emailFooter({ logoUrl });

  return baseEmailTemplate({ header, body, footer });
}

export default applicationReceivedTemplate;