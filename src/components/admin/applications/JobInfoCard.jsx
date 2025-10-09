//src\components\admin\applications\JobInfoCard.jsx
import { Briefcase, MapPin, Users } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center py-2">
    <Icon size={16} className="ml-2 text-gray-500" />
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-gray-700 font-medium">{value}</div>
    </div>
  </div>
);

export const JobInfoCard = ({ application }) => {
  return (
    <Card>
      <CardHeader icon={Briefcase} title="معلومات الوظيفة" />
      <CardContent className="space-y-2">
        <div className="font-medium text-gray-900">{application.jobId?.title}</div>
        
        {application.jobId?.location && (
          <InfoItem 
            icon={MapPin} 
            label="الموقع" 
            value={application.jobId.location} 
          />
        )}
        
        {application.jobId?.category && (
          <InfoItem 
            icon={Users} 
            label="التصنيف" 
            value={application.jobId.category} 
          />
        )}
      </CardContent>
    </Card>
  );
};