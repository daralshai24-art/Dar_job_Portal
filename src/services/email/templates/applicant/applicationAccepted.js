// src/services/email/templates/applicant/applicationAccepted.js
/**
 * Application Accepted Email Template
 */

import { baseEmailTemplate } from "../base/baseTemplate.js";
import {
  emailHeader,
  emailFooter,
  greeting,
  highlightedBox,
  alertBox,
  signature,
  list,
} from "../base/emailComponents.js";

export function applicationAcceptedTemplate(application, { logoUrl } = {}) {
  const jobTitle = application.jobId?.title || "الوظيفة";

  const header = emailHeader({
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    icon: "🎉",
    title: "مبروك! تم قبولك للوظيفة",
    subtitle: "Congratulations!",
    logoUrl,
  });

  const celebrationContent = `
    <div style="text-align: center; padding: 20px 0;">
      <p style="margin: 0; color: white; font-size: 24px; font-weight: 600;">
        مرحباً بك في فريقنا! 🎊
      </p>
    </div>
  `;

  const body = `
    ${greeting(application.name, "#10b981")}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
      يسعدنا أن نبلغك بقبولك للعمل معنا في وظيفة <strong>${jobTitle}</strong>! 
      لقد أظهرت مؤهلات وخبرات رائعة ونحن متحمسون لانضمامك إلى فريقنا.
    </p>
    
    ${highlightedBox({
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    title: "🌟 تهانينا",
    content: celebrationContent,
  })}
    
    ${alertBox({
    type: "success",
    title: "📝 الخطوات القادمة",
    content: list({
      items: [
        "سيتواصل معك قسم الموارد البشرية خلال يومين عمل",
        "سيتم مناقشة تفاصيل العقد والراتب والمزايا",
        "سنحدد موعد بداية العمل بما يناسبك",
        "سنرسل لك المستندات المطلوبة للتوقيع",
      ],
      color: "#134e4a",
    }),
  })}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 30px 0 0 0;">
      نتطلع بشغف للعمل معك والمساهمة معاً في نجاح فريقنا! 🚀
    </p>
    
    ${signature({ teamName: "فريق التوظيف", color: "#10b981" })}
  `;

  const footer = emailFooter({ logoUrl });

  return baseEmailTemplate({ header, body, footer });
}

export default applicationAcceptedTemplate;