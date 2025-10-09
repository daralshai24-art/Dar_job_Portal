// app/test-toast/page.jsx
"use client";

import { toast } from "react-hot-toast";

export default function TestToast() {
  const showToasts = () => {
    // Test success toast
    toast.success('نجاح: تم العملية بنجاح!');
    
    // Test error toast after 1 second
    setTimeout(() => {
      toast.error('خطأ: حدث خطأ ما');
    }, 1000);
    
    // Test loading toast after 2 seconds
    setTimeout(() => {
      const loadingToast = toast.loading('جاري التحميل...');
      
      // Dismiss loading after 3 seconds
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.success('تم التحميل بنجاح!');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">اختبار الإشعارات</h1>
        <button
          onClick={showToasts}
          className="bg-[#B38025] text-white px-6 py-3 rounded-lg hover:bg-[#D6B666] transition-colors"
        >
          عرض الإشعارات التجريبية
        </button>
      </div>
    </div>
  );
}