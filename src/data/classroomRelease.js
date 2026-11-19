/** Configurable first day. Dates are calendar days in India (Asia/Kolkata). Day 1 stays unlocked. */
export const CLASSROOM_RELEASE_START_IST = "2026-11-20";

export const PUBLIC_DAYS = [
  { day: 1, title_hi: "नीयत: हज इबादत है, सैर नहीं", title_en: "Niyyah: Hajj is worship, not a trip" },
  { day: 2, title_hi: "दिन 2", title_en: "Day 2" },
];

export function istDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function addIsoDays(iso, days) {
  const [year, month, day] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day));
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function unlockDateIst(day, start = CLASSROOM_RELEASE_START_IST) {
  return addIsoDays(start, day - 1);
}

export function isDayUnlocked(day, todayIst, start = CLASSROOM_RELEASE_START_IST) {
  if (day === 1) return true;
  return todayIst >= unlockDateIst(day, start);
}

export function dayStatus(day, todayIst, completed) {
  if (!isDayUnlocked(day, todayIst)) return "locked";
  if (completed) return "completed";
  if (todayIst === unlockDateIst(day) || (day === 1 && todayIst <= unlockDateIst(1))) return "current";
  if (todayIst < unlockDateIst(day)) return "upcoming";
  return "available";
}

export function publicProgramme(todayIst) {
  return PUBLIC_DAYS.map((item) => {
    const unlocks = unlockDateIst(item.day);
    const status = dayStatus(item.day, todayIst, false);
    return { ...item, unlocks, status };
  });
}
