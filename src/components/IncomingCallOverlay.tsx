import { useEffect, useState, useCallback } from "react";
import { Call, CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, User } from "lucide-react";

const labels = {
  incomingCall: {
    en: "Incoming Call",
    ar: "مكالمة واردة",
    ur: "آنے والی کال",
    hi: "आने वाली कॉल",
    ta: "உள்வரும் அழைப்பு",
    te: "ఇన్‌కమింగ్ కాల్",
    mr: "इनकमिंग कॉल",
    bn: "ইনকামিং কল",
    or: "ଆସୁଥିବା କଲ",
    ml: "ഇൻകമിംഗ് കോൾ",
    pa: "ਆਉਣ ਵਾਲੀ ਕਾਲ",
  },
  familyCalling: {
    en: "Family is calling you",
    ar: "العائلة تتصل بك",
    ur: "خاندان آپ کو کال کر رہا ہے",
    hi: "परिवार आपको कॉल कर रहा है",
    ta: "குடும்பம் உங்களை அழைக்கிறது",
    te: "కుటుంబం మిమ్మల్ని కాల్ చేస్తోంది",
    mr: "कुटुंब तुम्हाला कॉल करत आहे",
    bn: "পরিবার আপনাকে কল করছে",
    or: "ପରିବାର ଆପଣଙ୍କୁ କଲ କରୁଛି",
    ml: "കുടുംബം നിങ്ങളെ വിളിക്കുന്നു",
    pa: "ਪਰਿਵਾਰ ਤੁਹਾਨੂੰ ਕਾਲ ਕਰ ਰਿਹਾ ਹੈ",
  },
  accept: {
    en: "Accept",
    ar: "قبول",
    ur: "قبول کریں",
    hi: "स्वीकार करें",
    ta: "ஏற்றுக்கொள்",
    te: "అంగీకరించు",
    mr: "स्वीकारा",
    bn: "গ্রহণ করুন",
    or: "ଗ୍ରହଣ କରନ୍ତୁ",
    ml: "സ്വീകരിക്കുക",
    pa: "ਸਵੀਕਾਰ ਕਰੋ",
  },
  decline: {
    en: "Decline",
    ar: "رفض",
    ur: "انکار کریں",
    hi: "अस्वीकार करें",
    ta: "மறுக்கவும்",
    te: "తిరస్కరించు",
    mr: "नाकारा",
    bn: "প্রত্যাখ্যান করুন",
    or: "ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ",
    ml: "നിരസിക്കുക",
    pa: "ਇਨਕਾਰ ਕਰੋ",
  },
};

interface IncomingCallOverlayProps {
  call: Call;
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCallOverlay({ call, onAccept, onDecline }: IncomingCallOverlayProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(30);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Get caller info
  const callerName = call.state.createdBy?.name || labels.familyCalling[language] || labels.familyCalling.en;

  // Auto-decline after 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  // Play ringtone (using browser audio)
  useEffect(() => {
    // Create a simple oscillating ringtone using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    const playRing = () => {
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440;
      oscillator.type = "sine";
      
      // Pulsing effect
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Ring every 1.5 seconds
    playRing();
    const ringInterval = setInterval(playRing, 1500);

    return () => {
      clearInterval(ringInterval);
      if (oscillator) {
        try { oscillator.stop(); } catch (e) {}
      }
      audioContext.close();
    };
  }, []);

  // If call state changed (caller hung up), close overlay
  useEffect(() => {
    if (callingState === CallingState.IDLE || callingState === CallingState.LEFT) {
      onDecline();
    }
  }, [callingState, onDecline]);

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Caller avatar with pulse animation */}
        <div className="relative mx-auto">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
            <User className="h-16 w-16 text-primary" />
          </div>
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
        </div>

        {/* Call info */}
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            {labels.incomingCall[language] || labels.incomingCall.en}
          </p>
          <h2 className="text-3xl font-bold">{callerName}</h2>
          <p className="text-sm text-muted-foreground">
            {timeLeft}s
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-8 pt-4">
          {/* Decline button */}
          <Button
            onClick={onDecline}
            size="lg"
            variant="destructive"
            className="h-20 w-20 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <PhoneOff className="h-10 w-10" />
          </Button>

          {/* Accept button */}
          <Button
            onClick={onAccept}
            size="lg"
            className="h-20 w-20 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all animate-bounce"
          >
            <Phone className="h-10 w-10" />
          </Button>
        </div>

        <div className="flex justify-center gap-8 pt-1">
          <span className="text-sm text-muted-foreground w-20 text-center">
            {labels.decline[language] || labels.decline.en}
          </span>
          <span className="text-sm text-muted-foreground w-20 text-center">
            {labels.accept[language] || labels.accept.en}
          </span>
        </div>
      </div>
    </div>
  );
}
