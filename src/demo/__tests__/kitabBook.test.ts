import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

describe("Hajj & Umrah Books", () => {
  const library = read("public/library.html");
  const catalog = JSON.parse(read("public/kitab/books.json"));
  const book = catalog.categories[0].books[0];

  it("adds one published Hindi book in its own category", () => {
    expect(catalog.categories).toHaveLength(1);
    expect(catalog.categories[0].id).toBe("hajj-umrah-books");
    expect(catalog.categories[0].title).toBe("Hajj & Umrah Books");
    expect(book).toMatchObject({
      id: "hajj-aur-umrah-kai-masail",
      title: "Hajj Aur Umrah Kai Masail",
      language: "Hindi",
      format: "PDF",
      status: "Published",
      pages: 295,
    });
    expect(book.pdf).toBe("/kitab/hajj-aur-umrah-kai-masail-hindi.pdf");
    expect(book.reader).toBe("/library/hajj-aur-umrah-kai-masail");
  });

  it("keeps the Quran card and the existing source books", () => {
    expect(library).toContain('id="quran"');
    expect(library).toContain("https://quranenc.com/en/home");
    expect(library).toContain("https://quranenc.com/hi/home");
    expect(library).toContain("https://tanzil.net/");
    expect(library).toContain(">Awareness Guides</h3>");
    expect(library).toContain(">Rites of Hajj & Umrah booklet</h3>");
    expect(library).toContain(">Handbook of Hajj & Umrah</h3>");
    expect(library).toContain(">Rafiq ul Haramain</h3>");
    expect(library).toContain(">Bahar-e-Shariat</h3>");
    expect(library).toContain(">Fatawa Razawiyyah</h3>");
    expect(library).not.toContain("hajj-aur-umrah-kai-masail-hindi.pdf");
    expect(library.indexOf('id="hajj-umrah-books"')).toBeGreaterThan(-1);
    expect(library.indexOf('id="hajj-umrah-books"')).toBeLessThan(library.indexOf('id="quran"'));
  });

  it("searches by title and opens the reader without embedding the PDF on the listing", () => {
    const script = read("public/kitab/kitab.js");
    expect(library).toContain('id="kitab-search"');
    expect(script).toContain("Open Book / Read PDF");
    expect(script).toContain("Download PDF");
    expect(script).toContain('loading = "lazy"');
    expect(script).not.toContain("new XMLHttpRequest");
    const reader = read("public/kitab/reader.js");
    expect(reader).toContain("rangeChunkSize");
    expect(reader).toContain("disableAutoFetch: true");
    expect(read("vercel.json")).toContain("Accept-Ranges");
    expect(read("vercel.json")).toContain("/library/hajj-aur-umrah-kai-masail");
  });

  it("lists three external libraries without touching the hosted book", () => {
    expect(library).toContain('id="external-islamic-libraries"');
    expect(library).toContain("बाहरी इस्लामी लाइब्रेरी");
    expect(library).toContain('href="https://www.al-islam.org/" target="_blank" rel="noopener noreferrer"');
    expect(library).toContain('href="https://islamhouse.com/en" target="_blank" rel="noopener noreferrer"');
    expect(library).toContain('href="https://www.ahlesunnatpak.com/" target="_blank" rel="noopener noreferrer"');
    expect(library).toContain("Shia (Ahlul Bayt DILP)");
    expect(library).toContain("Sunni (Hindi/Urdu books available)");
    expect(library).toContain("Sunni (Barelvi/Ahle Sunnat)");
    expect(library.match(/बाहरी वेबसाइट — सामग्री उनकी ज़िम्मेदारी/g)).toHaveLength(3);
    expect(library.indexOf('id="external-islamic-libraries"')).toBeGreaterThan(library.indexOf('id="quran"'));
    expect(book.pdf).toBe("/kitab/hajj-aur-umrah-kai-masail-hindi.pdf");
  });
});
