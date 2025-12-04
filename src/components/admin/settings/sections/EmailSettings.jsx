"use client";

import { useState, useEffect } from "react";
import { Save, TestTube, Mail, Key, User, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../../../shared/ui/Button";

export default function EmailSettings({ settings, onUpdate }) {
  const [emailSettings, setEmailSettings] = useState({
    provider: 'resend',
    resendApiKey: "",
    fromEmail: "",
    fromName: "",
    companyLogo: "",
    emailNotifications: true,
    applicationAlerts: true
  });

  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.email) {
      setEmailSettings({
        provider: settings.email.provider || 'resend',
        resendApiKey: settings.email.resendApiKey || "",
        fromEmail: settings.email.fromEmail || "",
        fromName: settings.email.fromName || "",
        companyLogo: settings.email.companyLogo || "",
        emailNotifications: settings.email.emailNotifications ?? true,
        applicationAlerts: settings.email.applicationAlerts ?? true
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await onUpdate('email', emailSettings);
      if (success) {
        // toast is handled in parent
      }
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error("الرجاء إدخال بريد إلكتروني للاختبار");
      return;
    }

    setSendingTest(true);
    try {
      const response = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('تم إرسال البريد التجريبي بنجاح');
      } else {
        toast.error(data.error || 'فشل إرسال البريد التجريبي');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('حدث خطأ أثناء إرسال البريد التجريبي');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Mail className="w-5 h-5 text-green-600" />
        إعدادات البريد الإلكتروني (Resend)
      </h2>

      <div className="space-y-6">
        {/* Resend Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              مفتاح API (Resend API Key)
            </label>
            <input
              type="password"
              value={emailSettings.resendApiKey}
              onChange={(e) => setEmailSettings({ ...emailSettings, resendApiKey: e.target.value })}
              placeholder="re_..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dir-ltr text-left"
            />
            <p className="text-xs text-gray-500 mt-1">
              يمكنك الحصول على المفتاح من لوحة تحكم Resend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني للمرسل
              </label>
              <input
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                placeholder="onboarding@resend.dev"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                اسم المرسل
              </label>
              <input
                type="text"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                placeholder="اسم الشركة"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              رابط الشعار (Company Logo URL)
            </label>
            <input
              type="url"
              value={emailSettings.companyLogo}
              onChange={(e) => setEmailSettings({ ...emailSettings, companyLogo: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dir-ltr text-left"
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Email Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-800">الإشعارات البريدية</h3>
              <p className="text-sm text-gray-600">تفعيل إرسال الإشعارات عبر البريد الإلكتروني بشكل عام</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailSettings.emailNotifications}
                onChange={(e) => setEmailSettings({ ...emailSettings, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-800">تنبيهات الطلبات الجديدة</h3>
              <p className="text-sm text-gray-600">إرسال بريد للمسؤولين عند استلام طلب توظيف جديد</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailSettings.applicationAlerts}
                onChange={(e) => setEmailSettings({ ...emailSettings, applicationAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Test Email Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            اختبار الإعدادات
          </h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني للتجربة"
              className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              onClick={sendTestEmail}
              disabled={!testEmail}
              loading={sendingTest}
              variant="info"
              className="whitespace-nowrap"
            >
              إرسال تجريبي
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            onClick={handleSave}
            variant="primary"
            loading={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
}