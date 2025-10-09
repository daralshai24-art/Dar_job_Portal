// components/jobs/public/NoResults.jsx
import { Search, Filter, RefreshCw, Mail, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const NoResults = ({ 
  searchTerm, 
  selectedCategory, 
  selectedLocation,
  onResetFilters 
}) => {
  const router = useRouter();

  const suggestions = [
    {
      icon: Filter,
      title: "جرب خيارات بحث أوسع",
      description: "قم بتوسيع نطاق البحث بإزالة بعض خيارات البحث",
      action: onResetFilters,
      actionText: "إعادة تعيين خيارات البحث"
    },
    {
      icon: Search,
      title: "ابحث بكلمات أخرى",
      description: "جرب كلمات بحث مختلفة أو أكثر عمومية",
      action: () => router.push("/jobs"),
      actionText: "عرض جميع الوظائف"
    },
    {
      icon: Mail,
      title: "اشترك في التنبيهات",
      description: "سنخبرك عندما تتوفر وظائف جديدة تناسب بحثك",
      action: () => console.log("Subscribe to alerts"),
      actionText: "تفعيل التنبيهات"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      {/* Main Illustration & Message */}
      <div className="max-w-md mx-auto mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-red-500" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          لايوجد نتائج للبحث
        </h3>
        
        <p className="text-gray-600 mb-6">
          {searchTerm || selectedCategory !== "الكل" || selectedLocation !== "الكل" 
            ? "لا توجد وظائف تطابق معايير البحث الحالية. جرب تعديل خيارات البحث أو البحث بكلمات أخرى."
            : "لا توجد وظائف متاحة حالياً. تحقق لاحقاً أو اشترك في تنبيهات الوظائف."
          }
        </p>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== "الكل" || selectedLocation !== "الكل") && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-700 mb-2">خيارات البحث الحالية:</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {searchTerm && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  البحث: {searchTerm}
                </span>
              )}
              {selectedCategory !== "الكل" && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  التصنيف: {selectedCategory}
                </span>
              )}
              {selectedLocation !== "الكل" && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  الموقع: {selectedLocation}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 bg-[#B38025] text-white px-6 py-3 rounded-lg hover:bg-[#D6B666] transition-colors cursor-pointer"
        >
          <RefreshCw size={18} />
          عرض جميع الوظائف
        </button>
        
        {/* <button
          onClick={() => router.push("/contact")}
          className="flex items-center gap-2 border border-[#B38025] text-[#B38025] px-6 py-3 rounded-lg hover:bg-[#B38025] hover:text-white transition-colors"
        >
          <Mail size={18} />
          تواصل معنا
        </button> */}
      </div>

      {/* Suggestions Grid */}
      {/* <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <suggestion.icon className="w-6 h-6 text-[#B38025]" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">{suggestion.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{suggestion.description}</p>
            <button
              onClick={suggestion.action}
              className="text-[#B38025] hover:text-green-800 font-medium text-sm transition-colors"
            >
              {suggestion.actionText} →
            </button>
          </div>
        ))}
      </div> */}

      {/* Additional Help */}
      {/* <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          لا تجد ما تبحث عنه؟{" "}
          <button 
            onClick={() => router.push("/contact")}
            className="text-[#B38025] hover:text-green-800 font-medium"
          >
            تواصل مع فريق التوظيف
          </button>{" "}
          وسنكون سعداء بمساعدتك.
        </p>
      </div> */}
    </div>
  );
};

export default NoResults;