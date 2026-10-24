import { afterEach, describe, expect, it, vi } from "vitest";
import { getFreshPosition, isUsableCoordinate, pickCoordinates } from "@/lib/freshPosition";

describe("freshPosition", () => {
  afterEach(() => {
    vi.useRealTimers();
    // @ts-expect-error test cleanup
    delete navigator.geolocation;
  });

  it("rejects (0,0), NaN and out-of-range coordinates", () => {
    expect(isUsableCoordinate(0, 0)).toBe(false);
    expect(isUsableCoordinate(NaN, 39)).toBe(false);
    expect(isUsableCoordinate(91, 39)).toBe(false);
    expect(isUsableCoordinate(null, 39)).toBe(false);
    expect(isUsableCoordinate(21.4225, 39.8262)).toBe(true);
  });

  it("prefers fresh, falls back to cached, else null", () => {
    expect(pickCoordinates({ lat: 21.4, lng: 39.8 }, { lat: 21.3, lng: 39.9 })).toEqual({ lat: 21.4, lng: 39.8 });
    expect(pickCoordinates(null, { lat: 21.3, lng: 39.9 })).toEqual({ lat: 21.3, lng: 39.9 });
    expect(pickCoordinates({ lat: 0, lng: 0 }, { lat: 0, lng: 0 })).toBeNull();
    expect(pickCoordinates(null, { lat: null, lng: null })).toBeNull();
  });

  it("resolves null when geolocation is unavailable", async () => {
    await expect(getFreshPosition(10)).resolves.toBeNull();
  });

  it("resolves null on timeout instead of hanging", async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: vi.fn() } });
    const p = getFreshPosition(1000);
    vi.advanceTimersByTime(1001);
    await expect(p).resolves.toBeNull();
  });

  it("resolves the fix when GPS answers", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: (ok: PositionCallback) => ok({ coords: { latitude: 21.42, longitude: 39.82 } } as GeolocationPosition) },
    });
    await expect(getFreshPosition(1000)).resolves.toEqual({ lat: 21.42, lng: 39.82 });
  });
});
