import { describe, expect, it } from "vitest";
import {
  CLASSROOM_DAYS,
  SECTION_ORDER,
  TOPIC_DISCREPANCY,
  classroomDay,
  comingSoonKeys,
  readySectionCount,
  spokenTopic,
} from "./classroomCatalogue";

describe("100 day classroom catalogue", () => {
  it("builds 100 distinct day numbers and does not give every day the same topic", () => {
    expect(CLASSROOM_DAYS).toHaveLength(100);
    expect(CLASSROOM_DAYS.map((item) => item.day)).toEqual(Array.from({ length: 100 }, (_, index) => index + 1));
    const topics = new Set(CLASSROOM_DAYS.map((item) => item.title_hi));
    expect(topics.size).toBeGreaterThan(15);
    expect(topics.size).toBeLessThan(100);
  });

  it("keeps Day 1 from the release file and Days 2–3 from the shortlist, not the spec examples", () => {
    const day1 = classroomDay(1);
    const day2 = classroomDay(2);
    const day3 = classroomDay(3);
    expect(day1?.title_hi).toBe("नीयत: हज इबादत है, सैर नहीं");
    expect(day1?.source).toBe("classroom-release");
    expect(day2?.short).toBe("Ihram");
    expect(day2?.title_hi).toBe(TOPIC_DISCREPANCY.previewDay2);
    expect(day2?.title_en).not.toMatch(/Ahmiyat/i);
    expect(day3?.short).toBe("Miqat");
    expect(day3?.title_hi).toBe(TOPIC_DISCREPANCY.previewDay3);
    expect(day3?.title_en).not.toBe("Hajj kya hai?");
    expect(TOPIC_DISCREPANCY.specDay2).toBe("Hajj ki Ahmiyat aur Fazilat");
  });

  it("uses the homepage week theme from day 8 and leaves Dua as Coming Soon", () => {
    const day8 = classroomDay(8);
    expect(day8?.source).toBe("homepage-week");
    expect(day8?.title_hi).toContain("हज क्या है");
    expect(day8?.title_hi).toContain("हज की फ़ज़ीलत");
    expect(comingSoonKeys(day8!)).toEqual([...SECTION_ORDER]);
    for (const day of [1, 2, 3, 7]) {
      expect(classroomDay(day)?.sections.dua).toBeNull();
    }
  });

  it("plays only shortlist or existing classroom videos, and speaks only languages that have a script", () => {
    const day1 = classroomDay(1)!;
    expect(day1.sections.doctor?.youtubeId).toBe("yCu43qBV0RY");
    expect(day1.sections.quran?.youtubeId).toBe("sRYo5YSpPqE");
    expect(day1.sections.hadith?.citation).toContain("Sahih al-Bukhari");
    expect(day1.sections.lesson?.youtubeId).toBe("eIZ6g15gtqM");
    expect(day1.sections.lesson?.endSeconds).toBe(600);
    expect(day1.sections.quiz?.kind).toBe("quiz");
    expect(readySectionCount(day1)).toBe(7);
    expect(comingSoonKeys(day1)).toEqual(["dua"]);
    expect(spokenTopic(day1, "ur")).toBe(day1.title_ur);
    expect(spokenTopic(day1, "ta")).toBeNull();
    expect(classroomDay(5)?.sections.doctor).toBeNull();
    expect(classroomDay(5)?.sections.lesson).toBeNull();
    expect(classroomDay(2)?.sections.expert?.durationLabel).toBeNull();
  });
});
