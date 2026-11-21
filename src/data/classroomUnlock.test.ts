import { describe, expect, it } from "vitest";
import { dayIsFinished, dayIsUnlocked, firstOpenDay } from "./classroomUnlock";

describe("sequential classroom unlock", () => {
  it("opens only day 1 until that day is finished", () => {
    expect(firstOpenDay([], [])).toBe(1);
    expect(dayIsUnlocked(1, [], [], false)).toBe(true);
    expect(dayIsUnlocked(2, [], [], false)).toBe(false);
    expect(dayIsUnlocked(54, [], [], false)).toBe(false);
  });

  it("unlocks the next day after a complete mark or after a section was played", () => {
    expect(dayIsFinished(1, [1], [])).toBe(true);
    expect(dayIsFinished(1, [], [1])).toBe(true);
    expect(firstOpenDay([1], [])).toBe(2);
    expect(firstOpenDay([], [1])).toBe(2);
    expect(dayIsUnlocked(2, [], [1], false)).toBe(true);
    expect(dayIsUnlocked(3, [1, 2], [], false)).toBe(true);
    expect(dayIsUnlocked(4, [1, 2], [], false)).toBe(false);
  });

  it("lets edit mode open a locked day", () => {
    expect(dayIsUnlocked(20, [], [], true)).toBe(true);
  });
});
