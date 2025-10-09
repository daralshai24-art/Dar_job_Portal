// app/(auth)/login/page.jsx
"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      toast.success("تم تسجيل الدخول بنجاح!");
      
      // Redirect to admin dashboard
      window.location.href = "/admin";
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="تسجيل الدخول"
      subtitle="مرحباً بعودتك! يرجى إدخال بيانات حسابك"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            البريد الإلكتروني
          </label>
          <AuthInput
            icon={Mail}
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            كلمة المرور
          </label>
          <div className="relative">
            <AuthInput
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="أدخل كلمة المرور"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B38025] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-left">
            <a 
              href="/forgot-password" 
              className="text-sm text-[#B38025] hover:text-green-800 transition-colors"
            >
              نسيت كلمة المرور؟
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <AuthButton 
          type="submit" 
          loading={loading}
        >
          تسجيل الدخول
        </AuthButton>
      </form>

      {/* Footer Links */}
      <div className="mt-8 space-y-4 text-center">
        <p className="text-gray-600">
          ليس لديك حساب؟{" "}
          <a 
            href="/register" 
            className="text-[#B38025] font-semibold hover:text-green-800 transition-colors"
          >
            إنشاء حساب جديد
          </a>
        </p>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو</span>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">حسابات تجريبية:</p>
          <div className="text-xs text-gray-500 space-y-1 text-right">
            <p>المدير: admin@example.com / password</p>
            <p>المستخدم: user@example.com / password</p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}