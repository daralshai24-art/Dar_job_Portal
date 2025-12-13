import HiringRequestList from "@/components/admin/hiring/HiringRequestList";

export const metadata = {
    title: "إدارة طلبات التوظيف | دار الشاي",
    description: "مراجعة واعتماد طلبات التوظيف الداخلية",
};

export default function ManageHiringRequestsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">إدارة طلبات التوظيف</h1>
                <p className="text-muted-foreground mt-2">
                    مراجعة، واعتماد، أو رفض طلبات التوظيف المقدمة من مديري الأقسام.
                </p>
            </div>

            <HiringRequestList />
        </div>
    );
}
