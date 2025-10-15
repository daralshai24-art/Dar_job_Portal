// components/admin/users/UsersStats.jsx
import { Users, UserCheck, UserX, UserCog } from "lucide-react";

export function UsersStats({ stats }) {
  const cards = [
    {
      title: "إجمالي المستخدمين",
      value: stats.total,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "نشط",
      value: stats.active,
      icon: UserCheck,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "غير نشط",
      value: stats.inactive + stats.suspended,
      icon: UserX,
      color: "red",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "المشرفين",
      value: stats.byRole.super_admin + stats.byRole.admin,
      icon: UserCog,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}