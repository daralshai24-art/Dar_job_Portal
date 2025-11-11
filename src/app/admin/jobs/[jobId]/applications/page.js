//src/app/admin/jobs/[jobId]/applications/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Users, Download, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

// Components
import { ApplicationsTable } from "@/components/admin/applications/ApplicationsTable";
import { ApplicationsFilters } from "@/components/admin/applications/ApplicationsFilters";
import { JobIcon } from "@/components/shared/ui/JobIcons";
import Button from "@/components/shared/ui/Button";

// Helper function to get category name
const getCategoryName = (category) => {
  if (!category) return "غير محدد";
  if (typeof category === 'string') return category;
  return category.name || "غير محدد";
};

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId;
  
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (jobId) {
      fetchJobApplications();
      fetchJobDetails();
    }
  }, [jobId,fetchJobApplications,fetchJobDetails]);

  const fetchJobApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications?jobId=${jobId}`);
      
      if (!response.ok) throw new Error("Failed to fetch applications");
      
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل في تحميل طلبات الوظيفة");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (response.ok) {
        const jobData = await response.json();
        console.log('Fetched job data:', jobData); // Debug log
        setJob(jobData);
      } else {
        console.error('Failed to fetch job:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      !searchTerm ||
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase());

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

  // Get category name using helper function
  const categoryName = getCategoryName(job?.category);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button
            onClick={() => router.push(`/admin/jobs/${jobId}`)}
            variant="outline"
            className="mb-4"
          >
            <ArrowRight className="ml-1 h-4 w-4" />
            العودة للوظيفة
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-800">
            طلبات التوظيف للوظيفة
          </h1>
          <p className="text-gray-600 mt-2">
            {job?.title} - {applications.length} طلب
          </p>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            onClick={() => router.push("/admin/applications")}
            variant="outline"
          >
            <Users className="ml-1 h-4 w-4" />
            جميع الطلبات
          </Button>
        </div>
      </div>

      {/* Job Info Card */}
      {job && (
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#B38025]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
              <div className="flex items-center space-x-4 space-x-reverse mt-2 text-sm text-gray-600">
                {job.location && (
                  <div className="flex items-center">
                    <JobIcon type="location" className="ml-1 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                )}
                {categoryName && categoryName !== "غير محدد" && (
                  <div className="flex items-center">
                    <JobIcon type="category" className="ml-1 text-gray-500" />
                    <span>{categoryName}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <JobIcon type="applications" className="ml-1 text-gray-500" />
                  <span>{job.applicationsCount || 0} متقدم</span>
                </div>
                {job.jobType && (
                  <div className="flex items-center">
                    <JobIcon type="type" className="ml-1 text-gray-500" />
                    <span>{job.jobType}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <JobIcon type="date" className="ml-1 text-gray-500" />
              آخر تحديث: {new Date(job.updatedAt).toLocaleDateString('ar-EG')}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <ApplicationsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={fetchJobApplications}
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