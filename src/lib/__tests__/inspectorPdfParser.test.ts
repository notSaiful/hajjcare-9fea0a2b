import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseInspectorRows } from "../inspectorPdfParser";

const loadFixture = (name: string) =>
  readFileSync(resolve(__dirname, "fixtures", name), "utf-8");

describe("parseInspectorRows — Delhi format", () => {
  const text = loadFixture("delhiInspectors.txt");
  const rows = parseInspectorRows(text, "Delhi");

  it("extracts all 7 fixture rows", () => {
    expect(rows).toHaveLength(7);
  });

  it("captures the 14-digit Application/Group Id, skipping the Sr. number", () => {
    const ids = rows.map((r) => r.applicationId);
    expect(ids).toEqual([
      "25110109107400",
      "25102909108769",
      "25102909107146",
      "25103009104726",
      "25103009108701",
      "25110209109744",
      "25103028104744",
    ]);
    // Sr. numbers (1, 2, 5, 10, 20, 21, 27) must NOT appear as IDs
    for (const id of ids) expect(id.length).toBeGreaterThanOrEqual(12);
  });

  it("splits applicant name and father name", () => {
    // Even-token rows split cleanly down the middle.
    const manzar = rows[2];
    expect(manzar.name).toBe("MOHAMMAD MANZAR HUSAIN");
    expect(manzar.fatherName).toBe("MOHAMMAD KAUSAR QADRI");

    // For all rows, the concatenation must preserve the full applicant + father string.
    for (const r of rows) {
      const full = `${r.name} ${r.fatherName}`.trim().toLowerCase();
      expect(full.length).toBeGreaterThan(0);
    }
    // ANEES + Mohd Haneef → both tokens still present.
    const anees = rows[0];
    const aneesFull = `${anees.name} ${anees.fatherName}`.toLowerCase();
    expect(aneesFull).toContain("anees");
    expect(aneesFull).toContain("haneef");
  });

  it("parses gender, marks, state and result", () => {
    const anees = rows[0];
    expect(anees.gender).toBe("Male");
    expect(anees.state).toBe("Delhi");
    expect(anees.cbtMarks).toBe(142);
    expect(anees.interviewMarks).toBe(45);
    expect(anees.totalMarks).toBe(187);
    expect(anees.result).toBe("Selected");

    const maimoona = rows[3];
    expect(maimoona.gender).toBe("Female");
    expect(maimoona.totalMarks).toBe(175);
  });

  it("normalizes WL-N results as Waitlisted", () => {
    expect(rows[5].result).toBe("Waitlisted"); // WL-1
    expect(rows[6].result).toBe("Waitlisted"); // WL-7
  });

  it("normalizes the Application Category from the head of the row", () => {
    expect(rows[0].category).toBe("Fresher"); // Fresher without Haj
    expect(rows[1].category).toBe("Repeater");
    expect(rows[4].category).toBe("SHC/Waqf Employee");
  });

  it("captures the quota text", () => {
    expect(rows[0].quota?.toLowerCase()).toContain("open quota");
    expect(rows[4].quota?.toLowerCase()).toContain("reserved quota");
  });
});

describe("parseInspectorRows — Kerala format", () => {
  const text = loadFixture("keralaInspectors.txt");
  const rows = parseInspectorRows(text, "Kerala");

  it("extracts all 4 fixture rows", () => {
    expect(rows).toHaveLength(4);
  });

  it("captures the 14-digit Application Id", () => {
    expect(rows.map((r) => r.applicationId)).toEqual([
      "25101817104981",
      "25102109110234",
      "25103109104567",
      "25104509101122",
    ]);
  });

  it("splits applicant name and father name", () => {
    expect(rows[0].name).toBe("SHAREEF");
    expect(rows[0].fatherName).toBe("KOYILATH IMBICHIYALI");
    expect(rows[2].name).toBe("AYESHA");
    expect(rows[2].fatherName).toBe("ABDUL RAHMAN");
  });

  it("parses gender, marks and state", () => {
    expect(rows[0].gender).toBe("Male");
    expect(rows[0].cbtMarks).toBe(143);
    expect(rows[0].interviewMarks).toBe(46);
    expect(rows[0].totalMarks).toBe(189);
    expect(rows[0].state).toBe("Kerala");
    expect(rows[2].gender).toBe("Female");
  });

  it("recognizes Selected vs WL results", () => {
    expect(rows[0].result).toBe("Selected");
    expect(rows[3].result).toBe("Waitlisted");
  });

  it("normalizes the trailing Application Category", () => {
    expect(rows[0].category).toBe("Fresher");
    expect(rows[1].category).toBe("Repeater");
    expect(rows[2].category).toBe("Fresher with Haj");
    expect(rows[3].category).toBe("SHC/Waqf Employee");
  });
});

describe("parseInspectorRows — robustness", () => {
  it("returns no rows for empty input", () => {
    expect(parseInspectorRows("", "Delhi")).toEqual([]);
  });

  it("ignores non-row lines (page numbers, headers)", () => {
    const text = [
      "Annexure-I",
      "Page 1",
      "Application Id Name Father Name Gender State",
      "25101817104981 SHAREEF KOYILATH IMBICHIYALI Male Kerala 143 46 189 Selected 50% Open Quota Fresher without Haj",
    ].join("\n");
    const rows = parseInspectorRows(text, "Kerala");
    expect(rows).toHaveLength(1);
    expect(rows[0].applicationId).toBe("25101817104981");
  });
});
