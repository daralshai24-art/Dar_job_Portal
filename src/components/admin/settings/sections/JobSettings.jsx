// src/components/admin/settings/sections/JobSettings.jsx
"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function JobSettings() {
  const [settings, setSettings] = useState({
    autoApproveJobs: false,
    jobExpiryDays: 30,
    maxApplicationsPerJob: 100,
    allowRemoteWork: true,
    jobCategories: ["تكنولوجيا", "مبيعات", "محاسبة", "موارد بشرية"],
    defaultJobStatus: "draft"
  });

  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim() && !settings.jobCategories.includes(newCategory.trim())) {
      setSettings({
        ...settings,
        jobCategories: [...settings.jobCategories, newCategory.trim()]
      });
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setSettings({
      ...settings,
      jobCategories: settings.jobCategories.filter(cat => cat !== categoryToRemove)
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">إعدادات الوظائف</h2>
      
      <div className="space-y-6">
        {/* Job Approval */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800">الموافقة التلقائية على الوظائف</h3>
            <p className="text-sm text-gray-600">نشر الوظائف تلقائياً دون مراجعة المدير</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoApproveJobs}
              onChange={(e) => setSettings({...settings, autoApproveJobs: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Job Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدة انتهاء الوظيفة (أيام)
            </label>
            <input
              type="number"
              value={settings.jobExpiryDays}
              onChange={(e) => setSettings({...settings, jobExpiryDays: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأقصى للمتقدمين
            </label>
            <input
              type="number"
              value={settings.maxApplicationsPerJob}
              onChange={(e) => setSettings({...settings, maxApplicationsPerJob: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Job Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التصنيفات المتاحة
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="إضافة تصنيف جديد"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button
              onClick={addCategory}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              إضافة
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {settings.jobCategories.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {category}
                <button
                  onClick={() => removeCategory(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
            <Save className="w-4 h-4" />
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}