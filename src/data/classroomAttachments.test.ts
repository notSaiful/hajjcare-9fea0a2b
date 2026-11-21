import { describe, expect, it } from "vitest";
import { CLASSROOM_DAYS } from "./classroomCatalogue";
import {
  ATTACHMENT_META_KEY,
  moveClip,
  readAttachments,
  removeAttachment,
  saveYoutubeAttachment,
  youtubeIdFromUrl,
} from "./classroomAttachments";

describe("preview video attachments", () => {
  it("accepts YouTube links and refuses other addresses", () => {
    expect(youtubeIdFromUrl("https://www.youtube.com/watch?v=yCu43qBV0RY")).toBe("yCu43qBV0RY");
    expect(youtubeIdFromUrl("https://youtu.be/sRYo5YSpPqE")).toBe("sRYo5YSpPqE");
    expect(youtubeIdFromUrl("https://www.youtube.com/shorts/3bkQJmk6omE")).toBe("3bkQJmk6omE");
    expect(youtubeIdFromUrl("https://www.youtube-nocookie.com/embed/oQd1bnEi32U")).toBe("oQd1bnEi32U");
    expect(youtubeIdFromUrl("https://m.youtube.com/watch?v=-wbcEd2VEWU")).toBe("-wbcEd2VEWU");
    expect(youtubeIdFromUrl("https://vimeo.com/123456")).toBeNull();
    expect(youtubeIdFromUrl("javascript:alert(1)")).toBeNull();
    expect(youtubeIdFromUrl("not a link")).toBeNull();
    expect(youtubeIdFromUrl("")).toBeNull();
  });

  it("stores a link in this browser and remove brings the section back to the catalogue", async () => {
    localStorage.removeItem(ATTACHMENT_META_KEY);
    const before = CLASSROOM_DAYS[7].sections.dua;
    const saved = saveYoutubeAttachment({
      day: 8,
      section: "dua",
      url: "https://www.youtube.com/watch?v=yCu43qBV0RY&t=12s",
      title: "Safar ki dua",
      language: "Urdu",
      duration: "2:00",
    });
    expect(saved).toEqual({ ok: true });
    expect(readAttachments()["8:dua"]?.clips[0]).toMatchObject({
      kind: "youtube",
      youtubeId: "yCu43qBV0RY",
      title: "Safar ki dua",
      language: "Urdu",
      duration: "2:00",
    });
    const first = readAttachments()["8:dua"]!.clips;
    expect(saveYoutubeAttachment({
      day: 8,
      section: "dua",
      url: "https://youtu.be/sRYo5YSpPqE",
      title: "Second",
      base: first,
    }).ok).toBe(true);
    expect(saveYoutubeAttachment({
      day: 8,
      section: "dua",
      url: "https://youtu.be/oQd1bnEi32U",
      title: "Third",
      base: readAttachments()["8:dua"]!.clips,
    }).ok).toBe(true);
    const three = readAttachments()["8:dua"]!.clips;
    expect(three).toHaveLength(3);
    expect(saveYoutubeAttachment({ day: 8, section: "dua", url: "https://youtu.be/x_Wszcyb2UQ", base: three }).ok).toBe(false);
    moveClip(8, "dua", three, 0, 1);
    expect(readAttachments()["8:dua"]?.clips[0]?.title).toBe("Second");
    expect(saveYoutubeAttachment({ day: 8, section: "dua", url: "https://example.com/video", base: three }).ok).toBe(false);
    await removeAttachment(8, "dua");
    expect(readAttachments()["8:dua"]).toBeUndefined();
    expect(CLASSROOM_DAYS[7].sections.dua).toBe(before);
  });
});
