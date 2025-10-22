// src/components/admin/dashboard/QuickActions.jsx
import QuickActionButton from "./QuickActionButton";
import { Plus, FileText, Eye, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions({ className = "" }) {
  const router = useRouter();

  const actions = [
    {
      title: "إنشاء وظيفة جديدة",
      description: "إضافة وظيفة جديدة إلى الموقع",
      icon: Plus,
      action: () => router.push('/admin/jobs/create'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "عرض جميع الطلبات",
      description: "إدارة طلبات التوظيف",
      icon: FileText,
      action: () => router.push('/admin/applications'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "معاينة الموقع",
      description: "عرض الموقع كزائر",
      icon: Eye,
      action: () => window.open('/', '_blank'),
      color: "bg-gray-500 hover:bg-gray-600"
    },
    {
      title: "الإعدادات",
      description: "إعدادات النظام",
      icon: Settings,
      action: () => router.push('/admin/settings'),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 transition-colors duration-300 hover:text-gray-900">
        الإجراءات السريعة
      </h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  );
}