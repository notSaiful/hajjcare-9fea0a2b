import {
  XAI_CHAT_COMPLETIONS_URL,
  isUnknownModelError,
  redactSecrets,
  resolveXaiModels,
} from "./xai-model.ts";

export type ChatTurn = { role: string; content: string };

export type XaiErrorCopy = {
  missingKey: string;
  rateLimit: string;
  unavailable: string;
  failed: string;
  rejected: string;
};

export const GUIDE_XAI_ERRORS: XaiErrorCopy = {
  missingKey: "XAI_API_KEY is not configured. Add it as a Supabase function secret before using Zoya.",
  rateLimit: "Rate limit exceeded. Please wait.",
  unavailable: "Service temporarily unavailable.",
  failed: "Failed to get AI response",
  rejected: "The AI service rejected the request. Check that the XAI_API_KEY secret is valid.",
};

export const FAQ_XAI_ERRORS: XaiErrorCopy = {
  missingKey: "XAI_API_KEY is not configured. Add it as a Supabase function secret before using Zoya.",
  rateLimit: "Too many requests. Please wait a moment and try again.",
  unavailable: "Service temporarily unavailable. Please try again later.",
  failed: "Failed to get AI response",
  rejected: "The AI service rejected the request. Check that the XAI_API_KEY secret is valid.",
};

function jsonResponse(status: number, error: string, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function failureResponse(status: number, copy: XaiErrorCopy, corsHeaders: Record<string, string>) {
  if (status === 429) return jsonResponse(429, copy.rateLimit, corsHeaders);
  if (status === 402) return jsonResponse(402, copy.unavailable, corsHeaders);
  if (status === 401 || status === 403) return jsonResponse(500, copy.rejected, corsHeaders);
  return jsonResponse(500, copy.failed, corsHeaders);
}

async function requestCompletion(apiKey: string, model: string, messages: ChatTurn[]) {
  return await fetch(XAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });
}

/**
 * Calls xAI's OpenAI-compatible chat API and forwards the SSE body unchanged.
 * The app reads `choices[0].delta.content` and a trailing `data: [DONE]`.
 */
export async function streamZoyaCompletion(
  messages: ChatTurn[],
  corsHeaders: Record<string, string>,
  errors: XaiErrorCopy,
): Promise<Response> {
  const apiKey = Deno.env.get("XAI_API_KEY")?.trim();
  if (!apiKey) {
    console.error("XAI_API_KEY is not configured");
    return jsonResponse(503, errors.missingKey, corsHeaders);
  }

  const { model, fallback } = resolveXaiModels({
    XAI_MODEL: Deno.env.get("XAI_MODEL") ?? undefined,
    XAI_FALLBACK_MODEL: Deno.env.get("XAI_FALLBACK_MODEL") ?? undefined,
  });

  let response = await requestCompletion(apiKey, model, messages);
  if (!response.ok && fallback) {
    const errorBody = redactSecrets(await response.text());
    if (isUnknownModelError(response.status, errorBody)) {
      console.error("xAI model unavailable, trying fallback", { model, fallback, status: response.status });
      response = await requestCompletion(apiKey, fallback, messages);
    } else {
      console.error("xAI request failed", { model, status: response.status, detail: errorBody });
      return failureResponse(response.status, errors, corsHeaders);
    }
  }

  if (!response.ok) {
    const errorBody = redactSecrets(await response.text());
    console.error("xAI request failed", { status: response.status, detail: errorBody });
    return failureResponse(response.status, errors, corsHeaders);
  }

  if (!response.body) {
    console.error("xAI response had no stream body");
    return jsonResponse(500, errors.failed, corsHeaders);
  }

  return new Response(response.body, {
    headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
  });
}
