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
    AlertCircle,
    Plus,
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    مرحباً، {session?.user?.name} 
                </h1>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats?.isManager ? (
                    <>
                        <StatCard
                            title="طلبات قيد المراجعة"
                            value={stats?.myPendingRequests || 0}
                            icon={Clock}
                            color="orange"
                        />
                        <StatCard
                            title="طلبات مقبولة"
                            value={stats?.myApprovedRequests || 0}
                            icon={CheckCircle}
                            color="green"
                        />
                        <StatCard
                            title="طلبات مرفوضة"
                            value={stats?.myRejectedRequests || 0}
                            icon={AlertCircle}
                            color="red"
                        />
                        <StatCard
                            title="إجمالي طلباتي"
                            value={(stats?.myPendingRequests || 0) + (stats?.myApprovedRequests || 0) + (stats?.myRejectedRequests || 0)}
                            icon={FileText}
                            color="blue"
                        />
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>

            {/* Quick Actions */}
            {/* Quick Actions - Operations Center */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-gray-800">العمليات السريعة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Create Request Card */}
                    <Link href="/dashboard/hiring-requests/create" className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all hover:border-green-500 cursor-pointer">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Plus size={24} />
                            </div>
                            <h3 className="font-bold text-lg">طلب احتياج جديد</h3>
                        </div>
                        <p className="text-gray-500 text-sm">قدم طلب لتعيين موظف جديد في قسمك</p>
                    </Link>

                    {/* My Requests Card */}
                    <Link href="/dashboard/hiring-requests" className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all hover:border-blue-500 cursor-pointer">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-bold text-lg">متابعة طلباتي</h3>
                        </div>
                        <p className="text-gray-500 text-sm">تتبع حالة طلبات التوظيف الخاصة بك</p>
                    </Link>

                    {/* Upcoming Interviews Card (Placeholder) */}
                    <div className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all hover:border-purple-500 cursor-pointer opacity-70">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Users size={24} />
                            </div>
                            <h3 className="font-bold text-lg">المقابلات (قريباً)</h3>
                        </div>
                        <p className="text-gray-500 text-sm">جدول المقابلات القادمة للمرشحين</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Role Based */}
            <div className={`grid grid-cols-1 ${stats?.isManager ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
                {/* Recent Activity / Applications */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="font-bold text-lg mb-4">
                        {stats?.isManager ? 'آخر تحديثات طلباتي' : 'آخر النشاطات'}
                    </h2>

                    <div className="space-y-4">
                        {stats?.recentActivity?.map((activity, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${activity.status === 'approved' ? 'bg-green-100 text-green-600' :
                                        activity.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{activity.positionTitle}</h4>
                                        <p className="text-sm text-gray-500">تم التحديث: {new Date(activity.updatedAt).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    activity.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {activity.status === 'approved' ? 'مقبول' :
                                        activity.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                                </span>
                            </div>
                        ))}

                        {!stats?.recentActivity?.length && (
                            <div className="text-gray-500 text-center py-8">
                                لا توجد نشاطات حديثة
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Tasks - Hide for Manager for now to keep it clean */}
                {!stats?.isManager && (
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
                )}
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
