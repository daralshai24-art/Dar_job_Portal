import { baseEmailTemplate } from "../base/baseTemplate.js";
import { emailHeader, emailFooter, button, infoCard, greeting } from "../base/emailComponents.js";

export const statusChangeAlertTemplate = (application, { logoUrl, appUrl, title, message, actionUrl }) => {
    const jobTitle = application.jobId?.title || "وظيفة غير محددة";
    const applicantName = application.name;
    const targetUrl = actionUrl || `${appUrl}/admin/applications/${application._id}`;

    // 1. Header
    const header = emailHeader({
        title: title || "تحديث حالة الطلب",
        subtitle: `طلب التوظيف: ${jobTitle}`,
        logoUrl: logoUrl,
        icon: "bell" // simple icon
    });

    // 2. Body
    const bodyContent = `
    ${greeting("المسؤول", "#2d3748")}
    
    <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #4A5568; line-height: 1.6; font-size: 16px; margin-bottom: 20px; direction: rtl; text-align: right;">
        ${message}
    </p>

    ${infoCard({
        title: "بيانات المتقدم",
        icon: "👤",
        borderColor: "#4299E1",
        items: [
            { label: "الاسم", value: applicantName },
            { label: "البريد الإلكتروني", value: application.email },
            { label: "الوظيفة", value: jobTitle },
            { label: "الحالة الحالية", value: application.status }
        ]
    })}

    <div style="text-align: center; margin-top: 30px;">
        ${button({
        text: "عرض تفاصيل الطلب",
        url: targetUrl,
        color: "#4299E1"
    })}
    </div>
  `;

    // 3. Footer
    const footer = emailFooter({
        companyName: "بوابة التوظيف",
        showLogo: false
    });

    // 4. Combine
    return baseEmailTemplate({
        header,
        body: bodyContent,
        footer
    });
};
