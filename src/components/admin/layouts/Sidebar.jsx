//src\components\admin\layouts\Sidebar.jsx
"use client";

import { LogOut, X, LayoutDashboard, Briefcase, Users, FileText, Settings, UserCheck, Activity } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar({ currentUser, sidebarOpen, setSidebarOpen, onLogout }) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      name: "لوحة التحكم",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
      show: true,
    },
    {
      name: "إدارة الوظائف",
      href: "/admin/jobs",
      icon: Briefcase,
      active: pathname.startsWith("/admin/jobs"),
      show: currentUser?.permissions?.jobs?.view ?? true,
    },
    {
      name: "الطلبات",
      href: "/admin/applications",
      icon: FileText,
      active: pathname.startsWith("/admin/applications"),
      show: currentUser?.permissions?.applications?.view ?? true,
    },
    {
      name: "طلبات التوظيف",
      href: "/admin/hiring-requests",
      icon: Briefcase,
      active: pathname.startsWith("/admin/hiring-requests"),
      show: currentUser?.role === "admin" || currentUser?.role === "super_admin" || currentUser?.role === "hr_manager" || currentUser?.role === "department_manager",
    },
    {
      name: "لجان التوظيف",
      href: "/admin/committees",
      icon: UserCheck,
      active: pathname.startsWith("/admin/committees"),
      show: currentUser?.permissions?.committees?.view ?? true,
    },
    {
      name: "المستخدمون",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
      show: currentUser?.permissions?.users?.view ?? true,
    },
    {
      name: "حالة النظام",
      href: "/admin/system/status",
      icon: Activity,
      active: pathname.startsWith("/admin/system/status"),
      show: currentUser?.role === "super_admin" || currentUser?.role === "admin",
    },
    {
      name: "الإعدادات",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
      show:
        currentUser?.role === "super_admin" ||
        currentUser?.role === "admin" ||
        true,
    },
  ].filter((item) => item.show);

  const handleNavigation = (href) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <>
      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-green-900">
          <div className="lg:hidden w-6"></div>
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">لوحة الإدارة</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#F1DD8C] hover:text-white cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center justify-between px-4 py-3 text-right rounded-lg transition-colors duration-200 cursor-pointer 
                  ${item.active
                    ? "bg-green-900 text-white shadow-md border-r-4 border-[#F1DD8C]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-green-900 border-r-4 border-transparent"
                  }`}
              >
                <span className="font-medium">{item.name}</span>
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <span className="font-medium">تسجيل الخروج</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}

        />

      )}
    </>
  );
}
