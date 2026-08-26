import { Capacitor, registerPlugin } from "@capacitor/core";

/**
 * Requests the microphone permission before a WebRTC/Vapi session is created.
 *
 * Median's Android bridge is used when the Background Audio capability is
 * enabled in App Studio. The WebView capture check remains necessary because
 * Vapi receives its audio from WebRTC, not from the Background Audio plugin.
 */
type MedianMicrophonePermission = {
  granted?: boolean;
};

type MedianBridge = {
  backgroundAudio?: {
    requestPermission?: () => Promise<MedianMicrophonePermission>;
  };
};

export type MicrophonePermissionState = PermissionState | null;

type NativeMicrophonePermissionResult = {
  state?: PermissionState | "prompt-with-rationale";
};

type NativeMicrophonePermissionPlugin = {
  check: () => Promise<NativeMicrophonePermissionResult>;
  request: () => Promise<NativeMicrophonePermissionResult>;
};

const capacitorMicrophonePermission = registerPlugin<NativeMicrophonePermissionPlugin>("MicrophonePermission");
let inFlightMicrophoneRequest: Promise<void> | null = null;

function getMedianBridge(): MedianBridge | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { median?: MedianBridge }).median;
}

function permissionDeniedError(): DOMException {
  return new DOMException("Android runtime microphone permission was denied.", "NotAllowedError");
}

function webViewPermissionError(): DOMException {
  return new DOMException("Android WebView denied microphone capture after Android permission was granted.", "NotAllowedError");
}

function insecureContextError(): DOMException {
  return new DOMException("Microphone capture requires a secure HTTPS connection.", "SecurityError");
}

function isCapacitorAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
}

/**
 * Some released HajCare shells expose Median's native bridge instead of the
 * Capacitor platform marker. They are still Android WebViews, so treating them
 * as ordinary browsers makes `navigator.permissions` a false source of truth
 * and prevents the native audio request from ever running.
 */
function isMedianAndroid(): boolean {
  return typeof navigator !== "undefined"
    && /Android/i.test(navigator.userAgent)
    && typeof getMedianBridge()?.backgroundAudio?.requestPermission === "function";
}

function isNativeAndroidHost(): boolean {
  return isCapacitorAndroid() || isMedianAndroid();
}

function normalizePermissionState(state: NativeMicrophonePermissionResult["state"]): MicrophonePermissionState {
  if (state === "granted" || state === "denied" || state === "prompt") return state;
  // Android's rationale state means that another in-app request is still
  // possible, not that a pilgrim must be sent to system Settings.
  if (state === "prompt-with-rationale") return "prompt";
  return null;
}

/**
 * Reads the browser/WebView microphone permission without triggering a prompt.
 * A missing or unsupported Permissions API is deliberately treated as unknown:
 * getUserMedia is then allowed to show the platform prompt.
 */
export async function getMicrophonePermissionState(): Promise<MicrophonePermissionState> {
  if (isCapacitorAndroid()) {
    try {
      const state = normalizePermissionState((await capacitorMicrophonePermission.check()).state);
      console.info("[microphone-permission]", { platform: "capacitor-android", stage: "native-check", state });
      return state;
    } catch {
      // Fall back to getUserMedia. A failed bridge must never produce a false
      // permanent-denial screen in the native app.
      return null;
    }
  }

  // Median's bridge does not expose a reliable non-prompting state check.
  // Returning unknown lets its native request run; WebView's Permissions API
  // is deliberately not consulted because it may contain a stale denial.
  if (isMedianAndroid()) return null;

  if (!navigator.permissions?.query) return null;

  try {
    const permission = await navigator.permissions.query({ name: "microphone" as PermissionName });
    console.info("[microphone-permission]", { platform: "web", stage: "permissions-api", state: permission.state });
    return permission.state;
  } catch {
    return null;
  }
}

/**
 * Prompts for Android's native microphone permission where available, then
 * verifies that this WebView can actually capture audio. The returned probe
 * track is always stopped; Vapi owns the real call track.
 */
async function requestMicrophonePermissionOnce(): Promise<void> {
  // getUserMedia is available only in a secure context in Chrome. Check this
  // explicitly so an HTTP deployment gets a useful recovery message instead
  // of looking like an unsupported or broken microphone.
  if (typeof window !== "undefined" && !window.isSecureContext && !isNativeAndroidHost()) {
    throw insecureContextError();
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Voice calls require a supported browser and a secure connection.");
  }

  if (isCapacitorAndroid()) {
    // Native Android state is authoritative. Do not trust WebView's
    // navigator.permissions here: it can be stale or incorrectly report
    // denied even after RECORD_AUDIO is granted.
    try {
      const nativeState = normalizePermissionState((await capacitorMicrophonePermission.request()).state);
      console.info("[microphone-permission]", { platform: "capacitor-android", stage: "native-request", state: nativeState });
      // A resolved native denial is authoritative. A bridge transport failure
      // is not: Chromium's getUserMedia below can still invoke the attached
      // WebChromeClient and request RECORD_AUDIO exactly once.
      if (nativeState === "denied") throw permissionDeniedError();
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") throw error;
      console.warn("[microphone-permission]", {
        platform: "capacitor-android",
        stage: "native-request-bridge-fallback",
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }
  const nativeRequest = getMedianBridge()?.backgroundAudio?.requestPermission;
  if ((isMedianAndroid() || (!isCapacitorAndroid() && typeof nativeRequest === "function")) && typeof nativeRequest === "function") {
    const result = await nativeRequest();
    if (!result?.granted) throw permissionDeniedError();
  } else if (!isCapacitorAndroid() && await getMicrophonePermissionState() === "denied") {
    throw permissionDeniedError();
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioTracks = stream.getAudioTracks();
    const hasLiveAudioTrack = audioTracks.some((track) => track.enabled && track.readyState === "live");
    stream.getTracks().forEach((track) => track.stop());
    if (!hasLiveAudioTrack) {
      throw new DOMException("The microphone stream did not provide a live audio track.", "NotReadableError");
    }
    console.info("[microphone-permission]", { platform: isNativeAndroidHost() ? "android-webview" : "web", stage: "capture-probe", state: "granted" });
  } catch (error) {
    console.warn("[microphone-permission]", {
      platform: isNativeAndroidHost() ? "android-webview" : "web",
      stage: "capture-probe",
      error: error instanceof DOMException ? error.name : error instanceof Error ? error.name : "unknown",
    });
    if (isNativeAndroidHost() && error instanceof DOMException && error.name === "NotAllowedError") {
      throw webViewPermissionError();
    }
    throw error;
  }
}

/**
 * One native/WebView request may be active at a time. Voice Assistant and
 * voice typing share this gate so two React surfaces can never create two
 * Android runtime prompts or competing WebView capture requests.
 */
export function requestMicrophonePermission(): Promise<void> {
  if (inFlightMicrophoneRequest) return inFlightMicrophoneRequest;
  const request = requestMicrophonePermissionOnce();
  inFlightMicrophoneRequest = request;
  return request.finally(() => {
    if (inFlightMicrophoneRequest === request) inFlightMicrophoneRequest = null;
  });
}
