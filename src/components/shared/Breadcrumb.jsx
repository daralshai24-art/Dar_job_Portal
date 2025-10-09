// components/shared/Breadcrumb.jsx
"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Breadcrumb = ({ items }) => {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ArrowRight size={16} className="rotate-180 mx-2" />}
              {item.href ? (
                <button
                  onClick={() => router.push(item.href)}
                  className="hover:text-[#B38025] transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-gray-800 font-medium truncate max-w-xs">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;