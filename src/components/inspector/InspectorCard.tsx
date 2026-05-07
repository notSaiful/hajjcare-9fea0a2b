import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HajInspector } from "@/data/hajInspectorsData";
import {
  User,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  Building2,
  IdCard,
  MapPin,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

interface InspectorCardProps {
  inspector: HajInspector;
  isExpanded: boolean;
  onToggle: () => void;
  translations: Record<string, string>;
}

const sanitizePhone = (p: string) => p.replace(/[^\d+]/g, "");

export const InspectorCard = ({ inspector, isExpanded, onToggle, translations: t }: InspectorCardProps) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyNumber = async (value: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast({ title: `${label} copied`, description: value });
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually." });
    }
  };

  const hasContact = inspector.indianMobile || inspector.ksaMobile;
  const hasBuilding = inspector.makkahBuilding || inspector.madinahBuilding;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{inspector.name}</h3>
                    <Badge
                      variant={inspector.result === 'Selected' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs shrink-0",
                        inspector.result === 'Selected'
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      )}
                    >
                      {inspector.result === 'Selected' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" />{t.selected}</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" />{t.waitlisted}</>
                      )}
                    </Badge>
                  </div>

                  {/* Cover Number prominently displayed */}
                  {inspector.coverNumber && (
                    <div className="flex items-center gap-1.5 text-xs mb-1">
                      <IdCard className="w-3.5 h-3.5 text-primary" />
                      <span className="text-muted-foreground">{t.coverNumber || 'Cover #'}:</span>
                      <strong className="text-foreground">{inspector.coverNumber}</strong>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mb-1">ID: {inspector.id}</p>
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {inspector.state}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                    <span className="text-muted-foreground">{t.totalMarks}: <strong className="text-foreground">{inspector.totalMarks}</strong></span>
                    <Badge variant="outline" className="text-xs">{inspector.gender}</Badge>
                  </div>
                </div>
              </div>
              <div className="ml-2 text-muted-foreground">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 space-y-3 border-t">
            {/* Contact section */}
            {hasContact && (
              <div className="pt-3 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.contactInfo || 'Contact'}
                </div>

                {inspector.indianMobile && (
                  <div className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground">🇮🇳 {t.indianMobile || 'Indian Mobile'}</div>
                      <div className="text-sm font-medium truncate">{inspector.indianMobile}</div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => copyNumber(inspector.indianMobile!, `in-${inspector.id}`, t.indianMobile || 'Indian Mobile')}
                        aria-label="Copy Indian mobile"
                      >
                        {copiedKey === `in-${inspector.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-8 w-8">
                        <a href={`tel:${sanitizePhone(inspector.indianMobile)}`} aria-label="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-8 w-8 border-emerald-300 dark:border-emerald-700">
                        <a
                          href={`https://wa.me/${sanitizePhone(inspector.indianMobile).replace(/^\+/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {inspector.ksaMobile && (
                  <div className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground">🇸🇦 {t.ksaMobile || 'KSA Mobile'}</div>
                      <div className="text-sm font-medium truncate">{inspector.ksaMobile}</div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => copyNumber(inspector.ksaMobile!, `ksa-${inspector.id}`, t.ksaMobile || 'KSA Mobile')}
                        aria-label="Copy KSA mobile"
                      >
                        {copiedKey === `ksa-${inspector.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-8 w-8">
                        <a href={`tel:${sanitizePhone(inspector.ksaMobile)}`} aria-label="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-8 w-8 border-emerald-300 dark:border-emerald-700">
                        <a
                          href={`https://wa.me/${sanitizePhone(inspector.ksaMobile).replace(/^\+/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Building section */}
            {hasBuilding && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.buildingInfo || 'Posting / Building'}
                </div>
                {inspector.makkahBuilding && (
                  <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md px-3 py-2">
                    <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">🕋 {t.makkahBuilding || 'Makkah Building'}</div>
                      <div className="text-sm font-medium text-foreground break-words">{inspector.makkahBuilding}</div>
                    </div>
                  </div>
                )}
                {inspector.madinahBuilding && (
                  <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-md px-3 py-2">
                    <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">🕌 {t.madinahBuilding || 'Madinah Building'}</div>
                      <div className="text-sm font-medium text-foreground break-words">{inspector.madinahBuilding}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!hasContact && !hasBuilding && (
              <div className="pt-3 text-xs text-muted-foreground italic">
                {t.contactPending || 'Contact and building details will be updated soon.'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-3 text-sm border-t">
              <div>
                <span className="text-muted-foreground">{t.fatherName}:</span>
                <p className="font-medium">{inspector.fatherName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t.category}:</span>
                <p className="font-medium">{inspector.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{inspector.cbtMarks}</div>
                <div className="text-xs text-muted-foreground">{t.cbtMarks}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{inspector.interviewMarks}</div>
                <div className="text-xs text-muted-foreground">{t.interviewMarks}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-600">{inspector.totalMarks}</div>
                <div className="text-xs text-muted-foreground">{t.totalMarks}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{inspector.quota}</Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground">ID: {inspector.id}</Badge>
            </div>

            <Button asChild variant="default" size="sm" className="w-full">
              <a href={`/shi/${encodeURIComponent(inspector.coverNumber || inspector.id)}`}>
                <User className="w-4 h-4 mr-1.5" />
                View Full Profile
              </a>
            </Button>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
