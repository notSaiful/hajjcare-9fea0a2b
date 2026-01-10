import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageSquareWarning, Building, Users, ShieldCheck, FileWarning, Phone } from "lucide-react";

const GrievancesPage = () => {
  const { language, isRTL } = useLanguage();

  const labels = {
    title: {
      en: "Grievances & Complaints",
      ar: "الشكاوى والمظالم",
      ur: "شکایات",
      hi: "शिकायतें",
      tr: "Şikayetler",
      ru: "Жалобы",
    },
    subtitle: {
      en: "How to report issues during Hajj",
      ar: "كيفية الإبلاغ عن المشاكل أثناء الحج",
      ur: "حج کے دوران مسائل کی رپورٹ کیسے کریں",
      hi: "हज के दौरान समस्याओं की रिपोर्ट कैसे करें",
      tr: "Hac sırasında sorunları nasıl bildirirsiniz",
      ru: "Как сообщать о проблемах во время хаджа",
    },
    back: {
      en: "Back",
      ar: "رجوع",
      ur: "واپس",
      hi: "वापस",
      tr: "Geri",
      ru: "Назад",
    },
  };

  const sections = [
    {
      icon: Building,
      title: { en: "Ministry of Hajj & Umrah", ar: "وزارة الحج والعمرة", ur: "وزارت حج و عمرہ", hi: "हज और उमरा मंत्रालय", tr: "Hac ve Umre Bakanlığı", ru: "Министерство хаджа и умры" },
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      content: [
        { en: "Official authority for Hajj-related complaints", ar: "الجهة الرسمية لشكاوى الحج", ur: "حج سے متعلق شکایات کے لیے سرکاری اتھارٹی", hi: "हज संबंधी शिकायतों के लिए आधिकारिक प्राधिकरण", tr: "Hacla ilgili şikayetler için resmi otorite", ru: "Официальный орган для жалоб, связанных с хаджем" },
        { en: "Hotline: 920002814", ar: "خط ساخن: 920002814", ur: "ہاٹ لائن: 920002814", hi: "हॉटलाइन: 920002814", tr: "Yardım hattı: 920002814", ru: "Горячая линия: 920002814" },
        { en: "Website: haj.gov.sa", ar: "الموقع: haj.gov.sa", ur: "ویب سائٹ: haj.gov.sa", hi: "वेबसाइट: haj.gov.sa", tr: "Web sitesi: haj.gov.sa", ru: "Веб-сайт: haj.gov.sa" },
        { en: "App: Eatmarna for services and complaints", ar: "تطبيق: اعتمرنا للخدمات والشكاوى", ur: "ایپ: اعتمرنا خدمات اور شکایات کے لیے", hi: "ऐप: सेवाओं और शिकायतों के लिए इटमरना", tr: "Uygulama: Hizmetler ve şikayetler için Eatmarna", ru: "Приложение: Eatmarna для услуг и жалоб" },
      ],
    },
    {
      icon: Users,
      title: { en: "Hajj Group/Agent Issues", ar: "مشاكل مجموعة/وكيل الحج", ur: "حج گروپ/ایجنٹ کے مسائل", hi: "हज समूह/एजेंट समस्याएं", tr: "Hac Grubu/Acenta Sorunları", ru: "Проблемы с группой/агентом хаджа" },
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      content: [
        { en: "First contact your Hajj group leader/mutawwif", ar: "اتصل أولاً بقائد مجموعتك/المطوف", ur: "پہلے اپنے حج گروپ لیڈر/مطوف سے رابطہ کریں", hi: "पहले अपने हज समूह नेता/मुतव्विफ से संपर्क करें", tr: "Önce hac grubu liderinizle/mutavvifinizle iletişime geçin", ru: "Сначала свяжитесь с руководителем группы хаджа" },
        { en: "Document all issues with dates and details", ar: "وثق جميع المشاكل مع التواريخ والتفاصيل", ur: "تاریخوں اور تفصیلات کے ساتھ تمام مسائل دستاویز کریں", hi: "तारीखों और विवरणों के साथ सभी समस्याओं का दस्तावेज़ बनाएं", tr: "Tüm sorunları tarihler ve ayrıntılarla belgeleyin", ru: "Документируйте все проблемы с датами и деталями" },
        { en: "Keep copies of contracts and receipts", ar: "احتفظ بنسخ من العقود والإيصالات", ur: "معاہدوں اور رسیدوں کی کاپیاں رکھیں", hi: "अनुबंधों और रसीदों की प्रतियां रखें", tr: "Sözleşmelerin ve makbuzların kopyalarını saklayın", ru: "Храните копии договоров и чеков" },
        { en: "Report unresolved issues to Ministry", ar: "أبلغ عن المشاكل التي لم تُحل للوزارة", ur: "حل نہ ہونے والے مسائل وزارت کو رپورٹ کریں", hi: "अनसुलझे मुद्दों की रिपोर्ट मंत्रालय को करें", tr: "Çözülmemiş sorunları Bakanlığa bildirin", ru: "Сообщайте о нерешенных проблемах в Министерство" },
      ],
    },
    {
      icon: ShieldCheck,
      title: { en: "Safety & Security Issues", ar: "مشاكل السلامة والأمن", ur: "حفاظت اور سیکورٹی کے مسائل", hi: "सुरक्षा मुद्दे", tr: "Güvenlik Sorunları", ru: "Проблемы безопасности" },
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      content: [
        { en: "Emergency: 911", ar: "الطوارئ: 911", ur: "ایمرجنسی: 911", hi: "आपातकाल: 911", tr: "Acil durum: 911", ru: "Экстренная помощь: 911" },
        { en: "Report to nearest security personnel immediately", ar: "أبلغ أقرب رجل أمن فوراً", ur: "فوری طور پر قریبی سیکورٹی اہلکار کو رپورٹ کریں", hi: "तुरंत निकटतम सुरक्षा कर्मियों को रिपोर्ट करें", tr: "En yakın güvenlik personeline derhal bildirin", ru: "Немедленно сообщите ближайшему охраннику" },
        { en: "Lost items: Report to Security Command Center", ar: "المفقودات: أبلغ مركز قيادة الأمن", ur: "گم شدہ اشیاء: سیکورٹی کمانڈ سینٹر کو رپورٹ کریں", hi: "खोई वस्तुएं: सुरक्षा कमांड सेंटर को रिपोर्ट करें", tr: "Kayıp eşyalar: Güvenlik Komuta Merkezine bildirin", ru: "Потерянные вещи: сообщите в центр безопасности" },
        { en: "Theft/harassment: File police report (required for insurance)", ar: "سرقة/تحرش: قدم بلاغاً للشرطة", ur: "چوری/ہراسمنٹ: پولیس رپورٹ درج کریں", hi: "चोरी/उत्पीड़न: पुलिस रिपोर्ट दर्ज करें", tr: "Hırsızlık/taciz: Polis raporu dosyalayın", ru: "Кража/преследование: подайте заявление в полицию" },
      ],
    },
    {
      icon: FileWarning,
      title: { en: "Accommodation Issues", ar: "مشاكل السكن", ur: "رہائش کے مسائل", hi: "आवास समस्याएं", tr: "Konaklama Sorunları", ru: "Проблемы с жильем" },
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      content: [
        { en: "Document issues with photos and videos", ar: "وثق المشاكل بالصور والفيديو", ur: "تصاویر اور ویڈیوز کے ساتھ مسائل دستاویز کریں", hi: "फोटो और वीडियो के साथ समस्याओं का दस्तावेज़ बनाएं", tr: "Sorunları fotoğraf ve videolarla belgeleyin", ru: "Документируйте проблемы фото и видео" },
        { en: "Complain to hotel management first", ar: "قدم شكوى لإدارة الفندق أولاً", ur: "پہلے ہوٹل انتظامیہ کو شکایت کریں", hi: "पहले होटल प्रबंधन को शिकायत करें", tr: "Önce otel yönetimine şikayet edin", ru: "Сначала пожалуйтесь администрации отеля" },
        { en: "Escalate to your Hajj agent if unresolved", ar: "صعّد الأمر لوكيل الحج إذا لم يُحل", ur: "حل نہ ہونے پر اپنے حج ایجنٹ کو اطلاع دیں", hi: "अनसुलझे होने पर अपने हज एजेंट को बढ़ाएं", tr: "Çözülmezse hac acentenize iletin", ru: "Передайте агенту хаджа, если не решено" },
        { en: "Ministry complaint as last resort with evidence", ar: "شكوى للوزارة كملاذ أخير مع الأدلة", ur: "ثبوت کے ساتھ آخری حربے کے طور پر وزارت شکایت", hi: "सबूत के साथ अंतिम उपाय के रूप में मंत्रालय शिकायत", tr: "Delillerle son çare olarak Bakanlığa şikayet", ru: "Жалоба в Министерство как последнее средство" },
      ],
    },
    {
      icon: Phone,
      title: { en: "Your Embassy", ar: "سفارتك", ur: "آپ کا سفارت خانہ", hi: "आपका दूतावास", tr: "Elçiliğiniz", ru: "Ваше посольство" },
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      content: [
        { en: "Contact your embassy for serious issues", ar: "اتصل بسفارتك للمشاكل الخطيرة", ur: "سنگین مسائل کے لیے اپنے سفارت خانے سے رابطہ کریں", hi: "गंभीर मुद्दों के लिए अपने दूतावास से संपर्क करें", tr: "Ciddi sorunlar için elçiliğinizle iletişime geçin", ru: "Свяжитесь с посольством при серьезных проблемах" },
        { en: "Passport loss or theft", ar: "فقدان أو سرقة جواز السفر", ur: "پاسپورٹ کا گم ہونا یا چوری", hi: "पासपोर्ट खोना या चोरी", tr: "Pasaport kaybı veya hırsızlığı", ru: "Потеря или кража паспорта" },
        { en: "Medical emergencies requiring evacuation", ar: "حالات طبية طارئة تتطلب الإخلاء", ur: "انخلاء کی ضرورت والی طبی ایمرجنسی", hi: "निकासी की आवश्यकता वाली चिकित्सा आपात स्थिति", tr: "Tahliye gerektiren tıbbi acil durumlar", ru: "Медицинские экстренные случаи, требующие эвакуации" },
        { en: "Legal issues or detention", ar: "مشاكل قانونية أو احتجاز", ur: "قانونی مسائل یا حراست", hi: "कानूनी मुद्दे या हिरासत", tr: "Yasal sorunlar veya gözaltı", ru: "Юридические вопросы или задержание" },
      ],
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
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 flex items-center justify-center shadow-soft border-2 border-amber-500/20">
              <MessageSquareWarning className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
              <p className="text-sm text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-2">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${section.bgColor} flex items-center justify-center shadow-soft border-2 ${section.color.replace('text-', 'border-')}/20`}>
                    <section.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${section.color}`} />
                  </div>
                  <h2 className="text-lg font-semibold">{section.title[language] || section.title.en}</h2>
                </div>
                <ul className="space-y-2.5">
                  {section.content.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                      <span className="text-sm text-muted-foreground">{item[language] || item.en}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default GrievancesPage;
