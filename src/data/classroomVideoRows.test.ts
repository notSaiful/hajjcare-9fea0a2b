import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { boardClips, catalogueSeedRows, rowsForSection } from "./classroomVideoRows";
import { classroomDay } from "./classroomCatalogue";

describe("classroom video rows", () => {
  it("seeds days 1-30 without touching other tables", () => {
    const rows = catalogueSeedRows();
    expect(rows.some((row) => row.day === 8 && row.url.includes("o8XoQoVgzhQ") && row.tag === "sunni")).toBe(true);
    expect(rows.some((row) => row.url.includes("dailymotion.com/video/x9kay7q") && row.tag === "shia")).toBe(true);
    expect(rows.some((row) => row.day > 30)).toBe(false);
    expect(rows.every((row) => row.position >= 1 && row.position <= 3)).toBe(true);
    const sql = readFileSync("supabase/migrations/20261121120000_classroom_videos.sql", "utf8");
    expect(sql).toContain("CREATE TABLE public.classroom_videos");
    expect(sql).toContain("FOR SELECT");
    expect(sql).not.toMatch(/DROP TABLE|UPDATE public\./);
    expect(sql).toContain("ALTER TABLE public.classroom_videos ENABLE ROW LEVEL SECURITY");
    expect(sql).toContain("https://www.dailymotion.com/video/x9kay7q");
  });

  it("uses the database when it answers and the catalogue only when it does not", () => {
    const day = classroomDay(8)!;
    const fallback = boardClips({
      remoteOk: false,
      rows: [],
      day: 8,
      section: "lesson",
      catalogue: day.sections.lesson,
      browserFiles: [],
    });
    expect(fallback[0]?.youtubeId).toBe("o8XoQoVgzhQ");
    const remote = boardClips({
      remoteOk: true,
      rows: [{ day: 8, section: "lesson", position: 1, url: "https://www.youtube.com/watch?v=abcdefghijk", platform: "YouTube", title: "Test", tag: "neutral", review_pending: false }],
      day: 8,
      section: "lesson",
      catalogue: day.sections.lesson,
      browserFiles: [{ id: "file-1", kind: "file", fileName: "local.mp4" }],
    });
    expect(remote.map((clip) => clip.kind)).toEqual(["youtube", "file"]);
    expect(remote[0]?.title).toBe("Test");
    expect(rowsForSection([], 8, "lesson")).toEqual([]);
  });
});
