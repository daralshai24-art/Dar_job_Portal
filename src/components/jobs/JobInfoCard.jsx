// components/jobs/JobInfoCard.jsx
import { MapPin, DollarSign, Users, Briefcase, Award, Calendar } from "lucide-react";

/**
 * Reusable Job Information Card Component
 */
const JobInfoCard = ({ job }) => {
  const infoItems = [
    {
      icon: MapPin,
      label: "الموقع",
      value: job?.location,
      color: "text-green-600",
      show: true
    },
    {
      icon: DollarSign,
      label: "الراتب", 
      value: job?.salary,
      color: "text-red-600",
      show: job?.salary
    },
    {
      icon: Users,
      label: "التصنيف",
      value: job?.category,
      color: "text-purple-600", 
      show: job?.category
    },
    {
      icon: Briefcase,
      label: "نوع الوظيفة",
      value: job?.jobType,
      color: "text-blue-600",
      show: true
    },
    {
      icon: Award,
      label: "مستوى الخبرة",
      value: job?.experience,
      color: "text-yellow-600",
      show: true
    },
    {
      icon: Calendar,
      label: "تاريخ النشر",
      value: job?.createdAt,
      color: "text-gray-600",
      show: true,
      isDate: true
    },
    {
      icon: Calendar,
      label: "آخر تحديث", 
      value: job?.updatedAt,
      color: "text-gray-600",
      show: true,
      isDate: true
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        معلومات الوظيفة
      </h3>
      
      <div className="space-y-4">
        {infoItems.map((item, index) => 
          item.show && (
            <div key={index} className="flex items-center text-gray-700">
              <item.icon className="ml-2 h-5 w-5 flex-shrink-0" style={{ color: item.color }} />
              <div>
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="font-medium">
                  {item.isDate ? formatDate(item.value) : item.value}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default JobInfoCard;