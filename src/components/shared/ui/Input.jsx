//src\components\shared\ui\Input.jsx
/**
 * Reusable Input Component

 */
const Input = ({
  label,
  error,
  icon: Icon,
  value = "", // ✅ Add default value to prevent undefined
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          value={value} // ✅ Now always defined
          className={`
            w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none transition-all duration-200
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
};

export default Input;