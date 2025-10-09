import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";

export const LoadingState = () => {
  return (
    <div className="p-6">
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
        <span className="mr-4 text-gray-600">جاري تحميل بيانات الطلب...</span>
      </div>
    </div>
  );
};