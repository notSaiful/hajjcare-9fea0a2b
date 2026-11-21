/** Placeholder bodies for days after Day 1. Imported only by the classroom API. */
export function futureDayBody(day) {
  if (day < 2 || day > 100) return null;
  return {
    day,
    title_hi: `दिन ${day}`,
    title_en: `Day ${day}`,
    title_ur: `دن ${day}`,
    note_hi: "जल्द आएगा",
    note_en: "Coming soon",
    note_ur: "جلد آ رہا ہے",
  };
}
