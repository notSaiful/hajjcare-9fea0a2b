# Circular Scraper Upgrade + Trainer Circulars Source

## Goal
1. Circular fetching ko zyada reliable banana (2027 + all-year archive, better parsing, better dedupe).
2. Ek naya **Trainer** source add karna — Haj Committee of India ke Training of Trainers documents/circulars alag badge ke saath Admin → Circulars aur public Circulars page par dikhein.

## What will change

### 1. Scraper improvements (`fetch-hci-circulars`)
- Pages scraped: homepage, `/circulars-haj-2027/`, plus the year-wise archive `/circulars` (so purane/naye dono saal cover ho).
- Parsing: current regexes miss PDF links jinme `Circular 25_Training of Trainers.pdf` jaisa naming hai (space, underscore, URL-encoded). Add a generic PDF-link pass over `/uploads/circulars/*.pdf` that derives circular number and a clean title from the link text or filename.
- Dedupe: match on normalised `source_url` (decoded, lowercased) in addition to `circular_number`, so ek hi PDF alag titles se duplicate na ho.
- Category detection: add a `training` category when title/filename me "trainer", "training", "orientation" ho.
- Fetch log: `circular_fetch_log` me per-source counts likhein (HCI vs TRAINER), taaki Admin status card dono dikha sake.

### 2. New source: Trainer circulars
- Scrape `https://hajcommittee.gov.in/TrainnerDoc` (Training of Trainer documents page) plus training-related circular PDFs found on the main pages.
- Inserted rows get `source = "TRAINER"`, `source_name_display = "Trainer / Training"`, `category = "training"`.
- Admin → Circulars: "TRAINER" ko manual-add form ke source dropdown me add karein, aur status card me trainer fetch ka last-run time dikhaayein.
- Public Circulars page: source badge already source-driven hai; ek distinct colour add karke Trainer badge alag dikhega, plus source filter chips (All / HCI / Saudi / Trainer).

### 3. Run an update
- Deploy ke baad function ko ek baar trigger karke latest HCI + Trainer circulars merge karenge, aur count report karenge.

## Technical notes
- Files: `supabase/functions/fetch-hci-circulars/index.ts`, `src/pages/AdminCircularsPage.tsx`, `src/pages/CircularsPage.tsx`, `src/hooks/useCirculars.ts` (filter support only).
- No schema change needed — `hajj_circulars` me already `source`, `source_name_display`, `category`, `auto_scraped` columns hain, aur `circular_fetch_log` me `source` column hai.
- Existing cron (`daily-fetch-hci-circulars`, 01:00 UTC / 06:30 IST) hi trainer source bhi fetch karega — koi naya cron nahi.
- AI summaries (`summarize-circular`) unchanged; trainer circulars bhi usi flow se summarise ho sakte hain.

## Out of scope
- PDF ka full text extract karke AI summary auto-generate karna (abhi title-based hi rahega).
