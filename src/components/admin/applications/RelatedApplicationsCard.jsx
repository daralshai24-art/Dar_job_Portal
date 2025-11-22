// src/components/admin/applications/RelatedApplicationsCard.jsx
"use client";

import { Users, ExternalLink, Calendar, AlertCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRelatedApplications } from "@/hooks/useRelatedApplications";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";
import { formatShortArabicDate, formatRelativeTime } from "@/utils/dateFormatter";

function StatusBadge({ status }) {
  const config =
    APPLICATION_STATUS_CONFIG[status] || APPLICATION_STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">الطلبات ذات الصلة</h3>
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">الطلبات ذات الصلة</h3>
      </div>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Users className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-600">لا توجد طلبات أخرى</p>
        <p className="text-xs text-gray-400 mt-1">
          لا توجد طلبات أخرى مرتبطة بهذا البريد الإلكتروني
        </p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">خطأ في التحميل</h3>
      </div>
      <div className="text-center py-4">
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

function getJobTitle(app) {
  return app.jobTitle || "وظيفة غير محددة";
}

export function RelatedApplicationsCard({ email, currentId }) {
  const { relatedApplications, loading, error, refetch } =
    useRelatedApplications(email, currentId);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!relatedApplications || relatedApplications.length === 0)
    return <EmptyState />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                الطلبات ذات الصلة
              </h3>
              <p className="text-xs text-gray-600">طلبات من نفس البريد الإلكتروني</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-sm">
            {relatedApplications.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {relatedApplications.map((app, index) => {
          const createdAtArabic = formatShortArabicDate(app.createdAt);
          const relativeTimeArabic = formatRelativeTime(app.createdAt);

          return (
            <Link
              key={app._id}
              href={`/admin/applications/${app._id}`}
              className="block group"
            >
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      الطلب #{index + 1}
                    </span>
                    <span className="text-gray-300">•</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>

                {app.name && (
                  <div className="mb-3">
                    <p className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {app.name}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {getJobTitle(app)}
                  </span>
                </div>

                {app.createdAt && (
                  <div className="flex flex-col gap-1 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-gray-500 font-medium">
                        {createdAtArabic}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      {relativeTimeArabic}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          انقر على أي طلب لعرض التفاصيل الكاملة
        </p>
      </div>
    </div>
  );
}
