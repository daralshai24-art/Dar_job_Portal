// src/components/admin/applications/JobInfoCard.jsx
import { Briefcase, MapPin, Layers, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-2 last:border-b-0">
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-gray-400" />
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <span className="text-gray-600">{value}</span>
  </div>
);

export const JobInfoCard = ({ application }) => {
  const job = application?.jobId;

  if (!job) {
    return (
      <Card>
        <CardHeader icon={Briefcase} title="معلومات الوظيفة" />
        <CardContent className="text-center text-gray-500 py-6">
          لا توجد معلومات عن الوظيفة
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-all">
      <CardHeader icon={Briefcase} title="معلومات الوظيفة" />
      <CardContent className="space-y-2">
        <InfoItem icon={Briefcase} label="المسمى الوظيفي:" value={job.title || "غير محدد"} />
        <InfoItem icon={MapPin} label="الموقع:" value={job.location || "غير محدد"} />
        <InfoItem icon={Layers} label="القسم:" value={job.category?.name || "غير محدد"} />
        {job.createdAt && (
          <InfoItem
            icon={Calendar}
            label="تاريخ الإعلان:"
            value={new Date(job.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
        )}
      </CardContent>
    </Card>
  );
};
