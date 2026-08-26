# Voice Agent — Vapi managed voice (setup guide)

> **Status (2026-07-15):** Code complete, build green, typecheck clean. The VAPI
> assistant **`881e1562-e37f-4eed-996c-ae57ddc0b4f0`** ("HajjCare Voice") is created.
> Secrets live in **gitignored `creds/.env`**. ⚠ **Rotate the VAPI
> private key** — keep all provider keys out of chat transcripts.
> VAPI: dashboard.vapi.ai → API keys). Remaining steps: **set Supabase secrets +
> deploy the required edge functions + smoke-test** (Section 3–4). The conversational
> agent uses Vapi's managed voice; the separate read-aloud feature remains independent.

HajjCare's voice agent answers pilgrim queries through Vapi's managed voice pipeline:

```
pilgrim speaks
  → VAPI Deepgram STT (transcribe, multilingual)
  → VAPI GPT-4o LLM (Hajj system prompt + lookupBuilding tool)
  → Vapi managed TTS (Emma V2, feminine realistic voice)
  → pilgrim hears the Vapi-managed Emma V2 voice
        ↑ barge-in / turn-taking handled by VAPI
```

Vapi owns STT, LLM, TTS, transport, and barge-in. No Rumik service is used in a
voice-agent call.
This is the same pattern already running live on Agentive (`agentivecre.com`).

---

## What was built

| File | Purpose |
|------|---------|
| `supabase/functions/vapi-tool-calls/index.ts` | VAPI tool-call webhook. Exposes `lookupBuilding(buildingNumber)` — deterministic Makkah building-zone + Google Maps walking link (the one fact that must never be hallucinated). Acknowledges non-tool-call messages (status/end-of-call) with 200. |
| `supabase/functions/vapi-config/index.ts` | Public endpoint returning the browser-safe VAPI key + assistant id, allowing pilgrims to use voice help without signing in. Provider and webhook secrets remain server-side. |
| `supabase/functions/rumik-tts/index.ts` | **Browser read-aloud TTS** → Rumik `muga`. Auth-gated (user JWT), returns the 24 kHz WAV directly (`audio/wav`) for `<audio>` blob-URL playback. |
| `src/hooks/useVapiCall.ts` | Browser hook: drives the VAPI web call (start/end/mute), surfaces speaking/listening/transcript. Ported from the Agentive `useVapiCall`. |
| `src/hooks/useTextToSpeech.ts` | Rewritten — **every** language now reads aloud via Rumik (`rumik-tts`); Web Speech kept only as a last-resort fallback when Rumik/network is down. Was ElevenLabs-for-regional + Web-Speech-for-English. |
| `src/components/VoiceAssistant.tsx` | ChatPage "Voice" tab mic button — now uses `useVapiCall` (was `@elevenlabs/react`). |
| `src/components/HelpButton.tsx` | `/help`, WelcomeScreen, health-card voice button — now uses `useVapiCall`. |
| `scripts/create-vapi-assistant.ts` | One-off: creates the HajjCare VAPI assistant via the API (reads `creds/.env`). Run with `bun run scripts/create-vapi-assistant.ts`. |
| `supabase/config.toml` | Registers the Vapi webhook and public config endpoints. The webhook requires `x-vapi-secret`; the public config endpoint permits only configured app origins. |

**Removed:** `@elevenlabs/react`, `elevenlabs-agent-token`, and `elevenlabs-tts`.
The legacy ElevenLabs server functions are no longer part of this project; remove
any unused `ELEVENLABS_API_KEY` secret from Supabase.

**Verified:** `bun run build` ✓ green · `tsc --noEmit` ✓ clean · `eslint` ✓ no errors in any new/modified file. (The 235 pre-existing lint errors in other edge functions / `tailwind.config.ts` are unrelated and predate this work.)

---

## 1. Supabase edge-function secrets

Set these as **Supabase secrets** (Dashboard → Project Settings → Edge Functions → Secrets, or `supabase secrets set ...`). Never put them in `.env` / frontend.

| Secret | Value | Notes |
|--------|-------|-------|
| `RUMIK_API_KEY` | `rk_live_…` | From <https://playground.rumik.ai/api-keys>. ⚠ If a key was ever pasted in a transcript, treat it as compromised — rotate. |
| `RUMIK_MODEL` | `muga` | `muga` (expressive, Hinglish-first) or `mulberry` (faster). |
| `VAPI_TOOL_SECRET` | any long random string | Shared secret VAPI sends as `x-vapi-secret` to `vapi-tool-calls`. Same dev/prod note. |
| `VAPI_PUBLIC_KEY` | `pk_…` | **Public** (browser-safe) — from VAPI dashboard. |
| `VAPI_ASSISTANT_ID` | `…` | The assistant id you create in step 2. |
| `APP_ALLOWED_ORIGINS` | `https://hajjcare.in,https://www.hajjcare.in` | Comma-separated browser origins allowed to obtain public Vapi config. |

> `SUPABASE_URL` and `SUPABASE_ANON_KEY` are already available to edge functions automatically.

---

## 2. Create the VAPI assistant

In the VAPI dashboard (or via the API), create an assistant with this shape. The
system prompt is **synced from `supabase/functions/hajj-chat/index.ts`** (`getSystemPrompt`)
so the voice agent answers exactly like the existing text chat — building lookup,
ritual steps, emergency contacts, multilingual (Hindi/Urdu/English/Arabic).

```jsonc
{
  "name": "HajjCare Voice",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.7,
    "messages": [
      {
        "role": "system",
        "content": "<PASTE the full getSystemPrompt('hi') output from hajj-chat/index.ts — the Hajj Care AI system prompt, including the building DB reference, ritual format, emergency contacts, rules, and the Assalamu Alaikum greeting>"
      }
    ]
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-3",
    "language": "multi"            // auto-detect. Covers hi/ur/en/bn/ta/te/mr.
  },
  "voice": {
    "provider": "vapi",
    "voiceId": "Emma",
    "version": 2
  },
  "firstMessage": "Assalamu Alaikum! 🕋 Main Haj Care AI hoon, aapki Hajj safar mein madad ke liye. Batayein, kaise madad kar sakta/sakti hoon?",
  "backgroundSound": "off",
  "silenceTimeoutSeconds": 30,
  "server": {
    "url": "https://<YOUR_SUPABASE_PROJECT>.functions.supabase.co/vapi-tool-calls",
    "timeoutSeconds": 20,
    "headers": { "x-vapi-secret": "<VAPI_TOOL_SECRET>" }
  },
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "lookupBuilding",
        "description": "Look up an Indian Hajj pilgrim's Makkah building number to get its zone, landmark, and a Google Maps walking-directions link. Call this whenever the pilgrim mentions a 3- or 4-digit building number.",
        "parameters": {
          "type": "object",
          "properties": {
            "buildingNumber": { "type": "string", "description": "The 3- or 4-digit building number, e.g. 125, 701, 1305" }
          },
          "required": ["buildingNumber"]
        }
      }
    }
  ]
}
```

Notes:
- **`server.headers`** sends `x-vapi-secret` to the tool webhook. This secret is required; the webhook intentionally fails closed if it is absent or incorrect.
- **`server.url`** (assistant-level) is where VAPI sends tool-call + call-event
  webhooks; `vapi-tool-calls` handles `lookupBuilding` and acks everything else.
- Put the assistant's VAPI-assistant id into the `VAPI_ASSISTANT_ID` Supabase secret
  once created.

---

## 3. Deploy the edge functions + set secrets

The secrets are already in **`creds/.env`** (gitignored). Set them on Supabase and deploy:

```bash
# from project root — requires `supabase login` + `supabase link --project-ref vvbbwlfzpfvgyweeggvw`
# 1. Set secrets (values already in creds/.env):
supabase secrets set --env-file creds/.env
#   (or set each in Dashboard → Project Settings → Edge Functions → Secrets)

# 2. Deploy the Vapi edge functions:
supabase functions deploy vapi-tool-calls
supabase functions deploy vapi-config
```

If you deploy via the Supabase Dashboard instead, upload each folder under
`supabase/functions/<name>/` and add the secrets in Project Settings.

Deployed function URLs (project ref `vvbbwlfzpfvgyweeggvw`):
- `https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/vapi-tool-calls`
- `https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/vapi-config`

The VAPI assistant (`881e1562-…`) is configured to use Vapi's managed Emma V2 voice and
`vapi-tool-calls` at these URLs, so once deployed it works without any VAPI-side change.

---

## 4. Verify

1. **Webhook secret:** POST a tool-call with a wrong `x-vapi-secret` and confirm it returns 401; a missing secret configuration must return 503.
2. **Frontend smoke test:** open `/chat` → Voice tab → tap mic → say
   "mera building 701 kahan hai" → you should hear the Vapi-managed Emma voice answer with the zone + Maps link (via the `lookupBuilding` tool).

---

## 5. Cleanup / notes

- The legacy ElevenLabs conversational and read-aloud functions have been removed.
  Vapi provides the voice-agent experience; the separate authenticated browser
  read-aloud feature uses `rumik-tts`.
- `.env` is committed but contains only the publishable Supabase key (safe).
  Consider adding `.env` to `.gitignore` as good hygiene.
- `package-lock.json` was an untracked stray (the project uses `bun.lock`); it
  was removed during the clean reinstall that fixed the esbuild version drift.

---

## Known limitations (to test + revisit)

- **STT:** Deepgram `nova-3` supports `hi, ur, en, bn, ta, te, mr` but **not**
  `ar, or, ml, pa`. With `language: "multi"`, those will transcribe poorly. If
  Arabic/Malayalam/Oriya/Punjabi pilgrims are a real segment, switch the
  transcriber to `nova-2` (broader language list incl. `ar`) or add a
  language-specific assistant per language.
- **Voice coverage:** verify Vapi's selected voice and Deepgram transcription with Hindi, Urdu, English, and Arabic pilot calls before launch. Regional-language quality must be measured, not assumed.
- **Per-call billing:** monitor Vapi usage and configure provider-side spend limits before public release.

## Architecture rationale (why VAPI)

Vapi provides the conversational runtime: speech recognition, turn-taking,
LLM orchestration, and its managed feminine voice. The Haj knowledge layer stays
in the assistant prompt plus the deterministic `lookupBuilding` tool, so building
and Maps facts are never invented by the model.
