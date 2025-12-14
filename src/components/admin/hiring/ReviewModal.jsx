"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming it exists or I'll use standard textarea if not
import toast from "react-hot-toast";

export default function ReviewModal({ request, isOpen, onClose, onUpdate }) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState(null); // 'approved' or 'rejected'

    // Edit Mode State
    const [editMode, setEditMode] = useState(false);
    const [jobData, setJobData] = useState({});

    if (!isOpen || !request) return null;

    const startApproval = () => {
        setEditMode(true);
        setJobData({
            title: request.positionTitle,
            description: request.justification, // Default description from justification
            requirements: request.requiredSkills?.join('\n') || "",
            location: "Riyadh", // Default or fetch from request
            // Add other fields as needed
        });
    };

    const handleReview = async (decision) => {
        setLoading(true);
        setAction(decision);
        try {
            const payload = {
                decision,
                notes,
            };

            if (decision === 'approved') {
                payload.jobDetails = {
                    ...jobData,
                    createJob: true
                };
            }

            const res = await fetch(`/api/hiring-requests/${request._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "فشل تحديث الطلب");

            const actionText = decision === 'approved' ? "الموافقة على" : "رفض";
            toast.success(`تم ${actionText} الطلب بنجاح وإنشاء الوظيفة`);
            onUpdate();
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
            setAction(null);
            setEditMode(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 relative animate-in fade-in zoom-in-95 duration-200 my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4 text-right">
                    {editMode ? "مراجعة تفاصيل الوظيفة قبل النشر" : "مراجعة طلب التوظيف"}
                </h2>

                {!editMode ? (
                    // Read-only View
                    <>
                        <div className="space-y-4 mb-6 text-right">
                            <div className="grid grid-cols-2 gap-2 text-sm" dir="rtl">
                                <div><span className="font-semibold ml-1">المسمى الوظيفي:</span> {request.positionTitle}</div>
                                <div><span className="font-semibold ml-1">القسم:</span> {request.department}</div>
                                <div><span className="font-semibold ml-1">مقدم الطلب:</span> {request.requestedBy?.name}</div>
                                <div>
                                    <span className="font-semibold ml-1">الأهمية:</span>
                                    {request.urgency === 'high' ? 'عاجل' : request.urgency === 'low' ? 'منخفض' : 'متوسط'}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md text-sm text-right">
                                <p className="font-semibold mb-1">المبررات:</p>
                                <p className="text-gray-700">{request.justification}</p>
                            </div>
                            {request.requiredSkills?.length > 0 && (
                                <div className="text-sm text-right">
                                    <span className="font-semibold ml-1">المهارات:</span> {request.requiredSkills.join("، ")}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 mb-6 text-right">
                            <label className="text-sm font-medium">ملاحظات المراجعة</label>
                            <Textarea
                                className="w-full min-h-[80px] text-right"
                                placeholder="أضف ملاحظات حول قرارك..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                dir="rtl"
                            />
                        </div>

                        <div className="flex justify-start gap-3" dir="rtl">
                            <Button variant="outline" onClick={onClose} disabled={loading}>إلغاء</Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleReview("rejected")}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {loading && action === 'rejected' ? "جاري الرفض..." : "رفض الطلب"}
                            </Button>
                            <Button
                                onClick={startApproval}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                متابعة للموافقة
                            </Button>
                        </div>
                    </>
                ) : (
                    // Edit Form View
                    <div className="space-y-4 text-right" dir="rtl">
                        <div>
                            <label className="block text-sm font-medium mb-1">عنوان الوظيفة</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={jobData.title}
                                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف الوظيفي</label>
                            <Textarea
                                className="w-full min-h-[100px]"
                                value={jobData.description}
                                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">المتطلبات (المهارات)</label>
                            <Textarea
                                className="w-full min-h-[80px]"
                                value={jobData.requirements}
                                onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
                                placeholder="اكتب كل متطلب في سطر جديد"
                            />
                        </div>

                        <div className="flex justify-start gap-3 mt-6">
                            <Button variant="outline" onClick={() => setEditMode(false)} disabled={loading}>رجوع</Button>
                            <Button
                                onClick={() => handleReview("approved")}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {loading ? "جاري الإنشاء..." : "تأكيد وإنشاء مسودة وظيفية"}
                            </Button>
                        </div>
                    </div>
                )}
                </div>
        </div>
    );
}
