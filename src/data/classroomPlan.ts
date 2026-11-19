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
 * Full YouTube lengths.
 * yt-dlp could not read this environment (YouTube asked for a sign-in).
 * Hadith 83s and Dua 72s are the lengths the owner already stated (1:23 and 1:12).
 * Naat and Doctor stay null until a length can be verified. They are not given a guessed end time.
 */
export const YOUTUBE_FULL_SECONDS: Record<string, number | null> = {
  J76Dtc0MePA: null,
  jpGJemWoVHI: 83,
  yCu43qBV0RY: null,
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
 * Timetable for one day.
 * Flexible sections are Arkan and Doctor. Naat and Quiz take what remains of the 30 minutes.
 * A flexible or filler video is never given a new end time. If fitting it would need an
 * arbitrary cut, the section is flagged for admin review and its existing end is kept.
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
  const hadith = clipSeconds(input.hadith);
  const dua = clipSeconds(input.dua);
  const arkan = clipSeconds(input.arkan);
  const doctor = clipSeconds(input.doctor);
  const naat = clipSeconds(input.naat);
  const fixed: PlannedSection[] = [
    { key: "intro", seconds: input.introSeconds ?? INTRO_ALLOCATION_SECONDS, adminReview: false, embedEnd: null },
    { key: "quran", seconds: input.quranSeconds ?? QURAN_ALLOCATION_SECONDS, adminReview: false, embedEnd: null },
    { key: "hadith", ...hadith },
    { key: "dua", ...dua },
  ];
  const flexible: PlannedSection[] = [
    { key: "arkan", ...arkan },
    { key: "doctor", ...doctor },
  ];
  const placed = [...fixed, ...flexible];
  const used = placed.reduce((sum, section) => sum + (section.seconds ?? 0), 0);
  let remaining = Math.max(0, EPISODE_CAP_SECONDS - used);

  const quizNatural = input.quizSeconds;
  const quizSeconds = Math.min(quizNatural, remaining);
  const quizReview = quizSeconds < quizNatural;
  remaining -= quizSeconds;

  let naatSeconds = naat.seconds;
  let naatReview = naat.adminReview;
  if (naatSeconds == null) {
    naatSeconds = remaining;
    naatReview = true;
  } else if (naatSeconds > remaining) {
    naatReview = true;
    naatSeconds = remaining;
  } else {
    remaining -= naatSeconds;
  }

  const sections: PlannedSection[] = [
    ...fixed,
    ...flexible.map((section) => {
      if (section.seconds == null) return section;
      return section;
    }),
    { key: "naat", seconds: naatSeconds, adminReview: naatReview, embedEnd: naat.embedEnd },
    { key: "quiz", seconds: quizSeconds, adminReview: quizReview, embedEnd: null },
  ];

  const ordered = SECTION_ORDER.map((key) => sections.find((section) => section.key === key)!);
  const totalSeconds = ordered.reduce((sum, section) => sum + (section.seconds ?? 0), 0);
  const adminReview = ordered.filter((section) => section.adminReview).map((section) => section.key);
  return {
    sections: ordered,
    totalSeconds,
    capSeconds: EPISODE_CAP_SECONDS,
    exceedsCap: totalSeconds > EPISODE_CAP_SECONDS,
    adminReview,
  };
}

export function sectionSeconds(plan: EpisodePlan, key: SectionKey): number | null {
  return plan.sections.find((section) => section.key === key)?.seconds ?? null;
}

export function formatEpisodeTotal(plan: EpisodePlan): string {
  return `${formatQuizClock(plan.totalSeconds)} / ${formatQuizClock(plan.capSeconds)}`;
}
