"use client";

export default function Footer() {
  return (
    <footer className="bg-[#1D3D1E] mt-8 w-screen">
      <div className="w-full container-px py-4 text-center text-sm md:text-base text-[#F1DD8C]">
        &copy; {new Date().getFullYear()} كل الحقوق محفوظه للشركه دار الشاي العربي
        للتجاره
      </div>
    </footer>
  );
}
