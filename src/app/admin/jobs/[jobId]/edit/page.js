// app/admin/jobs/[jobId]/edit/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight,Loader } from 'lucide-react';

import JobForm from '@/components/jobs/JobForm';
import LoadingSpinner from '@/components/shared/ui/LoadingSpinner';
import ErrorMessage from '@/components/shared/ui/ErrorMessage';
import Button from '@/components/shared/ui/Button';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  
  // ✅ CORRECT: Use params.jobId (not params.id)
  const jobId = params.jobId;
  
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  // Add debug logging
  useEffect(() => {
    console.log('🔍 Edit page mounted');
    console.log('🔍 Full params object:', params);
    console.log('🔍 jobId from params.jobId:', jobId);
    console.log('🔍 Current path:', window.location.pathname);
  }, [params, jobId]);

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log('🔄 Starting to fetch job with ID:', jobId);
        
        if (!jobId) {
          throw new Error('معرف الوظيفة غير متوفر');
        }

        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/jobs/${jobId}`);
        console.log('📨 API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'فشل في تحميل بيانات الوظيفة');
        }
        
        const jobData = await response.json();
        console.log('✅ Job data received:', jobData);
        setJob(jobData);
        
      } catch (error) {
        console.error('❌ Error fetching job:', error);
        setError(error.message);
      } finally {
        console.log('🏁 Fetch completed, setting loading to false');
        setLoading(false);
      }
    };

    // Only fetch if jobId is available
    if (jobId) {
      fetchJob();
    } else {
      console.log('⏳ Waiting for jobId...');
    }
  }, [jobId]);

  const handleSuccess = (updatedJob) => {
    console.log('Job updated successfully:', updatedJob);
  };

  // Show loading if still waiting for jobId or fetching data
  if (!jobId || loading) {
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
{/*            */}
      </div>

      {/* Job Form */}
      {job ? (
        <JobForm 
          initialData={job}
          mode="edit"
          onSuccess={handleSuccess}
        />
      ) : (
        <ErrorMessage message="لم يتم العثور على بيانات الوظيفة" />
      )}
    </div>
  );
}