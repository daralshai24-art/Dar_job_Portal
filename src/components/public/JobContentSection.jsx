// components/jobs/public/JobContentSection.jsx
const JobContentSection = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-8 ${className}`}>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
      <Icon size={24} className="ml-2 text-[#B38025]" />
      {title}
    </h2>
    {children}
  </section>
);

export default JobContentSection;