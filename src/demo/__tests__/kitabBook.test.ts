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
    expect(catalog.categories[0].books).toHaveLength(4);
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
    expect(catalog.categories[0].books[1]).toMatchObject({
      slug: "umrah-and-visit-guide-ministry-of-hajj",
      title: "Umrah & Visit Guide",
      language: "English",
      publisher: "Ministry of Hajj and Umrah, Kingdom of Saudi Arabia",
      pages: 19,
    });
    expect(catalog.categories[0].books[2]).toMatchObject({
      slug: "rites-of-hajj-and-umrah-dar-al-iftaa",
      title: "The Rites of Hajj and 'Umrah Booklet",
      language: "English",
      publisher: "Dar al-Iftaa al-Misriyyah",
      pages: 56,
    });
    expect(catalog.categories[0].books[3]).toMatchObject({
      slug: "hajj-rituals-sistani",
      title: "Hajj Rituals",
      language: "English",
      author: "Al-Sayyid Ali Al-Husseini Al-Sistani",
      publisher: "The Office of His Eminence Al-Sayyid Ali Al-Husseini Al-Sistani",
      source: "https://www.sistani.org/files-new/book-pdf/english-book-47.pdf",
      pages: 150,
    });
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
    expect(library).not.toContain("बाहरी इस्लामी लाइब्रेरी");
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
});
