import { Language } from "@/contexts/LanguageContext";

export interface RuleItem {
  text: Record<Language, string>;
}

export interface RulesSection {
  id: string;
  order: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
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
