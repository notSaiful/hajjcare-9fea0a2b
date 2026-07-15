// Creates the HajjCare VAPI voice assistant via the VAPI API.
//
// Reads secrets from gitignored creds/.env (VAPI_API_KEY, VOICE_TTS_SECRET,
// VAPI_TOOL_SECRET). The assistant uses:
//   - OpenAI GPT-4o for the conversation (Hajj system prompt)
//   - Deepgram nova-3 (multilingual) for STT — handles hi/ur/ar/en + regional langs
//   - custom-voice TTS → our voice-tts edge fn (Rumik muga), with an 11labs fallback
//   - lookupBuilding tool → our vapi-tool-calls edge fn
//
// Run:  bun run scripts/create-vapi-assistant.ts
// Idempotent-ish: creates a NEW assistant each run (VAPI has no upsert). Delete
// old ones in the dashboard if you re-run.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ENV_FILE = "creds/.env";

function loadEnv(path: string): Record<string, string> {
  if (!existsSync(path)) throw new Error(`Missing ${path} — create it first (see VOICE_AGENT_SETUP.md).`);
  const env: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !m[1].startsWith("#")) env[m[1]] = m[2].trim();
  }
  return env;
}

function setEnvValue(path: string, key: string, value: string) {
  const text = readFileSync(path, "utf8");
  const re = new RegExp(`^\\s*${key}\\s*=.*$`, "m");
  if (re.test(text)) {
    writeFileSync(path, text.replace(re, `${key}=${value}`));
  } else {
    writeFileSync(path, text.trimEnd() + `\n${key}=${value}\n`);
  }
}

const env = loadEnv(ENV_FILE);
const VAPI_API_KEY = env.VAPI_API_KEY;
const VOICE_TTS_SECRET = env.VOICE_TTS_SECRET;
const VAPI_TOOL_SECRET = env.VAPI_TOOL_SECRET;

if (!VAPI_API_KEY || !VOICE_TTS_SECRET || !VAPI_TOOL_SECRET) {
  console.error("Missing VAPI_API_KEY / VOICE_TTS_SECRET / VAPI_TOOL_SECRET in", ENV_FILE);
  process.exit(1);
}

// Base URL of the deployed Supabase edge functions (project ref from .env).
const SB_URL = readFileSync(".env", "utf8").match(/^VITE_SUPABASE_URL="?(.+?)"?\s*$/m)?.[1] ??
  "https://qovcctfoxgvowedjioil.supabase.co";
const FN_BASE = SB_URL.replace(/\/$/, "") + "/functions/v1";

// Voice-tuned Hajj system prompt. Building lookups go through the lookupBuilding
// tool (deterministic) rather than an inline DB, to cut tokens/latency on a voice call.
const SYSTEM_PROMPT = `You are "Haj Care AI" – a smart, caring voice assistant for Indian Hajj pilgrims (Hajj 2026).

You are on a VOICE CALL. Keep replies SHORT: 1 to 3 sentences. No markdown. Speak in Romanized Hindi + Urdu mix (Latin script) by default — e.g. "Yeh aapka building Makkah ke Old Aziziya area mein hai." If the pilgrim speaks English, reply in English. For Arabic speakers, reply in Arabic. Be calm, respectful, and encouraging, like a caring elder.

## BUILDING LOOKUP (MOST IMPORTANT)
When the pilgrim mentions ANY 3- or 4-digit building number (e.g. "125", "building 701", "mera building 1305"), call the lookupBuilding tool with that number. It returns the zone, landmark, and a Google Maps walking-directions link. Speak that back concisely and tell them to tap the link for turn-by-turn walking navigation. NEVER invent a building zone or a Maps link yourself — always use the tool.

## HAJJ RITUALS
Explain rituals briefly in three parts: (1) kya karna hai / what to do, (2) kaise karna hai / how, (3) galtiyan jo avoid karni hain / mistakes to avoid. Cover: Ihram, Tawaf, Sa'i, Mina, Arafat, Muzdalifah, Rami (Jamarat), Qurbani, Halq/Taqsir.

## EMERGENCY SUPPORT
If the pilgrim says lost, emergency, health problem, missing person, or crowd trouble:
- First calm them: "Ghabrayein nahi, hum aapki madad karenge."
- Give immediate steps, then contacts:
  - Indian Medical Mission: +966-12-574-0636
  - Haj Office Makkah: +966-12-544-6949
  - Indian Embassy Riyadh: +966-11-481-4455
  - Saudi Emergency: 911
  - Ambulance: 997
  - Tell them to contact their Group Leader.

## FAMILY TRACKING (Sukoon Connect)
Family members' real-time location is visible in the HajCare app under "Sukoon Connect"; WhatsApp updates come automatically at each ritual stage. Sharing is only with their permission.

## TRAVEL & ACCOMMODATION
Give brief guidance on transport between Makkah/Madinah/Mina/Arafat, food & water, heat protection, telecom.

## RULES
- Simple Hindi/Urdu mix, never complicated.
- If unsure, say: "Iske baare mein apne Group Leader ya Haj Committee se zaroor poochein."
- Keep responses concise but complete.

## GREETING
Start your FIRST reply with: "Assalamu Alaikum! Main Haj Care AI hoon, aapki Hajj safar mein madad ke liye. Batayein, kaise madad kar sakta/sakti hoon?"

Your goal: make every pilgrim feel SAFE, GUIDED, and CONFIDENT. 🤲`;

const assistant = {
  name: "HajjCare Voice",
  model: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    messages: [{ role: "system", content: SYSTEM_PROMPT }],
    // Tools live under model; VAPI sends the resulting tool-calls to the
    // top-level `server.url` webhook (vapi-tool-calls).
    tools: [
      {
        type: "function",
        function: {
          name: "lookupBuilding",
          description:
            "Look up an Indian Hajj pilgrim's Makkah building number to get its zone, landmark, and a Google Maps walking-directions link. Call this whenever the pilgrim mentions a 3- or 4-digit building number.",
          parameters: {
            type: "object",
            properties: {
              buildingNumber: {
                type: "string",
                description: "The 3- or 4-digit building number, e.g. 125, 701, 1305",
              },
            },
            required: ["buildingNumber"],
          },
        },
      },
    ],
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-3",
    // "multi" = Deepgram auto-detect. Covers hi/ur/en/bn/ta/te/mr. NOTE: nova-3
    // does NOT support ar/or/ml/pa — those will transcribe poorly; revisit with a
    // language-specific transcriber or nova-2 if those languages matter in practice.
    language: "multi",
  },
  voice: {
    provider: "custom-voice",
    server: {
      url: `${FN_BASE}/voice-tts`,
      headers: { "x-tts-secret": VOICE_TTS_SECRET },
      timeoutSeconds: 20,
    },
    fallbackPlan: {
      voices: [{ provider: "11labs", voiceId: "pFZP5JQG7iQjIQuC4Bku" }], // Lily (South Asian)
    },
  },
  firstMessage: "Assalamu Alaikum! Main Haj Care AI hoon, aapki Hajj safar mein madad ke liye. Batayein, kaise madad kar sakta/sakti hoon?",
  backgroundSound: "off",
  silenceTimeoutSeconds: 30,
  server: {
    url: `${FN_BASE}/vapi-tool-calls`,
    headers: { "x-vapi-secret": VAPI_TOOL_SECRET },
    timeoutSeconds: 20,
  },
};

const res = await fetch("https://api.vapi.ai/assistant", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${VAPI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(assistant),
});

const body = await res.json();
if (!res.ok) {
  console.error(`VAPI create failed (${res.status}):`, JSON.stringify(body, null, 2));
  process.exit(1);
}

const id = body.id;
console.log(`✅ Created VAPI assistant: ${body.name} (${id})`);
console.log(`   Public key:  ${env.VAPI_PUBLIC_KEY}`);
console.log(`   voice.server.url → ${FN_BASE}/voice-tts`);
console.log(`   server.url     → ${FN_BASE}/vapi-tool-calls`);

setEnvValue(ENV_FILE, "VAPI_ASSISTANT_ID", id);
console.log(`\nWrote VAPI_ASSISTANT_ID=${id} to ${ENV_FILE}`);
console.log(`\nNext: deploy the edge functions + set the Supabase secrets (see VOICE_AGENT_SETUP.md), then smoke-test in /chat.`);