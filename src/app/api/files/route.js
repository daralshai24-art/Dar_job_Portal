import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { withAuth } from "@/lib/apiAuth";

export const DELETE = withAuth(async () => {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
        
      // recreate folder
      fs.mkdirSync(uploadDir);
    }

    return NextResponse.json({
      message: "تم حذف جميع الملفات بنجاح"
    });

  } catch (error) {
    console.error("Delete files error:", error);
    return NextResponse.json(
      { error: "فشل في حذف الملفات" },
      { status: 500 }
    );
  }
}, {
  roles: ["super_admin", "admin"]
});
