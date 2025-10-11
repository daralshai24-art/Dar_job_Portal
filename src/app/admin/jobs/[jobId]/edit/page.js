"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Loader } from 'lucide-react';

// Components
import JobForm from '@/components/jobs/JobForm';
import LoadingSpinner from '@/components/shared/ui/LoadingSpinner';
import ErrorMessage from '@/components/shared/ui/ErrorMessage';
import Button from '@/components/shared/ui/Button';

/**
 * Edit Job Page Component
 * Handles loading, editing, and error states for job editing
 */
export default function EditJobPage() {
  // Hooks
  const params = useParams();
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  // Derived values
  const jobId = params.jobId;

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      // Validation
      if (!jobId) {
        setError('معرف الوظيفة غير متوفر');
        setLoading(false);
        return;
      }

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // Handlers
  const handleBackToJobs = () => {
    router.push('/admin/jobs');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-[#B38025] mx-auto mb-4" />
          <p className="text-gray-600 mt-4">
            {!jobId ? 'جاري تحميل الصفحة...' : 'جاري تحميل بيانات الوظيفة...'}
          </p>
        </div>
      </div>
    );
  }

  // Render error state
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
            onClick={handleBackToJobs}
            variant="secondary"
          >
            العودة للوظائف
          </Button>
        </div>
      </div>
    );
  }

  // Render main content
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <Button
          onClick={handleBackToJobs}
          variant="outline"
          className="mb-4"
        >
          <ArrowRight className="ml-1 h-4 w-4" />
          العودة للوظائف
        </Button>
        
        
      </div>

      {/* Job Form */}
      <div>
        {job ? (
          <JobForm 
            initialData={job}
            mode="edit"
          />
        ) : (
          <div className="p-8 text-center">
            <ErrorMessage message="لم يتم العثور على بيانات الوظيفة" />
            <Button
              onClick={handleBackToJobs}
              variant="secondary"
              className="mt-4"
            >
              العودة للوظائف
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}