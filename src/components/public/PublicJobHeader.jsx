// components/jobs/public/PublicJobHeader.jsx
import { MapPin, DollarSign, Calendar, Clock } from "lucide-react";

// Helper function to get category name
const getCategoryName = (category) => {
  if (!category) return "غير محدد";
  if (typeof category === 'string') return category;
  return category.name || "غير محدد";
};

const PublicJobHeader = ({ job, formatDate }) => {
  // Get category name using helper function
  const categoryName = getCategoryName(job.category);

  return (
    <div className="bg-gradient-to-r from-[#1D3D1E] to-[#2A5A2C] text-white p-6 md:p-8 rounded-t-xl">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex-1 w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-[#F1DD8C] leading-tight">
            {job.title}
          </h1>
          {categoryName && categoryName !== "غير محدد" && (
            <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {categoryName}
            </span>
          )}
        </div>
        <div className="w-full md:w-auto flex md:block justify-end">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${job.status === "active"
                ? "bg-green-400 text-green-900"
                : "bg-gray-400 text-gray-900"
              }`}
          >
            {job.status === "active" ? "متاحة للتقديم" : "غير متاحة"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <MetaItem icon={MapPin} value={job.location} />
        <MetaItem icon={DollarSign} value={job.salary} />
        <MetaItem icon={Calendar} value={formatDate(job.createdAt)} />
        <MetaItem icon={Clock} value={job.jobType} />
      </div>
    </div>
  );
};

const MetaItem = ({ icon: Icon, value }) =>
  value && (
    <div className="flex items-center text-white/90">
      <Icon size={18} className="ml-2 text-[#F1DD8C]" />
      <span>{value}</span>
    </div>
  );

export default PublicJobHeader;