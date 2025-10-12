// app/api/test/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    return NextResponse.json(
      { message: "✅ API is working!", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Test error: " + error.message },
      { status: 500 }
    );
  }
}