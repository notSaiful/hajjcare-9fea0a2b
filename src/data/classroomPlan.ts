import { formatQuizClock } from "./classroom";

export const INTRO_EN =
  "Assalamu Alaikum. Welcome to HajCare AI's 100 Days Free Hajj Training Programme. Today's topic is NIYYAT (Intention). Hajj is an act of worship, not merely a journey. Today, we will understand the meaning of Niyyat, its importance, and its connection with Hajj.";

export const INTRO_HI =
  "अस्सलामु अलैकुम। HajCare AI के 100 दिन के मुफ़्त हज प्रशिक्षण कार्यक्रम में आपका स्वागत है। आज का विषय नीयत है। हज इबादत है, केवल एक सफ़र नहीं। आज हम नीयत का अर्थ, उसका महत्व, और हज से उसका संबंध समझेंगे।";

/** Hard cap for one classroom episode. */
export const EPISODE_CAP_SECONDS = 30 * 60;

/**
 * Spoken welcome and the Quran reading are timed allocations, not videos.
 * Quiz uses the existing 180-second timer.
 */
export const INTRO_ALLOCATION_SECONDS = 90;
export const QURAN_ALLOCATION_SECONDS = 2 * 60;

/**
 * Full YouTube lengths in seconds.
 * Naat 9:06 and Doctor 7:27 were verified by the owner with yt-dlp.
 * Hadith 1:23 and Dua 1:12 are the lengths already stated for those uploads.
 * Arkan uses its existing end−start instead of the full file.
 * None of these lengths add a new start or end to the player.
 */
export const YOUTUBE_FULL_SECONDS: Record<string, number | null> = {
  J76Dtc0MePA: 9 * 60 + 6,
  jpGJemWoVHI: 83,
  yCu43qBV0RY: 7 * 60 + 27,
  C5gHbAgfrVo: null,
  hRlmshVxs1w: 72,
};

export const SECTION_ORDER = [
  "intro",
  "quran",
  "hadith",
  "dua",
  "arkan",
  "doctor",
  "naat",
  "quiz",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

export interface PlannedSection {
  key: SectionKey;
  /** Seconds counted in the episode total. Null when the length is not verified. */
  seconds: number | null;
  adminReview: boolean;
  /** Existing clip end. Never rewritten to an arbitrary cut. */
  embedEnd: number | null;
}

export interface EpisodePlan {
  sections: PlannedSection[];
  totalSeconds: number;
  capSeconds: number;
  exceedsCap: boolean;
  adminReview: SectionKey[];
}

export interface ClipInput {
  youtubeId: string | null;
  start?: number | null;
  end?: number | null;
}

function clipSeconds(clip: ClipInput): { seconds: number | null; adminReview: boolean; embedEnd: number | null } {
  const embedEnd = clip.end ?? null;
  if (clip.youtubeId && clip.end != null) {
    return { seconds: clip.end - (clip.start ?? 0), adminReview: false, embedEnd };
  }
  if (!clip.youtubeId) return { seconds: 0, adminReview: false, embedEnd: null };
  const full = YOUTUBE_FULL_SECONDS[clip.youtubeId];
  if (full == null) return { seconds: null, adminReview: true, embedEnd };
  return { seconds: full, adminReview: false, embedEnd };
}

/**
 * Timetable for one day. Every section with a known length is added.
 * Nothing is shortened here. A total over 30:00 is reported as over cap
 * for admin review, and existing start/end values are left unchanged.
 */
export function planEpisode(input: {
  introSeconds?: number;
  quranSeconds?: number;
  hadith: ClipInput;
  dua: ClipInput;
  arkan: ClipInput;
  doctor: ClipInput;
  naat: ClipInput;
  quizSeconds: number;
}): EpisodePlan {
  const sections: PlannedSection[] = [
    { key: "intro", seconds: input.introSeconds ?? INTRO_ALLOCATION_SECONDS, adminReview: false, embedEnd: null },
    { key: "quran", seconds: input.quranSeconds ?? QURAN_ALLOCATION_SECONDS, adminReview: false, embedEnd: null },
    { key: "hadith", ...clipSeconds(input.hadith) },
    { key: "dua", ...clipSeconds(input.dua) },
    { key: "arkan", ...clipSeconds(input.arkan) },
    { key: "doctor", ...clipSeconds(input.doctor) },
    { key: "naat", ...clipSeconds(input.naat) },
    { key: "quiz", seconds: input.quizSeconds, adminReview: false, embedEnd: null },
  ];
  const ordered = SECTION_ORDER.map((key) => sections.find((section) => section.key === key)!);
  const totalSeconds = ordered.reduce((sum, section) => sum + (section.seconds ?? 0), 0);
  const exceedsCap = totalSeconds > EPISODE_CAP_SECONDS;
  const adminReview = ordered.filter((section) => section.adminReview).map((section) => section.key);
  return {
    sections: ordered,
    totalSeconds,
    capSeconds: EPISODE_CAP_SECONDS,
    exceedsCap,
    adminReview,
  };
}

export function sectionSeconds(plan: EpisodePlan, key: SectionKey): number | null {
  return plan.sections.find((section) => section.key === key)?.seconds ?? null;
}

export function formatEpisodeTotal(plan: EpisodePlan): string {
  return `${formatQuizClock(plan.totalSeconds)} / ${formatQuizClock(plan.capSeconds)}`;
}
