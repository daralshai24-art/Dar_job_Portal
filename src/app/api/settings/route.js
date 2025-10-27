// src/app/api/settings/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Settings from '@/models/settings';

// GET - Fetch settings
export async function GET() {
  try {
    await connectDB();
    
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings
      settings = await Settings.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل الإعدادات' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    const settingsData = await request.json();
    await connectDB();
    
    let settings = await Settings.findOne();
    
    if (settings) {
      // Update existing settings
      Object.keys(settingsData).forEach(section => {
        settings[section] = { ...settings[section], ...settingsData[section] };
      });
      await settings.save();
    } else {
      // Create new settings
      settings = await Settings.create(settingsData);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الإعدادات' },
      { status: 500 }
    );
  }
}