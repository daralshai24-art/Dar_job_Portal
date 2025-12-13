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

const DEPARTMENTS = [
    { value: "HR", label: "الموارد البشرية" },
    { value: "IT", label: "تقنية المعلومات" },
    { value: "Finance", label: "المالية" },
    { value: "Operations", label: "العمليات" },
    { value: "Marketing", label: "التسويق" },
    { value: "Sales", label: "المبيعات" },
    { value: "Other", label: "أخرى" }
];

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
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    let rawCategories = [];
                    if (data.success && Array.isArray(data.data)) {
                        rawCategories = data.data;
                    } else if (Array.isArray(data)) {
                        rawCategories = data;
                    }

                    // Map to options
                    setCategoryOptions(rawCategories.map(cat => ({
                        value: cat._id,
                        label: cat.name
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

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
                    <Textarea
                        label="الوصف الوظيفي"
                        placeholder="ادخل الوصف الوظيفي والمسؤوليات..."
                        error={form.formState.errors.positionDescription?.message}
                        rows={5}
                        {...form.register("positionDescription")}
                        className="min-h-[120px]"
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
