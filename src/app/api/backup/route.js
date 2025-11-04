import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import * as XLSX from 'xlsx';

// Mock data - replace with your actual database queries
const mockData = {
  users: [
    { id: 1, name: "محمد أحمد", email: "mohamed@example.com", role: "admin", createdAt: "2024-01-01" },
    { id: 2, name: "أحمد علي", email: "ahmed@example.com", role: "user", createdAt: "2024-01-02" }
  ],
  jobs: [
    { id: 1, title: "مطور ويب", description: "مطور ويب بخبرة في React", category: "تكنولوجيا", status: "active" },
    { id: 2, title: "مصمم جرافيك", description: "مصمم جرافيك مبدع", category: "تصميم", status: "active" }
  ],
  applications: [
    { id: 1, jobId: 1, applicantName: "سارة محمد", email: "sara@example.com", status: "مقبول", appliedAt: "2024-01-15" },
    { id: 2, jobId: 2, applicantName: "فاطمة أحمد", email: "fatima@example.com", status: "قيد المراجعة", appliedAt: "2024-01-16" }
  ],
  categories: [
    { id: 1, name: "تكنولوجيا", description: "وظائف التكنولوجيا", status: "active" },
    { id: 2, name: "تصميم", description: "وظائف التصميم", status: "active" }
  ]
};

export async function POST(request) {
  try {
    console.log('🔐 Starting backup process...');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log('❌ No session found - Unauthorized');
      return NextResponse.json(
        { error: 'غير مصرح. يرجى تسجيل الدخول أولاً.' },
        { status: 401 }
      );
    }

    // Check if user exists in session
    if (!session.user) {
      console.log('❌ No user in session');
      return NextResponse.json(
        { error: 'بيانات المستخدم غير متوفرة' },
        { status: 403 }
      );
    }

    // Check if user has admin or super_admin role
    const isAuthorized = session.user.role === 'admin' || session.user.role === 'super_admin';
    
    console.log('🔍 Role check:', {
      role: session.user.role,
      isAuthorized: isAuthorized,
      requiredRoles: ['admin', 'super_admin']
    });

    if (!isAuthorized) {
      console.log('❌ User does not have admin or super_admin role');
      return NextResponse.json(
        { 
          error: 'غير مسموح بالوصول. تحتاج إلى صلاحية مدير أو مدير عام لإنشاء نسخة احتياطية.',
          userRole: session.user.role,
          requiredRoles: ['admin', 'super_admin']
        },
        { status: 403 }
      );
    }

    // Check if user account is active
    if (session.user.status !== 'active') {
      console.log('❌ User account is not active:', session.user.status);
      return NextResponse.json(
        { error: 'حسابك غير نشط. لا يمكنك إنشاء نسخة احتياطية.' },
        { status: 403 }
      );
    }

    console.log('✅ User authorized for backup - Role:', session.user.role);

    const backupData = {
      ...mockData,
      backupDate: new Date().toISOString(),
      generatedBy: session.user.name || session.user.email,
      generatedByRole: session.user.role,
      generatedById: session.user.id
    };

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();

    // Add summary sheet
    const summaryData = [
      ['تقرير النسخ الاحتياطي', ''],
      ['تاريخ الإنشاء', new Date().toLocaleDateString('ar-SA')],
      ['وقت الإنشاء', new Date().toLocaleTimeString('ar-SA')],
      ['تم الإنشاء بواسطة', session.user.name || session.user.email],
      ['دور المنشئ', session.user.role],
      ['', ''],
      ['إحصائيات البيانات', ''],
      ['عدد المستخدمين', backupData.users.length],
      ['عدد الوظائف', backupData.jobs.length],
      ['عدد طلبات التوظيف', backupData.applications.length],
      ['عدد الفئات', backupData.categories.length],
      ['', ''],
      ['ملاحظات', 'تم إنشاء هذا الملف تلقائياً من نظام إدارة الوظائف']
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet(summaryData),
      'ملخص النسخ الاحتياطي'
    );

    // Add data sheets with Arabic headers
    const sheetsConfig = [
      {
        name: 'المستخدمين',
        data: backupData.users,
        headers: {
          id: 'المعرف',
          name: 'الاسم',
          email: 'البريد الإلكتروني',
          role: 'الدور',
          createdAt: 'تاريخ الإنشاء'
        }
      },
      {
        name: 'الوظائف',
        data: backupData.jobs,
        headers: {
          id: 'المعرف',
          title: 'عنوان الوظيفة',
          description: 'الوصف',
          category: 'التصنيف',
          status: 'الحالة'
        }
      },
      {
        name: 'طلبات التوظيف',
        data: backupData.applications,
        headers: {
          id: 'المعرف',
          jobId: 'معرف الوظيفة',
          applicantName: 'اسم المتقدم',
          email: 'البريد الإلكتروني',
          status: 'الحالة',
          appliedAt: 'تاريخ التقديم'
        }
      },
      {
        name: 'الفئات',
        data: backupData.categories,
        headers: {
          id: 'المعرف',
          name: 'اسم الفئة',
          description: 'الوصف',
          status: 'الحالة'
        }
      }
    ];

    // Create each data sheet
    sheetsConfig.forEach(sheetConfig => {
      const formattedData = sheetConfig.data.map(item => {
        const formattedItem = {};
        Object.keys(sheetConfig.headers).forEach(key => {
          formattedItem[sheetConfig.headers[key]] = item[key];
        });
        return formattedItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetConfig.name);
    });

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'buffer',
      bookSST: false,
      RTL: true // Right-to-left for Arabic
    });

    // Create filename - Use English filename to avoid encoding issues
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `backup-${dateString}.xlsx`;
    
    // For Arabic filename, use encoded version
    const arabicFilename = `نسخة-احتياطية-${dateString}.xlsx`;
    const encodedFilename = encodeURIComponent(arabicFilename);

    console.log('✅ Backup created successfully by:', session.user.role);

    // Return the response with properly encoded filename
    return new Response(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
        'Content-Length': excelBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Backup error:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء النسخة الاحتياطية' },
      { status: 500 }
    );
  }
}