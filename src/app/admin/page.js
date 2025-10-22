// src/app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";

export default function AdminOverview() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [jobsRes, applicationsRes, usersRes] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/applications?limit=10'),
          fetch('/api/users')
        ]);

        if (!jobsRes.ok || !applicationsRes.ok || !usersRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const jobs = await jobsRes.json();
        const applications = await applicationsRes.json();
        const users = await usersRes.json();

        // Ensure we have arrays even if API returns different structure
        const safeJobs = Array.isArray(jobs) ? jobs : [];
        const safeApplications = Array.isArray(applications) ? applications : [];
        const safeUsers = Array.isArray(users) ? users : [];

        setDashboardData({
          jobs: safeJobs,
          applications: safeApplications,
          users: safeUsers
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set empty data on error to prevent crashes
        setDashboardData({
          jobs: [],
          applications: [],
          users: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardOverview 
      data={dashboardData}
      loading={loading}
    />
  );
}