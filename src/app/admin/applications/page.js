"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Components
import { ApplicationsStats } from "@/components/admin/applications/ApplicationsStats";
import { ApplicationsFilters } from "@/components/admin/applications/ApplicationsFilters";
import { ApplicationsTable } from "@/components/admin/applications/ApplicationsTable";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/applications");
      
      if (!response.ok) throw new Error("Failed to fetch applications");
      
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      !searchTerm ||
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.jobId?.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewApplication = (applicationId) => {
    router.push(`/admin/applications/${applicationId}`);
  };

  const handleDownloadCV = (application) => {
    if (application.cv?.path) {
      window.open(application.cv.path, '_blank');
    } else {
      toast.error("لا يوجد ملف مرفق");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">طلبات التوظيف</h1>
          <p className="text-gray-600 mt-2">
            إدارة ومراقبة طلبات التوظيف للموظفين المحتملين
          </p>
        </div>
      </div>

      {/* Statistics */}
      <ApplicationsStats applications={applications} />

      {/* Filters */}
      <ApplicationsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={fetchApplications}
        loading={loading}
        totalCount={applications.length}
        filteredCount={filteredApplications.length}
      />

      {/* Applications Table */}
      <ApplicationsTable
        applications={filteredApplications}
        loading={loading}
        onViewApplication={handleViewApplication}
        onDownloadCV={handleDownloadCV}
      />
    </div>
  );
}