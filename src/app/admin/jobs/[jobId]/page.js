// app/admin/jobs/[jobId]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Calendar, MapPin, DollarSign, Users, Briefcase, Award, FileText } from 'lucide-react';

// Shared Components
import LoadingSpinner from '@/components/shared/ui/LoadingSpinner';
import ErrorMessage from '@/components/shared/ui/ErrorMessage';
import Button from '@/components/shared/ui/Button';

// Helper function to get category name
const getCategoryName = (category) => {
  if (!category) return "غير محدد";
  if (typeof category === 'string') return category;
  return category.name || "غير محدد";
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/jobs/${jobId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'فشل في تحميل بيانات الوظيفة');
        }

        const jobData = await response.json();
        setJob(jobData);

      } catch (error) {
        console.error('Error fetching job:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      closed: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.draft;
  };

  const getStatusText = (status) => {
    const texts = {
      draft: "مسودة",
      active: "نشط",
      inactive: "غير نشط",
      closed: "مغلق"
    };
    return texts[status] || texts.draft;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">جاري تحميل بيانات الوظيفة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            خطأ في تحميل البيانات
          </h3>
          <ErrorMessage message={error} className="mb-4" />
          <Button
            onClick={() => router.push('/admin/jobs')}
            variant="secondary"
          >
            العودة للوظائف
          </Button>
        </div>
      </div>
    );
  }

  // Get category name using the helper function
  const categoryName = getCategoryName(job?.category);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => router.push('/admin/jobs')}
          variant="outline"
          className="mb-4"
        >
          <ArrowRight className="ml-1 h-4 w-4" />
          العودة للوظائف
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {job?.title}
            </h1>
            <p className="text-gray-600 mt-2">
              عرض تفاصيل الوظيفة
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job?.status)}`}>
              {getStatusText(job?.status)}
            </span>

            <Button
              onClick={() => router.push(`/admin/jobs/${jobId}/edit`)}
              variant="primary"
            >
              تعديل الوظيفة
            </Button>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="ml-2 h-5 w-5 text-[#B38025]" />
              الوصف الوظيفي
            </h2>
            <div
              className="prose prose-sm md:prose-base max-w-none w-full text-gray-700 leading-relaxed break-words overflow-hidden"
              dangerouslySetInnerHTML={{ __html: job?.description }}
            />
          </div>

          {/* Requirements */}
          {job?.requirements && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="ml-2 h-5 w-5 text-[#B38025]" />
                المتطلبات والمهارات
              </h2>
              <div
                className="prose prose-sm md:prose-base max-w-none w-full text-gray-700 leading-relaxed break-words overflow-hidden"
                dangerouslySetInnerHTML={{ __html: job?.requirements }}
              />
            </div>
          )}
        </div>

        {/* Sidebar - Job Information */}
        <div className="space-y-6">
          {/* Job Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              معلومات الوظيفة
            </h3>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-center text-gray-700">
                <MapPin className="ml-2 h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">الموقع</div>
                  <div className="font-medium">{job?.location}</div>
                </div>
              </div>

              {/* Salary */}
              {job?.salary && (
                <div className="flex items-center text-gray-700">
                  <DollarSign className="ml-2 h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">الراتب</div>
                    <div className="font-medium">{job?.salary}</div>
                  </div>
                </div>
              )}

              {/* Category - FIXED: Use categoryName instead of job.category */}
              {categoryName && categoryName !== "غير محدد" && (
                <div className="flex items-center text-gray-700">
                  <Users className="ml-2 h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">التصنيف</div>
                    <div className="font-medium">{categoryName}</div>
                  </div>
                </div>
              )}

              {/* Job Type */}
              <div className="flex items-center text-gray-700">
                <Briefcase className="ml-2 h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">نوع الوظيفة</div>
                  <div className="font-medium">{job?.jobType}</div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="flex items-center text-gray-700">
                <Award className="ml-2 h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">مستوى الخبرة</div>
                  <div className="font-medium">{job?.experience}</div>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center text-gray-700">
                <Calendar className="ml-2 h-5 w-5 text-gray-600 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">تاريخ النشر</div>
                  <div className="font-medium">{formatDate(job?.createdAt)}</div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center text-gray-700">
                <Calendar className="ml-2 h-5 w-5 text-gray-600 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">آخر تحديث</div>
                  <div className="font-medium">{formatDate(job?.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              الإجراءات
            </h3>

            <div className="space-y-3">
              <Button
                onClick={() => router.push(`/admin/jobs/${jobId}/edit`)}
                variant="primary"
                className="w-full"
              >
                تعديل الوظيفة
              </Button>

              <Button
                onClick={() => router.push(`/admin/jobs/${jobId}/applications`)}
                variant="outline"
                className="w-full"
              >
                عرض الطلبات
              </Button>

              <Button
                onClick={() => router.push('/admin/jobs')}
                variant="outline"
                className="w-full"
              >
                العودة للقائمة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}