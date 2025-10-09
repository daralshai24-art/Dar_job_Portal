import { connectDB } from "../../../lib/db"; // adjust path to your connectDB file
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      {
        message: "✅ Database connected successfully!",
        database: "jobPortal",
        mongoVersion: "8.0.0",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "❌ Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
