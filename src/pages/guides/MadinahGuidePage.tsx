import { useLanguage } from "@/contexts/LanguageContext";
import { MADINAH_GUIDE_TOPICS } from "@/data/madinahGuideContent";
import { GuideList } from "@/components/GuideList";

const MadinahGuidePage = () => {
  const { language } = useLanguage();

  const items = MADINAH_GUIDE_TOPICS.map((topic) => ({
    id: topic.id,
    title: topic.title[language] || topic.title.en,
    description: topic.whatItIs[language]?.slice(0, 100) + "..." || topic.whatItIs.en.slice(0, 100) + "...",
    order: topic.order,
  }));

  return (
    <GuideList
      title={{
        en: "Madinah Guide",
        ar: "دليل المدينة المنورة",
        ur: "مدینہ منورہ گائیڈ",
        hi: "मदीना गाइड",
        tr: "Medine Rehberi",
        ru: "Руководство по Медине",
      }}
      subtitle={{
        en: "Etiquette and guidance for Masjid an-Nabawi",
        ar: "آداب وإرشادات المسجد النبوي",
        ur: "مسجد نبوی کے آداب اور رہنمائی",
        hi: "मस्जिद-ए-नबवी के लिए शिष्टाचार और मार्गदर्शन",
        tr: "Mescid-i Nebevi için adab ve rehberlik",
        ru: "Этикет и руководство для мечети Пророка",
      }}
      items={items}
      basePath="/guides/madinah"
    />
  );
};

export default MadinahGuidePage;
