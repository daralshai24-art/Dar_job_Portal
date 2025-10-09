import { Search, TrendingUp, Users, Award } from "lucide-react";
import { COLORS } from "@/lib/constants";

const HeroSection = ({ 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit, 
  onViewAllJobs,
//   stats 
}) => {
  return (
    <section className="bg-gradient-to-br from-[#1D3D1E] to-[#2A5A2C] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative flex flex-col justify-center items-center text-center py-24 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#F1DD8C] leading-tight">
          أهلا بكم في بوابة
          <br />
          <span className="text-white">دار الشاي العربي للوظائف</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed opacity-90">
          كن شريكاً معنا في التطور والإبداع واكتشف الفرص الوظيفية المميزة
        </p>

        {/* Search Form */}
        <SearchForm 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
        />

        {/* Stats */}
 

        {/* CTA Button */}
        <ViewAllJobsButton onClick={onViewAllJobs} />
      </div>
    </section>
  );
};

const SearchForm = ({ searchTerm, onSearchChange, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit} className="flex w-full max-w-lg shadow-xl rounded-lg overflow-hidden border border-[#B38025] mb-8">
    <input
      type="text"
      placeholder="ادخل اسم الوظيفة للبحث"
      value={searchTerm}
      onChange={onSearchChange}
      className="flex-1 px-8 py-4 focus:outline-none focus:ring-2 focus:ring-[#D6B666] placeholder:text-[#D6B666] text-lg text-right"
    />
    <button
      type="submit"
      className="bg-[#B38025] px-6 py-4 text-white flex items-center justify-center hover:bg-[#D6B666] hover:text-[#1D3D1E] transition-all duration-300 cursor-pointer"
    >
      <Search size={24} />
    </button>
  </form>
);


const ViewAllJobsButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="relative bg-transparent border-2 border-[#F1DD8C] text-[#F1DD8C] px-8 py-3 rounded-lg font-medium cursor-pointer overflow-hidden transform transition-all duration-300 ease-in-out hover:bg-[#F1DD8C] hover:text-[#1D3D1E] hover:scale-105 hover:shadow-lg hover:shadow-[#F1DD8C]/25 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#F1DD8C]/50 focus:ring-offset-2"
  >
    <span className="relative z-10 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:font-semibold">
      عرض جميع الوظائف
    </span>
  </button>
);

export default HeroSection;