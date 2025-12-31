// src/components/public/ApplicationForm/constants/formConfig.js
export const FORM_CONFIG = {
  INITIAL_STATE: {
    name: "",
    email: "",
    phone: "",
    nationality: "",
    city: "",
    cv: null,
    nationality: "",
    city: "",
    cv: null,
    experience: null,
    dataConfirmation: false
  },
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [".pdf", ".doc", ".docx"],
    ALLOWED_EXTENSIONS: ".pdf,.doc,.docx",
    MAX_SIZE_READABLE: "5 ميجابايت"
  },
  EXPERIENCE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
    ALLOWED_EXTENSIONS: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    MAX_SIZE_READABLE: "5 ميجابايت"
  },
  PHONE: {
    PATTERN: /^[0-9]*$/, // Only numbers allowed
    MIN_LENGTH: 10,
    MAX_LENGTH: 10
  }
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "يرجى ملء جميع الحقول المطلوبة",
  INVALID_EMAIL: "يرجى إدخال بريد إلكتروني صحيح",
  NATIONALITY_REQUIRED: "يرجى إدخال الجنسية",
  EXPERIENCE_REQUIRED: "يرجى رفع ملف الخبرات",
  FILE_TOO_LARGE: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
  FILE_TYPE_NOT_SUPPORTED: "نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word",
  EXPERIENCE_FILE_TYPE_NOT_SUPPORTED: "نوع الملف غير مدعوم. المسموح: PDF, Word, JPG, PNG",
  FILE_REQUIRED: "يرجى رفع السيرة الذاتية",
  EXPERIENCE_FILE_TOO_LARGE: "حجم ملف الخبرة يجب أن يكون أقل من 5 ميجابايت",
  PHONE_REQUIRED: "يرجى إدخال رقم الهاتف",
  PHONE_NUMBERS_ONLY: "يرجى إدخال أرقام فقط",
  PHONE_TOO_SHORT: "رقم الهاتف يجب أن يكون على الأقل 10 أرقام",
  PHONE_TOO_LONG: "رقم الهاتف يجب أن يكون أقل من 15 رقم",
  CONFIRMATION_REQUIRED: "يرجى تأكيد صحة البيانات",
  SUBMISSION_FAILED: "فشل في إرسال الطلب",
  SERVER_ERROR: "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى",
  NETWORK_ERROR: "خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
  CITY_REQUIRED: "يرجى اختيار المدينة",
};

export const SAUDI_CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "الأحساء",
  "حائل",
  "نجران",
  "جازان",
  "ينبع",
  "أبها",
  "عرعر",
  "سكاكا",
  "القطيف",
  "الجبيل"
];