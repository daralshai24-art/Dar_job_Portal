// components/providers/ToastProvider.jsx
"use client";

import { Toaster } from "react-hot-toast";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1f2937',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '14px',
          fontFamily: 'var(--font-cairo), system-ui, sans-serif',
          padding: '12px 16px',
          textAlign: 'right',
          direction: 'rtl',
        },
        success: {
          duration: 6000,
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            borderLeft: '4px solid #22c55e',
          },
        },
        error: {
          duration: 5000,
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            borderLeft: '4px solid #ef4444',
          },
        },
        loading: {
          icon: <Loader className="w-4 h-4 text-amber-500 animate-spin" />,
          style: {
            background: '#fffbeb',
            color: '#92400e',
            borderLeft: '4px solid #f59e0b',
          },
        },
      }}
    />
  );
};

export default ToastProvider;