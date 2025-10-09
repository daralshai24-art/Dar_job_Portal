"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

/**
 * Admin Layout Component - RTL Version
 * Provides navigation and layout structure for admin pages with RTL support
 *
 * Features:
 * - RTL (Right-to-Left) layout for Arabic
 * - Responsive sidebar navigation
 * - Active page highlighting
 * - Mobile menu toggle
 * - Arabic font support
 */
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items (Arabic text)
  const navigation = [
    {
      name: "لوحة التحكم",
      href: "/admin/",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "إدارة الوظائف",
      href: "/admin/jobs",
      icon: Briefcase,
      active: pathname.startsWith("/admin/jobs"),
    },
    {
      name: "الطلبات",
      href: "/admin/applications",
      icon: FileText,
      active: pathname.startsWith("/admin/applications"),
    },
    {
      name: "المستخدمون",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      name: "الإعدادات",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  /**
   * Handle navigation
   */
  const handleNavigation = (href) => {
    router.push(href);
    setSidebarOpen(false); // Close mobile menu after navigation
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-green-900">
          {/* Empty div for balance on desktop */}
          <div className="lg:hidden w-6"></div>
          
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#fff]">لوحة الإدارة</h1>
          </div>

          {/* Close button now on the right side */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#F1DD8C] hover:text-white cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-right rounded-lg transition-colors duration-200 cursor-pointer 
                  ${
                    item.active
                      ? "bg-green-900 text-white shadow-md border-r-4 border-[#F1DD8C]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-green-900 border-r-4 border-transparent"
                  }
                `}
              >
                {/* Text on the right */}
                <span className="font-medium">{item.name}</span>
                
                {/* Icon on the left (correct for RTL - icon ← text) */}
                <item.icon className="w-5 h-5 " />
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {/* Text on the right */}
            <span className="font-medium">تسجيل الخروج</span>
            
            {/* Icon on the left */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile Menu Button - Now on the right (start in RTL) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <Menu size={24} />
            </button>

            {/* Page Title - Properly centered */}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-800 text-center">
                {navigation.find((item) => item.active)?.name || "لوحة الإدارة"}
              </h1>
            </div>

            {/* User Info - Moved to the left (end in RTL) */}
            <div className="flex items-center space-x-3 ">
              <div className="w-8 h-8 bg-[#B38025] rounded-full flex items-center justify-center">
                <span className="text-white font-medium">أ</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  مستخدم الإدارة
                </div>
                <div className="text-xs text-gray-500">admin@example.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}