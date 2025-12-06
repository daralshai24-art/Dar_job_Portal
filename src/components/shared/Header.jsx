"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "../../../public/images/logo-darelshai.svg";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-screen bg-white/95 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100">
      <div className="w-full container-px flex items-center justify-between h-16 md:h-20">
        {/* Logo + Company Name */}
        <Link href="/" className="flex items-center justify-start gap-3 group">
          {/* Logo container */}
          <div className="relative h-12 w-12 md:h-16 md:w-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={LogoImg}
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Company name */}
          <span className="text-md md:text-2xl font-bold text-[#1D3D1E] whitespace-nowrap tracking-wide transition-colors duration-300 group-hover:text-[#B38025]">
            دار الشاي العربي
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#1D3D1E] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5 duration-200">
          <Link
            href="/"
            className="text-[#1D3D1E] hover:text-[#D6B666] transition py-2 border-b border-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            الرئيسيه
          </Link>
          <Link
            href="/jobs"
            className="text-[#1D3D1E] hover:text-[#D6B666] transition py-2 border-b border-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            الوظائف
          </Link>
          <Link
            href="/login"
            className="bg-[#1D3D1E] text-white py-3 rounded-lg text-center hover:bg-[#B38025] transition mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            دخول
          </Link>
        </div>
      )}
    </header>
  );
}
