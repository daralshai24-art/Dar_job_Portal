// src/utils/formatDate12Hour.js
export const formatDate12Hour = (dateStr) => {
  if (!dateStr) return "N/A";

  // Clean unwanted T00:00:00.000Z and extra spaces
  let cleaned = dateStr.replace("T00:00:00.000Z", "").trim();

  // Replace space with T for Date parsing if needed
  if (!cleaned.includes("T") && cleaned.includes(" ")) {
    cleaned = cleaned.replace(" ", "T");
  }

  const parsed = new Date(cleaned);
  if (isNaN(parsed)) return cleaned;

  let hours = parsed.getHours();
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12; // handle midnight/noon

  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const year = parsed.getFullYear();

  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
};
