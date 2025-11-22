// src/app/api/applications/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/apiAuth";
import Application from "@/models/Application";
import Timeline from "@/models/Timeline";
import { updateApplicationServer } from "@/services/serverApplicationService";
import "@/models/Category"
import "@/models/Job"
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 }
      );
    }

    // Populate jobId and category
    const application = await Application.findById(id)
      .populate({
        path: "jobId",
        select: "title location category createdAt",
        populate: { path: "category", select: "name" },
      })
      .lean();

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    const timeline = await Timeline.find({ applicationId: id })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const responseApp = { ...application, timeline };
    return NextResponse.json({ application: responseApp, timeline });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات الطلب" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    let currentUser = null;
    try {
      currentUser = await getAuthUser(request);
    } catch (err) {
      console.warn("Auth not available:", err?.message || err);
    }

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { application, timelineEntry } = await updateApplicationServer({
      applicationId: id,
      user: {
        id: currentUser.id || currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
      },
      updateData,
    });

    // Populate jobId and category again for updated app
    const updatedApp = await Application.findById(application._id)
      .populate({
        path: "jobId",
        select: "title location category createdAt",
        populate: { path: "category", select: "name" },
      })
      .lean();

    const timeline = await Timeline.find({ applicationId: id })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const responseApp = { ...updatedApp, timeline };

    return NextResponse.json({
      message: "تم تحديث الطلب بنجاح",
      application: responseApp,
      timelineEntry,
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الطلب" },
      { status: 500 }
    );
  }
}
