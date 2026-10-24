import { describe, expect, it } from "vitest";
import { extractCitations, mergeCitations } from "@/lib/zoyaCitations";

describe("extractCitations", () => {
  it("reads a dedicated sources event", () => {
    const out = extractCitations({ type: "sources", sources: [{ id: "q1", kind: "quran", title: "Al-Baqarah", reference: "2:196" }] });
    expect(out).toEqual([{ id: "q1", kind: "quran", title: "Al-Baqarah", reference: "2:196", url: undefined }]);
  });
  it("reads sources inside choices[0].delta", () => {
    expect(extractCitations({ choices: [{ delta: { sources: [{ title: "Circular 5", kind: "circular", url: "https://hajcommittee.gov.in/x" }] } }] })[0].url).toBe("https://hajcommittee.gov.in/x");
  });
  it("drops unsafe urls, unknown kinds and empty entries", () => {
    const out = extractCitations({ sources: [{ title: "x", url: "javascript:alert(1)", kind: "weird" }, {}, null] });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ kind: "other", url: undefined });
  });
  it("returns [] for normal content chunks", () => {
    expect(extractCitations({ choices: [{ delta: { content: "hi" } }] })).toEqual([]);
  });
  it("merges without duplicates", () => {
    const a = extractCitations({ sources: [{ id: "1", title: "A" }] });
    expect(mergeCitations(a, a)).toHaveLength(1);
  });
});
