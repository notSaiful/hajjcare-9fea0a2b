import { Language, LocalizedString } from "@/contexts/LanguageContext";

export interface RuleItem {
  text: LocalizedString;
  image?: string;
}

export interface RulesSection {
  id: string;
  order: number;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  image?: string;
  rules: RuleItem[];
}

export const RULES_SECTIONS: RulesSection[] = [
  {
    id: "general-conduct",
    order: 1,
    title: {
      en: "General Conduct & Discipline",
      ar: "السلوك العام والانضباط",
      ur: "عمومی سلوک اور نظم و ضبط",
      hi: "सामान्य आचरण और अनुशासन",
      tr: "Genel Davranış ve Disiplin",
      ru: "Общее поведение и дисциплина",
    },
    description: {
      en: "How to conduct yourself respectfully during Hajj",
      ar: "كيف تتصرف باحترام خلال الحج",
      ur: "حج کے دوران احترام سے پیش آنے کا طریقہ",
      hi: "हज के दौरान सम्मानपूर्वक आचरण कैसे करें",
      tr: "Hac sırasında saygılı davranış",
      ru: "Как вести себя уважительно во время хаджа",
    },
    icon: "Users",
    rules: [
      {
        text: {
          en: "Always follow instructions from Saudi authorities and Hajj officials.",
          ar: "اتبع دائماً تعليمات السلطات السعودية ومسؤولي الحج.",
          ur: "ہمیشہ سعودی حکام اور حج عملداروں کی ہدایات پر عمل کریں۔",
          hi: "हमेशा सऊदी अधिकारियों और हज अधिकारियों के निर्देशों का पालन करें।",
          tr: "Her zaman Suudi yetkililerin ve hac görevlilerinin talimatlarına uyun.",
          ru: "Всегда следуйте указаниям саудовских властей и должностных лиц хаджа.",
        },
      },
      {
        text: {
          en: "Follow official movement schedules. Do not move ahead of your group without permission.",
          ar: "اتبع جداول التنقل الرسمية. لا تتقدم على مجموعتك دون إذن.",
          ur: "سرکاری نقل و حرکت کے شیڈول پر عمل کریں۔ اجازت کے بغیر اپنے گروپ سے آگے نہ جائیں۔",
          hi: "आधिकारिक आवाजाही के शेड्यूल का पालन करें। अनुमति के बिना अपने समूह से आगे न बढ़ें।",
          tr: "Resmi hareket programlarını takip edin. İzinsiz grubunuzun önüne geçmeyin.",
          ru: "Следуйте официальному расписанию передвижения. Не опережайте свою группу без разрешения.",
        },
      },
      {
        text: {
          en: "Maintain patience and calmness in all situations, especially in crowds.",
          ar: "حافظ على الصبر والهدوء في جميع المواقف، خاصة في الزحام.",
          ur: "تمام حالات میں خاص طور پر بھیڑ میں صبر اور سکون برقرار رکھیں۔",
          hi: "सभी परिस्थितियों में, विशेषकर भीड़ में धैर्य और शांति बनाए रखें।",
          tr: "Tüm durumlarda, özellikle kalabalıkta sabır ve sakinliğinizi koruyun.",
          ru: "Сохраняйте терпение и спокойствие во всех ситуациях, особенно в толпе.",
        },
      },
      {
        text: {
          en: "Avoid arguments, shouting, or physical disputes with anyone.",
          ar: "تجنب الجدال والصراخ أو النزاعات الجسدية مع أي شخص.",
          ur: "کسی کے ساتھ بحث، چیخنا یا جسمانی جھگڑے سے گریز کریں۔",
          hi: "किसी के साथ बहस, चिल्लाना या शारीरिक विवाद से बचें।",
          tr: "Kimseyle tartışmaktan, bağırmaktan veya fiziksel anlaşmazlıklardan kaçının.",
          ru: "Избегайте споров, криков или физических конфликтов с кем-либо.",
        },
      },
      {
        text: {
          en: "Respect local customs and dress modestly at all times.",
          ar: "احترم العادات المحلية والتزم بالملابس المحتشمة في جميع الأوقات.",
          ur: "مقامی رسوم کا احترام کریں اور ہمیشہ پردہ دار لباس پہنیں۔",
          hi: "स्थानीय रीति-रिवाजों का सम्मान करें और हमेशा शालीन कपड़े पहनें।",
          tr: "Yerel geleneklere saygı gösterin ve her zaman mütevazı giyinin.",
          ru: "Уважайте местные обычаи и всегда одевайтесь скромно.",
        },
      },
      {
        text: {
          en: "Be courteous and helpful to fellow pilgrims from all nationalities.",
          ar: "كن لطيفاً ومساعداً للحجاج من جميع الجنسيات.",
          ur: "تمام قومیتوں کے ساتھی حجاج کے ساتھ مہربان اور مددگار رہیں۔",
          hi: "सभी राष्ट्रीयताओं के साथी तीर्थयात्रियों के साथ विनम्र और सहायक रहें।",
          tr: "Tüm milletlerden hacılara nazik ve yardımsever olun.",
          ru: "Будьте вежливы и помогайте паломникам всех национальностей.",
        },
      },
    ],
  },
  {
    id: "legal-security",
    order: 2,
    title: {
      en: "Legal & Security Rules",
      ar: "القواعد القانونية والأمنية",
      ur: "قانونی اور سیکیورٹی قواعد",
      hi: "कानूनी और सुरक्षा नियम",
      tr: "Yasal ve Güvenlik Kuralları",
      ru: "Правовые и охранные правила",
    },
    description: {
      en: "Essential security requirements during Hajj",
      ar: "المتطلبات الأمنية الأساسية خلال الحج",
      ur: "حج کے دوران ضروری سیکیورٹی تقاضے",
      hi: "हज के दौरान आवश्यक सुरक्षा आवश्यकताएं",
      tr: "Hac sırasında temel güvenlik gereksinimleri",
      ru: "Основные требования безопасности во время хаджа",
    },
    icon: "Shield",
    rules: [
      {
        text: {
          en: "Always carry your official Hajj identification card and passport copy.",
          ar: "احمل دائماً بطاقة الحج الرسمية ونسخة من جواز السفر.",
          ur: "ہمیشہ اپنا سرکاری حج شناختی کارڈ اور پاسپورٹ کی کاپی ساتھ رکھیں۔",
          hi: "हमेशा अपना आधिकारिक हज पहचान पत्र और पासपोर्ट कॉपी साथ रखें।",
          tr: "Her zaman resmi hac kimlik kartınızı ve pasaport kopyanızı yanınızda bulundurun.",
          ru: "Всегда носите при себе официальное удостоверение личности хаджа и копию паспорта.",
        },
      },
      {
        text: {
          en: "Cooperate fully with security personnel at checkpoints and inspection areas.",
          ar: "تعاون بشكل كامل مع رجال الأمن في نقاط التفتيش ومناطق الفحص.",
          ur: "چیک پوائنٹس اور معائنہ والے علاقوں میں سیکیورٹی اہلکاروں کے ساتھ پوری طرح تعاون کریں۔",
          hi: "चेकपॉइंट और निरीक्षण क्षेत्रों में सुरक्षा कर्मियों के साथ पूर्ण सहयोग करें।",
          tr: "Kontrol noktalarında ve denetim alanlarında güvenlik personeliyle tam işbirliği yapın.",
          ru: "Полностью сотрудничайте с сотрудниками службы безопасности на контрольно-пропускных пунктах.",
        },
      },
      {
        text: {
          en: "Follow instructions immediately during any emergency or security situation.",
          ar: "اتبع التعليمات فوراً أثناء أي حالة طوارئ أو موقف أمني.",
          ur: "کسی بھی ایمرجنسی یا سیکیورٹی صورتحال میں فوری طور پر ہدایات پر عمل کریں۔",
          hi: "किसी भी आपातकाल या सुरक्षा स्थिति में तुरंत निर्देशों का पालन करें।",
          tr: "Herhangi bir acil durum veya güvenlik durumunda talimatları derhal uygulayın.",
          ru: "Немедленно следуйте инструкциям при любой чрезвычайной или охранной ситуации.",
        },
      },
      {
        text: {
          en: "Do not interfere with or obstruct security personnel performing their duties.",
          ar: "لا تتدخل أو تعرقل رجال الأمن أثناء أداء واجباتهم.",
          ur: "اپنے فرائض انجام دیتے سیکیورٹی اہلکاروں میں مداخلت یا رکاوٹ نہ ڈالیں۔",
          hi: "अपने कर्तव्यों का पालन करते सुरक्षा कर्मियों में हस्तक्षेप या बाधा न डालें।",
          tr: "Görevlerini yerine getiren güvenlik personelini engellemeyin veya müdahale etmeyin.",
          ru: "Не мешайте и не препятствуйте сотрудникам службы безопасности при исполнении обязанностей.",
        },
      },
      {
        text: {
          en: "Stay within authorized areas only. Do not enter restricted zones.",
          ar: "ابقَ في المناطق المصرح بها فقط. لا تدخل المناطق المحظورة.",
          ur: "صرف مجاز علاقوں میں رہیں۔ ممنوعہ علاقوں میں داخل نہ ہوں۔",
          hi: "केवल अधिकृत क्षेत्रों में रहें। प्रतिबंधित क्षेत्रों में प्रवेश न करें।",
          tr: "Sadece yetkili alanlarda kalın. Yasak bölgelere girmeyin.",
          ru: "Находитесь только в разрешённых зонах. Не входите в запрещённые зоны.",
        },
      },
      {
        text: {
          en: "Report any suspicious items or activities to the nearest official immediately.",
          ar: "أبلغ عن أي أغراض أو أنشطة مشبوهة لأقرب مسؤول فوراً.",
          ur: "کسی بھی مشکوک چیز یا سرگرمی کی فوری طور پر قریبی اہلکار کو اطلاع دیں۔",
          hi: "किसी भी संदिग्ध वस्तु या गतिविधि की तुरंत निकटतम अधिकारी को रिपोर्ट करें।",
          tr: "Şüpheli eşya veya faaliyetleri derhal en yakın yetkililere bildirin.",
          ru: "Немедленно сообщайте о любых подозрительных предметах или действиях ближайшему должностному лицу.",
        },
      },
    ],
  },
  {
    id: "crowd-movement",
    order: 3,
    title: {
      en: "Crowd & Movement Discipline",
      ar: "انضباط الحشود والتنقل",
      ur: "بھیڑ اور نقل و حرکت کا نظم",
      hi: "भीड़ और आवाजाही अनुशासन",
      tr: "Kalabalık ve Hareket Disiplini",
      ru: "Дисциплина в толпе и при передвижении",
    },
    description: {
      en: "How to move safely in crowded areas",
      ar: "كيفية التنقل بأمان في المناطق المزدحمة",
      ur: "بھیڑ والے علاقوں میں محفوظ طریقے سے چلنے کا طریقہ",
      hi: "भीड़भाड़ वाले क्षेत्रों में सुरक्षित रूप से कैसे चलें",
      tr: "Kalabalık alanlarda güvenli hareket etme",
      ru: "Как безопасно передвигаться в многолюдных местах",
    },
    icon: "Users",
    rules: [
      {
        text: {
          en: "Move only when permitted by officials. Wait patiently for instructions.",
          ar: "تحرك فقط عندما يسمح المسؤولون. انتظر التعليمات بصبر.",
          ur: "صرف اہلکاروں کی اجازت پر چلیں۔ ہدایات کا صبر سے انتظار کریں۔",
          hi: "केवल अधिकारियों की अनुमति पर चलें। निर्देशों का धैर्यपूर्वक इंतज़ार करें।",
          tr: "Sadece yetkililer izin verdiğinde hareket edin. Talimatları sabırla bekleyin.",
          ru: "Двигайтесь только с разрешения должностных лиц. Терпеливо ждите указаний.",
        },
      },
      {
        text: {
          en: "Do not push, shove, or make sudden movements in crowds.",
          ar: "لا تدفع أو تزاحم أو تقم بحركات مفاجئة في الزحام.",
          ur: "بھیڑ میں دھکا نہ دیں، نہ دھکیلیں، نہ اچانک حرکت کریں۔",
          hi: "भीड़ में धक्का न दें, न ठेलें, न अचानक हरकत करें।",
          tr: "Kalabalıkta itmeyin, kakıştırmayın veya ani hareketler yapmayın.",
          ru: "Не толкайтесь и не делайте резких движений в толпе.",
        },
      },
      {
        text: {
          en: "Do not block pathways, exits, or emergency routes. Keep walkways clear.",
          ar: "لا تسد الممرات أو المخارج أو طرق الطوارئ. حافظ على الممرات خالية.",
          ur: "راستے، باہر نکلنے کے راستے یا ایمرجنسی راستے نہ روکیں۔ راستے صاف رکھیں۔",
          hi: "रास्ते, निकास या आपातकालीन मार्ग न रोकें। रास्ते साफ रखें।",
          tr: "Yolları, çıkışları veya acil çıkış yollarını kapatmayın. Yürüyüş yollarını açık tutun.",
          ru: "Не загораживайте проходы, выходы или аварийные пути. Держите проходы свободными.",
        },
      },
      {
        text: {
          en: "Do not sit or rest in movement areas. Use designated rest zones.",
          ar: "لا تجلس أو تستريح في مناطق الحركة. استخدم مناطق الراحة المخصصة.",
          ur: "نقل و حرکت والے علاقوں میں نہ بیٹھیں نہ آرام کریں۔ مخصوص آرام گاہیں استعمال کریں۔",
          hi: "आवाजाही वाले क्षेत्रों में न बैठें न आराम करें। निर्धारित आराम क्षेत्र उपयोग करें।",
          tr: "Hareket alanlarında oturmayın veya dinlenmeyin. Belirlenmiş dinlenme alanlarını kullanın.",
          ru: "Не сидите и не отдыхайте в зонах движения. Используйте специально отведённые места для отдыха.",
        },
      },
      {
        text: {
          en: "Follow your group leader and camp coordinator instructions at all times.",
          ar: "اتبع تعليمات قائد مجموعتك ومنسق المخيم في جميع الأوقات.",
          ur: "ہر وقت اپنے گروپ لیڈر اور کیمپ کوآرڈینیٹر کی ہدایات پر عمل کریں۔",
          hi: "हर समय अपने समूह नेता और कैंप समन्वयक के निर्देशों का पालन करें।",
          tr: "Her zaman grup liderinizin ve kamp koordinatörünüzün talimatlarını takip edin.",
          ru: "Всегда следуйте указаниям руководителя группы и координатора лагеря.",
        },
      },
      {
        text: {
          en: "Assist elderly and weak pilgrims calmly. Call for official help if needed.",
          ar: "ساعد الحجاج كبار السن والضعفاء بهدوء. اطلب المساعدة الرسمية إذا لزم الأمر.",
          ur: "بزرگ اور کمزور حجاج کی سکون سے مدد کریں۔ ضرورت ہو تو سرکاری مدد طلب کریں۔",
          hi: "बुजुर्ग और कमजोर तीर्थयात्रियों की शांति से मदद करें। ज़रूरत हो तो आधिकारिक मदद मांगें।",
          tr: "Yaşlı ve zayıf hacılara sakin bir şekilde yardım edin. Gerekirse resmi yardım çağırın.",
          ru: "Спокойно помогайте пожилым и слабым паломникам. При необходимости вызывайте официальную помощь.",
        },
      },
    ],
  },
  {
    id: "prohibited-items",
    order: 4,
    title: {
      en: "Prohibited Items & Actions",
      ar: "الأغراض والأفعال المحظورة",
      ur: "ممنوعہ اشیاء اور اقدامات",
      hi: "निषिद्ध वस्तुएं और कार्य",
      tr: "Yasak Eşyalar ve Eylemler",
      ru: "Запрещённые предметы и действия",
    },
    description: {
      en: "Items and activities not permitted during Hajj",
      ar: "الأغراض والأنشطة غير المسموح بها خلال الحج",
      ur: "حج کے دوران غیر مجاز اشیاء اور سرگرمیاں",
      hi: "हज के दौरान अनुमति न होने वाली वस्तुएं और गतिविधियां",
      tr: "Hac sırasında izin verilmeyen eşya ve faaliyetler",
      ru: "Предметы и действия, не разрешённые во время хаджа",
    },
    icon: "Ban",
    rules: [
      {
        text: {
          en: "Weapons, sharp objects, and any dangerous items are strictly prohibited.",
          ar: "الأسلحة والأدوات الحادة وأي أغراض خطرة ممنوعة تماماً.",
          ur: "ہتھیار، تیز دھار اشیاء اور کوئی بھی خطرناک چیز سختی سے ممنوع ہے۔",
          hi: "हथियार, तेज धार वाली वस्तुएं और कोई भी खतरनाक चीज सख्त मना है।",
          tr: "Silahlar, kesici aletler ve tehlikeli eşyalar kesinlikle yasaktır.",
          ru: "Оружие, острые предметы и любые опасные предметы строго запрещены.",
        },
      },
      {
        text: {
          en: "Do not bring alcohol, drugs, or any intoxicating substances.",
          ar: "لا تحضر الكحول أو المخدرات أو أي مواد مسكرة.",
          ur: "شراب، منشیات یا کوئی نشہ آور چیز نہ لائیں۔",
          hi: "शराब, नशीले पदार्थ या कोई मादक पदार्थ न लाएं।",
          tr: "Alkol, uyuşturucu veya herhangi bir sarhoş edici madde getirmeyin.",
          ru: "Не привозите алкоголь, наркотики или любые опьяняющие вещества.",
        },
      },
      {
        text: {
          en: "Do not distribute pamphlets, books, or materials without official permission.",
          ar: "لا توزع منشورات أو كتب أو مواد دون إذن رسمي.",
          ur: "سرکاری اجازت کے بغیر پمفلٹ، کتابیں یا مواد تقسیم نہ کریں۔",
          hi: "आधिकारिक अनुमति के बिना पर्चे, किताबें या सामग्री वितरित न करें।",
          tr: "Resmi izin olmadan broşür, kitap veya materyal dağıtmayın.",
          ru: "Не распространяйте брошюры, книги или материалы без официального разрешения.",
        },
      },
      {
        text: {
          en: "Political activities, demonstrations, or protests are not permitted.",
          ar: "الأنشطة السياسية أو المظاهرات أو الاحتجاجات غير مسموح بها.",
          ur: "سیاسی سرگرمیاں، مظاہرے یا احتجاج کی اجازت نہیں ہے۔",
          hi: "राजनीतिक गतिविधियां, प्रदर्शन या विरोध की अनुमति नहीं है।",
          tr: "Siyasi faaliyetler, gösteriler veya protestolara izin verilmez.",
          ru: "Политическая деятельность, демонстрации или протесты не допускаются.",
        },
      },
      {
        text: {
          en: "Commercial activities, selling goods, or unauthorized business is not allowed.",
          ar: "الأنشطة التجارية أو بيع البضائع أو الأعمال غير المرخصة غير مسموح بها.",
          ur: "تجارتی سرگرمیاں، سامان فروخت کرنا یا غیر مجاز کاروبار کی اجازت نہیں۔",
          hi: "व्यावसायिक गतिविधियां, सामान बेचना या अनधिकृत व्यापार की अनुमति नहीं है।",
          tr: "Ticari faaliyetler, mal satışı veya yetkisiz işlere izin verilmez.",
          ru: "Коммерческая деятельность, продажа товаров или несанкционированный бизнес не допускаются.",
        },
      },
      {
        text: {
          en: "Do not engage in begging or soliciting donations from other pilgrims.",
          ar: "لا تتعاطى التسول أو طلب التبرعات من الحجاج الآخرين.",
          ur: "بھیک مانگنے یا دوسرے حجاج سے چندہ مانگنے میں ملوث نہ ہوں۔",
          hi: "भीख मांगने या अन्य तीर्थयात्रियों से दान मांगने में शामिल न हों।",
          tr: "Dilencilik yapmayın veya diğer hacılardan bağış istemeyin.",
          ru: "Не занимайтесь попрошайничеством и не собирайте пожертвования с других паломников.",
        },
      },
    ],
  },
  {
    id: "media-photography",
    order: 5,
    title: {
      en: "Media, Photography & Communication",
      ar: "الإعلام والتصوير والاتصالات",
      ur: "میڈیا، فوٹوگرافی اور مواصلات",
      hi: "मीडिया, फोटोग्राफी और संचार",
      tr: "Medya, Fotoğrafçılık ve İletişim",
      ru: "СМИ, фотография и связь",
    },
    description: {
      en: "Guidelines for photography and sharing information",
      ar: "إرشادات للتصوير ومشاركة المعلومات",
      ur: "فوٹوگرافی اور معلومات شیئر کرنے کے رہنما اصول",
      hi: "फोटोग्राफी और जानकारी साझा करने के दिशानिर्देश",
      tr: "Fotoğrafçılık ve bilgi paylaşımı için yönergeler",
      ru: "Рекомендации по фотографированию и обмену информацией",
    },
    icon: "Camera",
    rules: [
      {
        text: {
          en: "Follow all rules regarding photography and video recording at sacred sites.",
          ar: "اتبع جميع القواعد المتعلقة بالتصوير الفوتوغرافي والفيديو في المواقع المقدسة.",
          ur: "مقدس مقامات پر فوٹوگرافی اور ویڈیو ریکارڈنگ کے تمام قواعد پر عمل کریں۔",
          hi: "पवित्र स्थलों पर फोटोग्राफी और वीडियो रिकॉर्डिंग के सभी नियमों का पालन करें।",
          tr: "Kutsal mekanlarda fotoğraf ve video çekimi kurallarına uyun.",
          ru: "Соблюдайте все правила фотографирования и видеозаписи на священных местах.",
        },
      },
      {
        text: {
          en: "Do not photograph or record security personnel, checkpoints, or restricted areas.",
          ar: "لا تصور رجال الأمن أو نقاط التفتيش أو المناطق المحظورة.",
          ur: "سیکیورٹی اہلکاروں، چیک پوائنٹس یا ممنوعہ علاقوں کی تصاویر یا ویڈیو نہ بنائیں۔",
          hi: "सुरक्षा कर्मियों, चेकपॉइंट या प्रतिबंधित क्षेत्रों की फोटो या वीडियो न बनाएं।",
          tr: "Güvenlik personelini, kontrol noktalarını veya yasak bölgeleri fotoğraflamayın veya kaydetmeyin.",
          ru: "Не фотографируйте и не снимайте сотрудников службы безопасности, контрольно-пропускные пункты или запрещённые зоны.",
        },
      },
      {
        text: {
          en: "Avoid taking photos of other pilgrims without their permission.",
          ar: "تجنب تصوير الحجاج الآخرين دون إذنهم.",
          ur: "دوسرے حجاج کی اجازت کے بغیر ان کی تصاویر لینے سے گریز کریں۔",
          hi: "अन्य तीर्थयात्रियों की अनुमति के बिना उनकी फोटो लेने से बचें।",
          tr: "Diğer hacıların izni olmadan fotoğraflarını çekmekten kaçının.",
          ru: "Избегайте фотографирования других паломников без их разрешения.",
        },
      },
      {
        text: {
          en: "Do not spread rumors, unverified news, or false information.",
          ar: "لا تنشر الشائعات أو الأخبار غير المؤكدة أو المعلومات الكاذبة.",
          ur: "افواہیں، غیر تصدیق شدہ خبریں یا غلط معلومات نہ پھیلائیں۔",
          hi: "अफवाहें, असत्यापित समाचार या गलत जानकारी न फैलाएं।",
          tr: "Söylentileri, doğrulanmamış haberleri veya yanlış bilgileri yaymayın.",
          ru: "Не распространяйте слухи, непроверенные новости или ложную информацию.",
        },
      },
      {
        text: {
          en: "Use official channels and apps for Hajj-related information and updates.",
          ar: "استخدم القنوات والتطبيقات الرسمية للحصول على معلومات وتحديثات الحج.",
          ur: "حج سے متعلق معلومات اور اپڈیٹس کے لیے سرکاری چینلز اور ایپس استعمال کریں۔",
          hi: "हज संबंधी जानकारी और अपडेट के लिए आधिकारिक चैनल और ऐप्स का उपयोग करें।",
          tr: "Hac ile ilgili bilgi ve güncellemeler için resmi kanalları ve uygulamaları kullanın.",
          ru: "Используйте официальные каналы и приложения для информации и обновлений о хадже.",
        },
      },
      {
        text: {
          en: "In emergencies, share only verified information from official sources.",
          ar: "في حالات الطوارئ، شارك فقط المعلومات الموثقة من المصادر الرسمية.",
          ur: "ایمرجنسی میں صرف سرکاری ذرائع سے تصدیق شدہ معلومات شیئر کریں۔",
          hi: "आपातकाल में केवल आधिकारिक स्रोतों से सत्यापित जानकारी ही साझा करें।",
          tr: "Acil durumlarda yalnızca resmi kaynaklardan doğrulanmış bilgileri paylaşın.",
          ru: "В экстренных ситуациях делитесь только проверенной информацией из официальных источников.",
        },
      },
    ],
  },
  {
    id: "health-emergency",
    order: 6,
    title: {
      en: "Health, Safety & Emergency Compliance",
      ar: "الامتثال للصحة والسلامة والطوارئ",
      ur: "صحت، حفاظت اور ایمرجنسی تعمیل",
      hi: "स्वास्थ्य, सुरक्षा और आपातकालीन अनुपालन",
      tr: "Sağlık, Güvenlik ve Acil Durum Uyumu",
      ru: "Соблюдение требований здоровья, безопасности и чрезвычайных ситуаций",
    },
    description: {
      en: "Health and emergency guidelines for your safety",
      ar: "إرشادات الصحة والطوارئ لسلامتك",
      ur: "آپ کی حفاظت کے لیے صحت اور ایمرجنسی رہنما اصول",
      hi: "आपकी सुरक्षा के लिए स्वास्थ्य और आपातकालीन दिशानिर्देश",
      tr: "Güvenliğiniz için sağlık ve acil durum yönergeleri",
      ru: "Рекомендации по охране здоровья и чрезвычайным ситуациям для вашей безопасности",
    },
    icon: "Heart",
    rules: [
      {
        text: {
          en: "Follow all medical and health instructions from Saudi health authorities.",
          ar: "اتبع جميع التعليمات الطبية والصحية من السلطات الصحية السعودية.",
          ur: "سعودی صحت حکام کی تمام طبی اور صحت کی ہدایات پر عمل کریں۔",
          hi: "सऊदी स्वास्थ्य अधिकारियों के सभी चिकित्सा और स्वास्थ्य निर्देशों का पालन करें।",
          tr: "Suudi sağlık yetkililerinin tüm tıbbi ve sağlık talimatlarına uyun.",
          ru: "Соблюдайте все медицинские и санитарные указания саудовских органов здравоохранения.",
        },
      },
      {
        text: {
          en: "Use only designated medical facilities and clinics for health issues.",
          ar: "استخدم فقط المرافق الطبية والعيادات المخصصة للمشاكل الصحية.",
          ur: "صحت کے مسائل کے لیے صرف مخصوص طبی سہولیات اور کلینکس استعمال کریں۔",
          hi: "स्वास्थ्य समस्याओं के लिए केवल निर्धारित चिकित्सा सुविधाओं और क्लीनिकों का उपयोग करें।",
          tr: "Sağlık sorunları için yalnızca belirlenmiş sağlık tesislerini ve klinikleri kullanın.",
          ru: "Используйте только назначенные медицинские учреждения и клиники для решения проблем со здоровьем.",
        },
      },
      {
        text: {
          en: "Comply with health advisories about heat, hydration, and movement.",
          ar: "التزم بالإرشادات الصحية حول الحرارة والترطيب والحركة.",
          ur: "گرمی، پانی پینے اور نقل و حرکت کے بارے میں صحت کے مشوروں پر عمل کریں۔",
          hi: "गर्मी, हाइड्रेशन और आवाजाही के बारे में स्वास्थ्य सलाह का पालन करें।",
          tr: "Sıcaklık, hidrasyon ve hareket hakkındaki sağlık tavsiyelerine uyun.",
          ru: "Соблюдайте рекомендации по здоровью относительно жары, гидратации и передвижения.",
        },
      },
      {
        text: {
          en: "If you feel unwell, rest and seek help. Do not continue rituals if seriously ill.",
          ar: "إذا شعرت بتوعك، استرح واطلب المساعدة. لا تستمر في المناسك إذا كنت مريضاً بشدة.",
          ur: "اگر تبیت ہو، آرام کریں اور مدد لیں۔ شدید بیمار ہوں تو مناسک جاری نہ رکھیں۔",
          hi: "अगर तबीयत खराब लगे, आराम करें और मदद लें। गंभीर बीमार हों तो अनुष्ठान जारी न रखें।",
          tr: "Kendinizi kötü hissederseniz dinlenin ve yardım isteyin. Ciddi şekilde hastaysanız ibadetlere devam etmeyin.",
          ru: "Если вам плохо, отдохните и обратитесь за помощью. Не продолжайте ритуалы, если серьёзно больны.",
        },
      },
      {
        text: {
          en: "Report health issues through official support channels and your group leader.",
          ar: "أبلغ عن المشاكل الصحية من خلال قنوات الدعم الرسمية وقائد مجموعتك.",
          ur: "صحت کے مسائل کی سرکاری سپورٹ چینلز اور اپنے گروپ لیڈر کے ذریعے رپورٹ کریں۔",
          hi: "स्वास्थ्य समस्याओं की आधिकारिक सहायता चैनलों और अपने समूह नेता के माध्यम से रिपोर्ट करें।",
          tr: "Sağlık sorunlarını resmi destek kanalları ve grup lideriniz aracılığıyla bildirin.",
          ru: "Сообщайте о проблемах со здоровьем через официальные каналы поддержки и руководителю группы.",
        },
      },
      {
        text: {
          en: "During emergencies, follow evacuation instructions calmly and immediately.",
          ar: "أثناء حالات الطوارئ، اتبع تعليمات الإخلاء بهدوء وفوراً.",
          ur: "ایمرجنسی کے دوران انخلاء کی ہدایات پر فوری اور سکون سے عمل کریں۔",
          hi: "आपातकाल के दौरान निकासी निर्देशों का तुरंत और शांति से पालन करें।",
          tr: "Acil durumlarda tahliye talimatlarını sakin ve derhal uygulayın.",
          ru: "Во время чрезвычайных ситуаций спокойно и немедленно следуйте указаниям по эвакуации.",
        },
      },
    ],
  },
  {
    id: "ihraam-rules",
    order: 7,
    title: {
      en: "Ihraam Rules & Prohibitions",
      ar: "أحكام الإحرام والمحظورات",
      ur: "احرام کے احکام اور ممنوعات",
      hi: "इहराम के नियम और निषेध",
      tr: "İhram Kuralları ve Yasaklar",
      ru: "Правила ихрама и запреты",
    },
    description: {
      en: "Essential rules for entering and maintaining the state of Ihraam",
      ar: "القواعد الأساسية للدخول في الإحرام والحفاظ عليه",
      ur: "احرام میں داخل ہونے اور اسے برقرار رکھنے کے ضروری قواعد",
      hi: "इहराम की स्थिति में प्रवेश और बनाए रखने के आवश्यक नियम",
      tr: "İhram haline girme ve sürdürme için temel kurallar",
      ru: "Основные правила вхождения и соблюдения состояния ихрама",
    },
    icon: "Shirt",
    rules: [
      {
        text: {
          en: "Enter Ihraam only from designated Miqat points. Do not bypass without entering Ihraam.",
          ar: "ادخل في الإحرام فقط من نقاط الميقات المحددة. لا تتجاوز بدون الإحرام.",
          ur: "صرف مقررہ میقات کے مقامات سے احرام باندھیں۔ احرام کے بغیر نہ گزریں۔",
          hi: "केवल निर्धारित मीकात बिंदुओं से इहराम में प्रवेश करें। इहराम के बिना न गुजरें।",
          tr: "Sadece belirlenmiş Mikat noktalarından ihrama girin. İhramsız geçmeyin.",
          ru: "Входите в ихрам только с установленных точек Микат. Не проходите без ихрама.",
        },
      },
      {
        text: {
          en: "Men: Wear only two white unstitched cloths (Izar and Rida). No sewn garments.",
          ar: "للرجال: ارتدِ قطعتين بيضاوين غير مخيطتين فقط (إزار ورداء). لا ملابس مخيطة.",
          ur: "مردوں کے لیے: صرف دو سفید غیر سلے کپڑے (ازار اور ردا) پہنیں۔ سلے ہوئے کپڑے ممنوع۔",
          hi: "पुरुषों के लिए: केवल दो सफेद बिना सिले कपड़े (इज़ार और रिदा) पहनें। सिले हुए वस्त्र नहीं।",
          tr: "Erkekler: Sadece iki beyaz dikişsiz bez (İzar ve Rida) giyin. Dikişli giysi yok.",
          ru: "Мужчины: Носите только два белых несшитых полотна (Изар и Рида). Сшитая одежда запрещена.",
        },
      },
      {
        text: {
          en: "Do not apply perfume, scented soap, or fragrant oils while in Ihraam.",
          ar: "لا تستخدم العطر أو الصابون المعطر أو الزيوت العطرية أثناء الإحرام.",
          ur: "احرام میں عطر، خوشبودار صابن یا خوشبودار تیل استعمال نہ کریں۔",
          hi: "इहराम में सुगंध, सुगंधित साबुन या सुगंधित तेल का प्रयोग न करें।",
          tr: "İhramdayken parfüm, kokulu sabun veya kokulu yağ kullanmayın.",
          ru: "Не используйте парфюм, ароматное мыло или ароматические масла в состоянии ихрама.",
        },
      },
      {
        text: {
          en: "Do not cut hair or nails while in the state of Ihraam.",
          ar: "لا تقص الشعر أو الأظافر أثناء الإحرام.",
          ur: "احرام کی حالت میں بال یا ناخن نہ کاٹیں۔",
          hi: "इहराम की स्थिति में बाल या नाखून न काटें।",
          tr: "İhram halindeyken saç veya tırnak kesmeyin.",
          ru: "Не стригите волосы и ногти в состоянии ихрама.",
        },
      },
      {
        text: {
          en: "Recite Talbiyah frequently: 'Labbayk Allahumma Labbayk' throughout your journey.",
          ar: "ردد التلبية كثيراً: لبيك اللهم لبيك طوال رحلتك.",
          ur: "کثرت سے تلبیہ پڑھیں: لبیک اللہم لبیک پوری سفر میں۔",
          hi: "बार-बार तलबियह पढ़ें: 'लब्बैक अल्लाहुम्मा लब्बैक' पूरी यात्रा में।",
          tr: "Sık sık Telbiye okuyun: 'Lebbeyk Allahümme Lebbeyk' yolculuğunuz boyunca.",
          ru: "Часто повторяйте Тальбию: 'Лаббайка Аллахумма Лаббайк' на протяжении всего пути.",
        },
      },
      {
        text: {
          en: "Avoid arguments, fighting, and obscene speech. Maintain spiritual focus and patience.",
          ar: "تجنب الجدال والقتال والكلام البذيء. حافظ على التركيز الروحي والصبر.",
          ur: "جھگڑے، لڑائی اور فحش کلام سے بچیں۔ روحانی توجہ اور صبر رکھیں۔",
          hi: "बहस, लड़ाई और अश्लील भाषण से बचें। आध्यात्मिक ध्यान और धैर्य बनाए रखें।",
          tr: "Tartışma, kavga ve kötü sözlerden kaçının. Manevi odaklanma ve sabır gösterin.",
          ru: "Избегайте споров, драк и непристойных речей. Сохраняйте духовную сосредоточенность и терпение.",
        },
      },
    ],
  },
  {
    id: "mina-camp-safety",
    order: 8,
    title: {
      en: "Mina & Camp Safety",
      ar: "السلامة في منى والمخيمات",
      ur: "منی اور کیمپ کی حفاظت",
      hi: "मिना और शिविर सुरक्षा",
      tr: "Mina ve Kamp Güvenliği",
      ru: "Безопасность в Мине и лагере",
    },
    description: {
      en: "Guidelines for staying safe in Mina camps during Days of Tashreeq",
      ar: "إرشادات للبقاء آمناً في مخيمات منى خلال أيام التشريق",
      ur: "ایام تشریق میں منی کیمپوں میں محفوظ رہنے کے رہنما اصول",
      hi: "तशरीक के दिनों में मिना शिविरों में सुरक्षित रहने के दिशानिर्देश",
      tr: "Teşrik Günlerinde Mina kamplarında güvende kalma rehberi",
      ru: "Рекомендации по безопасному пребыванию в лагерях Мина в дни Ташрик",
    },
    icon: "Tent",
    rules: [
      {
        text: {
          en: "Know your camp location, number, and nearest landmarks. Save GPS coordinates on your phone.",
          ar: "اعرف موقع مخيمك ورقمه وأقرب المعالم. احفظ إحداثيات GPS على هاتفك.",
          ur: "اپنے کیمپ کا مقام، نمبر اور قریب ترین نشانیاں جانیں۔ GPS کوآرڈینیٹس فون میں محفوظ کریں۔",
          hi: "अपने शिविर का स्थान, नंबर और निकटतम स्थलचिह्न जानें। GPS निर्देशांक फोन में सहेजें।",
          tr: "Kamp konumunuzu, numaranızı ve en yakın yer işaretlerini bilin. GPS koordinatlarını telefonunuza kaydedin.",
          ru: "Знайте расположение вашего лагеря, номер и ближайшие ориентиры. Сохраните GPS-координаты в телефоне.",
        },
      },
      {
        text: {
          en: "Do not leave camp without permission from your group supervisor. All roads look similar.",
          ar: "لا تغادر المخيم بدون إذن من مشرف مجموعتك. جميع الطرق متشابهة.",
          ur: "گروپ سپروائزر کی اجازت کے بغیر کیمپ نہ چھوڑیں۔ سب راستے ایک جیسے لگتے ہیں۔",
          hi: "समूह पर्यवेक्षक की अनुमति के बिना शिविर न छोड़ें। सभी सड़कें एक जैसी दिखती हैं।",
          tr: "Grup sorumlusunun izni olmadan kampı terk etmeyin. Tüm yollar birbirine benzer.",
          ru: "Не покидайте лагерь без разрешения руководителя группы. Все дороги выглядят одинаково.",
        },
      },
      {
        text: {
          en: "Protect yourself from heat stroke. Stay hydrated and avoid prolonged sun exposure.",
          ar: "احمِ نفسك من ضربة الشمس. حافظ على الترطيب وتجنب التعرض الطويل للشمس.",
          ur: "گرمی کی لو سے بچیں۔ پانی پیتے رہیں اور دھوپ میں زیادہ نہ رہیں۔",
          hi: "हीट स्ट्रोक से बचें। हाइड्रेटेड रहें और लंबे समय तक धूप में न रहें।",
          tr: "Sıcak çarpmasından korunun. Bol su için ve uzun süre güneşte kalmayın.",
          ru: "Защитите себя от теплового удара. Пейте достаточно воды и избегайте длительного пребывания на солнце.",
        },
      },
      {
        text: {
          en: "Follow food safety rules. Avoid street vendors and ensure food is properly cooked.",
          ar: "اتبع قواعد سلامة الغذاء. تجنب الباعة المتجولين وتأكد من طهي الطعام جيداً.",
          ur: "کھانے کی حفاظت کے قواعد پر عمل کریں۔ سڑک کے دکانداروں سے بچیں اور کھانا اچھی طرح پکا ہو۔",
          hi: "खाद्य सुरक्षा नियमों का पालन करें। सड़क विक्रेताओं से बचें और सुनिश्चित करें कि खाना ठीक से पका हो।",
          tr: "Gıda güvenliği kurallarına uyun. Seyyar satıcılardan kaçının ve yiyeceklerin iyi piştiğinden emin olun.",
          ru: "Соблюдайте правила безопасности пищевых продуктов. Избегайте уличных торговцев и убедитесь, что еда хорошо приготовлена.",
        },
      },
      {
        text: {
          en: "Rest well before the Day of Arafah. Conserve energy for the long day ahead.",
          ar: "استرح جيداً قبل يوم عرفة. وفر طاقتك لليوم الطويل القادم.",
          ur: "یوم عرفہ سے پہلے اچھی طرح آرام کریں۔ آنے والے لمبے دن کے لیے توانائی بچائیں۔",
          hi: "अरफात के दिन से पहले अच्छी तरह आराम करें। आगे के लंबे दिन के लिए ऊर्जा बचाएं।",
          tr: "Arafat Günü'nden önce iyi dinlenin. Önünüzdeki uzun gün için enerji biriktirin.",
          ru: "Хорошо отдохните перед Днём Арафата. Сберегите энергию для предстоящего долгого дня.",
        },
      },
      {
        text: {
          en: "During Days of Tashreeq, perform Takbeer frequently and remember Allah constantly.",
          ar: "خلال أيام التشريق، كبّر كثيراً واذكر الله باستمرار.",
          ur: "ایام تشریق میں کثرت سے تکبیر پڑھیں اور مسلسل اللہ کو یاد کریں۔",
          hi: "तशरीक के दिनों में बार-बार तकबीर करें और निरंतर अल्लाह को याद करें।",
          tr: "Teşrik Günlerinde sık sık tekbir getirin ve sürekli Allah'ı zikredin.",
          ru: "В дни Ташрик часто произносите Такбир и постоянно поминайте Аллаха.",
        },
      },
    ],
  },
  {
    id: "arafah-guidelines",
    order: 9,
    title: {
      en: "Day of Arafah Guidelines",
      ar: "إرشادات يوم عرفة",
      ur: "یوم عرفہ کے رہنما اصول",
      hi: "अरफात के दिन के दिशानिर्देश",
      tr: "Arafat Günü Rehberi",
      ru: "Руководство по Дню Арафат",
    },
    description: {
      en: "How to make the most of the greatest day of Hajj",
      ar: "كيف تستفيد من أعظم يوم في الحج",
      ur: "حج کے سب سے بڑے دن سے بہترین فائدہ کیسے اٹھائیں",
      hi: "हज के सबसे महान दिन का अधिकतम लाभ कैसे उठाएं",
      tr: "Haccın en büyük gününden nasıl en iyi şekilde yararlanılır",
      ru: "Как максимально использовать величайший день хаджа",
    },
    icon: "Mountain",
    rules: [
      {
        text: {
          en: "Arafah is the greatest pillar of Hajj. The Prophet said: 'Hajj is Arafah.'",
          ar: "عرفة هي أعظم ركن في الحج. قال النبي: الحج عرفة.",
          ur: "عرفہ حج کا سب سے بڑا رکن ہے۔ نبی ﷺ نے فرمایا: حج عرفہ ہے۔",
          hi: "अरफात हज का सबसे बड़ा स्तंभ है। नबी ने कहा: हज अरफात है।",
          tr: "Arafat, Haccın en büyük rüknüdür. Peygamber buyurdu: 'Hac Arafat'tır.'",
          ru: "Арафат — величайший столп хаджа. Пророк сказал: 'Хадж — это Арафат.'",
        },
      },
      {
        text: {
          en: "Stay within Arafah boundaries. Ensure you are inside the designated area.",
          ar: "ابقَ داخل حدود عرفة. تأكد من وجودك داخل المنطقة المحددة.",
          ur: "عرفہ کی حدود میں رہیں۔ یقینی بنائیں کہ آپ مقررہ علاقے میں ہیں۔",
          hi: "अरफात की सीमाओं के भीतर रहें। सुनिश्चित करें कि आप निर्धारित क्षेत्र में हैं।",
          tr: "Arafat sınırları içinde kalın. Belirlenen alanda olduğunuzdan emin olun.",
          ru: "Оставайтесь в границах Арафата. Убедитесь, что находитесь в установленной зоне.",
        },
      },
      {
        text: {
          en: "Combine and shorten Dhuhr and Asr prayers after sun passes zenith.",
          ar: "اجمع واقصر صلاتي الظهر والعصر بعد زوال الشمس.",
          ur: "سورج ڈھلنے کے بعد ظہر اور عصر کی نمازیں جمع اور قصر کریں۔",
          hi: "सूर्य के शिखर पार करने के बाद ज़ुहर और अस्र की नमाज़ जमा और कसर करें।",
          tr: "Güneş zenit'i geçtikten sonra Öğle ve İkindi namazlarını cem ve kasr edin.",
          ru: "Объедините и сократите молитвы Зухр и Аср после прохождения солнцем зенита.",
        },
      },
      {
        text: {
          en: "Pilgrims should not fast on Arafah day. Stay hydrated and energized.",
          ar: "لا يصوم الحاج يوم عرفة. حافظ على الترطيب والنشاط.",
          ur: "حاجی عرفہ کے دن روزہ نہ رکھیں۔ پانی پیتے رہیں اور توانا رہیں۔",
          hi: "तीर्थयात्री अरफात के दिन उपवास न करें। हाइड्रेटेड और ऊर्जावान रहें।",
          tr: "Hacılar Arafat gününde oruç tutmamalıdır. Bol su için ve enerjik kalın.",
          ru: "Паломникам не следует поститься в день Арафата. Поддерживайте водный баланс и бодрость.",
        },
      },
      {
        text: {
          en: "Spend time in supplication, Quran recitation, Talbiyah, and remembrance of Allah.",
          ar: "اقضِ وقتك في الدعاء وتلاوة القرآن والتلبية وذكر الله.",
          ur: "دعا، تلاوت قرآن، تلبیہ اور ذکر الہی میں وقت گزاریں۔",
          hi: "दुआ, कुरआन पाठ, तलबियह और अल्लाह के स्मरण में समय बिताएं।",
          tr: "Dua, Kuran tilâveti, Telbiye ve Allah'ı zikretmekle vakit geçirin.",
          ru: "Проводите время в мольбе, чтении Корана, Тальбии и поминании Аллаха.",
        },
      },
      {
        text: {
          en: "Do not leave Arafah before sunset. Wait for official departure instructions.",
          ar: "لا تغادر عرفة قبل غروب الشمس. انتظر تعليمات المغادرة الرسمية.",
          ur: "غروب آفتاب سے پہلے عرفہ نہ چھوڑیں۔ سرکاری روانگی کی ہدایات کا انتظار کریں۔",
          hi: "सूर्यास्त से पहले अरफात न छोड़ें। आधिकारिक प्रस्थान निर्देशों का इंतज़ार करें।",
          tr: "Güneş batmadan Arafat'tan ayrılmayın. Resmi hareket talimatlarını bekleyin.",
          ru: "Не покидайте Арафат до заката. Дождитесь официальных указаний об отъезде.",
        },
      },
    ],
  },
  {
    id: "muzdalifah-guidelines",
    order: 10,
    title: {
      en: "Muzdalifah Night Guidelines",
      ar: "إرشادات ليلة مزدلفة",
      ur: "مزدلفہ کی رات کے رہنما اصول",
      hi: "मुज़दलिफा रात के दिशानिर्देश",
      tr: "Müzdelife Gecesi Rehberi",
      ru: "Руководство по ночи в Муздалифе",
    },
    description: {
      en: "Guidelines for the night stay at Muzdalifah after Arafah",
      ar: "إرشادات للمبيت في مزدلفة بعد عرفة",
      ur: "عرفہ کے بعد مزدلفہ میں رات گزارنے کے رہنما اصول",
      hi: "अरफात के बाद मुज़दलिफा में रात ठहरने के दिशानिर्देश",
      tr: "Arafat'tan sonra Müzdelife'de gece kalma rehberi",
      ru: "Руководство по ночёвке в Муздалифе после Арафата",
    },
    icon: "Moon",
    rules: [
      {
        text: {
          en: "Combine and delay Maghrib and Isha prayers upon arrival at Muzdalifah.",
          ar: "اجمع وأخّر صلاتي المغرب والعشاء عند الوصول إلى مزدلفة.",
          ur: "مزدلفہ پہنچنے پر مغرب اور عشاء کی نمازیں جمع تاخیر کریں۔",
          hi: "मुज़दलिफा पहुँचने पर मग़रिब और इशा की नमाज़ जमा तख़ीर करें।",
          tr: "Müzdelife'ye varınca Akşam ve Yatsı namazlarını birleştirerek tehir edin.",
          ru: "По прибытии в Муздалифу объедините и отложите молитвы Магриб и Иша.",
        },
      },
      {
        text: {
          en: "Spend the night in remembrance of Allah and rest. This is a blessed night.",
          ar: "اقضِ الليلة في ذكر الله والراحة. إنها ليلة مباركة.",
          ur: "رات ذکر الہی اور آرام میں گزاریں۔ یہ ایک مبارک رات ہے۔",
          hi: "रात अल्लाह के स्मरण और आराम में बिताएं। यह एक मुबारक रात है।",
          tr: "Geceyi Allah'ı zikrederek ve dinlenerek geçirin. Bu mübarek bir gecedir.",
          ru: "Проведите ночь в поминании Аллаха и отдыхе. Это благословенная ночь.",
        },
      },
      {
        text: {
          en: "Collect 49-70 pebbles for pelting Jamarat (chickpea-sized stones).",
          ar: "اجمع 49-70 حصاة لرمي الجمرات (بحجم حبة الحمص).",
          ur: "جمرات پر کنکریاں مارنے کے لیے 49-70 کنکریاں جمع کریں (چنے کے سائز کے پتھر)۔",
          hi: "जमरात पर कंकड़ मारने के लिए 49-70 कंकड़ इकट्ठा करें (चने के आकार के पत्थर)।",
          tr: "Cemrelere atmak için 49-70 adet taş toplayın (nohut büyüklüğünde).",
          ru: "Соберите 49-70 камешков для бросания в Джамарат (размером с горошину).",
        },
      },
      {
        text: {
          en: "Leave Muzdalifah after midnight or after Fajr prayer, following your group schedule.",
          ar: "غادر مزدلفة بعد منتصف الليل أو بعد صلاة الفجر، حسب جدول مجموعتك.",
          ur: "آدھی رات کے بعد یا فجر کی نماز کے بعد اپنے گروپ کے شیڈول کے مطابق مزدلفہ چھوڑیں۔",
          hi: "आधी रात के बाद या फज्र की नमाज़ के बाद अपने समूह के शेड्यूल के अनुसार मुज़दलिफा छोड़ें।",
          tr: "Gece yarısından sonra veya Sabah namazından sonra grup programınıza göre Müzdelife'den ayrılın.",
          ru: "Покиньте Муздалифу после полуночи или после молитвы Фаджр, следуя расписанию группы.",
        },
      },
      {
        text: {
          en: "Protect yourself from cold at night. Bring warm clothing and blankets.",
          ar: "احمِ نفسك من البرد ليلاً. أحضر ملابس دافئة وبطانيات.",
          ur: "رات کو سردی سے بچیں۔ گرم کپڑے اور کمبل ساتھ رکھیں۔",
          hi: "रात में ठंड से बचें। गर्म कपड़े और कंबल लाएं।",
          tr: "Gece soğuktan korunun. Sıcak giysiler ve battaniye getirin.",
          ru: "Защитите себя от холода ночью. Возьмите тёплую одежду и одеяла.",
        },
      },
      {
        text: {
          en: "Use designated toilet facilities. Maintain cleanliness in the area.",
          ar: "استخدم المراحيض المخصصة. حافظ على نظافة المنطقة.",
          ur: "مخصوص بیت الخلاء استعمال کریں۔ علاقے کی صفائی برقرار رکھیں۔",
          hi: "निर्धारित शौचालय सुविधाओं का उपयोग करें। क्षेत्र की स्वच्छता बनाए रखें।",
          tr: "Belirlenmiş tuvalet tesislerini kullanın. Bölgenin temizliğini koruyun.",
          ru: "Используйте специально отведённые туалеты. Поддерживайте чистоту в этом районе.",
        },
      },
    ],
  },
  {
    id: "jamarat-pelting",
    order: 11,
    title: {
      en: "Jamarat Pelting Rules",
      ar: "قواعد رمي الجمرات",
      ur: "جمرات پر کنکریاں مارنے کے قواعد",
      hi: "जमरात पर कंकड़ मारने के नियम",
      tr: "Şeytan Taşlama Kuralları",
      ru: "Правила бросания камней в Джамарат",
    },
    description: {
      en: "Safety guidelines for pelting the Jamarat pillars",
      ar: "إرشادات السلامة لرمي أعمدة الجمرات",
      ur: "جمرات کے ستونوں پر کنکریاں مارنے کے حفاظتی رہنما اصول",
      hi: "जमरात स्तंभों पर कंकड़ मारने के सुरक्षा दिशानिर्देश",
      tr: "Cemre sütunlarını taşlama için güvenlik rehberi",
      ru: "Рекомендации по безопасности при бросании камней в столбы Джамарат",
    },
    icon: "Target",
    rules: [
      {
        text: {
          en: "On Eid day (10th), pelt only Jamarat Al-Aqaba with 7 pebbles.",
          ar: "في يوم العيد (10)، ارمِ جمرة العقبة فقط بـ 7 حصيات.",
          ur: "عید کے دن (10 ذوالحجہ) صرف جمرہ عقبہ پر 7 کنکریاں ماریں۔",
          hi: "ईद के दिन (10वीं) केवल जमरात अल-अक़बा पर 7 कंकड़ मारें।",
          tr: "Bayram günü (10.) sadece Cemre-i Akabe'yi 7 taşla atın.",
          ru: "В день праздника (10-й) бросьте только 7 камешков в Джамарат Аль-Акаба.",
        },
      },
      {
        text: {
          en: "On Days of Tashreeq (11th-13th), pelt all three Jamarat in order: Small, Medium, then Large.",
          ar: "في أيام التشريق (11-13)، ارمِ الجمرات الثلاث بالترتيب: الصغرى، الوسطى، ثم الكبرى.",
          ur: "ایام تشریق (11-13) میں تینوں جمرات کو ترتیب سے ماریں: چھوٹا، درمیانہ، پھر بڑا۔",
          hi: "तशरीक के दिनों (11-13) में तीनों जमरात को क्रम से मारें: छोटा, मध्यम, फिर बड़ा।",
          tr: "Teşrik Günlerinde (11-13.) üç cemreyi de sırasıyla atın: Küçük, Orta, sonra Büyük.",
          ru: "В дни Ташрик (11-13) бросайте камни во все три Джамарат по порядку: малый, средний, затем большой.",
        },
      },
      {
        text: {
          en: "Pelt after Dhuhr (noon) during Days of Tashreeq. Avoid peak congestion times.",
          ar: "ارمِ بعد الظهر خلال أيام التشريق. تجنب أوقات الازدحام.",
          ur: "ایام تشریق میں ظہر کے بعد کنکریاں ماریں۔ زیادہ بھیڑ کے اوقات سے بچیں۔",
          hi: "तशरीक के दिनों में ज़ुहर के बाद कंकड़ मारें। भीड़ के समय से बचें।",
          tr: "Teşrik Günlerinde Öğleden sonra taş atın. Yoğun kalabalık zamanlarından kaçının.",
          ru: "Бросайте камни после полудня в дни Ташрик. Избегайте пиковых часов скопления людей.",
        },
      },
      {
        text: {
          en: "Do not push or shove. Follow crowd flow and official directions at all times.",
          ar: "لا تدفع أو تزاحم. اتبع حركة الحشود والتوجيهات الرسمية في جميع الأوقات.",
          ur: "دھکا نہ دیں۔ ہر وقت بھیڑ کے بہاؤ اور سرکاری ہدایات پر عمل کریں۔",
          hi: "धक्का न दें। हर समय भीड़ के प्रवाह और आधिकारिक निर्देशों का पालन करें।",
          tr: "İtmeyin veya kakıştırmayın. Her zaman kalabalık akışını ve resmi talimatları takip edin.",
          ru: "Не толкайтесь. Всегда следуйте потоку толпы и официальным указаниям.",
        },
      },
      {
        text: {
          en: "Use multiple floors of Jamarat Bridge to reduce congestion.",
          ar: "استخدم الطوابق المتعددة لجسر الجمرات لتقليل الازدحام.",
          ur: "بھیڑ کم کرنے کے لیے جمرات پل کی متعدد منزلیں استعمال کریں۔",
          hi: "भीड़ कम करने के लिए जमरात पुल की कई मंजिलों का उपयोग करें।",
          tr: "Kalabalığı azaltmak için Cemre Köprüsü'nün birden fazla katını kullanın.",
          ru: "Используйте несколько этажей моста Джамарат для уменьшения скопления.",
        },
      },
      {
        text: {
          en: "Elderly or weak pilgrims may appoint a representative to pelt on their behalf.",
          ar: "يمكن لكبار السن أو الضعفاء توكيل من يرمي نيابة عنهم.",
          ur: "بزرگ یا کمزور حجاج اپنی طرف سے کنکریاں مارنے کے لیے نمائندہ مقرر کر سکتے ہیں۔",
          hi: "बुजुर्ग या कमजोर तीर्थयात्री अपनी ओर से कंकड़ मारने के लिए प्रतिनिधि नियुक्त कर सकते हैं।",
          tr: "Yaşlı veya zayıf hacılar, kendi adlarına taşlamak için bir temsilci atayabilir.",
          ru: "Пожилые или слабые паломники могут назначить представителя для бросания камней от их имени.",
        },
      },
    ],
  },
  {
    id: "makkah-landmarks",
    order: 12,
    title: {
      en: "Makkah Landmarks & Etiquette",
      ar: "معالم مكة وآدابها",
      ur: "مکہ کے مقامات اور آداب",
      hi: "मक्का के स्थलचिह्न और शिष्टाचार",
      tr: "Mekke Simgeleri ve Âdâbı",
      ru: "Достопримечательности и этикет Мекки",
    },
    description: {
      en: "Important landmarks and proper conduct in the Holy City",
      ar: "المعالم المهمة والسلوك الصحيح في المدينة المقدسة",
      ur: "مقدس شہر میں اہم مقامات اور مناسب سلوک",
      hi: "पवित्र नगर में महत्वपूर्ण स्थल और उचित आचरण",
      tr: "Kutsal Şehir'de önemli yerler ve uygun davranış",
      ru: "Важные достопримечательности и правильное поведение в Святом городе",
    },
    icon: "Landmark",
    rules: [
      {
        text: {
          en: "Jabal Al-Nour houses Hira Cave where the Prophet received the first revelation.",
          ar: "يضم جبل النور غار حراء حيث تلقى النبي الوحي الأول.",
          ur: "جبل نور میں غار حرا ہے جہاں نبی ﷺ پر پہلی وحی نازل ہوئی۔",
          hi: "जबल अल-नूर में हिरा गुफा है जहाँ नबी को पहली वही मिली।",
          tr: "Cebel-i Nur'da Hira Mağarası bulunur, Peygamber'e ilk vahiy burada gelmiştir.",
          ru: "На горе Джабаль Ан-Нур находится пещера Хира, где Пророк получил первое откровение.",
        },
      },
      {
        text: {
          en: "Mount Thawr contains the cave where the Prophet hid during migration to Madinah.",
          ar: "يحتوي جبل ثور على الغار الذي اختبأ فيه النبي أثناء الهجرة إلى المدينة.",
          ur: "غار ثور میں نبی ﷺ نے ہجرت کے دوران مدینہ جاتے وقت پناہ لی۔",
          hi: "जबल थौर में वह गुफा है जहाँ नबी ने मदीना जाते समय छिपाया था।",
          tr: "Sevr Dağı'nda Peygamber'in Medine'ye hicret sırasında gizlendiği mağara bulunur.",
          ru: "Гора Саур содержит пещеру, где Пророк скрывался во время переселения в Медину.",
        },
      },
      {
        text: {
          en: "At-Tan'eem Mosque (Aisha Mosque) is the nearest Miqat for entering Ihraam from Makkah.",
          ar: "مسجد التنعيم (مسجد عائشة) هو أقرب ميقات للإحرام من مكة.",
          ur: "مسجد تنعیم (مسجد عائشہ) مکہ سے احرام باندھنے کا قریب ترین میقات ہے۔",
          hi: "मस्जिद तनईम (आयशा मस्जिद) मक्का से इहराम में प्रवेश के लिए निकटतम मीकात है।",
          tr: "Ten'im Mescidi (Aişe Mescidi), Mekke'den ihrama girmek için en yakın Mikat'tır.",
          ru: "Мечеть Ат-Тан'им (мечеть Аиши) — ближайший Микат для входа в ихрам из Мекки.",
        },
      },
      {
        text: {
          en: "Visit the Kiswah (Ka'bah Covering) Exhibition to learn about this honored tradition.",
          ar: "زر معرض كسوة الكعبة للتعرف على هذا التقليد المشرف.",
          ur: "کسوہ (غلاف کعبہ) نمائش دیکھیں اور اس معزز روایت کے بارے میں جانیں۔",
          hi: "किस्वा (काबा आवरण) प्रदर्शनी देखें और इस सम्मानित परंपरा के बारे में जानें।",
          tr: "Bu onurlu gelenek hakkında bilgi edinmek için Kisve (Kâbe Örtüsü) Sergisi'ni ziyaret edin.",
          ru: "Посетите выставку Кисвы (покрывала Каабы), чтобы узнать об этой почитаемой традиции.",
        },
      },
      {
        text: {
          en: "Show utmost respect and humility in all sacred sites. Avoid loud conversations.",
          ar: "أظهر أقصى درجات الاحترام والتواضع في جميع المواقع المقدسة. تجنب الحديث بصوت عالٍ.",
          ur: "تمام مقدس مقامات میں انتہائی احترام اور عاجزی دکھائیں۔ اونچی آواز میں بات سے بچیں۔",
          hi: "सभी पवित्र स्थलों में अत्यधिक सम्मान और विनम्रता दिखाएं। ऊँची बातचीत से बचें।",
          tr: "Tüm kutsal mekanlarda en üst düzeyde saygı ve tevazu gösterin. Yüksek sesle konuşmaktan kaçının.",
          ru: "Проявляйте максимальное уважение и смирение во всех священных местах. Избегайте громких разговоров.",
        },
      },
      {
        text: {
          en: "Emergency: Call 911 for police, 997 for ambulance, 998 for civil defense.",
          ar: "حالات الطوارئ: اتصل على 911 للشرطة، 997 للإسعاف، 998 للدفاع المدني.",
          ur: "ایمرجنسی: پولیس کے لیے 911، ایمبولینس کے لیے 997، سول ڈیفنس کے لیے 998 پر کال کریں۔",
          hi: "आपातकाल: पुलिस के लिए 911, एम्बुलेंस के लिए 997, सिविल डिफेंस के लिए 998 कॉल करें।",
          tr: "Acil: Polis için 911, Ambulans için 997, Sivil Savunma için 998'i arayın.",
          ru: "Экстренная помощь: звоните 911 — полиция, 997 — скорая помощь, 998 — гражданская оборона.",
        },
      },
    ],
  },
  {
    id: "prophets-mosque",
    order: 13,
    title: {
      en: "Prophet's Mosque Etiquette",
      ar: "آداب المسجد النبوي",
      ur: "مسجد نبوی کے آداب",
      hi: "मस्जिद-ए-नबवी के शिष्टाचार",
      tr: "Mescid-i Nebevi Âdâbı",
      ru: "Этикет мечети Пророка",
    },
    description: {
      en: "Proper conduct when visiting the Prophet's Mosque in Madinah",
      ar: "السلوك الصحيح عند زيارة المسجد النبوي في المدينة",
      ur: "مدینہ میں مسجد نبوی کی زیارت کے دوران مناسب سلوک",
      hi: "मदीना में मस्जिद-ए-नबवी की ज़ियारत के दौरान उचित आचरण",
      tr: "Medine'de Mescid-i Nebevi'yi ziyaret ederken uygun davranış",
      ru: "Правильное поведение при посещении мечети Пророка в Медине",
    },
    icon: "Building2",
    rules: [
      {
        text: {
          en: "Prayer in the Prophet's Mosque equals 1,000 prayers elsewhere (except Grand Mosque).",
          ar: "الصلاة في المسجد النبوي تعادل 1000 صلاة في غيره (ما عدا المسجد الحرام).",
          ur: "مسجد نبوی میں نماز 1000 نمازوں کے برابر ہے (مسجد حرام کے علاوہ)۔",
          hi: "मस्जिद-ए-नबवी में नमाज़ 1,000 नमाज़ों के बराबर है (मस्जिद-ए-हराम के अलावा)।",
          tr: "Mescid-i Nebevi'de namaz, başka yerlerdeki 1.000 namaza eşittir (Mescid-i Haram hariç).",
          ru: "Молитва в мечети Пророка равна 1000 молитв в другом месте (кроме Заповедной мечети).",
        },
      },
      {
        text: {
          en: "Give Salaam to the Prophet, Abu Bakr, and Umar quietly at Al-Hujrah Ash-Shareefah.",
          ar: "سلّم على النبي وأبي بكر وعمر بهدوء عند الحجرة الشريفة.",
          ur: "حجرہ شریفہ پر نبی ﷺ، ابوبکر اور عمر رضی اللہ عنہما کو خاموشی سے سلام کریں۔",
          hi: "अल-हुजरा अश-शरीफा पर नबी, अबू बक्र और उमर को चुपचाप सलाम करें।",
          tr: "Hücre-i Şerife'de Peygamber, Ebu Bekir ve Ömer'e sessizce selam verin.",
          ru: "Тихо приветствуйте Пророка, Абу Бакра и Умара у Аль-Худжра Аш-Шарифа.",
        },
      },
      {
        text: {
          en: "Pray in the Rawdah if possible — it is a garden from the gardens of Paradise.",
          ar: "صلِّ في الروضة إن أمكن — فهي روضة من رياض الجنة.",
          ur: "ممکن ہو تو روضہ میں نماز پڑھیں — یہ جنت کے باغوں میں سے ایک باغ ہے۔",
          hi: "संभव हो तो रौज़ा में नमाज़ पढ़ें — यह जन्नत के बगीचों में से एक बगीचा है।",
          tr: "Mümkünse Ravza'da namaz kılın — burası Cennet bahçelerinden bir bahçedir.",
          ru: "По возможности молитесь в Равде — это сад из садов Рая.",
        },
      },
      {
        text: {
          en: "Follow women's designated areas and timings for Rawdah visits.",
          ar: "اتبعي المناطق والأوقات المخصصة للنساء لزيارة الروضة.",
          ur: "خواتین روضہ کی زیارت کے لیے مخصوص علاقوں اور اوقات کی پابندی کریں۔",
          hi: "महिलाएं रौज़ा की ज़ियारत के लिए निर्धारित क्षेत्रों और समय का पालन करें।",
          tr: "Kadınlar Ravza ziyaretleri için belirlenmiş alanları ve zamanları takip etsin.",
          ru: "Женщины должны следовать специально отведённым зонам и времени для посещения Равды.",
        },
      },
      {
        text: {
          en: "Visit Al-Baqi' Cemetery to pray for the Companions buried there.",
          ar: "زر مقبرة البقيع للدعاء للصحابة المدفونين هناك.",
          ur: "البقیع قبرستان کی زیارت کریں اور وہاں دفن صحابہ کے لیے دعا کریں۔",
          hi: "अल-बक़ी कब्रिस्तान जाएं और वहाँ दफ़न सहाबा के लिए दुआ करें।",
          tr: "Baki Mezarlığı'nı ziyaret edin ve orada defnedilen Sahabeler için dua edin.",
          ru: "Посетите кладбище Аль-Баки, чтобы помолиться за похороненных там сподвижников.",
        },
      },
      {
        text: {
          en: "Do not seek blessings from graves or tombs. Make du'a only to Allah.",
          ar: "لا تطلب البركة من القبور أو الأضرحة. ادعُ الله وحده.",
          ur: "قبروں یا مزاروں سے برکت نہ مانگیں۔ صرف اللہ سے دعا کریں۔",
          hi: "कब्रों या मज़ारों से बरकत न माँगें। केवल अल्लाह से दुआ करें।",
          tr: "Kabirlerden veya türbelerden bereket dilemeyin. Sadece Allah'a dua edin.",
          ru: "Не ищите благословений от могил или гробниц. Молитесь только Аллаху.",
        },
      },
    ],
  },
  {
    id: "cybersecurity-awareness",
    order: 14,
    title: {
      en: "Cybersecurity Awareness",
      ar: "التوعية بالأمن السيبراني",
      ur: "سائبر سیکیورٹی آگاہی",
      hi: "साइबर सुरक्षा जागरूकता",
      tr: "Siber Güvenlik Farkındalığı",
      ru: "Осведомлённость о кибербезопасности",
    },
    description: {
      en: "Protect yourself from cyber threats during Hajj and Umrah",
      ar: "احمِ نفسك من التهديدات السيبرانية خلال الحج والعمرة",
      ur: "حج اور عمرہ کے دوران سائبر خطرات سے خود کو بچائیں",
      hi: "हज और उमराह के दौरान साइबर खतरों से खुद को बचाएं",
      tr: "Hac ve Umre sırasında siber tehditlerden korunun",
      ru: "Защитите себя от киберугроз во время хаджа и умры",
    },
    icon: "Shield",
    image: "/assets/rules/cybersecurity-cover.jpg",
    rules: [
      {
        text: {
          en: "Beware of social engineering attacks. Attackers may impersonate trusted entities or officials.",
          ar: "احذر من هجمات الهندسة الاجتماعية. قد ينتحل المهاجمون صفة جهات موثوقة أو مسؤولين.",
          ur: "سوشل انجینئرنگ حملوں سے ہوشیار رہیں۔ حملہ آور قابل اعتماد اداروں یا اہلکاروں کا روپ دھار سکتے ہیں۔",
          hi: "सोशल इंजीनियरिंग हमलों से सावधान रहें। हमलावर विश्वसनीय संस्थाओं या अधिकारियों का रूप धारण कर सकते हैं।",
          tr: "Sosyal mühendislik saldırılarına dikkat edin. Saldırganlar güvenilir kurumlar veya yetkililer gibi davranabilir.",
          ru: "Остерегайтесь атак социальной инженерии. Злоумышленники могут выдавать себя за доверенные организации или должностных лиц.",
        },
      },
      {
        text: {
          en: "Avoid clicking links in suspicious emails or SMS claiming to be from Hajj authorities.",
          ar: "تجنب النقر على الروابط في رسائل البريد الإلكتروني أو الرسائل النصية المشبوهة التي تدّعي أنها من سلطات الحج.",
          ur: "حج حکام سے ہونے کا دعویٰ کرنے والی مشکوک ای میلز یا SMS میں لنکس پر کلک نہ کریں۔",
          hi: "हज अधिकारियों से होने का दावा करने वाले संदिग्ध ईमेल या SMS में लिंक पर क्लिक न करें।",
          tr: "Hac yetkililerinden geldiğini iddia eden şüpheli e-posta veya SMS'lerdeki bağlantılara tıklamayın.",
          ru: "Не переходите по ссылкам в подозрительных электронных письмах или SMS, якобы от властей хаджа.",
        },
      },
      {
        text: {
          en: "Set a strong passcode and enable biometric authentication (Face ID/fingerprint) on your phone.",
          ar: "استخدم رمز مرور قوي وفعّل المصادقة البيومترية (Face ID/بصمة الإصبع) على هاتفك.",
          ur: "اپنے فون پر مضبوط پاس کوڈ سیٹ کریں اور بایومیٹرک تصدیق (Face ID/فنگر پرنٹ) فعال کریں۔",
          hi: "अपने फोन पर मजबूत पासकोड सेट करें और बायोमेट्रिक प्रमाणीकरण (Face ID/फिंगरप्रिंट) सक्षम करें।",
          tr: "Telefonunuzda güçlü bir şifre belirleyin ve biyometrik kimlik doğrulamayı (Face ID/parmak izi) etkinleştirin.",
          ru: "Установите надёжный пароль и включите биометрическую аутентификацию (Face ID/отпечаток пальца) на телефоне.",
        },
      },
      {
        text: {
          en: "Only use secure websites (https://) for bookings. Verify URLs before entering personal information.",
          ar: "استخدم فقط المواقع الآمنة (https://) للحجوزات. تحقق من عناوين URL قبل إدخال المعلومات الشخصية.",
          ur: "بکنگ کے لیے صرف محفوظ ویب سائٹس (https://) استعمال کریں۔ ذاتی معلومات درج کرنے سے پہلے URLs کی تصدیق کریں۔",
          hi: "बुकिंग के लिए केवल सुरक्षित वेबसाइटें (https://) उपयोग करें। व्यक्तिगत जानकारी दर्ज करने से पहले URLs सत्यापित करें।",
          tr: "Rezervasyonlar için yalnızca güvenli web sitelerini (https://) kullanın. Kişisel bilgi girmeden önce URL'leri doğrulayın.",
          ru: "Используйте только защищённые сайты (https://) для бронирования. Проверяйте URL перед вводом личных данных.",
        },
      },
      {
        text: {
          en: "Install all security updates on your devices before traveling. Keep apps updated.",
          ar: "ثبّت جميع التحديثات الأمنية على أجهزتك قبل السفر. حافظ على تحديث التطبيقات.",
          ur: "سفر سے پہلے اپنے آلات پر تمام سیکیورٹی اپڈیٹس انسٹال کریں۔ ایپس اپڈیٹ رکھیں۔",
          hi: "यात्रा से पहले अपने उपकरणों पर सभी सुरक्षा अपडेट इंस्टॉल करें। ऐप्स अपडेट रखें।",
          tr: "Seyahattan önce cihazlarınıza tüm güvenlik güncellemelerini yükleyin. Uygulamaları güncel tutun.",
          ru: "Установите все обновления безопасности на устройствах перед поездкой. Держите приложения обновлёнными.",
        },
      },
      {
        text: {
          en: "Back up your phone data before traveling. In case of loss, you can recover important information.",
          ar: "انسخ بيانات هاتفك احتياطياً قبل السفر. في حالة الفقدان، يمكنك استعادة المعلومات المهمة.",
          ur: "سفر سے پہلے اپنے فون کا ڈیٹا بیک اپ کریں۔ گم ہونے کی صورت میں اہم معلومات بحال کر سکتے ہیں۔",
          hi: "यात्रा से पहले अपने फोन का डेटा बैकअप करें। खो जाने पर महत्वपूर्ण जानकारी रिकवर कर सकते हैं।",
          tr: "Seyahattan önce telefon verilerinizi yedekleyin. Kayıp durumunda önemli bilgileri kurtarabilirsiniz.",
          ru: "Сделайте резервную копию данных телефона перед поездкой. В случае потери сможете восстановить важную информацию.",
        },
      },
      {
        text: {
          en: "Use only official Hajj and Umrah apps. Download from App Store or Google Play only.",
          ar: "استخدم فقط تطبيقات الحج والعمرة الرسمية. قم بتنزيلها من متجر التطبيقات أو جوجل بلاي فقط.",
          ur: "صرف سرکاری حج اور عمرہ ایپس استعمال کریں۔ صرف App Store یا Google Play سے ڈاؤن لوڈ کریں۔",
          hi: "केवल आधिकारिक हज और उमराह ऐप्स उपयोग करें। केवल App Store या Google Play से डाउनलोड करें।",
          tr: "Yalnızca resmi Hac ve Umre uygulamalarını kullanın. Sadece App Store veya Google Play'den indirin.",
          ru: "Используйте только официальные приложения хаджа и умры. Скачивайте только из App Store или Google Play.",
        },
      },
    ],
  },
  {
    id: "grand-mosque-guide",
    order: 15,
    title: {
      en: "Grand Mosque Guide",
      ar: "دليل المسجد الحرام",
      ur: "مسجد حرام کا رہنما",
      hi: "मस्जिद-ए-हराम गाइड",
      tr: "Harem-i Şerif Rehberi",
      ru: "Путеводитель по Заповедной мечети",
    },
    description: {
      en: "Know the sacred landmarks and services at the Grand Mosque",
      ar: "تعرف على المعالم المقدسة والخدمات في المسجد الحرام",
      ur: "مسجد حرام کے مقدس مقامات اور خدمات جانیں",
      hi: "मस्जिद-ए-हराम के पवित्र स्थलों और सेवाओं को जानें",
      tr: "Harem-i Şerif'teki kutsal mekanları ve hizmetleri tanıyın",
      ru: "Узнайте о священных достопримечательностях и услугах Заповедной мечети",
    },
    icon: "Landmark",
    image: "/assets/rules/grand-mosque-cover.jpg",
    rules: [
      {
        text: {
          en: "The Ka'ba is the Qiblah (prayer direction) for Muslims worldwide. Tawaf is performed around it.",
          ar: "الكعبة هي القبلة (اتجاه الصلاة) للمسلمين في جميع أنحاء العالم. يُؤدى الطواف حولها.",
          ur: "کعبہ دنیا بھر کے مسلمانوں کا قبلہ (نماز کی سمت) ہے۔ اس کے گرد طواف کیا جاتا ہے۔",
          hi: "काबा दुनिया भर के मुसलमानों के लिए किबला (नमाज़ की दिशा) है। इसके चारों ओर तवाफ़ किया जाता है।",
          tr: "Kâbe, dünya genelinde Müslümanlar için Kıble'dir (namaz yönü). Tavaf onun etrafında yapılır.",
          ru: "Кааба — это Кибла (направление молитвы) для мусульман всего мира. Таваф совершается вокруг неё.",
        },
      },
      {
        text: {
          en: "The Black Stone (Al-Hajar Al-Aswad) is at the starting point of Tawaf. Point or wave if crowded.",
          ar: "الحجر الأسود هو نقطة بداية الطواف. أشر أو لوّح إذا كان هناك ازدحام.",
          ur: "حجر اسود طواف کا نقطہ آغاز ہے۔ بھیڑ ہو تو اشارہ یا ہاتھ ہلائیں۔",
          hi: "हजर-ए-असवद तवाफ़ का प्रारंभ बिंदु है। भीड़ हो तो इशारा करें या हाथ हिलाएं।",
          tr: "Hacer-ül Esved, Tavaf'ın başlangıç noktasıdır. Kalabalıksa işaret edin veya el sallayın.",
          ru: "Чёрный камень (Аль-Хаджар Аль-Асвад) — начальная точка Тавафа. Укажите или помашите, если многолюдно.",
        },
      },
      {
        text: {
          en: "Maqaam Ibrahim is where Ibrahim stood while building the Ka'ba. Pray two rak'aas behind it after Tawaf.",
          ar: "مقام إبراهيم حيث وقف إبراهيم أثناء بناء الكعبة. صلِّ ركعتين خلفه بعد الطواف.",
          ur: "مقام ابراہیم وہ جگہ ہے جہاں ابراہیم علیہ السلام کعبہ بناتے وقت کھڑے تھے۔ طواف کے بعد اس کے پیچھے دو رکعت پڑھیں۔",
          hi: "मक़ाम इब्राहीम वह स्थान है जहाँ इब्राहीम काबा बनाते समय खड़े थे। तवाफ़ के बाद इसके पीछे दो रकात पढ़ें।",
          tr: "Makam-ı İbrahim, İbrahim'in Kâbe'yi inşa ederken durduğu yerdir. Tavaf'tan sonra arkasında iki rekât namaz kılın.",
          ru: "Макам Ибрахим — место, где стоял Ибрахим, строя Каабу. После Тавафа совершите два ракаата позади него.",
        },
      },
      {
        text: {
          en: "Zamzam water is blessed. Drink it with intention and supplication. Say 'Bismillah' before drinking.",
          ar: "ماء زمزم مبارك. اشربه بنية ودعاء. قل 'بسم الله' قبل الشرب.",
          ur: "زمزم کا پانی مبارک ہے۔ نیت اور دعا کے ساتھ پئیں۔ پینے سے پہلے 'بسم اللہ' کہیں۔",
          hi: "ज़मज़म का पानी मुबारक है। नीयत और दुआ के साथ पिएं। पीने से पहले 'बिस्मिल्लाह' कहें।",
          tr: "Zemzem suyu mübarektir. Niyet ve dua ile için. İçmeden önce 'Bismillah' deyin.",
          ru: "Вода Замзам благословенна. Пейте её с намерением и мольбой. Скажите 'Бисмиллях' перед питьём.",
        },
      },
      {
        text: {
          en: "Safa and Marwa are the hills between which Sa'i is performed (7 circuits).",
          ar: "الصفا والمروة هما التلان اللذان يُؤدى بينهما السعي (7 أشواط).",
          ur: "صفا اور مروہ وہ پہاڑیاں ہیں جن کے درمیان سعی کی جاتی ہے (7 چکر)۔",
          hi: "सफ़ा और मरवा वे पहाड़ियाँ हैं जिनके बीच सई की जाती है (7 चक्कर)।",
          tr: "Safa ve Merve, Sa'y'ın yapıldığı tepelerdir (7 şavt).",
          ru: "Сафа и Марва — холмы, между которыми совершается Са'й (7 кругов).",
        },
      },
      {
        text: {
          en: "Wheelchair services are available free of charge. Inaya Care Centers provide assistance for disabled pilgrims.",
          ar: "خدمات الكراسي المتحركة متوفرة مجاناً. توفر مراكز العناية المساعدة للحجاج ذوي الإعاقة.",
          ur: "وہیل چیئر سروسز مفت دستیاب ہیں۔ عنایہ کیئر سینٹرز معذور حجاج کو مدد فراہم کرتے ہیں۔",
          hi: "व्हीलचेयर सेवाएं मुफ्त उपलब्ध हैं। इनाया केयर सेंटर विकलांग तीर्थयात्रियों को सहायता प्रदान करते हैं।",
          tr: "Tekerlekli sandalye hizmetleri ücretsizdir. İnaye Bakım Merkezleri engelli hacılara yardım sağlar.",
          ru: "Услуги инвалидных колясок предоставляются бесплатно. Центры ухода Инайя помогают паломникам с ограниченными возможностями.",
        },
      },
    ],
  },
  {
    id: "umrah-step-by-step",
    order: 16,
    title: {
      en: "Umrah Step-by-Step",
      ar: "العمرة خطوة بخطوة",
      ur: "عمرہ مرحلہ وار",
      hi: "उमराह चरण दर चरण",
      tr: "Umre Adım Adım",
      ru: "Умра шаг за шагом",
    },
    description: {
      en: "Complete guide to performing Umrah correctly",
      ar: "دليل كامل لأداء العمرة بشكل صحيح",
      ur: "عمرہ صحیح طریقے سے ادا کرنے کا مکمل رہنما",
      hi: "उमराह सही ढंग से करने की पूरी गाइड",
      tr: "Umre'yi doğru şekilde yapmak için eksiksiz rehber",
      ru: "Полное руководство по правильному совершению умры",
    },
    icon: "BookOpen",
    image: "/assets/rules/umrah-cover.jpg",
    rules: [
      {
        text: {
          en: "Enter Ihraam at the Miqat. Recite Talbiyah: 'Labbayk Allahumma Labbayk...'",
          ar: "ادخل في الإحرام عند الميقات. ردد التلبية: 'لبيك اللهم لبيك...'",
          ur: "میقات پر احرام باندھیں۔ تلبیہ پڑھیں: 'لبیک اللہم لبیک...'",
          hi: "मीकात पर इहराम में प्रवेश करें। तलबियह पढ़ें: 'लब्बैक अल्लाहुम्मा लब्बैक...'",
          tr: "Mikat'ta ihrama girin. Telbiye okuyun: 'Lebbeyk Allahümme Lebbeyk...'",
          ru: "Войдите в ихрам в Микате. Произнесите Тальбию: 'Лаббайка Аллахумма Лаббайк...'",
        },
      },
      {
        text: {
          en: "Perform Tawaf: Circle the Ka'ba 7 times counter-clockwise, starting from the Black Stone.",
          ar: "أدِّ الطواف: طف حول الكعبة 7 أشواط عكس عقارب الساعة، بدءاً من الحجر الأسود.",
          ur: "طواف کریں: کعبہ کے گرد 7 چکر لگائیں ٹھیک گھڑی کی سمت کے برعکس، حجر اسود سے شروع کریں۔",
          hi: "तवाफ़ करें: काबा के चारों ओर 7 चक्कर लगाएं वामावर्त, हजर-ए-असवद से शुरू करें।",
          tr: "Tavaf yapın: Kâbe'nin etrafında saat yönünün tersine 7 şavt dönün, Hacer-ül Esved'den başlayarak.",
          ru: "Совершите Таваф: обойдите Каабу 7 раз против часовой стрелки, начиная от Чёрного камня.",
        },
      },
      {
        text: {
          en: "Pray 2 rak'aas behind Maqaam Ibrahim after completing Tawaf.",
          ar: "صلِّ ركعتين خلف مقام إبراهيم بعد إتمام الطواف.",
          ur: "طواف مکمل کرنے کے بعد مقام ابراہیم کے پیچھے 2 رکعت نماز پڑھیں۔",
          hi: "तवाफ़ पूरा करने के बाद मक़ाम इब्राहीम के पीछे 2 रकात पढ़ें।",
          tr: "Tavaf'ı tamamladıktan sonra Makam-ı İbrahim'in arkasında 2 rekât namaz kılın.",
          ru: "Совершите 2 ракаата позади Макам Ибрахим после завершения Тавафа.",
        },
      },
      {
        text: {
          en: "Drink Zamzam water with intention and supplication before Sa'i.",
          ar: "اشرب ماء زمزم بنية ودعاء قبل السعي.",
          ur: "سعی سے پہلے نیت اور دعا کے ساتھ زمزم کا پانی پئیں۔",
          hi: "सई से पहले नीयत और दुआ के साथ ज़मज़म का पानी पिएं।",
          tr: "Sa'y'dan önce niyet ve dua ile Zemzem suyu için.",
          ru: "Выпейте воду Замзам с намерением и мольбой перед Са'й.",
        },
      },
      {
        text: {
          en: "Perform Sa'i: Walk 7 times between Safa and Marwa. Start at Safa, end at Marwa.",
          ar: "أدِّ السعي: امشِ 7 أشواط بين الصفا والمروة. ابدأ من الصفا وانتهِ عند المروة.",
          ur: "سعی کریں: صفا اور مروہ کے درمیان 7 چکر لگائیں۔ صفا سے شروع کریں، مروہ پر ختم کریں۔",
          hi: "सई करें: सफ़ा और मरवा के बीच 7 बार चलें। सफ़ा से शुरू करें, मरवा पर समाप्त करें।",
          tr: "Sa'y yapın: Safa ile Merve arasında 7 kez yürüyün. Safa'da başlayın, Merve'de bitirin.",
          ru: "Совершите Са'й: пройдите 7 раз между Сафа и Марва. Начните с Сафа, закончите на Марва.",
        },
      },
      {
        text: {
          en: "Complete Umrah by shaving (men) or trimming (women cut 1-2 cm) your hair. Exit Ihraam.",
          ar: "أكمل العمرة بحلق الرأس (للرجال) أو تقصيره (للنساء 1-2 سم). اخرج من الإحرام.",
          ur: "سر منڈوا کر (مرد) یا بال کاٹ کر (خواتین 1-2 سینٹی میٹر) عمرہ مکمل کریں۔ احرام سے نکلیں۔",
          hi: "सिर मुंडवा कर (पुरुष) या बाल काट कर (महिलाएं 1-2 सेमी) उमराह पूरा करें। इहराम से बाहर निकलें।",
          tr: "Saçı tıraş ederek (erkekler) veya kırparak (kadınlar 1-2 cm) Umre'yi tamamlayın. İhramdan çıkın.",
          ru: "Завершите умру бритьём (мужчины) или подстриганием (женщины 1-2 см) волос. Выйдите из ихрама.",
        },
      },
    ],
  },
  {
    id: "madinah-landmarks",
    order: 17,
    title: {
      en: "Madinah Landmarks Guide",
      ar: "دليل معالم المدينة المنورة",
      ur: "مدینہ منورہ کے مقامات کا رہنما",
      hi: "मदीना के स्थलों की गाइड",
      tr: "Medine Simgeleri Rehberi",
      ru: "Путеводитель по достопримечательностям Медины",
    },
    description: {
      en: "Important sites to visit in the Prophet's City",
      ar: "المواقع المهمة للزيارة في مدينة النبي",
      ur: "نبی کے شہر میں زیارت کے اہم مقامات",
      hi: "नबी के शहर में देखने योग्य महत्वपूर्ण स्थान",
      tr: "Peygamber'in Şehri'nde ziyaret edilecek önemli yerler",
      ru: "Важные места для посещения в Городе Пророка",
    },
    icon: "MapPin",
    image: "/assets/rules/madinah-cover.jpg",
    rules: [
      {
        text: {
          en: "Madinah is the second holiest site in Islam. It was honored by the Prophet's migration (Hijrah).",
          ar: "المدينة هي ثاني أقدس مكان في الإسلام. شُرّفت بهجرة النبي إليها.",
          ur: "مدینہ اسلام کا دوسرا مقدس ترین مقام ہے۔ نبی ﷺ کی ہجرت سے یہ شرف پایا۔",
          hi: "मदीना इस्लाम का दूसरा सबसे पवित्र स्थान है। नबी की हिजरत से इसे सम्मान मिला।",
          tr: "Medine, İslam'ın ikinci en kutsal yeridir. Peygamber'in hicreti ile şereflendi.",
          ru: "Медина — второе по святости место в исламе. Она была почтена переселением Пророка (Хиджра).",
        },
      },
      {
        text: {
          en: "Quba Mosque is the first mosque in Islam. Prayer there equals one Umrah in reward.",
          ar: "مسجد قباء هو أول مسجد في الإسلام. الصلاة فيه تعادل عمرة في الأجر.",
          ur: "مسجد قباء اسلام کی پہلی مسجد ہے۔ وہاں نماز کا ثواب ایک عمرے کے برابر ہے۔",
          hi: "मस्जिद क़ुबा इस्लाम की पहली मस्जिद है। वहाँ नमाज़ का सवाब एक उमराह के बराबर है।",
          tr: "Kuba Mescidi İslam'ın ilk mescididir. Orada namaz, bir Umre sevabına eşittir.",
          ru: "Мечеть Куба — первая мечеть в исламе. Молитва там равна умре по награде.",
        },
      },
      {
        text: {
          en: "Al-Baqi' Cemetery contains graves of the Prophet's family and many Companions.",
          ar: "تضم مقبرة البقيع قبور آل النبي وكثير من الصحابة.",
          ur: "البقیع قبرستان میں نبی ﷺ کے خاندان اور بہت سے صحابہ کی قبریں ہیں۔",
          hi: "अल-बक़ी कब्रिस्तान में नबी के परिवार और कई सहाबा की कब्रें हैं।",
          tr: "Baki Mezarlığı, Peygamber'in ailesi ve birçok Sahabenin kabirlerini barındırır.",
          ru: "Кладбище Аль-Баки содержит могилы семьи Пророка и многих сподвижников.",
        },
      },
      {
        text: {
          en: "Mount Uhud is where the famous Battle of Uhud took place. Many martyrs are buried nearby.",
          ar: "جبل أحد هو موقع معركة أحد الشهيرة. كثير من الشهداء مدفونون بالقرب منه.",
          ur: "جبل احد وہ جگہ ہے جہاں مشہور غزوہ احد ہوا۔ کئی شہداء قریب دفن ہیں۔",
          hi: "जबल उहुद वह स्थान है जहाँ प्रसिद्ध उहुद की लड़ाई हुई थी। कई शहीद पास में दफन हैं।",
          tr: "Uhud Dağı, ünlü Uhud Savaşı'nın gerçekleştiği yerdir. Birçok şehit yakınlarda defnedilmiştir.",
          ru: "Гора Ухуд — место знаменитой битвы при Ухуде. Многие мученики похоронены поблизости.",
        },
      },
      {
        text: {
          en: "Al-Qiblatayn Mosque is where the Qiblah was changed from Jerusalem to Makkah during prayer.",
          ar: "مسجد القبلتين هو حيث تحولت القبلة من القدس إلى مكة أثناء الصلاة.",
          ur: "مسجد قبلتین وہ جگہ ہے جہاں نماز کے دوران قبلہ یروشلم سے مکہ کی طرف بدلا گیا۔",
          hi: "मस्जिद अल-क़िबलतैन वह स्थान है जहाँ नमाज़ के दौरान क़िबला यरूशलम से मक्का की ओर बदला गया।",
          tr: "Kıbleteyn Mescidi, namazda Kıble'nin Kudüs'ten Mekke'ye döndürüldüğü yerdir.",
          ru: "Мечеть Аль-Киблатайн — место, где Кибла была изменена с Иерусалима на Мекку во время молитвы.",
        },
      },
      {
        text: {
          en: "Visit the King Fahd Quran Printing Complex to see how the Quran is printed and distributed globally.",
          ar: "زر مجمع الملك فهد لطباعة المصحف الشريف لترى كيف يُطبع القرآن ويُوزع عالمياً.",
          ur: "کنگ فہد قرآن پرنٹنگ کمپلیکس دیکھیں جہاں قرآن چھاپا اور دنیا بھر میں تقسیم کیا جاتا ہے۔",
          hi: "किंग फहद कुरान प्रिंटिंग कॉम्प्लेक्स देखें जहाँ कुरान छापा और विश्व भर में वितरित किया जाता है।",
          tr: "Kuran'ın nasıl basıldığını ve dünyaya dağıtıldığını görmek için Kral Fahd Kuran Basım Tesisi'ni ziyaret edin.",
          ru: "Посетите Комплекс печати Корана имени короля Фахда, чтобы увидеть, как Коран печатается и распространяется по всему миру.",
        },
      },
    ],
  },
];

export const getRulesSectionById = (id: string): RulesSection | undefined => {
  return RULES_SECTIONS.find((s) => s.id === id);
};

export const getNextRulesSection = (currentId: string): RulesSection | undefined => {
  const currentIndex = RULES_SECTIONS.findIndex((s) => s.id === currentId);
  if (currentIndex === -1 || currentIndex === RULES_SECTIONS.length - 1) {
    return undefined;
  }
  return RULES_SECTIONS[currentIndex + 1];
};

export const getPreviousRulesSection = (currentId: string): RulesSection | undefined => {
  const currentIndex = RULES_SECTIONS.findIndex((s) => s.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return RULES_SECTIONS[currentIndex - 1];
};
