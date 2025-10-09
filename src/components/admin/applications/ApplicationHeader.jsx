//components/admin/applications/ApplicationHeader.jsx 
import { X, Edit, Save } from "lucide-react";
import Button from "@/components/shared/ui/Button";

export const ApplicationHeader = ({ 
  onBack, 
  onEdit, 
  editing, 
  onSave, 
  onCancel, 
  saving 
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <button 
          onClick={onBack}
          className="text-[#B38025] hover:text-[#D6B666] mb-4 flex items-center  cursor-pointer"
        >
          <X size={20} className="ml-1" />
          العودة للطلبات
        </button>
        <h1 className="text-2xl font-bold text-gray-800">تفاصيل طلب التوظيف</h1>
        <p className="text-gray-600">إدارة وتقييم طلب التوظيف</p>
      </div>
      
      <div className="flex gap-2">
        {!editing ? (
          <Button onClick={onEdit} variant="primary">
            <Edit size={18} className="ml-1" />
            تعديل
          </Button>
        ) : (
          <>
            <Button onClick={onCancel} variant="ghost">
              <X size={18} className="ml-1" />
              إلغاء
            </Button>
            <Button onClick={onSave} loading={saving} variant="primary">
              <Save size={18} className="ml-1" />
              {saving ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};