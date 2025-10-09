// components/shared/ui/Card.jsx
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ title, icon: Icon, className = "" }) => {
  return (
    <div className={`p-6 border-b border-gray-200 ${className}`}>
      <div className="flex items-center">
        {Icon && <Icon size={30} className="ml-2 text-[#B38025]" />}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent };