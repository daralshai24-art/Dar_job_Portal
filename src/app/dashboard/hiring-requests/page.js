//src\app\dashboard\hiring-requests\page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Loader2 } from "lucide-react";
import HiringRequestList from "@/components/hiring/HiringRequestList";
import CreateRequestModal from "@/components/hiring/CreateRequestModal";
import { FiltersContainer } from "@/components/shared/FiltersContainer";
import { FilterSelect } from "@/components/common/Select";
import { SearchInput } from "@/components/shared/ui/SearchInput";
import Button from "@/components/shared/ui/Button";

export default function HiringRequestsPage() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchRequests();
    }, [session, filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            let url = "/api/hiring-requests";
            // Support basic filtering query
            if (filter !== "all") url += `?status=${filter}`;

            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) setRequests(data.data || []);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    // Client-side search filtering
    const filteredRequests = requests.filter(r =>
        r.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = async (id) => {
        if (!confirm("هل أنت متأكد من الموافقة؟ سيتم إنشاء وظيفة جديدة تلقائياً.")) return;
        try {
            const res = await fetch(`/api/hiring-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision: "approved" })
            });
            if (res.ok) {
                alert("تمت الموافقة وإنشاء الوظيفة بنجاح");
                fetchRequests();
            } else {
                alert("حدث خطأ");
            }
        } catch (e) {
            alert("حدث خطأ");
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("سبب الرفض:");
        if (!reason) return;

        try {
            const res = await fetch(`/api/hiring-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision: "rejected", notes: reason })
            });
            if (res.ok) {
                fetchRequests();
            }
        } catch (e) {
            alert("حدث خطأ");
        }
    };

    const role = session?.user?.role;
    const canCreate = role === 'department_manager' || role === 'admin';

    const statusOptions = [
        { value: "all", label: "الكل" },
        { value: "pending", label: "قيد المراجعة" },
        { value: "approved", label: "تمت الموافقة" },
        { value: "rejected", label: "مرفوض" }
    ];

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">طلبات التوظيف</h1>
                    <p className="text-gray-500 mt-1">إدارة طلبات التوظيف وعمليات الموافقة</p>
                </div>

                {canCreate && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="ml-2" size={20} /> طلب توظيف جديد
                    </Button>
                )}
            </div>

            <div className="mb-6">
                <FiltersContainer
                    title="تصفية الطلبات"
                    totalCount={requests.length}
                    filteredCount={filteredRequests.length}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SearchInput
                            placeholder="بحث بالمسمى الوظيفي أو القسم..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />

                        <FilterSelect
                            value={filter}
                            onChange={setFilter}
                            options={statusOptions}
                            placeholder="حالة الطلب"
                            isSearchable={false}
                        />
                    </div>
                </FiltersContainer>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
                </div>
            ) : (
                <HiringRequestList
                    requests={filteredRequests}
                    role={role}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}

            <CreateRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRequests}
            />
        </div>
    );
}
