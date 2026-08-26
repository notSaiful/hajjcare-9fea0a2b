import { describe, expect, it } from "vitest";
import { normaliseCirculars } from "@/hooks/useCirculars";

describe("circular feed normalisation", () => {
  it("drops malformed records, removes duplicate IDs, and sorts newest first", () => {
    const circulars = normaliseCirculars([
      null,
      { id: "old", title: "Old", circular_date: "2026-01-01", created_at: "2026-01-01T00:00:00Z" },
      { id: "new", title: "New", circular_date: "2026-02-01", created_at: "2026-02-01T00:00:00Z", category: null, priority: null },
      { id: "new", title: "Duplicate", circular_date: "2026-03-01", created_at: "2026-03-01T00:00:00Z" },
      { id: "missing-title" },
    ]);

    expect(circulars.map((item) => item.id)).toEqual(["new", "old"]);
    expect(circulars[0]).toMatchObject({ title: "New", category: "general", priority: "normal" });
  });

  it("preserves the actual Hajj year instead of treating older notices as current", () => {
    const circulars = normaliseCirculars([
      { id: "old", title: "Hajj 2017 baggage circular", circular_date: "2017-04-01", created_at: "2017-04-01T00:00:00Z" },
      { id: "current", title: "Passport readiness", hajj_year: "2027", circular_date: "2026-07-14", created_at: "2026-07-14T00:00:00Z", status: "important" },
    ]);

    expect(circulars.find((item) => item.id === "old")?.hajj_year).toBe("2017");
    expect(circulars.find((item) => item.id === "current")).toMatchObject({ hajj_year: "2027", status: "important" });
  });
});
