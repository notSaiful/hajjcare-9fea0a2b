/**
 * Recorded HajCare AI Classroom catalogue.
 * Seeded only with recordings and pages that already exist on the site.
 * VITE_HAJCARE_WHATSAPP_NUMBER (digits only) overrides the default number.
 */

export interface ClassroomMaterial {
  label_hi: string;
  label_en: string;
  url: string;
}

export interface ClassroomTeacher {
  name_hi: string;
  name_en: string;
  title_hi: string;
  title_en: string;
  photo_url?: string;
}

export interface ClassroomClass {
  day: number;
  title_hi: string;
  title_en: string;
  /** YouTube video id for an unlisted recording. Null when the recording is a local file. */
  youtube_id: string | null;
  /** Existing site file. Used when youtube_id is empty. */
  local_video_16x9?: string;
  local_video_9x16?: string;
  /** Short label shown on the player, such as the 1-minute class. */
  label_hi?: string;
  label_en?: string;
  /** Null means no teacher is assigned. The page shows the HajCare AI team. */
  teacher: ClassroomTeacher | null;
  materials: ClassroomMaterial[];
  published: boolean;
  note_hi?: string;
  note_en?: string;
}

/** Digits only, country code included, no plus and no spaces. */
export const HAJCARE_WHATSAPP_NUMBER_DEFAULT = "917588113830";

export const CLASSROOM_CLASSES: ClassroomClass[] = [
  {
    day: 1,
    title_hi: "नीयत: हज इबादत है, सैर नहीं",
    title_en: "Niyyah: Hajj is worship, not a trip",
    youtube_id: "J76Dtc0MePA",
    local_video_16x9: "/videos/day1-1min-16x9.mp4",
    local_video_9x16: "/videos/day1-1min-9x16.mp4",
    label_hi: "दिन 1 — 1 मिनट क्लास",
    label_en: "Day 1 — 1 minute class",
    teacher: null,
    published: true,
    note_hi: "1 मिनट की कक्षा। आख़िर में नात का कार्ड: हाजियो तुम हरम जा रहे हो — नात की रिकॉर्डिंग जल्द।",
    note_en: "1-minute class. It ends on a silent naat card: the recording is coming soon.",
    materials: [
      {
        label_hi: "दिन 1 अध्ययन पत्र",
        label_en: "Day 1 study sheet",
        url: "/explore#day-1",
      },
      {
        label_hi: "ट्रेलर वीडियो (चौड़ा)",
        label_en: "Trailer video (widescreen)",
        url: "/videos/day1-trailer-16x9.mp4",
      },
      {
        label_hi: "ट्रेलर वीडियो (मोबाइल)",
        label_en: "Trailer video (phone)",
        url: "/videos/day1-trailer-9x16.mp4",
      },
    ],
  },
];

/**
 * Extra players for one class day. Not recorded classes: they stay out of
 * the class list, materials, teacher box, and WhatsApp box.
 */
export interface ClassroomSideVideo {
  key: string;
  day: number;
  title_hi: string;
  title_en: string;
  youtube_id: string;
}

/** Day 1 Quran text plus one Hadith player. Not a recorded class. */
export interface ClassroomScripture {
  key: string;
  day: number;
  title_hi: string;
  title_en: string;
  reference: string;
  arabic: string;
  hindi: string;
  english: string;
  hadith_label: string;
  hadith_youtube_id: string;
}

export const CLASSROOM_SCRIPTURE: ClassroomScripture[] = [
  {
    key: "quran-hadith",
    day: 1,
    title_hi: "क़ुरआन और हदीस",
    title_en: "Quran & Hadith",
    reference: "Surah Al-Bayyinah 98:5 / सूरह अल-बय्यिना 98:5",
    arabic:
      "وَمَآ أُمِرُوٓا۟ إِلَّا لِيَعْبُدُوا۟ ٱللَّهَ مُخْلِصِينَ لَهُ ٱلدِّينَ حُنَفَآءَ وَيُقِيمُوا۟ ٱلصَّلَوٰةَ وَيُؤْتُوا۟ ٱلزَّكَوٰةَ ۚ وَذَٰلِكَ دِينُ ٱلْقَيِّمَةِ",
    hindi:
      "और उन्हें आदेश भी बस यही दिया गया था कि वे अल्लाह की बन्दगी करें, निष्ठा एवं विनयशीलता को उसके लिए विशिष्ट करके, बिलकुल एकाग्र होकर, और नमाज़ की पाबन्दी करें और ज़कात दें। और यही है सत्यवादी समुदाय का धर्म।",
    english:
      "And they were not commanded except to worship Allah, [being] sincere to Him in religion, inclining to truth, and to establish prayer and to give zakah. And that is the correct religion.",
    hadith_label: "इन्नमल अअमालु बिन्निय्यात / Actions are judged by intentions (Sahih al-Bukhari 1)",
    hadith_youtube_id: "jpGJemWoVHI",
  },
];

export const CLASSROOM_SIDE_VIDEOS: ClassroomSideVideo[] = [
  {
    key: "doctor-corner",
    day: 1,
    title_hi: "डॉक्टर कॉर्नर",
    title_en: "Doctor Corner",
    youtube_id: "yCu43qBV0RY",
  },
  {
    key: "arkan",
    day: 1,
    title_hi: "अरकान",
    title_en: "Arkan",
    youtube_id: "C5gHbAgfrVo",
  },
  {
    key: "dua",
    day: 1,
    title_hi: "सफ़र की दुआ",
    title_en: "Safar ki Dua",
    youtube_id: "hRlmshVxs1w",
  },
];

/** Static Day 1 quiz. No scores are stored. */
export interface ClassroomQuizQuestion {
  prompt: string;
  options: readonly [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
}

export interface ClassroomQuiz {
  day: number;
  title_hi: string;
  title_en: string;
  seconds: number;
  questions: readonly ClassroomQuizQuestion[];
}

export const CLASSROOM_QUIZ: ClassroomQuiz = {
  day: 1,
  title_hi: "दिन 1 क्विज़",
  title_en: "Day 1 Quiz",
  seconds: 180,
  questions: [
    {
      prompt: "नियत का असल मक़ाम क्या है?",
      options: ["ज़ुबान", "दिल", "काग़ज़ पर लिखना", "लोगों को बताना"],
      correct: 1,
    },
    {
      prompt: '"इन्नमल आमालु बिन्नियात" का मतलब क्या है?',
      options: ["अमलों का दारोमदार नियतों पर है", "सफ़र में दुआ पढ़ो", "इल्म हासिल करो", "सब्र करो"],
      correct: 0,
    },
    {
      prompt: "यह हदीस किस किताब की पहली हदीस है?",
      options: ["सहीह बुख़ारी", "सहीह मुस्लिम", "जामे तिरमिज़ी", "सुनन अबू दाऊद"],
      correct: 0,
    },
    {
      prompt: "इस हदीस के रावी कौन हैं?",
      options: [
        "हज़रत अबू बक्र (रज़ि.)",
        "हज़रत उमर बिन ख़त्ताब (रज़ि.)",
        "हज़रत अबू हुरैरा (रज़ि.)",
        "हज़रत अली (रज़ि.)",
      ],
      correct: 1,
    },
    {
      prompt: "सूरह अल-बय्यिना 98:5 के मुताबिक़ लोगों को क्या हुक्म दिया गया?",
      options: [
        "सिर्फ़ सफ़र करना",
        "दीन को अल्लाह के लिए ख़ालिस करके उसी की इबादत करना",
        "दिखावे के लिए अमल करना",
        "सिर्फ़ किताबें पढ़ना",
      ],
      correct: 1,
    },
    {
      prompt: "98:5 में इबादत के साथ किन दो अमल का ज़िक्र है?",
      options: ["रोज़ा और हज", "नमाज़ कायम करना और ज़कात देना", "सदक़ा और उमरा", "जिहाद और हिजरत"],
      correct: 1,
    },
    {
      prompt: "सफ़र की दुआ कब पढ़ी जाती है?",
      options: ["सफ़र ख़त्म होने के हफ़्ते बाद", "सवारी पर सवार होते वक़्त", "सिर्फ़ मक्का पहुँचकर", "सिर्फ़ रात में"],
      correct: 1,
    },
    {
      prompt: "सफ़र की दुआ किन अल्फ़ाज़ से शुरू होती है?",
      options: [
        "सुब्हानल्लज़ी सख़्ख़-र लना हाज़ा",
        "अल्हम्दु लिल्लाहि रब्बिल आलमीन",
        "रब्बिज़नी इल्मा",
        "ला इलाह इल्लल्लाह",
      ],
      correct: 0,
    },
    {
      prompt: "हज का सफ़र किस नियत से होना चाहिए?",
      options: ["लोगों में इज़्ज़त के लिए", "ख़रीदारी के लिए", "सिर्फ़ अल्लाह की रज़ा के लिए", "सोशल मीडिया पोस्ट के लिए"],
      correct: 2,
    },
    {
      prompt: 'सफ़र की दुआ "सुब्हानल्लज़ी सख़्ख़-र लना हाज़ा..." किस सूरह की आयत है?',
      options: ["सूरह यासीन", "सूरह अज़-ज़ुख़रुफ़ (43:13)", "सूरह अल-बय्यिना", "सूरह अल-फ़ातिहा"],
      correct: 1,
    },
  ],
};

export function formatQuizClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remain = safe % 60;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

export function quizScore(
  questions: readonly Pick<ClassroomQuizQuestion, "correct">[],
  answers: readonly (number | null)[],
): number {
  return questions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
}

export function publishedClasses(): ClassroomClass[] {
  return CLASSROOM_CLASSES.filter((item) => item.published).sort((a, b) => a.day - b.day);
}

/** Env digits win. An empty or non-numeric env value keeps the classroom default. */
export function resolveWhatsAppDigits(envValue: string | undefined | null): string | null {
  const fromEnv = (envValue ?? "").replace(/\D/g, "");
  if (fromEnv) return fromEnv;
  const fallback = HAJCARE_WHATSAPP_NUMBER_DEFAULT.replace(/\D/g, "");
  return fallback || null;
}

/** +91 75881 13830 for a 12-digit Indian number. Other digit strings get a leading plus. */
export function formatWhatsAppDisplay(digits: string | null): string | null {
  if (!digits) return null;
  if (digits.startsWith("91") && digits.length === 12) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return `+${digits}`;
}

export function classroomQuestionText(item: Pick<ClassroomClass, "day" | "title_en" | "title_hi">): string {
  return `HajCare AI Classroom — Day ${item.day}: ${item.title_en} / ${item.title_hi}\nMy question: `;
}

export function buildClassroomWhatsAppUrl(
  item: Pick<ClassroomClass, "day" | "title_en" | "title_hi">,
  envValue?: string | null,
): string {
  const encoded = encodeURIComponent(classroomQuestionText(item));
  const digits = resolveWhatsAppDigits(envValue);
  if (!digits) return `https://wa.me/?text=${encoded}`;
  return `https://wa.me/${digits}?text=${encoded}`;
}
