import { updateApplication } from "@/services/applicationService";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  await connectDB();
  const body = await req.json();
  
  const { applicationId, updateData } = body;
  const userId = req.headers.get("x-user-id"); // from auth session

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await updateApplication(applicationId, userId, updateData);
  return NextResponse.json(result);
}
