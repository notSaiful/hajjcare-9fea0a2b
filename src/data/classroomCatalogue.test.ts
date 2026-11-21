import { describe, expect, it } from "vitest";
import {
  CALENDAR_BLOCKS,
  CLASSROOM_DAYS,
  OFFICIAL_CALENDAR,
  SECTION_ORDER,
  classroomDay,
  comingSoonKeys,
  readySectionCount,
  sectionClips,
  spokenTopic,
} from "./classroomCatalogue";

describe("100 day classroom catalogue", () => {
  it("gives every day its own official Hindi title and block", () => {
    expect(CLASSROOM_DAYS).toHaveLength(100);
    expect(new Set(CLASSROOM_DAYS.map((item) => item.title_hi)).size).toBe(100);
    expect(classroomDay(1)?.block_hi).toBe("नींव और नीयत");
    expect(classroomDay(11)?.block_hi).toBe("दिल और घर की तैयारी");
    expect(classroomDay(54)?.block_hi).toBe(CALENDAR_BLOCKS[5].hi);
    expect(classroomDay(100)?.block_hi).toBe("जुमा, वापसी और हज के बाद की ज़िंदगी");
    expect(CLASSROOM_DAYS.every((item) => item.source === "official-calendar")).toBe(true);
  });

  it("uses the official calendar for the days that used to disagree", () => {
    expect(classroomDay(2)?.short).toBe("Ihram");
    expect(classroomDay(2)?.title_hi).toBe(OFFICIAL_CALENDAR.day2);
    expect(classroomDay(3)?.short).toBe("Miqat");
    expect(classroomDay(8)?.title_hi).toBe("हज के तीन तरीक़े: तमत्तो, क़िरान, इफ़राद");
    expect(classroomDay(8)?.short).toBe("Teen Tareeqe");
    expect(classroomDay(12)?.short).toBe("Huqooq-ul-Ibaad");
    expect(classroomDay(54)?.short).toBe("Arafah");
    expect(classroomDay(54)?.title_hi).toBe("9 ज़िलहिज्जा: अरफ़ा — हज का दिल");
    expect(classroomDay(63)?.short).toBe("Tawaf-e-Ziyarat");
  });

  it("keeps Days 1–7 videos and leaves every later section Coming Soon", () => {
    const day1 = classroomDay(1)!;
    expect(sectionClips(day1.sections.doctor)[0]?.youtubeId).toBe("yCu43qBV0RY");
    expect(sectionClips(day1.sections.quran)[0]?.youtubeId).toBe("sRYo5YSpPqE");
    expect(sectionClips(day1.sections.hadith)[0]?.citation).toContain("Sahih al-Bukhari");
    expect(sectionClips(day1.sections.lesson).map((clip) => [clip.youtubeId, clip.maslak])).toEqual([
      ["35s1bifIeqs", "sunni"],
      ["n1mcNozJjBs", "shia"],
    ]);
    expect(sectionClips(day1.sections.quiz)[0]?.kind).toBe("quiz");
    expect(sectionClips(classroomDay(2)?.sections.doctor).map((clip) => clip.youtubeId)).toEqual(["sVXL2MnB-nQ", "Eb--MldbiZk"]);
    expect(readySectionCount(day1)).toBe(7);
    expect(comingSoonKeys(day1)).toEqual(["dua"]);
    expect(spokenTopic(day1, "ur")).toBe(day1.title_ur);
    expect(spokenTopic(day1, "ta")).toBeNull();
    expect(classroomDay(5)?.sections.doctor).toBeNull();
    expect(sectionClips(classroomDay(2)?.sections.expert)[0]?.durationLabel).toBeNull();
    for (const day of CLASSROOM_DAYS.filter((item) => item.day > 30)) {
      expect(comingSoonKeys(day)).toEqual([...SECTION_ORDER]);
    }
  });

  it("fills days 8–30 from the approved pick list and leaves the empty days empty", () => {
    const ids = (day: number, section: "lesson" | "expert" | "hadith" | "dua") =>
      sectionClips(classroomDay(day)?.sections[section]).map((clip) => `${clip.maslak}:${clip.youtubeId}`);
    expect(ids(8, "lesson")).toEqual(["sunni:o8XoQoVgzhQ"]);
    expect(ids(9, "lesson")).toEqual(["sunni:Dx8geAT6Rng", "shia:tY55IE31JfU"]);
    expect(ids(11, "expert")).toEqual(["shia:-HDRpdpoKzg"]);
    expect(ids(12, "hadith")).toEqual(["shia:KTsNpEvlrbE"]);
    expect(ids(13, "expert")).toEqual(["sunni:3Kuq92HAgYE", "shia:c8AFNEn256w"]);
    expect(ids(18, "lesson")).toEqual(["sunni:VViRV15Lgww", "shia:s-wjVYxNxrw"]);
    expect(ids(20, "dua")).toEqual(["sunni:0PWpwJpsjwc"]);
    expect(ids(27, "expert")).toEqual(["sunni:vB3VYJLhgu4", "shia:aZqL9AklMb8"]);
    expect(ids(30, "lesson")).toEqual(["sunni:OVEX4xXMd8s"]);
    for (const day of [15, 21, 22, 23, 26]) {
      expect(comingSoonKeys(classroomDay(day)!)).toEqual([...SECTION_ORDER]);
    }
    expect(sectionClips(classroomDay(8)?.sections.lesson)).toHaveLength(1);
    expect(sectionClips(classroomDay(9)?.sections.lesson).length).toBeLessThanOrEqual(3);
  });
});
