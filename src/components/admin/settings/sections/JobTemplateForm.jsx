"use client";

import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { JOB_DEPARTMENTS, JOB_TYPES, JOB_LEVELS } from "@/lib/constants";
import SelectRtl from "@/components/shared/ui/SelectRtl";

export default function JobTemplateForm({ initialData, categories, onSubmit, onCancel }) {
    const defaultData = {
        title: "",
        department: JOB_DEPARTMENTS[0],
        category: "",
        jobType: JOB_TYPES[0],
        experience: JOB_LEVELS[0],
        description: "",
        requirements: "",
        skills: ""
    };

    const [formData, setFormData] = useState(defaultData);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                department: initialData.department || JOB_DEPARTMENTS[0],
                category: initialData.category?._id || initialData.category || "",
                jobType: initialData.jobType || JOB_TYPES[0],
                experience: initialData.experience || JOB_LEVELS[0],
                description: initialData.description || "",
                requirements: initialData.requirements || "",
                skills: initialData.skills ? (Array.isArray(initialData.skills) ? initialData.skills.join(", ") : initialData.skills) : ""
            });
        } else {
            // Reset to defaults if no initialData (e.g. switching from edit to create)
            // But we should be careful if we want to preserve category selection preference etc.
            // For now, simple reset is fine.
            setFormData(prev => ({
                ...defaultData,
                // Try to keep a valid category if available
                category: categories.length > 0 ? categories[0]._id : ""
            }));
        }
    }, [initialData, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label>
                    <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
                    />
                </div>
                <div>
                    <SelectRtl
                        label="القسم"
                        placeholder="اختر القسم"
                        options={JOB_DEPARTMENTS.map(d => ({ value: d, label: d }))}
                        value={formData.department}
                        onChange={val => setFormData({ ...formData, department: val })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <SelectRtl
                        label="الفئة (Category)"
                        required
                        options={categories.map(c => ({ value: c._id, label: c.name }))}
                        value={formData.category}
                        onChange={val => setFormData({ ...formData, category: val })}
                    />
                </div>
                <div>
                    <SelectRtl
                        label="نوع الوظيفة"
                        options={JOB_TYPES.map(t => ({ value: t, label: t }))}
                        value={formData.jobType}
                        onChange={val => setFormData({ ...formData, jobType: val })}
                    />
                </div>
            </div>

            <div>
                <SelectRtl
                    label="المستوى"
                    options={JOB_LEVELS.map(l => ({ value: l, label: l }))}
                    value={formData.experience}
                    onChange={val => setFormData({ ...formData, experience: val })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف الوظيفي (Description)</label>
                <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="أدخل الوصف الوظيفي الكامل..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المتطلبات (Requirements)</label>
                <textarea
                    required
                    rows={4}
                    value={formData.requirements}
                    onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="أدخل قائمة المتطلبات..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المهارات (Skills) - افصل بينها بفاصلة</label>
                <input
                    type="text"
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="React, Node.js, Excel..."
                />
            </div>

            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                    إلغاء
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    حفظ
                </button>
            </div>
        </form>
    );
}
