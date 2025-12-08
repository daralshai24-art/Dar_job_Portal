"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquareText } from "lucide-react";

// Components
import { ApplicationHeader } from "@/components/admin/applications/ApplicationHeader";
import { CandidateInfoCard } from "@/components/admin/applications/CandidateInfoCard";
import { JobInfoCard } from "@/components/admin/applications/JobInfoCard";
import { StatusCard } from "@/components/admin/applications/StatusCard";
import { InterviewScheduleCard } from "@/components/admin/applications/InterviewScheduleCard";
import { NotesSection } from "@/components/admin/applications/NotesSection";
import { FeedbackSection } from "@/components/admin/applications/FeedbackSection";
import { ScoringSection } from "@/components/admin/applications/ScoringSection";
import { ApplicationTimeline } from "@/components/admin/applications/ApplicationTimeline";
import { LoadingState } from "@/components/admin/applications/LoadingState";
import { ErrorState } from "@/components/admin/applications/ErrorState";
import { RelatedApplicationsCard } from "@/components/admin/applications/RelatedApplicationsCard";
import CommitteePanel from "@/components/admin/applications/CommitteePanel";

// Hooks
import { useApplication } from "@/hooks/useApplication";
import { useRelatedApplications } from "@/hooks/useRelatedApplications";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showTimeline, setShowTimeline] = useState(false);

  const {
    application,
    loading,
    editing,
    saving,
    formData,
    handleFormChange,
    handleEditToggle,
    handleStatusChange,
    scheduleInterview,
    rescheduleInterview,
    saveNotes,
    saveFeedback,
    saveScore,
    completeInterview,
    fetchApplication,
  } = useApplication(params.id);

  const { relatedApps, loading: relatedLoading } = useRelatedApplications(
    application?.email,
    application?._id?.toString()
  );

  if (loading) return <LoadingState />;
  if (!application)
    return <ErrorState onBack={() => router.push("/admin/applications")} />;

  const isInterviewScheduled =
    application.interviewDate && application.interviewTime;

  return (
    <div className="p-6 space-y-6">
      <ApplicationHeader
        onBack={() => router.push("/admin/applications")}
        onEdit={handleEditToggle}
        editing={editing}
        onCancel={handleEditToggle}
        showTimeline={showTimeline}
        toggleTimeline={() => setShowTimeline((prev) => !prev)}
      />

      {showTimeline && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border">
          <ApplicationTimeline timeline={application.timeline} />
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <MessageSquareText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">إدارة التقييمات</h3>
            <p className="text-sm text-gray-500">إرسال طلبات التقييم ومراجعة ردود اللجان والمدراء</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/admin/applications/${application._id}/reviews`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          إدارة التقييمات ({application.managerFeedbacks?.length || 0})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <CandidateInfoCard application={application} />
          <JobInfoCard application={application} />

          {application?.email && (
            <RelatedApplicationsCard
              email={application.email}
              currentId={application._id?.toString() || application._id}
            />
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <StatusCard
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onStatusChange={handleStatusChange}
            saving={saving}
          />

          <CommitteePanel
            applicationId={application._id}
            currentStatus={application.committeeStatus || 'none'}
            isAssigned={!!application.applicationCommitteeId}
            committeeName={application.applicationCommitteeId?.committeeId?.name}
            onUpdate={fetchApplication}
          />

          <InterviewScheduleCard
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onSchedule={scheduleInterview}
            onReschedule={rescheduleInterview}
            onComplete={completeInterview}
            saving={saving}
            isScheduled={isInterviewScheduled}
          />
          <NotesSection
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onSave={saveNotes}
            saving={saving}
          />

          <FeedbackSection
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onSave={saveFeedback}
            saving={saving}
          />

          <ScoringSection
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onSave={saveScore}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}
