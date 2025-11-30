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

      {/* CV Download */}
      {application.cv && (
        <div className="mt-4">
          <a
            href={`/api/cv/${application._id}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FileText className="w-5 h-5" />
            تحميل السيرة الذاتية
          </a>
        </div>
      )}
    </div>
  );
}
