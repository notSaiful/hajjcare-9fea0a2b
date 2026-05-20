import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, HandIcon, CheckCircle2, XCircle, Clock, Inbox, Send } from "lucide-react";

type ClaimStatus = "pending" | "approved" | "rejected" | "withdrawn";

export interface Claim {
  id: string;
  report_id: string;
  owner_user_id: string | null;
  claimant_user_id: string;
  claimant_name: string;
  claimant_mobile: string;
  claimant_whatsapp: string | null;
  claim_description: string;
  proof_photo_url: string | null;
  status: ClaimStatus;
  owner_response_note: string | null;
  responded_at: string | null;
  created_at: string;
  report?: {
    item_name: string | null;
    person_name: string | null;
    photo_url: string | null;
    last_seen_location: string;
    post_kind: string | null;
  };
}

const statusStyles: Record<ClaimStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-300",
  rejected: "bg-rose-100 text-rose-800 border-rose-300",
  withdrawn: "bg-muted text-muted-foreground border-border",
};

const statusIcon = (s: ClaimStatus) =>
  s === "approved" ? <CheckCircle2 className="h-3 w-3 mr-1" />
  : s === "rejected" ? <XCircle className="h-3 w-3 mr-1" />
  : <Clock className="h-3 w-3 mr-1" />;

/* ---------------- Claim Dialog ---------------- */

interface ClaimDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  report: {
    id: string;
    item_name: string | null;
    person_name: string | null;
    photo_url: string | null;
  };
  onSubmitted: () => void;
}

export const ClaimDialog = ({ open, onOpenChange, report, onSubmitted }: ClaimDialogProps) => {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !user?.id) return;
    (async () => {
      const { data } = await supabase
        .from("profiles").select("full_name, phone")
        .eq("user_id", user.id).maybeSingle();
      if (data) {
        setName((prev) => prev || data.full_name || "");
        setMobile((prev) => prev || data.phone || "");
      }
    })();
  }, [open, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Sign-in required", description: "Please sign in to claim items.", variant: "destructive" });
      return;
    }
    if (description.trim().length < 10) {
      toast({ title: "Add more detail", description: "Describe identifying details (min 10 chars).", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.from("lost_found_claims").insert({
        report_id: report.id,
        claimant_user_id: user.id,
        claimant_name: name.trim(),
        claimant_mobile: mobile.trim(),
        claimant_whatsapp: whatsapp.trim() || null,
        claim_description: description.trim(),
      }).select("id").single();
      if (error) throw error;

      // Fire-and-forget owner notification
      supabase.functions.invoke("lost-found-claim-notify", {
        body: { claimId: data.id, eventType: "new_claim" },
      }).catch((e) => console.warn("notify failed", e));

      toast({ title: "Claim sent", description: "The owner has been notified." });
      onSubmitted();
      onOpenChange(false);
      setDescription("");
    } catch (err: any) {
      toast({ title: "Could not send claim", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const subject = report.item_name || report.person_name || "this item";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim "{subject}"</DialogTitle>
          <DialogDescription>
            Tell the finder why this belongs to you. They will review and respond.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="c-name">Your Name *</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
          </div>
          <div>
            <Label htmlFor="c-mob">Mobile *</Label>
            <Input id="c-mob" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={20} required />
          </div>
          <div>
            <Label htmlFor="c-wa">WhatsApp (optional)</Label>
            <Input id="c-wa" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={20} />
          </div>
          <div>
            <Label htmlFor="c-desc">Identifying details *</Label>
            <Textarea
              id="c-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe unique marks, contents, where/when you lost it, anything only the real owner would know."
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Send claim</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/* ---------------- My Claims & Incoming Claims ---------------- */

export const ClaimsPanel = () => {
  const { user } = useAuthContext();
  const [myClaims, setMyClaims] = useState<Claim[]>([]);
  const [incoming, setIncoming] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [respondNote, setRespondNote] = useState<Record<string, string>>({});

  const reportSelect = "report:lost_and_found!inner(item_name,person_name,photo_url,last_seen_location,post_kind)";

  const fetchAll = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const [{ data: mine }, { data: inc }] = await Promise.all([
      supabase.from("lost_found_claims")
        .select(`*, ${reportSelect}`)
        .eq("claimant_user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("lost_found_claims")
        .select(`*, ${reportSelect}`)
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);
    setMyClaims((mine ?? []) as any);
    setIncoming((inc ?? []) as any);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Realtime updates
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`claims-${user.id}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "lost_found_claims" },
        () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id, fetchAll]);

  const respond = async (claim: Claim, newStatus: "approved" | "rejected") => {
    const { error } = await supabase
      .from("lost_found_claims")
      .update({
        status: newStatus,
        owner_response_note: respondNote[claim.id] || null,
        responded_at: new Date().toISOString(),
      })
      .eq("id", claim.id);
    if (error) {
      toast({ title: "Could not update", description: error.message, variant: "destructive" });
      return;
    }
    supabase.functions.invoke("lost-found-claim-notify", {
      body: { claimId: claim.id, eventType: "claim_responded" },
    }).catch(() => {});
    toast({ title: `Claim ${newStatus}` });
    fetchAll();
  };

  const withdraw = async (claim: Claim) => {
    if (!confirm("Withdraw this claim?")) return;
    const { error } = await supabase
      .from("lost_found_claims")
      .update({ status: "withdrawn" })
      .eq("id", claim.id);
    if (error) {
      toast({ title: "Could not withdraw", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Claim withdrawn" });
    fetchAll();
  };

  if (!user) return null;
  if (loading && myClaims.length === 0 && incoming.length === 0) return null;
  if (myClaims.length === 0 && incoming.length === 0) return null;

  const pendingIncoming = incoming.filter((c) => c.status === "pending").length;

  return (
    <Card className="border-emerald-200">
      <CardContent className="p-3">
        <Accordion type="multiple" className="w-full">
          {incoming.length > 0 && (
            <AccordionItem value="incoming" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Inbox className="h-4 w-4 text-emerald-600" />
                  Claims on your reports
                  {pendingIncoming > 0 && (
                    <Badge className="bg-amber-500 hover:bg-amber-500 h-5">{pendingIncoming} new</Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {incoming.map((c) => (
                  <div key={c.id} className="border rounded-md p-3 space-y-2 bg-background">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {c.report?.item_name || c.report?.person_name || "Report"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          From: {c.claimant_name} · {c.claimant_mobile}
                        </p>
                      </div>
                      <Badge className={`${statusStyles[c.status]} border text-xs`}>
                        {statusIcon(c.status)}{c.status}
                      </Badge>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{c.claim_description}</p>
                    {c.status === "pending" && (
                      <div className="space-y-2 pt-1">
                        <Textarea
                          rows={2}
                          placeholder="Optional note to send back…"
                          value={respondNote[c.id] || ""}
                          onChange={(e) => setRespondNote({ ...respondNote, [c.id]: e.target.value })}
                          maxLength={500}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => respond(c, "approved")} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => respond(c, "rejected")} className="flex-1 text-rose-600 border-rose-300 hover:bg-rose-50">
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    )}
                    {c.owner_response_note && c.status !== "pending" && (
                      <p className="text-xs italic text-muted-foreground">Your note: {c.owner_response_note}</p>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
          {myClaims.length > 0 && (
            <AccordionItem value="mine" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <HandIcon className="h-4 w-4 text-primary" />
                  My claims ({myClaims.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {myClaims.map((c) => (
                  <div key={c.id} className="border rounded-md p-3 space-y-2 bg-background">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {c.report?.item_name || c.report?.person_name || "Report"}
                      </p>
                      <Badge className={`${statusStyles[c.status]} border text-xs`}>
                        {statusIcon(c.status)}{c.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.claim_description}</p>
                    {c.owner_response_note && (
                      <p className="text-xs italic">Finder's note: {c.owner_response_note}</p>
                    )}
                    {c.status === "pending" && (
                      <Button size="sm" variant="ghost" onClick={() => withdraw(c)} className="h-7 text-xs">
                        Withdraw
                      </Button>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};
