//src\components\admin\layouts\Header.jsx
"use client";

import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ currentUser, toggleSidebar, activePageName, onLogout }) {
  const router = useRouter();

  const getUserInitials = (name) => {
    if (!name) return "؟";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const goToProfile = () => {
    router.push(`/admin/users/${currentUser.id}`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-green-800 hover:text-gray-900 cursor-pointer"
        >
          <Menu size={24} />
        </button>

        {/* Page Title */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            {activePageName || "لوحة الإدارة"}
          </h1>
        </div>

        {/* User Section */}
        <div
          className="flex items-center cursor-pointer"
          onClick={goToProfile}
        >
          {/* Avatar */}
          <div className="w-12 h-12 bg-[#B38025] rounded-full flex items-center justify-center text-white font-medium text-lg">
            {getUserInitials(currentUser.name)}
          </div>

          {/* User Info */}
          <div className="text-right hidden md:flex flex-col justify-center mr-4">
            <div className="text-sm font-medium text-gray-700">{currentUser.name}</div>
            <div className="text-xs text-gray-400">{currentUser.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
