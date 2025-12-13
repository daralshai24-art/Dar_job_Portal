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

export function hiringRequestTemplate({
    requesterName,
    positionTitle,
    department,
    requestUrl,
    justification,
    urgency,
    logoUrl,
}) {
    const header = emailHeader({
        gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Green gradient
        icon: "📋",
        title: "طلب توظيف جديد",
        subtitle: "New Hiring Request",
        logoUrl,
    });

    const body = `
    ${greeting("مدير الموارد البشرية")}
    
    <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
      قام <strong>${requesterName}</strong> بتقديم طلب احتياج وظيفي جديد لوظيفة <strong>${positionTitle}</strong> في قسم <strong>${department}</strong>.
    </p>
    
    ${infoCard({
        title: "ℹ️ تفاصيل الطلب",
        items: [
            { label: "المسمى الوظيفي", value: positionTitle },
            { label: "القسم", value: department },
            { label: "الأولوية", value: urgency === 'high' ? 'عاجل جداً' : urgency === 'medium' ? 'متوسط' : 'عادي' },
        ],
        borderColor: "#10b981",
    })}

    ${justification ? alertBox({
        type: "info",
        title: "📝 مبررات الطلب",
        content: `<p style="margin: 0;">${justification}</p>`,
    }) : ''}
    
    ${button({
        url: requestUrl,
        text: "مراجعة الطلب",
        color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    })}
    
    ${signature({ teamName: "نظام التوظيف", color: "#10b981" })}
  `;

    const footer = emailFooter({ logoUrl });

    return baseEmailTemplate({ header, body, footer });
}

export default hiringRequestTemplate;
