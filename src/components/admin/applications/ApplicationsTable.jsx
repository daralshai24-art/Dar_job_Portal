import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Download, Eye, Mail, Phone, Calendar, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/shared/ui/Card";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";
import { useTableSelection } from "@/hooks/useTableSelection";
import { BulkActionsBar } from "@/components/admin/shared/BulkActionsBar";
import { useState } from "react";
import toast from "react-hot-toast";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";

const ApplicationStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: "قيد المراجعة", color: "bg-yellow-100 text-yellow-800" },
    reviewed: { label: "تم المراجعة", color: "bg-blue-100 text-blue-800" },
    interview_scheduled: { label: "مقابلة مجدولة", color: "bg-purple-100 text-purple-800" },
    interview_completed: { label: "تمت المقابلة", color: "bg-indigo-100 text-indigo-800" },
    rejected: { label: "مرفوض", color: "bg-red-100 text-red-800" },
    hired: { label: "مقبول", color: "bg-green-100 text-green-800" }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

const ApplicationRow = ({ application, onView, onDownloadCV, isSelected, onSelect }) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <input
          type="checkbox"
          className="rounded border-gray-300 text-[#B38025] focus:ring-[#B38025]"
          checked={isSelected}
          onChange={() => onSelect(application._id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{application.name}</div>
          <div className="text-sm text-gray-500">{application.jobId?.title}</div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-900">
            <Mail size={14} className="ml-1" />
            {application.email}
          </div>
          {application.phone && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Phone size={14} className="ml-1" />
              {application.phone}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell>
        <ApplicationStatusBadge status={application.status} />
      </TableCell>

      <TableCell>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="ml-1" />
          {new Date(application.createdAt).toLocaleDateString('ar-EG')}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => onDownloadCV(application)}
            className="text-[#B38025] hover:text-[#D6B666] p-1 rounded transition-colors cursor-pointer"
            title="تحميل السيرة الذاتية"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => onView(application._id)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors cursor-pointer"
            title="عرض التفاصيل"
          >
            <Eye size={16} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const ApplicationsTable = ({
  applications,
  allIds,
  loading,
  onViewApplication,
  onDownloadCV,
  // Pagination props
  currentPage = 1,
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange,
  showPagination = true,
  // Refresh callback
  onRefresh
}) => {
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const { showConfirmation } = useConfirmationModal();

  const {
    selectedIds,
    handleSelect,
    handleSelectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate
  } = useTableSelection(applications, allIds);

  const handleBulkDelete = async () => {
    showConfirmation({
      title: "حذف الطلبات المحددة",
      message: `هل أنت متأكد من حذف ${selectedIds.length} طلب؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف",
      variant: "danger",
      onConfirm: async () => {
        setBulkDeleteLoading(true);
        try {
          const response = await fetch('/api/applications/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds }),
          });

          if (!response.ok) throw new Error('Failed to delete applications');

          toast.success('تم حذف الطلبات المحددة بنجاح');
          clearSelection();
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error('Bulk delete error:', error);
          toast.error('حدث خطأ أثناء حذف الطلبات');
        } finally {
          setBulkDeleteLoading(false);
        }
      }
    });
  };

  const columns = [
    { key: 'candidate', label: 'المتقدم / الوظيفة' },
    { key: 'contact', label: 'معلومات التواصل' },
    { key: 'status', label: 'الحالة' },
    { key: 'date', label: 'تاريخ التقديم' },
    { key: 'actions', label: 'الإجراءات' }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-16">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">جاري تحميل الطلبات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد طلبات توظيف
          </h3>
          <p className="text-gray-500">
            لم يتم تقديم أي طلبات توظيف حتى الآن
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        selection={{
          isAllSelected,
          isIndeterminate,
          onSelectAll: handleSelectAll
        }}
      >
        {applications.map((application) => (
          <ApplicationRow
            key={application._id}
            application={application}
            onView={onViewApplication}
            onDownloadCV={onDownloadCV}
            isSelected={selectedIds.includes(application._id)}
            onSelect={handleSelect}
          />
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

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onDelete={handleBulkDelete}
        onClearSelection={clearSelection}
        loading={bulkDeleteLoading}
      />
    </>
  );
};