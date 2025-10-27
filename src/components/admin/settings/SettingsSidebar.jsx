// src/components/admin/settings/SettingsSidebar.jsx
import { 
  Settings, 
  Mail, 
  Briefcase, 
  Bell, 
  Shield,
  Save
} from "lucide-react";

export default function SettingsSidebar({ activeSection, onSectionChange }) {
  const sections = [
    {
      id: "general",
      name: "الإعدادات العامة",
      icon: Settings,
      description: "الإعدادات الأساسية للنظام"
    },
    {
      id: "email",
      name: "إعدادات البريد",
      icon: Mail,
      description: "إعدادات البريد الإلكتروني والإشعارات"
    },
    {
      id: "jobs",
      name: "إعدادات الوظائف",
      icon: Briefcase,
      description: "إعدادات نشر وإدارة الوظائف"
    },
    {
      id: "notifications",
      name: "الإشعارات",
      icon: Bell,
      description: "إعدادات نظام الإشعارات"
    },
    {
      id: "security",
      name: "الأمان",
      icon: Shield,
      description: "إعدادات الأمان والصلاحيات"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">الإعدادات</h3>
      
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full text-right p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-green-50 text-green-700 border-r-4 border-green-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon className={`w-4 h-4 ml-2 ${
                    isActive ? "text-green-600" : "text-gray-400"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {section.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Save All Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300">
          <Save className="w-4 h-4" />
          حفظ جميع الإعدادات
        </button>
      </div>
    </div>
  );
}