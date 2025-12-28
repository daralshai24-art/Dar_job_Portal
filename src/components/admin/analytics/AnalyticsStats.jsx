'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, Eye, Monitor, ArrowUpRight, Trash2 } from 'lucide-react';
import { useConfirmationModal } from '@/components/shared/modals/ConfirmationModalContext';

export default function AnalyticsStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showConfirmation } = useConfirmationModal();

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/analytics/stats');
                const json = await res.json();
                if (json.success) {
                    setStats(json.data);
                }
            } catch (err) {
                console.error('Failed to load stats', err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const handleDeleteLogs = () => {
        showConfirmation({
            title: "حذف السجلات",
            message: "هل أنت متأكد من حذف جميع سجلات الزيارات؟ لا يمكن التراجع عن هذا الإجراء.",
            variant: "danger",
            confirmText: "حذف نهائي",
            onConfirm: async () => {
                try {
                    await fetch('/api/analytics/stats', { method: 'DELETE' });
                    // Refresh stats
                    const res = await fetch('/api/analytics/stats');
                    const json = await res.json();
                    if (json.success) setStats(json.data);
                } catch (err) {
                    console.error("Failed to delete logs", err);
                }
            }
        });
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!stats) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="مجموع الزيارات (الكل)"
                    value={stats.summary.totalVisits}
                    icon={<Eye className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="المستخدمين النشطين (تقريبي)"
                    value={stats.summary.activeUsers}
                    icon={<Users className="w-4 h-4 text-green-500" />}
                    description="آخر 5 دقائق"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Pages Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">أكثر الصفحات زيارة (30 يوم)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4" dir="rtl">
                            {stats.topPages.map((page, i) => (
                                <div key={page.path} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-sm font-medium w-6 text-muted-foreground">#{i + 1}</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{page.title || getPageTitle(page.path)}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]" dir="ltr">{page.path}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{page.views}</span>
                                        <span className="text-xs text-muted-foreground">زيارة</span>
                                    </div>
                                </div>
                            ))}
                            {stats.topPages.length === 0 && <p className="text-sm text-muted-foreground text-right">لا توجد بيانات بعد.</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Device Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">الأجهزة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4" dir="rtl">
                            {stats.deviceStats.map((device) => (
                                <div key={device.device} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm capitalize">{device.device === 'desktop' ? 'كمبيوتر' : device.device === 'mobile' ? 'جوال' : device.device}</span>
                                    </div>
                                    <span className="text-sm font-bold">{device.count}</span>
                                </div>
                            ))}
                            {stats.deviceStats.length === 0 && <p className="text-sm text-muted-foreground">لا توجد بيانات بعد.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Log */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">آخر الزيارات المسجلة</CardTitle>
                    <button
                        onClick={handleDeleteLogs}
                        className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" />
                        حذف السجل
                    </button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto" dir="rtl">
                        <table className="w-full text-sm text-right">
                            <thead className="text-muted-foreground border-b">
                                <tr>
                                    <th className="py-2 px-4">الصفحة</th>
                                    <th className="py-2 px-4">الوقت</th>
                                    <th className="py-2 px-4">الجهاز</th>
                                    <th className="py-2 px-4">المتصفح (User Agent)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentVisits?.map((visit, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4 font-medium" dir="ltr">
                                            <div className="flex flex-col text-right">
                                                <span>{visit.title || getPageTitle(visit.path)}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{visit.path}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground" dir="ltr">
                                            {visit.timestamp ? new Date(visit.timestamp).toLocaleString('en-US', { hour12: true }) : '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${visit.deviceType === 'mobile' ? 'bg-blue-100 text-blue-700' :
                                                visit.deviceType === 'tablet' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {visit.deviceType === 'desktop' ? 'كمبيوتر' : visit.deviceType === 'mobile' ? 'جوال' : visit.deviceType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs text-muted-foreground truncate block max-w-[200px]" title={visit.userAgent} dir="ltr">
                                                {visit.userAgent}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats.recentVisits || stats.recentVisits.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-muted-foreground">لا توجد زيارات مسجلة.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function getPageTitle(path) {
    if (path === '/') return 'الرئيسية';
    if (path === '/login') return 'تسجيل الدخول';
    if (path === '/register') return 'إنشاء حساب';
    if (path === '/jobs') return 'قائمة الوظائف';
    if (path.startsWith('/jobs/')) return 'تفاصيل وظيفة';
    if (path === '/admin') return 'لوحة التحكم';
    if (path === '/admin/users') return 'إدارة المستخدمين';
    if (path === '/admin/jobs') return 'إدارة الوظائف';
    if (path === '/admin/applications') return 'إدارة الطلبات';
    if (path === '/admin/hiring-requests') return 'طلبات التوظيف';
    if (path === '/admin/committees') return 'اللجان';
    if (path === '/admin/settings') return 'الإعدادات';

    // Check for specific patterns
    if (path.includes('/applications/')) return 'تفاصيل طلب';

    return path;
}


function StatsCard({ title, value, icon, description }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}
