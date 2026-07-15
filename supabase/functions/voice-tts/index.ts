// Rumik TTS proxy for VAPI "custom-voice".
//
// VAPI POSTs a voice-request:
//   { message: { type: "voice-request", text, sampleRate, timestamp, call, assistant, customer } }
// and expects raw 16-bit signed LE mono PCM at the requested sampleRate,
// Content-Type: application/octet-stream. We forward the text to Rumik Silk
// (https://silk-api.rumik.ai/v1/tts) and return the PCM, resampled to the
// requested rate. On any failure we return 503 so VAPI's voice.fallbackPlan
// takes over (a built-in VAPI voice).
//
// Ported from the Agentive website proxy (website/src/app/api/voice/tts/route.ts
// + website/src/lib/rumik.ts), adapted to Deno (no node:Buffer — typed arrays).
//
// Secrets (Supabase edge-function env):
//   RUMIK_API_KEY     — rk_live_... from https://playground.rumik.ai/api-keys
//   RUMIK_MODEL       — "muga" (expressive, Hinglish-first) | "mulberry" (faster)
//   VOICE_TTS_SECRET  — shared secret VAPI sends as the `x-tts-secret` header.
//                       Optional: if unset, the header is not checked (dev only).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RUMIK_BASE_URL = "https://silk-api.rumik.ai";
const RUMIK_TEXT_LIMIT = 2000;
const RUMIK_TIMEOUT_MS = 15_000;

const VALID_SAMPLE_RATES = new Set([8000, 16000, 22050, 24000, 44100, 48000]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-tts-secret",
};

interface WavData {
  pcm: Int16Array;
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
}

/** Parse a RIFF/WAVE ArrayBuffer into raw 16-bit signed LE PCM + format info. */
function parseWav(buf: ArrayBuffer): WavData {
  const bytes = new Uint8Array(buf);
  if (bytes.length < 44) throw new Error("Rumik: WAV buffer too short");

  const ascii = (off: number, len: number) =>
    String.fromCharCode(...bytes.subarray(off, off + len));

  if (ascii(0, 4) !== "RIFF" || ascii(8, 4) !== "WAVE") {
    throw new Error("Rumik: not a RIFF/WAVE file");
  }

  const dv = new DataView(buf);
  let offset = 12;
  let fmtFound = false;
  let audioFormat = 0;
  let channels = 0;
  let sampleRate = 0;
  let bitsPerSample = 0;
  let pcm: Int16Array | null = null;

  while (offset + 8 <= bytes.length) {
    const id = ascii(offset, 4);
    const size = dv.getUint32(offset + 4, true); // little-endian
    const dataStart = offset + 8;

    if (id === "fmt ") {
      audioFormat = dv.getUint16(dataStart, true);
      channels = dv.getUint16(dataStart + 2, true);
      sampleRate = dv.getUint32(dataStart + 4, true);
      bitsPerSample = dv.getUint16(dataStart + 14, true);
      fmtFound = true;
    } else if (id === "data") {
      // 16-bit LE samples → read directly into an Int16Array view over the data chunk.
      const sampleCount = (size / 2) | 0;
      const copy = new Int16Array(sampleCount);
      for (let i = 0; i < sampleCount; i++) {
        copy[i] = dv.getInt16(dataStart + i * 2, true);
      }
      pcm = copy;
    }

    offset = dataStart + size + (size % 2); // chunks are word-aligned
  }

  if (!fmtFound) throw new Error('Rumik: WAV missing "fmt " chunk');
  if (!pcm) throw new Error('Rumik: WAV missing "data" chunk');
  if (audioFormat !== 1)
    throw new Error(`Rumik: unsupported WAV audio format ${audioFormat} (expected PCM = 1)`);
  if (bitsPerSample !== 16)
    throw new Error(`Rumik: unsupported bit depth ${bitsPerSample} (expected 16-bit)`);

  return { pcm, sampleRate, channels, bitsPerSample };
}

/** Resample raw 16-bit signed LE mono PCM between sample rates (nearest + linear). */
function resampleInt16(input: Int16Array, fromRate: number, toRate: number): Int16Array {
  if (fromRate === toRate) return input;
  if (fromRate <= 0 || toRate <= 0) throw new Error("Rumik: sample rates must be positive");

  const ratio = fromRate / toRate;
  const outCount = ((input.length / ratio) | 0) || 1;
  const out = new Int16Array(outCount);

  if (ratio > 1) {
    // Downsample: averaging window (anti-alias-ish), keeps amplitude stable.
    const halfWin = (ratio / 2) | 0;
    const lenMinus1 = input.length - 1;
    for (let i = 0; i < outCount; i++) {
      const center = (i * ratio) | 0;
      const start = center - halfWin > 0 ? center - halfWin : 0;
      const end = center + halfWin < lenMinus1 ? center + halfWin : lenMinus1;
      let sum = 0;
      for (let j = start; j <= end; j++) sum += input[j];
      const avg = sum / (end - start + 1);
      out[i] = avg < 0 ? Math.ceil(avg - 0.5) : Math.floor(avg + 0.5);
    }
  } else {
    // Upsample: linear interpolation.
    for (let i = 0; i < outCount; i++) {
      const pos = i * ratio;
      const idx = pos | 0;
      const frac = pos - idx;
      const a = input[idx] ?? 0;
      const b = input[idx + 1] ?? a;
      const val = a + (b - a) * frac;
      out[i] = val < 0 ? Math.ceil(val - 0.5) : Math.floor(val + 0.5);
    }
  }

  return out;
}

/** Synthesize text to raw 16-bit signed LE mono PCM at the requested sample rate. */
async function synthesizeToPcm(text: string, targetSampleRate: number): Promise<Int16Array> {
  if (!text || !text.trim()) return new Int16Array(1); // one silent frame

  const safeText = text.length > RUMIK_TEXT_LIMIT ? text.slice(0, RUMIK_TEXT_LIMIT) : text;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RUMIK_TIMEOUT_MS);

  try {
    const res = await fetch(`${RUMIK_BASE_URL}/v1/tts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RUMIK_API_KEY") ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: Deno.env.get("RUMIK_MODEL") || "muga",
        text: safeText,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Rumik API error (${res.status}): ${errText.slice(0, 200)}`);
    }

    const { pcm, sampleRate } = parseWav(await res.arrayBuffer());
    return sampleRate === targetSampleRate ? pcm : resampleInt16(pcm, sampleRate, targetSampleRate);
  } finally {
    clearTimeout(timer);
  }
}

interface VoiceRequestMessage {
  type?: string;
  text?: unknown;
  sampleRate?: unknown;
}
interface VoiceRequestBody {
  message?: VoiceRequestMessage;
}

async function handleTts(req: Request): Promise<Response> {
  // Shared-secret auth (VAPI sends x-tts-secret). Optional in dev.
  const secret = Deno.env.get("VOICE_TTS_SECRET");
  if (secret && req.headers.get("x-tts-secret") !== secret) {
    return new Response(null, { status: 401 });
  }
  if (!Deno.env.get("RUMIK_API_KEY")) {
    return new Response(null, { status: 503 }); // VAPI fallbackPlan takes over
  }

  let body: VoiceRequestBody;
  try {
    body = (await req.json()) as VoiceRequestBody;
  } catch {
    return new Response(null, { status: 400 });
  }

  const text = body.message?.text;
  const sampleRate = Number(body.message?.sampleRate) || 24000;

  if (typeof text !== "string" || text.length === 0) {
    return new Response(null, { status: 400 });
  }
  if (!VALID_SAMPLE_RATES.has(sampleRate)) {
    return new Response(null, { status: 400 });
  }

  try {
    const pcm = await synthesizeToPcm(text, sampleRate);
    // Int16Array → little-endian bytes (PCM is already LE; copy byte-wise).
    return new Response(pcm.buffer, {
      status: 200,
      headers: {
        "content-type": "application/octet-stream",
        "content-length": String(pcm.buffer.byteLength),
      },
    });
  } catch (err) {
    console.error("voice-tts error:", err);
    return new Response(null, { status: 503 }); // fallbackPlan
  }
}

function handleHealth(): Response {
  return new Response(
    JSON.stringify({
      status: "ok",
      provider: "rumik",
      model: Deno.env.get("RUMIK_MODEL") || "muga",
      apiKeyConfigured: !!Deno.env.get("RUMIK_API_KEY"),
      secretConfigured: !!Deno.env.get("VOICE_TTS_SECRET"),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  // GET /voice-tts  or /voice-tts?health → health check; POST → TTS.
  if (req.method === "GET" || url.searchParams.has("health")) {
    return handleHealth();
  }
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST, GET, OPTIONS" } });
  }
  return handleTts(req);
});