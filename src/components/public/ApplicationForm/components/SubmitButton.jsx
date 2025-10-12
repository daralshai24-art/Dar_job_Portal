// src/components/public/ApplicationForm/components/SubmitButton.jsx
const SubmitButton = ({ submitting, jobStatus }) => {
  const getButtonConfig = () => {
    // Handle missing job or job status
    if (!jobStatus || jobStatus !== "active") {
      return {
        label: "الوظيفة غير متاحة للتقديم",
        styles: "bg-gray-300 text-gray-500 cursor-not-allowed",
        disabled: true
      };
    }
    
    if (submitting) {
      return {
        label: "جاري الإرسال...",
        styles: "bg-gray-400 text-gray-700 cursor-not-allowed",
        disabled: true
      };
    }
    
    return {
      label: "قدم الآن",
      styles: "bg-[#B38025] text-white hover:bg-[#D6B666] hover:text-[#1D3D1E] shadow-lg hover:shadow-xl transform hover:-translate-y-1",
      disabled: false
    };
  };

  const { label, styles, disabled } = getButtonConfig();

  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${styles}`}
    >
      {label}
    </button>
  );
};

export default SubmitButton;