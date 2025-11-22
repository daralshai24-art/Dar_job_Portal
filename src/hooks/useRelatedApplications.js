"use client";

import { useState, useEffect, useCallback } from "react";

export function useRelatedApplications(email, currentId) {
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchRelatedApplications = useCallback(async () => {
    console.log("=== HOOK: fetchRelatedApplications called ===");
    console.log("Email:", email);
    console.log("CurrentId:", currentId);

    // Don't fetch if no email
    if (!email) {
      console.log("No email provided, skipping fetch");
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    console.log("State set to loading...");

    try {
      const params = new URLSearchParams({ email });
      if (currentId) {
        params.append("currentId", currentId);
      }

      const url = `/api/applications/related?${params}`;
      console.log("Fetching URL:", url);

      const response = await fetch(url);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const result = await response.json();
      console.log("Response JSON:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch related applications");
      }

      console.log("Setting state with data:");
      console.log("  - success:", result.success);
      console.log("  - count:", result.count);
      console.log("  - data length:", result.data?.length);
      console.log("  - data:", result.data);

      setState({
        data: result.data || [],
        loading: false,
        error: null,
      });

      console.log("State updated successfully");

    } catch (error) {
      console.error("[useRelatedApplications Error]:", error);
      setState({
        data: [],
        loading: false,
        error: error.message,
      });
    }

    console.log("=== HOOK: fetchRelatedApplications completed ===");
  }, [email, currentId]);

  useEffect(() => {
    console.log("=== HOOK: useEffect triggered ===");
    fetchRelatedApplications();
  }, [fetchRelatedApplications]);

  console.log("=== HOOK: Rendering with state ===");
  console.log("  - data length:", state.data?.length);
  console.log("  - loading:", state.loading);
  console.log("  - error:", state.error);

  return {
    relatedApplications: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchRelatedApplications,
  };
}