import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Phone,
  Copy,
  Check,
  MessageCircle,
  Building2,
} from "lucide-react";
import { IHPO_MADINAH_DESKS } from "@/data/ihpoMadinahDesks";
import { useToast } from "@/hooks/use-toast";

const KSA_PREFIX = "+966";

const formatKsa = (mobile: string) => `${KSA_PREFIX} ${mobile}`;

/**
 * IHPO Madinah Desk Directory — quick-access panel for HAJ 2026.
 * Shows on-desk officer numbers (SHI, Welfare, Arrival, Airport, Baggage,
 * Computer Cell, Reception, Dispensary) with one-tap call / WhatsApp / copy.
 *
 * Numbers are Saudi mobiles — dialled with +966 automatically.
 */
export const IHPOMadinahDeskPanel = () => {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return IHPO_MADINAH_DESKS;
    return IHPO_MADINAH_DESKS.filter((d) => {
      const hay = [
        d.department,
        d.departmentHi || "",
        d.mobile,
        d.whenToCall || "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const handleCopy = async (id: string, mobile: string) => {
    try {
      await navigator.clipboard.writeText(formatKsa(mobile));
      setCopiedId(id);
      toast({
        title: "Copied",
        description: formatKsa(mobile),
        duration: 1500,
      });
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              IHPO Madinah — Desk Numbers
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              HAJ 2026 • Saudi numbers (auto-prefixed with +966)
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {IHPO_MADINAH_DESKS.length} desks
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search desk / department / number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9 h-9 text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No desks match your search.
            </div>
          ) : (
            filtered.map((desk) => {
              const tel = `tel:+966${desk.mobile}`;
              const wa = `https://wa.me/966${desk.mobile}`;
              const isCopied = copiedId === desk.id;
              return (
                <div
                  key={desk.id}
                  className="rounded-lg border border-border bg-card p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {desk.department}
                      </p>
                      {desk.departmentHi && (
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          {desk.departmentHi}
                        </p>
                      )}
                      {desk.whenToCall && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {desk.whenToCall}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-xs text-foreground whitespace-nowrap">
                      {formatKsa(desk.mobile)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      asChild
                      size="sm"
                      className="h-8 flex-1 text-xs"
                    >
                      <a href={tel} aria-label={`Call ${desk.department}`}>
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        Call
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1 text-xs"
                    >
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${desk.department}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1" />
                        WhatsApp
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => handleCopy(desk.id, desk.mobile)}
                      aria-label={`Copy ${desk.department} number`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-muted-foreground border-t border-border pt-2">
          ये सभी सऊदी नंबर हैं — कॉल करने पर अपने आप +966 लग जाएगा।
        </p>
      </CardContent>
    </Card>
  );
};

export default IHPOMadinahDeskPanel;
