// components/jobs/public/PublicJobHeader.jsx
import { MapPin, DollarSign, Calendar, Clock } from "lucide-react";

const PublicJobHeader = ({ job, formatDate }) => (
  <div className="bg-gradient-to-r from-[#1D3D1E] to-[#2A5A2C] text-white p-8">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 text-[#F1DD8C]">
          {job.title}
        </h1>
        {job.category && (
          <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm">
            {job.category}
          </span>
        )}
      </div>
      <div className="text-right">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            job.status === "active"
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

const MetaItem = ({ icon: Icon, value }) =>
  value && (
    <div className="flex items-center text-white/90">
      <Icon size={18} className="ml-2 text-[#F1DD8C]" />
      <span>{value}</span>
    </div>
  );

export default PublicJobHeader;