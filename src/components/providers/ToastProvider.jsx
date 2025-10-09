// components/providers/ToastProvider.jsx
"use client";

import { Toaster } from "react-hot-toast";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const ToastProvider = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        // Remove containerStyle to avoid hydration issues
        toastOptions={{
          duration: 2000,
          className: 'custom-toast',
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'var(--font-cairo)',
            padding: '16px 20px',
            textAlign: 'right',
            direction: 'rtl',
            maxWidth: '400px',
            minWidth: '300px',
          },
          success: {
            className: 'custom-toast-success',
            icon: <CheckCircle className="w-5 h-5" />,
          },
          error: {
            className: 'custom-toast-error',
            icon: <XCircle className="w-5 h-5" />,
          },
          loading: {
            className: 'custom-toast-loading',
            icon: <Loader className="w-5 h-5 animate-spin" />,
          },
        }}
      />
      
      {/* Add global CSS for toast positioning */}
      <style jsx global>{`
        [data-rht-toaster] {
          position: fixed !important;
          top: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 9999 !important;
          pointer-events: none !important;
        }
        
        .custom-toast-success {
          background: #f0fdf4 !important;
          color: #166534 !important;
          border: 1px solid #dcfce7 !important;
          border-right: 4px solid #16a34a !important;
        }
        
        .custom-toast-error {
          background: #fef2f2 !important;
          color: #991b1b !important;
          border: 1px solid #fecaca !important;
          border-right: 4px solid #dc2626 !important;
        }
        
        .custom-toast-loading {
          background: #fffbeb !important;
          color: #92400e !important;
          border: 1px solid #fef3c7 !important;
          border-right: 4px solid #f59e0b !important;
        }
      `}</style>
    </>
  );
};

export default ToastProvider;