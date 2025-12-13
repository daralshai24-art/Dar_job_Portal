"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming it exists or I'll use standard textarea if not
import toast from "react-hot-toast";

export default function ReviewModal({ request, isOpen, onClose, onUpdate }) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState(null); // 'approved' or 'rejected'

    if (!isOpen || !request) return null;

    const handleReview = async (decision) => {
        setLoading(true);
        setAction(decision);
        try {
            const res = await fetch(`/api/hiring-requests/${request._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    decision,
                    notes,
                    createJob: decision === 'approved' // Flag to auto-create job 
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "فشل تحديث الطلب");

            const actionText = decision === 'approved' ? "الموافقة على" : "رفض";
            toast.success(`تم ${actionText} الطلب بنجاح`);
            onUpdate();
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
            setAction(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4 text-right">مراجعة طلب التوظيف</h2>

                <div className="space-y-4 mb-6 text-right">
                    <div className="grid grid-cols-2 gap-2 text-sm" dir="rtl">
                        <div>
                            <span className="font-semibold ml-1">المسمى الوظيفي:</span> {request.positionTitle}
                        </div>
                        <div>
                            <span className="font-semibold ml-1">القسم:</span> {request.department}
                        </div>
                        <div>
                            <span className="font-semibold ml-1">مقدم الطلب:</span> {request.requestedBy?.name}
                        </div>
                        <div>
                            <span className="font-semibold ml-1">الأهمية:</span>
                            {request.urgency === 'high' ? 'عاجل' : request.urgency === 'low' ? 'منخفض' : 'متوسط'}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md text-sm text-right">
                        <p className="font-semibold mb-1">المبررات:</p>
                        <p className="text-gray-700">{request.justification}</p>
                    </div>

                    {request.requiredSkills && request.requiredSkills.length > 0 && (
                        <div className="text-sm text-right">
                            <span className="font-semibold ml-1">المهارات:</span> {request.requiredSkills.join("، ")}
                        </div>
                    )}
                </div>

                <div className="space-y-2 mb-6 text-right">
                    <label className="text-sm font-medium">ملاحظات المراجعة</label>
                    <textarea
                        className="w-full min-h-[80px] p-2 border rounded-md text-sm text-right"
                        placeholder="أضف ملاحظات حول قرارك..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        dir="rtl"
                    />
                </div>

                <div className="flex justify-start gap-3" dir="rtl">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        إلغاء
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleReview("rejected")}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading && action === 'rejected' ? "جاري الرفض..." : "رفض"}
                    </Button>
                    <Button
                        onClick={() => handleReview("approved")}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {loading && action === 'approved' ? "جاري الموافقة..." : "موافقة وإنشاء وظيفة"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
