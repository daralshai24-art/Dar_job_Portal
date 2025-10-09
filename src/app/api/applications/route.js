import { NextResponse } from "next/server";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/db"; 

export async function POST(request) {
  try {
    await connectDB(); 

    const formData = await request.formData();
    
    const applicationData = {
      jobId: formData.get('jobId'),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };

    // Validate required fields
    if (!applicationData.jobId || !applicationData.name || !applicationData.email) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    // Check if job exists and is active
    const job = await Job.findById(applicationData.jobId);
    if (!job) {
      return NextResponse.json(
        { error: "الوظيفة غير موجودة" },
        { status: 404 }
      );
    }

    if (job.status !== "active") {
      return NextResponse.json(
        { error: "الوظيفة غير متاحة للتقديم حالياً" },
        { status: 400 }
      );
    }

    // ✅ CORRECTED DUPLICATE PREVENTION CHECK 
    // Only check for duplicates for the SAME JOB, not all jobs
    const normalizedEmail = applicationData.email.toLowerCase().trim();
    const normalizedPhone = applicationData.phone ? applicationData.phone.replace(/\D/g, '') : '';

    // Build query for duplicate check - ONLY FOR THIS SPECIFIC JOB
    const duplicateQuery = {
      jobId: applicationData.jobId, // This is the key - only check same job
      $or: []
    };

    if (normalizedEmail) {
      duplicateQuery.$or.push({ email: normalizedEmail });
    }
    if (normalizedPhone) {
      duplicateQuery.$or.push({ phone: normalizedPhone });
    }

    // Only check if we have at least one condition
    if (duplicateQuery.$or.length > 0) {
      const existingApplication = await Application.findOne(duplicateQuery);

      if (existingApplication) {
        // Provide specific error message
        let errorMessage = "لقد تقدمت لهذه الوظيفة مسبقاً";
        
        if (existingApplication.email === normalizedEmail) {
          errorMessage = "لقد تقدمت لهذه الوظيفة مسبقاً باستخدام هذا البريد الإلكتروني";
        } else if (existingApplication.phone === normalizedPhone) {
          errorMessage = "لقد تقدمت لهذه الوظيفة مسبقاً باستخدام هذا رقم الهاتف";
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
    }
    // ✅ END CORRECTED DUPLICATE PREVENTION CHECK

    // Handle file upload
    const cvFile = formData.get('cv');
    if (cvFile && cvFile.size > 0) {
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }
      
      const filename = `${Date.now()}-${cvFile.name}`;
      const uploadPath = path.join(uploadsDir, filename);
      
      await writeFile(uploadPath, buffer);
      
      applicationData.cv = {
        filename,
        originalName: cvFile.name,
        path: `/uploads/${filename}`,
        size: cvFile.size
      };
    } else {
      return NextResponse.json(
        { error: "يرجى رفع السيرة الذاتية" },
        { status: 400 }
      );
    }

    // THE APPLICATION CREATION WITH TIMELINE HERE
    const application = await Application.create({
      ...applicationData,
      // Add initial timeline event
      timeline: [{
        action: "created",
        status: "pending", 
        notes: "تم تقديم الطلب بنجاح",
        performedBy: "System",
        date: new Date()
      }]
    });

    // Update job applications count
    await Job.findByIdAndUpdate(applicationData.jobId, {
      $inc: { applicationsCount: 1 },
      lastApplicationDate: new Date()
    });

    // Populate job details for response
    await application.populate('jobId', 'title');

    return NextResponse.json(
      { 
        message: "تم تقديم الطلب بنجاح", 
        application 
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تقديم الطلب: " + error.message },
      { status: 500 }
    );
  }
}
// ... rest of your GET function remains the same

export async function GET(request) {
  try {
    await connectDB(); // ✅ FIXED FUNCTION CALL

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    
    let query = {};
    if (jobId) query.jobId = jobId;
    if (status) query.status = status;
    
    const applications = await Application.find(query)
      .populate('jobId', 'title category location')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الطلبات" },
      { status: 500 }
    );
  }
}