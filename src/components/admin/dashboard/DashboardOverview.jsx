// src/components/admin/dashboard/DashboardOverview.jsx
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import RecentApplications from "./RecentApplications";
import SystemSummary from "./SystemSummary";
import AnalyticsStats from "../analytics/AnalyticsStats";
import DashboardLoading from "./DashboardLoading";

export default function DashboardOverview({ data, loading }) {
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (loading || !data) {
    return <DashboardLoading />;
  }

  const { jobs, applications, users } = data;

  // Calculate stats and process dates
  const processedApplications = applications.map(app => ({
    ...app,
    createdAt: new Date(app.createdAt) // Convert string to Date object
  }));

  const stats = {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    totalUsers: users.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    activeJobs: jobs.filter(job => job.status === 'active').length,
    inactiveJobs: jobs.filter(job => job.status === 'inactive').length,
    recentApplications: processedApplications.slice(0, 5)
  };

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions className="lg:col-span-1" />
        <RecentApplications
          applications={stats.recentApplications}
          className="lg:col-span-2"
        />
      </div>

      <SystemSummary stats={stats} />

      <div className="flex justify-center border-t pt-6">
        <button
          onClick={() => setShowAnalytics((prev) => !prev)}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B38025] transition-all shadow-sm flex items-center gap-2"
        >
          {showAnalytics ? "إخفاء التحليلات التفصيلية" : "عرض سجل الزوار والتحليلات"}
        </button>
      </div>

      {showAnalytics && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AnalyticsStats />
        </div>
      )}
    </div>
  );
}