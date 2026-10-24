export type CitationKind = "quran" | "hadith" | "circular" | "official" | "fiqh" | "other";

export interface Citation {
  id: string;
  title: string;
  kind: CitationKind;
  /** e.g. "Al-Baqarah 2:196", "Sahih al-Bukhari 1521", "Haj Committee Circular 12/2027" */
  reference?: string;
  url?: string;
}

const KINDS: CitationKind[] = ["quran", "hadith", "circular", "official", "fiqh", "other"];

function safeUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

function normalise(raw: unknown, index: number): Citation | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const title = typeof r.title === "string" ? r.title.trim().slice(0, 200) : "";
  const reference = typeof r.reference === "string" ? r.reference.trim().slice(0, 200) : undefined;
  if (!title && !reference) return null;
  const kind = KINDS.includes(r.kind as CitationKind) ? (r.kind as CitationKind) : "other";
  const id = typeof r.id === "string" && r.id ? r.id : `${kind}-${index}-${title || reference}`;
  return { id, title: title || (reference as string), kind, reference: reference || undefined, url: safeUrl(r.url) };
}

/**
 * Extract citations from one parsed SSE `data:` payload. Accepted shapes:
 *  - { type: "sources", sources: [...] }      (dedicated event)
 *  - { sources: [...] }                       (top-level field on any chunk)
 *  - { choices: [{ delta: { sources: [...] } }] }
 */
export function extractCitations(payload: unknown): Citation[] {
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  const choices = p.choices as Array<{ delta?: { sources?: unknown } }> | undefined;
  const list = (Array.isArray(p.sources) ? p.sources : undefined) ?? (Array.isArray(choices?.[0]?.delta?.sources) ? choices![0].delta!.sources : undefined);
  if (!Array.isArray(list)) return [];
  return list.map(normalise).filter((c): c is Citation => c !== null).slice(0, 12);
}

export function mergeCitations(existing: Citation[] | undefined, incoming: Citation[]): Citation[] {
  const out = [...(existing ?? [])];
  for (const c of incoming) if (!out.some((e) => e.id === c.id)) out.push(c);
  return out;
}
