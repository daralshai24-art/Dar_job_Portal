"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Button from "@/components/shared/ui/Button";
import Input from "@/components/shared/ui/Input";
import Textarea from "@/components/shared/ui/Textarea";
import SelectRtl from "@/components/shared/ui/SelectRtl";
import RichTextEditor from "@/components/shared/ui/RichTextEditor";
import { JOB_DEPARTMENTS } from "@/lib/constants";

// Schema
const formSchema = z.object({
    positionTitle: z.string().min(3, "مطلوب (على الأقل 3 أحرف)"),
    positionDescription: z.string().min(20, "الوصف الوظيفي مطلوب (على الأقل 20 حرفًا)"),
    location: z.string().min(2, "الموقع مطلوب"),
    department: z.string().min(1, "القسم مطلوب"),
    category: z.string().min(1, "الفئة مطلوبة"),
    employmentType: z.string().min(1, "مطلوب"),
    experience: z.string().min(1, "مطلوب"),
    justification: z.string().min(20, "يرجى تقديم مبررات مفصلة (على الأقل 20 حرفًا)"),
    urgency: z.string().min(1, "مطلوب"),
    requiredSkills: z.string().optional(),
});

const DEPARTMENTS = JOB_DEPARTMENTS.map(d => ({ value: d, label: d }));

const URGENCY_OPTIONS = [
    { value: "low", label: "منخفض" },
    { value: "medium", label: "متوسط" },
    { value: "high", label: "عالي - عاجل" },
];

const EMPLOYMENT_OPTIONS = [
    { value: "Full-time", label: "دوام كامل" },
    { value: "Part-time", label: "دوام جزئي" },
    { value: "Contract", label: "عقد" },
    { value: "Internship", label: "تدريب" },
];

const EXPERIENCE_OPTIONS = [
    { value: "Entry Level", label: "مبتدئ" },
    { value: "Mid Level", label: "متوسط الخبرة" },
    { value: "Senior Level", label: "خبير" },
    { value: "Executive", label: "تنفيذي" },
];

export default function HiringRequestForm() {
    const router = useRouter();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]); // Restore categoryOptions
    const [loading, setLoading] = useState(false); // Restore loading state

    // Fetch Categories and Templates
    useEffect(() => {
        const loadData = async () => {
            try {
                const [catRes, tempRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/admin/job-templates")
                ]);

                if (catRes.ok) {
                    const data = await catRes.json();
                    const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
                    setCategoryOptions(list.map(c => ({ value: c._id, label: c.name })));
                }

                if (tempRes.ok) {
                    const data = await tempRes.json();
                    setTemplates(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        loadData();
    }, []);

    const handleTemplateChange = (templateId) => {
        setSelectedTemplate(templateId);
        const template = templates.find(t => t._id === templateId);
        if (!template) return;

        // Auto-fill form
        form.setValue("positionTitle", template.title);
        form.setValue("department", template.department);
        form.setValue("category", template.category?._id || template.category); // Handle populated vs id
        form.setValue("employmentType", template.jobType);
        form.setValue("experience", template.experience);

        // Combine Description and Requirements for the robust "Position Description" field if needed
        // Or just map description. Let's append requirements for clarity.
        const combinedDesc = `${template.description}<p><strong>المتطلبات:</strong></p>${template.requirements}`;
        form.setValue("positionDescription", combinedDesc);

        // Skills array to string
        if (template.skills && Array.isArray(template.skills)) {
            form.setValue("requiredSkills", template.skills.join(", "));
        }

        toast.success("تم تعبئة البيانات من النموذج");
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            positionTitle: "",
            positionDescription: "",
            location: "",
            department: "",
            category: "",
            employmentType: "Full-time",
            experience: "Mid Level",
            justification: "",
            urgency: "medium",
            requiredSkills: "",
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            // Parse skills
            const payload = {
                ...values,
                requiredSkills: values.requiredSkills ? values.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean) : [],
            };

            const res = await fetch("/api/hiring-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "فشل تقديم الطلب");

            toast.success("تم تقديم طلب التوظيف بنجاح");
            router.push("/dashboard/hiring-requests");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg text-right" dir="rtl">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">طلب احتياج وظيفي جديد</CardTitle>
                <CardDescription>قم بتقديم طلب لتعيين موظف جديد.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Template Selection */}
                    {templates.length > 0 && (
                        <SelectRtl
                            label="اختيار من نموذج جاهز (اختياري)"
                            placeholder="-- اختر نموذجاً لتعبئة البيانات تلقائياً --"
                            options={templates.map(t => ({ value: t._id, label: t.title }))}
                            value={selectedTemplate}
                            onChange={handleTemplateChange}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Position Title */}
                        <Input
                            label="المسمى الوظيفي"
                            placeholder="مثال: مطور واجهات أمامية"
                            error={form.formState.errors.positionTitle?.message}
                            {...form.register("positionTitle")}
                            className="text-right"
                        />

                        {/* Location */}
                        <Input
                            label="الموقع"
                            placeholder="مثال: الرياض، المقر الرئيسي"
                            error={form.formState.errors.location?.message}
                            {...form.register("location")}
                            className="text-right"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Department */}
                        <Controller
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <SelectRtl
                                    label="القسم"
                                    placeholder="اختر القسم"
                                    options={DEPARTMENTS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.department?.message}
                                />
                            )}
                        />

                        {/* Category */}
                        <Controller
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <SelectRtl
                                    label="فئة الوظيفة"
                                    placeholder="اختر الفئة"
                                    options={categoryOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.category?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Position Description */}
                    {/* Position Description */}
                    <Controller
                        control={form.control}
                        name="positionDescription"
                        render={({ field }) => (
                            <RichTextEditor
                                label="الوصف الوظيفي"
                                placeholder="ادخل الوصف الوظيفي والمسؤوليات..."
                                value={field.value}
                                onChange={field.onChange}
                                error={form.formState.errors.positionDescription?.message}
                                required
                            />
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Urgency */}
                        <Controller
                            control={form.control}
                            name="urgency"
                            render={({ field }) => (
                                <SelectRtl
                                    label="الأهمية"
                                    placeholder="اختر الأهمية"
                                    options={URGENCY_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.urgency?.message}
                                />
                            )}
                        />

                        {/* Employment Type */}
                        <Controller
                            control={form.control}
                            name="employmentType"
                            render={({ field }) => (
                                <SelectRtl
                                    label="نوع التوظيف"
                                    placeholder="اختر النوع"
                                    options={EMPLOYMENT_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.employmentType?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Experience */}
                        <Controller
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <SelectRtl
                                    label="مستوى الخبرة"
                                    placeholder="اختر الخبرة"
                                    options={EXPERIENCE_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.experience?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Justification */}
                    <Textarea
                        label="المبررات وسبب التوظيف"
                        placeholder="اشرح لماذا هذه الوظيفة مطلوبة..."
                        error={form.formState.errors.justification?.message}
                        rows={4}
                        {...form.register("justification")}
                        className="min-h-[100px]"
                    />

                    {/* Skills */}
                    <Input
                        label="المهارات المطلوبة (مفصولة بفواصل)"
                        error={form.formState.errors.requiredSkills?.message}
                        {...form.register("requiredSkills")}
                    />

                    <Button
                        type="submit"
                        className="w-full text-lg"
                        loading={loading}
                        variant="primary"
                    >
                        {loading ? "جاري الإرسال..." : "إرسال طلب التوظيف"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
