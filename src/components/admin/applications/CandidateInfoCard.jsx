// src/components/admin/applications/CandidateInfoCard.jsx
import { User, Mail, Phone, Download, MapPin } from "lucide-react";
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

        <Button
          onClick={() => window.open(application.cv?.path, "_blank")}
          variant="ghost"
          className="w-full mt-4"
        >
          <Download size={16} className="ml-1" />
          تحميل السيرة الذاتية
        </Button>

      </CardContent>
    </Card>
  );
};
