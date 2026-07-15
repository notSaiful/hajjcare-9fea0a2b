# Voice Agent — VAPI + Rumik `muga` (setup guide)

> **Status (2026-07-15):** Code complete, build green, typecheck clean. The VAPI
> assistant **`881e1562-e37f-4eed-996c-ae57ddc0b4f0`** ("HajjCare Voice") is created.
> Secrets live in **gitignored `creds/.env`**. ⚠ **Rotate the Rumik key and the VAPI
> private key** — they were pasted in chat (Rumik: playground.rumik.ai/api-keys;
> VAPI: dashboard.vapi.ai → API keys). Remaining steps: **set Supabase secrets +
> deploy the 4 edge functions + smoke-test** (Section 3–4). **ALL voice in the app is
> now Rumik** — both the conversational agent and per-message read-aloud.

HajjCare's voice agent answers pilgrim queries by voice, speaking in **Rumik `muga`**
(expressive, Hinglish-first). Because **Rumik is TTS-only — it cannot listen**, the
pipeline is:

```
pilgrim speaks
  → VAPI Deepgram STT (transcribe, multilingual)
  → VAPI GPT-4o LLM (Hajj system prompt + lookupBuilding tool)
  → Rumik muga TTS  (our voice-tts edge fn proxies silk-api.rumik.ai → raw PCM)
  → pilgrim hears the Rumik voice
        ↑ barge-in / turn-taking handled by VAPI
```

VAPI owns STT + LLM + transport + barge-in. Rumik owns the **output voice only**,
reached through VAPI's `custom-voice` webhook (VAPI POSTs the text, we return PCM).
This is the same pattern already running live on Agentive (`agentivecre.com`).

---

## What was built

| File | Purpose |
|------|---------|
| `supabase/functions/voice-tts/index.ts` | VAPI custom-voice TTS proxy → Rumik `muga`. Validates `x-tts-secret`, calls `POST https://silk-api.rumik.ai/v1/tts`, parses the 24 kHz mono WAV, resamples to VAPI's requested rate, returns raw int16-LE PCM (`application/octet-stream`). 503 on any failure → VAPI `fallbackPlan` takes over. Also serves `GET /voice-tts` (health). |
| `supabase/functions/vapi-tool-calls/index.ts` | VAPI tool-call webhook. Exposes `lookupBuilding(buildingNumber)` — deterministic Makkah building-zone + Google Maps walking link (the one fact that must never be hallucinated). Acknowledges non-tool-call messages (status/end-of-call) with 200. |
| `supabase/functions/vapi-config/index.ts` | Auth-gated (user JWT) endpoint returning the **public** VAPI key + assistant id to the browser. Same secure pattern as the old `elevenlabs-agent-token`. |
| `supabase/functions/rumik-tts/index.ts` | **Browser read-aloud TTS** → Rumik `muga`. Auth-gated (user JWT), returns the 24 kHz WAV directly (`audio/wav`) for `<audio>` blob-URL playback. Replaces `elevenlabs-tts`. |
| `src/hooks/useVapiCall.ts` | Browser hook: drives the VAPI web call (start/end/mute), surfaces speaking/listening/transcript. Ported from the Agentive `useVapiCall`. |
| `src/hooks/useTextToSpeech.ts` | Rewritten — **every** language now reads aloud via Rumik (`rumik-tts`); Web Speech kept only as a last-resort fallback when Rumik/network is down. Was ElevenLabs-for-regional + Web-Speech-for-English. |
| `src/components/VoiceAssistant.tsx` | ChatPage "Voice" tab mic button — now uses `useVapiCall` (was `@elevenlabs/react`). |
| `src/components/HelpButton.tsx` | `/help`, WelcomeScreen, health-card voice button — now uses `useVapiCall`. |
| `scripts/create-vapi-assistant.ts` | One-off: creates the HajjCare VAPI assistant via the API (reads `creds/.env`). Run with `bun run scripts/create-vapi-assistant.ts`. |
| `supabase/config.toml` | Registered `voice-tts`, `vapi-tool-calls`, `vapi-config`, `rumik-tts` (all `verify_jwt = false` — auth is via the `x-tts-secret` / `x-vapi-secret` header / user JWT inside the function). |

**Removed:** `@elevenlabs/react` dependency (no longer imported anywhere). The old
`elevenlabs-agent-token` and `elevenlabs-tts` edge functions are now unused by the
frontend — safe to delete once you confirm; `ELEVENLABS_API_KEY` secret can go too.

**Verified:** `bun run build` ✓ green · `tsc --noEmit` ✓ clean · `eslint` ✓ no errors in any new/modified file. (The 235 pre-existing lint errors in other edge functions / `tailwind.config.ts` are unrelated and predate this work.)

---

## 1. Supabase edge-function secrets

Set these as **Supabase secrets** (Dashboard → Project Settings → Edge Functions → Secrets, or `supabase secrets set ...`). Never put them in `.env` / frontend.

| Secret | Value | Notes |
|--------|-------|-------|
| `RUMIK_API_KEY` | `rk_live_…` | From <https://playground.rumik.ai/api-keys>. ⚠ If a key was ever pasted in a transcript, treat it as compromised — rotate. |
| `RUMIK_MODEL` | `muga` | `muga` (expressive, Hinglish-first) or `mulberry` (faster). |
| `VOICE_TTS_SECRET` | any long random string | Shared secret VAPI sends as `x-tts-secret`. If left **unset**, the `voice-tts` function skips the check (dev only — set it in prod). |
| `VAPI_TOOL_SECRET` | any long random string | Shared secret VAPI sends as `x-vapi-secret` to `vapi-tool-calls`. Same dev/prod note. |
| `VAPI_PUBLIC_KEY` | `pk_…` | **Public** (browser-safe) — from VAPI dashboard. |
| `VAPI_ASSISTANT_ID` | `…` | The assistant id you create in step 2. |

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
    "provider": "custom-voice",
    "server": {
      "url": "https://<YOUR_SUPABASE_PROJECT>.functions.supabase.co/voice-tts",
      "timeoutSeconds": 20,
      "headers": { "x-tts-secret": "<VOICE_TTS_SECRET>" }
    },
    "fallbackPlan": {
      "voices": [
        { "provider": "11labs", "voiceId": "<any ElevenLabs voice you have>" }
        // or { "provider": "vapi", "voiceId": "Emma" } if no ElevenLabs
      ]
    }
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
- **`voice.server.headers`** is the officially-supported way to send the `x-tts-secret`
  to our proxy (VAPI custom-voice `server` accepts a `headers` object). The legacy
  `secret` field is also available but our function reads `x-tts-secret` specifically.
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

# 2. Deploy the four edge functions:
supabase functions deploy voice-tts
supabase functions deploy vapi-tool-calls
supabase functions deploy vapi-config
supabase functions deploy rumik-tts
```

If you deploy via the Supabase Dashboard instead, upload each folder under
`supabase/functions/<name>/` and add the secrets in Project Settings.

Deployed function URLs (project ref `vvbbwlfzpfvgyweeggvw`):
- `https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/voice-tts`
- `https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/vapi-tool-calls`
- `https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/vapi-config`
- `https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/rumik-tts`

The VAPI assistant (`881e1562-…`) is already configured to call `voice-tts` and
`vapi-tool-calls` at these URLs, so once deployed it works without any VAPI-side change.

---

## 4. Verify

1. **TTS proxy health** (no auth):
   ```bash
   curl https://<PROJECT>.functions.supabase.co/voice-tts
   # → {"status":"ok","provider":"rumik","model":"muga","apiKeyConfigured":true,"secretConfigured":true}
   ```
2. **TTS synthesis** (set the secret header):
   ```bash
   curl -X POST https://<PROJECT>.functions.supabase.co/voice-tts \
     -H 'content-type: application/json' \
     -H 'x-tts-secret: <VOICE_TTS_SECRET>' \
     -d '{"message":{"text":"Assalamu Alaikum, kaise madad kar sakta hoon?","sampleRate":24000}}' \
     --output rumik.pcm
   # → 24000*2 bytes (raw int16 LE). Play with: ffplay -f s16le -ar 24000 -ac 1 rumik.pcm
   ```
3. **Wrong secret → 401**, **missing `RUMIK_API_KEY` → 503** (fallbackPlan path).
4. **Frontend smoke test:** sign in → open `/chat` → Voice tab → tap mic → say
   "mera building 701 kahan hai" → you should hear Rumik `muga` answer with the
   zone + Maps link (via the `lookupBuilding` tool).

---

## 5. Cleanup / notes

- `@elevenlabs/react` (the conversational SDK) is **no longer imported anywhere**
  in `src/`. It can be removed (`bun remove @elevenlabs/react`) once you confirm
  nothing else needs it. The per-message **read-aloud** TTS (`useTextToSpeech` +
  the `elevenlabs-tts` edge fn) is a *separate* feature and still uses ElevenLabs
  server-side — leave it, or swap it to Rumik later as an optional follow-up.
- The old `elevenlabs-agent-token` edge function is now unused by the frontend.
  You can leave it (harmless) or delete it.
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
- **TTS voice coverage:** Rumik `muga` is Hinglish-first (hi/ur/en). Quality on
  `ar/ta/te/mr/bn/or/ml/pa` is **unverified**. Test the read-aloud + agent in
  each language; if regional languages are weak, route them to `mulberry` with a
  per-language `description` (add a `RUMIK_LANG_CONFIG` env map in `rumik-tts`
  + `voice-tts`). The conversational agent always uses `muga` regardless of
  language (VAPI custom-voice is one voice per assistant).
- **Per-utterance billing:** Rumik charges per character even on
  interrupt/cancel; barge-in still bills. Watch usage.

## Architecture rationale (why VAPI)

Rumik is TTS-only — it has no STT/understanding API (its "Peek/Mesh" layers are
marketing for its consumer companion Ira, not public developer APIs). Rumik's
own voice-agent docs pair Rumik TTS with your own STT (Deepgram) + LLM (OpenAI)
inside LiveKit or Pipecat. We chose **VAPI custom-voice** instead because it is
the exact pattern already running live for Agentive — proven, low-risk — and the
Rumik TTS proxy ports cleanly into a Supabase edge function (Deno), matching this
app's backend model. VAPI gives production-grade barge-in/turn-taking and the
Hajj "brain" stays the existing `hajj-chat` system prompt + a deterministic
`lookupBuilding` tool, so the building/Maps facts are never hallucinated.