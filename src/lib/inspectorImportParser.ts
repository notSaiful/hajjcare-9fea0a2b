import type { NewInspectorInput } from "@/hooks/useCustomInspectors";

export type ParseResult = {
  inspectors: NewInspectorInput[];
  skipped: number;
  errors: string[];
};

// Maps many possible header/key spellings to our canonical field names.
const FIELD_ALIASES: Record<string, keyof NewInspectorInput> = {
  name: "name",
  fullname: "name",
  inspector: "name",
  inspectorname: "name",

  state: "state",
  province: "state",

  cover: "coverNumber",
  covernumber: "coverNumber",
  coverno: "coverNumber",
  cover_no: "coverNumber",
  cover_number: "coverNumber",

  indian: "indianMobile",
  indianmobile: "indianMobile",
  indianphone: "indianMobile",
  indiannumber: "indianMobile",
  india: "indianMobile",
  mobile: "indianMobile",
  phone: "indianMobile",

  ksa: "ksaMobile",
  ksamobile: "ksaMobile",
  ksaphone: "ksaMobile",
  saudi: "ksaMobile",
  saudimobile: "ksaMobile",
  saudiphone: "ksaMobile",

  makkah: "makkahBuilding",
  makkahbuilding: "makkahBuilding",
  mecca: "makkahBuilding",
  meccabuilding: "makkahBuilding",

  madinah: "madinahBuilding",
  madinahbuilding: "madinahBuilding",
  medina: "madinahBuilding",
  medinabuilding: "madinahBuilding",

  father: "fatherName",
  fathername: "fatherName",

  gender: "gender",
  sex: "gender",
};

const normalizeKey = (k: string) =>
  k.toLowerCase().replace(/[\s_\-#/().]+/g, "");

const mapKey = (k: string): keyof NewInspectorInput | null => {
  const n = normalizeKey(k);
  return FIELD_ALIASES[n] ?? null;
};

const normalizeGender = (v: string): "Male" | "Female" | undefined => {
  const t = v.trim().toLowerCase();
  if (!t) return undefined;
  if (t.startsWith("m")) return "Male";
  if (t.startsWith("f")) return "Female";
  return undefined;
};

const buildInspector = (
  raw: Record<string, unknown>
): NewInspectorInput | null => {
  const out: Partial<NewInspectorInput> = {};
  for (const [k, v] of Object.entries(raw)) {
    const target = mapKey(k);
    if (!target) continue;
    const value = v == null ? "" : String(v).trim();
    if (!value) continue;
    if (target === "gender") {
      out.gender = normalizeGender(value);
    } else {
      (out as Record<string, string>)[target] = value;
    }
  }
  if (!out.name || !out.state) return null;
  return {
    name: out.name,
    state: out.state,
    coverNumber: out.coverNumber,
    indianMobile: out.indianMobile,
    ksaMobile: out.ksaMobile,
    makkahBuilding: out.makkahBuilding,
    madinahBuilding: out.madinahBuilding,
    fatherName: out.fatherName,
    gender: out.gender,
  };
};

// Minimal CSV parser supporting quoted fields with commas + escaped quotes.
const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(cur);
        cur = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      } else {
        cur += c;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim().length > 0));
};

export const parseInspectorImport = (input: string): ParseResult => {
  const text = input.trim();
  const result: ParseResult = { inspectors: [], skipped: 0, errors: [] };
  if (!text) {
    result.errors.push("Input is empty.");
    return result;
  }

  // Try JSON first
  if (text.startsWith("[") || text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      arr.forEach((row, idx) => {
        if (!row || typeof row !== "object") {
          result.skipped++;
          result.errors.push(`Row ${idx + 1}: not an object.`);
          return;
        }
        const insp = buildInspector(row as Record<string, unknown>);
        if (!insp) {
          result.skipped++;
          result.errors.push(`Row ${idx + 1}: missing name or state.`);
        } else {
          result.inspectors.push(insp);
        }
      });
      return result;
    } catch (e) {
      result.errors.push(`Invalid JSON: ${(e as Error).message}`);
      return result;
    }
  }

  // CSV path
  const rows = parseCsv(text);
  if (rows.length < 2) {
    result.errors.push(
      "CSV needs a header row and at least one data row. Required columns: name, state."
    );
    return result;
  }
  const headers = rows[0].map((h) => h.trim());
  const mapped = headers.map(mapKey);
  if (!mapped.includes("name") || !mapped.includes("state")) {
    result.errors.push(
      "CSV must include 'name' and 'state' columns (also accepted: cover, indian, ksa, makkah, madinah)."
    );
    return result;
  }
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    const insp = buildInspector(obj);
    if (!insp) {
      result.skipped++;
      result.errors.push(`Row ${r + 1}: missing name or state.`);
    } else {
      result.inspectors.push(insp);
    }
  }
  return result;
};

export const SAMPLE_CSV = `name,state,cover,indian,ksa,makkah,madinah
Mohammed Ali,Andhra Pradesh,AP-002,+91 9876500000,+966 500000000,Building 216 Azizia,Building 504 Markaziya
Abdul Rahman,Kerala,KL-010,+91 9123456780,,Building 312 Misfalah,
`;

export const SAMPLE_JSON = `[
  {
    "name": "Mohammed Ali",
    "state": "Andhra Pradesh",
    "cover": "AP-002",
    "indian": "+91 9876500000",
    "ksa": "+966 500000000",
    "makkah": "Building 216 Azizia",
    "madinah": "Building 504 Markaziya"
  }
]`;
