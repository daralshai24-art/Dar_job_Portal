// src/hooks/useUsers.js
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import * as userService from "@/services/userService";

export const useUsers = (initialFilters = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    department: "all",
    ...initialFilters,
  });

  // ==================== FETCH USERS ====================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.fetchUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "فشل في تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  // ==================== FILTER HANDLERS ====================
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
      department: "all",
    });
  };

  // ==================== CRUD OPERATIONS ====================
  const handleCreateUser = async (userData) => {
    const validation = userService.validateUserData(userData, false);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return { success: false, errors: validation.errors };
    }

    try {
      setActionLoading("create");
      await userService.createUser(userData);
      toast.success("تم إنشاء المستخدم بنجاح");
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message || "فشل في إنشاء المستخدم");
      return { success: false, error: error.message };
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    const validation = userService.validateUserData(userData, true);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return { success: false, errors: validation.errors };
    }

    try {
      setActionLoading(userId);
      await userService.updateUser(userId, userData);
      toast.success("تم تحديث المستخدم بنجاح");
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "فشل في تحديث المستخدم");
      return { success: false, error: error.message };
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setActionLoading(userId);
      await userService.deleteUser(userId);
      toast.success("تم حذف المستخدم بنجاح");
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "فشل في حذف المستخدم");
      return { success: false, error: error.message };
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== STATUS OPERATIONS ====================
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      setActionLoading(userId);
      await userService.updateUserStatus(userId, newStatus);
      toast.success("تم تحديث حالة المستخدم بنجاح");
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "فشل في تحديث الحالة");
      return { success: false, error: error.message };
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = 
      currentStatus === userService.USER_STATUS.ACTIVE
        ? userService.USER_STATUS.INACTIVE
        : userService.USER_STATUS.ACTIVE;
    
    return await handleUpdateStatus(userId, newStatus);
  };

  // ==================== PASSWORD OPERATIONS ====================
  const handleResetPassword = async (userId, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return { success: false };
    }

    try {
      setActionLoading(userId);
      await userService.resetUserPassword(userId, newPassword);
      toast.success("تم إعادة تعيين كلمة المرور بنجاح");
      return { success: true };
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "فشل في إعادة تعيين كلمة المرور");
      return { success: false, error: error.message };
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== STATISTICS ====================
  const stats = userService.calculateUserStats(users);

  // ==================== COMPUTED VALUES ====================
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !filters.search ||
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole = filters.role === "all" || user.role === filters.role;
    const matchesStatus = filters.status === "all" || user.status === filters.status;
    const matchesDepartment = filters.department === "all" || user.department === filters.department;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchUsers();
  }, [filters.role, filters.status, filters.department]); // Refetch when filters change

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    // Data
    users: filteredUsers,
    allUsers: users,
    loading,
    actionLoading,
    filters,
    stats,

    // Filter actions
    handleFilterChange,
    resetFilters,

    // CRUD actions
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    
    // Status actions
    handleUpdateStatus,
    handleToggleStatus,
    
    // Password actions
    handleResetPassword,

    // Refresh
    refresh: fetchUsers,
  };
};