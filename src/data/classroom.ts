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
    youtube_id: null,
    local_video_16x9: "/videos/day1-trailer-16x9.mp4",
    local_video_9x16: "/videos/day1-trailer-9x16.mp4",
    teacher: null,
    published: true,
    note_hi: "30 सेकंड ट्रेलर। नमूना — आलिम और डॉक्टर की समीक्षा बाक़ी।",
    note_en: "30-second trailer. Sample — scholar and doctor review is still pending.",
    materials: [
      {
        label_hi: "दिन 1 अध्ययन पत्र",
        label_en: "Day 1 study sheet",
        url: "/#day1-trailer",
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
