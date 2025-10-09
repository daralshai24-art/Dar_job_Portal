// app/admin/jobs/create/page.jsx
"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Shared Components
import Button from '@/components/shared/ui/Button';

// Job Form
import JobForm from '@/components/jobs/JobForm';

/**
 * Create Job Page
 */
export default function CreateJobPage() {
  const router = useRouter();

  const handleSuccess = (newJob) => {
    console.log('Job created successfully:', newJob);
    
    // Additional success handling can be added here
  };

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
        
        {/* <h1 className="text-3xl font-bold text-gray-900">
          إنشاء وظيفة جديدة
        </h1>
        <p className="text-gray-600 mt-2">
          املأ البيانات التالية لنشر الوظيفة
        </p> */}
      </div>

      {/* Job Form */}
      <JobForm 
        mode="create"
        onSuccess={handleSuccess}
      />
    </div>
  );
}