# HajjCare

Hajj & Umrah pilgrim companion app — guidance, location safety, health triage,
multilingual support (11 languages incl. RTL Arabic/Urdu), and a voice agent for
hands-free help in Makkah. Built for Indian pilgrims, offline-first for the
Hajj crowd-density reality.

> This is a standalone project. It is **not** built on or deployed through
> Lovable — all Lovable dependencies (auth SDK, dev tooling, AI gateway) have
> been removed. Source of truth is this Git repo + your own Supabase project.

## Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **State/data**: @tanstack/react-query, react-router-dom v7
- **Backend**: Supabase (Postgres + Auth + Edge Functions / Deno)
- **LLM**: any OpenAI-compatible chat-completions endpoint (defaults to
  OpenRouter). Set `LLM_BASE_URL` + `LLM_API_KEY` + model per function.
- **Voice agent**: VAPI (STT via Deepgram + LLM) + Rumik `muga` TTS via a
  custom-voice webhook. See [`VOICE_AGENT_SETUP.md`](./VOICE_AGENT_SETUP.md).
- **Maps**: Mapbox
- **Package manager**: [bun](https://bun.sh) (lockfile is `bun.lock`)

## Quick start

```sh
# 1. Install deps
bun install

# 2. Frontend env (public Supabase values — safe for the browser)
cp .env.example .env
#   then fill in:
#     VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
#     VITE_SUPABASE_PROJECT_ID="<project-ref>"
#     VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."

# 3. Run the dev server
bun run dev
```

Edge-function **secrets** (RUMIK_API_KEY, VAPI keys, LLM_API_KEY, etc.) do NOT
go in `.env` — set them in Supabase (Dashboard → Project Settings → Edge
Functions → Secrets) or via `supabase secrets set`. See
[`VOICE_AGENT_SETUP.md`](./VOICE_AGENT_SETUP.md) for the full secret list.

## Build & verify

```sh
bun run build      # production build
bun run lint       # eslint
# type-check (if added): npx tsc --noEmit
```

## Backend (Supabase)

This repo contains the full schema (`supabase/migrations/`) and all edge
functions (`supabase/functions/`). Link it to your own Supabase project and
deploy:

```sh
supabase link --project-ref <your-project-ref>
supabase db push                                   # apply migrations
supabase functions deploy --all                    # deploy edge functions
supabase secrets set --env-file <your-secrets.env> # set function secrets
```

### LLM configuration (replaces the old Lovable AI gateway)

Edge functions call an OpenAI-compatible `/chat/completions` endpoint. Each
function reads:

- `LLM_API_KEY` — bearer token (required)
- `LLM_BASE_URL` — defaults to `https://openrouter.ai/api/v1`
- model strings are OpenRouter-format (e.g. `google/gemini-2.5-flash`,
  `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`)

To use a different provider (OpenAI, Ollama Cloud, etc.), set `LLM_BASE_URL`
accordingly and adjust model strings to that provider's naming.

## Voice agent

Conversational voice help: VAPI handles speech-to-text (Deepgram `nova-3`,
`language: "multi"`) + the LLM; the TTS leg is a custom-voice webhook that
synthesizes with Rumik's `muga` voice (Hinglish-first). Per-message read-aloud
TTS in the UI also routes through Rumik. Full setup (assistant config,
secrets, deploy + verify steps):
[`VOICE_AGENT_SETUP.md`](./VOICE_AGENT_SETUP.md).

## Project layout

```
src/                  # React app (pages, components, hooks, contexts, i18n)
supabase/
  migrations/         # ~95 SQL migrations (55 typed tables, RLS, RPCs)
  functions/          # ~40 Deno edge functions
  config.toml         # Supabase project config (project_id = your ref)
scripts/              # setup helpers (e.g. create-vapi-assistant.ts)
creds/                # LOCAL secrets only — gitignored, never committed
.env                  # frontend env (public) — gitignored
.env.example          # template for .env
```

## License & intent

Built as a service for Hajj/Umrah pilgrims. Truthfulness (sidq) and
Shariah-compliance are project principles — no fabricated content, no
riba/gharar/maysir in any monetization.