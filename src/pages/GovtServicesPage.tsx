import { MainLayout } from "@/components/MainLayout";
import { useLanguage, getLocalizedText } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accessibility, 
  Utensils, 
  Building, 
  BookOpen, 
  Stethoscope, 
  Bus, 
  HeartHandshake, 
  Info,
  Search,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Users
} from "lucide-react";
import { govtServicesPageContent, govtServices, GovtService } from "@/data/govtServicesContent";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wheelchair: Accessibility,
  utensils: Utensils,
  building: Building,
  "book-open": BookOpen,
  stethoscope: Stethoscope,
  bus: Bus,
  "heart-handshake": HeartHandshake,
  info: Info,
  search: Search,
};

const providerLabels = {
  india: { en: "India", color: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
  saudi: { en: "Saudi Arabia", color: "bg-green-500/10 text-green-600 border-green-500/30" },
  both: { en: "India & Saudi", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
};

function ServiceCard({ service }: { service: GovtService }) {
  const { language } = useLanguage();
  const IconComponent = iconMap[service.icon] || Info;
  const providerInfo = providerLabels[service.provider];

  const title = getLocalizedText(service.title, language);
  const description = getLocalizedText(service.description, language);
  const eligibility = service.eligibility ? getLocalizedText(service.eligibility, language) : null;

  // Build speech text
  const speechText = `${title}. ${description}. ${eligibility ? `Eligibility: ${eligibility}.` : ""} ${
    service.howToAccess.map((step) => getLocalizedText(step, language)).join(". ")
  }`;

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg leading-tight">{title}</CardTitle>
              <Badge variant="outline" className={`mt-1.5 text-xs ${providerInfo.color}`}>
                <Users className="h-3 w-3 mr-1" />
                {providerInfo.en}
              </Badge>
            </div>
          </div>
          <TextToSpeechButton text={speechText} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

        {eligibility && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-700 mb-1">Eligibility</p>
              <p className="text-xs text-amber-600">{eligibility}</p>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            How to Access
          </h4>
          <ol className="space-y-2">
            {service.howToAccess.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span>{getLocalizedText(step, language)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Where to Find
          </h4>
          <ul className="space-y-1.5">
            {service.locations.map((location, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{getLocalizedText(location, language)}</span>
              </li>
            ))}
          </ul>
        </div>

        {service.importantNotes && service.importantNotes.length > 0 && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Important Notes
            </p>
            <ul className="space-y-1">
              {service.importantNotes.map((note, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {getLocalizedText(note, language)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function GovtServicesPage() {
  const { language } = useLanguage();

  const title = getLocalizedText(govtServicesPageContent.title, language);
  const subtitle = getLocalizedText(govtServicesPageContent.subtitle, language);
  const disclaimer = getLocalizedText(govtServicesPageContent.disclaimer, language);

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
              </div>
            </div>
            
            {/* Disclaimer Banner */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mt-4">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{disclaimer}</p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid gap-4">
            {govtServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              For any assistance not covered here, please contact your{" "}
              <strong>building coordinator</strong> or visit the{" "}
              <strong>Indian Hajj Mission office</strong>.
            </p>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
