import { useState, useMemo } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Phone,
  MessageCircle,
  User,
  MapPin,
  Languages,
  Shield,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHajInspectors, HajInspectorRecord } from "@/hooks/useHajInspectors";
import { INSPECTOR_STATES } from "@/data/hajInspectorsData";

const DUTY_LOCATIONS = ["Makkah", "Madinah"];

const InspectorDirectoryPage = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDutyLocation, setSelectedDutyLocation] = useState("");
  const [coverNumberFilter, setCoverNumberFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: inspectors = [], isLoading } = useHajInspectors({
    state: selectedState || undefined,
    dutyLocation: selectedDutyLocation || undefined,
    coverNumber: coverNumberFilter || undefined,
    search: searchQuery || undefined,
  });

  const t = {
    en: {
      title: "Haj Inspectors Directory",
      subtitle: "Find your assigned Haj Inspector",
      search: "Search by name, cover number, or mobile...",
      state: "Filter by State",
      dutyCity: "Duty Location",
      coverNumber: "Cover Number",
      allStates: "All States",
      allLocations: "All Locations",
      call: "Call",
      whatsapp: "WhatsApp",
      noResults: "No inspectors found",
      loading: "Loading inspectors...",
      fatherName: "Father's Name",
      language: "Language",
      category: "Category",
      quota: "Quota",
      marks: "Marks",
      result: "Result",
      total: "Total",
    },
    hi: {
      title: "हज इंस्पेक्टर डायरेक्टरी",
      subtitle: "अपने निर्धारित हज इंस्पेक्टर को खोजें",
      search: "नाम, कवर नंबर, या मोबाइल से खोजें...",
      state: "राज्य द्वारा फ़िल्टर",
      dutyCity: "ड्यूटी स्थान",
      coverNumber: "कवर नंबर",
      allStates: "सभी राज्य",
      allLocations: "सभी स्थान",
      call: "कॉल",
      whatsapp: "WhatsApp",
      noResults: "कोई इंस्पेक्टर नहीं मिला",
      loading: "इंस्पेक्टर लोड हो रहे हैं...",
      fatherName: "पिता का नाम",
      language: "भाषा",
      category: "श्रेणी",
      quota: "कोटा",
      marks: "अंक",
      result: "परिणाम",
      total: "कुल",
    },
    ur: {
      title: "حج انسپکٹر ڈائریکٹری",
      subtitle: "اپنے حج انسپکٹر کو تلاش کریں",
      search: "نام، کور نمبر، یا موبائل سے تلاش کریں...",
      state: "ریاست کے لحاظ سے فلٹر",
      dutyCity: "ڈیوٹی مقام",
      coverNumber: "کور نمبر",
      allStates: "تمام ریاستیں",
      allLocations: "تمام مقامات",
      call: "کال",
      whatsapp: "WhatsApp",
      noResults: "کوئی انسپکٹر نہیں ملا",
      loading: "انسپکٹر لوڈ ہو رہے ہیں...",
      fatherName: "والد کا نام",
      language: "زبان",
      category: "قسم",
      quota: "کوٹہ",
      marks: "نمبرات",
      result: "نتیجہ",
      total: "کل",
    },
  };

  const labels = t[language as keyof typeof t] || t.en;

  const handleCall = (mobile: string) => {
    window.open(`tel:${mobile}`, "_self");
  };

  const handleWhatsApp = (mobile: string, name: string) => {
    const cleanNumber = mobile.replace(/\D/g, "");
    const message = encodeURIComponent(`Assalamu Alaikum, ${name}. I am a pilgrim and need your help.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <UserCheck className="w-6 h-6 text-primary" />
            {labels.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{labels.subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={labels.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedState} onValueChange={(v) => setSelectedState(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder={labels.state} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{labels.allStates}</SelectItem>
              {INSPECTOR_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDutyLocation} onValueChange={(v) => setSelectedDutyLocation(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder={labels.dutyCity} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{labels.allLocations}</SelectItem>
              {DUTY_LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cover Number Filter */}
        <Input
          placeholder={labels.coverNumber}
          value={coverNumberFilter}
          onChange={(e) => setCoverNumberFilter(e.target.value)}
        />

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {inspectors.length} {labels.total.toLowerCase()}
          {selectedState && ` • ${selectedState}`}
          {selectedDutyLocation && ` • ${selectedDutyLocation}`}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
        )}

        {/* Inspector List */}
        {!isLoading && inspectors.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{labels.noResults}</div>
        )}

        <div className="space-y-3 pb-20">
          {inspectors.map((inspector) => (
            <InspectorProfileCard
              key={inspector.id}
              inspector={inspector}
              isExpanded={expandedId === inspector.id}
              onToggle={() => setExpandedId(expandedId === inspector.id ? null : inspector.id)}
              labels={labels}
              onCall={handleCall}
              onWhatsApp={handleWhatsApp}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

interface InspectorProfileCardProps {
  inspector: HajInspectorRecord;
  isExpanded: boolean;
  onToggle: () => void;
  labels: Record<string, string>;
  onCall: (mobile: string) => void;
  onWhatsApp: (mobile: string, name: string) => void;
}

const InspectorProfileCard = ({
  inspector,
  isExpanded,
  onToggle,
  labels,
  onCall,
  onWhatsApp,
}: InspectorProfileCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Main row - always visible */}
        <button
          onClick={onToggle}
          className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/50 transition-colors"
        >
          {/* Photo/Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {inspector.photo_url ? (
              <img src={inspector.photo_url} alt={inspector.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">{inspector.name}</h3>
              {inspector.result && (
                <Badge
                  variant={inspector.result === "Selected" ? "default" : "secondary"}
                  className={
                    inspector.result === "Selected"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-xs"
                      : "bg-amber-500 hover:bg-amber-600 text-xs"
                  }
                >
                  {inspector.result}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {inspector.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" /> {inspector.duty_location}
              </span>
              {inspector.cover_number && (
                <>
                  <span>•</span>
                  <span>Cover: {inspector.cover_number}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Languages className="w-3 h-3" /> {inspector.language}
              </span>
              {inspector.total_marks && (
                <>
                  <span>•</span>
                  <span>{labels.marks}: {inspector.total_marks}</span>
                </>
              )}
            </div>
          </div>

          <div className="text-muted-foreground shrink-0">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {/* Expanded details */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t space-y-3 pt-3">
            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {inspector.father_name && (
                <div>
                  <span className="text-muted-foreground">{labels.fatherName}:</span>
                  <p className="font-medium">{inspector.father_name}</p>
                </div>
              )}
              {inspector.category && (
                <div>
                  <span className="text-muted-foreground">{labels.category}:</span>
                  <p className="font-medium">{inspector.category}</p>
                </div>
              )}
              {inspector.quota && (
                <div>
                  <span className="text-muted-foreground">{labels.quota}:</span>
                  <p className="font-medium">{inspector.quota}</p>
                </div>
              )}
              {inspector.gender && (
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <p className="font-medium">{inspector.gender}</p>
                </div>
              )}
            </div>

            {/* Marks */}
            {(inspector.cbt_marks || inspector.interview_marks) && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-primary">{inspector.cbt_marks ?? "-"}</div>
                  <div className="text-xs text-muted-foreground">CBT</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-primary">{inspector.interview_marks ?? "-"}</div>
                  <div className="text-xs text-muted-foreground">Interview</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-emerald-600">{inspector.total_marks ?? "-"}</div>
                  <div className="text-xs text-muted-foreground">{labels.total}</div>
                </div>
              </div>
            )}

            {/* Call & WhatsApp buttons */}
            {inspector.mobile && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onCall(inspector.mobile!)}
                  variant="default"
                  className="flex-1"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {labels.call}
                </Button>
                <Button
                  onClick={() => onWhatsApp(inspector.mobile!, inspector.name)}
                  variant="outline"
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {labels.whatsapp}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InspectorDirectoryPage;
