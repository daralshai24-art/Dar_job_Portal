"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import JobsSection from "@/components/home/JobsSection";
import { TrendingUp, Users, Award } from "lucide-react";
import toast from "react-hot-toast";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const router = useRouter();

  // Stats for hero section
  const stats = [
    { icon: TrendingUp, label: "وظيفة متاحة", value: jobs.length },
    { icon: Users, label: "موظف", value: "500+" },
    { icon: Award, label: "معدل النجاح", value: "95%" },
  ];

  /**
   * Fetch jobs from API on component mount
   */
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

  /**
   * Filter jobs based on search term and selected category
   */
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "الكل" ||
      job.category === selectedCategory ||
      job.title.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  /**
   * Handle search form submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  /**
   * Navigate to jobs page
   */
  const handleViewAllJobs = () => {
    router.push("/jobs");
  };

  /**
   * Handle category selection
   */
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Scroll to jobs section
    document.getElementById("jobs-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  /**
   * Clear search and category filters
   */
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("الكل");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchSubmit={handleSearch}
        onViewAllJobs={handleViewAllJobs}
        // stats={stats}
      />

      <JobsSection
        jobs={jobs}
        loading={loading}
        filteredJobs={filteredJobs}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onViewAllJobs={handleViewAllJobs}
        searchTerm={searchTerm}
        onClearFilters={handleClearFilters}
      />

      <Footer />
    </div>
  );
}