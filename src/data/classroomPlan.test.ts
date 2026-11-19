import { describe, expect, it } from "vitest";
import { CLASSROOM_CLASSES, CLASSROOM_QUIZ, CLASSROOM_SCRIPTURE, CLASSROOM_SIDE_VIDEOS } from "./classroom";
import { EPISODE_CAP_SECONDS, SECTION_ORDER, formatEpisodeTotal, planEpisode, quizResultMessage } from "./classroomPlan";
import { isDayUnlocked, publicProgramme, unlockDateIst } from "./classroomRelease.js";

const day1 = CLASSROOM_CLASSES[0];
const scripture = CLASSROOM_SCRIPTURE[0];
const side = (key: string) => CLASSROOM_SIDE_VIDEOS.find((item) => item.key === key)!;

function dayOnePlan() {
  const dua = side("dua");
  const arkan = side("arkan");
  const doctor = side("doctor-corner");
  return planEpisode({
    hadith: { youtubeId: scripture.hadith_youtube_id },
    dua: { youtubeId: dua.youtube_id, start: dua.start_seconds, end: dua.end_seconds },
    arkan: { youtubeId: arkan.youtube_id, start: arkan.start_seconds, end: arkan.end_seconds },
    doctor: { youtubeId: doctor.youtube_id, start: doctor.start_seconds, end: doctor.end_seconds },
    naat: { youtubeId: day1.youtube_id },
    quizSeconds: CLASSROOM_QUIZ.seconds,
  });
}

describe("30 minute episode cap", () => {
  it("keeps Day 1 at or under 30:00 and preserves the Arkan clip", () => {
    const plan = dayOnePlan();
    expect(plan.sections.every((section) => section.seconds != null)).toBe(true);
    expect(plan.totalSeconds).toBe(35 * 60 + 38);
    expect(plan.exceedsCap).toBe(true);
    expect(plan.totalSeconds).toBeGreaterThan(EPISODE_CAP_SECONDS);
    expect(plan.sections.map((section) => section.key)).toEqual([...SECTION_ORDER]);
    expect(plan.sections.find((section) => section.key === "doctor")?.seconds).toBe(7 * 60 + 27);
    expect(plan.sections.find((section) => section.key === "naat")?.seconds).toBe(9 * 60 + 6);
    expect(plan.sections.find((section) => section.key === "arkan")).toMatchObject({
      seconds: 600,
      embedEnd: 600,
    });
    expect(formatEpisodeTotal(plan)).toBe("35:38 / 30:00");
    expect(formatEpisodeTotal(plan)).not.toBe("30:00 / 30:00");
  });

  it("fails when a day is planned past 30:00", () => {
    const plan = planEpisode({
      introSeconds: 1000,
      quranSeconds: 1000,
      hadith: { youtubeId: null },
      dua: { youtubeId: null },
      arkan: { youtubeId: null },
      doctor: { youtubeId: null },
      naat: { youtubeId: null },
      quizSeconds: 0,
    });
    expect(plan.exceedsCap).toBe(true);
    expect(plan.totalSeconds).toBeGreaterThan(EPISODE_CAP_SECONDS);
  });
});

describe("IST release", () => {
  it("opens one day at a time from 7 Dec 2026 through 16 Mar 2027", () => {
    expect(unlockDateIst(1)).toBe("2026-12-07");
    expect(unlockDateIst(2)).toBe("2026-12-08");
    expect(unlockDateIst(100)).toBe("2027-03-16");
    expect(publicProgramme("2026-12-06").every((item) => item.status === "locked")).toBe(true);
    expect(publicProgramme("2026-12-06")).toHaveLength(100);
    const dayOne = publicProgramme("2026-12-07");
    expect(dayOne.filter((item) => item.status !== "locked").map((item) => item.day)).toEqual([1]);
    const twoDays = publicProgramme("2026-12-08");
    expect(twoDays.filter((item) => item.status !== "locked").map((item) => item.day)).toEqual([1, 2]);
    expect(publicProgramme("2027-03-16").every((item) => item.status !== "locked")).toBe(true);
    expect(isDayUnlocked(1, "2026-12-06")).toBe(false);
    expect(isDayUnlocked(1, "2026-12-07")).toBe(true);
  });
});

describe("quiz result messages", () => {
  it("uses the four score bands", () => {
    expect(quizResultMessage(10).en).toBe("Congratulations! MashaAllah! All answers are correct.");
    expect(quizResultMessage(9).en).toBe("MashaAllah! Very good effort.");
    expect(quizResultMessage(8).hi).toContain("माशाअल्लाह");
    expect(quizResultMessage(7).en).toBe("Shabash! You have passed.");
    expect(quizResultMessage(6).ur).toContain("شاباش");
    expect(quizResultMessage(5).en).toBe("No problem. Please revise today's lesson and try again.");
    expect(quizResultMessage(0).hi).toContain("कोई बात नहीं");
  });
});
