import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

const rpc = vi.fn();
const updateSelect = vi.fn();
const toast = vi.fn();
const getFreshPosition = vi.fn();

vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user: { id: "u1" } }) }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));
vi.mock("@/lib/freshPosition", () => ({ getFreshPosition: (...a: unknown[]) => getFreshPosition(...a) }));
vi.mock("@/integrations/supabase/client", () => {
  const chain = () => {
    const q: Record<string, unknown> = {};
    q.select = vi.fn(() => q);
    q.eq = vi.fn(() => q);
    q.maybeSingle = vi.fn(async () => ({ data: null, error: null }));
    q.update = vi.fn(() => ({ eq: () => ({ eq: () => ({ select: updateSelect }) }) }));
    return q;
  };
  return { supabase: { from: vi.fn(() => chain()), rpc: (...a: unknown[]) => rpc(...a) } };
});

import { usePilgrimStatus } from "@/hooks/usePilgrimStatus";

describe("usePilgrimStatus.updateStatus — never writes (0,0)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("hajj_group_id", "g1");
  });

  it("does a status-only update when a location row exists (no RPC, no coords)", async () => {
    updateSelect.mockResolvedValue({ data: [{ id: "row" }], error: null });
    const { result } = renderHook(() => usePilgrimStatus());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(() => result.current.updateStatus("need_help" as never));
    expect(rpc).not.toHaveBeenCalled();
    expect(getFreshPosition).not.toHaveBeenCalled();
    expect(result.current.status).toBe("need_help");
  });

  it("uses a fresh GPS fix when no row exists yet", async () => {
    updateSelect.mockResolvedValue({ data: [], error: null });
    getFreshPosition.mockResolvedValue({ lat: 21.42, lng: 39.82 });
    rpc.mockResolvedValue({ error: null });
    const { result } = renderHook(() => usePilgrimStatus());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(() => result.current.updateStatus("need_help" as never));
    expect(rpc).toHaveBeenCalledWith("upsert_member_location", expect.objectContaining({ p_latitude: 21.42, p_longitude: 39.82 }));
  });

  it("refuses to create a (0,0) row when no location is available", async () => {
    updateSelect.mockResolvedValue({ data: [], error: null });
    getFreshPosition.mockResolvedValue(null);
    const { result } = renderHook(() => usePilgrimStatus());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(() => result.current.updateStatus("need_help" as never));
    expect(rpc).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Location needed" }));
    expect(result.current.status).toBe("normal");
  });
});
