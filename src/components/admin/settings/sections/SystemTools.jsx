  // src/components/admin/settings/sections/SystemTools.jsx
  "use client";

  import { useState } from "react";
  import { Trash2, Download, AlertTriangle, Database } from "lucide-react";

  export default function SystemTools() {
    const [deleting, setDeleting] = useState(null);
    const [backupLoading, setBackupLoading] = useState(false);

    const deletionOptions = [
      {
        id: 'applications',
        title: 'حذف جميع طلبات التوظيف',
        description: 'سيتم حذف جميع طلبات التوظيف بشكل نهائي ولا يمكن استرجاعها',
        count: 0, // You would fetch actual counts
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

    const handleDeleteAll = async (option) => {
      if (!confirm(`هل أنت متأكد من حذف ${option.title}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
        return;
      }

      setDeleting(option.id);
      try {
        const response = await fetch(option.endpoint, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert(`تم حذف ${option.title} بنجاح`);
          // Refresh counts or update UI
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting:', error);
        alert(`حدث خطأ أثناء حذف ${option.title}`);
      } finally {
        setDeleting(null);
      }
    };

    const handleBackup = async () => {
      setBackupLoading(true);
      try {
        const response = await fetch('/api/backup', {
          method: 'POST'
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          throw new Error('Backup failed');
        }
      } catch (error) {
        console.error('Error creating backup:', error);
        alert('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
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
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-800">النسخ الاحتياطي</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              إنشاء نسخة احتياطية من جميع بيانات النظام
            </p>
            
            <button
              onClick={handleBackup}
              disabled={backupLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300"
            >
              {backupLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download className="w-4 h-4" />
              )}
              {backupLoading ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية'}
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
                  <div>
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
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-300"
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