// components/shared/NotFound.jsx
"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowRight, Search, Briefcase, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const NotFound = ({ 
  title = "الصفحة غير موجودة",
  message = "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.",
  showBackButton = true,
  customActions = null
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

//   const quickActions = [
//     {
//       icon: Home,
//       label: "الصفحة الرئيسية",
//       description: "العودة إلى الصفحة الرئيسية",
//       action: () => router.push("/"),
//       color: "from-green-600 to-green-700"
//     },
//     {
//       icon: Briefcase,
//       label: "الوظائف",
//       description: "استكشف الوظائف المتاحة",
//       action: () => router.push("/jobs"),
//       color: "from-[#B38025] to-[#D6B666]"
//     },
//     {
//       icon: Search,
//       label: "البحث المتقدم",
//       description: "ابحث عن محتوى محدد",
//       action: () => {
//         const searchInput = document.querySelector('input[type="search"], input[placeholder*="بحث"]');
//         if (searchInput) {
//           searchInput.focus();
//         } else {
//           router.push("/jobs");
//         }
//       },
//       color: "from-blue-600 to-blue-700"
//     }
//   ];

  return (
    <div 
      className={`
        min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4
        transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      dir="rtl"
    >
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon with built-in pulse */}
        <div className="mb-6 animate-bounce">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertCircle className="w-16 h-16 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title & Message with fade-in slide-up */}
        <div className={`
          mb-8 transition-all duration-700 delay-300
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        {/* Primary Actions */}
        <div className={`
          flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-500
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 border-2 border-[#B38025] text-[#B38025] bg-transparent hover:bg-[#B38025] hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:ring-offset-2 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للخلف
            </button>
          )}
          
          {/* <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-gradient-to-l from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            الصفحة الرئيسية
          </button> */}
        </div>

        {/* Custom Actions */}
        {customActions && (
          <div className={`
            mb-8 transition-all duration-700 delay-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}>
            {customActions}
          </div>
        )}

        {/* Quick Actions Grid */}
        {/* <div className={`
          transition-all duration-700 delay-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            ربما تريد زيارة:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="
                  bg-white p-6 rounded-xl shadow-md border border-gray-200 
                  hover:shadow-lg transition-all duration-300 text-right 
                  group cursor-pointer hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:ring-offset-2
                "
              >
                <div className={`
                  w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg 
                  flex items-center justify-center mb-4 
                  transition-transform duration-300 group-hover:scale-110
                `}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {action.label}
                </h4>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div> */}

        {/* Error Code */}
        <div className={`
          mt-12 pt-6 border-t border-gray-200 transition-all duration-700 delay-900
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          <p className="text-sm text-gray-500">
            رمز الخطأ: <span className="font-mono bg-gray-100 px-2 py-1 rounded">404</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;