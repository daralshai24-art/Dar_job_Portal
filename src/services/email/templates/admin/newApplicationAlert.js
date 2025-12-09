import { baseEmailTemplate } from "../base/baseTemplate.js";
import { emailHeader, emailFooter, button, infoCard, greeting } from "../base/emailComponents.js";

export const newApplicationAlertTemplate = (application, { logoUrl, appUrl }) => {
    const jobTitle = application.jobId?.title || "وظيفة غير محددة";
    const applicantName = application.name;
    const applicationUrl = `${appUrl}/admin/applications/${application._id}`;

    // 1. Header
    const header = emailHeader({
        title: "طلب توظيف جديد",
        subtitle: `تم استلام طلب جديد لوظيفة: ${jobTitle}`,
        logoUrl: logoUrl,
        icon: "📄"
    });

    // 2. Body
    const bodyContent = `
    ${greeting("المسؤول", "#2F855A")}
    
    <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #4A5568; line-height: 1.6; font-size: 16px; margin-bottom: 20px; direction: rtl; text-align: right;">
        تم تقديم طلب توظيف جديد عبر الموقع. يرجى مراجعة التفاصيل أدناه واتخاذ الإجراء المناسب.
    </p>

    ${infoCard({
        title: "بيانات المتقدم",
        icon: "👤",
        borderColor: "#2F855A",
        items: [
            { label: "الاسم", value: applicantName },
            { label: "البريد الإلكتروني", value: application.email },
            { label: "المدينة", value: application.city || "غير محدد" },
            { label: "الوظيفة", value: jobTitle }
        ]
    })}

    <div style="text-align: center; margin-top: 30px;">
        ${button({
        text: "عرض الطلب والتفاصيل",
        url: applicationUrl,
        color: "#2F855A"
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
