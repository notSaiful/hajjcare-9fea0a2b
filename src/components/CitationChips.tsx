import { BookOpen, ExternalLink } from "lucide-react";
import type { Citation } from "@/lib/zoyaCitations";

const KIND_LABEL: Record<Citation["kind"], string> = {
  quran: "Qur'an",
  hadith: "Hadith",
  circular: "Circular",
  official: "Official",
  fiqh: "Fiqh",
  other: "Source",
};

export function CitationChips({ sources }: { sources?: Citation[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5 pl-10" aria-label="Sources">
      {sources.map((s) => {
        const text = (
          <>
            <BookOpen className="h-3 w-3 shrink-0" aria-hidden />
            <span className="font-semibold">{KIND_LABEL[s.kind]}</span>
            <span className="max-w-[16rem] truncate">{s.reference || s.title}</span>
            {s.url && <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />}
          </>
        );
        const cls = "inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/5 px-2 py-0.5 text-[11px] text-primary";
        return s.url ? (
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-primary/10`} title={s.title}>
            {text}
          </a>
        ) : (
          <span key={s.id} className={cls} title={s.title}>{text}</span>
        );
      })}
    </div>
  );
}

export default CitationChips;
