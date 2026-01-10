import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

const DuaGuidePage = () => {
  const { language, isRTL } = useLanguage();
  const [expandedDua, setExpandedDua] = useState<number | null>(null);

  const labels = {
    title: {
      en: "Dua Collection",
      ar: "مجموعة الأدعية",
      ur: "دعاؤں کا مجموعہ",
      hi: "दुआ संग्रह",
      tr: "Dua Koleksiyonu",
      ru: "Сборник дуа",
    },
    subtitle: {
      en: "Essential supplications for Hajj & Umrah",
      ar: "الأدعية الأساسية للحج والعمرة",
      ur: "حج اور عمرہ کی ضروری دعائیں",
      hi: "हज और उमरा के लिए आवश्यक दुआएं",
      tr: "Hac ve Umre için temel dualar",
      ru: "Основные мольбы для хаджа и умры",
    },
    back: {
      en: "Back",
      ar: "رجوع",
      ur: "واپس",
      hi: "वापस",
      tr: "Geri",
      ru: "Назад",
    },
    translation: {
      en: "Translation",
      ar: "الترجمة",
      ur: "ترجمہ",
      hi: "अनुवाद",
      tr: "Tercüme",
      ru: "Перевод",
    },
  };

  const duas = [
    {
      title: { en: "Dua for Starting Journey", ar: "دعاء السفر", ur: "سفر شروع کرنے کی دعا", hi: "यात्रा शुरू करने की दुआ", tr: "Yolculuğa Başlama Duası", ru: "Дуа начала путешествия" },
      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ",
      transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
      translation: { en: "Glory be to Him who has subjected this to us, and we could never have it (by our efforts). And verily, to our Lord we shall return.", ar: "سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون", ur: "پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کر دیا اور ہم اسے قابو میں نہیں لا سکتے تھے اور ہم اپنے رب کی طرف لوٹنے والے ہیں", hi: "पाक है वह जिसने इसे हमारे लिए वश में किया और हम इसे वश में नहीं कर सकते थे और हम अपने रब की ओर लौटने वाले हैं", tr: "Bunu bizim hizmetimize veren Allah'ın şanı yücedir. Yoksa biz buna güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz.", ru: "Слава Тому, Кто подчинил нам это, ведь мы сами не смогли бы этого сделать. И мы непременно вернемся к нашему Господу." },
    },
    {
      title: { en: "Talbiyah", ar: "التلبية", ur: "تلبیہ", hi: "तलबियाह", tr: "Telbiye", ru: "Тальбия" },
      arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
      transliteration: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak",
      translation: { en: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and blessings are Yours, and all sovereignty. You have no partner.", ar: "لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك", ur: "حاضر ہوں اے اللہ حاضر ہوں، حاضر ہوں تیرا کوئی شریک نہیں حاضر ہوں، بے شک تمام تعریف اور نعمت تیری ہے اور بادشاہی تیری ہے، تیرا کوئی شریک نہیں", hi: "हाज़िर हूं ऐ अल्लाह हाज़िर हूं, हाज़िर हूं तेरा कोई शरीक नहीं हाज़िर हूं, बेशक तमाम तारीफ़ और नेमत तेरी है और बादशाही तेरी है, तेरा कोई शरीक नहीं", tr: "Lebbeyk Allahümme lebbeyk, lebbeyk la şerike leke lebbeyk, innel hamde ven ni'mete leke vel mülk, la şerike lek", ru: "Вот я перед Тобой, о Аллах, вот я перед Тобой. Вот я перед Тобой, нет у Тебя сотоварища, вот я перед Тобой. Поистине, вся хвала и милость принадлежат Тебе, и владычество. Нет у Тебя сотоварища." },
    },
    {
      title: { en: "Dua at Safa & Marwa", ar: "دعاء الصفا والمروة", ur: "صفا اور مروہ کی دعا", hi: "सफा और मरवा की दुआ", tr: "Safa ve Merve Duası", ru: "Дуа на Сафа и Марва" },
      arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
      transliteration: "Innas-Safa wal-Marwata min sha'a'irillah, abda'u bima bada'Allahu bihi",
      translation: { en: "Indeed, Safa and Marwa are among the symbols of Allah. I begin with what Allah began with.", ar: "إن الصفا والمروة من شعائر الله، أبدأ بما بدأ الله به", ur: "بے شک صفا اور مروہ اللہ کی نشانیوں میں سے ہیں، میں اس سے شروع کرتا ہوں جس سے اللہ نے شروع کیا", hi: "बेशक सफा और मरवा अल्लाह की निशानियों में से हैं, मैं उससे शुरू करता हूं जिससे अल्लाह ने शुरू किया", tr: "Şüphesiz Safa ve Merve Allah'ın şiarlarındandır. Allah'ın başladığı ile başlarım.", ru: "Поистине, Сафа и Марва — из обрядов Аллаха. Я начинаю с того, с чего начал Аллах." },
    },
    {
      title: { en: "Dua at Arafat", ar: "دعاء عرفة", ur: "عرفات کی دعا", hi: "अरफात की दुआ", tr: "Arafat Duası", ru: "Дуа в Арафате" },
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
      translation: { en: "There is no god but Allah alone, without partner. To Him belongs sovereignty and praise, and He is over all things capable.", ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير", ur: "اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے", hi: "अल्लाह के सिवा कोई माबूद नहीं वह अकेला है उसका कोई शरीक नहीं, उसी की बादशाही है और उसी के लिए तारीफ है और वह हर चीज़ पर क़ादिर है", tr: "Allah'tan başka ilah yoktur, O birdir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye kadirdir.", ru: "Нет бога, кроме Аллаха, Единого, без сотоварища. Ему принадлежит владычество и хвала, и Он над всякой вещью мощен." },
    },
    {
      title: { en: "Dua Between Yemeni Corner and Black Stone", ar: "دعاء بين الركن اليماني والحجر الأسود", ur: "رکن یمانی اور حجر اسود کے درمیان کی دعا", hi: "यमनी कोने और काले पत्थर के बीच की दुआ", tr: "Rükn-i Yemani ve Hacer-i Esved Arası Duası", ru: "Дуа между йеменским углом и черным камнем" },
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
      translation: { en: "Our Lord, give us in this world good and in the Hereafter good, and protect us from the punishment of the Fire.", ar: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار", ur: "اے ہمارے رب ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا", hi: "ऐ हमारे रब हमें दुनिया में भलाई दे और आखिरत में भलाई दे और हमें आग के अज़ाब से बचा", tr: "Rabbimiz! Bize dünyada iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.", ru: "Господь наш! Даруй нам в этом мире добро и в будущей жизни добро и защити нас от мучений Огня." },
    },
  ];

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
        </div>

        <div className="space-y-3">
          {duas.map((dua, idx) => (
            <Card key={idx} className="border-2 overflow-hidden">
              <CardContent className="p-0">
                <button
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedDua(expandedDua === idx ? null : idx)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center shadow-soft border-2 border-primary/20">
                      <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                    <span className="font-semibold">{dua.title[language] || dua.title.en}</span>
                  </div>
                  {expandedDua === idx ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {expandedDua === idx && (
                  <div className="px-4 pb-4 space-y-4 border-t">
                    <div className="pt-4">
                      <p className="text-xl text-right leading-loose font-arabic" dir="rtl">
                        {dua.arabic}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground italic">
                        {dua.transliteration}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">{labels.translation[language] || labels.translation.en}</p>
                      <p className="text-sm">{dua.translation[language] || dua.translation.en}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DuaGuidePage;
