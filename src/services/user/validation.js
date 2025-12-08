// src/services/user/validation.js
// ==================== VALIDATION LOGIC ====================

import { isValidRole } from "./permissions";

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

/**
 * Validate phone number (Saudi format)
 */
export function isValidPhone(phone) {
  if (!phone) return true; // Optional field
  return /^(05|5)[0-9]{8}$/.test(phone.replace(/\s+/g, ""));
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push("كلمة المرور مطلوبة");
    return { isValid: false, errors };
  }

  if (password.length < 6) {
    errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  }

  if (password.length > 128) {
    errors.push("كلمة المرور طويلة جداً");
  }

  // Optional: Add strength requirements
  // if (!/[A-Z]/.test(password)) errors.push("يجب أن تحتوي على حرف كبير");
  // if (!/[a-z]/.test(password)) errors.push("يجب أن تحتوي على حرف صغير");
  // if (!/[0-9]/.test(password)) errors.push("يجب أن تحتوي على رقم");

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate user data
 */
export function validateUserData(userData, isUpdate = false) {
  const errors = [];

  // Name validation
  if (!isUpdate || userData.name !== undefined) {
    if (!userData.name?.trim()) {
      errors.push("الاسم مطلوب");
    } else if (userData.name.trim().length < 2) {
      errors.push("الاسم يجب أن يكون حرفين على الأقل");
    } else if (userData.name.trim().length > 100) {
      errors.push("الاسم طويل جداً");
    }
  }

  // Email validation
  if (!isUpdate || userData.email !== undefined) {
    if (!userData.email?.trim()) {
      errors.push("البريد الإلكتروني مطلوب");
    } else if (!isValidEmail(userData.email)) {
      errors.push("البريد الإلكتروني غير صالح");
    }
  }

  // Password validation (only for new users or if password is being changed)
  if (!isUpdate && userData.password !== undefined) {
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // Confirm password match
    if (userData.confirmPassword !== userData.password) {
      errors.push("كلمة المرور غير متطابقة");
    }
  } else if (isUpdate && userData.password) {
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }

  // Role validation
  if (!isUpdate || userData.role !== undefined) {
    if (!userData.role) {
      errors.push("الدور الوظيفي مطلوب");
    } else if (!isValidRole(userData.role)) {
      errors.push("الدور الوظيفي غير صالح");
    }
  }

  // Phone validation
  if (userData.phone && !isValidPhone(userData.phone)) {
    errors.push("رقم الهاتف غير صالح. الصيغة الصحيحة: 05xxxxxxxx");
  }

  // Bio length validation
  if (userData.bio && userData.bio.length > 500) {
    errors.push("النبذة لا يمكن أن تتجاوز 500 حرف");
  }

  // Status validation
  const validStatuses = ["active", "inactive", "suspended", "pending"];
  if (userData.status && !validStatuses.includes(userData.status)) {
    errors.push("الحالة غير صالحة");
  }

  // Department validation
  const validDepartments = ["HR", "IT", "Finance", "Operations", "Marketing", "Sales", "Other"];
  if (userData.department && !validDepartments.includes(userData.department)) {
    errors.push("القسم غير صالح");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input
 */
export function sanitizeUserInput(userData) {
  const sanitized = { ...userData };

  // Trim strings
  if (sanitized.name) sanitized.name = sanitized.name.trim();
  if (sanitized.email) sanitized.email = sanitized.email.trim().toLowerCase();
  if (sanitized.phone) sanitized.phone = sanitized.phone.replace(/\s+/g, "");
  if (sanitized.position) sanitized.position = sanitized.position.trim();
  if (sanitized.bio) sanitized.bio = sanitized.bio.trim();

  // Boolean Flags (Maintain explicit boolean values)
  if (userData.isDefaultCommitteeMember !== undefined) {
    sanitized.isDefaultCommitteeMember = userData.isDefaultCommitteeMember;
  }

  // Remove undefined/null values but KEEP false/boolean/0
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined || sanitized[key] === null || sanitized[key] === "") {
      delete sanitized[key];
    }
  });

  return sanitized;
}

/**
 * Validate bulk user data (for imports)
 */
export function validateBulkUsers(users) {
  const results = [];
  const emails = new Set();

  users.forEach((user, index) => {
    const validation = validateUserData(user, false);

    // Check for duplicate emails in the batch
    if (user.email && emails.has(user.email.toLowerCase())) {
      validation.isValid = false;
      validation.errors.push("البريد الإلكتروني مكرر في البيانات المرفوعة");
    } else if (user.email) {
      emails.add(user.email.toLowerCase());
    }

    results.push({
      index: index + 1,
      user,
      ...validation
    });
  });

  return {
    isValid: results.every(r => r.isValid),
    results,
    validCount: results.filter(r => r.isValid).length,
    invalidCount: results.filter(r => !r.isValid).length
  };
}