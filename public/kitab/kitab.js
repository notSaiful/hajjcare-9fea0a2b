(function () {
  const grid = document.querySelector("[data-kitab-grid]");
  const input = document.getElementById("kitab-search");
  if (!grid || !input) return;

  function card(book) {
    const article = document.createElement("article");
    article.className = "card kitab-book";
    article.dataset.bookTitle = book.title;
    article.dataset.bookId = book.id;
    const cover = document.createElement("img");
    cover.className = "kitab-cover";
    cover.src = book.cover;
    cover.alt = "";
    cover.width = 180;
    cover.height = 250;
    cover.loading = "lazy";
    cover.decoding = "async";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = book.status;
    const title = document.createElement("h3");
    title.textContent = book.title;
    const meta = document.createElement("p");
    meta.className = "meta";
    const lines = [["Language:", book.language], ["Format:", book.format]];
    if (book.author) lines.push(["Author:", book.author]);
    if (book.publisher) lines.push(["Publisher:", book.publisher]);
    lines.forEach(([label, value], index) => {
      const strong = document.createElement("b");
      strong.textContent = label;
      meta.append(strong, document.createTextNode(" " + value));
      if (index < lines.length - 1) meta.append(document.createElement("br"));
    });
    const open = document.createElement("a");
    open.className = "kitab-open";
    open.href = book.reader;
    open.textContent = "Open Book / Read PDF";
    const download = document.createElement("a");
    download.className = "kitab-download";
    download.href = book.pdf;
    download.setAttribute("download", book.pdf.split("/").pop() || "book.pdf");
    download.textContent = "Download PDF";
    const parts = [cover, badge, title, meta];
    if (book.source) {
      const source = document.createElement("p");
      source.className = "meta";
      const link = document.createElement("a");
      link.href = book.source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = book.source;
      source.append(document.createTextNode("Source: "), link);
      parts.push(source);
    }
    parts.push(open, download);
    article.append(...parts);
    return article;
  }

  function applySearch() {
    const query = input.value.trim().toLowerCase();
    document.querySelectorAll("main article").forEach((article) => {
      const heading = article.querySelector("h2, h3");
      const title = (article.dataset.bookTitle || (heading ? heading.textContent : "") || "").toLowerCase();
      article.hidden = query.length > 0 && !title.includes(query);
    });
    document.querySelectorAll("main section").forEach((section) => {
      const visible = [...section.querySelectorAll("article")].some((article) => !article.hidden);
      section.hidden = query.length > 0 && !visible;
    });
  }

  fetch("/kitab/books.json", { cache: "force-cache" })
    .then((response) => response.json())
    .then((catalog) => {
      const category = (catalog.categories || []).find((item) => item.id === "hajj-umrah-books");
      const section = document.getElementById("hajj-umrah-books");
      if (!category || !section) return;
      const heading = section.querySelector("h2");
      if (heading) heading.textContent = category.title;
      for (const book of category.books || []) grid.append(card(book));
      applySearch();
    })
    .catch(() => {
      grid.textContent = "Kitab list abhi nahi khul saki.";
    });

  input.addEventListener("input", applySearch);
})();
