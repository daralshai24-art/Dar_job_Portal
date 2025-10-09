//src\components\admin\applications\FeedbackSection.jsx
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Textarea from "@/components/shared/ui/Textarea";

const FeedbackField = ({ field, value, editing, applicationValue, onChange }) => {
  if (editing) {
    return (
      <Textarea
        label={field.label}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={3}
      />
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      <div className="bg-gray-50 rounded-lg p-3 min-h-[80px]">
        {applicationValue || "لا توجد ملاحظات"}
      </div>
    </div>
  );
};

export const FeedbackSection = ({ application, formData, editing, onFormChange }) => {
  const feedbackFields = [
    { 
      key: 'hrNotes', 
      label: 'ملاحظات HR', 
      placeholder: 'ملاحظات حول المؤهلات والخبرات...' 
    },
    { 
      key: 'technicalNotes', 
      label: 'ملاحظات تقنية', 
      placeholder: 'ملاحظات حول المهارات التقنية...' 
    },
    { 
      key: 'interviewFeedback', 
      label: 'تقييم المقابلة', 
      placeholder: 'ملاحظات وتقييم أداء المتقدم في المقابلة...' 
    },
    { 
      key: 'finalFeedback', 
      label: 'التقييم النهائي', 
      placeholder: 'التقييم النهائي وسبب القبول أو الرفض...' 
    }
  ];

  return (
    <Card>
      <CardHeader title="تقييم وملاحظات HR" />
      <CardContent className="space-y-4">
        {feedbackFields.map((field) => (
          <FeedbackField
            key={field.key}
            field={field}
            value={formData[field.key]}
            editing={editing}
            applicationValue={application[field.key]}
            onChange={onFormChange}
          />
        ))}
      </CardContent>
    </Card>
  );
};


