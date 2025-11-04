import Link from "next/link";

export default function SettingsSidebar({ activeSection, onSectionChange, onSaveAll }) {
  const sections = [
    { id: "tools", label: "أدوات النظام", type: "internal" },
    { id: "categories", label: "إدارة الفئات", type: "link", href: "/admin/settings/reference/categories" },
    // Future sections can be added here:
    // { id: "general", label: "عام", type: "internal" },
    // { id: "email", label: "البريد الإلكتروني", type: "internal" },
    // { id: "jobs", label: "الوظائف", type: "internal" },
    // { id: "titles", label: "إدارة المسميات الوظيفية", type: "link", href: "/admin/settings/reference/titles" },
    // { id: "locations", label: "إدارة المواقع", type: "link", href: "/admin/settings/reference/locations" },
  ];

  return (
    <aside className="bg-gray-100 p-4 rounded-lg space-y-2">
      <h2 className="text-lg font-semibold mb-4">الإعدادات</h2>
      
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            {section.type === "internal" ? (
              <button
                onClick={() => onSectionChange(section.id)}
                className={`block w-full text-right px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
                  activeSection === section.id ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {section.label}
              </button>
            ) : (
              <Link
                href={section.href}
                className="block text-right px-3 py-2 rounded hover:bg-gray-200 text-blue-600 transition-colors"
              >
                {section.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Save All Settings button - Only show if there are internal settings sections */}
      <button
        onClick={onSaveAll}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
      >
        حفظ جميع الإعدادات
      </button>
    </aside>
  );
}