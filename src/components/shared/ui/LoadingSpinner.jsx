// components/shared/ui/LoadingSpinner.jsx
import { Loader } from "lucide-react";

const LoadingSpinner = ({ 
  size = "md", 
  color = "text-[#B38025]",
  className = "" 
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <Loader 
      className={`animate-spin ${sizes[size]} ${color} ${className}`}
    />
  );
};

export default LoadingSpinner;