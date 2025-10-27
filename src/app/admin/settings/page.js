// src/app/admin/settings/page.js
"use client";

import SettingsLayout from "@/components/admin/settings/SettingsLayout";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
          <p className="text-gray-600 mt-2">
            إدارة إعدادات التطبيق
          </p>
        </div>
      </div>

      {/* <SettingsLayout /> */}
    </div>
  );
}