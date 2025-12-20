// src/components/admin/applications/CandidateInfoCard.jsx
import { User, Mail, Phone, Download, MapPin, Medal, Globe } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Button from "@/components/shared/ui/Button";

const InfoItem = ({ icon: Icon, text }) => (
  <div className="flex items-center py-2">
    <Icon size={16} className="ml-2 text-gray-500" />
    <span className="text-gray-700">{text}</span>
  </div>
);

export const CandidateInfoCard = ({ application }) => {
  return (
    <Card>
      <CardHeader icon={User} title="معلومات المتقدم" />
      <CardContent className="space-y-3">

        <InfoItem icon={User} text={application.name} />
        <InfoItem icon={Mail} text={application.email} />
        {application.phone && <InfoItem icon={Phone} text={application.phone} />}
        <InfoItem icon={MapPin} text={application.city || 'غير معرف'} />
        <InfoItem icon={Globe} text={application.nationality || 'غير محدد'} />

        {application.isSilverMedalist && (
          <div className="mt-2 text-sm bg-blue-50 text-blue-700 p-2 rounded-md border border-blue-100 flex items-center gap-2">
            <Medal size={16} />
            <span className="font-medium">مرشح مميز (Future Candidate)</span>
          </div>
        )}

        <Button
          onClick={() => window.open(application.cv?.path, "_blank")}
          variant="ghost"
          className="w-full mt-4"
        >
          <Download size={16} className="ml-1" />
          تحميل السيرة الذاتية
        </Button>

        {application.experience?.path && (
          <Button
            onClick={() => window.open(application.experience.path, "_blank")}
            variant="ghost"
            className="w-full mt-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          >
            <Download size={16} className="ml-1" />
            تحميل ملف الخبرات
          </Button>
        )}

      </CardContent>
    </Card>
  );
};
