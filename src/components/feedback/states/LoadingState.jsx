//src\components\feedback\states\LoadingState.jsx
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";

export default function LoadingState({ message = "جاري التحقق من الرابط..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <LoadingSpinner className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
