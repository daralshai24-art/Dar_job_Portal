// components/admin/jobs/JobsTable.js
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { JobActions } from "./JobActions";
import { JOB_STATUS, TABLE_COLUMNS } from "@/lib/constants";
import { Users, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const StatusButton = ({ status, onClick, disabled }) => {
  const statusConfig = JOB_STATUS[status?.toUpperCase()] || JOB_STATUS.ACTIVE;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusConfig.color} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
      }`}
    >
      {statusConfig.label}
    </button>
  );
};

const JobDetails = ({ job }) => (
  <div className="flex flex-col">
    <div className="text-xl font-medium text-gray-900 mb-1">
      {job.title}
    </div>
    <div className="text-xs text-gray-500 mb-2 line-clamp-2">
      {job.description?.substring(0, 100)}...
    </div>
    <div className="flex flex-wrap gap-2">
      {job.location && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {job.location}
        </span>
      )}
      {job.category && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
          {job.category}
        </span>
      )}
      {job.jobType && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          {job.jobType}
        </span>
      )}
    </div>
  </div>
);

export const JobsTable = ({ 
  jobs, 
  onDelete, 
  onToggleStatus, 
  actionLoading,
  loading,
  // Pagination props
  currentPage = 1,
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange,
  showPagination = true
}) => {
  const router = useRouter();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38025] mx-auto mb-4"></div>
        <p className="text-gray-600">تحميل الوظائف...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          لم يتم العثور على وظائف
        </h3>
        <p className="text-gray-500 mb-4">
          لم يتم إنشاء أي وظائف حتى الآن
        </p>
      </div>
    );
  }

  return (
    <>
      <Table columns={TABLE_COLUMNS.JOBS}>
        {jobs.map((job) => (
          <TableRow key={job._id}>
            {/* Job Details */}
            <TableCell>
              <JobDetails job={job} />
            </TableCell>

            {/* Status */}
            <TableCell>
              <StatusButton
                status={job.status}
                onClick={() => onToggleStatus(job._id, job.status)}
                disabled={actionLoading === job._id}
              />
            </TableCell>

            {/* Applications Count */}
            <TableCell>
              <button
                onClick={() => router.push(`/admin/jobs/${job._id}/applications`)}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                <Users size={16} className="ml-1" />
                {job.applicationsCount || 0}
              </button>
            </TableCell>

            {/* Posted Date */}
            <TableCell className="text-sm text-gray-500">
              {formatDate(job.createdAt)}
            </TableCell>

            {/* Actions */}
            <TableCell>
              <JobActions
                job={job}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                actionLoading={actionLoading}
              />
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {/* Pagination */}
      {showPagination && totalItems > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};