import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getMicrophonePermissionMessage, isMicrophonePermissionDenied } from "../microphonePermission";
import { canOpenNativeAppSettings, getClientPlatform, openNativeAppSettings } from "../medianAppSettings";
import { getMicrophonePermissionState, requestMicrophonePermission } from "../nativeMicrophonePermission";

describe("getMicrophonePermissionMessage", () => {
  it("gives a recoverable browser and Android path when permission is denied", () => {
    const message = getMicrophonePermissionMessage(new DOMException("Denied", "NotAllowedError"), "en");

    expect(message).toContain("Microphone access is blocked");
    expect(message).toContain("Settings → Apps → HajCare AI → Permissions");
  });

  it("uses Hindi recovery text for Hindi pilgrims", () => {
    const message = getMicrophonePermissionMessage(new DOMException("Denied", "NotAllowedError"), "hi");

    expect(message).toContain("माइक्रोफ़ोन");
    expect(message).toContain("HajCare Android");
  });

  it("does not mask a voice-service error as a permission error", () => {
    expect(getMicrophonePermissionMessage(new Error("Voice service is temporarily unavailable."), "en"))
      .toBe("Voice service is temporarily unavailable.");
  });

  it("recognizes only microphone permission denials for the Settings recovery flow", () => {
    expect(isMicrophonePermissionDenied(new DOMException("Denied", "NotAllowedError"))).toBe(true);
    expect(isMicrophonePermissionDenied(new DOMException("Busy", "NotReadableError"))).toBe(false);
  });
});

describe("native microphone permission gate", () => {
  const originalSecureContext = window.isSecureContext;

  // jsdom deliberately uses an insecure localhost-like context. Individual
  // permission tests model a production HTTPS page unless they explicitly
  // exercise the HTTP rejection path below.
  beforeEach(() => {
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
  });
  afterEach(() => {
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: originalSecureContext });
  });

  it("does not treat a promptable microphone permission as blocked", async () => {
    const originalPermissions = navigator.permissions;
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: { query: vi.fn().mockResolvedValue({ state: "prompt" }) },
    });

    await expect(getMicrophonePermissionState()).resolves.toBe("prompt");

    Object.defineProperty(navigator, "permissions", { configurable: true, value: originalPermissions });
  });

  it("triggers the platform microphone prompt when permission is promptable", async () => {
    const originalMedian = (window as Window & { median?: unknown }).median;
    const originalPermissions = navigator.permissions;
    const originalMediaDevices = navigator.mediaDevices;
    const stop = vi.fn();
    const track = { stop, enabled: true, readyState: "live" as const };
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [track], getAudioTracks: () => [track] });
    (window as Window & { median?: unknown }).median = undefined;
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: { query: vi.fn().mockResolvedValue({ state: "prompt" }) },
    });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });

    await requestMicrophonePermission();

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(stop).toHaveBeenCalledOnce();

    (window as Window & { median?: unknown }).median = originalMedian;
    Object.defineProperty(navigator, "permissions", { configurable: true, value: originalPermissions });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMediaDevices });
  });

  it("stops before capture only after a confirmed permanent denial", async () => {
    const originalPermissions = navigator.permissions;
    const originalMediaDevices = navigator.mediaDevices;
    const getUserMedia = vi.fn();
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: { query: vi.fn().mockResolvedValue({ state: "denied" }) },
    });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });

    await expect(requestMicrophonePermission()).rejects.toMatchObject({ name: "NotAllowedError" });
    expect(getUserMedia).not.toHaveBeenCalled();

    Object.defineProperty(navigator, "permissions", { configurable: true, value: originalPermissions });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMediaDevices });
  });

  it("requires HTTPS before asking Chrome for microphone capture", async () => {
    const originalMediaDevices = navigator.mediaDevices;
    const getUserMedia = vi.fn();
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: false });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });

    await expect(requestMicrophonePermission()).rejects.toMatchObject({ name: "SecurityError" });
    expect(getUserMedia).not.toHaveBeenCalled();

    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMediaDevices });
  });

  it("uses Median's native permission bridge before probing the WebView microphone", async () => {
    const originalMedian = (window as Window & { median?: unknown }).median;
    const originalMediaDevices = navigator.mediaDevices;
    const requestPermission = vi.fn().mockResolvedValue({ granted: true });
    const stop = vi.fn();
    const track = { stop, enabled: true, readyState: "live" as const };
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [track], getAudioTracks: () => [track] });

    (window as Window & { median?: unknown }).median = { backgroundAudio: { requestPermission } };
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });

    await requestMicrophonePermission();

    expect(requestPermission).toHaveBeenCalledOnce();
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(stop).toHaveBeenCalledOnce();

    (window as Window & { median?: unknown }).median = originalMedian;
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMediaDevices });
  });

  it("does not open a WebRTC stream when the native Android request is denied", async () => {
    const originalMedian = (window as Window & { median?: unknown }).median;
    const originalMediaDevices = navigator.mediaDevices;
    const getUserMedia = vi.fn();

    (window as Window & { median?: unknown }).median = { backgroundAudio: { requestPermission: vi.fn().mockResolvedValue({ granted: false }) } };
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });

    await expect(requestMicrophonePermission()).rejects.toMatchObject({ name: "NotAllowedError" });
    expect(getUserMedia).not.toHaveBeenCalled();

    (window as Window & { median?: unknown }).median = originalMedian;
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMediaDevices });
  });
});

describe("Median native app Settings bridge", () => {
  it("opens app settings only when the native bridge is present", async () => {
    const originalMedian = (window as Window & { median?: unknown }).median;
    const appSettings = vi.fn();
    (window as Window & { median?: unknown }).median = { open: { appSettings } };

    expect(canOpenNativeAppSettings()).toBe(true);
    await expect(openNativeAppSettings()).resolves.toBe(true);
    expect(appSettings).toHaveBeenCalledOnce();

    (window as Window & { median?: unknown }).median = originalMedian;
  });

  it("recognizes iPhone, iPadOS, Android, and browser environments", () => {
    expect(getClientPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("ios");
    expect(getClientPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", "MacIntel", 5)).toBe("ios");
    expect(getClientPlatform("Mozilla/5.0 (Linux; Android 14)")).toBe("android");
    expect(getClientPlatform("Mozilla/5.0 (X11; Linux x86_64)")).toBe("web");
  });
});
