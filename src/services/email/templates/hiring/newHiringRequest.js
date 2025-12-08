import baseEmailTemplate from "../base/baseEmailTemplate.js";
import {
    emailHeader,
    emailFooter,
    greeting,
    infoCard,
    button,
    signature,
} from "../base/emailComponents.js";

/**
 * New Hiring Request Template
 * Sent to HR/Admin when a manager requests a new hire
 */
export default function newHiringRequestTemplate({
    settings,
    request, // populated hiring request
}) {
    const managerName = request.requestedBy.name;

    return baseEmailTemplate(
        `
    ${emailHeader({
            title: "طلب توظيف جديد",
            subtitle: `مقدم من Department: ${request.department}`,
            icon: "🆕",
            gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // Blue
            logoUrl: settings?.logoUrl,
        })}

    <tr>
      <td style="padding: 40px 30px; background-color: #ffffff;">
        ${greeting("فريق الموارد البشرية", "#3b82f6")}
        
        <p style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #4a5568; line-height: 1.8; font-size: 16px;">
          قام <strong>${managerName}</strong> بتقديم طلب استحداث وظيفة جديدة. يرجى مراجعة التفاصيل أدناه واتخاذ الإجراء المناسب.
        </p>

        ${infoCard({
            title: "تفاصيل الطلب",
            icon: "📝",
            borderColor: "#3b82f6",
            items: [
                { label: "المسمى الوظيفي", value: request.positionTitle },
                { label: "القسم", value: request.department },
                { label: "نوع التوظيف", value: request.employmentType },
                { label: "الأهمية", value: request.urgency === "high" ? "🔴 عاجل" : request.urgency === "medium" ? "🟡 متوسط" : "🟢 منخفض" },
            ]
        })}

        <div style="text-align: center; margin: 30px 0;">
          ${button({
            url: `${settings?.appUrl || ""}/admin/hiring-requests/${request._id}`,
            text: "مراجعة الطلب",
            color: "#3b82f6",
        })}
        </div>
        
        ${signature({ teamName: "نظام التوظيف", color: "#3b82f6" })}
      </td>
    </tr>
    ${emailFooter({
            companyName: settings?.companyName,
            logoUrl: settings?.logoUrl,
            showLogo: true,
        })}
    `
    );
}
