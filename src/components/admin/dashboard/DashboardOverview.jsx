// src/components/admin/dashboard/DashboardOverview.jsx
import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import RecentApplications from "./RecentApplications";
import SystemSummary from "./SystemSummary";
import DashboardLoading from "./DashboardLoading";

export default function DashboardOverview({ data, loading }) {
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
    </div>
  );
}