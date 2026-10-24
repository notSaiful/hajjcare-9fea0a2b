import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const insert = vi.fn();
const invoke = vi.fn();
const getFreshPosition = vi.fn();
let hookLocation: { lat: number | null; lng: number | null } = { lat: null, lng: null };

vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ language: "en", isRTL: false, t: (k: string) => k }) }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ user: { id: "u1" }, isAuthenticated: true }) }));
vi.mock("@/hooks/useHajjLocation", () => ({ useHajjLocation: () => ({ ...hookLocation, stage: null, refresh: vi.fn(), isStale: false }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() } }));
vi.mock("@/lib/freshPosition", async (orig) => ({
  ...(await orig<typeof import("@/lib/freshPosition")>()),
  getFreshPosition: (...a: unknown[]) => getFreshPosition(...a),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ insert: (row: unknown) => { insert(row); return { select: () => ({ single: async () => ({ data: { id: "t1" }, error: null }) }) }; } }),
    functions: { invoke: (...a: unknown[]) => { invoke(...a); return Promise.resolve({ data: null, error: null }); } },
  },
}));

import { EmergencySOS } from "@/components/EmergencySOS";

async function triggerSOS() {
  render(<EmergencySOS />);
  fireEvent.click(screen.getByRole("button", { name: /Emergency SOS/i }));
  const confirm = await screen.findByRole("alertdialog");
  const buttons = confirm.querySelectorAll("button");
  fireEvent.click(buttons[0]);
  await waitFor(() => expect(invoke).toHaveBeenCalledWith("whatsapp-alert", expect.anything()));
}

describe("EmergencySOS location handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookLocation = { lat: null, lng: null };
  });

  it("sends null (not 0,0) when no location is available and shows a warning in the dialog", async () => {
    getFreshPosition.mockResolvedValue(null);
    render(<EmergencySOS />);
    fireEvent.click(screen.getByRole("button", { name: /Emergency SOS/i }));
    expect(await screen.findByText(/Location unavailable/i)).toBeInTheDocument();
    fireEvent.click((await screen.findByRole("alertdialog")).querySelectorAll("button")[0]);
    await waitFor(() => expect(invoke).toHaveBeenCalledWith("allocate-responder", expect.anything()));
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ location_lat: null, location_lng: null }));
    const alloc = invoke.mock.calls.find((c) => c[0] === "allocate-responder")![1].body;
    expect(alloc).toMatchObject({ lat: null, lng: null, location_available: false });
  });

  it("awaits a fresh fix and sends it", async () => {
    getFreshPosition.mockResolvedValue({ lat: 21.42, lng: 39.82 });
    await triggerSOS();
    expect(getFreshPosition).toHaveBeenCalled();
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ location_lat: 21.42, location_lng: 39.82 }));
  });

  it("falls back to the last known fix when fresh GPS times out", async () => {
    hookLocation = { lat: 21.3, lng: 39.9 };
    getFreshPosition.mockResolvedValue(null);
    await triggerSOS();
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ location_lat: 21.3, location_lng: 39.9 }));
  });
});
