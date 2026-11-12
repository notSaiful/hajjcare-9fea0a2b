import { describe, expect, it } from "vitest";
import {
  CLASSROOM_CLASSES,
  HAJCARE_WHATSAPP_NUMBER_DEFAULT,
  buildClassroomWhatsAppUrl,
  classroomQuestionText,
  formatWhatsAppDisplay,
  publishedClasses,
  resolveWhatsAppDigits,
} from "./classroom";

const day1 = CLASSROOM_CLASSES[0];

describe("classroom catalogue", () => {
  it("publishes only the existing Day 1 trailer", () => {
    expect(publishedClasses().map((item) => item.day)).toEqual([1]);
    expect(day1.youtube_id).toBeNull();
    expect(day1.teacher).toBeNull();
    expect(day1.local_video_16x9).toBe("/videos/day1-1min-16x9.mp4");
    expect(day1.local_video_9x16).toBe("/videos/day1-1min-9x16.mp4");
    expect(day1.label_hi).toBe("दिन 1 — 1 मिनट क्लास");
    expect(day1.materials.map((item) => item.url)).toEqual([
      "/explore#day-1",
      "/videos/day1-trailer-16x9.mp4",
      "/videos/day1-trailer-9x16.mp4",
    ]);
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
