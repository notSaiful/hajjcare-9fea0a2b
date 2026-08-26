import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Loader2, Send, ShieldAlert, UserRoundCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { MemberLocation } from "@/hooks/useFamilyGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type AssistanceTicket = {
  id: string;
  status: "submitted" | "ai_triaged" | "coordinator_reviewing" | "whatsapp_alerted" | "professional_responding" | "action_taken" | "resolved" | "closed";
  created_at: string | null;
};

const STATUS_STEPS = ["submitted", "professional_responding", "action_taken", "resolved", "closed"] as const;
const STATUS_LABELS: Record<AssistanceTicket["status"], string> = {
  submitted: "Submitted",
  ai_triaged: "Submitted",
  coordinator_reviewing: "Volunteer assigned",
  whatsapp_alerted: "Volunteer assigned",
  professional_responding: "In progress",
  action_taken: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

function statusStep(status: AssistanceTicket["status"]) {
  if (status === "ai_triaged") return 0;
  if (status === "coordinator_reviewing" || status === "whatsapp_alerted") return 1;
  if (status === "professional_responding" || status === "action_taken") return 2;
  return STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
}

/** Creates consent-bound family assistance requests using the existing secured SOS dispatch pipeline. */
export function FamilyAssistancePanel({ locations }: { locations: MemberLocation[] }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState<"help" | "sos" | null>(null);
  const [activeTicket, setActiveTicket] = useState<AssistanceTicket | null>(null);

  useEffect(() => {
    if (!selectedMemberId && locations[0]) setSelectedMemberId(locations[0].member_id);
  }, [locations, selectedMemberId]);

  const selected = useMemo(
    () => locations.find((location) => location.member_id === selectedMemberId) ?? locations[0],
    [locations, selectedMemberId],
  );

  useEffect(() => {
    if (!user || !selected) return;
    const load = async () => {
      const marker = `[sukoon:${selected.member_id}]`;
      const { data } = await supabase
        .from("health_tickets")
        .select("id, status, created_at")
        .eq("user_id", user.id)
        .eq("ai_category", "family_assistance")
        .ilike("description", `%${marker}%`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setActiveTicket(data as AssistanceTicket | null);
    };
    void load();
  }, [selected, user]);

  const submit = async (kind: "help" | "sos") => {
    if (!user || !selected) return;
    setSending(kind);
    const isEmergency = kind === "sos";
    const note = details.trim().slice(0, 750);
    const description = `${isEmergency ? "FAMILY SOS" : "FAMILY ASSISTANCE"}: ${isEmergency ? "Immediate welfare check requested" : "Family member requests help"} for ${selected.member_name || "pilgrim"}. Stage: ${selected.current_stage || "unknown"}. ${note || "No additional details."} [sukoon:${selected.member_id}]`;

    try {
      const { data: ticket, error } = await supabase
        .from("health_tickets")
        .insert({
          user_id: user.id,
          description,
          symptoms: isEmergency ? ["family_sos", "welfare_check", "immediate_help"] : ["family_assistance", "welfare_check"],
          original_language: "en",
          location_lat: selected.latitude,
          location_lng: selected.longitude,
          zone: selected.current_stage || "general",
          ai_urgency_level: isEmergency ? "critical" : "high",
          ai_triage_summary: isEmergency ? "Family-initiated SOS. Verify pilgrim welfare and dispatch the nearest available responder." : "Family assistance request. Verify pilgrim welfare and coordinate a responder if required.",
          ai_category: "family_assistance",
          ai_recommendations: ["Verify consent and current location", "Notify group leader", "Dispatch nearest available responder when needed"],
          status: "submitted",
        })
        .select("id, status, created_at")
        .single();
      if (error) throw error;

      // The protected edge function selects an available responder. Failure here
      // never hides the ticket; staff can still triage it from their dashboard.
      const { data: allocation } = await supabase.functions.invoke("allocate-responder", {
        body: { ticket_id: ticket.id, lat: selected.latitude, lng: selected.longitude, zone: selected.current_stage || "general", escalation_level: isEmergency ? 2 : 1 },
      });
      await supabase.functions.invoke("whatsapp-alert", {
        body: { ticketId: ticket.id, zone: selected.current_stage || "general", urgencyLevel: isEmergency ? "critical" : "high", summary: description, category: "family_assistance", location: { lat: selected.latitude, lng: selected.longitude } },
      });

      setActiveTicket(ticket as AssistanceTicket);
      setDetails("");
      toast({
        title: isEmergency ? "SOS submitted" : "Help request submitted",
        description: allocation?.allocated ? "The nearest available responder has been notified." : "Your request is visible to the HajCare response team.",
      });
    } catch (error) {
      console.error("Family assistance request failed:", error);
      toast({ title: "Unable to send request", description: "Please try again or call the official emergency helpline.", variant: "destructive" });
    } finally {
      setSending(null);
    }
  };

  if (!locations.length) return null;
  const currentStep = activeTicket ? statusStep(activeTicket.status) : -1;

  return (
    <Card className="border-amber-500/25 bg-gradient-to-br from-amber-50/60 via-background to-emerald-50/50 dark:from-amber-950/15 dark:to-emerald-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="h-5 w-5 text-amber-700" />Need help for my family member</CardTitle>
        <p className="text-sm font-normal text-muted-foreground">Requests use the pilgrim’s consented last-known location and are sent to the HajCare response workflow.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {locations.length > 1 && (
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger aria-label="Choose a pilgrim"><SelectValue /></SelectTrigger>
            <SelectContent>{locations.map((location) => <SelectItem key={location.member_id} value={location.member_id}>{location.member_name || "Pilgrim"} · {location.current_stage || "Location shared"}</SelectItem>)}</SelectContent>
          </Select>
        )}
        <Textarea value={details} onChange={(event) => setDetails(event.target.value)} maxLength={750} placeholder="Describe what help is needed (optional)" className="min-h-20 resize-none" />
        <div className="grid gap-2 sm:grid-cols-2">
          <Button onClick={() => void submit("help")} disabled={Boolean(sending)} className="min-h-11 gap-2"><Send className="h-4 w-4" />{sending === "help" ? "Submitting…" : "Request assistance"}</Button>
          <Button onClick={() => void submit("sos")} disabled={Boolean(sending)} variant="destructive" className="min-h-11 gap-2"><AlertTriangle className="h-4 w-4" />{sending === "sos" ? "Sending SOS…" : "Emergency SOS"}</Button>
        </div>
        {activeTicket && (
          <div className="rounded-xl border border-border/60 bg-background/70 p-3" aria-live="polite">
            <p className="mb-3 text-sm font-semibold">Request status: {STATUS_LABELS[activeTicket.status]}</p>
            <ol className="grid grid-cols-5 gap-1 text-center text-[10px] sm:text-xs">{STATUS_STEPS.map((step, index) => {
              const complete = index <= currentStep;
              const Icon = index < currentStep ? CheckCircle2 : index === currentStep ? UserRoundCheck : Clock3;
              return <li key={step} className={complete ? "text-primary" : "text-muted-foreground"}><Icon className="mx-auto mb-1 h-4 w-4" />{["Submitted", "Assigned", "In progress", "Resolved", "Closed"][index]}</li>;
            })}</ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
