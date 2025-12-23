import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import VisitorLog from '@/models/VisitorLog';

export async function GET(req) {
    try {
        await connectDB();
        const logs = await VisitorLog.find().sort({ timestamp: -1 }).limit(10);
        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
