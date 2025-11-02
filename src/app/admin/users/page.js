"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

// Hooks
import { useUsers } from "@/hooks/useUsers";

// Components
import Button from "@/components/shared/ui/Button";
import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";
import { UsersStats } from "@/components/admin/users/UsersStats";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UserFormModal } from "@/components/admin/users/UserFormModal";

export default function UsersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  //  Modal State Fix
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "تأكيد",
    cancelText: "إلغاء",
    variant: "default",
    type: null,
    onConfirm: null,
    loading: false,
    password: "",
  });

  //  Show modal
  const showConfirmation = ({
    title,
    message = "",
    confirmText = "تأكيد",
    cancelText = "إلغاء",
    variant = "default",
    type = null,
    onConfirm,
  }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      variant,
      type,
      onConfirm,
      password: "",
      loading: false,
    });
  };

  //  Hide modal
  const hideConfirmation = () =>
    setModalState((prev) => ({ ...prev, isOpen: false, password: "" }));

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
      variant: isActivating ? "success" : "warning",
      type: "status",
      onConfirm: async () => {
        await handleToggleStatus(user._id, user.status);
        hideConfirmation();
      },
    });
  };

  //  Password Reset modal trigger
  const handlePasswordResetClick = (user) => {
    showConfirmation({
      title: "إعادة تعيين كلمة المرور",
      message: `أدخل كلمة المرور الجديدة للمستخدم "${user.name}"`,
      confirmText: "تأكيد",
      variant: "warning",
      type: "resetPassword",
      onConfirm: async (typedPassword) => {
        if (!typedPassword || typedPassword.length < 6) {
          toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
          return;
        }

        setModalState((p) => ({ ...p, loading: true }));

        const res = await handleResetPassword(user._id, typedPassword);

        setModalState((p) => ({ ...p, loading: false }));

        if (res.success) hideConfirmation();
      },
    });
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
        password={modalState.password}
        setModalState={setModalState}
      />

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={editingUser}
        loading={actionLoading === "create" || actionLoading === editingUser?._id}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
          <p className="text-gray-600 mt-2">إدارة المستخدمين والصلاحيات والأدوار</p>
        </div>

        <Button onClick={handleCreate} size="lg">
          <Plus size={20} className="ml-2" />
          إضافة مستخدم جديد
        </Button>
      </div>

      <UsersStats stats={stats} />

      <UsersFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        onRefresh={refresh}
        loading={loading}
        totalCount={stats.total}
        filteredCount={users.length}
      />

      <UsersTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleStatus={handleStatusToggle}
        onResetPassword={handlePasswordResetClick}
        actionLoading={actionLoading}
        loading={loading}
      />
    </div>
  );
}
