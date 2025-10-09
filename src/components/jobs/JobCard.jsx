// components/jobs/JobCard.js
"use client";

import { useRouter } from "next/navigation";
import { FiMapPin, FiDollarSign, FiClock, FiBriefcase } from "react-icons/fi";

/**
 * JobCard Component
 * Displays a job in card format with clickable navigation
 *
 * Props:
 * - job: Object containing job details from database
 */
export default function JobCard({ job }) {
  const router = useRouter();

  /**
   * Handle card click - navigate to job details page
   */
  const handleClick = () => {
    router.push(`/jobs/${job._id}`);
  };

  /**
   * Format date to Arabic locale
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Truncate text to specified length
   */
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 group"
    >
      {/* Job Title and Status */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-[#B38025] transition-colors"
        >
          {job.title}
        </h2>
        {job.status && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              job.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {job.status === "active" ? "متاحة" : "غير متاحة"}
          </span>
        )}
      </div>

      {/* Job Description */}
      <p className="text-gray-600 mb-4 leading-relaxed">
        {truncateText(job.description, 120)}
      </p>

      {/* Job Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-500">
        {/* Location */}
        {job.location && (
          <div className="flex items-center gap-2">
            <FiMapPin size={16} className="text-red-500 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}

        {/* Salary */}
        {job.salary && (
          <div className="flex items-center gap-2">
            <FiDollarSign size={16} className="text-green-500 flex-shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
        )}

        {/* Job Type */}
        {job.jobType && (
          <div className="flex items-center gap-2">
            <FiBriefcase size={16} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{job.jobType}</span>
          </div>
        )}

        {/* Posted Date */}
        <div className="flex items-center gap-2">
          <FiClock size={16} className="text-purple-500 flex-shrink-0" />
          <span className="truncate">{formatDate(job.createdAt)}</span>
        </div>
      </div>

      {/* Category Badge */}
      {job.category && (
        <div className="mb-4">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
            {job.category}
          </span>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when button is clicked
          handleClick();
        }}
        className="w-full bg-[#B38025] text-white py-3 rounded-lg hover:bg-[#D6B666] transition-all duration-300 hover:text-[#ffff] font-medium group-hover:shadow-md cursor-pointer "
      >
        قدم الآن
      </button>
    </div>
  );
}
