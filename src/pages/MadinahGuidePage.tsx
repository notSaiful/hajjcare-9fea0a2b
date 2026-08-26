import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";
import { MADINAH_GUIDE_TOPICS } from "@/data/madinahGuideContent";
import { IconCircle } from "@/components/IconCircle";

const MadinahGuidePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem("madinah-guide-completed");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("madinah-guide-completed", JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedTopics((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const completedCount = completedTopics.length;
  const progress = Math.round((completedCount / MADINAH_GUIDE_TOPICS.length) * 100);

  const labels = {
    title: {
      en: "Madinah Etiquette Guide",
      ar: "دليل آداب المدينة",
      ur: "مدینہ آداب گائیڈ",
      hi: "मदीना शिष्टाचार गाइड",
      ta: "மதீனா ஆசாரம் வழிகாட்டி",
      te: "మదీనా మర్యాద గైడ్",
      mr: "मदीना शिष्टाचार मार्गदर्शक",
      bn: "মদিনা শিষ্টাচার গাইড",
      or: "ମଦିନା ଆଚରଣ ଗାଇଡ୍",
      ml: "മദീന മര്യാദ ഗൈഡ്",
      pa: "ਮਦੀਨਾ ਸ਼ਿਸ਼ਟਾਚਾਰ ਗਾਈਡ",
    },
    subtitle: {
      en: "Proper conduct in Masjid an-Nabawi and the Prophet's city",
      ar: "السلوك الصحيح في المسجد النبوي ومدينة النبي",
      ur: "مسجد نبوی اور نبی کے شہر میں صحیح طرز عمل",
      hi: "मस्जिद अन-नबवी और नबी के शहर में उचित आचरण",
      ta: "மஸ்ஜித் அன்-நபவி மற்றும் நபியின் நகரத்தில் சரியான நடத்தை",
      te: "మస్జిద్ అన్-నబవి మరియు ప్రవక్త నగరంలో సరైన ప్రవర్తన",
      mr: "मस्जिद अन-नबवी आणि पैगंबरांच्या शहरातील योग्य वर्तन",
      bn: "মসজিদ আন-নববী এবং নবীর শহরে সঠিক আচরণ",
      or: "ମସଜିଦ ଆନ-ନବାୱି ଏବଂ ନବୀଙ୍କ ସହରରେ ସଠିକ୍ ଆଚରଣ",
      ml: "മസ്ജിദ് അൻ-നബവിയിലും പ്രവാചകന്റെ നഗരത്തിലും ശരിയായ പെരുമാറ്റം",
      pa: "ਮਸਜਿਦ ਅਨ-ਨਬਵੀ ਅਤੇ ਨਬੀ ਦੇ ਸ਼ਹਿਰ ਵਿੱਚ ਸਹੀ ਆਚਰਣ",
    },
    complete: {
      en: "You have reviewed all Madinah etiquette",
      ar: "لقد راجعت جميع آداب المدينة",
      ur: "آپ نے مدینہ کے تمام آداب کا جائزہ لے لیا",
      hi: "आपने सभी मदीना शिष्टाचार की समीक्षा कर ली",
      ta: "நீங்கள் அனைத்து மதீனா ஆசாரங்களையும் மதிப்பாய்வு செய்துவிட்டீர்கள்",
      te: "మీరు అన్ని మదీనా మర్యాదలను సమీక్షించారు",
      mr: "आपण सर्व मदीना शिष्टाचाराचे पुनरावलोकन केले",
      bn: "আপনি সমস্ত মদিনা শিষ্টাচার পর্যালোচনা করেছেন",
      or: "ଆପଣ ସମସ୍ତ ମଦିନା ଆଚରଣ ସମୀକ୍ଷା କରିସାରିଛନ୍ତି",
      ml: "നിങ്ങൾ എല്ലാ മദീന മര്യാദകളും അവലോകനം ചെയ്തു",
      pa: "ਤੁਸੀਂ ਸਾਰੇ ਮਦੀਨਾ ਸ਼ਿਸ਼ਟਾਚਾਰ ਦੀ ਸਮੀਖਿਆ ਕਰ ਲਈ ਹੈ",
    },
  };

  return (
    <MainLayout>
      <SEO title="Madinah Guide" description="Visits, hotels, prayer schedule, and key sites in Madinah — practical guidance for Indian pilgrims." path="/madinah-guide" type="article" jsonLd={{"@context":"https://schema.org","@type":"Article","headline":"Madinah Guide","description":"Visits, hotels, prayer schedule, and key sites in Madinah — practical guidance for Indian pilgrims.","url":"https://hajjcare.in/madinah-guide"}} />
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">
            {labels.title[language] || labels.title.en}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {labels.subtitle[language] || labels.subtitle.en}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {completedCount} / {MADINAH_GUIDE_TOPICS.length}
            </span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {progress === 100 && (
          <div className="p-3 sm:p-4 bg-status-safe/10 border border-status-safe/30 rounded-xl text-center">
            <Check className="w-6 h-6 sm:w-8 sm:h-8 text-status-safe mx-auto mb-2" />
            <p className="text-sm sm:text-base text-status-safe font-semibold">
              {labels.complete[language] || labels.complete.en}
            </p>
          </div>
        )}

        {/* Topic List */}
        <div className="space-y-2.5 sm:space-y-3">
          {MADINAH_GUIDE_TOPICS.map((topic) => {
            const isCompleted = completedTopics.includes(topic.id);

            return (
              <Card
                key={topic.id}
                className={`border-2 transition-all cursor-pointer ${
                  isCompleted
                    ? "border-status-safe/30 bg-status-safe/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => navigate(`/madinah-guide/${topic.id}`)}
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <IconCircle 
                    number={topic.order} 
                    isCompleted={isCompleted} 
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm sm:text-base ${
                        isCompleted ? "text-status-safe" : "text-foreground"
                      }`}
                    >
                      {topic.title[language] || topic.title.en}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 p-0 ${
                      isCompleted ? "text-status-safe" : ""
                    }`}
                    onClick={(e) => toggleComplete(topic.id, e)}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default MadinahGuidePage;
