// // components/admin/jobs/JobStats.js
// import { Briefcase, Eye, X, Edit, Archive } from "lucide-react";

// const StatCard = ({ title, value, color, icon: Icon }) => (
//   <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg  transition-shadow duration-200 ">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-600">{title}</p>
//         <p className={`text-3xl font-bold ${color}`}>{value}</p>
//       </div>
//       <div className={`p-3 rounded-full ${getBackgroundColor(color)}`}>
//         <Icon className={color} size={24} />
//       </div>
//     </div>
//   </div>
// );

// // Helper function to get background color based on text color
// const getBackgroundColor = (colorClass) => {
//   const colorMap = {
//     'text-gray-800': 'bg-gray-100',
//     'text-green-600': 'bg-green-100',
//     'text-red-600': 'bg-red-100',
//     'text-yellow-600': 'bg-yellow-100',
//     'text-blue-600': 'bg-blue-100'
//   };
  
//   return colorMap[colorClass] || 'bg-gray-100';
// };

// export const JobStats = ({ jobs }) => {
//   const stats = [
//     {
//       title: "إجمالي الوظائف",
//       value: jobs.length,
//       color: "text-gray-800",
//       icon: Briefcase,
//       description: "جميع الوظائف في النظام"
//     },
//     {
//       title: "وظائف نشطة",
//       value: jobs.filter(job => job.status === "active").length,
//       color: "text-green-600",
//       icon: Eye,
//       description: "وظائف قابلة للتقديم"
//     },
//     {
//       title: "وظائف غير نشطة",
//       value: jobs.filter(job => job.status === "inactive").length,
//       color: "text-red-600",
//       icon: X,
//       description: "وظائف متوقفة مؤقتاً"
//     },
//     {
//       title: "وظائف المسودة",
//       value: jobs.filter(job => job.status === "draft").length,
//       color: "text-yellow-600",
//       icon: Edit,
//       description: "وظائف غير منشورة"
//     },
//     {
//       title: "وظائف مغلقة",
//       value: jobs.filter(job => job.status === "closed").length,
//       color: "text-blue-600",
//       icon: Archive,
//       description: "وظائف منتهية"
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//       {stats.map((stat, index) => (
//         <StatCard key={index} {...stat} />
//       ))}
//     </div>
//   );
// };