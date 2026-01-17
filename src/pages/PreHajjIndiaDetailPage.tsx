import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { PRE_HAJJ_SECTIONS } from "@/data/preHajjIndiaContent";
import { SHCDirectory } from "@/components/SHCDirectory";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PreHajjIndiaDetailPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const section = PRE_HAJJ_SECTIONS.find((s) => s.id === sectionId);

  const backLabel = language === "ar" || language === "ur" ? "الرجوع" : "Back";

  if (!section) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Section not found</p>
          <button
            onClick={() => navigate("/pre-hajj-india")}
            className="mt-4 text-primary hover:underline"
          >
            {backLabel}
          </button>
        </div>
      </MainLayout>
    );
  }

  const title = section.title[language as keyof typeof section.title] || section.title.en;
  const description = section.description[language as keyof typeof section.description] || section.description.en;

  return (
    <MainLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/pre-hajj-india")}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <span>{backLabel}</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        {/* Content Items */}
        <div className="space-y-4">
          {section.content.map((item, index) => {
            const itemTitle = item.title[language as keyof typeof item.title] || item.title.en;
            const itemDetails = item.details[language as keyof typeof item.details] || item.details.en;

            return (
              <Card key={index} className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{itemTitle}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{itemDetails}</p>
              </Card>
            );
          })}
        </div>

        {/* SHC Directory - Only show on state-haj-committee section */}
        {sectionId === "state-haj-committee" && <SHCDirectory />}
      </div>
    </MainLayout>
  );
};

export default PreHajjIndiaDetailPage;
