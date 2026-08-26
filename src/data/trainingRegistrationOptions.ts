export { INDIAN_LOCATIONS } from "@/data/indiaDistricts";

/**
 * The 19 embarkation points notified for the Haj Committee workflow.
 * Keep this list independent from districts: pilgrims may choose a different
 * point where the official allocation permits it.
 */
export const EMBARKATION_POINTS = [
  "Ahmedabad",
  "Bengaluru",
  "Bhopal",
  "Chennai",
  "Delhi",
  "Gaya",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Mumbai",
  "Nagpur",
  "Patna",
  "Srinagar",
  "Varanasi",
  "Vijayawada",
] as const;

/** Conservative state-level defaults. The value is only a suggestion and is
 * always editable by the pilgrim. Final allocation remains with the official
 * Haj authorities. */
export const STATE_EMBARKATION_SUGGESTIONS: Readonly<Record<string, string>> = {
  "Andaman and Nicobar Islands": "Kolkata",
  "Andhra Pradesh": "Vijayawada",
  "Arunachal Pradesh": "Guwahati",
  Assam: "Guwahati",
  Bihar: "Gaya",
  Chandigarh: "Delhi",
  Chhattisgarh: "Nagpur",
  Delhi: "Delhi",
  Goa: "Mumbai",
  Gujarat: "Ahmedabad",
  Haryana: "Delhi",
  "Himachal Pradesh": "Delhi",
  "Jammu and Kashmir": "Srinagar",
  Jharkhand: "Kolkata",
  Karnataka: "Bengaluru",
  Kerala: "Kochi",
  Ladakh: "Srinagar",
  Lakshadweep: "Kochi",
  "Madhya Pradesh": "Bhopal",
  Maharashtra: "Mumbai",
  Manipur: "Guwahati",
  Meghalaya: "Guwahati",
  Mizoram: "Guwahati",
  Nagaland: "Guwahati",
  Odisha: "Kolkata",
  Puducherry: "Chennai",
  Punjab: "Delhi",
  Rajasthan: "Jaipur",
  Sikkim: "Guwahati",
  "Tamil Nadu": "Chennai",
  Telangana: "Hyderabad",
  "Dadra and Nagar Haveli and Daman and Diu": "Mumbai",
  Tripura: "Guwahati",
  "Uttar Pradesh": "Lucknow",
  Uttarakhand: "Delhi",
  "West Bengal": "Kolkata",
};

export const TRAINING_COMMUNITY_URLS = {
  whatsapp: import.meta.env.VITE_HAJCARE_TRAINING_WHATSAPP_URL || "",
  telegram: import.meta.env.VITE_HAJCARE_TRAINING_TELEGRAM_URL || "",
  schedule: import.meta.env.VITE_HAJCARE_TRAINING_SCHEDULE_URL || "",
};
