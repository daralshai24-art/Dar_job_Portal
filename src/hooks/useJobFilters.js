// hooks/useJobFilters.js
"use client";

import { useState, useEffect, useMemo } from 'react';

export function useJobFilters(jobs, initialSearchTerm = "") {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("الكل");
  const [selectedJobType, setSelectedJobType] = useState("الكل");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !searchTerm ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "all" || 
        job.category?._id === selectedCategory ||
        job.category === selectedCategory; // Support both object and string

      const matchesLocation = selectedLocation === "الكل" || 
        job.location === selectedLocation;

      const matchesJobType = selectedJobType === "الكل" || 
        job.jobType === selectedJobType;

      return matchesSearch && matchesCategory && matchesLocation && matchesJobType;
    });
  }, [jobs, searchTerm, selectedCategory, selectedLocation, selectedJobType]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("الكل");
    setSelectedJobType("الكل");
  };

  return {
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
  };
}