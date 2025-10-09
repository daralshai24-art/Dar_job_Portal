// components/jobs/public/JobsHeader.jsx
const JobsHeader = ({ totalJobs, filteredJobs, loading }) => (
  <section className="bg-white border-b border-gray-200">
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          استكشف الوظائف المتاحة
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ابحث عن الوظيفة المثالية من بين {totalJobs} وظيفة متاحة
        </p>
      </div>
    </div>
  </section>
);

export default JobsHeader;