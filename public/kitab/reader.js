import { getDocument, GlobalWorkerOptions } from "/kitab/pdfjs/pdf.min.mjs";

const FALLBACK_SLUG = "hajj-aur-umrah-kai-masail";
let pdfUrl = "/kitab/hajj-aur-umrah-kai-masail-hindi.pdf";
const canvas = document.getElementById("page-canvas");
const frame = document.getElementById("pdf-frame");
const status = document.getElementById("reader-status");
const pageInput = document.getElementById("page");
const count = document.getElementById("page-count");
const params = new URLSearchParams(location.search);
let doc = null;
let pageNum = Math.max(1, Number(params.get("page")) || 1);
let rendering = false;

function useFrame(message) {
  status.textContent = message;
  canvas.hidden = true;
  frame.hidden = false;
  frame.src = pdfUrl + "#page=" + pageNum;
}

async function show(num) {
  if (!doc || rendering) return;
  rendering = true;
  pageNum = Math.min(Math.max(1, num), doc.numPages);
  pageInput.value = String(pageNum);
  status.textContent = "Page " + pageNum + " / " + doc.numPages;
  try {
    const page = await doc.getPage(pageNum);
    const width = canvas.parentElement.clientWidth - 16 || 360;
    const unscaled = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: width / unscaled.width });
    const context = canvas.getContext("2d");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
  } catch (error) {
    useFrame("The page viewer could not draw this page. The PDF is open below.");
  } finally {
    rendering = false;
  }
}

GlobalWorkerOptions.workerSrc = "/kitab/pdfjs/pdf.worker.min.mjs";

const slug = location.pathname.split("/").filter(Boolean).pop() || FALLBACK_SLUG;
const catalog = await fetch("/kitab/books.json").then((response) => response.json());
const books = (catalog.categories || []).flatMap((category) => category.books || []);
const book = books.find((item) => item.slug === slug || item.id === slug) || books.find((item) => item.slug === FALLBACK_SLUG);
if (book) {
  pdfUrl = book.pdf;
  document.title = book.title + " — HajCare AI";
  const heading = document.querySelector("main h1");
  if (heading) heading.textContent = book.title;
  const countLabel = document.getElementById("page-count");
  if (countLabel) countLabel.textContent = book.pages + " pages";
  const meta = document.querySelector("main .meta");
  if (meta) {
    const bits = ["Language: " + book.language, "Format: " + book.format];
    if (book.publisher) bits.push("Publisher: " + book.publisher);
    meta.textContent = bits.join(" · ") + " · ";
    if (countLabel) meta.append(countLabel);
  }
  const download = document.getElementById("download");
  if (download) {
    download.href = book.pdf;
    download.setAttribute("download", book.pdf.split("/").pop() || "book.pdf");
  }
  const frameTitle = document.getElementById("pdf-frame");
  if (frameTitle) frameTitle.title = book.title + " PDF";
}

getDocument({ url: pdfUrl, rangeChunkSize: 65536, disableAutoFetch: true }).promise
  .then((loaded) => {
    doc = loaded;
    count.textContent = loaded.numPages + " pages";
    pageInput.max = String(loaded.numPages);
    if (pageNum > loaded.numPages) pageNum = loaded.numPages;
    return show(pageNum);
  })
  .catch(() => useFrame("Opening the PDF in the browser viewer."));

document.getElementById("prev").addEventListener("click", () => { void show(pageNum - 1); });
document.getElementById("next").addEventListener("click", () => { void show(pageNum + 1); });
pageInput.addEventListener("change", () => { void show(Number(pageInput.value) || 1); });
let resizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => { if (doc) void show(pageNum); }, 250);
});
