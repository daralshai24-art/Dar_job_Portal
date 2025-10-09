"use client";

import Link from "next/link";
import Image from "next/image";
import LogoImg from "../../../public/images/logo darelshai -01.png"; // Place your logo image in public folder

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-2">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between h-16">
        {/* Logo + Company Name */}
        <div className="flex items-center justify-start space-x-2">
          {/* Logo container */}
          <div className="relative h-12 w-12 md:h-100 md:w-40 flex-shrink-0">
            <Image
              src={LogoImg}
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Company name */}
          <span className="text-xl font-bold text-[#1D3D1E] leading-none">
            دار الشاي العربي
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-[#1D3D1E] hover:text-[#D6B666] transition"
          >
            الرئيسيه
          </Link>
          <Link
            href="/jobs"
            className="text-[#1D3D1E] hover:text-[#D6B666] transition"
          >
            الوظائف
          </Link>

          <Link
            href="/login"
            className="
    relative
    px-10 py-3
    bg-[#1D3D1E] 
    text-white 
    rounded-lg 
    font-medium
    overflow-hidden
    transform
    transition-all 
    duration-300 
    ease-in-out
    hover:bg-[#B38025]
    hover:scale-105
    hover:shadow-lg
    hover:shadow-[#B38025]/20
    active:scale-95
    group
    focus:outline-none
    focus:ring-2
    focus:ring-[#B38025]/50
    focus:ring-offset-2
    before:absolute
    before:inset-0
    before:bg-gradient-to-r
    before:from-transparent
    before:via-white/10
    before:to-transparent
    before:translate-x-[-100%]
    before:hover:translate-x-[100%]
    before:transition-transform
    before:duration-700
    before:ease-in-out
  "
          >
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              دخول
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
