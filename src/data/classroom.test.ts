import { describe, expect, it } from "vitest";
import {
  CLASSROOM_CLASSES,
  HAJCARE_WHATSAPP_NUMBER_DEFAULT,
  buildClassroomWhatsAppUrl,
  classroomQuestionText,
  formatWhatsAppDisplay,
  CLASSROOM_QUIZ,
  CLASSROOM_SCRIPTURE,
  CLASSROOM_SIDE_VIDEOS,
  classroomSideEmbedSrc,
  formatQuizClock,
  publishedClasses,
  quizScore,
  resolveWhatsAppDigits,
} from "./classroom";

const day1 = CLASSROOM_CLASSES[0];

describe("classroom catalogue", () => {
  it("publishes only the existing Day 1 trailer", () => {
    expect(publishedClasses().map((item) => item.day)).toEqual([1]);
    expect(day1.youtube_id).toBe("J76Dtc0MePA");
    expect(day1.teacher).toBeNull();
    expect(day1.local_video_16x9).toBe("/videos/day1-1min-16x9.mp4");
    expect(day1.local_video_9x16).toBe("/videos/day1-1min-9x16.mp4");
    expect(day1.label_hi).toBe("दिन 1 — 1 मिनट क्लास");
    expect(day1.materials.map((item) => item.url)).toEqual([
      "/explore#day-1",
      "/videos/day1-trailer-16x9.mp4",
      "/videos/day1-trailer-9x16.mp4",
    ]);
    expect(CLASSROOM_SIDE_VIDEOS.map((item) => [item.day, item.key, item.title_en, item.title_hi, item.youtube_id])).toEqual([
      [1, "doctor-corner", "Doctor Corner", "डॉक्टर कॉर्नर", "yCu43qBV0RY"],
      [1, "arkan", "Arkan", "अरकान", "eIZ6g15gtqM"],
      [1, "dua", "Safar ki Dua", "सफ़र की दुआ", "hRlmshVxs1w"],
    ]);
    const arkan = CLASSROOM_SIDE_VIDEOS.find((item) => item.key === "arkan");
    expect(arkan?.start_seconds).toBe(0);
    expect(arkan?.end_seconds).toBe(600);
    expect(arkan?.caption).toBe("पहले 10 मिनट — बाक़ी हिस्सा अगले दिन जारी रहेगा (To be continued next day)");
    expect(classroomSideEmbedSrc(arkan!)).toBe(
      "https://www.youtube-nocookie.com/embed/eIZ6g15gtqM?rel=0&modestbranding=1&playsinline=1&start=0&end=600",
    );
    expect(
      CLASSROOM_SIDE_VIDEOS.filter((item) => item.key !== "arkan").map((item) => classroomSideEmbedSrc(item)),
    ).toEqual([
      "https://www.youtube-nocookie.com/embed/yCu43qBV0RY?rel=0&modestbranding=1&playsinline=1",
      "https://www.youtube-nocookie.com/embed/hRlmshVxs1w?rel=0&modestbranding=1&playsinline=1",
    ]);
    expect(CLASSROOM_SCRIPTURE).toEqual([
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
    ]);
    expect(CLASSROOM_QUIZ.day).toBe(1);
    expect(CLASSROOM_QUIZ.seconds).toBe(180);
    expect(CLASSROOM_QUIZ.title_hi).toBe("दिन 1 क्विज़");
    expect(CLASSROOM_QUIZ.questions).toHaveLength(10);
    expect(CLASSROOM_QUIZ.questions.map((item) => item.options.length)).toEqual([4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    expect(CLASSROOM_QUIZ.questions.map((item) => item.correct)).toEqual([1, 0, 0, 1, 1, 1, 1, 0, 2, 1]);
    expect(JSON.stringify(CLASSROOM_QUIZ)).not.toContain("*");
    expect(formatQuizClock(180)).toBe("3:00");
    expect(formatQuizClock(0)).toBe("0:00");
    expect(quizScore(CLASSROOM_QUIZ.questions, [1, 0, 0, 1, 1, 1, 1, 0, 2, 1])).toBe(10);
    expect(quizScore(CLASSROOM_QUIZ.questions, [0, null, null, null, null, null, null, null, null, null])).toBe(0);
  });
});

describe("classroom WhatsApp links", () => {
  it("uses the India classroom number when env is unset", () => {
    expect(HAJCARE_WHATSAPP_NUMBER_DEFAULT).toBe("917588113830");
    expect(resolveWhatsAppDigits(undefined)).toBe("917588113830");
    expect(resolveWhatsAppDigits("")).toBe("917588113830");
    expect(resolveWhatsAppDigits("not-a-number")).toBe("917588113830");
    expect(formatWhatsAppDisplay("917588113830")).toBe("+91 75881 13830");
  });

  it("lets VITE_HAJCARE_WHATSAPP_NUMBER override the default", () => {
    expect(resolveWhatsAppDigits("919876543210")).toBe("919876543210");
    expect(formatWhatsAppDisplay("919876543210")).toBe("+91 98765 43210");
  });

  it("url-encodes the day, both titles, and My question", () => {
    const url = buildClassroomWhatsAppUrl(day1);
    const text = classroomQuestionText(day1);
    expect(url).toBe(`https://wa.me/917588113830?text=${encodeURIComponent(text)}`);
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(text);
    expect(text).toContain("Day 1");
    expect(text).toContain(day1.title_en);
    expect(text).toContain(day1.title_hi);
    expect(text.endsWith("My question: ")).toBe(true);
    expect(url).not.toContain(" ");
    expect(url).not.toContain("\n");
  });

  it("uses an override number in the wa.me path", () => {
    const url = buildClassroomWhatsAppUrl(day1, "+44 7700 900123");
    expect(url.startsWith("https://wa.me/447700900123?text=")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1])).toContain("My question:");
  });
});
