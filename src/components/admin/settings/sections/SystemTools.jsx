"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2, Download, AlertTriangle, Database, FileSpreadsheet } from "lucide-react";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";

export default function SystemTools() {
  const [deleting, setDeleting] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false);
  
  const { showConfirmation } = useConfirmationModal();

  const deletionOptions = [
    {
      id: 'applications',
      title: 'حذف جميع طلبات التوظيف',
      description: 'سيتم حذف جميع طلبات التوظيف بشكل نهائي ولا يمكن استرجاعها',
      count: 0,
      endpoint: '/api/applications'
    },
    {
      id: 'jobs',
      title: 'حذف جميع الوظائف',
      description: 'سيتم حذف جميع الوظائف وطلبات التوظيف المرتبطة بها',
      count: 0,
      endpoint: '/api/jobs'
    },
    {
      id: 'users',
      title: 'حذف جميع المستخدمين',
      description: 'سيتم حذف جميع المستخدمين ما عدا حساب المدير الحالي',
      count: 0,
      endpoint: '/api/users'
    },
    {
      id: 'files',
      title: 'حذف جميع الملفات',
      description: 'سيتم حذف جميع السير الذاتية والملفات المرفوعة',
      count: 0,
      endpoint: '/api/files'
    }
  ];

  const handleDeleteAll = (option) => {
    showConfirmation({
      title: `حذف ${option.title}`,
      message: `هل أنت متأكد من حذف ${option.title}؟ هذا الإجراء لا يمكن التراجع عنه.`,
      variant: "danger",
      confirmText: "حذف",
      onConfirm: async () => {
        setDeleting(option.id);
        try {
          const response = await fetch(option.endpoint, {
            method: 'DELETE'
          });

          if (response.ok) {
            toast.success(`تم حذف ${option.title} بنجاح`);
            return true;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete');
          }
        } catch (error) {
          console.error('Error deleting:', error);
          toast.error(`حدث خطأ أثناء حذف ${option.title}: ${error.message}`);
          return false;
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `نسخة-احتياطية-${new Date().toISOString().split('T')[0]}.xlsx`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("تم إنشاء النسخة الاحتياطية بنجاح");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Backup failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      
      if (error.message.includes('401')) {
        toast.error("غير مصرح لك بإنشاء نسخة احتياطية");
      } else if (error.message.includes('403')) {
        toast.error("يجب أن تكون مديراً لإنشاء نسخة احتياطية");
      } else if (error.message.includes('404')) {
        toast.error("خدمة النسخ الاحتياطي غير متوفرة حالياً");
      } else {
        toast.error(`حدث خطأ أثناء إنشاء النسخة الاحتياطية: ${error.message}`);
      }
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">أدوات النظام</h2>
      
      <div className="space-y-6">
        {/* Backup Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-medium text-gray-800">النسخ الاحتياطي</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-600">
              إنشاء نسخة احتياطية من جميع بيانات النظام بصيغة Excel:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>المستخدمين والصلاحيات</li>
              <li>الوظائف والتخصصات</li>
              <li>طلبات التوظيف</li>
              <li>الفئات والإعدادات</li>
              <li>إحصائيات كاملة عن النظام</li>
            </ul>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Database className="w-4 h-4" />
                الملف سيحتوي على عدة أوراق Excel منظمة وسهلة القراءة
              </p>
            </div>
          </div>
          
          <button
            onClick={handleBackup}
            disabled={backupLoading}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-300 mt-4"
          >
            {backupLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {backupLoading ? 'جاري إنشاء ملف Excel...' : 'تحميل نسخة احتياطية (Excel)'}
          </button>
        </div>

        {/* Deletion Section */}
        <div className="border border-red-200 rounded-lg p-6 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-medium text-red-800">عمليات الحذف</h3>
          </div>
          
          <p className="text-red-600 mb-4">
            تحذير: هذه العمليات لا يمكن التراجع عنها
          </p>

          <div className="space-y-4">
            {deletionOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{option.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  {option.count > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      العدد الحالي: {option.count}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleDeleteAll(option)}
                  disabled={deleting === option.id}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-300 whitespace-nowrap"
                >
                  {deleting === option.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deleting === option.id ? 'جاري الحذف...' : 'حذف الكل'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}