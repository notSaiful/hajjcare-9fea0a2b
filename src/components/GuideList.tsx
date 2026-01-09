import { Link } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface GuideItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface GuideListProps {
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  items: GuideItem[];
  basePath: string;
}

export function GuideList({ title, subtitle, items, basePath }: GuideListProps) {
  const { language, isRTL } = useLanguage();

  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="container max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {title[language] || title.en}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {subtitle[language] || subtitle.en}
        </p>
      </div>

      {/* Disclaimer */}
      <Card className="mb-6 bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {language === "ar" 
              ? "يرجى اتباع إرشادات مجموعة الحج أو المدرب الخاص بك للاختلافات الفقهية."
              : language === "ur"
              ? "فقہی اختلافات کے لیے براہ کرم اپنے حج گروپ یا ٹرینر کی رہنمائی پر عمل کریں۔"
              : language === "hi"
              ? "फ़िक़्ही मतभेदों के लिए कृपया अपने हज्ज ग्रुप या ट्रेनर के मार्गदर्शन का पालन करें।"
              : "Please follow your Hajj group or trainer's guidance for scholarly differences."}
          </p>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {sortedItems.map((item, index) => (
          <Link key={item.id} to={`${basePath}/${item.id}`}>
            <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer group">
              <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                {/* Step Number */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-semibold text-primary">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
