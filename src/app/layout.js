// app/layout.js
import { Cairo } from "next/font/google";
import { authOptions } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import ToastProvider from "@/components/providers/ToastProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "دار الشاي العربي للتجارة",
  description: "Find jobs and hire talent easily",
};

export default async function RootLayout({ children }) {
  // Get session on server side (optional but improves performance)
  const session = await getServerSession(authOptions);

  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased font-sans`}>
        {/* Wrap children with SessionProvider for authentication */}
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
        
        {/* Keep your existing ToastProvider */}
        <ToastProvider />
      </body>
    </html>
  );
}