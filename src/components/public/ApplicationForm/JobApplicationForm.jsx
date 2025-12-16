// src/components/public/ApplicationForm/JobApplicationForm.jsx
"use client";

import FormHeader from "./components/FormHeader";
import FormInput from "./components/FormInput";
import FileUpload from "./components/FileUpload";
import SubmitButton from "./components/SubmitButton";
import PrivacyNotice from "./components/PrivacyNotice";
import CitySelect from "./components/CitySelect";
import { SAUDI_CITIES, FORM_CONFIG } from "./constants/formConfig";
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

      <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
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
          label="رقم الهاتف *"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="05xxxxxxxx"
          error={errors.phone}
          required
        />
        <CitySelect
          value={formData.city}
          onChange={handleInputChange}
          error={errors.city}
          required
        />

        <FormInput
          label="الجنسية *"
          name="nationality"
          value={formData.nationality}
          onChange={handleInputChange}
          placeholder="أدخل جنسيتك"
          error={errors.nationality}
          required
        />

        <FileUpload
          label="السيرة الذاتية *"
          name="cv"
          file={formData.cv}
          onChange={handleInputChange}
          error={errors.cv}
          required={true}
          accept={FORM_CONFIG.FILE.ALLOWED_EXTENSIONS}
          maxSizeText={FORM_CONFIG.FILE.MAX_SIZE_READABLE}
          description="PDF, DOC, DOCX"
        />

        <FileUpload
          label="الخبرات *"
          name="experience"
          file={formData.experience}
          onChange={handleInputChange}
          error={errors.experience}
          required={true}
          accept={FORM_CONFIG.EXPERIENCE.ALLOWED_EXTENSIONS}
          maxSizeText={FORM_CONFIG.EXPERIENCE.MAX_SIZE_READABLE}
          description="PDF, Word, JPG, PNG"
        />

        <div className="flex flex-col space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="dataConfirmation"
                checked={formData.dataConfirmation}
                onChange={handleInputChange}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-[#B38025] checked:bg-[#B38025]"
                required
              />
              <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 select-none">
              أقر بأن جميع البيانات المدخلة صحيحة وعلى مسؤوليتي الشخصية
            </span>
          </label>
          {errors.dataConfirmation && (
            <p className="text-sm text-red-600 mr-8">{errors.dataConfirmation}</p>
          )}
        </div>

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