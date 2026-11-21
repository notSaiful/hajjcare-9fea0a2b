/** Configurable first episode. Dates are calendar days in India (Asia/Kolkata). */
export const CLASSROOM_RELEASE_START_IST = "2026-12-07";
export const CLASSROOM_DAY_COUNT = 100;

function titleFor(day) {
  if (day === 1) {
    return {
      title_hi: "नीयत: हज इबादत है, सैर नहीं",
      title_en: "Niyyah: Hajj is worship, not a trip",
      title_ur: "نیت: حج عبادت ہے، سیر نہیں",
    };
  }
  return {
    title_hi: `दिन ${day}`,
    title_en: `Day ${day}`,
    title_ur: `دن ${day}`,
  };
}

export const PUBLIC_DAYS = Array.from({ length: CLASSROOM_DAY_COUNT }, (_, index) => ({
  day: index + 1,
  ...titleFor(index + 1),
}));

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
  return todayIst >= unlockDateIst(day, start);
}

export function dayStatus(day, todayIst, completed) {
  if (!isDayUnlocked(day, todayIst)) return "locked";
  if (completed) return "completed";
  if (todayIst === unlockDateIst(day)) return "current";
  return "available";
}

export function publicProgramme(todayIst) {
  return PUBLIC_DAYS.map((item) => {
    const unlocks = unlockDateIst(item.day);
    const status = dayStatus(item.day, todayIst, false);
    return { ...item, unlocks, status };
  });
}

export function formatLongDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatShortDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
