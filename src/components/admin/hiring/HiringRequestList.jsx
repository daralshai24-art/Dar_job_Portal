"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReviewModal from "./ReviewModal";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { FilterSelect } from "@/components/ui/FilterSelect";

export default function HiringRequestList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter state (using 'all' for consistent logic with FilterSelect)
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let url = "/api/hiring-requests";
            // Check for 'all' to avoid sending ?status=all if backend expects empty string
            if (statusFilter && statusFilter !== 'all') url += `?status=${statusFilter}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.data) {
                setRequests(data.data);
            } else if (Array.isArray(data)) {
                setRequests(data);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const handleReview = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const onModalClose = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            in_review: "bg-blue-100 text-blue-800"
        };
        const labels = {
            pending: "قيد الانتظار",
            approved: "تمت الموافقة",
            rejected: "مرفوض",
            in_review: "قيد المراجعة"
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
                {labels[status] || status}
            </span>
        );
    };

    const columns = [
        { key: "position", label: "المسمى الوظيفي" },
        { key: "department", label: "القسم" },
        { key: "requester", label: "مقدم الطلب" },
        { key: "date", label: "تاريخ الطلب" },
        { key: "urgency", label: "الأهمية" },
        { key: "status", label: "الحالة" },
        { key: "actions", label: "إجراءات" },
    ];

    // Options for filter
    const statusOptions = [
        { value: "pending", label: "قيد الانتظار" },
        { value: "approved", label: "تمت الموافقة" },
        { value: "rejected", label: "مرفوض" },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">قائمة الطلبات</h2>
                <div className="w-48">
                    <FilterSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={statusOptions}
                        allLabel="جميع الحالات"
                    />
                </div>
            </div>

            <div className="bg-white rounded-md shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">جاري تحميل الطلبات...</div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">لا توجد طلبات توظيف حالياً.</div>
                ) : (
                    <Table columns={columns}>
                        {requests.map((req) => (
                            <TableRow key={req._id}>
                                <TableCell className="font-medium text-right">{req.positionTitle}</TableCell>
                                <TableCell className="text-right">{req.department}</TableCell>
                                <TableCell className="text-right">{req.requestedBy?.name || "غير معروف"}</TableCell>
                                <TableCell className="text-right">{req.createdAt ? format(new Date(req.createdAt), 'PPP', { locale: ar }) : "-"}</TableCell>
                                <TableCell className="text-right">
                                    <span className={req.urgency === 'high' ? 'text-red-600 font-bold' : ''}>
                                        {req.urgency === 'high' ? 'عاجل' : req.urgency === 'low' ? 'منخفض' : 'متوسط'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {getStatusBadge(req.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {req.status === 'pending' && (
                                        <Button size="sm" variant="outline" onClick={() => handleReview(req)}>
                                            مراجعة
                                        </Button>
                                    )}
                                    {req.status !== 'pending' && (
                                        <span className="text-gray-400 text-xs text-center block">
                                            تمت المراجعة
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                )}
            </div>

            <ReviewModal
                request={selectedRequest}
                isOpen={isModalOpen}
                onClose={onModalClose}
                onUpdate={fetchRequests}
            />
        </div>
    );
}
