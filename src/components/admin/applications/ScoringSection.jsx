
// ==================== SCORING SECTION ====================
// src/components/admin/applications/ScoringSection.jsx (Updated)
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Input from "@/components/shared/ui/Input";
import Button from "@/components/shared/ui/Button";
import { Award } from "lucide-react";

export const ScoringSection = ({
  application,
  formData,
  editing,
  onFormChange,
  onSave,
  saving
}) => {
  if (!editing && !application.interviewScore) {
    return null; // Don't show if not editing and no score exists
  }

  return (
    <Card>
      <CardHeader 
        title="التقييم العددي" 
        icon={Award}
      />
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="نتيجة المقابلة (1-10)"
                type="number"
                min="1"
                max="10"
                value={formData.interviewScore}
                onChange={(e) => onFormChange("interviewScore", e.target.value)}
              />
              <Input
                label="نقاط القوة"
                type="text"
                value={formData.strengths}
                onChange={(e) => onFormChange("strengths", e.target.value)}
                placeholder="افصل بفاصلة"
              />
              <Input
                label="نقاط الضعف"
                type="text"
                value={formData.weaknesses}
                onChange={(e) => onFormChange("weaknesses", e.target.value)}
                placeholder="افصل بفاصلة"
              />
            </div>
            <Button
              onClick={onSave}
              loading={saving}
              className="w-full"
            >
              حفظ النتيجة
            </Button>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نتيجة المقابلة
              </label>
              <div className="text-2xl font-bold text-[#B38025]">
                {application.interviewScore}/10
              </div>
            </div>
            {application.strengths && application.strengths.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نقاط القوة
                </label>
                <div className="flex flex-wrap gap-2">
                  {application.strengths.map((strength, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {application.weaknesses && application.weaknesses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نقاط الضعف
                </label>
                <div className="flex flex-wrap gap-2">
                  {application.weaknesses.map((weakness, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                    >
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};