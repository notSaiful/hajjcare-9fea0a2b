import { useNavigate } from "react-router-dom";
import { BookOpenCheck, Bot, Languages, MessageCircle, Sparkles, Volume2 } from "lucide-react";
import zoyaHajjCompanion from "@/assets/ai/zoya-hajj-companion.jpeg";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Button } from "@/components/ui/button";

const features = [
  { label: "Voice Questions", icon: "🎤" },
  { label: "Voice Answers", icon: Volume2 },
  { label: "23 Indian languages", icon: Languages },
  { label: "AI-Powered Guidance", icon: Bot },
  { label: "Instant Responses", icon: Sparkles },
  { label: "Official Haj Guidelines", icon: BookOpenCheck },
];

/** Public, no-sign-in entry point to the Vapi-powered Haj guidance assistant. */
export function AyeshaAssistantCard() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="zoya-title" className="animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-emerald-50/80 to-amber-50/70 p-4 shadow-[0_16px_40px_rgba(5,92,63,0.13)] backdrop-blur-xl dark:from-emerald-950/70 dark:via-background dark:to-amber-950/30 sm:p-5">
        <div aria-hidden="true" className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-amber-300/30 bg-amber-200/20" />
        <div aria-hidden="true" className="absolute -bottom-16 -left-14 h-36 w-36 rounded-full border border-emerald-400/20 bg-emerald-300/15" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="mx-auto shrink-0 sm:mx-0" aria-hidden="true">
            <div className="rounded-full bg-gradient-to-br from-amber-300 via-amber-100 to-emerald-700 p-1 shadow-lg">
              <img
                src={zoyaHajjCompanion}
                alt=""
                width={112}
                height={112}
                className="h-24 w-24 rounded-full bg-emerald-100 object-cover object-[24%_20%] sm:h-28 sm:w-28"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="mb-1 flex items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"><Sparkles className="h-3.5 w-3.5" /></span>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your Haj companion</p>
            </div>
            <h2 id="zoya-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Ask Zoya AI</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Have a question about Haj 2027? Tap the microphone and ask in your own language. Zoya AI provides clear voice and text guidance for rituals, travel, accommodation, health, documents, and other pilgrimage-related topics.
            </p>
          </div>
        </div>

        <ul className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Zoya AI features">
          {features.map(({ label, icon: Icon }) => (
            <li key={label} className="flex min-w-0 items-center gap-2 rounded-xl border border-white/70 bg-white/60 px-2.5 py-2 text-xs font-medium text-foreground shadow-sm dark:border-white/10 dark:bg-background/40">
              {typeof Icon === "string" ? <span aria-hidden="true">{Icon}</span> : <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />}
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ul>

        <div className="relative mt-4 grid gap-2 sm:grid-cols-2">
          <VoiceAssistant variant="cta" />
          <Button variant="outline" onClick={() => navigate("/chat")} className="rounded-xl border-primary/30 bg-white/70 font-semibold text-primary shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary/5 dark:bg-background/40">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat with Zoya
          </Button>
        </div>
      </div>
    </section>
  );
}
