/**
 * The upcoming Hajj season.
 * Hajj 1447 AH / 2026 CE has passed (8 Dhul Hijjah was 26 May 2026).
 * Hajj 1448 AH / 2027 CE is the season this app should describe.
 *
 * 8 Dhul Hijjah 1448 is estimated as 15 May 2027 (Umm al-Qura; 8th of the
 * previous year plus one Hijri year). Arafah is the 9th (16 May 2027) and
 * Eid al-Adha the 10th (17 May 2027). Saudi sighting can move these by a day.
 */
export const HAJJ_YEAR_CE = 2027;
export const HAJJ_YEAR_AH = 1448;

/** 8 Dhul Hijjah, Asia/Riyadh, when Mina days begin. */
export const HAJJ_DAY_8_ISO = "2027-05-15T00:00:00+03:00";

export function hajjSeasonLabel(language?: string): string {
  const year = String(HAJJ_YEAR_CE);
  switch (language) {
    case "hi":
    case "mr":
      return `हज ${year}`;
    case "ur":
    case "ar":
      return `حج ${year}`;
    case "ta":
      return `ஹஜ் ${year}`;
    case "te":
      return `హజ్ ${year}`;
    case "bn":
      return `হজ ${year}`;
    case "ml":
      return `ഹജ്ജ് ${year}`;
    case "pa":
      return `ਹੱਜ ${year}`;
    default:
      return `Hajj ${year}`;
  }
}
