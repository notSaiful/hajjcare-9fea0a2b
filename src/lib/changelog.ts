export type ChangelogItemKind = "video" | "book" | "security" | "fix" | "update";

export interface ChangelogItem {
  kind: ChangelogItemKind;
  badge: string;
  title: string;
  body: string;
}

export interface ChangelogTranslation {
  heading: string;
  date?: string;
  items: ChangelogItem[];
}

export interface ChangelogRelease {
  id: string;
  date: string;
  translations: Record<string, ChangelogTranslation>;
}

export interface RemoteChangelog {
  version: 1;
  releases: ChangelogRelease[];
}

const MAX_RELEASES = 20;
const MAX_ITEMS_PER_RELEASE = 20;
const MAX_TEXT_LENGTH = 1_000;
const itemKinds = new Set<ChangelogItemKind>(["video", "book", "security", "fix", "update"]);

function isText(value: unknown, maxLength = MAX_TEXT_LENGTH): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function parseItem(value: unknown): ChangelogItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (!isText(item.badge, 80) || !isText(item.title, 200) || !isText(item.body) || !itemKinds.has(item.kind as ChangelogItemKind)) {
    return null;
  }
  return { kind: item.kind as ChangelogItemKind, badge: item.badge, title: item.title, body: item.body };
}

function parseTranslation(value: unknown): ChangelogTranslation | null {
  if (!value || typeof value !== "object") return null;
  const translation = value as Record<string, unknown>;
  if (!isText(translation.heading, 200) || !Array.isArray(translation.items) || translation.items.length === 0 || translation.items.length > MAX_ITEMS_PER_RELEASE) {
    return null;
  }
  if (translation.date !== undefined && !isText(translation.date, 100)) return null;

  const items = translation.items.map(parseItem);
  if (items.some((item) => item === null)) return null;
  return { heading: translation.heading, ...(translation.date ? { date: translation.date } : {}), items: items as ChangelogItem[] };
}

/** Parses untrusted CMS/JSON content before it is rendered in the app. */
export function parseRemoteChangelog(value: unknown): RemoteChangelog | null {
  if (!value || typeof value !== "object") return null;
  const document = value as Record<string, unknown>;
  if (document.version !== 1 || !Array.isArray(document.releases) || document.releases.length === 0 || document.releases.length > MAX_RELEASES) {
    return null;
  }

  const releases: ChangelogRelease[] = [];
  const ids = new Set<string>();
  for (const value of document.releases) {
    if (!value || typeof value !== "object") return null;
    const release = value as Record<string, unknown>;
    if (!isText(release.id, 100) || ids.has(release.id) || !isIsoDate(release.date) || !release.translations || typeof release.translations !== "object") {
      return null;
    }

    const translations = Object.fromEntries(
      Object.entries(release.translations as Record<string, unknown>)
        .map(([language, translation]) => [language, parseTranslation(translation)] as const)
        .filter(([, translation]) => translation !== null),
    ) as Record<string, ChangelogTranslation>;

    // English is the stable fallback for every language supported by the app.
    if (!translations.en) return null;
    ids.add(release.id);
    releases.push({ id: release.id, date: release.date, translations });
  }

  return { version: 1, releases };
}

export async function fetchRemoteChangelog(url: string, signal?: AbortSignal): Promise<RemoteChangelog> {
  const response = await fetch(url, { signal, cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Changelog request failed with status ${response.status}.`);
  const changelog = parseRemoteChangelog(await response.json());
  if (!changelog) throw new Error("Changelog response does not match version 1 of the public schema.");
  return changelog;
}
