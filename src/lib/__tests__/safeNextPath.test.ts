import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/safeNextPath";

describe("safeNextPath", () => {
  it("sends volunteer registration back to the existing form", () => {
    expect(safeNextPath("/volunteer")).toBe("/volunteer");
  });

  it("falls back to the app home when next is missing or external", () => {
    expect(safeNextPath(null)).toBe("/home");
    expect(safeNextPath("")).toBe("/home");
    expect(safeNextPath("//evil.example/phish")).toBe("/home");
    expect(safeNextPath("https://evil.example")).toBe("/home");
    expect(safeNextPath("/volunteer/../../admin")).toBe("/home");
    expect(safeNextPath("/admin/roles")).toBe("/home");
  });

  it("drops a query string and still accepts an allow-listed path", () => {
    expect(safeNextPath("/volunteer?x=1")).toBe("/volunteer");
  });
});
