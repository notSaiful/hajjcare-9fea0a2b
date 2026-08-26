import { describe, expect, it } from "vitest";
import { duplicateStatusLabel, reviewActionPatch, reviewStatusLabel } from "@/lib/circularNoticeLifecycle";

describe("Circular/Notice review lifecycle", () => {
  it("uses the exact administrator-review label", () => {
    expect(reviewStatusLabel("pending_review")).toBe("Awaiting Admin Review");
    expect(reviewStatusLabel("draft")).toBe("Awaiting Admin Review");
  });

  it.each([
    ["verify", { is_published: false, is_current_version: true, review_status: "verified" }],
    ["publish", { is_published: true, is_current_version: true, review_status: "published" }],
    ["reject", { is_published: false, is_current_version: true, review_status: "rejected" }],
    ["archive", { is_published: false, is_current_version: false, review_status: "archived", status: "archived" }],
  ] as const)("creates a safe %s action payload", (action, expected) => {
    expect(reviewActionPatch(action)).toEqual(expected);
  });

  it("reports duplicate protection status for imported records", () => {
    expect(duplicateStatusLabel(1, true)).toBe("No duplicate detected");
    expect(duplicateStatusLabel(2, true)).toBe("Duplicate detected");
    expect(duplicateStatusLabel(0, false)).toBe("No external ID; manual check required");
  });

  it("keeps lifecycle labels explicit", () => {
    expect(reviewStatusLabel("verified")).toBe("Verified / Ready for Publication");
    expect(reviewStatusLabel("rejected")).toBe("Rejected");
    expect(reviewStatusLabel("archived")).toBe("Archived");
    expect(reviewStatusLabel("published", true)).toBe("Published");
  });
});

