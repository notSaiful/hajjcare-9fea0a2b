import { describe, expect, it } from "vitest";
import { parseRemoteChangelog } from "../changelog";

const validDocument = {
  version: 1,
  releases: [{
    id: "2026-07-18",
    date: "2026-07-18",
    translations: {
      en: {
        heading: "Latest improvements",
        date: "July 18, 2026",
        items: [{ kind: "fix", badge: "Fix", title: "Voice permissions", body: "Improved Android microphone permission handling." }],
      },
    },
  }],
};

describe("remote changelog schema", () => {
  it("accepts a versioned English-fallback document", () => {
    expect(parseRemoteChangelog(validDocument)).toEqual(validDocument);
  });

  it("rejects malformed content instead of rendering it", () => {
    expect(parseRemoteChangelog({ ...validDocument, version: 2 })).toBeNull();
    expect(parseRemoteChangelog({ ...validDocument, releases: [{ ...validDocument.releases[0], date: "July 18" }] })).toBeNull();
    expect(parseRemoteChangelog({ ...validDocument, releases: [{ ...validDocument.releases[0], translations: {} }] })).toBeNull();
  });
});
