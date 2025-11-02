//src\components\admin\layouts\AdminLayout.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const router = useRouter();
  const path = usePathname(); 
  const { user, logout, isLoading } = useAuth();

  const currentUser = user;

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace("/login");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-2">
          <p>جارٍ التحقق من تسجيل الدخول...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Determine active page name
  const activePageName = (() => {
    if (!path) return "لوحة الإدارة"; // safety check
    if (path.startsWith("/admin/jobs")) return "إدارة الوظائف";
    if (path.startsWith("/admin/applications")) return "الطلبات";
    if (path.startsWith("/admin/users")) return "المستخدمون";
    if (path.startsWith("/admin/settings")) return "الإعدادات";
    return "لوحة الإدارة";
  })();

  // Logout handlers
  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogoutClick}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentUser={currentUser}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activePageName={activePageName}
          onLogout={handleLogoutClick}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="تسجيل الخروج"
        message="هل أنت متأكد من تسجيل الخروج من لوحة الإدارة؟"
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        variant="danger"
        type="status"
      />
    </div>
  );
}
