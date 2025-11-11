// src/components/home/JobsSection.jsx
"use client";

import JobCard from "@/components/jobs/JobCard";
import CategoryFilters from "./CategoryFilters";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";
import NoResults from "@/components/Public/NoResults";

const JobsSection = ({
  jobs,
  loading,
  filteredJobs,
  selectedCategory,
  onCategorySelect,
  onViewAllJobs,
  searchTerm,
  onClearFilters
}) => {
  return (
    <section className="flex-1 bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />
        
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />

        {/* Content Area - Takes consistent space */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <LoadingSpinner size="xl" className="mx-auto mb-4" />
                <p className="text-gray-600">جاري تحميل المحتوى...</p>
              </div>
            </div>
          ) : (
            <JobsContent
              filteredJobs={filteredJobs}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onClearFilters={onClearFilters}
              onViewAllJobs={onViewAllJobs}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const SectionHeader = () => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
      الوظائف المتاحة حديثاً
    </h2>
    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
      اكتشف أحدث الفرص الوظيفية المتاحة واختر ما يناسب مهاراتك وطموحاتك
    </p>
  </div>
);

const JobsContent = ({ 
  filteredJobs, 
  searchTerm, 
  selectedCategory, 
  onClearFilters, 
  onViewAllJobs 
}) => {
  if (filteredJobs.length === 0) {
    return (
      <div className="py-16">
        <NoResults 
          hasFilters={searchTerm || selectedCategory !== "all"}
          onClearFilters={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <JobsGrid jobs={filteredJobs.slice(0, 6)} />
      <ViewMoreSection 
        filteredJobs={filteredJobs}
        onViewAllJobs={onViewAllJobs}
      />
    </div>
  );
};

const JobsGrid = ({ jobs }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {jobs.map((job) => (
      <JobCard key={job._id} job={job} />
    ))}
  </div>
);

const ViewMoreSection = ({ filteredJobs, onViewAllJobs }) => {
  if (filteredJobs.length <= 6) return null;

  return (
    <div className="text-center pt-8">
      <button
        onClick={onViewAllJobs}
        className="bg-[#B38025] text-white px-8 py-4 rounded-lg hover:bg-[#D6B666] hover:text-[#1D3D1E] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
      >
        عرض المزيد من الوظائف ({filteredJobs.length - 6}+)
      </button>
    </div>
  );
};

export default JobsSection;