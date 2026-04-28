import type { NewInspectorInput } from "@/hooks/useCustomInspectors";

// Use legacy build for broad compatibility (Vite + workers)
// pdfjs-dist v5 ships ESM — load worker as URL
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - vite handles ?url
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerUrl;

export type ParsedRow = NewInspectorInput & {
  cbtMarks?: number;
  interviewMarks?: number;
  totalMarks?: number;
  result?: "Selected" | "Waitlisted";
  quota?: string;
  category?: string;
  applicationId?: string;
};

/** Extract raw text content from a PDF File. */
export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
  const lines: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    // Group items by their Y position to reconstruct lines
    const rows = new Map<number, { x: number; str: string }[]>();
    for (const it of content.items as any[]) {
      const y = Math.round(it.transform[5]);
      const x = it.transform[4];
      const arr = rows.get(y) ?? [];
      arr.push({ x, str: it.str });
      rows.set(y, arr);
    }
    const ys = Array.from(rows.keys()).sort((a, b) => b - a);
    for (const y of ys) {
      const parts = rows.get(y)!.sort((a, b) => a.x - b.x).map((p) => p.str);
      const line = parts.join(" ").replace(/\s+/g, " ").trim();
      if (line) lines.push(line);
    }
    lines.push(""); // page separator
  }
  return lines.join("\n");
}

const isAllCaps = (s: string) =>
  /[A-Z]/.test(s) && s === s.toUpperCase() && !/\d/.test(s);

const RESULT_RE = /\b(Selected|Waitlisted|WL[\s-]?\d*|Wait\s*list(?:ed)?)\b/i;

// Application Category strings used in HCOI PDFs (Kerala, Delhi, etc.)
const CATEGORY_RE =
  /(Fresher\s+without\s+Haj(?:\s*\/\s*with\s+Haj\s+before\s+\d{4})?|Fresher\s+with\s+Haj|Repeater\s*\(?\s*SHI\s*\/?\s*Deputationist\s*\)?|SHC\s*\/?\s*Waqf\s+Board\s+Employee|SHC\s*\/?\s*Waqf\s+Employee)/i;

const normalizeCategory = (raw: string): string => {
  if (/fresher\s+without\s+haj/i.test(raw)) return "Fresher";
  if (/fresher\s+with\s+haj/i.test(raw)) return "Fresher with Haj";
  if (/repeater/i.test(raw)) return "Repeater";
  if (/shc|waqf/i.test(raw)) return "SHC/Waqf Employee";
  return raw.trim();
};

/**
 * Parse Kerala-style inspector list lines into structured rows.
 *
 * Expected per row (whitespace separated, often wrapped across spans):
 *   <14-digit-application-id> <NAME...> <FATHER NAME...> <Male|Female>
 *   Kerala <cbt> <iv> <total> <Selected|WL> <quota text...> <category text>
 *
 * The parser is lenient: it scans line by line, joins continuation lines
 * (lines without a leading 14-digit id), and uses regexes to pull fields.
 */
export function parseInspectorRows(rawText: string, state = "Kerala"): ParsedRow[] {
  const rawLines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Merge continuation lines into the most recent row.
  // A row "starts" when it contains a 14-digit Application/Group ID,
  // either at the very beginning (Kerala) or after a small Sr. number (Delhi).
  const merged: string[] = [];
  const startsRow = (l: string) =>
    /^\d{12,16}\b/.test(l) || /^\d{1,4}\s+\d{12,16}\b/.test(l);
  for (const line of rawLines) {
    if (startsRow(line)) {
      merged.push(line);
    } else if (merged.length > 0) {
      if (/^page\s+\d+/i.test(line)) continue;
      if (/application\s*id/i.test(line) && /name/i.test(line)) continue;
      if (/^annexure/i.test(line)) continue;
      merged[merged.length - 1] += " " + line;
    }
  }

  const rows: ParsedRow[] = [];

  for (let line of merged) {
    // Strip leading Delhi-style Sr. number (e.g. "12 25110...")
    line = line.replace(/^\d{1,4}\s+(?=\d{12,16}\b)/, "");

    const idMatch = line.match(/^(\d{12,16})\s+(.*)$/);
    if (!idMatch) continue;
    const applicationId = idMatch[1];
    let rest = idMatch[2];

    // Delhi format: Application Category appears right after the ID, before the name.
    // Kerala format: Category appears at the very end (after Quota).
    let categoryFromHead = "";
    const headCat = rest.match(CATEGORY_RE);
    if (headCat && headCat.index !== undefined && headCat.index < 80) {
      categoryFromHead = headCat[0];
      rest = (rest.slice(0, headCat.index) + " " + rest.slice(headCat.index + headCat[0].length)).trim();
    }

    // Pull gender
    const genderMatch = rest.match(/\b(Male|Female)\b/i);
    if (!genderMatch) continue;
    const gender = (genderMatch[1][0].toUpperCase() +
      genderMatch[1].slice(1).toLowerCase()) as "Male" | "Female";

    const preGender = rest.slice(0, genderMatch.index!).trim();
    const postGender = rest.slice(genderMatch.index! + genderMatch[0].length).trim();

    // Marks — three integers in a row after the state
    const marksMatch = postGender.match(/\b(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\b/);
    let cbtMarks: number | undefined;
    let interviewMarks: number | undefined;
    let totalMarks: number | undefined;
    let afterMarks = postGender;
    if (marksMatch) {
      cbtMarks = +marksMatch[1];
      interviewMarks = +marksMatch[2];
      totalMarks = +marksMatch[3];
      afterMarks = postGender.slice(marksMatch.index! + marksMatch[0].length).trim();
    }

    // Detect result (Selected, Waitlisted, WL, WL-1, WL 2 ...)
    const resultMatch = afterMarks.match(RESULT_RE);
    let result: "Selected" | "Waitlisted" = "Selected";
    let afterResult = afterMarks;
    if (resultMatch) {
      const r = resultMatch[1].toLowerCase();
      result = r.startsWith("sel") ? "Selected" : "Waitlisted";
      afterResult = afterMarks.slice(resultMatch.index! + resultMatch[0].length).trim();
    }

    // Quota — usually ends with "Quota"
    let quota = "";
    let categoryFromTail = "";
    const quotaMatch = afterResult.match(/^(.*?Quota)\s*(.*)$/i);
    if (quotaMatch) {
      quota = quotaMatch[1].trim();
      categoryFromTail = quotaMatch[2].trim();
    } else {
      categoryFromTail = afterResult.trim();
    }

    const category = normalizeCategory(categoryFromHead || categoryFromTail);

    // Split preGender → NAME + FATHER NAME using halving heuristic.
    const tokens = preGender.split(/\s+/).filter(Boolean);
    let name = preGender;
    let fatherName = "";
    if (tokens.length >= 2) {
      const half = Math.ceil(tokens.length / 2);
      name = tokens.slice(0, half).join(" ");
      fatherName = tokens.slice(half).join(" ");
    }

    rows.push({
      name,
      fatherName,
      gender,
      state,
      cbtMarks,
      interviewMarks,
      totalMarks,
      result,
      quota: quota || undefined,
      category: category || undefined,
      applicationId,
    });
  }

  return rows;
}

/** Build a TS literal you can paste straight into hajInspectorsData.ts. */
export function rowsToTsSnippet(rows: ParsedRow[]): string {
  const esc = (s?: string) => (s ?? "").replace(/'/g, "\\'");
  return rows
    .map((r) => {
      const fields: string[] = [
        `id: '${esc(r.applicationId)}'`,
        `name: '${esc(r.name)}'`,
        `fatherName: '${esc(r.fatherName)}'`,
        `gender: '${r.gender ?? "Male"}'`,
        `state: '${esc(r.state)}'`,
        `cbtMarks: ${r.cbtMarks ?? 0}`,
        `interviewMarks: ${r.interviewMarks ?? 0}`,
        `totalMarks: ${r.totalMarks ?? 0}`,
        `result: '${r.result ?? "Selected"}'`,
        `quota: '${esc(r.quota)}'`,
        `category: '${esc(r.category)}'`,
      ];
      return `  { ${fields.join(", ")} },`;
    })
    .join("\n");
}
