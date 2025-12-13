
"use client";

import { Badge } from "lucide-react"; // Or custom badge

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800"
};

const priorityColors = {
    urgent: "text-red-600 font-bold",
    high: "text-orange-600",
    medium: "text-blue-600",
    low: "text-gray-500"
};

export default function HiringRequestList({ requests, onApprove, onReject, role }) {
    if (!requests?.length) {
        return (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                لا توجد طلبات توظيف حالياً
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {requests.map((req) => (
                <div key={req._id} className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-1 h-full ${req.status === 'approved' ? 'bg-green-500' : req.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>

                    <div className="flex justify-between items-start mb-3 pl-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{req.positionTitle}</h3>
                            <p className="text-sm text-gray-500">{req.department} • {req.location}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}>
                                {req.status === 'pending' ? 'قيد المراجعة' : req.status === 'approved' ? 'تمت الموافقة' : req.status === 'rejected' ? 'مرفوض' : req.status}
                            </span>
                            <span className={`text-xs flex items-center gap-1 ${priorityColors[req.priority]}`}>
                                {req.priority === 'urgent' && '🔥'} {req.priority}
                            </span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {req.positionDescription}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t mt-2">
                        <div className="text-xs text-gray-400">
                            {req.status === 'approved' && req.reviewedBy ? (
                                <>
                                    تمت المراجعة بواسطة: {req.reviewedBy.name} <br />
                                </>
                            ) : (
                                <>
                                    تاريخ الطلب: {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                                </>
                            )}

                            {/* Review Notes Display */}
                            {req.status !== 'pending' && req.reviewNotes && (
                                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="font-semibold text-gray-900">ملاحظات:</span> {req.reviewNotes}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {/* Actions for HR/Admin Only */}
                            {(role === 'admin' || role === 'hr_manager') && req.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => onReject(req._id)}
                                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded"
                                    >
                                        رفض
                                    </button>
                                    <button
                                        onClick={() => onApprove(req._id)}
                                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded shadow-sm"
                                    >
                                        موافقة ونشر وظيفة
                                    </button>
                                </>
                            )}

                            {req.status === 'approved' && req.jobId && (
                                <a href={`/jobs/${req.jobId?._id || req.jobId}`} className="text-xs text-indigo-600 hover:underline">
                                    عرض الوظيفة المنشورة
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
