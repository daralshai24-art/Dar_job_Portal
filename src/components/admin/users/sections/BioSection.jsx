import Textarea from "@/components/shared/ui/Textarea";

export const BioSection = ({ formData, handleChange, loading }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">نبذة مختصرة</h3>

    <Textarea
      label="نبذة عن المستخدم"
      value={formData.bio}
      onChange={(e) => handleChange("bio", e.target.value)}
      placeholder="معلومات إضافية عن المستخدم..."
      maxLength={500}
      disabled={loading}
    />
    <p className="mt-1 text-xs text-gray-500">{(formData.bio || "").length}/500 حرف</p>
    
  </div>
);
