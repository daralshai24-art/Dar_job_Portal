import baseEmailTemplate from "../base/baseEmailTemplate.js";
import {
    emailHeader,
    emailFooter,
    greeting,
    alertBox,
    infoCard,
    button,
    signature,
} from "../base/emailComponents.js";

/**
 * Hiring Request Decision Template
 * Sent to Manager when their request is approved or rejected
 */
export default function requestDecisionTemplate({
    settings,
    request, // populated
    decision // "approved" or "rejected"
}) {
    const isApproved = decision === "approved";
    const color = isApproved ? "#10b981" : "#ef4444";
    const icon = isApproved ? "✅" : "❌";
    const title = isApproved ? "تمت الموافقة على طلب التوظيف" : "تم رفض طلب التوظيف";
    const gradient = isApproved
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)";

    return baseEmailTemplate(
        `
    ${emailHeader({
            title,
            subtitle: request.positionTitle,
            icon,
            gradient,
            logoUrl: settings?.logoUrl,
        })}

    <tr>
      <td style="padding: 40px 30px; background-color: #ffffff;">
        ${greeting(request.requestedBy.name, color)}
        
        <p style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #4a5568; line-height: 1.8; font-size: 16px;">
          نود إعلامك بأنه تم تحديث حالة طلب التوظيف الخاص بـ <strong>${request.positionTitle}</strong>.
        </p>

        ${alertBox({
            type: isApproved ? "success" : "warning",
            title: isApproved ? "تمت الموافقة من قبل الإدارة" : "تم رفض الطلب",
            content: `<strong>ملاحظات المراجعة:</strong><br/>${request.reviewNotes || "لا توجد ملاحظات إضافية."}`
        })}

        ${isApproved && request.jobId ? infoCard({
            title: "تم إنشاء الوظيفة",
            icon: "🚀",
            borderColor: color,
            items: [
                { label: "رابط الوظيفة", value: `<a href="${settings?.appUrl}/jobs/${request.jobId}">عرض الوظيفة</a>` }
            ]
        }) : ""}

        <div style="text-align: center; margin: 30px 0;">
          ${button({
            url: `${settings?.appUrl || ""}/admin/hiring-requests`, // Managers view
            text: "عرض طلباتي",
            color: color,
        })}
        </div>
        
        ${signature({ teamName: "إدارة الموارد البشرية", color })}
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
