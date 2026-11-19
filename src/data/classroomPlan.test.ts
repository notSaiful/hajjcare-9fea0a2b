import { describe, expect, it } from "vitest";
import { CLASSROOM_CLASSES, CLASSROOM_QUIZ, CLASSROOM_SCRIPTURE, CLASSROOM_SIDE_VIDEOS } from "./classroom";
import { EPISODE_CAP_SECONDS, SECTION_ORDER, formatEpisodeTotal, planEpisode } from "./classroomPlan";
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
    expect(plan.exceedsCap).toBe(false);
    expect(plan.totalSeconds).toBeLessThanOrEqual(EPISODE_CAP_SECONDS);
    expect(plan.sections.map((section) => section.key)).toEqual([...SECTION_ORDER]);
    expect(plan.sections.find((section) => section.key === "arkan")).toMatchObject({
      seconds: 600,
      embedEnd: 600,
      adminReview: false,
    });
    expect(plan.adminReview).toEqual(["doctor", "naat"]);
    expect(formatEpisodeTotal(plan)).toBe("30:00 / 30:00");
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
  it("keeps Day 1 unlocked and locks Day 2 until the next IST date", () => {
    expect(unlockDateIst(1)).toBe("2026-11-20");
    expect(unlockDateIst(2)).toBe("2026-11-21");
    expect(isDayUnlocked(1, "2026-11-19")).toBe(true);
    expect(isDayUnlocked(2, "2026-11-20")).toBe(false);
    expect(isDayUnlocked(2, "2026-11-21")).toBe(true);
    const today = publicProgramme("2026-11-20");
    expect(today.find((item) => item.day === 2)?.status).toBe("locked");
    const later = publicProgramme("2026-11-21");
    expect(later.find((item) => item.day === 2)?.status).not.toBe("locked");
  });
});
