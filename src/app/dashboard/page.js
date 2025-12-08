"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchDashboardData();
        }
    }, [session]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/dashboard/stats");
            const data = await res.json();
            if (res.ok) setStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center">تحميل...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                مرحباً، {session?.user?.name} 👋
            </h1>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="الطلبات الجديدة"
                    value={stats?.newApplications || 0}
                    icon={FileText}
                    color="blue"
                />
                <StatCard
                    title="مقابلات قادمة"
                    value={stats?.upcomingInterviews || 0}
                    icon={Users}
                    color="purple"
                />
                <StatCard
                    title="لجان نشطة"
                    value={stats?.activeCommittees || 0}
                    icon={Clock}
                    color="orange"
                />
                <StatCard
                    title="مهام معلقة"
                    value={stats?.pendingTasks || 0}
                    icon={AlertCircle}
                    color="red"
                />
            </div>

            {/* Main Content Area - Role Based */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Applications */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="font-bold text-lg mb-4">آخر النشاطات</h2>
                    {/* Activity List Component Placeholder */}
                    <div className="text-gray-500 text-center py-8">
                        لا توجد نشاطات حديثة
                    </div>
                </div>

                {/* Sidebar / Tasks */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="font-bold text-lg mb-4">المهام العاجلة</h2>
                    {/* Tasks List Placeholder */}
                    <div className="space-y-3">
                        {stats?.tasks?.map((task, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                                <div>
                                    <p className="text-sm font-medium">{task.title}</p>
                                    <p className="text-xs text-gray-500">{task.date}</p>
                                </div>
                            </div>
                        ))}
                        {!stats?.tasks?.length && (
                            <p className="text-sm text-gray-500">لا توجد مهام معلقة</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
        red: "bg-red-50 text-red-600",
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
