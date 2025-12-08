"use client";

import { useState, useEffect } from "react";
import { Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CommitteePanel({ applicationId, currentStatus, isAssigned, committeeName, onUpdate }) {
    // defined once at the top
    const hasCommittee = isAssigned || (currentStatus && currentStatus !== 'none' && (typeof currentStatus === 'object' || currentStatus !== 'pending'));

    const [committeeData, setCommitteeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availableCommittees, setAvailableCommittees] = useState([]);
    const [selectedCommitteeId, setSelectedCommitteeId] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [autoSend, setAutoSend] = useState(true); // Default to true

    useEffect(() => {
        fetchCommitteeStatus();
        fetchCommittees();
    }, [applicationId]);

    const fetchCommitteeStatus = async () => {
        // Future implementation: Fetch specific committee details
    };

    const fetchCommittees = async () => {
        try {
            const res = await fetch("/api/committees");
            const data = await res.json();
            if (res.ok) setAvailableCommittees(data.data || []);
        } catch (error) {
            console.error("Failed to fetch committees", error);
        }
    };

    const assignCommittee = async () => {
        if (!selectedCommitteeId) return;
        setAssigning(true);
        const toastId = toast.loading("جاري تعيين اللجنة...");

        try {
            const res = await fetch(`/api/applications/${applicationId}/committee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    committeeId: selectedCommitteeId,
                    type: "template",
                    autoSend // Pass the state
                })
            });

            if (res.ok) {
                toast.success("تم تعيين اللجنة بنجاح", { id: toastId });
                if (onUpdate) onUpdate();
                else window.location.reload();
            } else {
                const data = await res.json();
                toast.error(data.message || "فشل تعيين اللجنة", { id: toastId });
            }
        } catch (e) {
            toast.error("حدث خطأ غير متوقع", { id: toastId });
        } finally {
            setAssigning(false);
        }
    };

    if (hasCommittee) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-indigo-600" />
                    لجنة التوظيف
                </h3>
                <div className="p-4 bg-indigo-50 text-indigo-800 rounded-lg">
                    <p className="font-semibold mb-1">
                        تم تعيين اللجنة: {committeeName || "لجنة مخصصة"}
                    </p>
                    <p className="text-sm">
                        تم تعيين اللجنة لهذا الطلب.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800">
                <Users className="w-5 h-5 text-indigo-600" />
                لجنة التوظيف
            </h3>

            <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-xl border border-dashed">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium mb-1 text-gray-600">تعيين لجنة (قالب)</label>
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={selectedCommitteeId}
                        onChange={(e) => setSelectedCommitteeId(e.target.value)}
                    >
                        <option value="">اختر قالب...</option>
                        {availableCommittees.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={assignCommittee}
                    disabled={!selectedCommitteeId || assigning}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 w-full md:w-auto"
                >
                    {assigning ? "جاري التعيين..." : "تعيين اللجنة"}
                </button>
            </div>

            <div className="flex items-center gap-2 mt-3 px-1">
                <input
                    type="checkbox"
                    id="autoSend"
                    checked={autoSend}
                    onChange={(e) => setAutoSend(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="autoSend" className="text-sm text-gray-600 cursor-pointer select-none">
                    إرسال إشعارات البريد الإلكتروني للأعضاء تلقائياً عند التعيين
                </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                سيتم إرسال دعوات التقييم للأعضاء تلقائياً عند التعيين.
            </p>
        </div>
    );
}
