// src/components/admin/settings/SettingsLayout.jsx
"use client";

import { useState, useEffect } from "react";
import SettingsSidebar from "./SettingsSidebar";
import GeneralSettings from "./sections/GeneralSettings";
import EmailSettings from "./sections/EmailSettings";
import JobSettings from "./sections/JobSettings";
// import NotificationSettings from "./sections/NotificationSettings";
// import SecuritySettings from "./sections/SecuritySettings";
import SystemTools from "./sections/SystemTools";

export default function SettingsLayout() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (section, newSettings) => {
    try {
      const updatedSettings = {
        ...settings,
        [section]: newSettings
      };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        const savedSettings = await response.json();
        setSettings(savedSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  const saveAllSettings = async () => {
    if (!settings) return;
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('تم حفظ جميع الإعدادات بنجاح');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving all settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    const sectionProps = {
      settings: settings,
      onUpdate: updateSettings
    };

    switch (activeSection) {
      case "general":
        return <GeneralSettings {...sectionProps} />;
      case "email":
        return <EmailSettings {...sectionProps} />;
      case "jobs":
        return <JobSettings {...sectionProps} />;
      case "notifications":
        return <NotificationSettings {...sectionProps} />;
      case "security":
        return <SecuritySettings {...sectionProps} />;
      case "tools":
        return <SystemTools {...sectionProps} />;
      default:
        return <GeneralSettings {...sectionProps} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <SettingsSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          onSaveAll={saveAllSettings}
        />
      </div>
      
      {/* Content */}
      <div className="lg:col-span-3">
        {renderSection()}
      </div>
    </div>
  );
}