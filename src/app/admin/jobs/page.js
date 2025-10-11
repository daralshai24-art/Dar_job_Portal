// app/admin/jobs/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

// Import components
import { JobStats } from "@/components/jobs/stats/JobStats";
import { JobsFilters } from "@/components/admin/jobs/JobsFilters";
import { JobsTable } from "@/components/admin/jobs/JobsTable";
// import { Pagination } from "@/components/ui/Pagination";
import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { usePagination } from "@/hooks/usePagination";

// Shared Components
import Button from "@/components/shared/ui/Button";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const router = useRouter();
  const { modalState, showConfirmation, hideConfirmation, setLoading: setModalLoading } = useConfirmationModal();

  // Use pagination hook
  const pagination = usePagination({
    itemsPerPage: 5,
    currentPage: 1,
  });

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs");

      if (!response.ok) {
        throw new Error("فشل في تحميل الوظائف");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("فشل في تحميل الوظائف");
    } finally {
      setLoading(false);
    }
  };

  // Delete job handler
// You can remove setModalLoading and just use actionLoading
const handleDeleteJob = async (jobId, jobTitle) => {
  showConfirmation({
    title: "حذف الوظيفة",
    message: `هل أنت متأكد من حذف "${jobTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`,
    confirmText: "حذف",
    cancelText: "إلغاء",
    variant: "danger",
    type: "delete",
    onConfirm: async () => {
      setActionLoading(jobId); // Just use one loading state
      
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete job");
        }

        toast.success(data.message || "تم حذف الوظيفة بنجاح");
        fetchJobs();
        hideConfirmation();
      } catch (error) {
        console.error("Error deleting job:", error);
        toast.error(error.message || "فشل في حذف الوظيفة");
      } finally {
        setActionLoading(null);
      }
    }
  });
};

  // Toggle job status handler
  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const job = jobs.find(j => j._id === jobId);
    
    const statusMessages = {
      'active': {
        title: "إيقاف الوظيفة",
        message: `هل أنت متأكد من إيقاف الوظيفة "${job.title}"؟ لن تظهر للمستخدمين.`,
        confirmText: "إيقاف"
      },
      'inactive': {
        title: "تفعيل الوظيفة", 
        message: `هل أنت متأكد من تفعيل الوظيفة "${job.title}"؟ ستظهر للمستخدمين.`,
        confirmText: "تفعيل"
      },
      'draft': {
        title: "نشر الوظيفة",
        message: `هل أنت متأكد من نشر الوظيفة "${job.title}"؟ ستظهر للمستخدمين.`,
        confirmText: "نشر"
      }
    };

    const messageConfig = statusMessages[currentStatus] || {
      title: "تغيير حالة الوظيفة",
      message: `هل أنت متأكد من تغيير حالة الوظيفة "${job.title}"؟`,
      confirmText: "تغيير"
    };

    showConfirmation({
      title: messageConfig.title,
      message: messageConfig.message,
      confirmText: messageConfig.confirmText,
      cancelText: "إلغاء",
      variant: currentStatus === 'active' ? 'warning' : 'success',
      type: "status",
      onConfirm: async () => {
        setModalLoading(true);
        setActionLoading(jobId);
        
        try {
          const response = await fetch(`/api/jobs/${jobId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to update job status");
          }

          toast.success(
            data.message || `تم ${newStatus === "active" ? "تفعيل" : "إيقاف"} الوظيفة بنجاح`
          );
          fetchJobs(); // Refresh the list
          hideConfirmation();
        } catch (error) {
          console.error("Error updating job status:", error);
          toast.error(error.message || "فشل في تحديث حالة الوظيفة");
        } finally {
          setActionLoading(null);
          setModalLoading(false);
        }
      }
    });
  };

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get paginated data
  const paginatedJobs = pagination.getPaginatedData(filteredJobs);

  // Reset to page 1 when filters change
  useEffect(() => {
    pagination.reset();
  }, [searchTerm, statusFilter]);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={hideConfirmation}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        variant={modalState.variant}
        type={modalState.type}
        loading={modalState.loading}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الوظائف</h1>
          <p className="text-gray-600 mt-2">
            إدارة ومراقبة جميع الوظائف المعلن عنها
          </p>
        </div>

        <Button
          onClick={() => router.push("/admin/jobs/create")}
          size="lg"
      
        >
          <Plus size={20} className="ml-2" />
          إنشاء وظيفة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <JobStats jobs={jobs} />

      {/* Filters and Search */}
      <JobsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={fetchJobs}
        loading={loading}
        totalCount={jobs.length}
        filteredCount={filteredJobs.length}
      />

      {/* Jobs Table with Pagination */}
      <JobsTable
        jobs={paginatedJobs}
        onDelete={handleDeleteJob}
        onToggleStatus={handleToggleStatus}
        actionLoading={actionLoading}
        loading={loading && jobs.length === 0}
        // Pagination props
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        totalItems={filteredJobs.length}
        onPageChange={pagination.goToPage}
        showPagination={true}
      />
    </div>
  );
}
