// components/jobs/JobList.jsx
"use client";

import { Search } from "lucide-react";
import JobCard from "./JobCard";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";
import ErrorMessage from "@/components/shared/ui/ErrorMessage";

const JobList = ({ 
  jobs, 
  loading = false, 
  error = null,
  onRetry 
}) => {
  // Handle error state
  if (error) {
    return (
      <ErrorMessage 
        message="حدث خطأ في تحميل الوظائف"
        onRetry={onRetry}
        className="my-8"
      />
    );
  }

  // Handle loading state
  if (loading) {
    return <LoadingState />;
  }

  // Handle empty state
  if (!jobs || jobs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          الوظائف المتاحة ({jobs.length})
        </h2>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

// LoadingState and EmptyState components

const LoadingState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 mt-4">جاري تحميل الوظائف...</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 bg-gray-50 rounded-xl">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      لا توجد وظائف
    </h3>
    <p className="text-gray-600">
      لم يتم العثور على وظائف تطابق معايير البحث
    </p>
  </div>
);

export default JobList;