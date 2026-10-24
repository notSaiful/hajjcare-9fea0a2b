# Deploy edge functions and secrets

The frontend calls Supabase Edge Functions by name. In this repository every name it calls has a folder under `supabase/functions/`. The October 2026 audit of production got **404** for almost all of them, which means they are not deployed on the project the live site uses. A 404 is not a missing secret (that is a 500) and not a bad JWT (that is 401).

This agent cannot deploy to the owner's Supabase project or set secrets. Run the commands below on a machine where `supabase login` has been done.

## Which project

`supabase/config.toml` says `project_id = "qovcctfoxgvowedjioil"`.

The live site `https://hajjcare.in` (HTML fetched 24 Oct 2026) preconnects to **`begtqcmwruvwposocnsr.supabase.co`**, a different project. Deploy to the project in the production `VITE_SUPABASE_URL`. If you deploy to the other project, hajjcare.in will keep returning 404.

```bash
export SUPABASE_PROJECT_REF="begtqcmwruvwposocnsr"   # change if production env points elsewhere
supabase link --project-ref "$SUPABASE_PROJECT_REF"
```

Confirm with:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -X OPTIONS \
  -H "apikey: $SUPABASE_ANON_KEY" \
  "https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/get-mapbox-token"
```

404 means not deployed. 200 on OPTIONS means the function exists (it may still 503 until the secret is set).

## Secrets the owner must set

Supabase injects `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. Do not paste those into the repo.

Set the rest once. Names match `Deno.env.get` in the functions. AI functions accept **either** `LLM_API_KEY` or `LOVABLE_API_KEY` (same Lovable gateway key, `https://ai.gateway.lovable.dev`).

```bash
supabase secrets set --project-ref "$SUPABASE_PROJECT_REF" \
  MAPBOX_PUBLIC_TOKEN="pk.YOUR_URL_RESTRICTED_PUBLIC_TOKEN" \
  LLM_API_KEY="YOUR_LOVABLE_OR_LLM_GATEWAY_KEY" \
  WHATSAPP_TOKEN="YOUR_WHATSAPP_CLOUD_TOKEN" \
  WHATSAPP_PHONE_ID="YOUR_WHATSAPP_PHONE_NUMBER_ID" \
  VAPID_PUBLIC_KEY="YOUR_VAPID_PUBLIC_KEY" \
  VAPID_PRIVATE_KEY="YOUR_VAPID_PRIVATE_KEY" \
  RAZORPAY_KEY_ID="rzp_live_or_test" \
  RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_SECRET" \
  ELEVENLABS_API_KEY="YOUR_ELEVENLABS_KEY" \
  ELEVENLABS_AGENT_ID="YOUR_ELEVENLABS_AGENT_ID" \
  STREAM_API_KEY="YOUR_STREAM_KEY" \
  STREAM_API_SECRET="YOUR_STREAM_SECRET" \
  TWILIO_ACCOUNT_SID="YOUR_TWILIO_SID" \
  TWILIO_AUTH_TOKEN="YOUR_TWILIO_TOKEN" \
  TWILIO_PHONE_NUMBER="+1..." \
  CRON_SECRET="A_LONG_RANDOM_STRING"
```

| Secret | Used by | If missing |
|---|---|---|
| `MAPBOX_PUBLIC_TOKEN` | `get-mapbox-token` | Maps show a clear "not configured" error. Use a public `pk.` token restricted to `hajjcare.in`. |
| `LLM_API_KEY` or `LOVABLE_API_KEY` | `summarize-circular`, `hajj-faq-chat`, `hajj-chat`, `health-triage`, `fetch-hci-circulars`, `ai-orchestrator`, `central-ai-brain`, `admin-ai-dashboard`, `fraud-intelligence`, `national-command`, `emotional-support`, `tracking-intelligence`, `inspector-ocr` | Those calls return 500. Production `summarize-circular` already failed with "LLM_API_KEY not configured". |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` | `whatsapp-alert`, `whatsapp-api-proxy`, `send-custom-whatsapp`, `free-umrah-notify`, `notification-cascade`, `volunteer-status-notify`, `lost-found-claim-notify`, `sukoon-stage-notify` | SOS can record a ticket but no WhatsApp message is sent. The UI now says so instead of "success". |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | `get-vapid-key`, `notification-cascade`, `link-request-notify`, `fraud-alert-notify` | Web push cannot subscribe or send. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | `create-razorpay-order`, `verify-razorpay-payment` | Optional maintenance-fee payments fail. Core guides do not depend on this. |
| `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID` | `elevenlabs-tts`, `elevenlabs-agent-token` | Read-aloud and the voice agent fail. |
| `STREAM_API_KEY`, `STREAM_API_SECRET` | `stream-video-token` | `/video-call` cannot start a call. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | `notification-cascade` | SMS/voice fallback in the cascade is skipped. WhatsApp and push still run if those secrets exist. |
| `CRON_SECRET` | `fetch-hci-circulars` | Scheduled fetches that send the cron header are rejected. A signed-in admin call can still work. |

`MAPBOX_PUBLIC_TOKEN` must be a public token. The function no longer requires a logged-in user, because `/map`, `/mashair-map`, and `/madinah-hotels` are public pages. Restrict the token's URLs in Mapbox.

## Functions to deploy

Every directory under `supabase/functions/` is a function the repo owns. The frontend calls the ones marked **called**. The others are in the repo and should be deployed with the same command so admin tools and future callers do not 404.

Names the October audit mentioned that are **not** in this source and are **not** called: `vapi-config`, `rumik-tts`, `translate-start-here`, `hajj-training-registration`, `cover-id-ocr`, `publish-circular`. Do not invent those functions. Training registration and "WhatsApp verify" in this repo are database RPCs (`whatsapp_verify_and_join`), not edge functions.

| Function | Called from | Extra secrets |
|---|---|---|
| `get-mapbox-token` | maps, command center | `MAPBOX_PUBLIC_TOKEN` |
| `hajj-faq-chat` | `/hajj-faq`, `/hajj-wizard` | LLM key |
| `hajj-chat` | chat hook | LLM key |
| `health-triage` | `/help` | LLM key |
| `allocate-responder` | SOS button | service role |
| `whatsapp-alert` | SOS, health help | WhatsApp |
| `geofence-monitor` | map location pipeline | none beyond Supabase |
| `notification-cascade` | stage changes | VAPID, WhatsApp, Twilio |
| `get-vapid-key` | push subscription | `VAPID_PUBLIC_KEY` |
| `link-request-notify` | family link requests | VAPID |
| `free-umrah-apply` | `/free-umrah` | service role |
| `free-umrah-notify` | admin free-umrah | WhatsApp |
| `check-application-status` | `/free-umrah/status` | service role |
| `send-custom-whatsapp` | free-umrah admin | WhatsApp |
| `whatsapp-api-proxy` | `/admin/whatsapp-api` | WhatsApp |
| `summarize-circular` | admin circulars | LLM key |
| `fetch-hci-circulars` | admin circulars | LLM key, `CRON_SECRET` |
| `create-razorpay-order` | `/payment` | Razorpay |
| `verify-razorpay-payment` | `/payment` | Razorpay |
| `inspector-register` | inspector registration | service role |
| `inspector-ocr` | admin inspector upload | LLM key |
| `haji-self-register` | join group | service role |
| `update-proof-document` | document reupload | service role |
| `lost-found-claim-notify` | lost and found | WhatsApp |
| `volunteer-status-notify` | volunteer dashboard | WhatsApp |
| `fraud-alert-notify` | fraud alerts | VAPID |
| `stream-video-token` | `/video-call` | Stream |
| `elevenlabs-tts` | read-aloud | ElevenLabs |
| `elevenlabs-agent-token` | voice assistant | ElevenLabs |
| `analytics-cohort` | admin analytics | service role |
| `admin-ai-dashboard` | admin AI dashboard | LLM key |
| `ai-orchestrator` | AI orchestrator hook | LLM key |
| `central-ai-brain` | central brain hook | LLM key |
| `compliance-dashboard` | compliance page | service role |
| `data-compliance` | consent/DSAR hook | service role |
| `fraud-intelligence` | fraud page | LLM key |
| `national-command` | national command | LLM key |
| `check-rate-limit` | not called by the current UI | service role |
| `emotional-support` | not called by the current UI | LLM key |
| `tracking-intelligence` | not called by the current UI | LLM key |
| `sukoon-stage-notify` | not called by the current UI (`notification-cascade` is) | WhatsApp |

## Exact deploy commands

From the repository root, after `supabase link`:

```bash
supabase functions deploy get-mapbox-token --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy hajj-faq-chat --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy hajj-chat --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy health-triage --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy allocate-responder --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy whatsapp-alert --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy geofence-monitor --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy notification-cascade --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy get-vapid-key --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy link-request-notify --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy free-umrah-apply --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy free-umrah-notify --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy check-application-status --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy send-custom-whatsapp --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy whatsapp-api-proxy --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy summarize-circular --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy fetch-hci-circulars --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy create-razorpay-order --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy verify-razorpay-payment --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy inspector-register --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy inspector-ocr --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy haji-self-register --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy update-proof-document --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy lost-found-claim-notify --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy volunteer-status-notify --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy fraud-alert-notify --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy stream-video-token --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy elevenlabs-tts --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy elevenlabs-agent-token --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy analytics-cohort --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy admin-ai-dashboard --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy ai-orchestrator --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy central-ai-brain --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy compliance-dashboard --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy data-compliance --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy fraud-intelligence --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy national-command --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy check-rate-limit --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy emotional-support --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy tracking-intelligence --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy sukoon-stage-notify --project-ref "$SUPABASE_PROJECT_REF"
```

Or deploy every function in the folder:

```bash
for fn in supabase/functions/*/; do
  supabase functions deploy "$(basename "$fn")" --project-ref "$SUPABASE_PROJECT_REF"
done
```

`supabase/config.toml` sets `verify_jwt = false` for several public functions (including `get-mapbox-token` and `hajj-faq-chat`). Deploy from this repo so that config is what production uses. The gateway still expects the `apikey` header; the app sends it.

## After deploy

```bash
for fn in get-mapbox-token hajj-faq-chat health-triage allocate-responder whatsapp-alert geofence-monitor notification-cascade get-vapid-key free-umrah-apply; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS \
    -H "apikey: $SUPABASE_ANON_KEY" \
    "https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/$fn")
  echo "$code $fn"
done
```

OPTIONS should not be 404. `get-mapbox-token` POST without the secret returns 503 with `MAPBOX_PUBLIC_TOKEN is not configured`. `summarize-circular` returns 500 with `LLM_API_KEY or LOVABLE_API_KEY is not configured` until the key is set.

## Database (separate from functions)

SOS status updates need the migration `supabase/migrations/20261024120000_sukoon_status_without_zero_coords.sql` applied to the same project (`supabase db push`, or run that file in the SQL editor). Until it is applied, the app falls back to updating `pilgrim_status` only and will not write latitude/longitude `0,0`. See that file for the `upsert_member_location` and invite-expiry checks the owner should confirm.
