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
        <nav className="hidden md:flex flex-row items-center gap-5 ml-10">
          <Link
            href="/"
            className="relative inline-flex items-center justify-center whitespace-nowrap font-bold text-[#1D3D1E] transition-colors duration-300 hover:text-[#B38025] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#B38025] after:transition-all after:duration-300 hover:after:w-full"
          >
            الرئيسيه
          </Link>
          <Link
            href="/jobs"
            className="relative inline-flex items-center justify-center whitespace-nowrap font-bold text-[#1D3D1E] transition-colors duration-300 hover:text-[#B38025] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#B38025] after:transition-all after:duration-300 hover:after:w-full"
          >
            الوظائف
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

        </div>
      )}
    </header>
  );
}
