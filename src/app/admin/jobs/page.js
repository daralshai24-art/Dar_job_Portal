//src\app\admin\jobs\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import { JobStats } from "@/components/jobs/stats/JobStats";
import { JobsFilters } from "@/components/admin/jobs/JobsFilters";
import { JobsTable } from "@/components/admin/jobs/JobsTable";

import Button from "@/components/shared/ui/Button";
import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";

import { usePagination } from "@/hooks/usePagination";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const router = useRouter();
  const { modalState, showConfirmation, hideConfirmation } = useConfirmationModal();
  const pagination = usePagination({ itemsPerPage: 5, currentPage: 1 });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch {
      toast.error("فشل في تحميل الوظائف");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => fetchJobs();
    load();
  }, []);

  const handleToggleStatus = (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const job = jobs.find((j) => j._id === jobId);

    showConfirmation({
      title: currentStatus === "active" ? "إيقاف الوظيفة" : "تفعيل الوظيفة",
      message: `هل أنت متأكد من تغيير حالة "${job.title}"؟`,
      confirmText: currentStatus === "active" ? "إيقاف" : "تفعيل",
      variant: currentStatus === "active" ? "warning" : "success",
      onConfirm: async () => {
        setActionLoading(jobId);

        try {
          await fetch(`/api/jobs/${jobId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });

          toast.success("تم تحديث الحالة بنجاح");
          await fetchJobs();
          hideConfirmation();
        } catch {
          toast.error("حدث خطأ");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleDeleteJob = (jobId, title) => {
    showConfirmation({
      title: "حذف الوظيفة",
      message: `هل أنت متأكد من حذف "${title}"؟`,
      confirmText: "حذف",
      variant: "danger",
      onConfirm: async () => {
        try {
          await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
          toast.success("تم حذف الوظيفة");
          fetchJobs();
          hideConfirmation();
        } catch {
          toast.error("حدث خطأ أثناء الحذف");
        }
      },
    });
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginated = pagination.getPaginatedData(filteredJobs);

  useEffect(() => pagination.reset(), [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <ConfirmationModal {...modalState} onClose={hideConfirmation} />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الوظائف</h1>
        <Button onClick={() => router.push("/admin/jobs/create")}>
          <Plus className="ml-2" size={20} /> إنشاء وظيفة
        </Button>
      </div>

      <JobStats jobs={jobs} />

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

      <JobsTable
        jobs={paginated}
        onDelete={handleDeleteJob}
        onToggleStatus={handleToggleStatus}
        actionLoading={actionLoading}
        loading={loading && jobs.length === 0}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        totalItems={filteredJobs.length}
        onPageChange={pagination.goToPage}
        showPagination={true}
      />
    </div>
  );
}