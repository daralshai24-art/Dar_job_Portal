// components/auth/AuthInput.jsx
const AuthInput = ({ 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  required = false 
}) => (
  <div className="relative">
    <Icon
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D6B666]"
      size={20}
    />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent transition-all duration-200"
      dir="rtl"
    />
  </div>
);

export default AuthInput;