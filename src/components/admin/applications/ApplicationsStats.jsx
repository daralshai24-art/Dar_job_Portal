import { Users, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/Card";

const StatCard = ({ icon: Icon, label, value, color = "text-blue-600" }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-gray-50 ${color}`}>
          <Icon size={24} />
        </div>
        <div className="mr-4">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ApplicationsStats = ({ applications }) => {
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interview: applications.filter(app => 
      ['interview_scheduled', 'interview_completed'].includes(app.status)
    ).length,
    hired: applications.filter(app => app.status === 'hired').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        icon={Users}
        label="إجمالي الطلبات"
        value={stats.total}
        color="text-blue-600"
      />
      <StatCard
        icon={Clock}
        label="قيد المراجعة"
        value={stats.pending}
        color="text-yellow-600"
      />
      <StatCard
        icon={Calendar}
        label="في مرحلة المقابلة"
        value={stats.interview}
        color="text-purple-600"
      />
      <StatCard
        icon={CheckCircle}
        label="مقبول"
        value={stats.hired}
        color="text-green-600"
      />
      <StatCard
        icon={XCircle}
        label="مرفوض"
        value={stats.rejected}
        color="text-red-600"
      />
    </div>
  );
};