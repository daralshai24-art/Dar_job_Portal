// components/admin/jobs/JobForm.jsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';
import { useRef } from 'react';

// Dynamically import React Select with SSR disabled
const Select = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => (
    <div className="w-full border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 bg-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
});

// Shared UI Components
import Button from "@/components/shared/ui/Button";
import Textarea from "@/components/shared/ui/Textarea";

// Custom Hooks and Components
import { useJobForm } from "./hooks/useJobForm";
import DynamicSelectWithAdd from "./components/DynamicSelectWithAdd";
import FormHeader from "./components/FormHeader";
import FormActions from "./components/FormActions";

// Form configuration
import { formFields, getStatusExplanation } from "./config/formConfig";

// Custom styles for React Select
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#D6B666' : '#d1d5db',
    borderRadius: '12px',
    padding: '2px 4px',
    textAlign: 'right',
    minHeight: '44px',
    fontSize: '14px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(214, 182, 102, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#D6B666' : '#9ca3af'
    },
    '@media (min-width: 768px)': {
      minHeight: '52px',
    }
  }),
  menu: (base) => ({
    ...base,
    textAlign: 'right',
    borderRadius: '12px',
    overflow: 'hidden',
    fontSize: '14px',
  }),
  option: (base, state) => ({
    ...base,
    textAlign: 'right',
    fontSize: '14px',
    padding: '8px 12px',
    backgroundColor: state.isSelected ? '#D6B666' : state.isFocused ? '#fef6e6' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    '&:hover': {
      backgroundColor: state.isSelected ? '#D6B666' : '#fef6e6'
    }
  }),
  placeholder: (base) => ({
    ...base,
    textAlign: 'right',
    color: '#9ca3af',
    fontSize: '14px',
  }),
  singleValue: (base) => ({
    ...base,
    textAlign: 'right',
    color: '#374151',
    fontSize: '14px',
  })
};

const JobForm = ({ initialData = null, mode = "create" }) => {
  const router = useRouter();
  const formActionsRef = useRef(null);
  
  const {
    formData,
    loading,
    errors,
    dynamicOptions,
    newOptions,
    handleChange,
    handleNewOptionChange,
    addNewOption,
    handleSubmit,
    handleCancel
  } = useJobForm(initialData, mode, formActionsRef);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 space-y-4 md:space-y-6 max-w-4xl mx-auto transition-all duration-300"
      dir="rtl"
    >
      <FormHeader mode={mode} />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 shadow-lg border border-gray-200 max-w-xs sm:max-w-sm mx-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#D6B666]"></div>
            <div className="text-center">
              <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
                {mode === "create" ? "جاري إنشاء الوظيفة..." : "جاري تحديث الوظيفة..."}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                الرجاء الانتظار
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Title Field */}
      <DynamicSelectWithAdd
        label={formFields.title.label}
        value={formData.title}
        onChange={(value) => handleChange("title", value)}
        options={dynamicOptions.titles}
        newValue={newOptions.title}
        onNewValueChange={handleNewOptionChange}
        onAddNew={() => addNewOption("titles")}
        error={errors.title}
        required={formFields.title.required}
        placeholder="اختر المسمى الوظيفي"
        addPlaceholder="مسمى وظيفي جديد"
        type="text"
      />

      {/* Grid Layout for Multiple Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Location Field */}
        <DynamicSelectWithAdd
          label={formFields.location.label}
          value={formData.location}
          onChange={(value) => handleChange("location", value)}
          options={dynamicOptions.locations}
          newValue={newOptions.location}
          onNewValueChange={handleNewOptionChange}
          onAddNew={() => addNewOption("locations")}
          error={errors.location}
          required={formFields.location.required}
          placeholder="اختر الموقع"
          addPlaceholder="موقع جديد"
          type="text"
        />

        {/* Category Field - UPDATED FOR CATEGORY MODEL */}
        <DynamicSelectWithAdd
          label={formFields.category.label}
          value={formData.category}
          onChange={(value) => handleChange("category", value)}
          options={dynamicOptions.categories}
          newValue={newOptions.category}
          onNewValueChange={handleNewOptionChange}
          onAddNew={() => addNewOption("categories")}
          error={errors.category}
          required={formFields.category.required}
          placeholder="اختر التصنيف"
          addPlaceholder="تصنيف جديد"
          type="category"
        />

        {/* Job Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {formFields.jobType.label}
          </label>
          <Select
            value={formFields.jobType.options.find(opt => opt.value === formData.jobType)}
            onChange={(selected) => handleChange("jobType", selected?.value || '')}
            options={formFields.jobType.options}
            placeholder="اختر نوع الوظيفة"
            styles={selectStyles}
            isSearchable={false}
            isClearable={false}
            className="text-right"
          />
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {formFields.experience.label}
          </label>
          <Select
            value={formFields.experience.options.find(opt => opt.value === formData.experience)}
            onChange={(selected) => handleChange("experience", selected?.value || '')}
            options={formFields.experience.options}
            placeholder="اختر مستوى الخبرة"
            styles={selectStyles}
            isSearchable={false}
            isClearable={false}
            className="text-right"
          />
        </div>

        {/* Status with Explanation */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            {formFields.status.label}
          </label>
          <Select
            value={formFields.status.options.find(opt => opt.value === formData.status)}
            onChange={(selected) => handleChange("status", selected?.value || '')}
            options={formFields.status.options}
            placeholder="اختر الحالة"
            styles={selectStyles}
            isSearchable={false}
            isClearable={false}
            className="text-right"
          />
          
          <div className="text-xs text-gray-500 mt-2 px-1">
            {getStatusExplanation(formData.status)}
          </div>
        </div>
      </div>

      {/* Description Field */}
      <Textarea
        label={formFields.description.label}
        placeholder={formFields.description.placeholder}
        icon={formFields.description.icon}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        required={formFields.description.required}
        rows={4}
        className="text-sm md:text-base"
      />

      {/* Requirements Field */}
      <Textarea
        label={formFields.requirements.label}
        placeholder={formFields.requirements.placeholder}
        icon={formFields.requirements.icon}
        value={formData.requirements}
        onChange={(e) => handleChange("requirements", e.target.value)}
        rows={3}
        className="text-sm md:text-base"
      />

      <FormActions 
        loading={loading} 
        mode={mode} 
        formData={formData} 
        onCancel={handleCancel}
        ref={formActionsRef}
      />
    </form>
  );
};

export default JobForm;