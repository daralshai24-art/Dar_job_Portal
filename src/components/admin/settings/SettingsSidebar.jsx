import Link from "next/link";

export default function SettingsSidebar({ activeSection, onSectionChange, onSaveAll }) {
  return (
    <aside className="bg-gray-100 p-4 rounded-lg space-y-2">
      <h2 className="text-lg font-semibold mb-4">الإعدادات</h2>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSectionChange("general")}
            className={`block w-full text-right px-3 py-2 rounded hover:bg-gray-200 ${
              activeSection === "general" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            عام
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange("email")}
            className={`block w-full text-right px-3 py-2 rounded hover:bg-gray-200 ${
              activeSection === "email" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            البريد الإلكتروني
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange("jobs")}
            className={`block w-full text-right px-3 py-2 rounded hover:bg-gray-200 ${
              activeSection === "jobs" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            الوظائف
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange("tools")}
            className={`block w-full text-right px-3 py-2 rounded hover:bg-gray-200 ${
              activeSection === "tools" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            أدوات النظام
          </button>
        </li>

        {/* Reference Entities */}
        <li>
          <Link
            href="/admin/settings/reference/categories"
            className="block text-right px-3 py-2 rounded hover:bg-gray-200 text-blue-600"
          >
            إدارة الفئات
          </Link>
        </li>
        <li>
          <Link
            href="/admin/settings/reference/titles"
            className="block text-right px-3 py-2 rounded hover:bg-gray-200 text-blue-600"
          >
            إدارة المسميات الوظيفية
          </Link>
        </li>
        <li>
          <Link
            href="/admin/settings/reference/locations"
            className="block text-right px-3 py-2 rounded hover:bg-gray-200 text-blue-600"
          >
            إدارة المواقع
          </Link>
        </li>
      </ul>

      <button
        onClick={onSaveAll}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        حفظ جميع الإعدادات
      </button>
    </aside>
  );
}
