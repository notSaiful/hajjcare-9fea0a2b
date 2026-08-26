# Ask Zoya multilingual operations

The language selector uses `src/lib/zoyaLanguages.ts` as its single source of truth.
It sends the selected language code and locale to the AI orchestrator, configures
browser speech recognition with the matching locale, and selects the same locale
for read-aloud playback.

## Neural voice configuration

Set `RUMIK_LANG_CONFIG` in Supabase Edge Function secrets to a JSON object of
*verified* language-to-voice mappings. Example:

```json
{
  "en": { "model": "muga", "voiceId": "muga-en" },
  "hi": { "model": "muga", "voiceId": "muga-hi" },
  "ur": { "model": "muga", "voiceId": "muga-ur" }
}
```

Use each provider's current language/voice catalogue before adding a mapping.
If a selected language has no verified server voice, the client tries an installed
device voice for that language; if neither is present it leaves the text visible
and tells the user that voice is unavailable. Do not claim a voice is native until
it has passed an on-device acceptance test.

## Release validation

1. Build the web application and deploy the updated `ai-orchestrator` and `rumik-tts` functions.
2. In Vapi, make the assistant prompt consume `preferredLanguage`, `preferredLanguageCode`, and `preferredLanguageLocale`, and configure its STT/TTS provider per its supported-language catalogue.
3. On Android, verify Settings → Apps → HajCare AI → Permissions shows **Microphone**. Deny once (Retry / Continue), deny permanently (Open Settings), then allow and complete Login → Ask Zoya → microphone → transcript → response.
4. On iOS, verify the `NSMicrophoneUsageDescription` prompt and repeat the voice flow.
5. Test every selector entry on a real device. Browser/embedded WebView speech support is OS and installed-voice dependent, so record unsupported provider/device combinations in the release QA log.
