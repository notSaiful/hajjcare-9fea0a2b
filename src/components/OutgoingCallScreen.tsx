import { useEffect, useState } from "react";
import { Call, CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PhoneOff, User } from "lucide-react";

const labels = {
  calling: {
    en: "Calling",
    ar: "جاري الاتصال",
    ur: "کال کر رہے ہیں",
    hi: "कॉल कर रहे हैं",
    ta: "அழைக்கிறது",
    te: "కాల్ చేస్తోంది",
    mr: "कॉल करत आहे",
    bn: "কল করছে",
    or: "କଲ କରୁଛି",
    ml: "വിളിക്കുന്നു",
    pa: "ਕਾਲ ਕਰ ਰਿਹਾ ਹੈ",
  },
  waitingForAnswer: {
    en: "Waiting for answer...",
    ar: "في انتظار الرد...",
    ur: "جواب کا انتظار...",
    hi: "जवाब का इंतज़ार...",
    ta: "பதிலுக்காக காத்திருக்கிறது...",
    te: "సమాధానం కోసం వేచి ఉంది...",
    mr: "उत्तराची वाट पाहत आहे...",
    bn: "উত্তরের জন্য অপেক্ষা করছে...",
    or: "ଉତ୍ତର ପାଇଁ ଅପେକ୍ଷା...",
    ml: "മറുപടിക്കായി കാത്തിരിക്കുന്നു...",
    pa: "ਜਵਾਬ ਦੀ ਉਡੀਕ...",
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء",
    ur: "منسوخ کریں",
    hi: "रद्द करें",
    ta: "ரத்து செய்",
    te: "రద్దు చేయి",
    mr: "रद्द करा",
    bn: "বাতিল করুন",
    or: "ବାତିଲ କରନ୍ତୁ",
    ml: "റദ്ദാക്കുക",
    pa: "ਰੱਦ ਕਰੋ",
  },
  ringing: {
    en: "Ringing...",
    ar: "يرن...",
    ur: "گھنٹی بج رہی ہے...",
    hi: "रिंग हो रही है...",
    ta: "ஒலிக்கிறது...",
    te: "రింగ్ అవుతోంది...",
    mr: "रिंग वाजत आहे...",
    bn: "রিং হচ্ছে...",
    or: "ରିଙ୍ଗ ହେଉଛି...",
    ml: "റിംഗ് ചെയ്യുന്നു...",
    pa: "ਰਿੰਗ ਹੋ ਰਹੀ ਹੈ...",
  },
};

interface OutgoingCallScreenProps {
  call: Call;
  calleeName: string;
  onCancel: () => void;
}

export function OutgoingCallScreen({ call, calleeName, onCancel }: OutgoingCallScreenProps) {
  const { language } = useLanguage();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const [dots, setDots] = useState("");

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Check if call was rejected or ended
  useEffect(() => {
    if (callingState === CallingState.IDLE || callingState === CallingState.LEFT) {
      onCancel();
    }
  }, [callingState, onCancel]);

  const statusText = callingState === CallingState.RINGING 
    ? labels.ringing[language] || labels.ringing.en
    : labels.waitingForAnswer[language] || labels.waitingForAnswer.en;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
      {/* Callee avatar with animation */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <User className="h-16 w-16 text-primary" />
        </div>
        {/* Ring animation */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
      </div>

      {/* Call status */}
      <div className="space-y-3">
        <p className="text-lg text-muted-foreground">
          {labels.calling[language] || labels.calling.en}{dots}
        </p>
        <h2 className="text-3xl font-bold">{calleeName}</h2>
        <p className="text-muted-foreground">
          {statusText}
        </p>
      </div>

      {/* Cancel button */}
      <div className="pt-8">
        <Button
          onClick={onCancel}
          variant="destructive"
          size="lg"
          className="h-20 w-20 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <PhoneOff className="h-10 w-10" />
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          {labels.cancel[language] || labels.cancel.en}
        </p>
      </div>
    </div>
  );
}
