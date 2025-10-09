// components/jobs/public/JobsContent.jsx
import NoResults from "./NoResults";

const JobsContent = ({ 
  filteredJobs, 
  totalJobs, 
  loading, 
  children,
  searchTerm,
  selectedCategory,
  selectedLocation,
  onResetFilters 
}) => (
  <main className="lg:col-span-3">
    {/* Mobile spacing */}
    <div className="lg:hidden h-4"></div>
    
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded-lg shadow-md gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">نتائج البحث</h2>
          <p className="text-gray-600">
            {loading
              ? "جاري التحميل..."
              : `تم العثور على ${filteredJobs.length} وظيفة من أصل ${totalJobs}`}
          </p>
        </div>
        <div className="text-sm text-gray-500">مرتبة حسب: الأحدث أولاً</div>
      </div>
    </div>
    
    {/* Show NoResults when no jobs found */}
    {!loading && filteredJobs.length === 0 ? (
      <NoResults 
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        onResetFilters={onResetFilters}
      />
    ) : (
      children
    )}
  </main>
);

export default JobsContent;