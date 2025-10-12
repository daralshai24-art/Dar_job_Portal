// src/components/public/ApplicationForm/components/FormInput.jsx
const FormInput = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  name,
  error
}) => {
  // Special handling for phone input
  const handlePhoneInput = (e) => {
    if (name === 'phone') {
      // Prevent non-numeric input
      const input = e.target.value;
      if (!/^\d*$/.test(input)) {
        return; // Don't update if not numeric
      }
    }
    onChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handlePhoneInput}
        placeholder={placeholder}
        required={required}
        className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent transition-colors ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        // Additional props for phone field
        inputMode={name === 'phone' ? 'numeric' : undefined}
        pattern={name === 'phone' ? '[0-9]*' : undefined}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;