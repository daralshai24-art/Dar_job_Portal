"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import with SSR disabled
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        return function Comp({ forwardedRef, ...props }) {
            return <RQ ref={forwardedRef} {...props} />;
        };
    },
    { ssr: false, loading: () => <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" /> }
);

// Define modules and formats outside to prevent re-creation on every render
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'direction': 'rtl' }, { 'align': [] }],
        ['link', 'clean']
    ]
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'direction', 'align',
    'link'
];

export default function RichTextEditor({
    label,
    value,
    onChange,
    placeholder,
    error,
    className,
    required
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg" />
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className={`bg-white rounded-lg overflow-hidden transition-colors ${error ? 'border border-red-500' : 'border border-gray-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
                }`}>
                <ReactQuill
                    theme="snow"
                    value={value || ''}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    className="rtl-quill"
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

            <style jsx global>{`
        .rtl-quill .ql-editor {
          min-height: 150px;
          text-align: right;
          direction: rtl;
          font-family: inherit;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .rtl-quill .ql-editor.ql-blank::before {
          right: 15px;
          text-align: right;
          font-style: normal;
          color: #9ca3af;
        }
        .rtl-quill .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          direction: ltr; /* Toolbar icons LTR */
        }
        .rtl-quill .ql-container.ql-snow {
          border: none;
        }
        /* Custom scrollbar for editor */
        .rtl-quill .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        .rtl-quill .ql-editor::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .rtl-quill .ql-editor::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 4px;
        }
        .rtl-quill .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}</style>
        </div>
    );
}
