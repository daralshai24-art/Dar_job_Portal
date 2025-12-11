
export default function feedbackReceivedTemplate({ settings, application, managerName, role, feedbackUrl }) {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تم استلام تقييم جديد</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; direction: rtl; text-align: right;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1D3D1E; padding: 30px; text-align: center;">
            <img src="${settings.companyLogo}" alt="${settings.companyName}" style="height: 60px; margin-bottom: 10px;">
            <h1 style="color: #D6B666; margin: 0; font-size: 24px;">تم استلام تقييم جديد</h1>
        </div>

        <!-- Content -->
        <div style="padding: 30px; color: #374151;">
            <p style="font-size: 16px; line-height: 1.6;">مرحباً،</p>
            <p style="font-size: 16px; line-height: 1.6;">
                قام <strong>${managerName}</strong> (${role}) بإرسال تقييمه لطلب التوظيف:
                <br>
                <strong>${application.name}</strong> - ${application.jobId?.title || 'Job'}
            </p>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0; font-size: 14px;"><strong>التقييم العام:</strong> قيد المراجعة</p>
                <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">يمكنك مشاهدة تفاصيل التقييم كاملة في لوحة التحكم.</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="${settings.appUrl}/admin/applications/${application._id}/reviews" 
                   style="background-color: #D6B666; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    عرض التقييمات
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} ${settings.companyName}. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
    `;
}
