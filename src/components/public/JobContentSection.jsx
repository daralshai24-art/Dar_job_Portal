// components/jobs/public/JobContentSection.jsx
const JobContentSection = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-8 ${className}`}>
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="bg-[#B38025]/10 p-2 rounded-lg flex-shrink-0">
        <Icon size={20} className="text-[#B38025]" />
      </div>
      {title}
    </h2>
    {children}
  </section>
);

export default JobContentSection;