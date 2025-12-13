import HiringRequestForm from "@/components/hiring/HiringRequestForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CreateHiringRequestPage() {
    return (
        <div className="container mx-auto py-10 px-4" dir="rtl">
            <div className="mb-8 text-right">
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة للرئيسية
                </Link>
                <h1 className="text-3xl font-bold tracking-tight mb-2">تقديم طلب احتياج وظيفي</h1>
                <p className="text-muted-foreground">تقديم طلب رسمي لتوظيف موظفين جدد.</p>
            </div>

            <HiringRequestForm />
        </div>
    );
}
