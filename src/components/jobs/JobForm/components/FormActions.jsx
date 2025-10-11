import { forwardRef, useState, useEffect } from 'react';
import Button from "@/components/shared/ui/Button";
import { Save, Send, Edit, X } from "lucide-react";

const FormActions = forwardRef(({ loading, mode, formData, onCancel }, ref) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Highlight effect when scrolled to
  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  const getButtonConfig = () => {
    if (mode === "create") {
      if (formData.status === "draft") {
        return {
          text: "حفظ كمسودة",
          shortText: "حفظ", // Shorter text for mobile
          icon: Save,
          variant: "secondary"
        };
      } else {
        return {
          text: "نشر الوظيفة", 
          shortText: "نشر", // Shorter text for mobile
          icon: Send,
          variant: "primary"
        };
      }
    }
    return {
      text: "حفظ التغييرات",
      shortText: "حفظ", // Shorter text for mobile
      icon: Edit,
      variant: "primary"
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div 
      ref={ref}
      className={`
        flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200 scroll-mt-8 transition-all duration-500
        ${isHighlighted ? 'bg-blue-50 border-blue-200 rounded-lg p-4 -mx-4' : ''}
      `}
      id="form-actions"
    >
 

      {/* Buttons Container - Stack horizontally on mobile */}
      <div className="flex flex-row gap-3 w-full sm:w-auto">
        {/* Cancel Button */}
        <Button
          type="button"
          variant="light"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 sm:flex-none sm:min-w-[100px] flex items-center justify-center gap-2 py-2.5 sm:py-2 text-sm sm:text-base"
        >
          <span className="sm:hidden">إلغاء</span>
          <span className="hidden sm:inline">إلغاء</span>
          <X className="w-4 h-4" />
        </Button>
        
        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          variant={buttonConfig.variant}
          className="flex-1 sm:flex-none sm:min-w-[150px] flex items-center justify-center gap-2 py-2.5 sm:py-2 text-sm sm:text-base transition-all duration-300 hover:shadow-lg"
        >
          {/* Show short text on mobile, full text on desktop */}
          <span className="sm:hidden">{buttonConfig.shortText}</span>
          <span className="hidden sm:inline">{buttonConfig.text}</span>
          <buttonConfig.icon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

FormActions.displayName = 'FormActions';

export default FormActions;