// // hooks/useJobActions.js - IMPROVED VERSION
// import { useState } from "react";
// import toast from "react-hot-toast";

// export const useJobActions = () => {
//   const [actionLoading, setActionLoading] = useState(null);

//   const handleDeleteJob = async (jobId, jobTitle, showConfirmation, onSuccess) => {
//     showConfirmation({
//       title: "حذف الوظيفة",
//       message: `هل أنت متأكد من حذف "${jobTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`,
//       confirmText: "حذف",
//       variant: "danger",
//       type: "delete",
//       onConfirm: async () => {
//         setActionLoading(jobId);
        
//         try {
//           const response = await fetch(`/api/jobs/${jobId}`, {
//             method: "DELETE",
//           });

//           const data = await response.json();

//           if (!response.ok) {
//             throw new Error(data.error || "Failed to delete job");
//           }

//           toast.success(data.message || "تم حذف الوظيفة بنجاح");
//           onSuccess?.(); // Call success callback
//         } catch (error) {
//           console.error("Error deleting job:", error);
//           toast.error(error.message || "فشل في حذف الوظيفة");
//         } finally {
//           setActionLoading(null);
//         }
//       }
//     });
//   };

//   const handleToggleStatus = async (jobId, currentStatus, jobs, showConfirmation, onSuccess) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active";
//     const job = jobs.find(j => j._id === jobId);
    
//     const statusConfig = {
//       'active': {
//         title: "إيقاف الوظيفة",
//         message: `هل أنت متأكد من إيقاف "${job.title}"؟`,
//         confirmText: "إيقاف",
//         variant: "warning"
//       },
//       'inactive': {
//         title: "تفعيل الوظيفة", 
//         message: `هل أنت متأكد من تفعيل "${job.title}"؟`,
//         confirmText: "تفعيل",
//         variant: "success"
//       },
//       'draft': {
//         title: "نشر الوظيفة",
//         message: `هل أنت متأكد من نشر "${job.title}"؟`,
//         confirmText: "نشر",
//         variant: "success"
//       }
//     };

//     const config = statusConfig[currentStatus] || {
//       title: "تغيير الحالة",
//       message: `هل أنت متأكد من تغيير حالة "${job.title}"؟`,
//       confirmText: "تغيير",
//       variant: "info"
//     };

//     showConfirmation({
//       ...config,
//       type: "status",
//       onConfirm: async () => {
//         setActionLoading(jobId);
        
//         try {
//           const response = await fetch(`/api/jobs/${jobId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ status: newStatus }),
//           });

//           const data = await response.json();

//           if (!response.ok) {
//             throw new Error(data.error || "Failed to update job status");
//           }

//           toast.success(data.message || `تم ${newStatus === "active" ? "تفعيل" : "إيقاف"} الوظيفة بنجاح`);
//           onSuccess?.(); // Call success callback
//         } catch (error) {
//           console.error("Error updating job status:", error);
//           toast.error(error.message || "فشل في تحديث حالة الوظيفة");
//         } finally {
//           setActionLoading(null);
//         }
//       }
//     });
//   };

//   return {
//     actionLoading,
//     handleDeleteJob,
//     handleToggleStatus
//   };
// };