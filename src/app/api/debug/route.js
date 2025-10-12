// app/api/debug/route.js
import { NextResponse } from "next/server";

export async function GET() {
  console.log("🔍 DEBUG ROUTE CALLED");
  
  // Simplest possible response
  return NextResponse.json({ 
    success: true, 
    message: "Debug route is working",
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  return NextResponse.json({ 
    success: true, 
    message: "POST debug route is working",
    timestamp: new Date().toISOString()
  });
}