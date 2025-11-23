// src/services/email/templates/manager/feedbackRequest.js
import { baseEmailTemplate } from "../base/baseTemplate.js";
import {
  emailHeader,
  emailFooter,
  greeting,
  infoCard,
  button,
  alertBox,
  signature,
} from "../base/emailComponents.js";

export function feedbackRequestTemplate({
  application,
  managerName,
  feedbackUrl,
  message,
  expiresInDays,
}) {
  const jobTitle = application.jobId?.title || "الوظيفة";
  const candidateName = application.name;

  const header = emailHeader({
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    icon: "📝",
    title: "طلب تقييم مرشح",
    subtitle: "Candidate Feedback Request",
  });

  const body = `
    ${greeting(managerName)}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
      نرجو منك تقييم المرشح <strong>${candidateName}</strong> للوظيفة <strong>${jobTitle}</strong>.
      رأيك مهم جداً في عملية اتخاذ القرار.
    </p>
    
    ${
      message
        ? alertBox({
            type: "info",
            title: "💬 رسالة من فريق التوظيف",
            content: `<p style="margin: 0;">${message}</p>`,
          })
        : ""
    }
    
    ${infoCard({
      title: "👤 معلومات المرشح",
      items: [
        { label: "الاسم", value: candidateName },
        { label: "البريد الإلكتروني", value: application.email },
        { label: "الهاتف", value: application.phone || "غير متوفر" },
        { label: "المدينة", value: application.city || "غير محدد" },
      ],
      borderColor: "#6366f1",
    })}
    
    ${button({
      url: feedbackUrl,
      text: "إضافة التقييم والملاحظات",
      color: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    })}
    
    ${alertBox({
      type: "warning",
      title: "⏰ مهم",
      content: `<p style="margin: 0;">هذا الرابط صالح لمدة <strong>${expiresInDays} أيام</strong>. لا يتطلب الأمر تسجيل دخول.</p>`,
    })}
    
    <p style="font-size: 14px; color: #718096; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
      يمكنك استخدام الرابط أعلاه لإضافة ملاحظاتك وتقييمك للمرشح بكل سهولة.
    </p>
    
    ${signature({ teamName: "فريق التوظيف", color: "#6366f1" })}
  `;

  const footer = emailFooter({});

  return baseEmailTemplate({ header, body, footer });
}

export default feedbackRequestTemplate;