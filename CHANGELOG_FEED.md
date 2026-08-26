# Remote changelog feed

Set `VITE_CHANGELOG_URL` to a public HTTPS JSON URL. The endpoint must allow browser requests from HajCare, for example:

```http
Access-Control-Allow-Origin: https://hajjcare.in
Content-Type: application/json
```

The app checks the feed on page load and refreshes it every ten minutes. If the feed is unavailable or invalid, it uses the bundled changelog instead.

```json
{
  "version": 1,
  "releases": [
    {
      "id": "2026-07-18-voice-permissions",
      "date": "2026-07-18",
      "translations": {
        "en": {
          "heading": "Voice updates",
          "date": "July 18, 2026",
          "items": [
            {
              "kind": "fix",
              "badge": "Fix",
              "title": "Android microphone permission",
              "body": "Voice requests now wait for microphone access before connecting."
            }
          ]
        },
        "hi": {
          "heading": "वॉइस अपडेट",
          "date": "18 जुलाई 2026",
          "items": [
            {
              "kind": "fix",
              "badge": "फिक्स",
              "title": "Android माइक्रोफ़ोन अनुमति",
              "body": "वॉइस कनेक्ट होने से पहले माइक्रोफ़ोन अनुमति की प्रतीक्षा करता है।"
            }
          ]
        }
      }
    }
  ]
}
```

`en` is required for every release. Other language codes are optional and fall back to English. Supported `kind` values are `video`, `book`, `security`, `fix`, and `update`.
