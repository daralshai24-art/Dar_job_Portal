import baseEmailTemplate from "../base/baseEmailTemplate.js";
import {
    emailHeader,
    emailFooter,
    greeting,
    infoCard,
    alertBox,
    button,
    signature,
} from "../base/emailComponents.js";

/**
 * Committee Completed Template
 * Sent to HR when a committee finishes evaluation
 */
export default function committeeCompletedTemplate({
    settings,
    committee, // applicationCommittee populated
    application,
}) {
    const jobTitle = application.jobId.title || "Unknown Job";
    const candidateName = application.name;

    return baseEmailTemplate(
        `
    ${emailHeader({
            title: "اكتمال تقييم اللجنة",
            subtitle: `تم الانتهاء من تقييم المرشح: ${candidateName}`,
            icon: "🏁",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Green
            logoUrl: settings?.logoUrl,
        })}

    <tr>
      <td style="padding: 40px 30px; background-color: #ffffff;">
        ${greeting("فريق الموارد البشرية", "#10b981")}
        
        <p style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #4a5568; line-height: 1.8; font-size: 16px;">
          نود إعلامكم بأن اللجنة المعينة لتقييم المتقدم <strong>${candidateName}</strong> لوظيفة <strong>${jobTitle}</strong> قد أكملت عملية التقييم.
        </p>

        ${infoCard({
            title: "نتائج التصويت",
            icon: "📊",
            borderColor: "#10b981",
            items: [
                { label: "المتقدم", value: candidateName },
                { label: "الوظيفة", value: jobTitle },
                { label: "عدد المصوتين", value: `${committee.votingResults.submittedCount} / ${committee.votingResults.totalMembers}` },
                { label: "متوسط التقييم", value: `${committee.votingResults.averageScore} / 10` },
            ]
        })}

        ${alertBox({
            type: committee.votingResults.recommendation === "hire" ? "success" :
                committee.votingResults.recommendation === "reject" ? "warning" : "info",
            title: "التوصية النهائية",
            content: `بناءً على نتائج التصويت، التوصية هي: <strong>${committee.votingResults.recommendation === "hire" ? "تعيين ✅" :
                    committee.votingResults.recommendation === "reject" ? "رفض ❌" : "معلق ⏳"
                }</strong>`
        })}

        <div style="text-align: center; margin: 30px 0;">
          ${button({
            url: `${settings?.appUrl || ""}/admin/applications/${application._id}`,
            text: "عرض تفاصيل التقييم",
            color: "#10b981",
        })}
        </div>
        
        ${signature({
            teamName: "نظام التوظيف الآلي",
            color: "#10b981"
        })}
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
