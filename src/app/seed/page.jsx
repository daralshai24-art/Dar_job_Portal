// app/seed/page.jsx
"use client";

import { useState } from "react";
import { UserPlus, CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Create with default credentials
  const handleQuickSetup = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/seed", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to create admin");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create with custom credentials
  const handleCustomSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setFormData({ name: "", email: "", password: "" });
      } else {
        setError(data.error || "Failed to create admin");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-900 rounded-full mb-4">
            <UserPlus className="w-10 h-10 text-[#F1DD8C]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            إعداد النظام
          </h1>
          <p className="text-gray-600">
            قم بإنشاء حساب المدير العام للبدء
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Message */}
          {result && (
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 text-lg mb-2">
                    {result.message}
                  </h3>

                  {result.credentials && (
                    <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
                      <p className="font-semibold text-gray-900 mb-2">
                        بيانات تسجيل الدخول:
                      </p>
                      <p className="text-gray-700">
                        <strong>البريد الإلكتروني:</strong>{" "}
                        {result.credentials.email}
                      </p>
                      <p className="text-gray-700">
                        <strong>كلمة المرور:</strong>{" "}
                        {result.credentials.password}
                      </p>
                      {result.credentials.warning && (
                        <p className="text-red-600 font-semibold mt-2">
                          {result.credentials.warning}
                        </p>
                      )}
                    </div>
                  )}

                  {result.nextSteps && (
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        الخطوات التالية:
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {result.nextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <a
                    href="/login"
                    className="mt-4 inline-block bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
                  >
                    الذهاب لتسجيل الدخول ←
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
                {error.includes("already exists") && (
                  <p className="text-xs text-red-600 mt-2">
                    يمكنك تسجيل الدخول مباشرة أو حذف الحساب الموجود من MongoDB
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Setup Options */}
          {!result && (
            <div className="space-y-6">
              {/* Quick Setup Button */}
              {!customMode && (
                <div>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      إعداد سريع
                    </h3>
                    <p className="text-sm text-gray-600">
                      استخدم بيانات الدخول الافتراضية (يمكن تغييرها لاحقاً)
                    </p>
                  </div>

                  <button
                    onClick={handleQuickSetup}
                    disabled={loading}
                    className="w-full bg-green-900 text-white py-4 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        إنشاء حساب المدير الآن
                      </>
                    )}
                  </button>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setCustomMode(true)}
                      className="text-green-900 hover:text-green-700 text-sm font-medium"
                    >
                      أو أدخل بيانات مخصصة ←
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Setup Form */}
              {customMode && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      بيانات مخصصة
                    </h3>
                    <button
                      onClick={() => setCustomMode(false)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      ← رجوع
                    </button>
                  </div>

                  <form onSubmit={handleCustomSetup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent"
                        placeholder="محمد أحمد"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent"
                        placeholder="admin@company.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        كلمة المرور
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent"
                        placeholder="••••••••"
                        minLength={6}
                        required
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        يجب أن تكون 6 أحرف على الأقل
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-900 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          جاري الإنشاء...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          إنشاء حساب المدير
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ملاحظة:</strong> هذه الصفحة لإعداد النظام فقط. يُنصح بحذف
              ملف <code className="bg-blue-100 px-1 rounded">/app/seed</code> و{" "}
              <code className="bg-blue-100 px-1 rounded">/app/api/seed</code>{" "}
              بعد إنشاء الحساب.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}