// src/services/email/templates/applicant/applicationRejected.js
/**
 * Application Rejected Email Template
 */

import { baseEmailTemplate } from "../base/baseTemplate.js";
import {
  emailHeader,
  emailFooter,
  greeting,
  signature,
} from "../base/emailComponents.js";

export function applicationRejectedTemplate(application) {
  const jobTitle = application.jobId?.title || "الوظيفة";

  const header = emailHeader({
    gradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    icon: "📋",
    title: "تحديث حول طلبك",
    subtitle: "Application Update",
  });

  const body = `
    ${greeting(application.name, "#6b7280")}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 20px 0;">
      نشكرك على اهتمامك بالعمل لدينا والوقت الذي خصصته للتقديم على وظيفة <strong>${jobTitle}</strong>.
    </p>
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 20px 0;">
      بعد المراجعة الدقيقة لطلبك، نأسف لإبلاغك بأننا قررنا المضي قدماً مع مرشحين آخرين تتطابق خبراتهم بشكل أكبر مع متطلبات الوظيفة الحالية.
    </p>
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 20px 0;">
      نقدر اهتمامك ونشجعك على متابعة الفرص الوظيفية المستقبلية التي قد تناسب مهاراتك وخبراتك. نتمنى لك كل التوفيق في مسيرتك المهنية.
    </p>
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 30px 0 0 0;">
      مع أطيب التمنيات بالنجاح،
    </p>
    
    ${signature({ teamName: "فريق التوظيف", color: "#6b7280" })}
  `;

  const footer = emailFooter({});

  return baseEmailTemplate({ header, body, footer });
}

export default applicationRejectedTemplate;