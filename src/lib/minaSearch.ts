/**
 * Smart search normalization for multi-script numeral matching,
 * Arabic name spelling variants, and typo-tolerant fuzzy matching.
 */

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_ARABIC = "۰۱۲۳۴۵۶۷۸۹";
const DEVANAGARI = "०१२३४५६७८९";
const WESTERN = "0123456789";

function buildMap(from: string, to: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (let i = 0; i < from.length; i++) map[from[i]] = to[i];
  return map;
}

const numeralMaps = [
  buildMap(ARABIC_INDIC, WESTERN),
  buildMap(EASTERN_ARABIC, WESTERN),
  buildMap(DEVANAGARI, WESTERN),
];

/** Convert any supported numeral script to Western Arabic digits. */
export function normalizeNumerals(input: string): string {
  let out = "";
  for (const ch of input) {
    let mapped = ch;
    for (const m of numeralMaps) {
      if (m[ch] !== undefined) {
        mapped = m[ch];
        break;
      }
    }
    out += mapped;
  }
  return out;
}

/** Lowercase + numeral-normalize, preserving length so highlight indices map back. */
export function normalizeLite(input: string): string {
  return normalizeNumerals(input).toLowerCase();
}

/** Lowercase, numerals, collapse separators, trim. (Used for token matching, not highlighting.) */
export function normalizeSearchText(input: string): string {
  return normalizeNumerals(input)
    .toLowerCase()
    .replace(/[\s\-/._]+/g, " ")
    .trim();
}

/**
 * Canonicalise common Arabic-name spelling variants so e.g. "Mohamad",
 * "Muhammad", "Mohammed", "Mohamed" all collapse to the same token.
 * Run on already-lowercased text.
 */
const NAME_VARIANT_RULES: Array<[RegExp, string]> = [
  [/\b(?:mo|mu)h?[ae]mm?[ae]d\b/g, "muhammad"],
  [/\bahm[ae]d\b/g, "ahmad"],
  [/\babd[au]ll?ah\b/g, "abdullah"],
  [/\babdul\b/g, "abd"],
  [/\bibrah?[iy]m\b/g, "ibrahim"],
  [/\b(?:yo?u?sef|yusuf|yousuf|yousef)\b/g, "yusuf"],
  [/\b(?:isma'?[iy]l|ismael)\b/g, "ismail"],
  [/\bhuss?[ea]in\b/g, "hussein"],
  [/\b(?:khal[ie]d|khaled)\b/g, "khalid"],
  [/\b(?:omar|umar)\b/g, "umar"],
  [/\b(?:ali|aly)\b/g, "ali"],
];

export function canonicalizeNames(s: string): string {
  let out = s;
  for (const [re, rep] of NAME_VARIANT_RULES) out = out.replace(re, rep);
  return out;
}

/** Bounded Levenshtein. Returns max+1 if distance exceeds max. */
function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const al = a.length, bl = b.length;
  if (!al) return bl;
  if (!bl) return al;
  let prev = new Array(bl + 1);
  let cur = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;
  for (let i = 1; i <= al; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    [prev, cur] = [cur, prev];
  }
  return prev[bl];
}

function tokenThreshold(len: number): number {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  return 2;
}

/** Token in query matches if any target word contains it, or is within edit distance. */
function tokenMatchesAny(tok: string, targetWords: string[]): boolean {
  const thr = tokenThreshold(tok.length);
  for (const w of targetWords) {
    if (!w) continue;
    if (w.includes(tok) || tok.includes(w)) return true;
    if (thr > 0 && Math.abs(w.length - tok.length) <= thr + 1) {
      if (levenshtein(tok, w, thr) <= thr) return true;
    }
  }
  return false;
}

/** Smart fuzzy match: every query token must match (substring or typo-tolerant). */
export function fuzzyMatches(query: string, target: string): boolean {
  const q = canonicalizeNames(normalizeSearchText(query));
  if (!q) return true;
  const t = canonicalizeNames(normalizeSearchText(target));
  if (q.length <= 3) return t.includes(q);
  const tokens = q.split(/\s+/).filter(Boolean);
  const targetWords = t.split(/\s+/).filter(Boolean);
  return tokens.every((tok) => tokenMatchesAny(tok, targetWords));
}

/** Tokens to highlight (from raw query). */
export function getHighlightTokens(query: string): string[] {
  const q = normalizeLite(query).replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
  if (!q) return [];
  return Array.from(
    new Set(q.split(/\s+/).filter((t) => t.length >= 1)),
  );
}

export interface HighlightSegment {
  text: string;
  match: boolean;
}

/**
 * Split `text` into segments marking which substrings match any of the query tokens.
 * Highlight uses the length-preserving normalize (numerals + lowercase) so the
 * indices map back to the original text exactly.
 */
export function highlightSegments(text: string, tokens: string[]): HighlightSegment[] {
  if (!tokens.length || !text) return [{ text, match: false }];
  const lower = normalizeLite(text);
  const ranges: Array<[number, number]> = [];
  for (const raw of tokens) {
    const tok = raw;
    if (!tok) continue;
    let i = 0;
    while ((i = lower.indexOf(tok, i)) !== -1) {
      ranges.push([i, i + tok.length]);
      i += Math.max(tok.length, 1);
    }
  }
  if (!ranges.length) return [{ text, match: false }];
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const r of ranges) {
    if (merged.length && r[0] <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]);
    } else {
      merged.push([r[0], r[1]]);
    }
  }
  const out: HighlightSegment[] = [];
  let cur = 0;
  for (const [s, e] of merged) {
    if (s > cur) out.push({ text: text.slice(cur, s), match: false });
    out.push({ text: text.slice(s, e), match: true });
    cur = e;
  }
  if (cur < text.length) out.push({ text: text.slice(cur), match: false });
  return out;
}
