// components/jobs/public/JobsHeader.jsx
const JobsHeader = ({ totalJobs, filteredJobs, loading }) => (
  <section className="bg-white border-b border-gray-200 w-full">
    <div className="w-full container-px py-12 md:py-16">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
          استكشف الوظائف المتاحة
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          ابحث عن الوظيفة المثالية من بين <span className="text-[#B38025] font-bold">{totalJobs}</span> وظيفة متاحة
        </p>
      </div>
    </div>
  </section>
);

export default JobsHeader;