import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrentGuidance } from "@/hooks/useCurrentGuidance";
import { HajjPhase } from "@/data/guidanceContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";

const PHASES: { value: HajjPhase; label: Record<string, string> }[] = [
  { 
    value: "pre_hajj", 
    label: { en: "Before Hajj", ar: "قبل الحج", ur: "حج سے پہلے", hi: "हज से पहले" }
  },
  { 
    value: "day_8_mina", 
    label: { en: "Day 8 - Mina", ar: "اليوم 8 - منى", ur: "دن 8 - منیٰ", hi: "दिन 8 - मीना" }
  },
  { 
    value: "day_9_arafat_morning", 
    label: { en: "Day 9 - Arafat Morning", ar: "اليوم 9 - صباح عرفة", ur: "دن 9 - عرفات صبح", hi: "दिन 9 - अरफात सुबह" }
  },
  { 
    value: "day_9_arafat_standing", 
    label: { en: "Day 9 - Standing at Arafat", ar: "اليوم 9 - الوقوف بعرفة", ur: "دن 9 - عرفات میں وقوف", hi: "दिन 9 - अरफात में खड़े" }
  },
  { 
    value: "day_9_arafat_sunset", 
    label: { en: "Day 9 - Arafat Sunset", ar: "اليوم 9 - غروب عرفة", ur: "دن 9 - عرفات غروب", hi: "दिन 9 - अरफात सूर्यास्त" }
  },
  { 
    value: "night_muzdalifah", 
    label: { en: "Night at Muzdalifah", ar: "ليلة مزدلفة", ur: "مزدلفہ کی رات", hi: "मुज़दलिफ़ा की रात" }
  },
  { 
    value: "day_10_rami", 
    label: { en: "Day 10 - Rami", ar: "اليوم 10 - الرمي", ur: "دن 10 - رمی", hi: "दिन 10 - रमी" }
  },
  { 
    value: "day_10_tawaf", 
    label: { en: "Day 10 - Tawaf", ar: "اليوم 10 - الطواف", ur: "دن 10 - طواف", hi: "दिन 10 - तवाफ" }
  },
  { 
    value: "days_11_12_mina", 
    label: { en: "Days 11-12 - Mina", ar: "أيام 11-12 - منى", ur: "دن 11-12 - منیٰ", hi: "दिन 11-12 - मीना" }
  },
  { 
    value: "day_13_farewell", 
    label: { en: "Day 13 - Farewell", ar: "اليوم 13 - الوداع", ur: "دن 13 - وداع", hi: "दिन 13 - विदाई" }
  },
  { 
    value: "post_hajj", 
    label: { en: "After Hajj", ar: "بعد الحج", ur: "حج کے بعد", hi: "हज के बाद" }
  },
];

export const GuidanceSettings = () => {
  const { language } = useLanguage();
  const { isElderly, toggleElderly, setPhase } = useCurrentGuidance();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<HajjPhase>(() => {
    const saved = localStorage.getItem("hajj-current-phase");
    return (saved as HajjPhase) || "pre_hajj";
  });

  const labels = {
    settings: { en: "Guidance Settings", ar: "إعدادات الإرشاد", ur: "رہنمائی کی ترتیبات", hi: "मार्गदर्शन सेटिंग्स" },
    phase: { en: "Current Hajj Phase", ar: "مرحلة الحج الحالية", ur: "موجودہ حج کا مرحلہ", hi: "वर्तमान हज चरण" },
    elderly: { en: "Elderly/Vulnerable Pilgrim", ar: "حاج كبير السن/ضعيف", ur: "بزرگ/کمزور حاجی", hi: "बुजुर्ग/कमजोर तीर्थयात्री" },
    elderlyDesc: { en: "Get additional rest reminders", ar: "احصل على تذكيرات راحة إضافية", ur: "اضافی آرام کی یاد دہانیاں حاصل کریں", hi: "अतिरिक्त आराम अनुस्मारक प्राप्त करें" },
  };

  const handlePhaseChange = (value: string) => {
    setCurrentPhase(value as HajjPhase);
    setPhase(value as HajjPhase);
  };

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden bg-card/80 backdrop-blur-sm">
      <CardContent className="p-0">
        {/* Collapsible Header */}
        <Button
          variant="ghost"
          className="
            w-full flex items-center justify-between 
            p-4 sm:p-5 h-auto 
            rounded-none
            hover:bg-muted/50
            transition-colors duration-300
          "
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-medium text-sm sm:text-base">
              {labels.settings[language] || labels.settings.en}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-300" />
            )}
          </div>
        </Button>

        {/* Expandable Content */}
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-out
            ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 sm:px-5 pb-5 space-y-5 border-t border-border/50 pt-5">
            {/* Phase Selector */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-muted-foreground">
                {labels.phase[language] || labels.phase.en}
              </Label>
              <Select value={currentPhase} onValueChange={handlePhaseChange}>
                <SelectTrigger className="w-full h-12 rounded-xl border-border/60 bg-background/50 focus:bg-background transition-colors duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-md">
                  {PHASES.map((phase) => (
                    <SelectItem 
                      key={phase.value} 
                      value={phase.value}
                      className="h-11 rounded-lg cursor-pointer"
                    >
                      {phase.label[language] || phase.label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Elderly Toggle */}
            <div className="flex items-center justify-between gap-4 p-3 sm:p-4 bg-muted/30 rounded-xl border border-border/30">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  {labels.elderly[language] || labels.elderly.en}
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {labels.elderlyDesc[language] || labels.elderlyDesc.en}
                </p>
              </div>
              <Switch
                checked={isElderly}
                onCheckedChange={toggleElderly}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
