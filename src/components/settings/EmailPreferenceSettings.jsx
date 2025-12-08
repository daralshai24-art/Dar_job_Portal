
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Save, Bell, Clock, Calendar } from "lucide-react";

export default function EmailPreferenceSettings() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState(null);

    useEffect(() => {
        fetchPreferences();
    }, [session]);

    const fetchPreferences = async () => {
        if (!session?.user?.id) return;
        try {
            const res = await fetch("/api/user/preferences");
            const data = await res.json();
            if (res.ok) setPreferences(data);
        } catch (error) {
            console.error("Failed to load preferences", error);
        } finally {
            setLoading(false);
        }
    };

    const updatePreference = async (path, value) => {
        // deep update helper
        const newPrefs = JSON.parse(JSON.stringify(preferences));
        const parts = path.split('.');
        let current = newPrefs;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setPreferences(newPrefs);
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/user/preferences", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(preferences)
            });
            if (!res.ok) throw new Error("Failed to save");
            alert("Settings saved successfully");
        } catch (error) {
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!preferences) return <div>Failed to load settings</div>;

    const role = session?.user?.role;

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Bell className="w-6 h-6 text-indigo-600" />
                        إعدادات الإشعارات
                    </h2>
                    <p className="text-gray-500 mt-1">تحكم في الرسائل التي تصلك عبر البريد الإلكتروني</p>
                </div>
                <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ التغييرات
                </button>
            </div>

            {/* Global Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                    <h3 className="font-semibold text-lg">تفعيل الإشعارات</h3>
                    <p className="text-sm text-gray-500">استلام رسائل البريد الإلكتروني من النظام</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.emailNotificationsEnabled}
                        onChange={(e) => updatePreference('emailNotificationsEnabled', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            {preferences.emailNotificationsEnabled && (
                <div className="space-y-8">

                    {/* Quiet Hours */}
                    <div className="border p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-gray-700" />
                            <h3 className="font-semibold text-lg">ساعات الهدوء</h3>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={preferences.deliveryPreferences?.quietHours?.enabled}
                                    onChange={(e) => updatePreference('deliveryPreferences.quietHours.enabled', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm">تفعيل ساعات الهدوء (لن يتم إرسال إيميلات خلال هذه الفترة)</span>
                            </label>
                        </div>

                        {preferences.deliveryPreferences?.quietHours?.enabled && (
                            <div className="grid grid-cols-2 gap-4 max-w-xs">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">من</label>
                                    <input
                                        type="time"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={preferences.deliveryPreferences?.quietHours?.start}
                                        onChange={(e) => updatePreference('deliveryPreferences.quietHours.start', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">إلى</label>
                                    <input
                                        type="time"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={preferences.deliveryPreferences?.quietHours?.end}
                                        onChange={(e) => updatePreference('deliveryPreferences.quietHours.end', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Committee Settings */}
                        {(role === 'admin' || role === 'hr_manager' || role === 'interviewer' || role === 'technical_reviewer') && (
                            <div className="bg-white p-4 border rounded-lg">
                                <h3 className="font-bold mb-4 text-gray-800">لجان التوظيف</h3>
                                <div className="space-y-3">
                                    <Toggle
                                        label="طلب تقييم جديد"
                                        checked={preferences.committeeEmails?.feedback_request}
                                        onChange={(v) => updatePreference('committeeEmails.feedback_request', v)}
                                    />
                                    <Toggle
                                        label="تذكير بالتقييم"
                                        checked={preferences.committeeEmails?.feedback_reminder}
                                        onChange={(v) => updatePreference('committeeEmails.feedback_reminder', v)}
                                    />
                                    <Toggle
                                        label="اكتمال اللجنة"
                                        checked={preferences.committeeEmails?.committee_completed}
                                        onChange={(v) => updatePreference('committeeEmails.committee_completed', v)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Application Status Settings (Managers/HR) */}
                        {(role === 'admin' || role === 'hr_manager' || role === 'department_manager') && (
                            <div className="bg-white p-4 border rounded-lg">
                                <h3 className="font-bold mb-4 text-gray-800">حالة الطلبات</h3>
                                <div className="space-y-3">
                                    <Toggle
                                        label="استلام طلب جديد"
                                        checked={role === 'department_manager' ? preferences.departmentManagerEmails?.new_application_in_department : preferences.applicantEmails?.application_received} // Simplified mapping
                                        onChange={(v) => role === 'department_manager' ? updatePreference('departmentManagerEmails.new_application_in_department', v) : updatePreference('applicantEmails.application_received', v)}
                                    />
                                    <Toggle
                                        label="مقابلة مجدولة"
                                        checked={preferences.statusChangeEmails?.interview_scheduled}
                                        onChange={(v) => updatePreference('statusChangeEmails.interview_scheduled', v)}
                                    />
                                    <Toggle
                                        label="تم التوظيف"
                                        checked={preferences.statusChangeEmails?.application_hired}
                                        onChange={(v) => updatePreference('statusChangeEmails.application_hired', v)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Hiring Requests (Managers) */}
                        {(role === 'admin' || role === 'department_manager') && (
                            <div className="bg-white p-4 border rounded-lg">
                                <h3 className="font-bold mb-4 text-gray-800">طلبات التوظيف</h3>
                                <div className="space-y-3">
                                    <Toggle
                                        label="تحديث حالة الطلب (موافقة/رفض)"
                                        checked={preferences.departmentManagerEmails?.hiring_request_approved}
                                        onChange={(v) => {
                                            updatePreference('departmentManagerEmails.hiring_request_approved', v);
                                            updatePreference('departmentManagerEmails.hiring_request_rejected', v);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            <div className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked || false}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
        </label>
    );
}
