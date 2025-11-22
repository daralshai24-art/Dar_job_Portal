// utils/dateFormatter.js

/**
 * Safe date parsing
 */
const parseDate = (dateString) => {
  if (!dateString) return null;

  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;

  return d;
};

/**
 * Arabic Long Date
 * Example: "15 نوفمبر 2025"
 */
export const formatArabicDate = (dateString) => {
  const d = parseDate(dateString);
  if (!d) return "—";

  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Arabic Short Date
 * Example: "15 نوف 2025"
 */
export const formatShortArabicDate = (dateString) => {
  const d = parseDate(dateString);
  if (!d) return "—";

  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * English Date (safe)
 * Example: "Nov 15, 2025"
 */
export const formatEnglishDate = (dateString) => {
  const d = parseDate(dateString);
  if (!d) return "—";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Relative Time in Arabic
 * Examples:
 * - "منذ دقيقة"
 * - "قبل ساعتين"
 * - "منذ 3 أيام"
 */
export const formatRelativeTime = (dateString) => {
  const d = parseDate(dateString);
  if (!d) return "—";

  const now = new Date();
  const diffMs = now - d;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `قبل ${hours} ساعة`;
  return `منذ ${days} يوم`;
};
