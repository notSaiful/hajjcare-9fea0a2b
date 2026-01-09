import { useLanguage } from "@/contexts/LanguageContext";
import { MAKKAH_GUIDE_TOPICS } from "@/data/makkahGuideContent";
import { GuideList } from "@/components/GuideList";

const MakkahGuidePage = () => {
  const { language } = useLanguage();

  const items = MAKKAH_GUIDE_TOPICS.map((topic) => ({
    id: topic.id,
    title: topic.title[language] || topic.title.en,
    description: topic.whatItIs[language]?.slice(0, 100) + "..." || topic.whatItIs.en.slice(0, 100) + "...",
    order: topic.order,
  }));

  return (
    <GuideList
      title={{
        en: "Makkah Guide",
        ar: "دليل مكة المكرمة",
        ur: "مکہ مکرمہ گائیڈ",
        hi: "मक्का गाइड",
        tr: "Mekke Rehberi",
        ru: "Руководство по Мекке",
      }}
      subtitle={{
        en: "Etiquette and guidance for Masjid al-Haram",
        ar: "آداب وإرشادات المسجد الحرام",
        ur: "مسجد الحرام کے آداب اور رہنمائی",
        hi: "मस्जिद अल-हराम के लिए शिष्टाचार और मार्गदर्शन",
        tr: "Mescid-i Haram için adab ve rehberlik",
        ru: "Этикет и руководство для Запретной мечети",
      }}
      items={items}
      basePath="/guides/makkah"
    />
  );
};

export default MakkahGuidePage;
