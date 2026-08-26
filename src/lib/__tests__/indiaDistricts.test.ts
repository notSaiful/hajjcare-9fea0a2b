import { describe, expect, it } from "vitest";
import {
  DISTRICTS_BY_STATE,
  INDIA_DISTRICT_CATALOG,
  INDIA_STATE_NAMES,
} from "@/data/indiaDistricts";

describe("India LGD district catalog", () => {
  it("contains all 36 states and union territories and the verified LGD snapshot size", () => {
    expect(INDIA_STATE_NAMES).toHaveLength(36);
    expect(INDIA_DISTRICT_CATALOG).toHaveLength(785);
  });

  it("has no duplicate district code or name within a state and is alphabetically sorted", () => {
    for (const state of INDIA_STATE_NAMES) {
      const districts = DISTRICTS_BY_STATE[state];
      const codes = districts.map((district) => district.districtCode);
      const names = districts.map((district) => district.name);
      expect(new Set(codes).size).toBe(codes.length);
      expect(new Set(names).size).toBe(names.length);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });

  it("keeps district records scoped to their state", () => {
    for (const [state, districts] of Object.entries(DISTRICTS_BY_STATE)) {
      expect(districts.every((district) => district.state === state)).toBe(true);
    }
  });
});
