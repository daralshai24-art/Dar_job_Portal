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
    const [categories, setCategories] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    // Form State
    const [isFormattedOpen, setIsFormattedOpen] = useState(false); // Controls modal visibility
    const [editingCommittee, setEditingCommittee] = useState(null); // Tracks if we are editing

    const [formData, setFormData] = useState({
        name: "",
        type: "department",
        department: "",
        categories: [] // [UPDATED] Changed from single 'category' to array 'categories'
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const { showConfirmation } = useConfirmationModal();

    useEffect(() => {
        fetchCommittees();
        fetchCategories();
    }, []);

    const fetchCommittees = async () => {
        const res = await fetch("/api/committees");
        const data = await res.json();
        if (res.ok) setCommittees(data.data || []);
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (res.ok) setCategories(data.data || []);
        } catch (e) {
            console.error("Failed to fetch categories", e);
        }
    };

    // Open Modal for Create
    const handleCreateClick = () => {
        setEditingCommittee(null);
        setFormData({ name: "", type: "department", department: "", categories: [] });
        setIsFormattedOpen(true);
    };

    // Open Modal for Edit
    const handleEditClick = (committee) => {
        setEditingCommittee(committee);

        // [UPDATED] Handle both new 'categories' array and legacy 'category' field
        let initialCategories = [];
        if (committee.categories && committee.categories.length > 0) {
            initialCategories = committee.categories.map(c => c._id || c);
        } else if (committee.category) {
            initialCategories = [committee.category._id || committee.category];
        }

        setFormData({
            name: committee.name,
            type: committee.type || "department",
            department: committee.department || "",
            categories: initialCategories
        });
        setIsFormattedOpen(true);
    };

    const handleFormSubmit = async () => {
        if (!formData.name) {
            toast.error("يرجى إدخال اسم اللجنة");
            return;
        }
        if (formData.type === 'department' && !formData.department) {
            toast.error("يرجى اختيار القسم");
            return;
        }
        if (formData.type === 'category' && (!formData.categories || formData.categories.length === 0)) {
            toast.error("يرجى اختيار تصنيف واحد على الأقل");
            return;
        }

        const loadingToast = toast.loading(editingCommittee ? 'جاري التحديث...' : 'جاري الإنشاء...');

        try {
            const payload = {
                name: formData.name,
                type: formData.type,
                department: formData.type === 'department' ? formData.department : undefined,
                categories: formData.type === 'category' ? formData.categories : []
            };

            let res;
            if (editingCommittee) {
                // Update
                res = await fetch(`/api/committees/${editingCommittee._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                res = await fetch("/api/committees", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();

            if (res.ok) {
                toast.success(editingCommittee ? 'تم تحديث اللجنة بنجاح' : 'تم إنشاء اللجنة بنجاح', { id: loadingToast });
                setIsFormattedOpen(false);
                fetchCommittees();
            } else {
                toast.error(data.message || 'حدث خطأ', { id: loadingToast });
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

    const confirmDelete = (id) => {
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

    const departmentOptions = [
        { value: "HR", label: "الموارد البشرية (HR)" },
        { value: "IT", label: "تقنية المعلومات (IT)" },
        { value: "Finance", label: "المالية" },
        { value: "Operations", label: "العمليات" },
        { value: "Marketing", label: "التسويق" },
        { value: "Sales", label: "المبيعات" },
        { value: "Other", label: "أخرى" }
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">إدارة لجان التوظيف</h1>
                <Button onClick={handleCreateClick}>
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

            {/* Create/Edit Form Area */}
            {isFormattedOpen && (
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 animate-in slide-in-from-top-4 fade-in duration-200">
                    <h3 className="font-semibold mb-4 text-lg">
                        {editingCommittee ? `تعديل لجنة: ${editingCommittee.name}` : "إنشاء لجنة جديدة"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم اللجنة</label>
                            <input
                                placeholder="اسم اللجنة (مثلاً: لجنة التوظيف التقني)"
                                className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نوع اللجنة</label>
                            <FilterSelect
                                value={formData.type}
                                onChange={(val) => setFormData({ ...formData, type: val })}
                                options={[
                                    { value: 'department', label: 'حسب القسم' },
                                    { value: 'category', label: 'حسب التصنيف' },
                                    { value: 'general', label: 'عامة' }
                                ]}
                                placeholder="النوع"
                                isSearchable={false}
                            />
                        </div>

                        {formData.type === 'department' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                                <FilterSelect
                                    value={formData.department}
                                    onChange={(val) => setFormData({ ...formData, department: val })}
                                    options={departmentOptions}
                                    placeholder="اختر القسم"
                                    isSearchable={false}
                                />
                            </div>
                        )}

                        {formData.type === 'category' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">التصنيفات الوظيفية</label>
                                <FilterSelect
                                    value={formData.categories}
                                    onChange={(val) => setFormData({ ...formData, categories: val })}
                                    options={categories.map(c => ({ value: c._id, label: c.name }))}
                                    placeholder="اختر التصنيفات (يمكن اختيار أكثر من واحد)"
                                    isSearchable={true}
                                    isMulti={true} // [UPDATED] Enabled Multi-Select
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setIsFormattedOpen(false)} className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                            إلغاء
                        </Button>
                        <Button onClick={handleFormSubmit}>
                            {editingCommittee ? "حفظ التعديلات" : "إنشاء اللجنة"}
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
                                        {committee.type === 'department' && 'لجنة قسم'}
                                        {committee.type === 'category' && 'لجنة تصنيف'}
                                        {committee.type === 'general' && 'لجنة عامة'}
                                        {' '}• {committee.members.length} أعضاء
                                        {committee.department && ` • ${committee.department}`}
                                        {
                                            /* [UPDATED] Display multiple categories */
                                            (committee.categories && committee.categories.length > 0)
                                                ? ` • ${committee.categories.map(c => c.name).join('، ')}`
                                                : (committee.category?.name && ` • ${committee.category.name}`)
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                                    onClick={(e) => { e.stopPropagation(); handleEditClick(committee); }}
                                    title="تعديل اللجنة"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                    onClick={(e) => { e.stopPropagation(); confirmDelete(committee._id); }}
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
                                    onUpdate={fetchCommittees}
                                />
                            </div>
                        )}
                    </div>
                ))}

                {filteredCommittees.length === 0 && !isFormattedOpen && (
                    <div className="text-center py-12 text-gray-500">
                        لا توجد لجان مطابقة للبحث.
                    </div>
                )}
            </div>
        </div>
    );
}
