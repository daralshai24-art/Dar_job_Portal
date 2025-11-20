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

  const validateFile = useCallback((file) => {
    if (!file) {
      setErrors((prev) => ({ ...prev, cv: ERROR_MESSAGES.FILE_REQUIRED }));
      return false;
    }

    if (file.size > FORM_CONFIG.FILE.MAX_SIZE) {
      setErrors((prev) => ({ ...prev, cv: ERROR_MESSAGES.FILE_TOO_LARGE }));
      toast.error(ERROR_MESSAGES.FILE_TOO_LARGE);
      return false;
    }

    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!FORM_CONFIG.FILE.ALLOWED_TYPES.includes(fileExtension)) {
      setErrors((prev) => ({
        ...prev,
        cv: ERROR_MESSAGES.FILE_TYPE_NOT_SUPPORTED,
      }));
      toast.error(ERROR_MESSAGES.FILE_TYPE_NOT_SUPPORTED);
      return false;
    }

    // Clear file error if validation passes
    setErrors((prev) => ({ ...prev, cv: "" }));
    return true;
  }, []);

  const validatePhone = useCallback((phone) => {
    if (!phone) return true; // Phone is optional

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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
      }
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = errors.phone;
    }

    // CV validation
    if (!formData.cv) {
      newErrors.cv = ERROR_MESSAGES.FILE_REQUIRED;
    }
    // City validation
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "المدينة مطلوبة";
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
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  }, []);

  const formatPhoneNumber = useCallback((phone) => {
    if (!phone) return "";
    // Remove all non-numeric characters and convert to string
    return phone.replace(/\D/g, "");
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;

      if (name === "cv" && files?.[0]) {
        const file = files[0];
        if (validateFile(file)) {
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
