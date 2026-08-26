import { Capacitor, registerPlugin } from "@capacitor/core";

type MedianBridge = {
  open?: {
    appSettings?: () => void | Promise<void>;
  };
};

type AppSettingsPlugin = {
  open: () => Promise<void>;
};

// Registered only inside the Capacitor Android shell. On the web this remains
// an inert proxy, so importing this helper never creates a browser dependency.
const capacitorAppSettings = registerPlugin<AppSettingsPlugin>("AppSettings");

function isCapacitorAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
}

export type ClientPlatform = "ios" | "android" | "web";

/** Identifies iPhones and iPads, including iPadOS devices that report as macOS. */
export function getClientPlatform(
  userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent,
  platform = typeof navigator === "undefined" ? "" : navigator.platform,
  maxTouchPoints = typeof navigator === "undefined" ? 0 : navigator.maxTouchPoints,
): ClientPlatform {
  if (/iPhone|iPad|iPod/i.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1)) {
    return "ios";
  }
  return /Android/i.test(userAgent) ? "android" : "web";
}

function getMedianBridge(): MedianBridge | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { median?: MedianBridge }).median;
}

/** True only when the page is running in a Median native wrapper with the Settings bridge enabled. */
export function canOpenNativeAppSettings(): boolean {
  return typeof getMedianBridge()?.open?.appSettings === "function" || isCapacitorAndroid();
}

/** Opens this app's system Settings page in a supported Median Android/iOS wrapper. */
export async function openNativeAppSettings(): Promise<boolean> {
  const openSettings = getMedianBridge()?.open?.appSettings;

  try {
    if (typeof openSettings === "function") {
      await openSettings();
    } else if (isCapacitorAndroid()) {
      await capacitorAppSettings.open();
    } else {
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Unable to open native app settings:", error);
    return false;
  }
}
