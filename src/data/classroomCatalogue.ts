/**
 * Preview catalogue for the 100 Days Hajj Training classroom.
 * One template, one record per day. Titles are Saiful's official
 * "100 दिन की हज ट्रेनिंग" calendar. Days 1–7 keep their existing videos.
 *
 * Proposed admin shape (not applied, no schema change):
 * classroom_days.content jsonb already exists in
 * supabase/migrations/20261119220000_classroom_days.sql.
 * Each row can stay one day and hold this object, edited independently:
 * {
 *   short, title_hi, title_en, title_ur, icon,
 *   sections: { quran|hadith|dua|lesson|doctor|expert|naat|quiz:
 *     { youtubeId, fileSrc, durationLabel, language, citation }
 *     | [ up to 3 of those objects ]
 *     | null }
 * }
 * A single object is still one video. An array is the ordered list, maximum 3.
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

export type DaySource = "official-calendar";

export const MAX_SECTION_VIDEOS = 3;

/** One clip, or up to three ordered clips. Null means the section is empty. */
export type SectionSlot = SectionMedia | readonly SectionMedia[] | null;

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
  /** Block name from the official calendar overview. */
  block_hi: string;
  sections: Record<SectionKey, SectionSlot>;
}

/** Block names from the official calendar overview. Wrapped PDF lines are joined. */
export const CALENDAR_BLOCKS = [
  { from: 1, to: 10, hi: "नींव और नीयत" },
  { from: 11, to: 20, hi: "दिल और घर की तैयारी" },
  { from: 21, to: 30, hi: "सफ़र का सामान: कागज़, सेहत, पैकिंग, पैसा" },
  { from: 31, to: 40, hi: "सफ़र, एहराम और मक्का में आमद" },
  { from: 41, to: 50, hi: "उमरा क़दम-ब-क़दम" },
  { from: 51, to: 60, hi: "हज के दिन (1): 8 से 10 ज़िलहिज्जा" },
  { from: 61, to: 70, hi: "हज के दिन (2): 10 से 13 ज़िलहिज्जा" },
  { from: 71, to: 80, hi: "मदीना मुनव्वरा: ज़ियारत और अदब" },
  { from: 81, to: 90, hi: "हिफ़ाज़त, सेहत, ख़वातीन और आम ग़लतियाँ" },
  { from: 91, to: 100, hi: "जुमा, वापसी और हज के बाद की ज़िंदगी" },
] as const;

export function blockFor(day: number): (typeof CALENDAR_BLOCKS)[number] {
  const band = CALENDAR_BLOCKS.find((item) => day >= item.from && day <= item.to);
  if (!band) throw new Error(`No calendar block for day ${day}`);
  return band;
}

function blankSections(): Record<SectionKey, SectionSlot> {
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
const SHORTLIST: Record<number, Partial<Record<SectionKey, SectionMedia | SectionMedia[]>>> = {
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
    doctor: [
      youtube("sVXL2MnB-nQ", "7:25", "English", "Prickly Heat - British Hajj Delegation"),
      youtube("Eb--MldbiZk", null, null, "Lanacane gel short — Mufti Abdur-Rahman ibn Yusuf Mangera"),
    ],
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

/** Hindi titles are copied from the official 100-day calendar. */
const OFFICIAL_DAYS: DailyTopic[] = [
  {
    short: "Niyyat",
    title_hi: "नीयत: हज इबादत है, सैर नहीं",
    title_en: "Niyyah: Hajj is worship, not a trip",
    title_ur: "نیت: حج عبادت ہے، سیر نہیں",
    arabic: "النية",
    icon: "niyyat",
    source: "official-calendar",
  },
  {
    short: "Ihram",
    title_hi: "एहराम: अल्लाह के मेहमान का लिबास",
    title_en: "Ihram: the garment of Allah's guest",
    title_ur: "احرام: اللہ کے مہمان کا لباس",
    arabic: null,
    icon: "ihram",
    source: "official-calendar",
  },
  {
    short: "Miqat",
    title_hi: "मीक़ात: वो सरहद जहाँ से एहराम ज़रूरी",
    title_en: "Miqat: the boundary where Ihram is required",
    title_ur: "میقات: وہ سرحد جہاں سے احرام ضروری",
    arabic: null,
    icon: "miqat",
    source: "official-calendar",
  },
  {
    short: "Paanchva Sutoon",
    title_hi: "हज: इस्लाम का पाँचवाँ सुतून",
    title_en: "Hajj: the fifth pillar of Islam",
    title_ur: "حج: اسلام کا پانچواں ستون",
    arabic: null,
    icon: "pillar",
    source: "official-calendar",
  },
  {
    short: "Hajj ka Inaam",
    title_hi: "हज का इनाम: जैसे आज पैदा हुए",
    title_en: "The reward of Hajj: like one newly born",
    title_ur: "حج کا انعام: جیسے آج پیدا ہوئے",
    arabic: null,
    icon: "reward",
    source: "official-calendar",
  },
  {
    short: "Zil Hijjah",
    title_hi: "ज़िलहिज्जा: बरकत वाले दस दिन",
    title_en: "Dhul Hijjah: the ten blessed days",
    title_ur: "ذوالحجہ: برکت والے دس دن",
    arabic: null,
    icon: "dhulhijjah",
    source: "official-calendar",
  },
  {
    short: "Farz, Wajib, Sunnat",
    title_hi: "फ़र्ज़, वाजिब, सुन्नत: फ़र्क़ समझें",
    title_en: "Farz, wajib, sunnat: understand the difference",
    title_ur: "فرض، واجب، سنت: فرق سمجھیں",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Teen Tareeqe",
    title_hi: "हज के तीन तरीक़े: तमत्तो, क़िरान, इफ़राद",
    title_en: "The three ways of Hajj: Tamattu, Qiran, Ifrad",
    title_ur: "حج کے تین طریقے: تمتع، قران، افراد",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Ibrahim ka Gharana",
    title_hi: "इब्राहीम (अ.) का घराना और काबा",
    title_en: "Ibrahim's family and the Kaaba",
    title_ur: "ابراہیم (ع) کا گھرانا اور کعبہ",
    arabic: null,
    icon: "pillar",
    source: "official-calendar",
  },
  {
    short: "Hajj-e-Mabroor",
    title_hi: "हज-ए-मबरूर: क़बूल हज की पहचान",
    title_en: "Hajj Mabroor: the sign of an accepted Hajj",
    title_ur: "حج مبرور: قبول حج کی پہچان",
    arabic: null,
    icon: "reward",
    source: "official-calendar",
  },
  {
    short: "Tauba",
    title_hi: "तौबा: ज़िंदगी का नया पन्ना",
    title_en: "Tauba: a new page of life",
    title_ur: "توبہ: زندگی کا نیا صفحہ",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Huqooq-ul-Ibaad",
    title_hi: "लोगों के हक़: हुक़ूक़ुल इबाद",
    title_en: "People's rights: Huqooq-ul-Ibad",
    title_ur: "لوگوں کے حق: حقوق العباد",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Qarz aur Amanat",
    title_hi: "क़र्ज़ और अमानत: हिसाब साफ़",
    title_en: "Debts and trusts: a clear account",
    title_ur: "قرض اور امانت: حساب صاف",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Wasiyat",
    title_hi: "वसीयत: घरवालों के लिए आसानी",
    title_en: "A will: ease for the family",
    title_ur: "وصیت: گھر والوں کے لیے آسانی",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Gharwalon ke Haq",
    title_hi: "घरवालों के हक़: पीछे कौन संभालेगा?",
    title_en: "The family's rights: who will look after them?",
    title_ur: "گھر والوں کے حق: پیچھے کون سنبھالے گا؟",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Maa-Baap",
    title_hi: "माँ-बाप: दुआ और ख़िदमत",
    title_en: "Parents: dua and service",
    title_ur: "ماں باپ: دعا اور خدمت",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Halal Kamai",
    title_hi: "हलाल कमाई से हज",
    title_en: "Hajj from halal earnings",
    title_ur: "حلال کمائی سے حج",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Wuzu",
    title_hi: "वुज़ू सीखें: पाकी की चाबी",
    title_en: "Learn wudu: the key to purity",
    title_ur: "وضو سیکھیں: پاکی کی چابی",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Namaz",
    title_hi: "नमाज़: हज की जान",
    title_en: "Salah: the life of Hajj",
    title_ur: "نماز: حج کی جان",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Zaroori Duaein",
    title_hi: "ज़रूरी दुआएँ और क़ुरआन",
    title_en: "Essential duas and Quran",
    title_ur: "ضروری دعائیں اور قرآن",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "Dastavez",
    title_hi: "दस्तावेज़: पासपोर्ट से वीज़ा तक",
    title_en: "Documents: from passport to visa",
    title_ur: "دستاویز: پاسپورٹ سے ویزا تک",
    arabic: null,
    icon: "departure",
    source: "official-calendar",
  },
  {
    short: "Sehat Jaanch",
    title_hi: "सेहत जाँच, दवा और टीके",
    title_en: "Health check, medicine, and vaccines",
    title_ur: "صحت کی جانچ، دوا اور ٹیکے",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Paidali",
    title_hi: "पैदल चलने की आदत",
    title_en: "The habit of walking",
    title_ur: "پیدل چلنے کی عادت",
    arabic: null,
    icon: "sai",
    source: "official-calendar",
  },
  {
    short: "Packing",
    title_hi: "पैकिंग: कम सामान, ज़रूरी सामान",
    title_en: "Packing: less luggage, the necessary things",
    title_ur: "پیکنگ: کم سامان، ضروری سامان",
    arabic: null,
    icon: "departure",
    source: "official-calendar",
  },
  {
    short: "Paisa aur Kharch",
    title_hi: "पैसा और ख़र्च: बीच का रास्ता",
    title_en: "Money and spending: the middle way",
    title_ur: "پیسہ اور خرچ: بیچ کا راستہ",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Group aur Sukoon",
    title_hi: "ग्रुप और Sukoon फ़ैमिली कनेक्शन",
    title_en: "The group and the Sukoon family connection",
    title_ur: "گروپ اور Sukoon فیملی کنکشن",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Safar ke Saathi",
    title_hi: "सफ़र के साथी: ग़ुस्सा नहीं, सब्र",
    title_en: "Travel companions: patience, not anger",
    title_ur: "سفر کے ساتھی: غصہ نہیں، صبر",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Sabr",
    title_hi: "सब्र: सबसे बड़ा सामान",
    title_en: "Sabr: the greatest provision",
    title_ur: "صبر: سب سے بڑا سامان",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Tawakkul",
    title_hi: "तवक्कुल: कोशिश भी, भरोसा भी",
    title_en: "Tawakkul: effort, and trust",
    title_ur: "توکل: کوشش بھی، بھروسا بھی",
    arabic: null,
    icon: "niyyat",
    source: "official-calendar",
  },
  {
    short: "Rawangi",
    title_hi: "घर से रवानगी: बिस्मिल्लाह",
    title_en: "Leaving home: Bismillah",
    title_ur: "گھر سے روانگی: بسم اللہ",
    arabic: null,
    icon: "departure",
    source: "official-calendar",
  },
  {
    short: "Safar ki Dua",
    title_hi: "सफ़र की दुआ",
    title_en: "The dua of travel",
    title_ur: "سفر کی دعا",
    arabic: null,
    icon: "niyyat",
    source: "official-calendar",
  },
  {
    short: "Hawaai Adda",
    title_hi: "हवाई अड्डा: आसानी और सब्र",
    title_en: "The airport: ease and patience",
    title_ur: "ہوائی اڈہ: آسانی اور صبر",
    arabic: null,
    icon: "departure",
    source: "official-calendar",
  },
  {
    short: "Qasr",
    title_hi: "सफ़र की नमाज़: क़स्र",
    title_en: "The prayer of travel: qasr",
    title_ur: "سفر کی نماز: قصر",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Ihram Baandhna",
    title_hi: "एहराम बाँधने का तरीक़ा",
    title_en: "How to put on Ihram",
    title_ur: "احرام باندھنے کا طریقہ",
    arabic: null,
    icon: "ihram",
    source: "official-calendar",
  },
  {
    short: "Talbiyah",
    title_hi: "तलबिया: लब्बैक अल्लाहुम्मा लब्बैक",
    title_en: "Talbiyah: Labbayk Allahumma labbayk",
    title_ur: "تلبیہ: لبیک اللہم لبیک",
    arabic: null,
    icon: "niyyat",
    source: "official-calendar",
  },
  {
    short: "Ihram ki Pabandiyan",
    title_hi: "एहराम की पाबंदियाँ",
    title_en: "The restrictions of Ihram",
    title_ur: "احرام کی پابندیاں",
    arabic: null,
    icon: "ihram",
    source: "official-calendar",
  },
  {
    short: "Fidya aur Dam",
    title_hi: "ग़लती हो जाए तो? फ़िदया और दम",
    title_en: "If a mistake happens: fidya and dam",
    title_ur: "غلطی ہو جائے تو؟ فدیہ اور دم",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Makkah ki Pehli Raat",
    title_hi: "मक्का में पहली रात",
    title_en: "The first night in Makkah",
    title_ur: "مکہ میں پہلی رات",
    arabic: null,
    icon: "umrah",
    source: "official-calendar",
  },
  {
    short: "Haram ki Hurmat",
    title_hi: "हरम की हुरमत",
    title_en: "The sanctity of the Haram",
    title_ur: "حرم کی حرمت",
    arabic: null,
    icon: "umrah",
    source: "official-calendar",
  },
  {
    short: "Kaaba par Pehli Nazar",
    title_hi: "काबा पर पहली नज़र",
    title_en: "The first sight of the Kaaba",
    title_ur: "کعبہ پر پہلی نظر",
    arabic: null,
    icon: "pillar",
    source: "official-calendar",
  },
  {
    short: "Umrah",
    title_hi: "उमरा: चार काम, एक इबादत",
    title_en: "Umrah: four acts, one worship",
    title_ur: "عمرہ: چار کام، ایک عبادت",
    arabic: null,
    icon: "umrah",
    source: "official-calendar",
  },
  {
    short: "Masjid-ul-Haram",
    title_hi: "मस्जिदुल हराम में दाख़िला",
    title_en: "Entering Masjid al-Haram",
    title_ur: "مسجد الحرام میں داخلہ",
    arabic: null,
    icon: "umrah",
    source: "official-calendar",
  },
  {
    short: "Hajr-e-Aswad",
    title_hi: "तवाफ़ की शुरुआत: हजरे अस्वद",
    title_en: "Starting Tawaf: Hajr al-Aswad",
    title_ur: "طواف کی شروعات: حجر اسود",
    arabic: null,
    icon: "tawaf",
    source: "official-calendar",
  },
  {
    short: "Saat Chakkar",
    title_hi: "सात चक्कर: रमल और इज़्तिबा",
    title_en: "Seven rounds: ramal and idtiba",
    title_ur: "سات چکر: رمل اور اضطباع",
    arabic: null,
    icon: "tawaf",
    source: "official-calendar",
  },
  {
    short: "Rukn-e-Yamani",
    title_hi: "रुक्ने यमानी और 'रब्बना आतिना'",
    title_en: "Rukn Yamani and Rabbana atina",
    title_ur: "رکن یمانی اور ربنا آتنا",
    arabic: null,
    icon: "tawaf",
    source: "official-calendar",
  },
  {
    short: "Maqam-e-Ibrahim",
    title_hi: "मक़ामे इब्राहीम पर दो रकअत",
    title_en: "Two rak'ahs at Maqam Ibrahim",
    title_ur: "مقام ابراہیم پر دو رکعت",
    arabic: null,
    icon: "pillar",
    source: "official-calendar",
  },
  {
    short: "Zamzam",
    title_hi: "ज़मज़म: बरकत वाला पानी",
    title_en: "Zamzam: blessed water",
    title_ur: "زمزم: برکت والا پانی",
    arabic: null,
    icon: "reward",
    source: "official-calendar",
  },
  {
    short: "Sa'i",
    title_hi: "सई: सफ़ा से मरवा",
    title_en: "Sa'i: from Safa to Marwah",
    title_ur: "سعی: صفا سے مروہ",
    arabic: null,
    icon: "sai",
    source: "official-calendar",
  },
  {
    short: "Halq ya Qasr",
    title_hi: "हलक़ या क़स्र: उमरा मुकम्मल",
    title_en: "Halq or qasr: Umrah complete",
    title_ur: "حلق یا قصر: عمرہ مکمل",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Waqt ki Qadr",
    title_hi: "मक्का के ख़ाली दिन: वक़्त की क़द्र",
    title_en: "The free days in Makkah: value the time",
    title_ur: "مکہ کے خالی دن: وقت کی قدر",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "Paanch Din",
    title_hi: "हज के पाँच दिन: पूरा नक़्शा",
    title_en: "The five days of Hajj: the full map",
    title_ur: "حج کے پانچ دن: پورا نقشہ",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "8 Zil Hijjah",
    title_hi: "8 ज़िलहिज्जा: मिना की तरफ़",
    title_en: "8 Dhul Hijjah: towards Mina",
    title_ur: "۸ ذوالحجہ: منیٰ کی طرف",
    arabic: null,
    icon: "mina",
    source: "official-calendar",
  },
  {
    short: "Mina ke Kheme",
    title_hi: "मिना के ख़ेमे: भाईचारा",
    title_en: "The tents of Mina: brotherhood",
    title_ur: "منیٰ کے خیمے: بھائی چارہ",
    arabic: null,
    icon: "mina",
    source: "official-calendar",
  },
  {
    short: "Arafah",
    title_hi: "9 ज़िलहिज्जा: अरफ़ा — हज का दिल",
    title_en: "9 Dhul Hijjah: Arafah — the heart of Hajj",
    title_ur: "۹ ذوالحجہ: عرفہ — حج کا دل",
    arabic: null,
    icon: "arafat",
    source: "official-calendar",
  },
  {
    short: "Arafah ki Dua",
    title_hi: "अरफ़ा की दुआ: दिल खोलकर माँगें",
    title_en: "The dua of Arafah: ask with an open heart",
    title_ur: "عرفہ کی دعا: دل کھول کر مانگیں",
    arabic: null,
    icon: "arafat",
    source: "official-calendar",
  },
  {
    short: "Arafah mein Namaz",
    title_hi: "अरफ़ा में नमाज़, ख़ुत्बा और वक़्त",
    title_en: "Prayer, the khutbah, and the time at Arafah",
    title_ur: "عرفہ میں نماز، خطبہ اور وقت",
    arabic: null,
    icon: "arafat",
    source: "official-calendar",
  },
  {
    short: "Muzdalifah",
    title_hi: "मुज़दलिफ़ा: खुले आसमान की रात",
    title_en: "Muzdalifah: a night under the open sky",
    title_ur: "مزدلفہ: کھلے آسمان کی رات",
    arabic: null,
    icon: "muzdalifah",
    source: "official-calendar",
  },
  {
    short: "Kamzoron ki Asaani",
    title_hi: "कमज़ोरों के लिए आसानी",
    title_en: "Ease for those who are weak",
    title_ur: "کمزوروں کے لیے آسانی",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Bada Jamra",
    title_hi: "10 ज़िलहिज्जा: बड़े जमरे की रमी",
    title_en: "10 Dhul Hijjah: stoning the large jamrah",
    title_ur: "۱۰ ذوالحجہ: بڑے جمرہ کی رمی",
    arabic: null,
    icon: "jamarat",
    source: "official-calendar",
  },
  {
    short: "Qurbani",
    title_hi: "क़ुर्बानी: इब्राहीमी सुन्नत",
    title_en: "Qurbani: the sunnah of Ibrahim",
    title_ur: "قربانی: ابراہیمی سنت",
    arabic: null,
    icon: "reward",
    source: "official-calendar",
  },
  {
    short: "Halq",
    title_hi: "हलक़ और एहराम खुलना",
    title_en: "Halq, and leaving Ihram",
    title_ur: "حلق اور احرام کھلنا",
    arabic: null,
    icon: "ihram",
    source: "official-calendar",
  },
  {
    short: "10 Tareekh ki Tarteeb",
    title_hi: "10 तारीख़ की तरतीब: घबराना नहीं",
    title_en: "The order of the 10th: do not panic",
    title_ur: "۱۰ تاریخ کی ترتیب: گھبرانا نہیں",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "Tawaf-e-Ziyarat",
    title_hi: "तवाफ़-ए-ज़ियारत: हज का फ़र्ज़ तवाफ़",
    title_en: "Tawaf al-Ziyarah: the obligatory Tawaf of Hajj",
    title_ur: "طواف زیارت: حج کا فرض طواف",
    arabic: null,
    icon: "tawaf",
    source: "official-calendar",
  },
  {
    short: "Hajj ki Sa'i",
    title_hi: "हज की सई",
    title_en: "The Sa'i of Hajj",
    title_ur: "حج کی سعی",
    arabic: null,
    icon: "sai",
    source: "official-calendar",
  },
  {
    short: "Ayyam-e-Tashreeq",
    title_hi: "अय्यामे तशरीक़: मिना की रातें",
    title_en: "The days of Tashreeq: nights in Mina",
    title_ur: "ایام تشریق: منیٰ کی راتیں",
    arabic: null,
    icon: "mina",
    source: "official-calendar",
  },
  {
    short: "Teenon Jamrat",
    title_hi: "तीनों जमरात की रमी",
    title_en: "Stoning the three jamrat",
    title_ur: "تینوں جمرات کی رمی",
    arabic: null,
    icon: "jamarat",
    source: "official-calendar",
  },
  {
    short: "Rami mein Hifazat",
    title_hi: "रमी में हिफ़ाज़त",
    title_en: "Safety during the stoning",
    title_ur: "رمی میں حفاظت",
    arabic: null,
    icon: "jamarat",
    source: "official-calendar",
  },
  {
    short: "Zikr ke Din",
    title_hi: "ज़िक्र के दिन",
    title_en: "The days of dhikr",
    title_ur: "ذکر کے دن",
    arabic: null,
    icon: "niyyat",
    source: "official-calendar",
  },
  {
    short: "Tawaf-e-Wida",
    title_hi: "तवाफ़-ए-विदा: अलविदा काबा",
    title_en: "Tawaf al-Wada: farewell to the Kaaba",
    title_ur: "طواف وداع: الوداع کعبہ",
    arabic: null,
    icon: "wida",
    source: "official-calendar",
  },
  {
    short: "Poora Revision",
    title_hi: "हज का पूरा रिवीज़न",
    title_en: "A full revision of Hajj",
    title_ur: "حج کا پورا ریویژن",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "Madinah",
    title_hi: "मदीना: मोहब्बत का शहर",
    title_en: "Madinah: the city of love",
    title_ur: "مدینہ: محبت کا شہر",
    arabic: null,
    icon: "madinah",
    source: "official-calendar",
  },
  {
    short: "Masjid-e-Nabawi",
    title_hi: "मस्जिद-ए-नबवी",
    title_en: "Masjid an-Nabawi",
    title_ur: "مسجد نبوی",
    arabic: null,
    icon: "madinah",
    source: "official-calendar",
  },
  {
    short: "Riyaz-ul-Jannah",
    title_hi: "रियाज़ुल जन्नह",
    title_en: "Riyad al-Jannah",
    title_ur: "ریاض الجنہ",
    arabic: null,
    icon: "madinah",
    source: "official-calendar",
  },
  {
    short: "Salam ka Adab",
    title_hi: "सलाम का अदब",
    title_en: "The adab of sending salam",
    title_ur: "سلام کا ادب",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Durood Sharif",
    title_hi: "दुरूद शरीफ़",
    title_en: "Durood Sharif",
    title_ur: "درود شریف",
    arabic: null,
    icon: "niyyat",
    source: "official-calendar",
  },
  {
    short: "Masjid-e-Quba",
    title_hi: "मस्जिद-ए-क़ुबा",
    title_en: "Masjid Quba",
    title_ur: "مسجد قباء",
    arabic: null,
    icon: "madinah",
    source: "official-calendar",
  },
  {
    short: "Uhud",
    title_hi: "उहुद: शहीदों की याद",
    title_en: "Uhud: remembering the martyrs",
    title_ur: "احد: شہیدوں کی یاد",
    arabic: null,
    icon: "madinah",
    source: "official-calendar",
  },
  {
    short: "Jannat-ul-Baqi",
    title_hi: "जन्नतुल बक़ी और क़ब्रों की ज़ियारत",
    title_en: "Jannat al-Baqi and visiting the graves",
    title_ur: "جنت البقیع اور قبروں کی زیارت",
    arabic: null,
    icon: "madinah",
    source: "official-calendar",
  },
  {
    short: "Madinah ki Hurmat",
    title_hi: "मदीना की हुरमत और आदाब",
    title_en: "The sanctity and manners of Madinah",
    title_ur: "مدینہ کی حرمت اور آداب",
    arabic: null,
    icon: "madinah",
    source: "official-calendar",
  },
  {
    short: "Madinah se Wida",
    title_hi: "मदीना से विदा",
    title_en: "Farewell to Madinah",
    title_ur: "مدینہ سے وداع",
    arabic: null,
    icon: "wida",
    source: "official-calendar",
  },
  {
    short: "Bheed mein Chalna",
    title_hi: "भीड़ में चलना: धक्का नहीं",
    title_en: "Walking in the crowd: no pushing",
    title_ur: "بھیڑ میں چلنا: دھکا نہیں",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Gum ho jayein",
    title_hi: "गुम हो जाएँ तो? Sukoon फ़ैमिली फ़ीचर",
    title_en: "If you get lost: the Sukoon family feature",
    title_ur: "گم ہو جائیں تو؟ Sukoon فیملی فیچر",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Buzurgon ka Saath",
    title_hi: "बुज़ुर्गों और कमज़ोरों का साथ",
    title_en: "Staying with the elderly and the weak",
    title_ur: "بزرگوں اور کمزوروں کا ساتھ",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Garmi aur Loo",
    title_hi: "गर्मी और लू से बचाव",
    title_en: "Protection from heat and the hot wind",
    title_ur: "گرمی اور لُو سے بچاؤ",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Bimaar ho jayein",
    title_hi: "बीमार हो जाएँ तो?",
    title_en: "If you fall ill",
    title_ur: "بیمار ہو جائیں تو؟",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Khawateen ka Ihram",
    title_hi: "ख़वातीन का एहराम और पर्दा",
    title_en: "Women's Ihram and covering",
    title_ur: "خواتین کا احرام اور پردہ",
    arabic: null,
    icon: "ihram",
    source: "official-calendar",
  },
  {
    short: "Khawateen: Mahwari",
    title_hi: "ख़वातीन: माहवारी और हज",
    title_en: "Women: menses and Hajj",
    title_ur: "خواتین: ماہواری اور حج",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Khawateen: Mehram",
    title_hi: "ख़वातीन: मेहरम और हिफ़ाज़त",
    title_en: "Women: the mahram and protection",
    title_ur: "خواتین: محرم اور حفاظت",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Aam Galtiyan 1",
    title_hi: "आम ग़लतियाँ (1): इबादत के तरीक़े में",
    title_en: "Common mistakes (1): in the way of worship",
    title_ur: "عام غلطیاں (۱): عبادت کے طریقے میں",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "Aam Galtiyan 2",
    title_hi: "आम ग़लतियाँ (2): दिल और बर्ताव में",
    title_en: "Common mistakes (2): in the heart and in conduct",
    title_ur: "عام غلطیاں (۲): دل اور برتاؤ میں",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "Jumma ka Khutba",
    title_hi: "हरमैन में जुमा का ख़ुत्बा",
    title_en: "The Friday khutbah in the two Harams",
    title_ur: "حرمین میں جمعہ کا خطبہ",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Jumma ki Taiyari",
    title_hi: "जुमा की तैयारी",
    title_en: "Preparing for Jumu'ah",
    title_ur: "جمعہ کی تیاری",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Kharidari",
    title_hi: "ख़रीदारी, तोहफ़े और ईमानदारी",
    title_en: "Shopping, gifts, and honesty",
    title_ur: "خریداری، تحفے اور ایمانداری",
    arabic: null,
    icon: "character",
    source: "official-calendar",
  },
  {
    short: "Wapsi ki Dua",
    title_hi: "वापसी की दुआ",
    title_en: "The dua of the return",
    title_ur: "واپسی کی دعا",
    arabic: null,
    icon: "departure",
    source: "official-calendar",
  },
  {
    short: "Ghar Pahunchna",
    title_hi: "घर पहुँचना",
    title_en: "Reaching home",
    title_ur: "گھر پہنچنا",
    arabic: null,
    icon: "departure",
    source: "official-calendar",
  },
  {
    short: "Hajj ke Baad",
    title_hi: "हज के बाद: नया इंसान",
    title_en: "After Hajj: a new person",
    title_ur: "حج کے بعد: نیا انسان",
    arabic: null,
    icon: "reward",
    source: "official-calendar",
  },
  {
    short: "Namaz par Qayam",
    title_hi: "नमाज़ पर क़ायम रहना",
    title_en: "Remaining steadfast in salah",
    title_ur: "نماز پر قائم رہنا",
    arabic: null,
    icon: "rites",
    source: "official-calendar",
  },
  {
    short: "Istiqamat",
    title_hi: "इस्तिक़ामत: डटे रहना",
    title_en: "Istiqamah: staying firm",
    title_ur: "استقامت: ڈٹے رہنا",
    arabic: null,
    icon: "niyyat",
    source: "official-calendar",
  },
  {
    short: "Thoda Amal",
    title_hi: "थोड़ा अमल, हमेशा अमल",
    title_en: "A little worship, and worship that continues",
    title_ur: "تھوڑا عمل، ہمیشہ عمل",
    arabic: null,
    icon: "revision",
    source: "official-calendar",
  },
  {
    short: "Alvida",
    title_hi: "अलविदा: सुकून वाली रूह, चल पड़ें!",
    title_en: "Farewell: a soul at peace, set out",
    title_ur: "الوداع: سکون والی روح، چل پڑیں",
    arabic: null,
    icon: "departure",
    source: "official-calendar",
  }
];

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
  const daily = OFFICIAL_DAYS[day - 1];
  const block = blockFor(day);
  const sections = blankSections();
  const picks = day === 1 ? dayOneFromClassroom() : SHORTLIST[day];
  if (picks) {
    for (const key of SECTION_ORDER) {
      const media = picks[key];
      if (media) sections[key] = media;
    }
  }
  return {
    day,
    short: daily.short,
    title_hi: daily.title_hi,
    title_en: daily.title_en,
    title_ur: daily.title_ur,
    arabic: daily.arabic,
    icon: daily.icon,
    source: daily.source,
    block_hi: block.hi,
    sections,
  };
}

export const CLASSROOM_DAYS: ClassroomDayContent[] = Array.from({ length: 100 }, (_, index) => buildDay(index + 1));

export function classroomDay(day: number): ClassroomDayContent | null {
  return CLASSROOM_DAYS.find((item) => item.day === day) ?? null;
}

export function sectionClips(slot: SectionSlot | undefined): SectionMedia[] {
  if (!slot) return [];
  const list = Array.isArray(slot) ? [...slot] : [slot];
  return list.slice(0, MAX_SECTION_VIDEOS);
}

function clipReady(media: SectionMedia): boolean {
  if (media.kind === "youtube") return Boolean(media.youtubeId);
  if (media.kind === "file") return Boolean(media.fileSrc);
  return media.kind === "quiz";
}

export function sectionReady(slot: SectionSlot | undefined): boolean {
  return sectionClips(slot).some(clipReady);
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
 * The official 100-day calendar is the topic list.
 * Earlier spec examples and the homepage week themes are not used.
 */
export const OFFICIAL_CALENDAR = {
  source: "100 दिन की हज ट्रेनिंग",
  day2: OFFICIAL_DAYS[1].title_hi,
  day3: OFFICIAL_DAYS[2].title_hi,
  day54: OFFICIAL_DAYS[53].title_hi,
} as const;
