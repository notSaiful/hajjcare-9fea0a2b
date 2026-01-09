import { useLanguage } from "@/contexts/LanguageContext";
import { UMRAH_RITUALS } from "@/data/umrahContent";
import { GuideList } from "@/components/GuideList";

const UmrahGuidePage = () => {
  const { language } = useLanguage();

  const items = UMRAH_RITUALS.map((ritual) => ({
    id: ritual.id,
    title: ritual.title[language] || ritual.title.en,
    description: ritual.description[language] || ritual.description.en,
    order: ritual.order,
  }));

  return (
    <GuideList
      title={{
        en: "Umrah Guide",
        ar: "دليل العمرة",
        ur: "عمرہ گائیڈ",
        hi: "उमरा गाइड",
        tr: "Umre Rehberi",
        ru: "Руководство по Умре",
      }}
      subtitle={{
        en: "Complete step-by-step guidance for performing Umrah",
        ar: "إرشادات كاملة خطوة بخطوة لأداء العمرة",
        ur: "عمرہ کی ادائیگی کے لیے مکمل قدم بہ قدم رہنمائی",
        hi: "उमरा करने के लिए पूर्ण चरण-दर-चरण मार्गदर्शन",
        tr: "Umre için adım adım tam rehberlik",
        ru: "Полное пошаговое руководство по совершению Умры",
      }}
      items={items}
      basePath="/guides/umrah"
    />
  );
};

export default UmrahGuidePage;
