import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { rpc: vi.fn(), from: vi.fn() },
}));

import { isEmergencyStatus, normalizePilgrimStatus, pilgrimStatusLabel } from "../pilgrimStatus";
import { HAJJ_YEAR_CE, HAJJ_DAY_8_ISO } from "@/config/hajjSeason";

describe("pilgrim status vocabulary", () => {
  it("maps every legacy SOS value onto the canonical three", () => {
    expect(normalizePilgrimStatus("emergency")).toBe("emergency_managed");
    expect(normalizePilgrimStatus("missing")).toBe("emergency_managed");
    expect(normalizePilgrimStatus("EMERGENCY_MANAGED")).toBe("emergency_managed");
    expect(normalizePilgrimStatus("help")).toBe("assisted");
    expect(normalizePilgrimStatus("needs_help")).toBe("assisted");
    expect(normalizePilgrimStatus("hospital")).toBe("assisted");
    expect(normalizePilgrimStatus("normal")).toBe("normal");
    expect(normalizePilgrimStatus(null)).toBe("normal");
    expect(normalizePilgrimStatus("something-else")).toBe("normal");
  });

  it("does not call an emergency Normal", () => {
    expect(pilgrimStatusLabel("emergency_managed")).toBe("Emergency");
    expect(pilgrimStatusLabel("emergency")).toBe("Emergency");
    expect(isEmergencyStatus("needs_help")).toBe(false);
    expect(isEmergencyStatus("missing")).toBe(true);
  });
});

describe("hajj season", () => {
  it("points at the upcoming 2027 season, after Hajj 2026", () => {
    expect(HAJJ_YEAR_CE).toBe(2027);
    expect(new Date(HAJJ_DAY_8_ISO).getTime()).toBeGreaterThan(Date.parse("2026-10-24T00:00:00Z"));
  });
});
