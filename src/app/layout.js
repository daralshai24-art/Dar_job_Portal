import "./globals.css";
import { Cairo } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

import SessionProvider from "@/components/providers/SessionProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { ConfirmationModalProvider } from "@/components/shared/modals/ConfirmationModalContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased`}>
        <SessionProvider session={session}>
          <ConfirmationModalProvider>
            {children}
          </ConfirmationModalProvider>
        </SessionProvider>

        <ToastProvider />
      </body>
    </html>
  );
}
    