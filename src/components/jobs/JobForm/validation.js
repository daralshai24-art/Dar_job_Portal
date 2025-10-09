// components/jobs/JobForm/validation.js
/**
 * Job Form Validation Rules
 */

export const validateJobForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = "عنوان الوظيفة مطلوب";
  }

  if (!formData.description?.trim()) {
    errors.description = "وصف الوظيفة مطلوب";
  }

  if (!formData.location?.trim()) {
    errors.location = "موقع الوظيفة مطلوب";
  }

  return errors;
};

export const jobFormInitialData = {
  title: "",
  description: "",
  location: "",
  salary: "",
  category: "",
  jobType: "Full-time",
  experience: "Entry Level",
  requirements: "",
  status: "draft",
};