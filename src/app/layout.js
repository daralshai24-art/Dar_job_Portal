// app/layout.js
import { Cairo } from "next/font/google";
import ToastProvider from "@/components/providers/ToastProvider";
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

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased font-sans`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}