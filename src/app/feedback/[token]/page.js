"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import LoadingScreen from "@/components/feedback/components/LoadingScreen";
import ErrorScreen from "@/components/feedback/components/ErrorScreen";
import SuccessScreen from "@/components/feedback/components/SuccessScreen";
import FeedbackHeader from "@/components/feedback/components/FeedbackHeader";
import FeedbackForm from "@/components/feedback/components/FeedbackForm";

import useFeedbackApi from "@/hooks/useFeedbackApi";

export default function FeedbackPage() {
  const params = useParams();
  const { loading, error, tokenData, success, submitting, formData, setFormData, verifyToken, handleSubmit } =
    useFeedbackApi(params.token);

  // Verify token on mount
  useEffect(() => {
    verifyToken();
  }, [params.token]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (success) return <SuccessScreen />;

  const application = tokenData.application;
  const job = application.jobId;
  const token = tokenData.token;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <FeedbackHeader application={application} job={job} token={token} />
        <form onSubmit={handleSubmit}>
          <FeedbackForm formData={formData} setFormData={setFormData} submitting={submitting} />
        </form>
      </div>
    </div>
  );
}
