import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(resolve(__dirname, "../VolunteerPage.tsx"), "utf8");

describe("volunteer form arrival", () => {
  it("opens the real form from Explore and still posts a normal registration", () => {
    expect(page).toContain("export function volunteerFormRequested");
    expect(page).toContain('form === "1" || hash === "#form"');
    expect(page).toContain("volunteerFormRequested(location.search, location.hash)");
    expect(page).toContain("submitVolunteerRegistration");
    expect(page).toContain("company_website: companyWebsite");
    expect(page).toContain("consent_privacy: true");
    expect(page).toContain("consent_terms: true");
    expect(page).toContain("आपका रजिस्ट्रेशन मुकम्मल हुआ। अल्लाह आपका हज मबरूर और कबूल करे।");
    expect(page).toContain("Volunteer Registration Point / वॉलंटियर रजिस्ट्रेशन पॉइंट");
    expect(page).not.toContain("Select Embarkation Point");
  });
});
