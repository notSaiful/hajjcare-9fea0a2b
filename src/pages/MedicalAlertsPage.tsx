import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Navigation,
  MessageSquare,
  Loader2,
  Volume2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface EmergencyTicket {
  id: string;
  user_id: string;
  description: string;
  location_lat: number | null;
  location_lng: number | null;
  zone: string | null;
  ai_urgency_level: string;
  ai_triage_summary: string | null;
  ai_translated_text: string | null;
  ai_category: string | null;
  status: string;
  created_at: string;
}

const urgencyConfig = {
  critical: { 
    color: "bg-red-500", 
    textColor: "text-red-500",
    bgLight: "bg-red-500/10",
    border: "border-red-500/30",
    label: "CRITICAL" 
  },
  high: { 
    color: "bg-orange-500", 
    textColor: "text-orange-500",
    bgLight: "bg-orange-500/10",
    border: "border-orange-500/30",
    label: "HIGH" 
  },
  medium: { 
    color: "bg-yellow-500", 
    textColor: "text-yellow-500",
    bgLight: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    label: "MEDIUM" 
  },
  low: { 
    color: "bg-green-500", 
    textColor: "text-green-500",
    bgLight: "bg-green-500/10",
    border: "border-green-500/30",
    label: "LOW" 
  },
};

// Haptic feedback
const triggerHaptic = (pattern: "light" | "medium" | "alert") => {
  if (!("vibrate" in navigator)) return;
  const patterns = { light: 50, medium: 100, alert: [200, 100, 200] };
  try { navigator.vibrate(patterns[pattern]); } catch (e) {}
};

// Alert sound for new emergencies
const playAlertSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "square";
    gain.gain.value = 0.2;
    osc.start();
    setTimeout(() => { osc.frequency.value = 600; }, 150);
    setTimeout(() => { osc.frequency.value = 800; }, 300);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

const MedicalAlertsPage = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { hasAnyCoordinatorRole, isMedicalStaff, isLoading: roleLoading } = useUserRole();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [tickets, setTickets] = useState<EmergencyTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, { full_name: string | null; phone: string | null }>>({});

  const fetchEmergencies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("health_tickets")
        .select("*")
        .in("ai_urgency_level", ["critical", "high"])
        .in("status", ["submitted", "whatsapp_alerted", "coordinator_reviewing"])
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      const ticketData = data || [];
      setTickets(ticketData);
      
      // Fetch profiles for user_ids
      const userIds = [...new Set(ticketData.map(t => t.user_id).filter(Boolean))];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_id, full_name, phone")
          .in("user_id", userIds);
        
        if (profileData) {
          const profileMap: Record<string, { full_name: string | null; phone: string | null }> = {};
          profileData.forEach(p => {
            profileMap[p.user_id] = { full_name: p.full_name, phone: p.phone };
          });
          setProfiles(profileMap);
        }
      }
    } catch (error) {
      console.error("Error fetching emergencies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (hasAnyCoordinatorRole) {
      fetchEmergencies();
    }
  }, [hasAnyCoordinatorRole, fetchEmergencies]);

  // Realtime subscription
  useEffect(() => {
    if (!hasAnyCoordinatorRole) return;

    const channel = supabase
      .channel("medical-alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "health_tickets",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newTicket = payload.new as EmergencyTicket;
            if (["critical", "high"].includes(newTicket.ai_urgency_level || "")) {
              if (soundEnabled) {
                playAlertSound();
                triggerHaptic("alert");
              }
              setTickets((prev) => [newTicket, ...prev]);
              toast.warning("New emergency alert!", { duration: 5000 });
            }
          } else if (payload.eventType === "UPDATE") {
            setTickets((prev) =>
              prev.map((t) => (t.id === payload.new.id ? { ...t, ...payload.new } : t))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hasAnyCoordinatorRole, soundEnabled]);

  const handleRespond = async (ticketId: string) => {
    triggerHaptic("medium");
    setResponding(ticketId);
    
    try {
      const { error } = await supabase
        .from("health_tickets")
        .update({
          status: "coordinator_reviewing" as const,
          coordinator_notes: `[${new Date().toISOString()}] Medical staff responding`,
        })
        .eq("id", ticketId);

      if (error) throw error;
      toast.success("Marked as responding");
    } catch (error) {
      console.error("Error responding:", error);
      toast.error("Failed to update");
    } finally {
      setResponding(null);
    }
  };

  const handleResolve = async (ticketId: string) => {
    triggerHaptic("medium");
    setResponding(ticketId);
    
    try {
      const { error } = await supabase
        .from("health_tickets")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", ticketId);

      if (error) throw error;
      toast.success("Case resolved");
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (error) {
      console.error("Error resolving:", error);
      toast.error("Failed to resolve");
    } finally {
      setResponding(null);
    }
  };

  const openMaps = (lat: number, lng: number) => {
    triggerHaptic("light");
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
  };

  const callPilgrim = (phone: string) => {
    triggerHaptic("light");
    window.location.href = `tel:${phone}`;
  };

  const getTimeAgo = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  // Loading states
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Access control
  if (!isAuthenticated || !hasAnyCoordinatorRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-4">
        <Shield className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-center">Access Restricted</h1>
        <p className="text-muted-foreground text-center">
          This view is for medical staff and coordinators only.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    );
  }

  const criticalCount = tickets.filter((t) => t.ai_urgency_level === "critical").length;
  const highCount = tickets.filter((t) => t.ai_urgency_level === "high").length;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-destructive text-destructive-foreground safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-destructive-foreground hover:bg-destructive-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold text-lg">Emergency Alerts</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-destructive-foreground hover:bg-destructive-foreground/10"
            >
              <Volume2 className={`w-5 h-5 ${!soundEnabled ? "opacity-40" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { triggerHaptic("light"); fetchEmergencies(); }}
              className="text-destructive-foreground hover:bg-destructive-foreground/10"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-6 px-4 py-2 bg-destructive-foreground/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
            <span className="font-bold text-lg">{criticalCount}</span>
            <span className="text-sm opacity-80">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="font-bold text-lg">{highCount}</span>
            <span className="text-sm opacity-80">High</span>
          </div>
        </div>
      </header>

      {/* Alert List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3 pb-safe-area-bottom">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <CheckCircle2 className="w-16 h-16 mb-4 text-green-500" />
              <p className="text-lg font-medium">No active emergencies</p>
              <p className="text-sm">All clear at the moment</p>
            </div>
          ) : (
            tickets.map((ticket) => {
              const config = urgencyConfig[ticket.ai_urgency_level as keyof typeof urgencyConfig] || urgencyConfig.medium;
              const isCritical = ticket.ai_urgency_level === "critical";
              const profile = profiles[ticket.user_id];
              
              return (
                <Card
                  key={ticket.id}
                  className={`p-4 ${config.bgLight} ${config.border} border-2 ${
                    isCritical ? "animate-pulse" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${config.color} text-white font-bold px-3 py-1`}>
                      {config.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      {getTimeAgo(ticket.created_at)}
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {profile?.full_name || "Unknown Pilgrim"}
                      </span>
                    </div>
                    {ticket.zone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {ticket.zone.replace("_", " ").toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-background/50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium mb-2">
                      {ticket.ai_triage_summary || ticket.description}
                    </p>
                    {ticket.ai_translated_text && (
                      <p className="text-sm text-muted-foreground" dir="rtl">
                        {ticket.ai_translated_text}
                      </p>
                    )}
                  </div>

                  {/* Quick Actions - Large Touch Targets */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {ticket.location_lat && ticket.location_lng && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => openMaps(ticket.location_lat!, ticket.location_lng!)}
                        className="h-14 flex-col gap-1"
                      >
                        <Navigation className="w-5 h-5 text-primary" />
                        <span className="text-xs">Navigate</span>
                      </Button>
                    )}
                    {profile?.phone && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => callPilgrim(profile!.phone!)}
                        className="h-14 flex-col gap-1"
                      >
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="text-xs">Call</span>
                      </Button>
                    )}
                  </div>

                  {/* Response Actions */}
                  <div className="flex gap-2">
                    {ticket.status === "submitted" || ticket.status === "whatsapp_alerted" ? (
                      <Button
                        className="flex-1 h-12 bg-primary hover:bg-primary/90"
                        onClick={() => handleRespond(ticket.id)}
                        disabled={responding === ticket.id}
                      >
                        {responding === ticket.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <MessageSquare className="w-4 h-4 mr-2" />
                        )}
                        I'm Responding
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 h-12 bg-primary hover:bg-primary/90"
                        onClick={() => handleResolve(ticket.id)}
                        disabled={responding === ticket.id}
                      >
                        {responding === ticket.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Mark Resolved
                      </Button>
                    )}
                  </div>

                  {/* Status Indicator */}
                  {ticket.status === "coordinator_reviewing" && (
                    <div className="mt-2 text-center text-sm text-primary font-medium">
                      ⚡ Someone is responding
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MedicalAlertsPage;
