// src/components/public/ApplicationForm/JobApplicationForm.jsx
"use client";

import FormHeader from "./components/FormHeader";
import FormInput from "./components/FormInput";
import FileUpload from "./components/FileUpload";
import SubmitButton from "./components/SubmitButton";
import PrivacyNotice from "./components/PrivacyNotice";
import { useJobApplication } from "./hooks/useJobApplicationForm";

const JobApplicationForm = ({ job }) => {
  const { 
    formData, 
    submitting, 
    errors,
    handleInputChange, 
    handleSubmit 
  } = useJobApplication(job);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
      <FormHeader />
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormInput
          label="الاسم الكامل *"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="أدخل اسمك الكامل"
          error={errors.name}
          required
        />

        <FormInput
          label="البريد الإلكتروني *"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="example@email.com"
          error={errors.email}
          required
        />

        <FormInput
          label="رقم الهاتف"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="05xxxxxxxx"
          error={errors.phone}
          required
        />

        <FileUpload
          file={formData.cv}
          onChange={handleInputChange}
          error={errors.cv}
          required
        />

        <SubmitButton
          submitting={submitting}
          jobStatus={job?.status}
        />

        <PrivacyNotice />
      </form>
    </div>
  );
};

export default JobApplicationForm;