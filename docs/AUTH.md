# Authentication: Supabase only

Checked 24 Oct 2026 against this repository and the live bundle at `https://hajjcare.in/assets/index-CPZWe5No.js`.

## What is true in this repository

Sign-in, sign-up, and password reset go through Supabase Auth only:

- `src/hooks/useAuth.ts` calls `supabase.auth.signInWithPassword`, `signUp`, and `signOut`.
- `src/components/auth/EmailAuthForm.tsx` sends the reset email with `redirectTo: ${origin}/reset-password`.
- There is no Firebase SDK, no `emailVerified` gate, and no second password reset in this git history.

`/reset-password` is a real route (`src/pages/ResetPasswordPage.tsx`). It waits for the `PASSWORD_RECOVERY` session Supabase puts in the URL, then calls `supabase.auth.updateUser({ password })`.

## What is still true on the live site

The site deployed to hajjcare.in (HTML last-modified 16 Oct 2026, Supabase host `begtqcmwruvwposocnsr`) still ships Firebase JS SDK 12 (`@firebase/auth`, project-style dual gate). After a successful Supabase sign-in that bundle calls Firebase with the same password and signs the Supabase session out unless Firebase accepts the password and `emailVerified` is true. `resetPassword` sends both a Supabase reset and a Firebase reset, so the two passwords drift apart.

That dual-gate code is **not** in this repository. Shipping this branch to hajjcare.in removes it. Do not add Firebase back.

The same age gap applies to voice. Production has Vapi (`vapi-config`) and `rumik-tts`. This repo still has ElevenLabs and does not contain those functions. Do not delete them on production, and do not treat this tree as the voice source of truth. Sync the latest Lovable project first. See the top of `DEPLOY.md`.

This repo's `supabase/config.toml` names project `qovcctfoxgvowedjioil`. Production HTML preconnects to a **different** project, `begtqcmwruvwposocnsr`. Deploy and secrets must target the project in the production `VITE_SUPABASE_URL`, or the reset page and the edge functions will talk to the wrong database.

## Existing users are not locked out by this change

- People who already have a Supabase user keep that password. This code never rewrites `auth.users`.
- People who were locked out only because Firebase rejected them can sign in again as soon as this build is what hajjcare.in serves.
- People who exist only in Firebase (project seen in the live bundle as `hajjcare-df96e`) do not have a Supabase session until the owner migrates them. They are already locked out of a Supabase-only app. Do not delete Supabase users to "clean up" Firebase.

## Owner steps

1. In the Supabase dashboard for the **production** project, add these redirect URLs:
   - `https://hajjcare.in/reset-password`
   - `https://hajjcare.in/`
   - any preview host you use, plus `/reset-password`
2. Deploy this frontend to hajjcare.in so the Firebase bundle is gone.
3. In Firebase console, disable the Email/Password provider only **after** the migration below, so a cached old bundle cannot keep writing a second password.
4. Migrate Firebase-only accounts (needs the Firebase Admin SDK and the Supabase service role; do not commit either credential):

```bash
# 1. Export Firebase users (email, uid, emailVerified). Do not print password hashes into the repo.
# 2. For each email that is missing from auth.users, create a Supabase user WITHOUT copying the
#    Firebase scrypt hash into application code. Send a recovery link so they choose a Supabase password:
supabase auth admin generate-link --project-ref "$SUPABASE_PROJECT_REF" \
  --type recovery --email "pilgrim@example.com" --redirect-to "https://hajjcare.in/reset-password"
```

Supabase can import Firebase scrypt hashes with the project's hash parameters (`auth.admin.createUser` / the GoTrue import API) if you must avoid a reset email. That import has to run in a private script on the owner's machine. A wrong hash import would lock the account, so prefer the recovery link unless you have tested one imported user.

5. Leave Supabase email confirmation as it is in production. This repo's local `config.toml` has `enable_confirmations = false`. Do not turn production confirmations on as part of this deploy or existing unverified Supabase users will suddenly be blocked. Confirm the production Auth setting before changing it.

6. Ask anyone whose password "randomly stopped working" after the old dual reset to use Forgot password once. That sets the single Supabase password.
