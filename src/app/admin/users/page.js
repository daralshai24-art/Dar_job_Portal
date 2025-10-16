// app/admin/users/page.jsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

// Hooks
import { useUsers } from "@/hooks/useUsers";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";

// Components
import Button from "@/components/shared/ui/Button";
import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";
import { UsersStats } from "@/components/admin/users/UsersStats";
import  {UsersFilters}  from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import  {UserFormModal}  from "@/components/admin/users/UserFormModal";

export default function UsersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const {
    users,
    loading,
    actionLoading,
    filters,
    stats,
    handleFilterChange,
    resetFilters,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleStatus,
    handleResetPassword,
    refresh,
  } = useUsers();

  const { modalState, showConfirmation, hideConfirmation } = useConfirmationModal();

  // ==================== HANDLERS ====================

  const handleCreate = () => {
    setEditingUser(null);
    setShowCreateModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData) => {
    let result;
    
    if (editingUser) {
      result = await handleUpdateUser(editingUser._id, userData);
    } else {
      result = await handleCreateUser(userData);
    }

    if (result.success) {
      handleCloseModal();
    }
  };

  const handleDeleteClick = (user) => {
    showConfirmation({
      title: "حذف المستخدم",
      message: `هل أنت متأكد من حذف المستخدم "${user.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف",
      cancelText: "إلغاء",
      variant: "danger",
      type: "delete",
      onConfirm: async () => {
        await handleDeleteUser(user._id);
        hideConfirmation();
      },
    });
  };

  const handleStatusToggle = (user) => {
    const isActivating = user.status !== "active";
    
    showConfirmation({
      title: isActivating ? "تفعيل المستخدم" : "إيقاف المستخدم",
      message: `هل أنت متأكد من ${isActivating ? "تفعيل" : "إيقاف"} المستخدم "${user.name}"؟`,
      confirmText: isActivating ? "تفعيل" : "إيقاف",
      cancelText: "إلغاء",
      variant: isActivating ? "success" : "warning",
      type: "status",
      onConfirm: async () => {
        await handleToggleStatus(user._id, user.status);
        hideConfirmation();
      },
    });
  };

  const handlePasswordReset = (user) => {
    const newPassword = prompt(`أدخل كلمة المرور الجديدة للمستخدم "${user.name}"`);
    
    if (newPassword) {
      handleResetPassword(user._id, newPassword);
    }
  };

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={hideConfirmation}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        variant={modalState.variant}
        type={modalState.type}
        loading={modalState.loading}
      />

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={editingUser}
        loading={actionLoading === "create" || actionLoading === editingUser?._id}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
          <p className="text-gray-600 mt-2">
            إدارة المستخدمين والصلاحيات والأدوار
          </p>
        </div>

        <Button onClick={handleCreate} size="lg">
          <Plus size={20} className="ml-2" />
          إضافة مستخدم جديد
        </Button>
      </div>

      {/* Statistics */}
      <UsersStats stats={stats} />

      {/* Filters */}
      <UsersFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        onRefresh={refresh}
        loading={loading}
        totalCount={stats.total}
        filteredCount={users.length}
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleStatus={handleStatusToggle}
        onResetPassword={handlePasswordReset}
        actionLoading={actionLoading}
        loading={loading}
      />
    </div>
  );
}