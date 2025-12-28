// components/jobs/JobCard.js
"use client";

import { useRouter } from "next/navigation";
import { FiMapPin, FiClock, FiBriefcase, FiArrowLeft } from "react-icons/fi";
import { formatArabicDate } from "@/utils/dateFormatter";

// Helper function to get category name (handles both string and object)
const getCategoryName = (category) => {
  if (!category) return "غير محدد";
  if (typeof category === 'string') return category;
  return category.name || "غير محدد";
};

// Helper to strip HTML tags
const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function JobCard({ job }) {
  const router = useRouter();

  // Get the category name using the helper function
  const categoryName = getCategoryName(job.category);

  const handleClick = () => router.push(`/jobs/${job._id}`);

  const DetailItem = ({ icon: Icon, label, value, color = "gray" }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`flex items-center justify-center w-8 h-8 bg-${color}-100 rounded-lg`}>
        <Icon size={16} className={`text-${color}-600`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <div
      onClick={handleClick}
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 group relative overflow-hidden flex flex-col h-full"
    >
      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B38025] to-[#D6B666]"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#B38025] transition-colors line-clamp-2 min-h-[3.5rem]">
            {job.title}
          </h2>
          {categoryName && categoryName !== "غير محدد" && (
            <span className="inline-block mt-2 bg-[#B38025]/10 text-[#B38025] text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              {categoryName}
            </span>
          )}
        </div>

        {job.status && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 shrink-0 ${job.status === "active"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}>
            {job.status === "active" ? "متاحة" : "غير متاحة"}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="flex-grow">
        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 text-sm h-[4.5em]">
          {stripHtml(job.description).substring(0, 150)}{stripHtml(job.description).length > 150 && "..."}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-auto">
        {job.location && <DetailItem icon={FiMapPin} label="الموقع" value={job.location} color="red" />}
        {job.jobType && <DetailItem icon={FiBriefcase} label="نوع الوظيفة" value={job.jobType} color="blue" />}
        <DetailItem icon={FiClock} label="تاريخ النشر" value={formatArabicDate(job.createdAt)} color="purple" />
        {job.salary && <DetailItem icon={() => <span className="font-bold">$</span>} label="الراتب" value={job.salary} color="green" />}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>عرض التفاصيل</span>
          <FiArrowLeft size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="bg-gradient-to-r from-[#B38025] to-[#D6B666] text-white px-6 py-3 rounded-xl hover:from-[#D6B666] hover:to-[#B38025] transition-all font-semibold min-w-[120px]"
        >
          قدم الآن
        </button>
      </div>
    </div>
  );
}