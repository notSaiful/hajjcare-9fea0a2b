import { describe, expect, it } from "vitest";
import { parseClassroomVideoLink } from "./classroomVideoLink";

describe("parseClassroomVideoLink", () => {
  it("normalizes YouTube links to an embed id", () => {
    const samples = [
      "https://www.youtube.com/watch?v=35s1bifIeqs",
      "https://youtu.be/35s1bifIeqs",
      "https://www.youtube.com/shorts/35s1bifIeqs",
      "https://www.youtube.com/embed/35s1bifIeqs",
      "https://www.youtube-nocookie.com/embed/35s1bifIeqs",
    ];
    for (const sample of samples) {
      const parsed = parseClassroomVideoLink(sample);
      expect(parsed?.kind).toBe("youtube");
      if (parsed?.kind === "youtube") {
        expect(parsed.youtubeId).toBe("35s1bifIeqs");
        expect(parsed.embed).toBe("https://www.youtube-nocookie.com/embed/35s1bifIeqs");
      }
    }
  });

  it("accepts direct mp4 and webm links and rejects other pages", () => {
    expect(parseClassroomVideoLink("https://cdn.example.com/a/clip.mp4")?.kind).toBe("file");
    expect(parseClassroomVideoLink("https://cdn.example.com/a/clip.webm?x=1")?.kind).toBe("file");
    expect(parseClassroomVideoLink("https://vimeo.com/123")).toBeNull();
    expect(parseClassroomVideoLink("http://cdn.example.com/a/clip.mp4")).toBeNull();
    expect(parseClassroomVideoLink("not a url")).toBeNull();
  });
});
