// src/components/admin/settings/sections/GeneralSettings.jsx
"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";

export default function GeneralSettings({ settings, onUpdate }) {
  const [formData, setFormData] = useState(settings?.general || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(settings?.general || {});
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await onUpdate('general', formData);
      if (success) {
        alert('تم حفظ الإعدادات العامة بنجاح');
      } else {
        alert('حدث خطأ أثناء حفظ الإعدادات');
      }
    } catch (error) {
      console.error('Error saving general settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">الإعدادات العامة</h2>
        <button
          onClick={() => setFormData(settings?.general || {})}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة تعيين
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Site Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الموقع
            </label>
            <input
              type="text"
              value={formData.siteName || ''}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الموقع
            </label>
            <input
              type="text"
              value={formData.siteDescription || ''}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Language and Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اللغة
            </label>
            <select
              value={formData.language || 'ar'}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة الزمنية
            </label>
            <select
              value={formData.timezone || 'Asia/Riyadh'}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Asia/Riyadh">الرياض (UTC+3)</option>
              <option value="Asia/Dubai">دبي (UTC+4)</option>
              <option value="Europe/London">لندن (UTC+0)</option>
            </select>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800">وضع الصيانة</h3>
            <p className="text-sm text-gray-600">إيقاف الموقع للزوار وعرض رسالة الصيانة</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.maintenanceMode || false}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  );
}