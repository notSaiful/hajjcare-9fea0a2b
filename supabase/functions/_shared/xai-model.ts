export const XAI_CHAT_COMPLETIONS_URL = "https://api.x.ai/v1/chat/completions";
export const DEFAULT_XAI_MODEL = "grok-4.3";
export const DEFAULT_XAI_FALLBACK_MODEL = "grok-4.20-0309-non-reasoning";

export function resolveXaiModels(env: { XAI_MODEL?: string; XAI_FALLBACK_MODEL?: string }) {
  const model = env.XAI_MODEL?.trim() || DEFAULT_XAI_MODEL;
  const configuredFallback = env.XAI_FALLBACK_MODEL?.trim() || DEFAULT_XAI_FALLBACK_MODEL;
  return {
    model,
    fallback: configuredFallback === model ? null : configuredFallback,
  };
}

/** True when the provider rejected the model name, so one fallback attempt is worthwhile. */
export function isUnknownModelError(status: number, body: string): boolean {
  if (status === 404) return true;
  if (status !== 400 && status !== 422) return false;
  return /model/i.test(body) && /not found|does not exist|invalid|unknown|unsupported|unavailable|no such/i.test(body);
}

export function redactSecrets(value: string): string {
  return value
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/xai-[A-Za-z0-9_-]+/g, "[redacted]")
    .slice(0, 300);
}
