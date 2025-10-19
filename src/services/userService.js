// src/services/userService.js
import { getSession } from "next-auth/react";

// ==================== CONSTANTS ====================
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  HR_MANAGER: "hr_manager",
  HR_SPECIALIST: "hr_specialist",
  INTERVIEWER: "interviewer",
  VIEWER: "viewer",
};

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

export const DEPARTMENTS = {
  HR: "HR",
  IT: "IT",
  FINANCE: "Finance",
  OPERATIONS: "Operations",
  MARKETING: "Marketing",
  SALES: "Sales",
  OTHER: "Other",
};

// ==================== LABELS ====================
export const ROLE_LABELS = {
  super_admin: "مدير عام",
  admin: "مشرف",
  hr_manager: "مدير الموارد البشرية",
  hr_specialist: "أخصائي موارد بشرية",
  interviewer: "محاور",
  viewer: "مشاهد",
};

export const STATUS_LABELS = {
  active: "نشط",
  inactive: "غير نشط",
  suspended: "موقوف",
  pending: "قيد المراجعة",
};

export const DEPARTMENT_LABELS = {
  HR: "الموارد البشرية",
  IT: "تقنية المعلومات",
  Finance: "المالية",
  Operations: "العمليات",
  Marketing: "التسويق",
  Sales: "المبيعات",
  Other: "أخرى",
};

// ==================== UTILS ====================
export const getRoleLabel = (role) => ROLE_LABELS[role] || role;
export const getStatusLabel = (status) => STATUS_LABELS[status] || status;
export const getDepartmentLabel = (dept) => DEPARTMENT_LABELS[dept] || dept;

// ==================== AUTH HELPERS ====================
const getAuthHeaders = async () => {
  // Include session cookie
  const session = await getSession();
  if (!session) throw new Error("يجب تسجيل الدخول أولاً");

  return {
    "Content-Type": "application/json",
    // credentials are sent automatically with fetch if `credentials: "include"` is set
  };
};

// ==================== API CALLS ====================
export const fetchUsers = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.role && filters.role !== "all") queryParams.append("role", filters.role);
  if (filters.status && filters.status !== "all") queryParams.append("status", filters.status);
  if (filters.department && filters.department !== "all") queryParams.append("department", filters.department);

  const url = `/api/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const headers = await getAuthHeaders();

  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include", // ✅ ensures NextAuth session cookie is sent
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "فشل في تحميل المستخدمين");
  }

  return response.json();
};

export const fetchUser = async (userId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/users/${userId}`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "فشل في تحميل بيانات المستخدم");
  }
  return response.json();
};

export const createUser = async (userData) => {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/users", {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "فشل في إنشاء المستخدم");
  }

  return response.json();
};

export const updateUser = async (userId, userData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "فشل في تحديث المستخدم");
  }

  return response.json();
};

export const deleteUser = async (userId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "فشل في حذف المستخدم");
  }

  return response.json();
};

export const updateUserStatus = async (userId, status) => {
  return await updateUser(userId, { status });
};

export const resetUserPassword = async (userId, newPassword) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/users/${userId}/reset-password`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "فشل في إعادة تعيين كلمة المرور");
  }

  return response.json();
};

// ==================== OTHER HELPERS ====================
export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const validateUserData = (userData, isUpdate = false) => {
  const errors = [];

  if (!isUpdate && !userData.name?.trim()) errors.push("الاسم مطلوب");
  if (!isUpdate && !userData.email?.trim()) errors.push("البريد الإلكتروني مطلوب");
  if (userData.email && !isValidEmail(userData.email)) errors.push("البريد الإلكتروني غير صالح");
  if (!isUpdate && !userData.password) errors.push("كلمة المرور مطلوبة");
  if (userData.password && userData.password.length < 6) errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  if (!userData.role) errors.push("الدور الوظيفي مطلوب");

  return { isValid: errors.length === 0, errors };
};


// ==================== STATISTICS ====================

export const calculateUserStats = (users) => {
  return {
    total: users.length,
    active: users.filter((u) => u.status === USER_STATUS.ACTIVE).length,
    inactive: users.filter((u) => u.status === USER_STATUS.INACTIVE).length,
    suspended: users.filter((u) => u.status === USER_STATUS.SUSPENDED).length,
    pending: users.filter((u) => u.status === USER_STATUS.PENDING).length,
    byRole: {
      super_admin: users.filter((u) => u.role === USER_ROLES.SUPER_ADMIN).length,
      admin: users.filter((u) => u.role === USER_ROLES.ADMIN).length,
      hr_manager: users.filter((u) => u.role === USER_ROLES.HR_MANAGER).length,
      hr_specialist: users.filter((u) => u.role === USER_ROLES.HR_SPECIALIST).length,
      interviewer: users.filter((u) => u.role === USER_ROLES.INTERVIEWER).length,
      viewer: users.filter((u) => u.role === USER_ROLES.VIEWER).length,
    },
    byDepartment: users.reduce((acc, user) => {
      acc[user.department] = (acc[user.department] || 0) + 1;
      return acc;
    }, {}),
  };
};

// ==================== FORMATTING ====================

export const formatUserForDisplay = (user) => {
  return {
    ...user,
    roleLabel: getRoleLabel(user.role),
    statusLabel: getStatusLabel(user.status),
    departmentLabel: getDepartmentLabel(user.department),
    lastLoginFormatted: user.lastLogin 
      ? new Date(user.lastLogin).toLocaleDateString("ar-SA")
      : "لم يسجل دخول بعد",
    createdAtFormatted: new Date(user.createdAt).toLocaleDateString("ar-SA"),
  };
};

export const getUserInitials = (name) => {
  if (!name) return "؟";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const getUserAvatarColor = (email) => {
  const colors = [
    "#B38025", "#2C5F2D", "#1E3A5F", "#8B4513",
    "#2F4F4F", "#556B2F", "#8B0000", "#483D8B"
  ];
  
  if (!email) return colors[0];
  
  const hash = email.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};