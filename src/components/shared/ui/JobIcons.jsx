import { MapPin, Users, Briefcase, Calendar, FileText } from "lucide-react";

export const JobIcons = {
  location: MapPin,
  category: Briefcase, 
  applications: Users,
  date: Calendar,
  type: FileText
};

export const JobIcon = ({ type, size = 16, className = "" }) => {
  const IconComponent = JobIcons[type];
  return IconComponent ? <IconComponent size={size} className={className} /> : null;
};