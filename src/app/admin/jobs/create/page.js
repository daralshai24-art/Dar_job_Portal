"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/shared/ui/Button';
import JobForm from '@/components/jobs/JobForm';

export default function CreateJobPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          onClick={() => router.push('/admin/jobs')}
          variant="outline"
          className="mb-4"
        >
          <ArrowRight className="ml-1 h-4 w-4" />
          العودة للوظائف
        </Button>
      </div>

      {/* NO onSuccess prop - let hook handle everything */}
      <JobForm mode="create" />
    </div>
  );
}