//src/app/api/applications/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/apiAuth";
import Application from "@/models/Application";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const application = await Application.findById(id)
      .populate({
        path: 'jobId',
        select: 'title location category',
        populate: {
          path: 'category',
          select: 'name'
        }
      });

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    // Extract category name from the populated category object
    const categoryName = application.jobId?.category?.name;

    // Return the application with categoryName included
    const responseData = {
      ...application.toObject(),
      categoryName: categoryName || "غير محدد"
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات الطلب" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    console.log("🔍 [DEBUG] PUT Request received for application ID:", id);
    
    await connectDB();
    const updateData = await request.json();
    
    console.log("🔍 [DEBUG] Received update data:", JSON.stringify(updateData, null, 2));

    // Validate application ID
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ error: "طلب التوظيف غير موجود" }, { status: 404 });
    }

    console.log("🔍 [DEBUG] Current application status:", application.status);
    console.log("🔍 [DEBUG] Current interview details:", {
      interviewDate: application.interviewDate,
      interviewTime: application.interviewTime,
      interviewType: application.interviewType,
      interviewLocation: application.interviewLocation
    });

    // Safe user retrieval - THIS IS THE REAL USER
    let performedBy = "System";
    let currentUser = null;
    
    try {
      currentUser = await getAuthUser(request);
      console.log("🔍 [DEBUG] Authenticated user:", currentUser);
      
      if (currentUser?.name) {
        performedBy = currentUser.name;
      } else if (currentUser?.email) {
        performedBy = currentUser.email;
      }
      console.log("✅ [DEBUG] Will use performedBy:", performedBy);
    } catch (authError) {
      console.warn("⚠️ [DEBUG] Auth not available:", authError.message);
    }

    // CRITICAL: Remove timeline from updateData to prevent frontend manipulation
    const { timeline, action, notes, ...safeUpdateData } = updateData;
    
    if (timeline) {
      console.log("🚫 [DEBUG] Blocked frontend from sending timeline data");
    }

    console.log("🔍 [DEBUG] Safe update data (without timeline):", safeUpdateData);

    // IMPROVED: Detect what actually changed
    const detectChanges = () => {
      const changes = [];
      
      // Check interview date changes
      if (safeUpdateData.interviewDate) {
        const currentDate = application.interviewDate ? new Date(application.interviewDate).toISOString().split('T')[0] : null;
        const newDate = safeUpdateData.interviewDate ? new Date(safeUpdateData.interviewDate).toISOString().split('T')[0] : null;
        
        if (currentDate !== newDate) {
          changes.push({
            field: 'interviewDate',
            from: application.interviewDate,
            to: safeUpdateData.interviewDate,
            label: 'تاريخ المقابلة'
          });
        }
      }

      // Check interview time changes
      if (safeUpdateData.interviewTime && safeUpdateData.interviewTime !== application.interviewTime) {
        changes.push({
          field: 'interviewTime', 
          from: application.interviewTime,
          to: safeUpdateData.interviewTime,
          label: 'وقت المقابلة'
        });
      }

      // Check interview type changes
      if (safeUpdateData.interviewType && safeUpdateData.interviewType !== application.interviewType) {
        changes.push({
          field: 'interviewType',
          from: application.interviewType,
          to: safeUpdateData.interviewType,
          label: 'نوع المقابلة'
        });
      }

      // Check interview location changes
      if (safeUpdateData.interviewLocation && safeUpdateData.interviewLocation !== application.interviewLocation) {
        changes.push({
          field: 'interviewLocation',
          from: application.interviewLocation,
          to: safeUpdateData.interviewLocation,
          label: 'مكان المقابلة'
        });
      }

      return changes;
    };

    const changes = detectChanges();
    console.log("🔍 [DEBUG] Detected changes:", changes);

    // IMPROVED: Determine action based on actual changes
    const determineAction = () => {
      // If there are interview-related changes and interview already exists, it's a reschedule
      if (changes.length > 0 && application.interviewDate) {
        return 'interview_rescheduled';
      }
      
      // If setting interview for the first time
      if (safeUpdateData.interviewDate && !application.interviewDate) {
        return 'interview_scheduled';
      }
      
      // Status-based actions
      if (safeUpdateData.status === 'rejected') return 'rejected';
      if (safeUpdateData.status === 'hired') return 'hired';
      if (safeUpdateData.status === 'interview_completed') return 'interview_completed';
      
      return 'updated';
    };

    const determinedAction = determineAction();
    console.log("✅ [DEBUG] Determined action:", determinedAction);

    // IMPROVED: Create meaningful notes based on changes
    const createTimelineNotes = () => {
      if (updateData.notes) return updateData.notes;
      
      if (determinedAction === 'interview_rescheduled' && changes.length > 0) {
        const changeDescriptions = changes.map(change => {
          if (change.field === 'interviewDate') {
            const fromDate = change.from ? new Date(change.from).toLocaleDateString('ar-SA') : 'غير محدد';
            const toDate = change.to ? new Date(change.to).toLocaleDateString('ar-SA') : 'غير محدد';
            return `تاريخ المقابلة من ${fromDate} إلى ${toDate}`;
          }
          if (change.field === 'interviewTime') {
            return `وقت المقابلة من ${change.from} إلى ${change.to}`;
          }
          if (change.field === 'interviewType') {
            const typeMap = {
              'in_person': 'شخصية',
              'video': 'فيديو', 
              'phone': 'هاتفية'
            };
            return `نوع المقابلة من ${typeMap[change.from] || change.from} إلى ${typeMap[change.to] || change.to}`;
          }
          if (change.field === 'interviewLocation') {
            return `مكان المقابلة من ${change.from} إلى ${change.to}`;
          }
          return `${change.label} من ${change.from} إلى ${change.to}`;
        });
        
        return `تم تحديث تفاصيل المقابلة: ${changeDescriptions.join('، ')}`;
      }
      
      if (determinedAction === 'interview_scheduled') {
        const date = safeUpdateData.interviewDate ? new Date(safeUpdateData.interviewDate).toLocaleDateString('ar-SA') : 'غير محدد';
        const time = safeUpdateData.interviewTime || 'غير محدد';
        const location = safeUpdateData.interviewLocation || 'غير محدد';
        const type = safeUpdateData.interviewType === 'in_person' ? 'شخصية' : 
                    safeUpdateData.interviewType === 'video' ? 'فيديو' : 'هاتفية';
        
        return `تم جدولة مقابلة ${type} في ${date} الساعة ${time} - ${location}`;
      }
      
      return safeUpdateData.interviewNotes || safeUpdateData.finalFeedback || safeUpdateData.rejectionReason || '';
    };

    const timelineNotes = createTimelineNotes();
    console.log("✅ [DEBUG] Timeline notes:", timelineNotes);

    // ALWAYS create timeline event when there are changes or meaningful action
    if (changes.length > 0 || determinedAction !== 'updated') {
      const timelineEvent = {
        action: determinedAction,
        status: safeUpdateData.status || application.status,
        notes: timelineNotes,
        performedBy: performedBy, // REAL USER, not hardcoded "HR"
        date: new Date(),
      };

      // Add changes details for rescheduling
      if (changes.length > 0) {
        timelineEvent.changes = changes;
      }

      console.log("✅ [DEBUG] Creating timeline event with REAL user:", timelineEvent);
      application.timeline.push(timelineEvent);
    } else {
      console.log("🔍 [DEBUG] No meaningful changes detected, skipping timeline event");
    }

    // Update application with safe data (no timeline, action, notes)
    Object.keys(safeUpdateData).forEach(key => {
      if (key !== 'timeline' && key !== 'action' && key !== 'notes') {
        application[key] = safeUpdateData[key];
      }
    });

    console.log("🔍 [DEBUG] Saving application...");
    await application.save();
    
    await application.populate([
      { 
        path: "jobId", 
        select: "title location category department" 
      }
    ]);

    console.log("✅ [DEBUG] Final timeline length:", application.timeline.length);
    const lastEvent = application.timeline[application.timeline.length - 1];
    console.log("✅ [DEBUG] Last timeline event:", lastEvent ? {
      action: lastEvent.action,
      performedBy: lastEvent.performedBy,
      notes: lastEvent.notes
    } : 'No new event');

    return NextResponse.json({ 
      message: "تم تحديث الطلب بنجاح", 
      application: {
        id: application._id,
        status: application.status,
        interviewDate: application.interviewDate,
        interviewTime: application.interviewTime,
        timelineLength: application.timeline.length,
        lastTimelineEvent: application.timeline[application.timeline.length - 1]
      },
      changesDetected: changes.length > 0,
      timelineAdded: changes.length > 0 || determinedAction !== 'updated'
    });

  } catch (error) {
    console.error("❌ [DEBUG] Application update error:", error);
    return NextResponse.json({ error: "حدث خطأ في تحديث الطلب" }, { status: 500 });
  }
}