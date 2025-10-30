import { X, Edit, Clock } from "lucide-react";
import Button from "@/components/shared/ui/Button";

export const ApplicationHeader = ({
  onBack,
  onEdit,
  editing,
  onCancel,
  showTimeline,
  toggleTimeline
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <button
          onClick={onBack}
          className="text-[#B38025] hover:text-[#D6B666] mb-4 flex items-center cursor-pointer"
        >
          <X size={20} className="ml-1" />
          العودة للطلبات
        </button>
        <h1 className="text-2xl font-bold text-gray-800">تفاصيل طلب التوظيف</h1>
        <p className="text-gray-600">إدارة وتقييم طلب التوظيف</p>
      </div>

      <div className="flex gap-2">
        {/* Timeline toggle button */}
        <Button
          onClick={toggleTimeline}
          variant="link"
          className="flex items-center gap-1 px-4"
        >
          <Clock size={16} />
          {showTimeline ? "إخفاء سجل التقدم" : "عرض سجل التقدم"}
        </Button>

        {!editing ? (
          <Button onClick={onEdit} variant="primary">
            <Edit size={18} className="ml-1" />
            تعديل
          </Button>
        ) : (
          <Button onClick={onCancel} variant="ghost">
            <X size={18} className="ml-1" />
            إلغاء التعديل
          </Button>
        )}
      </div>
    </div>
  );
};
