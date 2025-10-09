// hooks/useJobFilters.js
import { useState, useEffect } from "react";

export const useJobFilters = (jobs, initialSearchTerm = "") => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedLocation, setSelectedLocation] = useState("الكل");
  const [selectedJobType, setSelectedJobType] = useState("الكل");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = !searchTerm.trim() || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.category && job.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "الكل" || 
        job.category === selectedCategory ||
        job.title.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesLocation = selectedLocation === "الكل" || 
        (job.location && job.location.includes(selectedLocation));

      const matchesJobType = selectedJobType === "الكل" || 
        job.jobType === selectedJobType;

      return matchesSearch && matchesCategory && matchesLocation && matchesJobType;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedCategory, selectedLocation, selectedJobType]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("الكل");
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
};