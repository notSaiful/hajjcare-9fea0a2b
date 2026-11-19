/** Bodies for days after Day 1. Imported only by the classroom API, not by the page bundle. */
export function futureDayBody(day) {
  if (day !== 2) return null;
  return {
    day: 2,
    title_hi: "दिन 2",
    title_en: "Day 2",
    note_hi: "दिन 2 की कड़ी अब खुली है।",
    note_en: "Day 2 episode is now open.",
  };
}
