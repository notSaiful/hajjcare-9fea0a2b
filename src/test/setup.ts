import "@testing-library/jest-dom";

// pdfjs-dist touches DOMMatrix / Path2D / ImageData at import time.
// jsdom doesn't ship these — provide minimal stubs so modules that
// transitively import pdfjs (e.g. the inspector PDF parser) can load in tests.
const g = globalThis as Record<string, unknown>;
if (typeof g.DOMMatrix === "undefined") g.DOMMatrix = class {} as unknown;
if (typeof g.Path2D === "undefined") g.Path2D = class {} as unknown;
if (typeof g.ImageData === "undefined") g.ImageData = class {} as unknown;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Node 22+ exposes an experimental global `localStorage` that shadows jsdom's
// Storage and lacks getItem/setItem unless --localstorage-file is set. Install
// a deterministic in-memory Storage so components reading localStorage work.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear() { this.store.clear(); }
  getItem(key: string) { return this.store.has(key) ? (this.store.get(key) as string) : null; }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string) { this.store.delete(key); }
  setItem(key: string, value: string) { this.store.set(key, String(value)); }
}
for (const name of ["localStorage", "sessionStorage"] as const) {
  const current = (globalThis as Record<string, unknown>)[name] as Storage | undefined;
  if (!current || typeof current.getItem !== "function") {
    const storage = new MemoryStorage();
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value: storage });
    Object.defineProperty(window, name, { configurable: true, writable: true, value: storage });
  }
}
