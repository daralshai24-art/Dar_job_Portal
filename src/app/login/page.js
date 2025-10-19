// app/login/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import Input from "@/components/shared/ui/Input"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  // Check for error messages from URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "account_inactive") {
      setError("الحساب غير نشط. تواصل مع المسؤول");
    } else if (errorParam === "unauthorized") {
      setError("غير مصرح لك بالوصول إلى هذه الصفحة");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError("البريد الإلكتروني وكلمة المرور مطلوبان");
      setLoading(false);
      return;
    }

    const result = await login({ email, password });

    if (!result.success) {
      setError(result.error || "فشل تسجيل الدخول");
    }

    setLoading(false);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#F1DD8C]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-gray-600">
              ادخل إلى لوحة الإدارة
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Input
                  label="البريد الالكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  placeholder="example@company.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                label="كلمة المرور"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                icon={Lock} 
              />

              {/* Eye Toggle Button (absolute on the left) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-6/9 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                style={{ height: '100%' }}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
           </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>نسيت كلمة المرور؟ تواصل مع المسؤول</p>
          </div>
        </div>
      </div>
    </div>
  );
}