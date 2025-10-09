// utils/toast.js
import { toast } from "react-hot-toast";

export const showToast = {
  // Success Messages
  success: (message = "تمت العملية بنجاح") => {
    toast.success(message);
  },
  
  error: (message = "حدث خطأ ما") => {
    toast.error(message);
  },
  
  // Specific job-related messages
  job: {
    created: () => toast.success("تم إنشاء الوظيفة بنجاح!"),
    updated: () => toast.success("تم تحديث الوظيفة بنجاح!"),
    deleted: () => toast.success("تم حذف الوظيفة بنجاح!"),
    draftSaved: () => toast.success("تم حفظ المسودة بنجاح!"),
    validationError: () => toast.error("يرجى ملء جميع الحقول المطلوبة"),
    networkError: () => toast.error("خطأ في الاتصال بالشبكة"),
  }
};