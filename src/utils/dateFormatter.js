// utils/dateFormatter.js
/**
 * Date formatting utilities
 */
export const formatArabicDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatShortArabicDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short", 
    day: "numeric",
  });
};