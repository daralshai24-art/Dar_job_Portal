// app/(public)/jobs/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import JobList from "@/components/jobs/JobList";
import JobsHeader from "@/components/public/JobsHeader";
import JobsContent from "@/components/public/JobsContent";
import FiltersSidebar from "@/components/public/FiltersSidebar";

// Hooks
import { useJobsData } from "@/hooks/useJobsData";
import { useJobFilters } from "@/hooks/useJobFilters";

// Constants
import { CATEGORIES, LOCATIONS, JOB_TYPES } from "@/constants/filterOptions";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get("search") || "";
  
  const { jobs, loading } = useJobsData();
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    selectedJobType,
    setSelectedJobType,
    filteredJobs,
    resetFilters
  } = useJobFilters(jobs, initialSearchTerm);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-1">
        <JobsHeader totalJobs={jobs.length} filteredJobs={filteredJobs} loading={loading} />
        
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <FiltersSidebar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                selectedJobType={selectedJobType}
                onJobTypeChange={setSelectedJobType}
                onResetFilters={resetFilters}
                categories={CATEGORIES}
                locations={LOCATIONS}
                jobTypes={JOB_TYPES}
              />
            </div>

            {/* Jobs Content */}
            <div className="lg:col-span-3">
              <JobsContent 
                filteredJobs={filteredJobs} 
                totalJobs={jobs.length} 
                loading={loading}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                onResetFilters={resetFilters}
              >
                <JobList jobs={filteredJobs} loading={loading} />
              </JobsContent>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}