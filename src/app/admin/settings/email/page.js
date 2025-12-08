"use client";

import { useState, useEffect } from "react";
import EmailSettings from "@/components/admin/settings/sections/EmailSettings";
import { toast } from "react-hot-toast";

export default function EmailSettingsPage() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            if (res.ok) setSettings(data);
        } catch (error) {
            toast.error("فشل تحميل الإعدادات");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (section, data) => {
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [section]: data }),
            });

            if (res.ok) {
                toast.success("تم حفظ إعدادات البريد بنجاح");
                fetchSettings(); // Refresh
                return true;
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
            return false;
        }
    };

    if (loading) return <div className="p-12 text-center">تحميل...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">
                مركز التحكم في البريد الإلكتروني
            </h1>
            <p className="text-gray-600">
                قم بإدارة مزودي الخدمة (Resend/SMTP)، القوالب، وتنبيهات اللجان من هنا.
            </p>

            <EmailSettings
                settings={settings}
                onUpdate={handleUpdate}
            />
        </div>
    );
}
