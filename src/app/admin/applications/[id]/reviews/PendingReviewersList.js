
import { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Sub-component for listing pending reviewers
function PendingReviewersList({ applicationId }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resendingId, setResendingId] = useState(null);

    const fetchCommittee = async () => {
        try {
            const res = await fetch(`/api/applications/${applicationId}/committee`);

            if (!res.ok) {
                console.warn("Failed to fetch committee:", res.status);
                setMembers([]);
                return;
            }

            const data = await res.json();
            if (data.committee && data.committee.members) {
                setMembers(data.committee.members.filter(m => m.status === 'pending'));
            } else {
                setMembers([]);
            }
        } catch (e) {
            console.error("Error fetching committee:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommittee();
    }, [applicationId]);

    const handleResend = async (member) => {
        if (!member.userId?.email) return;

        setResendingId(member.userId._id);
        try {
            // Pass explicit resend flag to bypass duplicate check
            const response = await fetch(
                `/api/applications/${applicationId}/send-feedback-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        managerEmail: member.userId.email,
                        managerName: member.userId.name,
                        managerRole: member.role,
                        resend: true
                    }),
                }
            );

            if (response.ok) {
                toast.success(`تم إعادة إرسال الطلب إلى ${member.userId.name}`);
            } else {
                const errData = await response.json();
                console.error("Resend error:", errData);
                toast.error(errData.error || "فشل إعادة الإرسال");
            }
        } catch (e) {
            toast.error("خطأ في الاتصال");
        } finally {
            setResendingId(null);
        }
    };

    if (loading) return <div className="p-4 text-center text-sm text-gray-400">جاري تحميل القائمة...</div>;
    if (members.length === 0) return null;

    return (
        <div className="space-y-3">
            {members.map((member, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                            {member.userId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{member.userId?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">
                                {member.role}
                                {member.notifiedAt && (
                                    <span className="block text-[10px] text-gray-400 mt-0.5">
                                        تم الإرسال: {new Date(member.notifiedAt).toLocaleDateString("ar-SA")}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleResend(member)}
                        disabled={resendingId === member.userId?._id}
                        className="text-xs bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                    >
                        {resendingId === member.userId?._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        إعادة إرسال
                    </button>
                </div>
            ))}
        </div>
    );
}

export default PendingReviewersList;
