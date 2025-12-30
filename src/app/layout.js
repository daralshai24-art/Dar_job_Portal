import "./globals.css";
import { Cairo } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

import SessionProvider from "@/components/providers/SessionProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { ConfirmationModalProvider } from "@/components/shared/modals/ConfirmationModalContext";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: "دار الشاي العربي | بوابة التوظيف",
    template: "%s | دار الشاي العربي",
  },
  description: "الموقع الرسمي لشركة دار الشاي العربي للتوظيف. اكتشف فرص العمل المتاحة وانضم إلى فريقنا المتميز في المملكة العربية السعودية.",
  keywords: ["موقع شركة دار الشاي العربي للتوظيف", "وظائف دار الشاي العربي", "توظيف", "فرص عمل", "دار الشاي العربي", "السعودية"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "دار الشاي العربي",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased`}>
        <SessionProvider session={session}>
          <ConfirmationModalProvider>
            <AnalyticsTracker />
            {children}
          </ConfirmationModalProvider>
        </SessionProvider>

        <ToastProvider />
      </body>
    </html>
  );
}
