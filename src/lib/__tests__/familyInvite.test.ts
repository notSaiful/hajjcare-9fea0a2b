import { describe, expect, it } from "vitest";
import { clearPendingInvite, familyInvitePath, rememberPendingInvite, takePendingInvite } from "../familyInvite";

describe("family invite links", () => {
  it("points at /family and keeps the code", () => {
    expect(familyInvitePath("123456")).toBe("/family?join=123456");
    expect(familyInvitePath(" 123456 ")).toBe("/family?join=123456");
  });

  it("remembers a code without clearing it on read", () => {
    rememberPendingInvite("654321");
    expect(takePendingInvite()).toBe("654321");
    expect(takePendingInvite()).toBe("654321");
    clearPendingInvite();
    expect(takePendingInvite()).toBeNull();
  });
});
