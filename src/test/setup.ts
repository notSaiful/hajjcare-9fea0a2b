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
