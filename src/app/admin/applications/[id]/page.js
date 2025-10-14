//src/app/admin/applications/[id]/page.js
"use client";

import { useParams, useRouter } from "next/navigation";

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

// Hooks
import { useApplication } from "@/hooks/useApplication";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
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
    completeInterview
  } = useApplication(params.id);

  if (loading) return <LoadingState />;
  if (!application) return <ErrorState onBack={() => router.push("/admin/applications")} />;

  // Determine if interview is already scheduled
  const isInterviewScheduled = application.interviewDate && application.interviewTime;

  return (
    <div className="p-6 space-y-6">
      <ApplicationHeader
        onBack={() => router.push("/admin/applications")}
        onEdit={handleEditToggle}
        editing={editing}
        onCancel={handleEditToggle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <CandidateInfoCard application={application} />
          <JobInfoCard application={application} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Management */}
          <StatusCard
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onStatusChange={handleStatusChange}
            saving={saving}
          />

          {/* Interview Schedule/Reschedule */}
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

          {/* Notes Section */}
          <NotesSection
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onSave={saveNotes}
            saving={saving}
          />

          {/* Feedback Section */}
          <FeedbackSection
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onSave={saveFeedback}
            saving={saving}
          />

          {/* Scoring Section */}
          <ScoringSection
            application={application}
            formData={formData}
            editing={editing}
            onFormChange={handleFormChange}
            onSave={saveScore}
            saving={saving}
          />

          {/* Timeline Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <ApplicationTimeline timeline={application.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}