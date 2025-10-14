// ==================== NOTES SECTION ====================
// src/components/admin/applications/NotesSection.jsx
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Textarea from "@/components/shared/ui/Textarea";
import Button from "@/components/shared/ui/Button";
import { FileText } from "lucide-react";

const NoteField = ({ label, value, editing, applicationValue, onChange, fieldKey }) => {
  if (editing) {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        placeholder={`اكتب ${label}...`}
        rows={3}
      />
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="bg-gray-50 rounded-lg p-3 min-h-[80px]">
        {applicationValue || "لا توجد ملاحظات"}
      </div>
    </div>
  );
};

export const NotesSection = ({
  application,
  formData,
  editing,
  onFormChange,
  onSave,
  saving
}) => {
  const noteFields = [
    { key: 'hrNotes', label: 'ملاحظات HR' },
    { key: 'technicalNotes', label: 'ملاحظات تقنية' },
    { key: 'interviewNotes', label: 'ملاحظات المقابلة' }
  ];

  return (
    <Card>
      <CardHeader 
        title="الملاحظات" 
        icon={FileText}
      />
      <CardContent className="space-y-4">
        {noteFields.map((field) => (
          <NoteField
            key={field.key}
            label={field.label}
            value={formData[field.key]}
            editing={editing}
            applicationValue={application[field.key]}
            onChange={onFormChange}
            fieldKey={field.key}
          />
        ))}

        {editing && (
          <Button
            onClick={onSave}
            loading={saving}
            className="w-full"
          >
            حفظ الملاحظات
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
