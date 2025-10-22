// src/components/admin/dashboard/StatsGrid.jsx
import StatCard from "./StatCard";
import { Briefcase, Clock, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StatsGrid({ stats }) {
  const router = useRouter();

  const statCards = [
    {
      title: "الوظائف النشطة",
      value: stats.activeJobs,
      subtitle: `من إجمالي ${stats.totalJobs} وظيفة`,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: stats.activeJobs > 0 ? "positive" : "neutral",
      onClick: () => router.push('/admin/jobs?status=active')
    },
    {
      title: "طلبات في الانتظار",
      value: stats.pendingApplications,
      subtitle: `من إجمالي ${stats.totalApplications} طلب`,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: stats.pendingApplications > 0 ? "attention" : "positive",
      onClick: () => router.push('/admin/applications?status=pending')
    },
    {
      title: "إجمالي الطلبات",
      value: stats.totalApplications,
      subtitle: "جميع طلبات التوظيف",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "neutral",
      onClick: () => router.push('/admin/applications')
    },
    {
      title: "المستخدمون المسجلون",
      value: stats.totalUsers,
      subtitle: "إجمالي المستخدمين",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "neutral",
      onClick: () => router.push('/admin/users')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}