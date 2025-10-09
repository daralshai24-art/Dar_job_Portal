// components/auth/AuthButton.jsx
const AuthButton = ({ 
  children, 
  loading = false, 
  type = "button",
  onClick,
  variant = "primary" 
}) => {
  const baseClasses = "w-full py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-l from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border-2 border-[#B38025] text-[#B38025] bg-transparent hover:bg-[#B38025] hover:text-white"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${variants[variant]} ${
        loading ? "opacity-50 cursor-not-allowed transform-none hover:transform-none" : ""
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2 space-x-reverse">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>جاري المعالجة...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;