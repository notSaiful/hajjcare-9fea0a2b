import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

let user: { id: string } | null = null;
let selectResult: { data: unknown; error: unknown } = { data: [], error: null };
const upsert = vi.fn(async () => ({ error: null }));

vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user }) }));
vi.mock("@/integrations/supabase/client", () => {
  const q: Record<string, unknown> = {};
  q.select = () => q;
  q.eq = () => q;
  q.then = (res: (v: unknown) => unknown) => Promise.resolve(selectResult).then(res);
  q.upsert = (...a: unknown[]) => upsert(...(a as []));
  return { supabase: { from: () => q } };
});

import { mergeDays, readLocalDays, useTrainingSync } from "@/hooks/useTrainingSync";

const KEY = "hajcare-100-day-training-complete";

describe("useTrainingSync", () => {
  beforeEach(() => {
    localStorage.clear();
    user = null;
    selectResult = { data: [], error: null };
    upsert.mockClear();
  });

  it("helpers sanitise and merge", () => {
    localStorage.setItem(KEY, JSON.stringify([3, 1, "x", 500, 1]));
    expect(readLocalDays(KEY)).toEqual([3, 1, 1]);
    expect(mergeDays([3, 1], [2, 3])).toEqual([1, 2, 3]);
  });

  it("logged out: localStorage only, no network", () => {
    const { result } = renderHook(() => useTrainingSync(KEY));
    act(() => result.current.setCompleted([1]));
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual([1]);
    expect(upsert).not.toHaveBeenCalled();
    expect(result.current.syncState).toBe("idle");
  });

  it("logged in: merges remote with local and pushes local-only days", async () => {
    user = { id: "u1" };
    localStorage.setItem(KEY, JSON.stringify([1, 2]));
    selectResult = { data: [{ day: 2 }, { day: 5 }], error: null };
    const { result } = renderHook(() => useTrainingSync(KEY));
    await waitFor(() => expect(result.current.syncState).toBe("synced"));
    expect(result.current.completed).toEqual([1, 2, 5]);
    expect(upsert).toHaveBeenCalledWith([{ user_id: "u1", programme: "hajj-2027-100-day", day: 1 }], expect.anything());
  });

  it("missing table: degrades to 'unavailable' and keeps working locally", async () => {
    user = { id: "u1" };
    selectResult = { data: null, error: { code: "42P01", message: 'relation "hajj_training_progress" does not exist' } };
    const { result } = renderHook(() => useTrainingSync(KEY));
    await waitFor(() => expect(result.current.syncState).toBe("unavailable"));
    act(() => result.current.setCompleted([7]));
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual([7]);
    expect(upsert).not.toHaveBeenCalled();
  });
});
