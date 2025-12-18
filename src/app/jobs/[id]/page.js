// app/jobs/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Briefcase, Award, CheckCircle, Users, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

// Components
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import PublicJobHeader from "@/components/public/PublicJobHeader";
import JobContentSection from "@/components/public/JobContentSection";
import JobApplicationForm from "@/components/public/ApplicationForm/JobApplicationForm";
import Breadcrumb from "@/components/shared/Breadcrumb";

// Utils
import { formatArabicDate } from "@/utils/dateFormatter";

// Helper function to get category name
const getCategoryName = (category) => {
  if (!category) return "غير محدد";
  if (typeof category === 'string') return category;
  return category.name || "غير محدد";
};

export default function JobDetailsPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();


  const fetchJob = async () => {
    try {
      setLoading(true);
      const { id } = params;
      const response = await fetch(`/api/jobs/${id}`);

      if (!response.ok) throw new Error("Job not found");

      const jobData = await response.json();
      setJob(jobData);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("الوظيفة غير موجودة أو حدث خطأ في التحميل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [params]);

  if (loading) return <LoadingState />;
  if (!job) return <ErrorState router={router} />;

  // Get category name using helper function
  const categoryName = getCategoryName(job.category);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/" },
            { label: "الوظائف", href: "/jobs" },
            { label: job.title, href: null }
          ]}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <PublicJobHeader job={job} formatDate={formatArabicDate} />

                <div className="p-8">
                  <JobContentSection title="وصف الوظيفة" icon={FileText}>
                    <div
                      className="prose max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </JobContentSection>

                  {job.requirements && (
                    <JobContentSection title="المتطلبات والمؤهلات" icon={Briefcase}>
                      <div
                        className="prose max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: job.requirements }}
                      />
                    </JobContentSection>
                  )}

                  {job.benefits && <JobBenefits benefits={job.benefits} />}
                  <AdditionalInfo job={job} categoryName={categoryName} />
                </div>
              </div>
            </div>

            {/* Application Form */}
            <JobApplicationForm
              job={job}

            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Sub-components
const JobBenefits = ({ benefits }) => (
  <JobContentSection title="المميزات والتقديرات" icon={Award}>
    <div className="grid gap-3">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-center text-gray-700">
          <CheckCircle size={18} className="ml-2 text-green-500 flex-shrink-0" />
          <span>{benefit}</span>
        </div>
      ))}
    </div>
  </JobContentSection>
);

// Updated AdditionalInfo to accept categoryName prop
const AdditionalInfo = ({ job, categoryName }) => (
  <section className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات إضافية</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <InfoItem icon={Users} label="مستوى الخبرة" value={job.experience} />
      <InfoItem icon={Calendar} label="تاريخ النشر" value={formatArabicDate(job.createdAt)} />
      <InfoItem icon={Briefcase} label="نوع الوظيفة" value={job.jobType} />
      {/* Add category info */}
      <InfoItem icon={Users} label="التصنيف" value={categoryName} />
    </div>
  </section>
);

const InfoItem = ({ icon: Icon, label, value }) =>
  value && (
    <div className="flex items-center">
      <Icon size={16} className="ml-2 text-[#B38025]" />
      <div>
        <span className="font-medium text-gray-700">{label}: </span>
        <span className="text-gray-600">{value}</span>
      </div>
    </div>
  );

const LoadingState = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <main className="flex-1 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B38025] mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل تفاصيل الوظيفة...</p>
      </div>
    </main>
    <Footer />
  </div>
);

const ErrorState = ({ router }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <main className="flex-1 flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">الوظيفة غير موجودة</h1>
        <p className="text-gray-600 mb-6">الوظيفة التي تبحث عنها غير متاحة أو تم حذفها</p>
        <button
          onClick={() => router.push("/jobs")}
          className="bg-[#B38025] text-white px-6 py-3 rounded-lg hover:bg-[#D6B666] hover:text-[#1D3D1E] transition-all duration-300 cursor-pointer"
        >
          العودة إلى صفحة الوظائف
        </button>
      </div>
    </main>
    <Footer />
  </div>
);