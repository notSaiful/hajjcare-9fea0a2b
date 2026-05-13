/**
 * Smart search normalization for multi-script numeral matching.
 * Converts Arabic-Indic, Eastern Arabic-Indic (Persian/Urdu), and Devanagari
 * digits to Western Arabic (0-9) so users can search with any numeral system.
 */

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_ARABIC = "۰۱۲۳۴۵۶۷۸۹";
const DEVANAGARI = "०१२३४५६७८९";
const WESTERN = "0123456789";

function buildMap(from: string, to: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (let i = 0; i < from.length; i++) {
    map[from[i]] = to[i];
  }
  return map;
}

const allMaps = [
  buildMap(ARABIC_INDIC, WESTERN),
  buildMap(EASTERN_ARABIC, WESTERN),
  buildMap(DEVANAGARI, WESTERN),
];

/** Normalize any supported numeral script to Western Arabic digits. */
export function normalizeNumerals(input: string): string {
  return input
    .split("")
    .map((ch) => {
      for (const map of allMaps) {
        if (map[ch] !== undefined) return map[ch];
      }
      return ch;
    })
    .join("");
}

/** Normalize search text: lowercase, numerals, remove extra spaces/punctuation. */
export function normalizeSearchText(input: string): string {
  return normalizeNumerals(input)
    .toLowerCase()
    .replace(/[\s\-/._]+/g, " ") // collapse separators
    .trim();
}

/** Check if every word in query appears as substring in target (after normalization). */
export function fuzzyMatches(query: string, target: string): boolean {
  const q = normalizeSearchText(query);
  const t = normalizeSearchText(target);
  if (!q) return true;
  // If query is short (≤3 chars), simple substring match
  if (q.length <= 3) return t.includes(q);
  // For longer queries, each whitespace-separated token must match somewhere
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((tok) => t.includes(tok));
}
