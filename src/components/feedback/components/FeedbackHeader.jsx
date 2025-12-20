"use client";

import { Clock, FileText } from "lucide-react";

export default function FeedbackHeader({ application, job, token }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تقييم المرشح
          </h1>
          <p className="text-gray-600">
            مرحباً <span className="font-semibold">{token.managerName}</span>
          </p>
        </div>

        {/* Expiry */}
        <div className="text-right">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm">
            <Clock className="w-4 h-4" />
            <span>
              ينتهي في{" "}
              {Math.ceil(
                (new Date(token.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
              )}{" "}
              أيام
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-500 mb-2">
            معلومات المرشح
          </h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">
            {application.name}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            {application.email}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            {application.phone}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            {application.city}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            {application.nationality || "غير محدد"}
          </p>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-500 mb-2">
            معلومات الوظيفة
          </h3>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">
            {job.title}
          </p>
          <p className="text-sm sm:text-base text-gray-600">{job.location}</p>
          <p className="text-sm sm:text-base text-gray-600">
            {job.category?.name || "غير محدد"}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {/* CV Download */}
        {application.cv?.path && (
          <a
            href={application.cv.path}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-blue-100"
          >
            <FileText className="w-5 h-5" />
            تحميل السيرة الذاتية
          </a>
        )}

        {/* Experience Download */}
        {application.experience?.path && (
          <a
            href={application.experience.path}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium bg-purple-50 px-4 py-2 rounded-lg transition-colors border border-purple-100"
          >
            <FileText className="w-5 h-5" />
            تحميل ملف الخبرات
          </a>
        )}
      </div>
    </div>
  );
}
