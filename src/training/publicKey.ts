import { TRAINING_SUPABASE_ORIGIN } from "./project";

/** Accept only a browser publishable/anon key. Never a service role key. */
export function trainingPublishableKey(raw: string | undefined): string {
  const key = (raw ?? "").trim();
  if (!key) return "";
  if (key.length > 2000 || key.startsWith("sb_secret_") || /service_role/i.test(key)) {
    throw new Error("Refusing a service role key for training enrollment.");
  }
  if (key.startsWith("sb_publishable_")) return key;
  if (key.startsWith("eyJ")) {
    const role = jwtRole(key);
    if (role === "service_role") {
      throw new Error("Refusing a service role key for training enrollment.");
    }
    if (role !== "anon") {
      throw new Error("Training client key must be the anon or publishable key.");
    }
    return key;
  }
  throw new Error("Training client key must be a publishable key.");
}

function jwtRole(token: string): string | null {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const base = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base + "=".repeat((4 - (base.length % 4)) % 4);
    const json = JSON.parse(atob(padded)) as { role?: unknown };
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}

export function trainingConfigSource(publishableKey: string): string {
  const key = trainingPublishableKey(publishableKey);
  return `window.__HC_TRAINING_CONFIG=${JSON.stringify({
    url: TRAINING_SUPABASE_ORIGIN,
    publishableKey: key,
  })};\n`;
}
