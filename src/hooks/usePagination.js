import { useState, useCallback } from "react";

/**
 * Hook for managing pagination state
 */
export const usePagination = (initialState = {}) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    ...initialState,
  });

  const goToPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setItemsPerPage = useCallback((itemsPerPage) => {
    setPagination(prev => ({ ...prev, itemsPerPage, currentPage: 1 }));
  }, []);

  const reset = useCallback(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const getPaginatedData = useCallback(
    (data = []) => {
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      return data.slice(startIndex, endIndex);
    },
    [pagination.currentPage, pagination.itemsPerPage]
  );

  return {
    ...pagination,
    goToPage,
    setItemsPerPage,
    reset,
    getPaginatedData,
  };
};
