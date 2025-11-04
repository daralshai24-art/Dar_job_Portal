"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SettingsSidebar from "./SettingsSidebar";
import SystemTools from "./sections/SystemTools";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";

export default function SettingsLayout() {
  const [activeSection, setActiveSection] = useState("tools");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { showConfirmation } = useConfirmationModal();

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
      toast.error("فشل في تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (section, newSettings) => {
    try {
      const updatedSettings = { ...settings, [section]: newSettings };
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        const savedSettings = await response.json();
        setSettings(savedSettings);
        toast.success("تم تحديث الإعدادات بنجاح");
        return true;
      } else {
        toast.error("فشل في تحديث الإعدادات");
        return false;
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error("حدث خطأ أثناء تحديث الإعدادات");
      return false;
    }
  };

  const handleSaveAllSettings = async () => {
    if (!settings) return;
    
    showConfirmation({
      title: "حفظ جميع الإعدادات",
      message: "هل أنت متأكد من حفظ جميع الإعدادات؟",
      variant: "primary",
      confirmText: "حفظ",
      onConfirm: async () => {
        try {
          const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
          });

          if (response.ok) {
            toast.success("تم حفظ جميع الإعدادات بنجاح");
            return true;
          } else {
            toast.error("فشل في حفظ الإعدادات");
            return false;
          }
        } catch (error) {
          console.error('Error saving all settings:', error);
          toast.error("حدث خطأ أثناء حفظ الإعدادات");
          return false;
        }
      },
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
      </div>
    </div>
  );

  const renderSection = () => {
    const sectionProps = { 
      settings, 
      onUpdate: updateSettings 
    };
    
    switch (activeSection) {
      case "tools": 
        return <SystemTools {...sectionProps} />;
      // Future sections can be added here
      // case "general": return <GeneralSettings {...sectionProps} />;
      // case "email": return <EmailSettings {...sectionProps} />;
      // case "jobs": return <JobSettings {...sectionProps} />;
      default: 
        return <SystemTools {...sectionProps} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onSaveAll={handleSaveAllSettings}
        />
      </div>
      <div className="lg:col-span-3">{renderSection()}</div>
    </div>
  );
}