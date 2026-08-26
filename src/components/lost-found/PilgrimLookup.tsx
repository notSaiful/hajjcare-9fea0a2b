import { useState } from "react";
import { Loader2, Search, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export type PilgrimLookupResult = {
  cover_number: string | null;
  haji_name: string;
  contact_person_name: string | null;
  contact_person_mobile: string | null;
  hajj_group_number: string | null;
  building_hotel_camp: string | null;
  nationality: string | null;
};

type LookupClient = { rpc: (name: string, args: Record<string, string>) => Promise<{ data: PilgrimLookupResult[] | null; error: Error | null }> };

/** Private lookup: the server validates the caller before returning any contact details. */
export function PilgrimLookup({ onFound }: { onFound: (pilgrim: PilgrimLookupResult) => void }) {
  const { toast } = useToast();
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PilgrimLookupResult | null>(null);

  const lookup = async () => {
    if (reference.trim().length < 5) {
      toast({ title: "Enter a cover number or registered mobile number", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await (supabase as unknown as LookupClient).rpc("lookup_lost_found_pilgrim", { p_reference: reference.trim() });
      if (error) throw error;
      const pilgrim = data?.[0];
      if (!pilgrim) {
        setResult(null);
        toast({ title: "No verified pilgrim record found", description: "Check the reference or ask authorised staff for help.", variant: "destructive" });
        return;
      }
      setResult(pilgrim);
      onFound(pilgrim);
    } catch (error) {
      toast({ title: "Lookup unavailable", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
    <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary" />Verified pilgrim lookup</div>
    <div className="flex gap-2"><Input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Cover number or registered mobile" inputMode="numeric" /><Button type="button" onClick={() => void lookup()} disabled={loading} className="shrink-0">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}<span className="sr-only">Search</span></Button></div>
    {result && <p className="text-xs text-muted-foreground">Verified: <span className="font-semibold text-foreground">{result.haji_name}</span>{result.hajj_group_number ? ` · Group ${result.hajj_group_number}` : ""}{result.building_hotel_camp ? ` · ${result.building_hotel_camp}` : ""}</p>}
  </div>;
}
