// src/services/user/userBusinessService.js
// ==================== BUSINESS LOGIC - SEPARATE FROM DATABASE ====================

import User from "@/models/user";
import { getRolePermissions } from "./permissions";
import { validateUserData } from "./validation";

// ==================== USER OPERATIONS ====================

export class UserBusinessService {
  /**
   * Create a new user with proper permissions
   */
  static async createUser(userData) {
    // Validate data
    const validation = validateUserData(userData, false);
    if (!validation.isValid) {
      throw new Error(validation.errors[0]);
    }

    // Check if email exists
    const existingUser = await User.findOne({ 
      email: userData.email.toLowerCase() 
    });
    
    if (existingUser) {
      throw new Error("البريد الإلكتروني مستخدم بالفعل");
    }

    // Set role-based permissions
    const permissions = getRolePermissions(userData.role);

    // Create user
    const user = await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
      permissions,
      status: userData.status || "active",
    });

    // Return without password
    return await User.findById(user._id).select("-password");
  }

  /**
   * Update user with validation
   */
  static async updateUser(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    // Check email uniqueness if changing
    if (updateData.email && updateData.email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ 
        email: updateData.email.toLowerCase() 
      });
      if (existingUser) {
        throw new Error("البريد الإلكتروني مستخدم بالفعل");
      }
    }

    // Update permissions if role changed
    if (updateData.role && updateData.role !== user.role) {
      updateData.permissions = getRolePermissions(updateData.role);
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    await user.save();

    return await User.findById(user._id).select("-password");
  }

  /**
   * Delete user with protection
   */
  static async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    // Protect super admin
    if (user.role === "super_admin") {
      throw new Error("لا يمكن حذف المدير العام");
    }

    await User.findByIdAndDelete(userId);
    return { message: "تم حذف المستخدم بنجاح" };
  }

  /**
   * Update user status
   */
  static async updateStatus(userId, newStatus) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    user.status = newStatus;
    await user.save();

    return await User.findById(user._id).select("-password");
  }

  /**
   * Reset user password
   */
  static async resetPassword(userId, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    user.password = newPassword;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return { message: "تم إعادة تعيين كلمة المرور بنجاح" };
  }

  /**
   * Handle login attempt
   */
  static async handleLoginAttempt(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!user) {
      throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    // Check if locked
    if (user.isLocked()) {
      throw new Error("الحساب مقفل. حاول مرة أخرى بعد 30 دقيقة");
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment attempts
      user.loginAttempts += 1;
      
      // Lock after 5 attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      
      await user.save();
      throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    // Success - reset attempts and update login time
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    user.lastActivity = new Date();
    await user.save();

    // Return user without password
    return await User.findById(user._id).select("-password");
  }

  /**
   * Check if user has permission
   */
  static hasPermission(user, module, action) {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    return user.permissions?.[module]?.[action] === true;
  }

  /**
   * Update user permissions (custom)
   */
  static async updatePermissions(userId, customPermissions) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    user.permissions = customPermissions;
    await user.save();

    return await User.findById(user._id).select("-password");
  }
}