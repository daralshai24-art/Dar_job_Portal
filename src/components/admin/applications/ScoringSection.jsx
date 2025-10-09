//src\components\admin\applications\ScoringSection.jsx
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Input from "@/components/shared/ui/Input";

export const ScoringSection = ({ formData, onFormChange }) => {
  return (
    <Card>
      <CardHeader title="التقييم العددي" />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="مهارات تقنية, خبرة, لغة... (افصل بفاصلة)"
          />

          <Input
            label="نقاط الضعف"
            type="text"
            value={formData.weaknesses}
            onChange={(e) => onFormChange("weaknesses", e.target.value)}
            placeholder="قلة خبرة, مهارات ناعمة... (افصل بفاصلة)"
          />
        </div>
      </CardContent>
    </Card>
  );
};