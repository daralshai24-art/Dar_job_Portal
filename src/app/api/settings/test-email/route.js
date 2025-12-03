import { NextResponse } from 'next/server';
import { sendEmailWithoutTracking } from '@/services/email/emailSender';
import { getServerSession } from 'next-auth';
import  {authOptions}  from '@/lib/auth.config'; // Fixed import path

export async function POST(request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const result = await sendEmailWithoutTracking({
            to: email,
            subject: 'Test Email from Job Portal',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #2563eb;">Test Email</h1>
          <p>This is a test email from your Job Portal settings.</p>
          <p>If you received this, your email configuration is working correctly.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Sent via Resend</p>
        </div>
      `
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('Test email error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
