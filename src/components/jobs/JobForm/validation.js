// components/admin/jobs/validation.js
/**
 * Initial form data
 */
export const jobFormInitialData = {
  title: "",
  description: "",
  location: "",
  category: "", // Now stores category ID
  jobType: "Full-time",
  experience: "Entry Level",
  requirements: "",
  status: "draft",
};

/**
 * Validate job form data
 */
export const validateJobForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = "المسمى الوظيفي مطلوب";
  }

  if (!formData.description?.trim()) {
    errors.description = "الوصف الوظيفي مطلوب";
  }

  if (!formData.location?.trim()) {
    errors.location = "الموقع مطلوب";
  }

  if (!formData.category?.trim()) {
    errors.category = "التصنيف مطلوب";
  }

  return errors;
};

/**
 * Check if form has changes (for edit mode)
 */
export const hasFormChanges = (formData, initialData) => {
  if (!initialData) return true; // Create mode always has "changes"
  
  return Object.keys(jobFormInitialData).some(key => {
    return formData[key] !== initialData[key];
  });
};

/**
 * Prepare form data for API submission
 */
export const prepareJobData = (formData, userId) => {
  return {
    title: formData.title?.trim() || "",
    description: formData.description?.trim() || "",
    location: formData.location?.trim() || "",
    category: formData.category, // This is now the category ID
    jobType: formData.jobType || "Full-time",
    experience: formData.experience || "Entry Level",
    requirements: formData.requirements?.trim() || "",
    status: formData.status || "draft",
    // Add user ID for createdBy field if in create mode
    ...(userId && { createdBy: userId })
  };
};