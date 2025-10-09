// components/shared/ui/ErrorMessage.jsx
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorMessage = ({
  message,
  onRetry,
  className = ""
}) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg text-red-700
        ${className}
      `.trim()}
    >
      <AlertCircle className="h-8 w-8 mb-3" />
      <p className="text-sm mb-4 text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw size={16} />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;