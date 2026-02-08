import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { sukoonRdContent } from "@/data/sukoonRdContent";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ShieldCheck, ShieldX, MapPin, Phone } from "lucide-react";

export default function OperatorDirectory() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const t = sukoonRdContent.operators;

  const { data: operators = [], isLoading } = useQuery({
    queryKey: ["verified-operators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verified_operators")
        .select("*")
        .order("is_blacklisted", { ascending: true })
        .order("avg_rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = operators.filter(
    (op) =>
      op.company_name.toLowerCase().includes(search.toLowerCase()) ||
      op.name.toLowerCase().includes(search.toLowerCase()) ||
      op.state.toLowerCase().includes(search.toLowerCase()) ||
      (op.city && op.city.toLowerCase().includes(search.toLowerCase()))
  );

  const getLabel = (obj: Record<string, string>) => obj[language] || obj.en;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={language === "hi" ? "ऑपरेटर खोजें..." : language === "ur" ? "...آپریٹر تلاش کریں" : "Search operators..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((op) => (
            <Card
              key={op.id}
              className={`p-4 border-2 ${
                op.is_blacklisted
                  ? "border-destructive/30 bg-destructive/5"
                  : op.is_verified
                  ? "border-primary/20"
                  : "border-muted"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground text-sm truncate">
                      {op.company_name}
                    </h4>
                    {op.is_blacklisted ? (
                      <Badge variant="destructive" className="text-xs shrink-0">
                        <ShieldX className="w-3 h-3 mr-1" />
                        {language === "hi" ? "ब्लैकलिस्ट" : "Blacklisted"}
                      </Badge>
                    ) : op.is_verified ? (
                      <Badge className="bg-primary/10 text-primary text-xs shrink-0">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {language === "hi" ? "सत्यापित" : "Verified"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {language === "hi" ? "लंबित" : "Pending"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{op.name}</p>
                  {op.license_number && (
                    <p className="text-xs text-muted-foreground">
                      License: {op.license_number}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {op.city}, {op.state}
                    </span>
                    {op.phone && (
                      <a
                        href={`tel:${op.phone}`}
                        className="flex items-center gap-1 text-primary"
                      >
                        <Phone className="w-3 h-3" />
                        {language === "hi" ? "कॉल" : "Call"}
                      </a>
                    )}
                  </div>
                  {op.is_blacklisted && op.blacklist_reason && (
                    <p className="text-xs text-destructive mt-2 bg-destructive/10 rounded p-2">
                      ⚠️ {op.blacklist_reason}
                    </p>
                  )}
                </div>
                {!op.is_blacklisted && op.avg_rating > 0 && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-sm">{Number(op.avg_rating).toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {op.total_reviews} {language === "hi" ? "समीक्षा" : "reviews"}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {language === "hi" ? "कोई ऑपरेटर नहीं मिला" : "No operators found"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
