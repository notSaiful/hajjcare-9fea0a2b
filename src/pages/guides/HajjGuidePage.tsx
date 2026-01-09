import { useLanguage } from "@/contexts/LanguageContext";
import { MANASIK_RITUALS } from "@/data/manasikContent";
import { GuideList } from "@/components/GuideList";

const HajjGuidePage = () => {
  const { language } = useLanguage();

  const items = MANASIK_RITUALS.map((ritual) => ({
    id: ritual.id,
    title: ritual.title[language] || ritual.title.en,
    description: ritual.description[language] || ritual.description.en,
    order: ritual.order,
  }));

  return (
    <GuideList
      title={{
        en: "Hajj Guide",
        ar: "دليل الحج",
        ur: "حج گائیڈ",
        hi: "हज्ज गाइड",
        tr: "Hac Rehberi",
        ru: "Руководство по Хаджу",
      }}
      subtitle={{
        en: "Complete step-by-step guidance for performing Hajj",
        ar: "إرشادات كاملة خطوة بخطوة لأداء الحج",
        ur: "حج کی ادائیگی کے لیے مکمل قدم بہ قدم رہنمائی",
        hi: "हज्ज करने के लिए पूर्ण चरण-दर-चरण मार्गदर्शन",
        tr: "Hac için adım adım tam rehberlik",
        ru: "Полное пошаговое руководство по совершению Хаджа",
      }}
      items={items}
      basePath="/guides/hajj"
    />
  );
};

export default HajjGuidePage;
