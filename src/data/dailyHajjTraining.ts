export type DailyLesson = {
  day: number;
  phase: string;
  title: string;
  lesson: string;
  doctorFocus: string;
  guest: string;
  quran: string;
  hadith: string;
  revision: boolean;
};

const phases = [
  ["Foundation & intention", ["Welcome: the sacred journey", "Sincerity (ikhlas) and intention", "What Hajj and Umrah mean", "Who is required to perform Hajj", "Types of Hajj: Ifrad, Qiran and Tamattu'", "A pilgrim's character", "Patience, unity and service", "Learning with family", "Women and elderly pilgrims", "How to use HajCare AI", "Official sources and avoiding misinformation", "Setting a personal preparation plan", "Financial and family preparation", "Respecting scholarly differences", "Revision: foundations and intention"]],
  ["Documents & travel readiness", ["Passport, visa and identity documents", "Hajj Committee confirmation and cover number", "Vaccination and health certificates", "Emergency contacts and digital copies", "Travel insurance and prescriptions", "Baggage rules and airline limits", "Currency and safe payments", "Mobile, charger and power bank", "Airport reporting and check-in", "Immigration and security screening", "Flight etiquette and hydration", "Hotel arrival and room safety", "Group leader and building details", "Travel-day checklist", "Revision: documents and travel"]],
  ["Health, safety & wellbeing", ["Medical assessment before travel", "Walking practice and comfortable footwear", "Hydration and heat-stroke prevention", "Diabetes care during travel", "Blood pressure and heart medicines", "Infection prevention and masks", "Food safety and rest", "Women's health planning", "Elderly care and mobility support", "First-aid essentials", "When to seek medical help", "Crowd safety and calm decision-making", "Sleep, stress and emotional wellbeing", "Emergency numbers and SOS", "Revision: health and safety"]],
  ["Umrah essentials", ["Umrah: purpose and sequence", "Preparing for Ihram", "Miqat and making intention", "Talbiyah: meaning and etiquette", "Ihram restrictions and common mistakes", "Entering Masjid al-Haram", "Tawaf: starting correctly", "Tawaf: seven circuits with calmness", "Praying after Tawaf where possible", "Sa'i between Safa and Marwah", "Hair cutting and completion", "Umrah for women and elderly pilgrims", "What to do in crowds", "Common Umrah questions", "Revision: mock Umrah"]],
  ["Hajj before Mina", ["Hajj timeline at a glance", "Nusuk and official digital services", "Accommodation, meals and transport", "Preparing the Mina day bag", "Hajj intention and Talbiyah refresh", "Knowing your group, camp and building", "Maps, landmarks and meeting points", "Sukoon location-sharing consent", "Lost & Found and identification", "Medical and emergency assistance", "Saudi laws and respectful conduct", "How to receive official updates", "Family communication plan", "Packing for the five Hajj days", "Revision: Hajj readiness"]],
  ["Mina & Arafat", ["8th Dhul Hijjah: going to Mina", "Life in Mina tents", "Prayer, rest and group discipline", "Preparing spiritually for Arafat", "9th Dhul Hijjah: journey to Arafat", "Wuquf: the essential standing at Arafat", "Dua, dhikr and repentance at Arafat", "Heat and hydration at Arafat", "Supporting elderly and women at Arafat", "Avoiding crowd and transport risks", "Leaving Arafat calmly", "Maghrib and Isha on the journey", "Arafat: common questions", "Arafat: practical scenario", "Revision: Mina and Arafat"]],
  ["Muzdalifah & Eid day", ["Arriving in Muzdalifah", "Combining Maghrib and Isha", "Rest, safety and personal care", "Collecting pebbles safely", "Leaving Muzdalifah", "10th Dhul Hijjah: Eid day sequence", "Ramy at Jamrat al-Aqabah", "Qurbani: official booking and confirmation", "Halq or taqsir", "Partial release from Ihram", "Tawaf al-Ifadah", "Sa'i when required", "Managing fatigue on Eid day", "Eid day: common mistakes", "Revision: Muzdalifah and Eid"]],
  ["Days of Tashriq", ["Returning to Mina", "Three Jamarat: order and etiquette", "Timing, safety and crowd guidance", "Duas and patience in Mina", "Nafar Awwal and Nafar Thani", "Leaving Mina responsibly", "Tawaf al-Wada'", "Women's Hajj questions", "Hajj for elderly and persons with disability", "If separated from your group", "When plans change: follow official direction", "Keeping records and documents safe", "Helping fellow pilgrims", "Completion of Hajj: gratitude", "Revision: days of Tashriq"]],
  ["Madinah & Ziyarat", ["Travelling to Madinah", "Masjid an-Nabawi etiquette", "Sending salutations with respect", "Rawdah: official booking and manners", "Quba Mosque", "Uhud and its lessons", "Al-Baqi and respectful conduct", "Optional Ziyarat: educational guidance", "Madinah maps, hotel and transport", "Health and safety in Madinah", "Shopping and baggage preparation", "Prayer and time management", "Avoiding unverified religious claims", "Leaving Madinah with gratitude", "Revision: Madinah guide"]],
  ["Digital assistance & service", ["HajCare AI daily support", "Zoya AI voice and text guidance", "Official Circular Centre", "Nusuk services and official notices", "Sukoon Tracking: privacy and consent", "Family Connect: safe communication", "Lost person reporting", "Lost luggage reporting", "Emergency SOS: when and how", "Medical assistance workflow", "Volunteer support and escalation", "Complaints and feedback", "Offline guidance and battery saving", "Protecting personal data and scams", "Revision: digital services"]],
  ["Return, reflection & service", ["Return-flight preparation", "Customs, baggage and airport process", "Health after return", "Keeping Hajj lessons alive", "Family and community sharing", "Gratitude and humility after Hajj", "Responsible use of photos and media", "Supporting future pilgrims", "Volunteer service basics", "Hajj Inspector and group-leader coordination", "Handling questions with kindness", "Reviewing official post-Hajj updates", "Personal action plan", "Final practice quiz", "Revision: return and reflection"]],
  ["Final revision & certificate", ["Full Hajj journey revision", "Full Umrah journey revision", "Documents and travel mock check", "Health and medicine mock check", "Ihram and Miqat mock lesson", "Tawaf and Sa'i mock lesson", "Mina and Arafat mock lesson", "Muzdalifah and Jamarat mock lesson", "Madinah and Ziyarat mock lesson", "Digital safety and emergency mock", "Official-guidance update review", "Family-support plan", "Final assessment preparation", "Final assessment", "Completion, dua and certificate"]],
] as const;

const quranVerses = [
  "Qur'an 2:197 — Hajj is in well-known months; take provision, and the best provision is taqwa.",
  "Qur'an 2:158 — Safa and Marwah are among the symbols of Allah.",
  "Qur'an 3:97 — Pilgrimage to the House is a duty for those able to make the journey.",
  "Qur'an 22:27 — Proclaim the pilgrimage; people will come from every distant path.",
];

const hadiths = [
  "Sahih al-Bukhari & Sahih Muslim — Actions are judged by intentions.",
  "Sahih al-Bukhari & Sahih Muslim — An accepted Hajj has no reward but Paradise.",
  "Sahih al-Bukhari — Whoever performs Hajj without obscenity or wrongdoing returns like the day their mother gave birth to them.",
  "Sahih Muslim — Allah is gentle and loves gentleness in all matters.",
];

const doctorTopics = ["hydration and heat", "medicines and prescriptions", "walking and foot care", "diabetes and blood pressure", "elderly care and infection prevention"];
const guests = ["Certified Hajj Trainer", "State Hajj Inspector", "Islamic Scholar", "Experienced Hajji/Hajjah", "Doctor", "Volunteer", "Airport or airline expert", "Safety and emergency expert"];

// The public programme is intentionally limited to 100 days. These ten phases
// cover the complete journey without asking pilgrims to follow an unwieldy
// 180-day schedule; the remaining source topics stay available for future
// optional revision content.
const hundredDayPhases = [...phases.slice(0, 9), phases[11]];

export const dailyHajjTraining: DailyLesson[] = hundredDayPhases.flatMap(([phase, lessons], phaseIndex) =>
  lessons.slice(0, 10).map((title, lessonIndex) => {
    const day = phaseIndex * 10 + lessonIndex + 1;
    return {
      day,
      phase,
      title,
      lesson: lessonIndex === 9 ? "Review the phase, practise the key steps, and note any questions for a qualified trainer." : `A practical 15-minute lesson on ${title.toLowerCase()}, using official guidance and authentic sources where applicable.`,
      doctorFocus: doctorTopics[day % doctorTopics.length],
      guest: guests[day % guests.length],
      quran: quranVerses[day % quranVerses.length],
      hadith: hadiths[day % hadiths.length],
      revision: lessonIndex === 9 || day >= 91,
    };
  }),
);
