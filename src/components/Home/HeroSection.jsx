//src\components\Home\HeroSection.jsx
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
    <section className="w-screen bg-gradient-to-br from-[#1D3D1E] to-[#2A5A2C] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative flex flex-col justify-center items-center text-center py-12 md:py-24 container-px">
        <h1 className="text-3xl md:text-6xl font-extrabold mb-6 text-[#F1DD8C] leading-relaxed">
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
  <form
    onSubmit={onSearchSubmit}
    className="flex w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#B38025]/30 mb-8 transform transition-all duration-300 hover:shadow-2xl hover:border-[#B38025] group"
  >
    <input
      type="text"
      placeholder="ادخل اسم الوظيفة للبحث..."
      value={searchTerm}
      onChange={onSearchChange}
      className="flex-1 px-6 py-4 focus:outline-none text-gray-800 placeholder:text-gray-400 text-base md:text-lg text-right bg-transparent"
    />
    <button
      type="submit"
      className="bg-[#B38025] px-6 py-4 md:px-10 text-white flex items-center justify-center gap-2 hover:bg-[#D6B666] hover:text-[#1D3D1E] transition-all duration-300 cursor-pointer active:scale-95 shadow-md hover:shadow-lg"
    >
      <Search className="w-6 h-6" />
      <span className="hidden md:inline font-bold text-lg">بحث</span>
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
