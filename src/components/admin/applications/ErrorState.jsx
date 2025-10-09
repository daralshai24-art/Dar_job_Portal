import { AlertCircle } from "lucide-react";
import Button from "@/components/shared/ui/Button";

export const  ErrorState = ({ onBack, message = "الطلب غير موجود" }) => {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{message}</h1>
      <Button
        onClick={onBack}
        variant="link"
      >
        العودة للطلبات
      </Button>
    </div>
  );
};