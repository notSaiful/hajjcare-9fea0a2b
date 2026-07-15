// Renders PDF pages and image files into compact JPEG data URLs suitable
// for sending to the inspector-ocr edge function (LLM vision).

import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - vite handles ?url
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerUrl;

const MAX_EDGE = 1600; // long-edge cap, keeps payload reasonable while preserving table text
const JPEG_QUALITY = 0.82;
const MAX_PAGES = 12;

const canvasToDataUrl = (canvas: HTMLCanvasElement) =>
  canvas.toDataURL("image/jpeg", JPEG_QUALITY);

const downscale = (
  source: HTMLCanvasElement | HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement => {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(source, 0, 0, w, h);
  return out;
};

/** Render each PDF page into a JPEG data URL. */
export async function pdfToJpegDataUrls(file: File): Promise<string[]> {
  const buf = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);
  const out: string[] = [];
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    // Render at 2x for OCR clarity, then downscale to MAX_EDGE.
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const small = downscale(canvas, canvas.width, canvas.height);
    out.push(canvasToDataUrl(small));
  }
  return out;
}

/** Convert a single image file (jpg/png/webp) into a normalized JPEG data URL. */
export async function imageFileToJpegDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Failed to load image"));
      el.src = url;
    });
    const small = downscale(img, img.naturalWidth, img.naturalHeight);
    return canvasToDataUrl(small);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Convenience: route a File to the right renderer. */
export async function fileToJpegDataUrls(file: File): Promise<string[]> {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return pdfToJpegDataUrls(file);
  }
  if (file.type.startsWith("image/")) {
    return [await imageFileToJpegDataUrl(file)];
  }
  throw new Error("Unsupported file type — upload a PDF or image (JPG/PNG).");
}
