import { forwardRef } from "react";

/**
 * Reusable Textarea Component
 */
const Textarea = forwardRef(({
  label,
  error,
  icon: Icon,
  className = "",
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-3">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <textarea
          ref={ref}
          className={`
            w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none resize-none transition-all duration-200
            ${Icon ? 'pr-12' : 'pr-4'}
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `.trim()}
          dir="rtl"
          {...props}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;