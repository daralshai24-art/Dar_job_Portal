"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/ui/Modal";
import { Loader2 } from "lucide-react";
import { FilterSelect } from "@/components/common/Select";

export default function CreateRequestModal({ isOpen, onClose, onSuccess }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        positionTitle: "",
        positionDescription: "",
        department: "",
        employmentType: "Full-time",
        experience: "Mid Level",
        category: "",
        location: "Riyadh",
        requiredSkills: "",
        budget: "",
        reasonForHire: "replacement",
        priority: "medium"
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/hiring-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    requiredSkills: formData.requiredSkills.split(',').map(s => s.trim())
                })
            });

            if (!res.ok) throw new Error("Failed to create");

            onSuccess();
            onClose();
        } catch (error) {
            alert("Error submitting request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="طلب توظيف جديد"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">المسمى الوظيفي</label>
                        <input required className="w-full border rounded p-2" value={formData.positionTitle} onChange={e => setFormData({ ...formData, positionTitle: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">القسم</label>
                        <input required className="w-full border rounded p-2" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">الوصف الوظيفي</label>
                    <textarea required className="w-full border rounded p-2 h-24" value={formData.positionDescription} onChange={e => setFormData({ ...formData, positionDescription: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">نوع التوظيف</label>
                        <select className="w-full border rounded p-2" value={formData.employmentType} onChange={e => setFormData({ ...formData, employmentType: e.target.value })}>
                            <option value="Full-time">دوام كامل</option>
                            <option value="Part-time">دوام جزئي</option>
                            <option value="Contract">عقد</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">الخبرة المطلوبة</label>
                        <select className="w-full border rounded p-2" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}>
                            <option value="Entry Level">مبتدأ</option>
                            <option value="Mid Level">متوسط</option>
                            <option value="Senior Level">خبير</option>
                            <option value="Executive">مدير تنفيذي</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">التصنيف (Category)</label>
                        <select required className="w-full border rounded p-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="">اختر التصنيف...</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">الموقع</label>
                        <input className="w-full border rounded p-2" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">المهارات المطلوبة (مفصولة بفاصلة)</label>
                    <input placeholder="React, Node.js, Communication..." className="w-full border rounded p-2" value={formData.requiredSkills} onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">الميزانية المتوقعة</label>
                        <input type="number" className="w-full border rounded p-2" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">سبب التوظيف</label>
                        <select className="w-full border rounded p-2" value={formData.reasonForHire} onChange={e => setFormData({ ...formData, reasonForHire: e.target.value })}>
                            <option value="new_role">دور جديد</option>
                            <option value="replacement">بديل لموظف</option>
                            <option value="expansion">توسع في القسم</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">الأولوية</label>
                        <select className="w-full border rounded p-2" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                            <option value="low">منخفضة</option>
                            <option value="medium">متوسطة</option>
                            <option value="high">عالية</option>
                            <option value="urgent">عاجلة</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        إرسال الطلب
                    </button>
                </div>
            </form>
        </Modal>
    );
}
