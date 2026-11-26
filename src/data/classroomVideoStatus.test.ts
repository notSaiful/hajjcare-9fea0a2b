import { describe, expect, it } from "vitest";
import { cellStatus, clipCheckTarget } from "./classroomVideoStatus";
import { inspectTarget } from "../../api/classroom-video-check.js";
import type { PreviewClip } from "./classroomAttachments";

const youtube = (id: string): PreviewClip => ({ id: "a", kind: "youtube", youtubeId: id, title: "Clip" });

describe("cellStatus", () => {
  it("keeps an empty section missing and does not call a check a pass", () => {
    expect(cellStatus([], undefined, false)).toBe("missing");
    expect(cellStatus([youtube("35s1bifIeqs")], undefined, false)).toBe("unchecked");
    expect(cellStatus([youtube("35s1bifIeqs")], "playing", false)).toBe("has-video");
    expect(cellStatus([youtube("35s1bifIeqs")], "not-playing", false)).toBe("not-playing");
    expect(cellStatus([youtube("35s1bifIeqs")], "playing", true)).toBe("mismatched");
  });

  it("leaves a non-file link unchecked", () => {
    const external: PreviewClip = { id: "b", kind: "external", pageUrl: "https://www.al-islam.org/", title: "Link" };
    expect(clipCheckTarget([external])).toEqual({ kind: "uncheckable" });
    expect(cellStatus([external], undefined, false)).toBe("unchecked");
  });
});

describe("inspectTarget", () => {
  it("accepts YouTube and public media files, and rejects other hosts", () => {
    expect(inspectTarget("https://youtu.be/35s1bifIeqs")).toEqual({ kind: "youtube", id: "35s1bifIeqs" });
    expect(inspectTarget("https://cdn.example.com/a/clip.mp4")?.kind).toBe("file");
    expect(inspectTarget("https://vimeo.com/123")).toBeNull();
    expect(inspectTarget("https://127.0.0.1/a.mp4")).toBeNull();
    expect(inspectTarget("http://cdn.example.com/a.mp4")).toBeNull();
  });
});
