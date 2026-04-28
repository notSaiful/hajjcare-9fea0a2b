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
  Pencil,
} from "lucide-react";
import type { IHPODesk } from "@/data/ihpoMadinahDesks";
import { useToast } from "@/hooks/use-toast";

const KSA_PREFIX = "+966";

const formatKsa = (mobile: string) => `${KSA_PREFIX} ${mobile}`;

interface IHPODeskPanelProps {
  /** City label shown in the header, e.g. "Madinah" or "Makkah" */
  city: string;
  /** Desk roster for this city (overrides already applied) */
  desks: IHPODesk[];
  /** When true, show an Edit button (admins only) */
  canEdit?: boolean;
  /** Click handler for the Edit button */
  onEdit?: () => void;
}

/**
 * Generic IHPO desk directory panel — used by Madinah & Makkah.
 * Shows on-desk officer numbers (SHI, Welfare, Arrival, Airport, Baggage,
 * Computer Cell, Reception, Dispensary) with one-tap call / WhatsApp / copy.
 *
 * Numbers are Saudi mobiles — dialled with +966 automatically. Entries with
 * an empty `mobile` are rendered as "Number pending" and disable Call/WhatsApp.
 */
export const IHPODeskPanel = ({
  city,
  desks,
  canEdit = false,
  onEdit,
}: IHPODeskPanelProps) => {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return desks;
    return desks.filter((d) => {
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
  }, [query, desks]);

  const pendingCount = useMemo(
    () => desks.filter((d) => !d.mobile).length,
    [desks]
  );

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
              IHPO {city} — Desk Numbers
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              HAJ 2026 • Saudi numbers (auto-prefixed with +966)
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {desks.length} desks
          </Badge>
        </div>

        {pendingCount > 0 && (
          <div className="rounded-md border border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-[11px] text-amber-800 dark:text-amber-200">
            {pendingCount} desk{pendingCount === 1 ? "" : "s"} awaiting official
            numbers — Call / WhatsApp will activate once added.
          </div>
        )}

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
              const hasNumber = Boolean(desk.mobile);
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
                    <span
                      className={`font-mono text-xs whitespace-nowrap ${
                        hasNumber
                          ? "text-foreground"
                          : "italic text-muted-foreground"
                      }`}
                    >
                      {hasNumber ? formatKsa(desk.mobile) : "Number pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasNumber ? (
                      <Button asChild size="sm" className="h-8 flex-1 text-xs">
                        <a href={tel} aria-label={`Call ${desk.department}`}>
                          <Phone className="w-3.5 h-3.5 mr-1" />
                          Call
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-8 flex-1 text-xs"
                        disabled
                        aria-label={`Call ${desk.department} unavailable`}
                      >
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        Call
                      </Button>
                    )}
                    {hasNumber ? (
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
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 flex-1 text-xs"
                        disabled
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1" />
                        WhatsApp
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => handleCopy(desk.id, desk.mobile)}
                      aria-label={`Copy ${desk.department} number`}
                      disabled={!hasNumber}
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

export default IHPODeskPanel;
