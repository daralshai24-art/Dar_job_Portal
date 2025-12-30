import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import "@/models/Category"; // Register Category model
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FileText, Briefcase, Award, CheckCircle, Users, Calendar } from "lucide-react";

// Components
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import PublicJobHeader from "@/components/public/PublicJobHeader";
import JobContentSection from "@/components/public/JobContentSection";
import JobApplicationForm from "@/components/public/ApplicationForm/JobApplicationForm";
import Breadcrumb from "@/components/shared/Breadcrumb";

// Utils
import { formatArabicDate } from "@/utils/dateFormatter";

// Internal Components (rendered here for simplicity in Server Component)
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

const AdditionalInfo = ({ job, categoryName }) => (
  <section className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات إضافية</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <InfoItem icon={Users} label="مستوى الخبرة" value={job.experience} />
      <InfoItem icon={Calendar} label="تاريخ النشر" value={formatArabicDate(job.createdAt)} />
      <InfoItem icon={Briefcase} label="نوع الوظيفة" value={job.jobType} />
      <InfoItem icon={Users} label="التصنيف" value={categoryName} />
    </div>
  </section>
);

// Helper to get raw job data
async function getJob(id) {
  try {
    await connectDB();
    const job = await Job.findById(id).populate('category', 'name _id').lean();
    if (!job) return null;

    // Serialize for client components (ObjectId -> string, Date -> string)
    return JSON.parse(JSON.stringify(job));
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

// 1. Dynamic Metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: "الوظيفة غير موجودة",
    };
  }

  return {
    title: job.title,
    description: `فرصة عمل: ${job.title} في ${job.location || 'دار الشاي العربي'}. قدم الآن!`,
    openGraph: {
      title: job.title,
      description: job.description.substring(0, 150).replace(/<[^>]*>/g, '') + '...',
      type: "article",
    },
  };
}

// 2. Server Component
export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">الوظيفة غير موجودة</h1>
            <p className="text-gray-600 mb-6">الوظيفة التي تبحث عنها غير متاحة أو تم حذفها</p>
            <Link
              href="/jobs"
              className="bg-[#B38025] text-white px-6 py-3 rounded-lg hover:bg-[#D6B666] hover:text-[#1D3D1E] transition-all duration-300 inline-block"
            >
              العودة إلى صفحة الوظائف
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = job.category?.name || (typeof job.category === 'string' ? job.category : "غير محدد");

  // Schema.org JobPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.createdAt,
    "validThrough": job.deadline || undefined, // Add deadline to Job model if it doesn't exist, else omit
    "employmentType": job.jobType === "دوام كامل" ? "FULL_TIME" : "PART_TIME", // Simple mapping
    "hiringOrganization": {
      "@type": "Organization",
      "name": "دار الشاي العربي",
      "sameAs": "https://jobs.daralshai.com", // TODO: Update domain
      "logo": "https://jobs.daralshai.com/images/logo-darelshai.svg"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Riyadh",
        "addressCountry": "SA"
      }
    },
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "SAR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary, // Ensure this is a number or clean string
        "unitText": "MONTH"
      }
    } : undefined
  };

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

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <PublicJobHeader job={job} formatDate={formatArabicDate} />

                <div className="p-4 md:p-8">
                  <JobContentSection title="وصف الوظيفة" icon={FileText}>
                    <div
                      className="prose prose-sm md:prose-base max-w-none w-full text-gray-700 leading-relaxed [&_*]:break-words [&_a]:break-all [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </JobContentSection>

                  {job.requirements && (
                    <JobContentSection title="المتطلبات والمؤهلات" icon={Briefcase}>
                      <div
                        className="prose prose-sm md:prose-base max-w-none w-full text-gray-700 leading-relaxed [&_*]:break-words [&_a]:break-all [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: job.requirements }}
                      />
                    </JobContentSection>
                  )}

                  {job.benefits && job.benefits.length > 0 && <JobBenefits benefits={job.benefits} />}
                  <AdditionalInfo job={job} categoryName={categoryName} />
                </div>
              </div>
            </div>

            {/* Application Form (Interactive Client Component) */}
            <JobApplicationForm job={job} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}