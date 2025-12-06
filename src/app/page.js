// src/app/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/Home/HeroSection";
import JobsSection from "@/components/Home/JobsSection";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";
import toast from "react-hot-toast";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/jobs?status=active");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("حدث خطأ في تحميل الوظائف");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = !searchTerm ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" ||
      job.category?._id === selectedCategory ||
      job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleViewAllJobs = () => {
    router.push("/jobs");
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    document.getElementById("jobs-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full overflow-x-hidden pt-16 md:pt-20">
      <Header />

      {/* Hero Section - Always visible */}
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchSubmit={handleSearch}
        onViewAllJobs={handleViewAllJobs}
      />

      {/* Jobs Section with proper loading container */}
      {loading ? (
        <JobsSectionLoading />
      ) : (
        <JobsSection
          jobs={jobs}
          loading={false}
          filteredJobs={filteredJobs}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onViewAllJobs={handleViewAllJobs}
          searchTerm={searchTerm}
          onClearFilters={handleClearFilters}
        />
      )}

      <Footer />
    </div>
  );
}

// Loading state that takes the same space as the actual JobsSection
const JobsSectionLoading = () => (
  <section className="flex-1 bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header Skeleton */}
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-300 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>

      {/* Categories Loading */}
      <div className="mb-8 flex justify-center">
        <div className="flex flex-wrap justify-center gap-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-300 rounded-full w-24 animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Jobs Grid Loading */}
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل الوظائف...</p>
        </div>
      </div>
    </div>
  </section>
);