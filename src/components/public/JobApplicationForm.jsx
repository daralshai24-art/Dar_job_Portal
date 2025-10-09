// components/jobs/public/JobApplicationForm.jsx
"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { toast } from "react-hot-toast";

const JobApplicationForm = ({ job, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cv" && files) {
      const file = files[0];
      if (!validateFile(file)) return;
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = [".pdf", ".doc", ".docx"];

    if (file.size > maxSize) {
      toast.error("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
      return false;
    }

    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error("نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setSubmitting(true);
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('jobId', job._id);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    
    if (formData.cv) {
      formDataToSend.append('cv', formData.cv);
    }

    const response = await fetch('/api/applications', {
      method: 'POST',
      body: formDataToSend,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'فشل في إرسال الطلب');
    }
    
    toast.success("تم إرسال طلب التوظيف بنجاح! سيتم التواصل معك قريباً");
    
    // Reset form
    setFormData({ 
      name: "", 
      email: "", 
      phone: "", 
      cv: null 
    });
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
    
  } catch (error) {
    console.error('Application error:', error);
    toast.error(error.message || "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى");
  } finally {
    setSubmitting(false);
  }
};

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.cv) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return false;
    }

    return true;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
      <div className="bg-[#B38025] text-white p-6">
        <h2 className="text-2xl font-semibold mb-2">قدم على هذه الوظيفة</h2>
        <p className="text-[#F1DD8C] text-sm">
          املأ النموذج أدناه وسيتم التواصل معك قريباً
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormInput
          label="الاسم الكامل *"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="أدخل اسمك الكامل"
          required
        />

        <FormInput
          label="البريد الإلكتروني *"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="example@email.com"
          required
        />

        <FormInput
          label="رقم الهاتف"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="05xxxxxxxx"
        />

        <FileUpload
          file={formData.cv}
          onChange={handleInputChange}
          required
        />

        <SubmitButton
          submitting={submitting}
          jobStatus={job.status}
        />

        <PrivacyNotice />
      </form>
    </div>
  );
};

const FormInput = ({ label, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent transition-colors"
      {...props}
    />
  </div>
);

const FileUpload = ({ file, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      السيرة الذاتية *
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#B38025] transition-colors">
      <input
        type="file"
        name="cv"
        onChange={onChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
        id="cv-upload"
        required={required}
      />
      <label htmlFor="cv-upload" className="cursor-pointer">
        <div className="text-gray-600 mb-2">
          <FileText size={24} className="mx-auto mb-2 text-[#B38025]" />
          {file ? (
            <span className="text-green-600 font-medium">{file.name}</span>
          ) : (
            <>
              <p className="font-medium">اضغط لرفع السيرة الذاتية</p>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX (حد أقصى 5MB)</p>
            </>
          )}
        </div>
      </label>
    </div>
  </div>
);

const SubmitButton = ({ submitting, jobStatus }) => (
  <button
    type="submit"
    disabled={submitting || jobStatus !== "active"}
    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
      jobStatus === "active"
        ? submitting
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-[#B38025] text-white hover:bg-[#D6B666] hover:text-[#1D3D1E] shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
  >
    {submitting
      ? "جاري الإرسال..."
      : jobStatus === "active"
      ? "قدم الآن"
      : "الوظيفة غير متاحة للتقديم"}
  </button>
);

const PrivacyNotice = () => (
  <p className="text-xs text-gray-500 text-center leading-relaxed">
    بإرسال هذا النموذج، أنت توافق على معالجة بياناتك الشخصية
    وفقاً لسياسة الخصوصية الخاصة بنا
  </p>
);

export default JobApplicationForm;