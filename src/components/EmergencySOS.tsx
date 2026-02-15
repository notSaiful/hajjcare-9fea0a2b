import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useHajjLocation } from "@/hooks/useHajjLocation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Phone, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type SOSStatus = "idle" | "confirming" | "sending" | "success" | "error";

// Haptic feedback utility
const triggerHaptic = (pattern: "light" | "medium" | "heavy" | "success" | "error") => {
  if (!("vibrate" in navigator)) return;
  
  const patterns: Record<string, number | number[]> = {
    light: 50,
    medium: 100,
    heavy: 200,
    success: [100, 50, 100],
    error: [200, 100, 200, 100, 200],
  };
  
  try {
    navigator.vibrate(patterns[pattern]);
  } catch (e) {
    console.log("Vibration not supported");
  }
};

// Audio feedback utility
const playAlertSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880; // A5 note - attention-grabbing
    oscillator.type = "sine";
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.log("Audio not supported");
  }
};

const labels = {
  sosButton: {
    en: "Emergency SOS",
    ar: "طوارئ SOS",
    ur: "ایمرجنسی SOS",
    hi: "आपातकालीन SOS",
  },
  confirmTitle: {
    en: "Emergency Alert",
    ar: "تنبيه طوارئ",
    ur: "ایمرجنسی الرٹ",
    hi: "आपातकालीन अलर्ट",
  },
  confirmDesc: {
    en: "This will immediately alert nearby medical staff with your GPS location. Use only for genuine emergencies.",
    ar: "سيتم تنبيه الطاقم الطبي القريب فوراً بموقعك. استخدم فقط للطوارئ الحقيقية.",
    ur: "یہ فوری طور پر قریبی طبی عملے کو آپ کے GPS مقام کے ساتھ الرٹ کرے گا۔ صرف حقیقی ایمرجنسی کے لیے استعمال کریں۔",
    hi: "यह तुरंत आपके GPS स्थान के साथ निकटतम चिकित्सा कर्मचारियों को सचेत करेगा। केवल वास्तविक आपात स्थिति के लिए उपयोग करें।",
  },
  confirmButton: {
    en: "Send Emergency Alert",
    ar: "إرسال تنبيه الطوارئ",
    ur: "ایمرجنسی الرٹ بھیجیں",
    hi: "आपातकालीन अलर्ट भेजें",
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء",
    ur: "منسوخ",
    hi: "रद्द करें",
  },
  sending: {
    en: "Sending alert...",
    ar: "جاري إرسال التنبيه...",
    ur: "الرٹ بھیج رہا ہے...",
    hi: "अलर्ट भेज रहा है...",
  },
  success: {
    en: "Emergency alert sent! Medical staff have been notified.",
    ar: "تم إرسال تنبيه الطوارئ! تم إخطار الطاقم الطبي.",
    ur: "ایمرجنسی الرٹ بھیج دیا گیا! طبی عملے کو مطلع کر دیا گیا۔",
    hi: "आपातकालीन अलर्ट भेज दिया गया! चिकित्सा कर्मचारियों को सूचित कर दिया गया।",
  },
  error: {
    en: "Failed to send alert. Please call emergency services directly.",
    ar: "فشل في إرسال التنبيه. يرجى الاتصال بخدمات الطوارئ مباشرة.",
    ur: "الرٹ بھیجنے میں ناکامی۔ براہ کرم براہ راست ایمرجنسی سروسز کو کال کریں۔",
    hi: "अलर्ट भेजने में विफल। कृपया सीधे आपातकालीन सेवाओं को कॉल करें।",
  },
  loginRequired: {
    en: "Please log in to use emergency services",
    ar: "يرجى تسجيل الدخول لاستخدام خدمات الطوارئ",
    ur: "ایمرجنسی سروسز استعمال کرنے کے لیے لاگ ان کریں",
    hi: "आपातकालीन सेवाओं का उपयोग करने के लिए लॉग इन करें",
  },
};

export const EmergencySOS = () => {
  const { language, isRTL } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { lat, lng, stage, refresh } = useHajjLocation();
  const [status, setStatus] = useState<SOSStatus>("idle");

  const getLabel = (key: keyof typeof labels) => {
    return labels[key][language as keyof typeof labels[typeof key]] || labels[key].en;
  };

  const determineZone = useCallback((currentStage: string | null): string => {
    if (!currentStage) return "general";
    const stageZoneMap: Record<string, string> = {
      mina: "mina_medical",
      arafat: "arafat_medical",
      muzdalifah: "mina_medical",
      jamarat: "mina_medical",
      makkah: "makkah_medical",
      madinah: "madinah_medical",
    };
    return stageZoneMap[currentStage] || "general";
  }, []);

  const handleSOS = async () => {
    if (!isAuthenticated || !user) {
      toast.error(getLabel("loginRequired"));
      return;
    }

    // Trigger strong haptic and audio feedback
    triggerHaptic("heavy");
    playAlertSound();
    
    setStatus("sending");

    try {
      // Refresh location to get latest coordinates
      refresh();
      
      const zone = determineZone(stage);
      const emergencyDescription = `EMERGENCY SOS - Immediate assistance required. Location: ${stage || "Unknown"} area.`;

      // Create critical health ticket
      const { data: ticket, error: ticketError } = await supabase
        .from("health_tickets")
        .insert({
          user_id: user.id,
          description: emergencyDescription,
          symptoms: ["emergency", "sos", "immediate_help"],
          original_language: language,
          location_lat: lat,
          location_lng: lng,
          zone: zone,
          ai_urgency_level: "critical",
          ai_triage_summary: "EMERGENCY SOS ALERT - Critical priority. Pilgrim has activated emergency button and requires immediate medical assistance.",
          ai_translated_text: "تنبيه طوارئ SOS - أولوية حرجة. قام الحاج بتفعيل زر الطوارئ ويحتاج إلى مساعدة طبية فورية.",
          ai_category: "emergency",
          ai_recommendations: ["Dispatch nearest medical team immediately", "Attempt contact with pilgrim", "Track GPS location"],
          status: "submitted",
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Auto-allocate nearest responder
      try {
        const { data: allocation, error: allocError } = await supabase.functions.invoke("allocate-responder", {
          body: {
            ticket_id: ticket.id,
            lat: lat || 0,
            lng: lng || 0,
            zone: zone,
            escalation_level: 1,
          },
        });

        if (!allocError && allocation?.allocated) {
          console.log("Responder allocated:", allocation.responder?.name, "at", allocation.responder?.distance_meters, "m");
        } else {
          console.warn("No responder allocated, falling back to WhatsApp alert");
        }
      } catch (allocErr) {
        console.error("Allocation error (non-blocking):", allocErr);
      }

      // Also trigger WhatsApp alert as backup
      const { error: alertError } = await supabase.functions.invoke("whatsapp-alert", {
        body: {
          ticketId: ticket.id,
          zone: zone,
          urgencyLevel: "critical",
          summary: emergencyDescription,
          arabicText: "تنبيه طوارئ SOS - أولوية حرجة. قام الحاج بتفعيل زر الطوارئ ويحتاج إلى مساعدة طبية فورية.",
          category: "emergency",
          location: lat && lng ? { lat, lng } : undefined,
        },
      });

      if (alertError) {
        console.error("WhatsApp alert error:", alertError);
      }

      setStatus("success");
      triggerHaptic("success");
      toast.success(getLabel("success"));

      // Reset after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);

    } catch (error) {
      console.error("SOS error:", error);
      setStatus("error");
      triggerHaptic("error");
      toast.error(getLabel("error"));
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const openConfirmDialog = () => {
    if (!isAuthenticated) {
      toast.error(getLabel("loginRequired"));
      return;
    }
    // Light haptic on button press
    triggerHaptic("medium");
    setStatus("confirming");
  };

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        onClick={openConfirmDialog}
        disabled={status === "sending" || status === "success"}
        className="
          w-full h-16 sm:h-20 rounded-2xl
          bg-destructive hover:bg-destructive/90
          text-destructive-foreground
          font-bold text-base sm:text-lg
          flex items-center justify-center gap-3
          shadow-lg shadow-destructive/30
          transition-all duration-300 ease-out
          animate-pulse hover:animate-none
          border-2 border-destructive-foreground/20
        "
      >
        {status === "sending" ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>{getLabel("sending")}</span>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="w-6 h-6" />
            <span>{getLabel("success").split("!")[0]}!</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-destructive-foreground/20 flex items-center justify-center">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span>{getLabel("sosButton")}</span>
          </>
        )}
      </Button>

      <AlertDialog open={status === "confirming"} onOpenChange={(open) => !open && setStatus("idle")}>
        <AlertDialogContent 
          className="max-w-[90vw] sm:max-w-md mx-auto rounded-2xl border-destructive/30 bg-card animate-scale-in" 
          dir={isRTL ? "rtl" : "ltr"}
        >
          <AlertDialogHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl sm:text-2xl text-center font-bold text-destructive">
              {getLabel("confirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed">
              {getLabel("confirmDesc")}
            </AlertDialogDescription>
            {lat && lng && (
              <div className="text-center text-xs text-muted-foreground/70 bg-muted/30 rounded-lg p-2">
                📍 GPS: {lat.toFixed(5)}, {lng.toFixed(5)}
                {stage && ` • ${stage}`}
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 sm:flex-col pt-4">
            <AlertDialogAction
              onClick={handleSOS}
              className="w-full h-14 sm:h-16 rounded-xl bg-destructive hover:bg-destructive/90 text-base sm:text-lg font-bold transition-all duration-300 shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              {getLabel("confirmButton")}
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-medium border-border">
              {getLabel("cancel")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
