"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import JobTemplateForm from "./JobTemplateForm";

const COLUMNS = [
    { key: "title", label: "المسمى الوظيفي" },
    { key: "department", label: "القسم" },
    { key: "category", label: "الفئة" },
    { key: "actions", label: "الإجراءات" }
];

export default function JobTemplates() {
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { showConfirmation } = useConfirmationModal();

    // Form State (just for modal trigger logic)
    const [editingTemplate, setEditingTemplate] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [templRes, catRes] = await Promise.all([
                fetch("/api/admin/job-templates"),
                fetch("/api/categories")
            ]);

            if (templRes.ok) {
                setTemplates(await templRes.json());
            }
            if (catRes.ok) {
                const catData = await catRes.json();
                setCategories(Array.isArray(catData) ? catData : catData.data || []);
            }
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("فشل في تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (template = null) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };



    const getErrorMessage = (errorMsg) => {
        if (!errorMsg) return "حدث خطأ ما";
        if (errorMsg.includes("department") && errorMsg.includes("required")) return "يرجى اختيار القسم (Departments) مطلوب";
        if (errorMsg.includes("category") && errorMsg.includes("required")) return "يرجى اختيار الفئة (Category) مطلوب";
        if (errorMsg.includes("title") && errorMsg.includes("required")) return "المسمى الوظيفي مطلوب";
        if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) return "يوجد نموذج بهذا الاسم مسبقاً";
        return errorMsg;
    };

    const handleFormSubmit = async (formData) => {
        const payload = {
            ...formData,
            skills: typeof formData.skills === 'string'
                ? formData.skills.split(",").map(s => s.trim()).filter(s => s)
                : formData.skills
        };

        try {
            const url = editingTemplate
                ? `/api/admin/job-templates/${editingTemplate._id}`
                : "/api/admin/job-templates";

            const method = editingTemplate ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(editingTemplate ? "تم تحديث النموذج بنجاح" : "تم إنشاء النموذج بنجاح");
                setIsModalOpen(false);
                fetchData();
            } else {
                toast.error(getErrorMessage(data.error));
            }
        } catch (error) {
            toast.error("حدث خطأ في الاتصال");
        }
    };

    const handleDelete = (id) => {
        showConfirmation({
            title: "حذف النموذج",
            message: "هل أنت متأكد من حذف هذا النموذج؟ لا يمكن التراجع عن هذا الإجراء.",
            variant: "danger",
            confirmText: "حذف",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/job-templates/${id}`, { method: "DELETE" });
                    if (res.ok) {
                        toast.success("تم حذف النموذج");
                        setTemplates(templates.filter(t => t._id !== id));
                        return true;
                    } else {
                        toast.error("فشل الحذف");
                        return false;
                    }
                } catch (error) {
                    toast.error("خطأ في الاتصال");
                    return false;
                }
            }
        });
    };

    const filteredTemplates = templates.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">نماذج الوظائف (Job Templates)</h2>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    نموذج جديد
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="بحث في النماذج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                />
            </div>

            {/* List */}
            {loading ? (
                <p className="text-center text-gray-500">جاري التحميل...</p>
            ) : filteredTemplates.length === 0 ? (
                <p className="text-center p-8 text-gray-500 border rounded-lg">لا توجد نماذج مضافة.</p>
            ) : (
                <Table columns={COLUMNS}>
                    {filteredTemplates.map((template) => (
                        <TableRow key={template._id}>
                            <TableCell className="font-medium text-gray-900">{template.title}</TableCell>
                            <TableCell className="text-gray-600">{template.department}</TableCell>
                            <TableCell className="text-gray-600">{template.category?.name || "-"}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(template)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="تعديل"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template._id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        title="حذف"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingTemplate ? "تعديل نموذج" : "إضافة نموذج جديد"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <JobTemplateForm
                            initialData={editingTemplate}
                            categories={categories}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
