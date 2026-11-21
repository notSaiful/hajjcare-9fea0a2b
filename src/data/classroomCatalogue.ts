/**
 * Preview catalogue for the 100 Days Hajj Training classroom.
 * One template, one record per day. Days 8–100 have no per-day title in the repo,
 * so they keep the week theme from public/index.html and empty sections.
 *
 * Proposed admin shape (not applied, no schema change):
 * classroom_days.content jsonb already exists in
 * supabase/migrations/20261119220000_classroom_days.sql.
 * Each row can stay one day and hold this object, edited independently:
 * {
 *   short, title_hi, title_en, title_ur, icon,
 *   sections: { quran|hadith|dua|lesson|doctor|expert|naat|quiz:
 *     { youtubeId, fileSrc, durationLabel, language, citation } | null }
 * }
 * Public clients still cannot SELECT that table. training_enrollments is not involved.
 */

import { CLASSROOM_CLASSES, CLASSROOM_SIDE_VIDEOS } from "./classroom";

export const SECTION_ORDER = [
  "quran",
  "hadith",
  "dua",
  "lesson",
  "doctor",
  "expert",
  "naat",
  "quiz",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

export const SECTION_LABEL: Record<SectionKey, string> = {
  quran: "Quran Tilawat",
  hadith: "Hadith",
  dua: "Dua",
  lesson: "Arkan-e-Hajj / Main Lesson",
  doctor: "Doctor Corner",
  expert: "Expert Guidance",
  naat: "Naat",
  quiz: "Quiz & Revision",
};

/** Button labels on the premium day card, matching the approved Day 1 layout. */
export const CARD_LABEL: Record<SectionKey, string> = {
  quran: "Quran Tilawat",
  hadith: "Hadith",
  dua: "Dua",
  lesson: "Main Lesson",
  doctor: "Doctor Corner",
  expert: "Expert Guidance",
  naat: "Naat",
  quiz: "Quiz",
};

/** Card order from the approved Day 1 card. Dua stays on the board. */
export const CARD_ORDER: SectionKey[] = [
  "doctor",
  "quran",
  "hadith",
  "expert",
  "lesson",
  "quiz",
  "naat",
];

export type TopicIcon =
  | "niyyat"
  | "ihram"
  | "miqat"
  | "pillar"
  | "reward"
  | "dhulhijjah"
  | "rites"
  | "tawaf"
  | "sai"
  | "umrah"
  | "mina"
  | "arafat"
  | "muzdalifah"
  | "jamarat"
  | "wida"
  | "madinah"
  | "character"
  | "revision"
  | "departure";

export type DaySource = "classroom-release" | "video-shortlist" | "homepage-week";

export interface SectionMedia {
  kind: "youtube" | "file" | "quiz";
  youtubeId?: string;
  startSeconds?: number;
  endSeconds?: number;
  fileSrc?: string;
  durationLabel: string | null;
  language: string | null;
  /** Video title or an existing classroom label. Not a new Quran or Hadith citation. */
  citation: string;
  note?: string;
}

export interface ClassroomDayContent {
  day: number;
  short: string;
  title_hi: string;
  title_en: string;
  title_ur: string | null;
  arabic: string | null;
  icon: TopicIcon;
  source: DaySource;
  week_hi: string;
  sections: Record<SectionKey, SectionMedia | null>;
}

interface WeekBand {
  from: number;
  to: number;
  hi: string;
  en: string;
  ur: string;
  icon: TopicIcon;
  detail_hi: string;
}

/**
 * Week themes copied from public/index.html ("हफ़्ता-ब-हफ़्ता").
 * English and Urdu are translations of those Hindi labels, not a second calendar.
 */
const WEEKS: WeekBand[] = [
  { from: 1, to: 7, hi: "नीयत और बुनियाद", en: "Niyyat and the foundation", ur: "نیت اور بنیاد", icon: "niyyat", detail_hi: "इख़्लास और नीयत" },
  { from: 8, to: 14, hi: "हज क्या है", en: "What is Hajj", ur: "حج کیا ہے", icon: "pillar", detail_hi: "हज की फ़ज़ीलत" },
  { from: 15, to: 21, hi: "इहराम", en: "Ihram", ur: "احرام", icon: "ihram", detail_hi: "इहराम की पाबंदियाँ" },
  { from: 22, to: 28, hi: "तलबिया और तवाफ़", en: "Talbiyah and Tawaf", ur: "تلبیہ اور طواف", icon: "tawaf", detail_hi: "तलबिया, तवाफ़ का तरीक़ा" },
  { from: 29, to: 35, hi: "सई", en: "Sa'i", ur: "سعی", icon: "sai", detail_hi: "हज़रत हाजरा का भरोसा" },
  { from: 36, to: 42, hi: "उमरा पूरा अभ्यास", en: "Full Umrah practice", ur: "عمرہ کا مکمل مشق", icon: "umrah", detail_hi: "उमरा के अरकान क्रम से" },
  { from: 43, to: 49, hi: "मिना", en: "Mina", ur: "منیٰ", icon: "mina", detail_hi: "8 ज़िलहिज्जा" },
  { from: 50, to: 56, hi: "अरफ़ात", en: "Arafat", ur: "عرفات", icon: "arafat", detail_hi: "अरफ़ा की दुआ" },
  { from: 57, to: 63, hi: "मुज़दलिफ़ा", en: "Muzdalifah", ur: "مزدلفہ", icon: "muzdalifah", detail_hi: "कंकरियाँ चुनना" },
  { from: 64, to: 70, hi: "रमी, क़ुर्बानी, हल्क़", en: "Rami, Qurbani, Halq", ur: "رمی، قربانی، حلق", icon: "jamarat", detail_hi: "10 ज़िलहिज्जा के काम" },
  { from: 71, to: 77, hi: "तवाफ़-ए-इफ़ाज़ा और विदा", en: "Tawaf al-Ifadah and farewell", ur: "طوافِ افاضہ اور وداع", icon: "wida", detail_hi: "तवाफ़-ए-विदा" },
  { from: 78, to: 84, hi: "मदीना मुनव्वरा", en: "Madinah", ur: "مدینہ منورہ", icon: "madinah", detail_hi: "मस्जिद-ए-नबवी का अदब" },
  { from: 85, to: 91, hi: "अख़लाक़ और सब्र", en: "Character and patience", ur: "اخلاق اور صبر", icon: "character", detail_hi: "झगड़े से बचना" },
  { from: 92, to: 98, hi: "पूरा दोहराव", en: "Full revision", ur: "پورا دُہراؤ", icon: "revision", detail_hi: "सभी अरकान का दोहराव" },
  { from: 99, to: 100, hi: "रवानगी की तैयारी", en: "Preparing to depart", ur: "روانگی کی تیاری", icon: "departure", detail_hi: "सफ़र की दुआएँ" },
];

function weekFor(day: number): WeekBand {
  const band = WEEKS.find((item) => day >= item.from && day <= item.to);
  if (!band) throw new Error(`No week theme for day ${day}`);
  return band;
}

function blankSections(): Record<SectionKey, SectionMedia | null> {
  return {
    quran: null,
    hadith: null,
    dua: null,
    lesson: null,
    doctor: null,
    expert: null,
    naat: null,
    quiz: null,
  };
}

function youtube(
  youtubeId: string,
  durationLabel: string | null,
  language: string | null,
  citation: string,
  extra?: Partial<Pick<SectionMedia, "startSeconds" | "endSeconds" | "note">>,
): SectionMedia {
  return { kind: "youtube", youtubeId, durationLabel, language, citation, ...extra };
}

/**
 * Days 1–7 video picks from the researched shortlist.
 * Dua is omitted on purpose: the shortlist has no Dua URL.
 * Empty slots stay null and render as Coming Soon.
 */
const SHORTLIST: Record<number, Partial<Record<SectionKey, SectionMedia>>> = {
  1: {
    quran: youtube(
      "sRYo5YSpPqE",
      "3:04",
      "Arabic recitation",
      "Surah - 98 - Al-Bayyinah - Accurate Tajweed recitation of Quran - Mahmoud Khaleel Al-Hussary",
    ),
    hadith: youtube(
      "Pz8z6d6PFEE",
      "1:23",
      "Arabic text with English translation",
      "Sahih al-Bukhari - Volume 1, Book 1, Hadith 1 | Revelation",
    ),
    expert: youtube(
      "x_Wszcyb2UQ",
      "7:47",
      "Hindi/Urdu",
      "Namaz, Roze, Hajj Ki Niyat Ka Tariqa By Adv. Faiz Syed",
    ),
    naat: youtube(
      "J76Dtc0MePA",
      "9:06",
      "Urdu/Hindi",
      "New Hajj Naat 2025 | Hajj Kalam 2025 | Ary Hajion Tm Haram Jarhe Ho | Zaki Ahmad | Emotional Naat",
    ),
    quiz: {
      kind: "quiz",
      durationLabel: "3:00",
      language: "Hindi",
      citation: "दिन 1 क्विज़",
    },
  },
  2: {
    doctor: youtube(
      "sVXL2MnB-nQ",
      "7:25",
      "English",
      "Prickly Heat - British Hajj Delegation",
    ),
    quran: youtube(
      "xX18qS2lVqA",
      "1:43",
      "Arabic recitation",
      "Short Tilawat e Quran | Surah Al Baqarah | Ayat 197 - 199 | Mohaddis Media",
    ),
    hadith: youtube(
      "-wbcEd2VEWU",
      "1:19",
      "Not confirmed from title",
      "Sahih Bukhari Hadees No 1838",
    ),
    expert: youtube(
      "iJO0foorhmU",
      null,
      "Urdu",
      "Hikmat e Hajj - 21st June 2023 - Hajj 2023 - ARY Qtv",
      { note: "Duration was not verified. This is a full programme, not a marked Ihram clip." },
    ),
    lesson: youtube(
      "oQd1bnEi32U",
      "0:55",
      "Hindi",
      "Hajj 2026 : एहराम क्या है? हज में इसका महत्व और नियम आसान भाषा में समझें",
    ),
    naat: youtube(
      "e3dQC9VQId4",
      "3:30",
      "Urdu/Hindi",
      "Naat Sahil Raza Qadri | New Hajj Naat 2026 | Naat Sharif",
    ),
  },
  3: {
    doctor: youtube(
      "xfkKfZjlgvk",
      "4:36",
      "Hindi",
      "2 घंटे से ज्यादा बैठना पड़ सकता है खतरनाक! | DVT Prevention During Travel | Dr Ashank Bansal",
    ),
    quran: youtube(
      "B3znd7yKKTc",
      "6:15",
      "Arabic recitation with Urdu translation",
      "Surah-2 Al baqarah Ayat No 189-196 Ruku No 24 Word by word learning Quran in video in 4K",
    ),
    hadith: youtube(
      "13ScRL5nHss",
      "3:07",
      "Urdu/Hindi",
      "Sahih Bukhari Hadees No.1521-1525 | Hadees in Urdu/Hindi | Bukhari Shareef",
    ),
    expert: youtube("YVfBS0FiCmk", "4:28", "English", "Miqats explained"),
    lesson: youtube(
      "GDOImlXnQiM",
      "2:56",
      "Urdu",
      "Meeqat kya Hai aur Iske Ahkam kya hain? | Mufti Akmal | ARY Qtv",
    ),
    naat: youtube(
      "oYEeOKQ5pRQ",
      "8:38",
      "Urdu/Hindi",
      "Hajj Ki Arzoo Dil Mein Phir Se Gud Gudai Hai | Hajj Special Kalam 2026 | Maulana Ubaid Raza Attari",
    ),
  },
  4: {
    doctor: youtube(
      "rVAVvNgZpXo",
      "4:13",
      "Urdu/English mixed",
      "Complete Heart Patient Travel Guide for Hajj & Umrah | Precautions, Checkup & Safety Tips",
    ),
    quran: youtube(
      "29Vc1mAzz98",
      "0:42",
      "Arabic recitation",
      "Surah Al-Imran 96-97 | Ayah on Hajj | Reciter Abdullah Al Mousa",
    ),
    hadith: youtube(
      "Rvt7QlCqbCM",
      "0:25",
      "Not confirmed from title",
      "Sahih Al Bukhari Hadees Number 08",
    ),
    expert: youtube(
      "56AcJypuayY",
      "1:01",
      "Hindi",
      "हज किस पर फ़र्ज़ है? | Maulana Ilyas Qadri Shahab | Deen Ki Baatein",
    ),
    lesson: youtube(
      "f7lmuh5EFPQ",
      "5:56",
      "Hindi/Urdu",
      "Haj kin Logo par Farz hota hai ? | हज किन लोगों पर फर्ज़ होता है ? | Mufti A M Qasmi",
    ),
    naat: youtube(
      "K6XGIbSyihY",
      "6:56",
      "Urdu/Hindi",
      "Hajj Pe Jana Mubarak | Hajj Naat Sharif | Emotional Hajj Kalam | Raja Azhar Official",
    ),
  },
  5: {
    quran: youtube(
      "x-0Zm232sWc",
      "1:00",
      "Arabic recitation",
      "Abdul Rahman Al Ossi - Surah Al-Hajj (22) Verses 27-28",
    ),
    hadith: youtube(
      "13ScRL5nHss",
      "3:07",
      "Urdu/Hindi",
      "Sahih Bukhari Hadees No.1521-1525 | Hadees in Urdu/Hindi | Bukhari Shareef",
      { note: "Same recording as Day 3 Hadith. The title states the range 1521–1525." },
    ),
  },
  6: {
    doctor: youtube(
      "5ybxy5ht7Rw",
      "6:13",
      "Urdu/Hindi",
      "Makkah Ki Garmi Skin Ko Kaise Jalati Hai? Hujjaj Yeh Video Zaroor Dekhein! | Dr. Tayyab Qazi",
    ),
    quran: youtube(
      "rdStEdqDzZM",
      "0:52",
      "Arabic recitation",
      "Surah At-Tawbah | Verse 36 | @alafasy",
    ),
    expert: youtube(
      "IHM57-2FnKw",
      "17:28",
      "English",
      "The Important Acts & Deeds to be Done during the First 10 Days of Dhul Hijjah – Dr Zakir Naik",
    ),
    lesson: youtube(
      "j_scRjYGw5A",
      "1:28",
      "Urdu",
      "What to do in first ten days of Dhul Hijjah?",
    ),
  },
  7: {
    doctor: youtube(
      "draMW7EzROA",
      "3:23",
      "Urdu/Hindi",
      "Essential Medicines You MUST Carry for Hajj 2025! | Stay Safe and Healthy | Dr. Tayyab Qazi",
    ),
    quran: youtube(
      "RhvpagEVk6U",
      "12:34",
      "Arabic recitation",
      "Tilawat Surah An-Nahl 16 to 50 | 14. Rubama By Muhammad Waseem Siddiqui",
      { note: "The title is a range, 16 to 50, and the clip is long for one slot." },
    ),
    hadith: youtube(
      "3bkQJmk6omE",
      "0:41",
      "Not confirmed from title",
      "Jami at-Tirmidhi, Hadith: 889, The Book on Hajj",
    ),
    lesson: youtube(
      "elamvWTA1iI",
      "14:36",
      "Hindi",
      "अगर आप Hajj करने जा रहे हैं तो जान लें सभी अरकान और सही तरीका। How to perform Hajj?",
    ),
  },
};

interface DailyTopic {
  short: string;
  title_hi: string;
  title_en: string;
  title_ur: string;
  arabic: string | null;
  icon: TopicIcon;
  source: DaySource;
}

const DAILY: Record<number, DailyTopic> = {
  1: {
    short: "Niyyat",
    title_hi: "नीयत: हज इबादत है, सैर नहीं",
    title_en: "Niyyah: Hajj is worship, not a trip",
    title_ur: "نیت: حج عبادت ہے، سیر نہیں",
    arabic: "النية",
    icon: "niyyat",
    source: "classroom-release",
  },
  2: {
    short: "Ihram",
    title_hi: "एहराम: अल्लाह के मेहमान का लिबास",
    title_en: "Ihram: the garment of Allah's guest",
    title_ur: "احرام: اللہ کے مہمان کا لباس",
    arabic: null,
    icon: "ihram",
    source: "video-shortlist",
  },
  3: {
    short: "Miqat",
    title_hi: "मीक़ात: वो सरहद जहाँ से एहराम ज़रूरी",
    title_en: "Miqat: the boundary where Ihram is required",
    title_ur: "میقات: وہ سرحد جہاں سے احرام ضروری ہے",
    arabic: null,
    icon: "miqat",
    source: "video-shortlist",
  },
  4: {
    short: "Paanchva Sutoon",
    title_hi: "हज: इस्लाम का पाँचवाँ सुतून",
    title_en: "Hajj: the fifth pillar of Islam",
    title_ur: "حج: اسلام کا پانچواں ستون",
    arabic: null,
    icon: "pillar",
    source: "video-shortlist",
  },
  5: {
    short: "Hajj ka Inaam",
    title_hi: "हज का इनाम: जैसे आज पैदा हुए",
    title_en: "The reward of Hajj: like one newly born",
    title_ur: "حج کا انعام: جیسے آج پیدا ہوئے",
    arabic: null,
    icon: "reward",
    source: "video-shortlist",
  },
  6: {
    short: "Zil Hijjah",
    title_hi: "ज़िलहिज्जा: बरकत वाले दस दिन",
    title_en: "Dhul Hijjah: the ten blessed days",
    title_ur: "ذوالحجہ: برکت والے دس دن",
    arabic: null,
    icon: "dhulhijjah",
    source: "video-shortlist",
  },
  7: {
    short: "Farz, Wajib, Sunnat",
    title_hi: "फ़र्ज़, वाजिब, सुन्नत: फ़र्क़ समझें",
    title_en: "Farz, wajib, sunnat: understand the difference",
    title_ur: "فرض، واجب، سنت: فرق سمجھیں",
    arabic: null,
    icon: "rites",
    source: "video-shortlist",
  },
};

function dayOneFromClassroom(): Partial<Record<SectionKey, SectionMedia>> {
  const lesson = CLASSROOM_CLASSES.find((item) => item.day === 1);
  const arkan = CLASSROOM_SIDE_VIDEOS.find((item) => item.day === 1 && item.key === "arkan");
  const doctor = CLASSROOM_SIDE_VIDEOS.find((item) => item.day === 1 && item.key === "doctor-corner");
  const picked = { ...SHORTLIST[1] };
  if (doctor?.youtube_id) {
    picked.doctor = youtube(
      doctor.youtube_id,
      "7:27",
      "English",
      "DOCTOR'S ADVICE TO ALL HAJIS | HAJJ 2026 | @drfaisalsays",
    );
  }
  if (arkan?.youtube_id) {
    picked.lesson = youtube(
      arkan.youtube_id,
      "10:00",
      null,
      arkan.caption || arkan.title_en,
      {
        startSeconds: arkan.start_seconds,
        endSeconds: arkan.end_seconds,
        note: lesson?.label_hi
          ? `Recorded 1-minute class bhi maujood hai (${lesson.label_hi}). Is slot par classroom ka Arkan clip hai.`
          : undefined,
      },
    );
  }
  return picked;
}

function buildDay(day: number): ClassroomDayContent {
  const week = weekFor(day);
  const daily = DAILY[day];
  const sections = blankSections();
  const picks = day === 1 ? dayOneFromClassroom() : SHORTLIST[day];
  if (picks) {
    for (const key of SECTION_ORDER) {
      const media = picks[key];
      if (media) sections[key] = media;
    }
  }
  if (daily) {
    return {
      day,
      short: daily.short,
      title_hi: daily.title_hi,
      title_en: daily.title_en,
      title_ur: daily.title_ur,
      arabic: daily.arabic,
      icon: daily.icon,
      source: daily.source,
      week_hi: week.hi,
      sections,
    };
  }
  return {
    day,
    short: week.hi,
    title_hi: `${week.hi} — ${week.detail_hi}`,
    title_en: week.en,
    title_ur: week.ur,
    arabic: null,
    icon: week.icon,
    source: "homepage-week",
    week_hi: week.hi,
    sections,
  };
}

export const CLASSROOM_DAYS: ClassroomDayContent[] = Array.from({ length: 100 }, (_, index) => buildDay(index + 1));

export function classroomDay(day: number): ClassroomDayContent | null {
  return CLASSROOM_DAYS.find((item) => item.day === day) ?? null;
}

export function sectionReady(media: SectionMedia | null): boolean {
  if (!media) return false;
  if (media.kind === "youtube") return Boolean(media.youtubeId);
  if (media.kind === "file") return Boolean(media.fileSrc);
  return media.kind === "quiz";
}

export function readySectionCount(day: ClassroomDayContent): number {
  return SECTION_ORDER.filter((key) => sectionReady(day.sections[key])).length;
}

export function comingSoonKeys(day: ClassroomDayContent): SectionKey[] {
  return SECTION_ORDER.filter((key) => !sectionReady(day.sections[key]));
}

export type ListenLanguage = "en" | "hi" | "ur" | "ar" | "ta" | "te" | "mr" | "bn" | "or" | "ml" | "pa" | "tr" | "ru";

/** Text we can actually speak. Other languages have no script for this catalogue. */
export function spokenTopic(day: ClassroomDayContent, language: string): string | null {
  if (language === "hi") return day.title_hi;
  if (language === "en") return day.title_en;
  if (language === "ur") return day.title_ur;
  return null;
}

export function displayTopic(day: ClassroomDayContent, language: string): string {
  return spokenTopic(day, language) || day.title_hi;
}

/**
 * Saiful's examples name Day 2 and Day 3 differently from both files on hand.
 * The preview does not invent a third list. It keeps the shortlist for days 1–7
 * and the homepage weeks after that.
 */
export const TOPIC_DISCREPANCY = {
  specDay2: "Hajj ki Ahmiyat aur Fazilat",
  specDay3: "Hajj kya hai?",
  releaseFile: "src/data/classroomRelease.js titles only day 1. Days 2–100 are Day N.",
  homepageDay2: "Week 1 (days 1–7) is नीयत और बुनियाद. Ihram is week 3, days 15–21, not day 2.",
  homepageDay3: "हज क्या है is week 2, days 8–14, not day 3. Week 2's arkan line is हज की फ़ज़ीलत.",
  previewDay2: DAILY[2].title_hi,
  previewDay3: DAILY[3].title_hi,
  previewSource: "Days 2–7 topics come from the video shortlist. Days 8–100 use the homepage week theme, shared inside each week because the file has no daily title.",
} as const;
