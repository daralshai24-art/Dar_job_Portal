"use client";
import { useEffect, useState } from "react";
import { Activity, Database, Settings as SettingsIcon, Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function SystemStatusPage() {
    const [diagnostics, setDiagnostics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/system/diagnostics")
            .then(res => res.json())
            .then(data => setDiagnostics(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Checking System Health...</div>;

    const { checks } = diagnostics;

    const StatusCard = ({ title, icon: Icon, status, children }) => (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${status === 'ok' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                {status === 'ok' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
            </div>
            <div className="text-sm text-gray-600 space-y-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">System Diagnostics</h1>
            <p className="text-gray-500 mb-8">Real-time health check of database, models, and configurations.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* SETTINGS CHECK */}
                <StatusCard title="Configuration" icon={SettingsIcon} status={checks.settings.status}>
                    <p>Status: <span className="font-medium">{checks.settings.status.toUpperCase()}</span></p>
                    <p>{checks.settings.details}</p>
                    {checks.settings.status !== 'ok' && (
                        <div className="mt-2 text-red-500 text-xs">
                            Action: Go to Settings &gt; Email and save to fix.
                        </div>
                    )}
                </StatusCard>

                {/* DB INTEGRITY */}
                <StatusCard title="Data Integrity" icon={Database} status={checks.jobs.status}>
                    <div className="flex justify-between">
                        <span>Active Jobs:</span>
                        <span className="font-medium">{checks.jobs.count}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                        <span>Orphan Applications:</span>
                        <span className="font-medium">{checks.jobs.orphanApplications}</span>
                    </div>
                    {checks.jobs.orphanApplications > 0 && (
                        <p className="text-xs text-red-500 mt-2">
                            Found applications linked to deleted jobs.
                        </p>
                    )}
                </StatusCard>

                {/* COMMITTEES */}
                <StatusCard title="Committees System" icon={Activity} status={checks.committees.status}>
                    <div className="flex justify-between">
                        <span>Total Committees:</span>
                        <span className="font-medium">{checks.committees.count}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Active Now:</span>
                        <span className="font-medium">{checks.committees.active}</span>
                    </div>
                </StatusCard>

                {/* USERS */}
                <StatusCard title="User Roles" icon={Users} status={checks.roles.status}>
                    {Object.entries(checks.roles.distribution || {}).map(([role, count]) => (
                        <div key={role} className="flex justify-between border-b border-gray-100 last:border-0 py-1">
                            <span className="capitalize">{role.replace('_', ' ')}:</span>
                            <span className="font-medium bg-gray-100 px-2 rounded-full text-xs flex items-center">{count}</span>
                        </div>
                    ))}
                </StatusCard>

            </div>
        </div>
    );
}
