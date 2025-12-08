// src/services/user/permissions.js
// ==================== ROLE-BASED PERMISSIONS CONFIGURATION ====================

export const PERMISSIONS_CONFIG = {
  super_admin: {
    jobs: { create: true, edit: true, delete: true, view: true, publish: true },
    applications: {
      view: true,
      review: true,
      schedule: true,
      interview: true,
      hire: true,
      reject: true
    },
    users: { create: true, edit: true, delete: true, view: true },
    categories: { create: true, edit: true, delete: true },
    reports: { view: true, export: true },
  },

  admin: {
    jobs: { create: true, edit: true, delete: true, view: true, publish: true },
    applications: {
      view: true,
      review: true,
      schedule: true,
      interview: true,
      hire: true,
      reject: true
    },
    users: { create: true, edit: true, delete: false, view: true },
    categories: { create: true, edit: true, delete: true },
    reports: { view: true, export: true },
  },

  hr_manager: {
    jobs: { create: true, edit: true, delete: false, view: true, publish: true },
    applications: {
      view: true,
      review: true,
      schedule: true,
      interview: true,
      hire: true,
      reject: true
    },
    users: { create: false, edit: false, delete: false, view: true },
    categories: { create: true, edit: true, delete: false },
    reports: { view: true, export: true },
  },

  hr_specialist: {
    jobs: { create: true, edit: true, delete: false, view: true, publish: false },
    applications: {
      view: true,
      review: true,
      schedule: true,
      interview: false,
      hire: false,
      reject: false
    },
    users: { create: false, edit: false, delete: false, view: true },
    categories: { create: false, edit: false, delete: false },
    reports: { view: true, export: false },
  },

  department_manager: {
    jobs: { create: false, edit: false, delete: false, view: true, publish: false },
    applications: {
      view: true,
      review: true,
      schedule: true,
      interview: true,
      hire: false,
      reject: false
    },
    users: { create: false, edit: false, delete: false, view: true },
    categories: { create: false, edit: false, delete: false },
    reports: { view: true, export: true },
  },

  head_of_department: {
    jobs: { create: false, edit: false, delete: false, view: true, publish: false },
    applications: {
      view: true,
      review: true,
      schedule: true,
      interview: true,
      hire: false,
      reject: false
    },
    users: { create: false, edit: false, delete: false, view: true },
    categories: { create: false, edit: false, delete: false },
    reports: { view: true, export: true },
  },

  direct_manager: {
    jobs: { create: false, edit: false, delete: false, view: true, publish: false },
    applications: {
      view: true,
      review: true,
      schedule: true,
      interview: true,
      hire: false,
      reject: false
    },
    users: { create: false, edit: false, delete: false, view: true },
    categories: { create: false, edit: false, delete: false },
    reports: { view: true, export: false },
  },

  interviewer: {
    jobs: { create: false, edit: false, delete: false, view: true, publish: false },
    applications: {
      view: true,
      review: false,
      schedule: false,
      interview: true,
      hire: false,
      reject: false
    },
    users: { create: false, edit: false, delete: false, view: false },
    categories: { create: false, edit: false, delete: false },
    reports: { view: false, export: false },
  },

  viewer: {
    jobs: { create: false, edit: false, delete: false, view: true, publish: false },
    applications: {
      view: true,
      review: false,
      schedule: false,
      interview: false,
      hire: false,
      reject: false
    },
    users: { create: false, edit: false, delete: false, view: false },
    categories: { create: false, edit: false, delete: false },
    reports: { view: false, export: false },
  },
};

/**
 * Get permissions for a role
 */
export function getRolePermissions(role) {
  return PERMISSIONS_CONFIG[role] || PERMISSIONS_CONFIG.viewer;
}

/**
 * Check if role exists
 */
export function isValidRole(role) {
  return role in PERMISSIONS_CONFIG;
}

/**
 * Get all available roles
 */
export function getAllRoles() {
  return Object.keys(PERMISSIONS_CONFIG);
}

/**
 * Compare two roles (returns 1 if role1 > role2, -1 if role1 < role2, 0 if equal)
 */
export function compareRoles(role1, role2) {
  const hierarchy = [
    "viewer",
    "interviewer",
    "direct_manager",
    "head_of_department",
    "department_manager",
    "hr_specialist",
    "hr_manager",
    "admin",
    "super_admin"
  ];

  const index1 = hierarchy.indexOf(role1);
  const index2 = hierarchy.indexOf(role2);

  if (index1 > index2) return 1;
  if (index1 < index2) return -1;
  return 0;
}

/**
 * Check if role1 can manage role2
 */
export function canManageRole(managerRole, targetRole) {
  // Super admin can manage everyone
  if (managerRole === "super_admin") return true;

  // Admin can manage everyone except super admin
  if (managerRole === "admin" && targetRole !== "super_admin") return true;

  // Others cannot manage anyone
  return false;
}