import { useState, useMemo } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Smartphone, Users, CheckCircle2, Bell, Send, Phone } from "lucide-react";

interface Pilgrim {
  id: string;
  name: string;
  embarkation: string;
  saudiNumber: string | null;
  updatedAt: string | null;
}

const SEED: Pilgrim[] = [
  { id: "IND-2025-04872", name: "Mohammed Abdullah", embarkation: "Mumbai", saudiNumber: null, updatedAt: null },
  { id: "IND-2025-04873", name: "Ayesha Khatoon", embarkation: "Mumbai", saudiNumber: "+966 50 123 4567", updatedAt: "10 min ago" },
  { id: "IND-2025-04874", name: "Imran Sheikh", embarkation: "Mumbai", saudiNumber: null, updatedAt: null },
  { id: "IND-2025-04875", name: "Fatima Bi", embarkation: "Mumbai", saudiNumber: "+966 54 987 1234", updatedAt: "1 hr ago" },
  { id: "IND-2025-04876", name: "Yusuf Ansari", embarkation: "Mumbai", saudiNumber: null, updatedAt: null },
];

type Step = "search" | "confirm" | "enter" | "done";

const SaudiSimUpdatePage = () => {
  const [view, setView] = useState<"haji" | "shi">("haji");
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>(SEED);

  // Haji flow state
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [match, setMatch] = useState<Pilgrim | null>(null);
  const [saudiNum, setSaudiNum] = useState("+966 ");

  const updatedCount = useMemo(() => pilgrims.filter(p => p.saudiNumber).length, [pilgrims]);
  const total = pilgrims.length;
  const pct = Math.round((updatedCount / total) * 100);

  const handleSearch = () => {
    const found = pilgrims.find(p => p.id.toLowerCase() === query.trim().toLowerCase());
    if (!found) {
      toast({ title: "ID नहीं मिली", description: "कृपया सही Cover ID डालें", variant: "destructive" });
      return;
    }
    setMatch(found);
    setStep("confirm");
  };

  const handleSubmit = () => {
    if (!match) return;
    if (saudiNum.replace(/\D/g, "").length < 10) {
      toast({ title: "Invalid number", variant: "destructive" });
      return;
    }
    setPilgrims(prev => prev.map(p => p.id === match.id ? { ...p, saudiNumber: saudiNum, updatedAt: "just now" } : p));
    setStep("done");
    toast({ title: "✅ Submitted", description: "SHI और परिवार को सूचना भेज दी गई" });
  };

  const reset = () => {
    setStep("search"); setQuery(""); setMatch(null); setSaudiNum("+966 ");
  };

  const sendReminder = (p: Pilgrim) => {
    toast({ title: "📲 Reminder sent", description: `${p.name} को WhatsApp reminder भेजा गया` });
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-md mx-auto px-4 py-6 space-y-4">
        {/* View toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Saudi SIM Update
            </h1>
            <p className="text-xs text-muted-foreground">Demo flow</p>
          </div>
          <div className="inline-flex rounded-lg border bg-muted p-1 text-xs">
            <button
              onClick={() => setView("haji")}
              className={`px-3 py-1.5 rounded-md font-medium ${view === "haji" ? "bg-background shadow" : ""}`}
            >🕌 Haji</button>
            <button
              onClick={() => setView("shi")}
              className={`px-3 py-1.5 rounded-md font-medium ${view === "shi" ? "bg-background shadow" : ""}`}
            >👮 SHI</button>
          </div>
        </div>

        {view === "haji" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">अपना Saudi नंबर update करें</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === "search" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Cover ID</label>
                    <Input
                      placeholder="IND-2025-04872"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Try: IND-2025-04872</p>
                  </div>
                  <Button className="w-full" onClick={handleSearch}>खोजें</Button>
                </>
              )}

              {step === "confirm" && match && (
                <>
                  <div className="rounded-lg border p-4 bg-muted/40">
                    <p className="text-sm text-muted-foreground">क्या आप यही हैं?</p>
                    <p className="font-bold text-lg mt-1">{match.name}</p>
                    <p className="text-xs text-muted-foreground">{match.id} • {match.embarkation}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={reset}>नहीं</Button>
                    <Button onClick={() => setStep("enter")}>हाँ, यही हूँ</Button>
                  </div>
                </>
              )}

              {step === "enter" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Saudi SIM नंबर</label>
                    <Input
                      placeholder="+966 5X XXX XXXX"
                      value={saudiNum}
                      onChange={e => setSaudiNum(e.target.value)}
                      className="mt-1"
                      inputMode="tel"
                    />
                  </div>
                  <Button className="w-full" onClick={handleSubmit}>
                    <Send className="w-4 h-4 mr-2" /> Submit
                  </Button>
                </>
              )}

              {step === "done" && match && (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500" />
                  <p className="font-bold">Update हो गया!</p>
                  <p className="text-sm text-muted-foreground">
                    SHI को instant notification भेज दिया गया और परिवार को WhatsApp पर नया नंबर मिल जाएगा।
                  </p>
                  <Button variant="outline" onClick={reset}>Done</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Group Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{updatedCount}<span className="text-base text-muted-foreground">/{total}</span></span>
                  <Badge variant="secondary">{pct}% updated</Badge>
                </div>
                <Progress value={pct} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> हाजी List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pilgrims.map(p => (
                  <div key={p.id} className="rounded-lg border p-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.id}</p>
                      {p.saudiNumber ? (
                        <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Phone className="w-3 h-3" /> {p.saudiNumber}
                          <span className="text-muted-foreground">• {p.updatedAt}</span>
                        </p>
                      ) : (
                        <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">Pending update</p>
                      )}
                    </div>
                    {p.saudiNumber ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => sendReminder(p)}>
                        Remind
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default SaudiSimUpdatePage;
