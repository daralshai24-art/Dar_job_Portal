// src/components/public/ApplicationForm/hooks/useJobApplicationForm.js
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { FORM_CONFIG, ERROR_MESSAGES } from "../constants/formConfig";

export const useJobApplication = (job) => {
  const [formData, setFormData] = useState(FORM_CONFIG.INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormField = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validateFile = useCallback((file, fieldName = "cv") => {
    // Determine config based on field name
    const config = fieldName === "experience" ? FORM_CONFIG.EXPERIENCE : FORM_CONFIG.FILE;
    const requiredError = fieldName === "experience" ? ERROR_MESSAGES.EXPERIENCE_REQUIRED : ERROR_MESSAGES.FILE_REQUIRED;

    if (!file) {
      if (fieldName === "cv" || fieldName === "experience") {
        setErrors((prev) => ({ ...prev, [fieldName]: requiredError }));
        return false;
      }
      return true; // Experience is optional by default unless we decide otherwise
    }

    if (file.size > config.MAX_SIZE) {
      const msg = fieldName === "experience" ? ERROR_MESSAGES.EXPERIENCE_FILE_TOO_LARGE : ERROR_MESSAGES.FILE_TOO_LARGE;
      setErrors((prev) => ({ ...prev, [fieldName]: msg }));
      toast.error(msg);
      return false;
    }

    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!config.ALLOWED_TYPES.includes(fileExtension)) {
      const msg = fieldName === "experience" ? ERROR_MESSAGES.EXPERIENCE_FILE_TYPE_NOT_SUPPORTED : ERROR_MESSAGES.FILE_TYPE_NOT_SUPPORTED;
      setErrors((prev) => ({
        ...prev,
        [fieldName]: msg,
      }));
      toast.error(msg);
      return false;
    }

    // Clear file error if validation passes
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    return true;
  }, []);

  const validatePhone = useCallback((phone) => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: ERROR_MESSAGES.PHONE_REQUIRED }));
      return false;
    }

    // Remove any non-numeric characters
    const numericPhone = phone.replace(/\D/g, "");

    if (!FORM_CONFIG.PHONE.PATTERN.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: ERROR_MESSAGES.PHONE_NUMBERS_ONLY,
      }));
      return false;
    }

    if (numericPhone.length < FORM_CONFIG.PHONE.MIN_LENGTH) {
      setErrors((prev) => ({ ...prev, phone: ERROR_MESSAGES.PHONE_TOO_SHORT }));
      return false;
    }

    if (numericPhone.length > FORM_CONFIG.PHONE.MAX_LENGTH) {
      setErrors((prev) => ({ ...prev, phone: ERROR_MESSAGES.PHONE_TOO_LONG }));
      return false;
    }

    // Clear phone error if validation passes
    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "الاسم الكامل مطلوب";
    }

    // Nationality validation
    if (!formData.nationality.trim()) {
      newErrors.nationality = ERROR_MESSAGES.NATIONALITY_REQUIRED;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
      }
    }

    // Phone validation
    if (!validatePhone(formData.phone)) {
      newErrors.phone = errors.phone || ERROR_MESSAGES.PHONE_REQUIRED;
    }

    // CV validation
    if (!formData.cv) {
      newErrors.cv = ERROR_MESSAGES.FILE_REQUIRED;
    }

    // Experience validation
    if (!formData.experience) {
      newErrors.experience = ERROR_MESSAGES.EXPERIENCE_REQUIRED;
    }
    // City validation
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "المدينة مطلوبة";
    }

    // Confirmation validation
    if (!formData.dataConfirmation) {
      newErrors.dataConfirmation = ERROR_MESSAGES.CONFIRMATION_REQUIRED;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }, [formData, validatePhone, errors.phone]);

  const resetForm = useCallback(() => {
    setFormData(FORM_CONFIG.INITIAL_STATE);
    setErrors({});
    setFormData(FORM_CONFIG.INITIAL_STATE);
    setErrors({});
    // Reset all file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = "");
  }, []);

  const formatPhoneNumber = useCallback((phone) => {
    if (!phone) return "";
    // Remove all non-numeric characters and convert to string
    return phone.replace(/\D/g, "");
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, files, type, checked } = e.target;

      if ((name === "cv" || name === "experience") && files?.[0]) {
        const file = files[0];
        if (validateFile(file, name)) {
          updateFormField(name, file);
        } else {
          // Reset file input if validation fails
          e.target.value = "";
        }
      } else if (name === "phone") {
        // For phone field, only allow numbers and format immediately
        const numericValue = value.replace(/\D/g, "");
        updateFormField(name, numericValue);

        // Validate phone in real-time if user has entered something
        if (numericValue) {
          validatePhone(numericValue);
        } else {
          // Clear phone error if field is empty
          setErrors((prev) => ({ ...prev, phone: "" }));
        }
      } else if (type === "checkbox") {
        updateFormField(name, checked);
      } else {
        updateFormField(name, value);
      }
    },
    [validateFile, updateFormField, validatePhone]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("jobId", job._id);
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("email", formData.email.trim().toLowerCase());
      formDataToSend.append("city", formData.city);

      const formattedPhone = formatPhoneNumber(formData.phone);
      formDataToSend.append("phone", formattedPhone);

      if (formData.cv) {
        formDataToSend.append("cv", formData.cv);
      }

      if (formData.nationality) {
        formDataToSend.append("nationality", formData.nationality.trim());
      }

      if (formData.experience) {
        formDataToSend.append("experience", formData.experience);
      }

      formDataToSend.append("dataConfirmation", formData.dataConfirmation);

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formDataToSend,
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }

      if (!response.ok) {
        throw new Error(result.error || ERROR_MESSAGES.SUBMISSION_FAILED);
      }

      // ✅ UPDATED: Add duration to success toast
      toast.success(
        result.message || "تم إرسال طلب التوظيف بنجاح! سيتم التواصل معك قريباً",
        {
          duration: 6000,
        }
      );
      resetForm();
    } catch (error) {
      console.error("Application submission error:", error);

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    submitting,
    errors,
    handleInputChange,
    handleSubmit,
    validateFile,
  };
};

// Export for FileUpload component
export { FORM_CONFIG };
