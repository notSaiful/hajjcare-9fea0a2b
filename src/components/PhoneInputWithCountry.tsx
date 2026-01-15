import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Country codes focused on Hajj pilgrims (India, Middle East, South Asia)
const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
];

const labels = {
  selectCountry: {
    en: "Select Country",
    ar: "اختر الدولة",
    ur: "ملک منتخب کریں",
    hi: "देश चुनें",
    ta: "நாட்டைத் தேர்ந்தெடுக்கவும்",
    te: "దేశాన్ని ఎంచుకోండి",
    mr: "देश निवडा",
    bn: "দেশ নির্বাচন করুন",
    or: "ଦେଶ ଚୟନ କରନ୍ତୁ",
    ml: "രാജ്യം തിരഞ്ഞെടുക്കുക",
    pa: "ਦੇਸ਼ ਚੁਣੋ",
  },
  enterPhone: {
    en: "Enter phone number",
    ar: "أدخل رقم الهاتف",
    ur: "فون نمبر درج کریں",
    hi: "फ़ोन नंबर दर्ज करें",
    ta: "தொலைபேசி எண்ணை உள்ளிடவும்",
    te: "ఫోన్ నంబర్ నమోదు చేయండి",
    mr: "फोन नंबर प्रविष्ट करा",
    bn: "ফোন নম্বর লিখুন",
    or: "ଫୋନ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
    ml: "ഫോൺ നമ്പർ നൽകുക",
    pa: "ਫ਼ੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ",
  },
  familyPhone: {
    en: "Family Member's Phone",
    ar: "هاتف أحد أفراد العائلة",
    ur: "خاندان کے فرد کا فون",
    hi: "परिवार के सदस्य का फ़ोन",
    ta: "குடும்ப உறுப்பினரின் தொலைபேசி",
    te: "కుటుంబ సభ్యుని ఫోన్",
    mr: "कुटुंबातील सदस्याचा फोन",
    bn: "পরিবারের সদস্যের ফোন",
    or: "ପରିବାର ସଦସ୍ୟଙ୍କ ଫୋନ",
    ml: "കുടുംബാംഗത്തിന്റെ ഫോൺ",
    pa: "ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਦਾ ਫ਼ੋਨ",
  },
};

interface PhoneInputWithCountryProps {
  value: string;
  countryCode: string;
  onValueChange: (value: string) => void;
  onCountryCodeChange: (code: string) => void;
  className?: string;
}

export function PhoneInputWithCountry({
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  className,
}: PhoneInputWithCountryProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];

  // Format phone number for display (add spaces every 3-4 digits)
  const formatPhoneDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 15) {
      onValueChange(value);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Phone className="h-4 w-4" />
        {labels.familyPhone[language] || labels.familyPhone.en}
      </label>
      
      <div className="flex gap-2">
        {/* Country code selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-16 px-4 gap-2 text-lg font-medium min-w-[120px] justify-between rounded-xl"
            >
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="font-mono">{selectedCountry.code}</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      onCountryCodeChange(country.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors hover:bg-accent",
                      countryCode === country.code && "bg-accent"
                    )}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{country.country}</p>
                      <p className="text-sm text-muted-foreground font-mono">{country.code}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Phone number input */}
        <Input
          type="tel"
          inputMode="numeric"
          placeholder={labels.enterPhone[language] || labels.enterPhone.en}
          value={formatPhoneDisplay(value)}
          onChange={handlePhoneChange}
          className="h-16 text-xl font-mono tracking-wider rounded-xl flex-1"
          maxLength={15}
        />
      </div>
    </div>
  );
}
