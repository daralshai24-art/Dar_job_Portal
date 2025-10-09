// hooks/usePagination.js
import { useState } from "react";

/**
 * Hook for managing pagination state
 * Can be reused across different components
 */
export const usePagination = (initialState = {}) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    ...initialState,
  });

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const setItemsPerPage = (itemsPerPage) => {
    setPagination(prev => ({ ...prev, itemsPerPage, currentPage: 1 }));
  };

  const reset = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Calculate paginated data
  const getPaginatedData = (data = []) => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  return {
    ...pagination,
    goToPage,
    setItemsPerPage,
    reset,
    getPaginatedData,
  };
};