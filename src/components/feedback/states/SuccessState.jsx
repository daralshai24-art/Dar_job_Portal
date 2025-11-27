//src\components\feedback\states\SuccessState.jsx
import { CheckCircle2 } from "lucide-react";

export default function SuccessState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">تم إرسال التقييم بنجاح</h2>
        <p className="text-gray-600">شكراً لك على مشاركتك التقييم</p>
      </div>
    </div>
  );
}
