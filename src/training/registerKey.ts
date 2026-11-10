import { trainingPublishableKey } from "./publicKey";

/** Login-free training registration stays on hajjcare-live. The URL is not taken from the main site env. */
export const TRAINING_REGISTER_ORIGIN = "https://vvbbwlfzpfvgyweeggvw.supabase.co";

export function trainingRegisterConfigSource(publishableKey: string | undefined): string {
  const key = trainingPublishableKey(publishableKey);
  return `window.__HC_TRAINING_REGISTER_CONFIG=${JSON.stringify({
    url: TRAINING_REGISTER_ORIGIN,
    publishableKey: key,
  })};\n`;
}
