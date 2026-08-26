import { describe, expect, it } from "vitest";
import { getZoyaLanguage, ZOYA_LANGUAGES } from "../zoyaLanguages";

describe("Zoya language registry", () => {
  it("contains every requested Indian language with a primary speech locale", () => {
    expect(ZoyaLanguageCodes()).toEqual([
      "as", "bn", "brx", "doi", "en", "gom", "gu", "hi", "kn", "ks", "mai", "ml",
      "mni", "mr", "ne", "or", "pa", "sa", "sat", "sd", "ta", "te", "ur",
    ]);
    expect(ZOYA_LANGUAGES.every((language) => language.locale && language.speechLocales.length > 0)).toBe(true);
  });

  it("uses gom-IN for Konkani while keeping legacy kok selections compatible", () => {
    expect(getZoyaLanguage("gom").locale).toBe("gom-IN");
    expect(getZoyaLanguage("kok").code).toBe("gom");
  });
});

function ZoyaLanguageCodes() {
  return ZOYA_LANGUAGES.map((language) => language.code).sort();
}
