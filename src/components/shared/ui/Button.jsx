// components/shared/ui/Button.jsx
import LoadingSpinner from "./LoadingSpinner";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-l from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900 focus:ring-green-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 shadow-sm hover:shadow-md",
    outline: "border-2 border-green-700 text-green-700 hover:bg-green-50 focus:ring-green-500",
    ghost: "text-green-700 hover:bg-green-50 focus:ring-green-500",
    danger: "bg-gradient-to-l from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-md hover:shadow-lg",
    warning: "bg-gradient-to-l from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500 shadow-md hover:shadow-lg",
    success: "bg-gradient-to-l from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:ring-emerald-500 shadow-md hover:shadow-lg",
    info: "bg-gradient-to-l from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-md hover:shadow-lg",
    dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-600 shadow-md hover:shadow-lg",
    light: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm hover:shadow-md",
    link: "text-green-700 hover:text-green-800 underline-offset-4 hover:underline focus:ring-green-500",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm", 
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? "opacity-50 cursor-not-allowed transform-none hover:transform-none" : ""}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;