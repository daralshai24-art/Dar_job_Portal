"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Edit, Trash, ChevronDown, ChevronUp } from "lucide-react";
import CommitteeBuilder from "@/components/admin/CommitteeBuilder";
import { FiltersContainer } from "@/components/shared/FiltersContainer";
import { FilterSelect } from "@/components/common/Select";
import { SearchInput } from "@/components/shared/ui/SearchInput";
import Button from "@/components/shared/ui/Button";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";
import toast from "react-hot-toast";

export default function CommitteesPage() {
    const [committees, setCommittees] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newCommitteeName, setNewCommitteeName] = useState("");
    const [newCommitteeType, setNewCommitteeType] = useState("department");

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const { showConfirmation } = useConfirmationModal();

    useEffect(() => {
        fetchCommittees();
    }, []);

    const fetchCommittees = async () => {
        const res = await fetch("/api/committees");
        const data = await res.json();
        if (res.ok) setCommittees(data.data || []);
    };

    const createCommittee = async () => {
        if (!newCommitteeName) return;

        const loadingToast = toast.loading('جاري إنشاء اللجنة...');

        try {
            const res = await fetch("/api/committees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCommitteeName, type: newCommitteeType })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('تم إنشاء اللجنة بنجاح', { id: loadingToast });
                setNewCommitteeName("");
                setIsCreating(false);
                fetchCommittees();
            } else {
                toast.error(data.message || 'خطأ في إنشاء اللجنة', { id: loadingToast });
            }
        } catch (e) {
            toast.error('حدث خطأ غير متوقع', { id: loadingToast });
        }
    };

    const deleteCommittee = async (id) => {
        const loadingToast = toast.loading('جاري الحذف...');
        try {
            const res = await fetch(`/api/committees/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success('تم حذف اللجنة بنجاح', { id: loadingToast });
                fetchCommittees();
            } else {
                toast.error('فشل حذف اللجنة', { id: loadingToast });
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء الحذف', { id: loadingToast });
        }
    };

    const handleDeleteClick = (id) => {
        showConfirmation({
            title: "حذف اللجنة",
            message: "هل أنت متأكد من حذف هذه اللجنة؟ لا يمكن التراجع عن هذا الإجراء.",
            confirmText: "حذف",
            cancelText: "إلغاء",
            variant: "danger",
            onConfirm: async () => {
                await deleteCommittee(id);
            }
        });
    };

    const filteredCommittees = committees.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || c.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const typeOptions = [
        { value: 'all', label: 'الكل' },
        { value: 'department', label: 'حسب القسم' },
        { value: 'category', label: 'حسب التصنيف' },
        { value: 'general', label: 'عامة' }
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">إدارة لجان التوظيف</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    <Plus className="ml-2" size={20} />
                    لجنة جديدة
                </Button>
            </div>

            <FiltersContainer
                title="تصفية اللجان"
                totalCount={committees.length}
                filteredCount={filteredCommittees.length}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchInput
                        placeholder="بحث باسم اللجنة..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                    <FilterSelect
                        value={typeFilter}
                        onChange={setTypeFilter}
                        options={typeOptions}
                        placeholder="نوع اللجنة"
                    />
                </div>
            </FiltersContainer>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 animate-in slide-in-from-top-4 fade-in duration-200">
                    <h3 className="font-semibold mb-3">إنشاء لجنة جديدة</h3>
                    <div className="flex gap-4">
                        <input
                            placeholder="اسم اللجنة (مثلاً: لجنة التوظيف التقني)"
                            className="flex-1 border p-2 rounded-lg"
                            value={newCommitteeName}
                            onChange={(e) => setNewCommitteeName(e.target.value)}
                        />
                        <div className="w-48">
                            <FilterSelect
                                value={newCommitteeType}
                                onChange={setNewCommitteeType}
                                options={typeOptions.filter(o => o.value !== 'all')}
                                placeholder="النوع"
                                isSearchable={false}
                            />
                        </div>
                        <Button onClick={createCommittee}>
                            حفظ
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {filteredCommittees.map(committee => (
                    <div key={committee._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div
                            className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => setExpandedId(expandedId === committee._id ? null : committee._id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{committee.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {committee.type} • {committee.members.length} أعضاء
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(committee._id); }}
                                    title="حذف اللجنة"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                                {expandedId === committee._id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {expandedId === committee._id && (
                            <div className="border-t bg-gray-50/50 p-6">
                                <h4 className="font-semibold mb-4 text-gray-700">أعضاء اللجنة</h4>
                                <CommitteeBuilder
                                    committeeId={committee._id}
                                    initialMembers={committee.members}
                                    onUpdate={fetchCommittees} // Refresh parent list counts
                                />
                            </div>
                        )}
                    </div>
                ))}

                {filteredCommittees.length === 0 && !isCreating && (
                    <div className="text-center py-12 text-gray-500">
                        لا توجد لجان مطابقة للبحث.
                    </div>
                )}
            </div>
        </div>
    );
}
