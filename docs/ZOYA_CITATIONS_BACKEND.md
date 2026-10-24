# Zoya citations — backend contract (ai-orchestrator)

Status: **frontend ready (branch `fix/core-issues-2026-10-24`), backend not yet implemented.**
The `ai-orchestrator` edge function source is not in this repo; whoever owns it must
implement the contract below. Nothing here has been deployed.

## 1. Transport

The orchestrator already streams OpenAI-style SSE (`data: {"choices":[{"delta":{"content":"..."}}]}`
… `data: [DONE]`). Citations are added as **extra JSON payloads on the same stream**. The
client (`src/lib/zoyaCitations.ts → extractCitations`) accepts any of:

```text
data: {"type":"sources","sources":[ ...Citation ]}          <- preferred, send once before [DONE]
data: {"sources":[ ...Citation ]}                            <- top-level field on any chunk
data: {"choices":[{"delta":{"sources":[ ...Citation ]}}]}    <- inside delta
```

Multiple sources payloads are merged and de-duplicated by `id`. Max 12 shown.

## 2. Citation object

```ts
interface Citation {
  id: string;            // stable id, e.g. "quran-2-196", "bukhari-1521", "hc-circular-2027-12"
  kind: "quran" | "hadith" | "circular" | "official" | "fiqh" | "other";
  title: string;         // human label, e.g. "Surah Al-Baqarah"
  reference?: string;    // e.g. "2:196", "Sahih al-Bukhari 1521", "Circular No. 12 (2027)"
  url?: string;          // http(s) only; anything else is dropped client-side
}
```

## 3. "Cite or decline" rule (must be enforced server-side)

For any answer about **ritual rulings (fiqh), Qur'an, hadith, or official Haj Committee /
Ministry rules, dates, fees, quotas or documents**:

1. The answer MUST be grounded in retrieved sources (curated Qur'an/hadith corpus,
   `hajj_circulars`, official PDFs) and MUST emit at least one `Citation` for them.
2. If no adequate source is retrieved, Zoya MUST **decline** to give a ruling/fact, say she
   could not verify it, and point the pilgrim to their Haj Inspector / Khadim-ul-Hujjaj /
   a qualified scholar or the official circulars page. No invented verses, hadith numbers,
   circular numbers or URLs.
3. Citations must refer only to documents actually retrieved for this turn (never
   model-generated references). Hadith must carry collection + number; Qur'an surah:ayah.
4. Purely conversational / emotional-support / navigation answers need no citations.
5. Log `{session_id, module, cited: boolean, declined: boolean}` for audit.

## 4. Suggested system-prompt addition

> You may only state religious rulings or official Haj rules that are supported by the
> provided SOURCES. Reference each one by its id. If SOURCES do not support an answer,
> say you cannot verify it and refer the pilgrim to their Haj Inspector or a qualified
> scholar. Never invent references.

## 5. Test checklist for the backend owner

- [ ] Fiqh question with matching corpus hit → answer + ≥1 `quran|hadith|fiqh` citation.
- [ ] Question about a 2027 circular → `circular` citation with the official URL.
- [ ] Question with no retrieved source → polite decline, no citations, no fabricated refs.
- [ ] Small talk → no citations.
