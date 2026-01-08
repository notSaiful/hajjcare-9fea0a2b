import { Language } from "@/contexts/LanguageContext";

export interface RitualStep {
  step: number;
  text: Record<Language, string>;
}

export interface MistakeToAvoid {
  text: Record<Language, string>;
}

export interface SafetyTip {
  text: Record<Language, string>;
}

export interface HadithReference {
  text: Record<Language, string>;
  source: string;
}

export interface ImportantRuling {
  text: Record<Language, string>;
}

export interface Ritual {
  id: string;
  order: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  whatItIs: Record<Language, string>;
  steps: RitualStep[];
  mistakes: MistakeToAvoid[];
  duaGuidance: Record<Language, string>;
  safetyTips: SafetyTip[];
  hadith?: HadithReference;
  importantRulings?: ImportantRuling[];
}

export const MANASIK_RITUALS: Ritual[] = [
  {
    id: "ihram",
    order: 1,
    title: {
      en: "Ihram",
      ar: "الإحرام",
      ur: "احرام",
      hi: "इहराम",
      tr: "İhram",
      ru: "Ихрам",
    },
    description: {
      en: "Enter the sacred state of pilgrimage",
      ar: "الدخول في حالة الحج المقدسة",
      ur: "حج کی مقدس حالت میں داخل ہونا",
      hi: "तीर्थयात्रा की पवित्र अवस्था में प्रवेश करें",
      tr: "Hac ibadetinin kutsal haline girin",
      ru: "Войти в священное состояние паломничества",
    },
    whatItIs: {
      en: "Ihram is the sacred state you enter before beginning Hajj. You wear simple white garments (for men) or modest clothing (for women), make your intention for Hajj, and follow certain restrictions until the rituals are complete.",
      ar: "الإحرام هو الحالة المقدسة التي تدخلها قبل بدء الحج. ترتدي ملابس بيضاء بسيطة (للرجال) أو ملابس محتشمة (للنساء)، وتعقد نية الحج، وتتبع قيودًا معينة حتى تكتمل المناسك.",
      ur: "احرام وہ مقدس حالت ہے جس میں آپ حج شروع کرنے سے پہلے داخل ہوتے ہیں۔ آپ سادہ سفید کپڑے پہنتے ہیں (مردوں کے لیے) یا پردہ دار لباس (خواتین کے لیے)، حج کی نیت کرتے ہیں، اور مناسک مکمل ہونے تک کچھ پابندیوں پر عمل کرتے ہیں۔",
      hi: "इहराम वह पवित्र अवस्था है जिसमें आप हज शुरू करने से पहले प्रवेश करते हैं। आप साधारण सफेद कपड़े पहनते हैं (पुरुषों के लिए) या शालीन कपड़े (महिलाओं के लिए), हज की नीयत करते हैं, और अनुष्ठान पूरे होने तक कुछ प्रतिबंधों का पालन करते हैं।",
      tr: "İhram, hacca başlamadan önce girdiğiniz kutsal haldir. Basit beyaz giysiler giyersiniz (erkekler için) veya tesettür kıyafetleri (kadınlar için), hac niyetinizi belirlersiniz ve ibadetler tamamlanana kadar belirli kısıtlamalara uyarsınız.",
      ru: "Ихрам — это священное состояние, в которое вы входите перед началом хаджа. Вы надеваете простую белую одежду (для мужчин) или скромную одежду (для женщин), делаете намерение для хаджа и соблюдаете определённые ограничения до завершения ритуалов.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Perform ghusl (full body wash) or wudu before reaching the Miqat.",
          ar: "اغتسل غسلاً كاملاً أو توضأ قبل الوصول إلى الميقات.",
          ur: "میقات پہنچنے سے پہلے غسل یا وضو کریں۔",
          hi: "मीकात पहुंचने से पहले गुस्ल (पूरे शरीर को धोना) या वुज़ू करें।",
          tr: "Mikat'a ulaşmadan önce gusül veya abdest alın.",
          ru: "Совершите гусль (полное омовение тела) или вуду перед достижением Миката.",
        },
      },
      {
        step: 2,
        text: {
          en: "Men: Wear two unstitched white cloths. Women: Wear modest clothing that covers the body.",
          ar: "الرجال: ارتدِ قطعتين بيضاء غير مخيطتين. النساء: ارتدين ملابس محتشمة تغطي الجسم.",
          ur: "مرد: دو بغیر سلی ہوئی سفید چادریں پہنیں۔ خواتین: پردہ دار لباس پہنیں جو جسم کو ڈھانپے۔",
          hi: "पुरुष: दो बिना सिले सफेद कपड़े पहनें। महिलाएं: शरीर को ढकने वाले शालीन कपड़े पहनें।",
          tr: "Erkekler: İki dikişsiz beyaz bez giyin. Kadınlar: Vücudu örten tesettür giysisi giyin.",
          ru: "Мужчины: Наденьте два несшитых белых полотна. Женщины: Наденьте скромную одежду, покрывающую тело.",
        },
      },
      {
        step: 3,
        text: {
          en: "Make your intention (niyyah) for Hajj by saying: 'Labbayk Allahumma Hajjan'",
          ar: "اعقد نية الحج بقولك: 'لبيك اللهم حجاً'",
          ur: "حج کی نیت کریں اور کہیں: 'لبیک اللہم حجاً'",
          hi: "हज की नीयत करें और कहें: 'लब्बैक अल्लाहुम्मा हज्जन'",
          tr: "Hac niyetinizi şöyle belirtin: 'Lebbeyk Allahümme Haccen'",
          ru: "Сделайте намерение (нийят) для хаджа, сказав: «Лаббайк Аллахумма Хаджжан»",
        },
      },
      {
        step: 4,
        text: {
          en: "Recite the Talbiyah: 'Labbayk Allahumma Labbayk...' Continue reciting throughout your journey.",
          ar: "ردد التلبية: 'لبيك اللهم لبيك...' واستمر في ترديدها طوال رحلتك.",
          ur: "تلبیہ پڑھیں: 'لبیک اللہم لبیک...' اپنے سفر میں پڑھتے رہیں۔",
          hi: "तलबिया पढ़ें: 'लब्बैक अल्लाहुम्मा लब्बैक...' अपनी यात्रा में पढ़ते रहें।",
          tr: "Telbiye okuyun: 'Lebbeyk Allahümme Lebbeyk...' Yolculuğunuz boyunca okumaya devam edin.",
          ru: "Читайте Тальбию: «Лаббайк Аллахумма Лаббайк...» Продолжайте читать на протяжении всего путешествия.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not wear perfume or scented products after entering Ihram.",
          ar: "لا تستخدم العطور أو المنتجات المعطرة بعد الدخول في الإحرام.",
          ur: "احرام کے بعد خوشبو یا معطر مصنوعات استعمال نہ کریں۔",
          hi: "इहराम में प्रवेश के बाद इत्र या सुगंधित उत्पादों का उपयोग न करें।",
          tr: "İhrama girdikten sonra parfüm veya kokulu ürünler kullanmayın.",
          ru: "Не используйте духи или ароматизированные продукты после вхождения в Ихрам.",
        },
      },
      {
        text: {
          en: "Men: Do not cover your head with anything that touches it directly.",
          ar: "الرجال: لا تغطِ رأسك بشيء يلامسه مباشرة.",
          ur: "مرد: اپنا سر کسی ایسی چیز سے نہ ڈھانپیں جو براہ راست چھوئے۔",
          hi: "पुरुष: अपना सिर किसी ऐसी चीज़ से न ढकें जो सीधे छूती हो।",
          tr: "Erkekler: Başınızı doğrudan dokunan bir şeyle örtmeyin.",
          ru: "Мужчины: Не покрывайте голову ничем, что касается её напрямую.",
        },
      },
      {
        text: {
          en: "Do not cut nails or hair while in the state of Ihram.",
          ar: "لا تقص أظافرك أو شعرك أثناء الإحرام.",
          ur: "احرام کی حالت میں ناخن یا بال نہ کاٹیں۔",
          hi: "इहराम की अवस्था में नाखून या बाल न काटें।",
          tr: "İhram halindeyken tırnak veya saç kesmeyin.",
          ru: "Не стригите ногти или волосы в состоянии Ихрама.",
        },
      },
      {
        text: {
          en: "Avoid arguments, disputes, and any form of misconduct.",
          ar: "تجنب الجدال والنزاعات وأي شكل من أشكال سوء السلوك.",
          ur: "جھگڑوں، تنازعات اور کسی بھی قسم کی بدتمیزی سے بچیں۔",
          hi: "बहस, विवाद और किसी भी प्रकार के दुर्व्यवहार से बचें।",
          tr: "Tartışmalardan, anlaşmazlıklardan ve her türlü uygunsuz davranıştan kaçının.",
          ru: "Избегайте споров, разногласий и любых форм неподобающего поведения.",
        },
      },
    ],
    duaGuidance: {
      en: "Any sincere prayer is accepted. You may recite the Talbiyah frequently. If you know other prayers, you may recite them. Follow the guidance of your Hajj group if unsure.",
      ar: "أي دعاء صادق مقبول. يمكنك ترديد التلبية كثيرًا. إذا كنت تعرف أدعية أخرى، يمكنك تلاوتها. اتبع إرشادات مجموعة الحج إذا لم تكن متأكدًا.",
      ur: "کوئی بھی مخلصانہ دعا قبول ہے۔ آپ تلبیہ بار بار پڑھ سکتے ہیں۔ اگر آپ دوسری دعائیں جانتے ہیں تو پڑھ سکتے ہیں۔ اگر یقین نہ ہو تو اپنے حج گروپ کی رہنمائی پر عمل کریں۔",
      hi: "कोई भी सच्ची प्रार्थना स्वीकार की जाती है। आप तलबिया बार-बार पढ़ सकते हैं। यदि आप अन्य प्रार्थनाएं जानते हैं, तो उन्हें पढ़ सकते हैं। यदि अनिश्चित हों तो अपने हज समूह के मार्गदर्शन का पालन करें।",
      tr: "Her samimi dua kabul edilir. Telbiyeyi sıkça okuyabilirsiniz. Başka dualar biliyorsanız onları da okuyabilirsiniz. Emin değilseniz hac grubunuzun rehberliğini takip edin.",
      ru: "Любая искренняя молитва принимается. Вы можете часто читать Тальбию. Если вы знаете другие молитвы, вы можете их читать. Следуйте указаниям вашей группы хаджа, если не уверены.",
    },
    safetyTips: [
      {
        text: {
          en: "Stay hydrated. Carry water with you at all times.",
          ar: "حافظ على رطوبة جسمك. احمل الماء معك في جميع الأوقات.",
          ur: "پانی پیتے رہیں۔ ہمیشہ اپنے ساتھ پانی رکھیں۔",
          hi: "हाइड्रेटेड रहें। हमेशा अपने साथ पानी रखें।",
          tr: "Su içmeyi ihmal etmeyin. Her zaman yanınızda su bulundurun.",
          ru: "Пейте достаточно воды. Всегда носите воду с собой.",
        },
      },
      {
        text: {
          en: "Wear comfortable footwear. You will be walking long distances.",
          ar: "ارتدِ أحذية مريحة. ستمشي مسافات طويلة.",
          ur: "آرام دہ جوتے پہنیں۔ آپ کو لمبی دوری پیدل چلنا ہے۔",
          hi: "आरामदायक जूते पहनें। आप लंबी दूरी पैदल चलेंगे।",
          tr: "Rahat ayakkabı giyin. Uzun mesafeler yürüyeceksiniz.",
          ru: "Носите удобную обувь. Вы будете ходить на большие расстояния.",
        },
      },
      {
        text: {
          en: "Keep your ID and emergency contact information with you.",
          ar: "احتفظ بهويتك ومعلومات الاتصال في حالات الطوارئ معك.",
          ur: "اپنی شناختی دستاویزات اور ایمرجنسی رابطے کی معلومات اپنے پاس رکھیں۔",
          hi: "अपनी पहचान पत्र और आपातकालीन संपर्क जानकारी अपने पास रखें।",
          tr: "Kimliğinizi ve acil durum iletişim bilgilerinizi yanınızda bulundurun.",
          ru: "Держите при себе удостоверение личности и контактную информацию для экстренных случаев.",
        },
      },
    ],
    hadith: {
      text: {
        en: "The Prophet (peace be upon him) said: 'The reward of Hajj Mabrur (accepted Hajj) is nothing but Paradise.'",
        ar: "قال النبي ﷺ: 'الحج المبرور ليس له جزاء إلا الجنة'",
        ur: "نبی ﷺ نے فرمایا: 'حج مبرور (قبول شدہ حج) کا اجر صرف جنت ہے۔'",
        hi: "नबी ﷺ ने फरमाया: 'हज मबरूर (स्वीकृत हज) का इनाम सिर्फ जन्नत है।'",
        tr: "Peygamber ﷺ buyurdu: 'Makbul haccın mükâfatı cennettir.'",
        ru: "Пророк ﷺ сказал: «Награда за принятый хадж — только Рай.»",
      },
      source: "Sahih al-Bukhari & Muslim",
    },
    importantRulings: [
      {
        text: {
          en: "Ihram must be entered at or before the Miqat. Do not pass the Miqat without entering Ihram.",
          ar: "يجب الإحرام عند الميقات أو قبله. لا تتجاوز الميقات دون الإحرام.",
          ur: "احرام میقات پر یا اس سے پہلے باندھنا ضروری ہے۔ بغیر احرام کے میقات نہ گزریں۔",
          hi: "इहराम मीकात पर या उससे पहले बांधना ज़रूरी है। बिना इहराम के मीकात न गुज़रें।",
          tr: "İhram Mikat'ta veya öncesinde bağlanmalıdır. İhramsız Mikat'ı geçmeyin.",
          ru: "Ихрам должен быть принят на Микате или до него. Не проходите Микат без Ихрама.",
        },
      },
      {
        text: {
          en: "Restrictions during Ihram include: no perfume, no cutting hair/nails, no hunting, no marital relations. Please follow your Hajj group's guidance for details.",
          ar: "محظورات الإحرام تشمل: لا عطر، لا قص شعر/أظافر، لا صيد، لا علاقات زوجية. يرجى اتباع إرشادات مجموعة الحج للتفاصيل.",
          ur: "احرام کی پابندیوں میں شامل ہیں: کوئی خوشبو نہیں، بال/ناخن نہ کاٹیں، شکار نہیں، ازدواجی تعلقات نہیں۔ تفصیلات کے لیے اپنے حج گروپ کی رہنمائی پر عمل کریں۔",
          hi: "इहराम की पाबंदियों में शामिल हैं: कोई खुशबू नहीं, बाल/नाखून न काटें, शिकार नहीं, वैवाहिक संबंध नहीं। विवरण के लिए अपने हज समूह के मार्गदर्शन का पालन करें।",
          tr: "İhram yasakları şunlardır: parfüm yok, saç/tırnak kesme yok, av yok, evlilik ilişkisi yok. Ayrıntılar için hac grubunuzun rehberliğini takip edin.",
          ru: "Ограничения во время Ихрама: нельзя использовать парфюм, стричь волосы/ногти, охотиться, иметь супружеские отношения. Следуйте указаниям группы хаджа для деталей.",
        },
      },
    ],
  },
  {
    id: "tawaf",
    order: 2,
    title: {
      en: "Tawaf",
      ar: "الطواف",
      ur: "طواف",
      hi: "तवाफ",
      tr: "Tavaf",
      ru: "Таваф",
    },
    description: {
      en: "Circle the Kaaba seven times",
      ar: "الطواف حول الكعبة سبع مرات",
      ur: "کعبہ کے گرد سات چکر لگانا",
      hi: "काबा की सात बार परिक्रमा करें",
      tr: "Kâbe'nin etrafında yedi kez dönün",
      ru: "Обойти Каабу семь раз",
    },
    whatItIs: {
      en: "Tawaf is the act of walking around the Kaaba seven times in an anti-clockwise direction. It is a central ritual of Hajj that symbolizes the unity of believers in worshipping one God.",
      ar: "الطواف هو المشي حول الكعبة سبع مرات عكس اتجاه عقارب الساعة. وهو ركن أساسي من أركان الحج يرمز إلى وحدة المؤمنين في عبادة الله الواحد.",
      ur: "طواف کعبہ کے گرد گھڑی کی مخالف سمت میں سات بار چلنا ہے۔ یہ حج کا ایک مرکزی رکن ہے جو ایک خدا کی عبادت میں مومنین کے اتحاد کی علامت ہے۔",
      hi: "तवाफ काबा के चारों ओर घड़ी की उलटी दिशा में सात बार चलना है। यह हज का एक केंद्रीय अनुष्ठान है जो एक ईश्वर की पूजा में विश्वासियों की एकता का प्रतीक है।",
      tr: "Tavaf, Kâbe'nin etrafında saat yönünün tersine yedi kez yürümektir. Haccın temel ibadetlerinden biridir ve tek Allah'a ibadette müminlerin birliğini simgeler.",
      ru: "Таваф — это хождение вокруг Каабы семь раз против часовой стрелки. Это центральный ритуал хаджа, символизирующий единство верующих в поклонении одному Богу.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Begin at the Black Stone (Hajr al-Aswad). Face it and raise your right hand towards it, saying 'Bismillah, Allahu Akbar'.",
          ar: "ابدأ من الحجر الأسود. واجهه وارفع يدك اليمنى نحوه قائلاً 'بسم الله، الله أكبر'.",
          ur: "حجر اسود سے شروع کریں۔ اس کی طرف رخ کریں اور اپنا دایاں ہاتھ اس کی طرف اٹھائیں، کہیں 'بسم اللہ، اللہ اکبر'۔",
          hi: "हजर-ए-अस्वद (काला पत्थर) से शुरू करें। इसकी ओर मुख करें और अपना दाहिना हाथ इसकी ओर उठाएं, कहें 'बिस्मिल्लाह, अल्लाहु अकबर'।",
          tr: "Hacer-ül Esved'den (Siyah Taş) başlayın. Ona dönün ve sağ elinizi ona doğru kaldırarak 'Bismillah, Allahu Ekber' deyin.",
          ru: "Начните у Чёрного камня (Хаджар аль-Асвад). Повернитесь к нему лицом и поднимите правую руку к нему, говоря «Бисмиллях, Аллаху Акбар».",
        },
      },
      {
        step: 2,
        text: {
          en: "Walk around the Kaaba keeping it on your left side. Complete seven full rounds.",
          ar: "امشِ حول الكعبة مع إبقائها على يسارك. أكمل سبع جولات كاملة.",
          ur: "کعبہ کو اپنی بائیں طرف رکھتے ہوئے اس کے گرد چلیں۔ سات مکمل چکر لگائیں۔",
          hi: "काबा को अपनी बाईं ओर रखते हुए उसके चारों ओर चलें। सात पूर्ण चक्कर पूरे करें।",
          tr: "Kâbe sol tarafınızda kalacak şekilde etrafında yürüyün. Yedi tam tur tamamlayın.",
          ru: "Идите вокруг Каабы, держа её слева от себя. Совершите семь полных кругов.",
        },
      },
      {
        step: 3,
        text: {
          en: "Each time you pass the Black Stone, face it briefly, raise your hand towards it, and say 'Allahu Akbar'.",
          ar: "في كل مرة تمر بالحجر الأسود، واجهه لحظة، ارفع يدك نحوه، وقل 'الله أكبر'.",
          ur: "ہر بار جب آپ حجر اسود کے پاس سے گزریں، اس کی طرف تھوڑی دیر کے لیے رخ کریں، اپنا ہاتھ اس کی طرف اٹھائیں، اور کہیں 'اللہ اکبر'۔",
          hi: "हर बार जब आप काले पत्थर के पास से गुज़रें, थोड़ी देर के लिए उसकी ओर मुख करें, अपना हाथ उसकी ओर उठाएं, और कहें 'अल्लाहु अकबर'।",
          tr: "Her Hacer-ül Esved'in önünden geçtiğinizde, kısaca ona dönün, elinizi ona doğru kaldırın ve 'Allahu Ekber' deyin.",
          ru: "Каждый раз, проходя мимо Чёрного камня, кратко повернитесь к нему, поднимите руку к нему и скажите «Аллаху Акбар».",
        },
      },
      {
        step: 4,
        text: {
          en: "After completing seven rounds, pray two rak'ahs behind Maqam Ibrahim (Station of Ibrahim) if possible, or anywhere in the mosque.",
          ar: "بعد إكمال سبع جولات، صلِّ ركعتين خلف مقام إبراهيم إن أمكن، أو في أي مكان في المسجد.",
          ur: "سات چکر مکمل کرنے کے بعد، مقام ابراہیم کے پیچھے دو رکعت نماز پڑھیں اگر ممکن ہو، یا مسجد میں کہیں بھی۔",
          hi: "सात चक्कर पूरे करने के बाद, मक़ाम इब्राहीम के पीछे दो रकात नमाज़ पढ़ें यदि संभव हो, या मस्जिद में कहीं भी।",
          tr: "Yedi turu tamamladıktan sonra, mümkünse Makam-ı İbrahim'in arkasında, değilse mescidin herhangi bir yerinde iki rekât namaz kılın.",
          ru: "После завершения семи кругов совершите два ракаата позади Макама Ибрахима (Стоянка Ибрахима), если возможно, или в любом месте мечети.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not push or shove others. Stay calm and move with the crowd.",
          ar: "لا تدفع الآخرين. ابقَ هادئاً وتحرك مع الجموع.",
          ur: "دوسروں کو دھکا نہ دیں۔ پرسکون رہیں اور بھیڑ کے ساتھ چلیں۔",
          hi: "दूसरों को धक्का न दें। शांत रहें और भीड़ के साथ चलें।",
          tr: "Başkalarını itmeyin veya kakıştırmayın. Sakin olun ve kalabalıkla birlikte hareket edin.",
          ru: "Не толкайте других. Сохраняйте спокойствие и двигайтесь вместе с толпой.",
        },
      },
      {
        text: {
          en: "Do not stop in the middle of the crowd. Keep moving at a steady pace.",
          ar: "لا تتوقف في منتصف الجموع. استمر في المشي بوتيرة ثابتة.",
          ur: "بھیڑ کے بیچ میں نہ رکیں۔ مستقل رفتار سے چلتے رہیں۔",
          hi: "भीड़ के बीच में न रुकें। एक स्थिर गति से चलते रहें।",
          tr: "Kalabalığın ortasında durmayın. Sabit bir tempoda yürümeye devam edin.",
          ru: "Не останавливайтесь посреди толпы. Продолжайте двигаться в стабильном темпе.",
        },
      },
      {
        text: {
          en: "Do not argue or raise your voice during Tawaf.",
          ar: "لا تجادل أو ترفع صوتك أثناء الطواف.",
          ur: "طواف کے دوران بحث نہ کریں یا آواز بلند نہ کریں۔",
          hi: "तवाफ के दौरान बहस न करें या आवाज़ न उठाएं।",
          tr: "Tavaf sırasında tartışmayın veya sesinizi yükseltmeyin.",
          ru: "Не спорьте и не повышайте голос во время Тавафа.",
        },
      },
      {
        text: {
          en: "Ensure you have wudu (ablution) before starting Tawaf.",
          ar: "تأكد من أنك على وضوء قبل بدء الطواف.",
          ur: "طواف شروع کرنے سے پہلے وضو یقینی بنائیں۔",
          hi: "तवाफ शुरू करने से पहले सुनिश्चित करें कि आपका वुज़ू है।",
          tr: "Tavafa başlamadan önce abdestli olduğunuzdan emin olun.",
          ru: "Убедитесь, что у вас есть вуду (омовение) перед началом Тавафа.",
        },
      },
    ],
    duaGuidance: {
      en: "There is no specific dua required during Tawaf. You may make any sincere supplication in any language. Many pilgrims recite 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar' (Our Lord, give us good in this world and in the Hereafter, and protect us from the punishment of the Fire).",
      ar: "لا يوجد دعاء محدد مطلوب أثناء الطواف. يمكنك الدعاء بأي دعاء صادق بأي لغة. يردد كثير من الحجاج: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار'.",
      ur: "طواف کے دوران کوئی مخصوص دعا ضروری نہیں۔ آپ کسی بھی زبان میں کوئی بھی مخلصانہ دعا مانگ سکتے ہیں۔ بہت سے حجاج یہ پڑھتے ہیں: 'ربنا آتنا فی الدنیا حسنۃ وفی الآخرۃ حسنۃ وقنا عذاب النار'۔",
      hi: "तवाफ के दौरान कोई विशेष दुआ आवश्यक नहीं है। आप किसी भी भाषा में कोई भी सच्ची प्रार्थना कर सकते हैं। कई तीर्थयात्री यह पढ़ते हैं: 'रब्बना आतिना फिद्दुनिया हसनतन व फिल आखिरति हसनतन व क़िना अज़ाबन्नार'।",
      tr: "Tavaf sırasında belirli bir dua gerekli değildir. Herhangi bir dilde samimi dua edebilirsiniz. Birçok hacı şunu okur: 'Rabbena atina fid-dünya haseneten ve fil-ahireti haseneten ve kina azaben-nar'.",
      ru: "Во время Тавафа не требуется особая молитва. Вы можете произносить любую искреннюю мольбу на любом языке. Многие паломники читают: «Раббана атина фид-дунья хасанатан ва филь-ахирати хасанатан ва кина 'азабан-нар».",
    },
    safetyTips: [
      {
        text: {
          en: "If you feel unwell, move to the outer areas where there is less crowd.",
          ar: "إذا شعرت بتوعك، انتقل إلى المناطق الخارجية حيث الزحام أقل.",
          ur: "اگر آپ کو تکلیف ہو، باہری علاقوں میں چلے جائیں جہاں بھیڑ کم ہے۔",
          hi: "यदि आप अस्वस्थ महसूस करें, तो बाहरी क्षेत्रों में चले जाएं जहां भीड़ कम है।",
          tr: "Kendinizi iyi hissetmezseniz, kalabalığın daha az olduğu dış alanlara geçin.",
          ru: "Если вам плохо, переместитесь во внешние зоны, где меньше народу.",
        },
      },
      {
        text: {
          en: "Elderly pilgrims: Consider performing Tawaf on upper floors or during less crowded times.",
          ar: "للحجاج كبار السن: فكر في أداء الطواف في الطوابق العلوية أو في أوقات أقل ازدحاماً.",
          ur: "بزرگ حجاج: اوپری منزلوں پر یا کم بھیڑ والے اوقات میں طواف کرنے پر غور کریں۔",
          hi: "बुजुर्ग तीर्थयात्री: ऊपरी मंज़िलों पर या कम भीड़ वाले समय में तवाफ करने पर विचार करें।",
          tr: "Yaşlı hacılar: Üst katlarda veya daha az kalabalık zamanlarda tavaf yapmayı düşünün.",
          ru: "Пожилые паломники: Рассмотрите возможность совершения Тавафа на верхних этажах или в менее многолюдное время.",
        },
      },
      {
        text: {
          en: "Hold hands with your group members if you feel unsafe in the crowd.",
          ar: "امسك بأيدي أفراد مجموعتك إذا شعرت بعدم الأمان في الزحام.",
          ur: "اگر بھیڑ میں غیر محفوظ محسوس کریں تو اپنے گروپ کے ساتھیوں کے ہاتھ پکڑیں۔",
          hi: "अगर भीड़ में असुरक्षित महसूस करें तो अपने समूह के सदस्यों के हाथ पकड़ें।",
          tr: "Kalabalıkta güvende hissetmezseniz grup üyelerinizin elini tutun.",
          ru: "Держите за руки членов вашей группы, если чувствуете себя небезопасно в толпе.",
        },
      },
    ],
  },
  {
    id: "sai",
    order: 3,
    title: {
      en: "Sa'i",
      ar: "السعي",
      ur: "سعی",
      hi: "सई",
      tr: "Sa'y",
      ru: "Саи",
    },
    description: {
      en: "Walk between Safa and Marwa seven times",
      ar: "السعي بين الصفا والمروة سبع مرات",
      ur: "صفا اور مروہ کے درمیان سات بار چلنا",
      hi: "सफा और मरवा के बीच सात बार चलें",
      tr: "Safa ile Merve arasında yedi kez yürüyün",
      ru: "Пройти между Сафа и Марва семь раз",
    },
    whatItIs: {
      en: "Sa'i commemorates Hajar's (wife of Prophet Ibrahim) search for water for her son Ismail. It involves walking seven times between the hills of Safa and Marwa, located near the Kaaba.",
      ar: "السعي يخلد ذكرى بحث هاجر (زوجة النبي إبراهيم) عن الماء لابنها إسماعيل. ويتضمن المشي سبع مرات بين تلتي الصفا والمروة القريبتين من الكعبة.",
      ur: "سعی حضرت ہاجرہ (حضرت ابراہیم علیہ السلام کی بیوی) کی اپنے بیٹے اسماعیل کے لیے پانی کی تلاش کی یاد ہے۔ اس میں صفا اور مروہ کی پہاڑیوں کے درمیان سات بار چلنا شامل ہے جو کعبہ کے قریب ہیں۔",
      hi: "सई हाजरा (नबी इब्राहीम की पत्नी) द्वारा अपने बेटे इस्माइल के लिए पानी की खोज की याद दिलाती है। इसमें काबा के पास स्थित सफा और मरवा की पहाड़ियों के बीच सात बार चलना शामिल है।",
      tr: "Sa'y, Hz. Hacer'in (Hz. İbrahim'in eşi) oğlu İsmail için su aramasını anar. Kâbe'nin yakınındaki Safa ve Merve tepeleri arasında yedi kez yürümeyi içerir.",
      ru: "Саи напоминает о поиске воды Хаджар (женой пророка Ибрахима) для своего сына Исмаила. Это хождение семь раз между холмами Сафа и Марва, расположенными возле Каабы.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Start at Safa hill. Face the Kaaba and raise your hands in supplication.",
          ar: "ابدأ من جبل الصفا. واجه الكعبة وارفع يديك بالدعاء.",
          ur: "صفا پہاڑی سے شروع کریں۔ کعبہ کی طرف رخ کریں اور دعا کے لیے ہاتھ اٹھائیں۔",
          hi: "सफा पहाड़ी से शुरू करें। काबा की ओर मुख करें और दुआ के लिए हाथ उठाएं।",
          tr: "Safa tepesinden başlayın. Kâbe'ye dönün ve dua için ellerinizi kaldırın.",
          ru: "Начните с холма Сафа. Повернитесь лицом к Каабе и поднимите руки в мольбе.",
        },
      },
      {
        step: 2,
        text: {
          en: "Walk towards Marwa. Men may jog lightly in the green-lit area; women walk normally.",
          ar: "امشِ نحو المروة. يمكن للرجال الهرولة خفيفاً في المنطقة المضاءة بالأخضر؛ النساء يمشين بشكل عادي.",
          ur: "مروہ کی طرف چلیں۔ مرد سبز روشنی والے علاقے میں ہلکے سے دوڑ سکتے ہیں؛ خواتین عام طور پر چلیں۔",
          hi: "मरवा की ओर चलें। पुरुष हरी रोशनी वाले क्षेत्र में हल्के से दौड़ सकते हैं; महिलाएं सामान्य रूप से चलें।",
          tr: "Merve'ye doğru yürüyün. Erkekler yeşil ışıklı alanda hafifçe koşabilir; kadınlar normal yürür.",
          ru: "Идите к Марве. Мужчины могут легко бежать в зоне с зелёным освещением; женщины идут обычным шагом.",
        },
      },
      {
        step: 3,
        text: {
          en: "Upon reaching Marwa, face the Kaaba and make supplication. This completes one lap.",
          ar: "عند الوصول إلى المروة، واجه الكعبة وادعُ. هذا يكمل شوطاً واحداً.",
          ur: "مروہ پہنچ کر کعبہ کی طرف رخ کریں اور دعا کریں۔ یہ ایک چکر مکمل ہوا۔",
          hi: "मरवा पहुंचने पर काबा की ओर मुख करें और दुआ करें। यह एक चक्कर पूरा करता है।",
          tr: "Merve'ye ulaştığınızda Kâbe'ye dönün ve dua edin. Bu bir şavtı tamamlar.",
          ru: "Достигнув Марвы, повернитесь лицом к Каабе и сделайте мольбу. Это завершает один круг.",
        },
      },
      {
        step: 4,
        text: {
          en: "Return to Safa (this is the second lap). Continue until you complete seven laps, ending at Marwa.",
          ar: "ارجع إلى الصفا (هذا هو الشوط الثاني). استمر حتى تكمل سبعة أشواط، منتهياً بالمروة.",
          ur: "صفا واپس جائیں (یہ دوسرا چکر ہے)۔ جب تک سات چکر مکمل نہ ہوں جاری رکھیں، مروہ پر ختم ہوں۔",
          hi: "सफा वापस जाएं (यह दूसरा चक्कर है)। सात चक्कर पूरे होने तक जारी रखें, मरवा पर समाप्त करें।",
          tr: "Safa'ya geri dönün (bu ikinci şavttır). Yedi şavt tamamlanana kadar devam edin, Merve'de bitirin.",
          ru: "Вернитесь к Сафе (это второй круг). Продолжайте, пока не завершите семь кругов, заканчивая на Марве.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not start from Marwa. Always begin at Safa.",
          ar: "لا تبدأ من المروة. ابدأ دائماً من الصفا.",
          ur: "مروہ سے شروع نہ کریں۔ ہمیشہ صفا سے شروع کریں۔",
          hi: "मरवा से शुरू न करें। हमेशा सफा से शुरू करें।",
          tr: "Merve'den başlamayın. Her zaman Safa'dan başlayın.",
          ru: "Не начинайте с Марвы. Всегда начинайте с Сафы.",
        },
      },
      {
        text: {
          en: "Do not count Safa to Marwa and back as one round. Each direction is one lap.",
          ar: "لا تحسب من الصفا إلى المروة والعودة كشوط واحد. كل اتجاه هو شوط.",
          ur: "صفا سے مروہ اور واپس کو ایک چکر نہ گنیں۔ ہر سمت ایک چکر ہے۔",
          hi: "सफा से मरवा और वापस को एक चक्कर न गिनें। हर दिशा एक चक्कर है।",
          tr: "Safa'dan Merve'ye ve geri dönüşü bir şavt olarak saymayın. Her yön bir şavttır.",
          ru: "Не считайте путь от Сафы к Марве и обратно как один круг. Каждое направление — это один круг.",
        },
      },
      {
        text: {
          en: "Do not run in crowded areas. Walk steadily to avoid accidents.",
          ar: "لا تركض في المناطق المزدحمة. امشِ بثبات لتجنب الحوادث.",
          ur: "بھیڑ والے علاقوں میں نہ دوڑیں۔ حادثات سے بچنے کے لیے مستقل چلیں۔",
          hi: "भीड़ वाले क्षेत्रों में न दौड़ें। दुर्घटनाओं से बचने के लिए स्थिर गति से चलें।",
          tr: "Kalabalık alanlarda koşmayın. Kazaları önlemek için sabit adımlarla yürüyün.",
          ru: "Не бегите в многолюдных местах. Идите ровным шагом, чтобы избежать несчастных случаев.",
        },
      },
    ],
    duaGuidance: {
      en: "Make any sincere supplication during Sa'i. At Safa and Marwa, you may say 'Allahu Akbar' three times and make personal prayers. Between the hills, continue with remembrance and prayers in any language.",
      ar: "ادعُ بأي دعاء صادق أثناء السعي. على الصفا والمروة، يمكنك قول 'الله أكبر' ثلاث مرات والدعاء بأدعية شخصية. بين التلتين، استمر بالذكر والدعاء بأي لغة.",
      ur: "سعی کے دوران کوئی بھی مخلصانہ دعا کریں۔ صفا اور مروہ پر 'اللہ اکبر' تین بار کہیں اور ذاتی دعائیں کریں۔ پہاڑیوں کے درمیان کسی بھی زبان میں ذکر اور دعا جاری رکھیں۔",
      hi: "सई के दौरान कोई भी सच्ची प्रार्थना करें। सफा और मरवा पर 'अल्लाहु अकबर' तीन बार कहें और व्यक्तिगत प्रार्थना करें। पहाड़ियों के बीच किसी भी भाषा में ज़िक्र और प्रार्थना जारी रखें।",
      tr: "Sa'y sırasında samimi dualar edin. Safa ve Merve'de üç kez 'Allahu Ekber' diyebilir ve kişisel dualarınızı edebilirsiniz. Tepeler arasında, herhangi bir dilde zikir ve dualara devam edin.",
      ru: "Делайте любую искреннюю мольбу во время Саи. На Сафе и Марве вы можете сказать «Аллаху Акбар» три раза и сделать личные молитвы. Между холмами продолжайте поминание и молитвы на любом языке.",
    },
    safetyTips: [
      {
        text: {
          en: "The path is air-conditioned. Take your time and do not rush.",
          ar: "المسار مكيف. خذ وقتك ولا تتعجل.",
          ur: "راستہ ایئر کنڈیشنڈ ہے۔ اپنا وقت لیں اور جلدی نہ کریں۔",
          hi: "रास्ता एयर कंडीशंड है। अपना समय लें और जल्दबाजी न करें।",
          tr: "Yol klimalıdır. Acelenizi almayın.",
          ru: "Путь кондиционирован. Не торопитесь.",
        },
      },
      {
        text: {
          en: "Wheelchairs are available for those who cannot walk. Request assistance if needed.",
          ar: "تتوفر كراسي متحركة لمن لا يستطيعون المشي. اطلب المساعدة إذا لزم الأمر.",
          ur: "جو چل نہیں سکتے ان کے لیے وہیل چیئرز دستیاب ہیں۔ ضرورت ہو تو مدد طلب کریں۔",
          hi: "जो चल नहीं सकते उनके लिए व्हीलचेयर उपलब्ध हैं। ज़रूरत हो तो सहायता मांगें।",
          tr: "Yürüyemeyenler için tekerlekli sandalyeler mevcuttur. Gerekirse yardım isteyin.",
          ru: "Для тех, кто не может ходить, доступны инвалидные коляски. При необходимости обратитесь за помощью.",
        },
      },
      {
        text: {
          en: "Stay with your group. The area can get very crowded.",
          ar: "ابقَ مع مجموعتك. المنطقة يمكن أن تصبح مزدحمة جداً.",
          ur: "اپنے گروپ کے ساتھ رہیں۔ علاقہ بہت بھیڑ والا ہو سکتا ہے۔",
          hi: "अपने समूह के साथ रहें। क्षेत्र बहुत भीड़भाड़ वाला हो सकता है।",
          tr: "Grubunuzla kalın. Alan çok kalabalık olabilir.",
          ru: "Оставайтесь с группой. Место может быть очень многолюдным.",
        },
      },
    ],
  },
  {
    id: "mina",
    order: 4,
    title: {
      en: "Day in Mina",
      ar: "يوم في منى",
      ur: "منیٰ میں دن",
      hi: "मिना में दिन",
      tr: "Mina'da Gün",
      ru: "День в Мине",
    },
    description: {
      en: "Stay at Mina on the 8th of Dhul Hijjah",
      ar: "الإقامة في منى في الثامن من ذي الحجة",
      ur: "8 ذی الحجہ کو منیٰ میں قیام",
      hi: "8 ज़िल हिज्जा को मिना में रहें",
      tr: "Zilhicce'nin 8'inde Mina'da kalın",
      ru: "Пребывание в Мине 8-го Зуль-Хиджа",
    },
    whatItIs: {
      en: "Mina is a tent city where pilgrims stay before and after the Day of Arafat. On the 8th of Dhul Hijjah (Day of Tarwiyah), you travel to Mina and spend the day and night there, preparing for Arafat.",
      ar: "منى هي مدينة الخيام حيث يقيم الحجاج قبل وبعد يوم عرفة. في الثامن من ذي الحجة (يوم التروية)، تسافر إلى منى وتقضي اليوم والليلة هناك، استعداداً لعرفة.",
      ur: "منیٰ خیموں کا شہر ہے جہاں حجاج عرفہ سے پہلے اور بعد میں قیام کرتے ہیں۔ 8 ذی الحجہ (یوم الترویہ) کو آپ منیٰ جاتے ہیں اور عرفہ کی تیاری میں وہاں دن اور رات گزارتے ہیں۔",
      hi: "मिना एक टेंट सिटी है जहां तीर्थयात्री अरफात के दिन से पहले और बाद में रहते हैं। 8 ज़िल हिज्जा (तरवियह का दिन) को आप मिना जाते हैं और अरफात की तैयारी में वहां दिन और रात बिताते हैं।",
      tr: "Mina, hacıların Arafat gününden önce ve sonra kaldığı çadır kentidir. Zilhicce'nin 8'inde (Terviye Günü) Mina'ya gider ve Arafat'a hazırlık için gece gündüz orada kalırsınız.",
      ru: "Мина — это палаточный город, где паломники останавливаются до и после Дня Арафата. 8-го Зуль-Хиджа (День Тарвия) вы отправляетесь в Мину и проводите там день и ночь, готовясь к Арафату.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Travel to Mina on the 8th of Dhul Hijjah. Follow your group's instructions.",
          ar: "انتقل إلى منى في الثامن من ذي الحجة. اتبع تعليمات مجموعتك.",
          ur: "8 ذی الحجہ کو منیٰ جائیں۔ اپنے گروپ کی ہدایات پر عمل کریں۔",
          hi: "8 ज़िल हिज्जा को मिना की यात्रा करें। अपने समूह के निर्देशों का पालन करें।",
          tr: "Zilhicce'nin 8'inde Mina'ya gidin. Grubunuzun talimatlarını takip edin.",
          ru: "Отправляйтесь в Мину 8-го Зуль-Хиджа. Следуйте указаниям своей группы.",
        },
      },
      {
        step: 2,
        text: {
          en: "Settle into your assigned tent. Note your tent number and location.",
          ar: "استقر في خيمتك المخصصة. دوّن رقم خيمتك وموقعها.",
          ur: "اپنے مختص خیمے میں قیام کریں۔ اپنے خیمے کا نمبر اور مقام نوٹ کریں۔",
          hi: "अपने आवंटित टेंट में बस जाएं। अपने टेंट का नंबर और स्थान नोट करें।",
          tr: "Size tahsis edilen çadıra yerleşin. Çadır numaranızı ve konumunu not edin.",
          ru: "Устройтесь в своей назначенной палатке. Запишите номер и местоположение палатки.",
        },
      },
      {
        step: 3,
        text: {
          en: "Pray Dhuhr, Asr, Maghrib, Isha (shortened) and Fajr at Mina.",
          ar: "صلِّ الظهر والعصر والمغرب والعشاء (قصراً) والفجر في منى.",
          ur: "منیٰ میں ظہر، عصر، مغرب، عشاء (قصر کے ساتھ) اور فجر پڑھیں۔",
          hi: "मिना में ज़ुहर, असर, मग़रिब, इशा (छोटी) और फज्र पढ़ें।",
          tr: "Mina'da Öğle, İkindi, Akşam, Yatsı (kısaltılmış) ve Sabah namazlarını kılın.",
          ru: "Совершите Зухр, Аср, Магриб, Иша (сокращённо) и Фаджр в Мине.",
        },
      },
      {
        step: 4,
        text: {
          en: "Spend the night in Mina. Rest and prepare for Arafat the next day.",
          ar: "قضِ الليلة في منى. استرح واستعد لعرفة في اليوم التالي.",
          ur: "منیٰ میں رات گزاریں۔ آرام کریں اور اگلے دن عرفہ کے لیے تیار ہوں۔",
          hi: "मिना में रात बिताएं। आराम करें और अगले दिन अरफात के लिए तैयार हों।",
          tr: "Geceyi Mina'da geçirin. Dinlenin ve ertesi gün Arafat için hazırlanın.",
          ru: "Проведите ночь в Мине. Отдохните и подготовьтесь к Арафату на следующий день.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not leave Mina without knowing your tent location. You may get lost.",
          ar: "لا تغادر منى دون معرفة موقع خيمتك. قد تضل.",
          ur: "اپنے خیمے کا مقام جانے بغیر منیٰ نہ چھوڑیں۔ آپ گم ہو سکتے ہیں۔",
          hi: "अपने टेंट का स्थान जाने बिना मिना न छोड़ें। आप खो सकते हैं।",
          tr: "Çadır konumunuzu bilmeden Mina'dan ayrılmayın. Kaybolabilirsiniz.",
          ru: "Не покидайте Мину, не зная местоположения своей палатки. Вы можете потеряться.",
        },
      },
      {
        text: {
          en: "Do not wander far from your camp. Stay within a safe distance.",
          ar: "لا تبتعد كثيراً عن مخيمك. ابقَ على مسافة آمنة.",
          ur: "اپنے کیمپ سے زیادہ دور نہ جائیں۔ محفوظ فاصلے پر رہیں۔",
          hi: "अपने कैंप से बहुत दूर न जाएं। सुरक्षित दूरी पर रहें।",
          tr: "Kampınızdan çok uzaklaşmayın. Güvenli mesafede kalın.",
          ru: "Не уходите далеко от лагеря. Оставайтесь на безопасном расстоянии.",
        },
      },
      {
        text: {
          en: "Do not skip prayers. Use this time for worship and reflection.",
          ar: "لا تفوّت الصلوات. استخدم هذا الوقت للعبادة والتأمل.",
          ur: "نمازیں نہ چھوڑیں۔ اس وقت کو عبادت اور غور و فکر کے لیے استعمال کریں۔",
          hi: "नमाज़ न छोड़ें। इस समय को इबादत और चिंतन के लिए उपयोग करें।",
          tr: "Namazları atlamayın. Bu zamanı ibadet ve tefekkür için kullanın.",
          ru: "Не пропускайте молитвы. Используйте это время для поклонения и размышления.",
        },
      },
    ],
    duaGuidance: {
      en: "Use this peaceful time for personal prayers and reflection. There is no specific dua required. Ask Allah for whatever is in your heart.",
      ar: "استخدم هذا الوقت الهادئ للدعاء الشخصي والتأمل. لا يوجد دعاء محدد مطلوب. اسأل الله ما في قلبك.",
      ur: "اس پرسکون وقت کو ذاتی دعاؤں اور غور و فکر کے لیے استعمال کریں۔ کوئی مخصوص دعا ضروری نہیں۔ اللہ سے جو دل میں ہے مانگیں۔",
      hi: "इस शांत समय को व्यक्तिगत प्रार्थनाओं और चिंतन के लिए उपयोग करें। कोई विशेष दुआ आवश्यक नहीं है। अल्लाह से जो दिल में है मांगें।",
      tr: "Bu huzurlu zamanı kişisel dualar ve tefekkür için kullanın. Belirli bir dua gerekli değildir. Kalbinizde ne varsa Allah'tan isteyin.",
      ru: "Используйте это мирное время для личных молитв и размышлений. Никакой особой молитвы не требуется. Просите Аллаха о том, что в вашем сердце.",
    },
    safetyTips: [
      {
        text: {
          en: "Mina is very hot. Stay hydrated and rest during the hottest hours.",
          ar: "منى حارة جداً. حافظ على رطوبة جسمك واسترح في أشد الساعات حرارة.",
          ur: "منیٰ بہت گرم ہے۔ پانی پیتے رہیں اور سب سے گرم گھنٹوں میں آرام کریں۔",
          hi: "मिना बहुत गर्म है। हाइड्रेटेड रहें और सबसे गर्म घंटों में आराम करें।",
          tr: "Mina çok sıcaktır. Su içmeye dikkat edin ve en sıcak saatlerde dinlenin.",
          ru: "В Мине очень жарко. Пейте много воды и отдыхайте в самые жаркие часы.",
        },
      },
      {
        text: {
          en: "Keep your identification and group information card with you at all times.",
          ar: "احتفظ بهويتك وبطاقة معلومات المجموعة معك في جميع الأوقات.",
          ur: "اپنی شناخت اور گروپ معلوماتی کارڈ ہمیشہ اپنے پاس رکھیں۔",
          hi: "अपना पहचान पत्र और समूह जानकारी कार्ड हमेशा अपने पास रखें।",
          tr: "Kimliğinizi ve grup bilgi kartınızı her zaman yanınızda bulundurun.",
          ru: "Всегда носите при себе удостоверение личности и карточку группы.",
        },
      },
      {
        text: {
          en: "If you feel unwell, inform your group leader immediately.",
          ar: "إذا شعرت بتوعك، أخبر قائد مجموعتك فوراً.",
          ur: "اگر تبیت ہو تو فوراً اپنے گروپ لیڈر کو بتائیں۔",
          hi: "अगर तबीयत खराब लगे तो तुरंत अपने ग्रुप लीडर को बताएं।",
          tr: "Kendinizi iyi hissetmezseniz, hemen grup liderinize bildirin.",
          ru: "Если почувствуете себя плохо, немедленно сообщите руководителю группы.",
        },
      },
    ],
  },
  {
    id: "arafat",
    order: 5,
    title: {
      en: "Day of Arafat",
      ar: "يوم عرفة",
      ur: "یوم عرفہ",
      hi: "अरफात का दिन",
      tr: "Arefe Günü",
      ru: "День Арафата",
    },
    description: {
      en: "The most important day of Hajj - standing at Arafat",
      ar: "أهم يوم في الحج - الوقوف بعرفة",
      ur: "حج کا سب سے اہم دن - عرفات میں وقوف",
      hi: "हज का सबसे महत्वपूर्ण दिन - अरफात में खड़े होना",
      tr: "Haccın en önemli günü - Arafat'ta vakfe",
      ru: "Самый важный день хаджа - стояние на Арафате",
    },
    whatItIs: {
      en: "The Day of Arafat (9th of Dhul Hijjah) is the heart of Hajj. Standing at Arafat, even for a moment, is essential for Hajj to be valid. It is a day of deep devotion and supplication.",
      ar: "يوم عرفة (التاسع من ذي الحجة) هو قلب الحج. الوقوف بعرفة، حتى للحظة، ضروري لصحة الحج. إنه يوم للتضرع والعبادة العميقة.",
      ur: "یوم عرفہ (9 ذی الحجہ) حج کا دل ہے۔ عرفات میں کھڑا ہونا، ایک لمحے کے لیے بھی، حج کی صحت کے لیے ضروری ہے۔ یہ گہری عبادت اور دعا کا دن ہے۔",
      hi: "अरफात का दिन (9 ज़िल हिज्जा) हज का दिल है। अरफात में खड़े होना, एक पल के लिए भी, हज के वैध होने के लिए आवश्यक है। यह गहरी भक्ति और प्रार्थना का दिन है।",
      tr: "Arefe Günü (Zilhicce'nin 9'u) haccın kalbidir. Arafat'ta bir an bile olsa durmak, haccın geçerli olması için şarttır. Bu derin ibadet ve dua günüdür.",
      ru: "День Арафата (9-е Зуль-Хиджа) — сердце хаджа. Стояние на Арафате, хотя бы на мгновение, обязательно для действительности хаджа. Это день глубокой преданности и мольбы.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Travel to Arafat after Fajr prayer on the 9th of Dhul Hijjah.",
          ar: "انتقل إلى عرفة بعد صلاة الفجر في التاسع من ذي الحجة.",
          ur: "9 ذی الحجہ کو فجر کی نماز کے بعد عرفات جائیں۔",
          hi: "9 ज़िल हिज्जा को फज्र की नमाज़ के बाद अरफात की यात्रा करें।",
          tr: "Zilhicce'nin 9'unda Fecir namazından sonra Arafat'a gidin.",
          ru: "Отправляйтесь в Арафат после утренней молитвы 9-го Зуль-Хиджа.",
        },
      },
      {
        step: 2,
        text: {
          en: "Stay within the boundaries of Arafat. The boundaries are marked with signs.",
          ar: "ابقَ داخل حدود عرفة. الحدود موضحة بلافتات.",
          ur: "عرفات کی حدود میں رہیں۔ حدود علامات سے نشان زد ہیں۔",
          hi: "अरफात की सीमाओं में रहें। सीमाएं संकेतों से चिह्नित हैं।",
          tr: "Arafat sınırları içinde kalın. Sınırlar işaretlerle belirtilmiştir.",
          ru: "Оставайтесь в пределах границ Арафата. Границы обозначены знаками.",
        },
      },
      {
        step: 3,
        text: {
          en: "Pray Dhuhr and Asr combined and shortened at the time of Dhuhr.",
          ar: "صلِّ الظهر والعصر جمعاً وقصراً في وقت الظهر.",
          ur: "ظہر کے وقت ظہر اور عصر کو جمع اور قصر کے ساتھ پڑھیں۔",
          hi: "ज़ुहर के समय ज़ुहर और असर को मिलाकर और छोटा करके पढ़ें।",
          tr: "Öğle vaktinde Öğle ve İkindi namazlarını birleştirip kısaltarak kılın.",
          ru: "Совершите Зухр и Аср вместе и сокращённо во время Зухра.",
        },
      },
      {
        step: 4,
        text: {
          en: "Spend the afternoon until sunset in deep supplication and prayer. This is the heart of Hajj.",
          ar: "اقضِ فترة ما بعد الظهر حتى الغروب في الدعاء والصلاة العميقة. هذا هو قلب الحج.",
          ur: "غروب آفتاب تک دوپہر گہری دعا اور نماز میں گزاریں۔ یہ حج کا دل ہے۔",
          hi: "सूर्यास्त तक दोपहर गहरी प्रार्थना और दुआ में बिताएं। यह हज का दिल है।",
          tr: "Öğleden güneş batana kadar derin dua ve ibadetle geçirin. Haccın kalbi budur.",
          ru: "Проведите время до заката в глубокой мольбе и молитве. Это сердце хаджа.",
        },
      },
      {
        step: 5,
        text: {
          en: "After sunset, proceed to Muzdalifah. Do not pray Maghrib until you reach Muzdalifah.",
          ar: "بعد الغروب، انتقل إلى مزدلفة. لا تصلِّ المغرب حتى تصل إلى مزدلفة.",
          ur: "غروب کے بعد مزدلفہ کی طرف چلیں۔ مزدلفہ پہنچنے تک مغرب نہ پڑھیں۔",
          hi: "सूर्यास्त के बाद मुज़दलिफ़ा की ओर बढ़ें। मुज़दलिफ़ा पहुंचने तक मग़रिब न पढ़ें।",
          tr: "Güneş battıktan sonra Müzdelife'ye doğru ilerleyin. Müzdelife'ye ulaşana kadar Akşam namazını kılmayın.",
          ru: "После заката направляйтесь в Муздалифу. Не молитесь Магриб, пока не достигнете Муздалифы.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not miss being at Arafat. Without standing at Arafat, Hajj is not valid.",
          ar: "لا تفوّت التواجد في عرفة. بدون الوقوف بعرفة، الحج غير صحيح.",
          ur: "عرفات میں رہنا نہ چھوڑیں۔ عرفات میں وقوف کے بغیر حج صحیح نہیں۔",
          hi: "अरफात में रहना न छोड़ें। अरफात में खड़े हुए बिना हज वैध नहीं है।",
          tr: "Arafat'ta olmayı kaçırmayın. Arafat'ta durmadan hac geçerli değildir.",
          ru: "Не пропустите пребывание в Арафате. Без стояния на Арафате хадж недействителен.",
        },
      },
      {
        text: {
          en: "Do not leave Arafat before sunset.",
          ar: "لا تغادر عرفة قبل الغروب.",
          ur: "غروب سے پہلے عرفات نہ چھوڑیں۔",
          hi: "सूर्यास्त से पहले अरफात न छोड़ें।",
          tr: "Güneş batmadan Arafat'tan ayrılmayın.",
          ru: "Не покидайте Арафат до заката.",
        },
      },
      {
        text: {
          en: "Ensure you are within the marked boundaries of Arafat, not outside.",
          ar: "تأكد من وجودك داخل حدود عرفة المحددة، وليس خارجها.",
          ur: "یقینی بنائیں کہ آپ عرفات کی نشان زد حدود میں ہیں، باہر نہیں۔",
          hi: "सुनिश्चित करें कि आप अरफात की चिह्नित सीमाओं के अंदर हैं, बाहर नहीं।",
          tr: "Arafat'ın işaretli sınırları içinde olduğunuzdan emin olun, dışında değil.",
          ru: "Убедитесь, что вы находитесь в отмеченных границах Арафата, а не за их пределами.",
        },
      },
    ],
    duaGuidance: {
      en: "This is the most important day for dua. Pour out your heart to Allah. There is no specific dua required - simply speak to Allah sincerely about your hopes, fears, and gratitude. Many recite 'La ilaha illallah wahdahu la sharika lah' (There is no god but Allah alone, with no partner).",
      ar: "هذا أهم يوم للدعاء. اسكب قلبك لله. لا يوجد دعاء محدد مطلوب - تحدث إلى الله بإخلاص عن آمالك ومخاوفك وامتنانك. كثيرون يرددون 'لا إله إلا الله وحده لا شريك له'.",
      ur: "یہ دعا کے لیے سب سے اہم دن ہے۔ اپنا دل اللہ کے سامنے کھول دیں۔ کوئی مخصوص دعا ضروری نہیں - بس اللہ سے اپنی امیدوں، خوفوں اور شکر کے بارے میں سچے دل سے بات کریں۔ بہت سے 'لا الٰہ الا اللہ وحدہ لا شریک لہ' پڑھتے ہیں۔",
      hi: "यह दुआ के लिए सबसे महत्वपूर्ण दिन है। अपना दिल अल्लाह के सामने खोल दें। कोई विशेष दुआ आवश्यक नहीं है - बस अल्लाह से अपनी आशाओं, डर और कृतज्ञता के बारे में सच्चे दिल से बात करें। कई 'ला इलाहा इल्लल्लाह वहदहू ला शरीक लह' पढ़ते हैं।",
      tr: "Bu dua için en önemli gündür. Kalbinizi Allah'a dökün. Belirli bir dua gerekli değildir - sadece umutlarınız, korkularınız ve şükrünüz hakkında Allah'la samimiyetle konuşun. Birçok kişi 'La ilahe illallah vahdehu la şerike leh' okur.",
      ru: "Это самый важный день для мольбы. Излейте своё сердце Аллаху. Никакой особой молитвы не требуется - просто искренне говорите с Аллахом о своих надеждах, страхах и благодарности. Многие читают «Ля иляха илляллах вахдаху ля шарика лях».",
    },
    safetyTips: [
      {
        text: {
          en: "It is extremely hot. Carry water, use an umbrella, and rest in shade when possible.",
          ar: "الحر شديد جداً. احمل الماء، استخدم مظلة، واسترح في الظل عند الإمكان.",
          ur: "بہت زیادہ گرمی ہے۔ پانی ساتھ رکھیں، چھتری استعمال کریں، اور جب ممکن ہو سایے میں آرام کریں۔",
          hi: "बहुत गर्मी है। पानी ले जाएं, छाता उपयोग करें, और जब संभव हो छाया में आराम करें।",
          tr: "Hava son derece sıcaktır. Su taşıyın, şemsiye kullanın ve mümkün olduğunda gölgede dinlenin.",
          ru: "Очень жарко. Носите воду, используйте зонт и отдыхайте в тени, когда возможно.",
        },
      },
      {
        text: {
          en: "Stay with your group. The area is vast and it is easy to get separated.",
          ar: "ابقَ مع مجموعتك. المنطقة واسعة ومن السهل الانفصال.",
          ur: "اپنے گروپ کے ساتھ رہیں۔ علاقہ وسیع ہے اور الگ ہونا آسان ہے۔",
          hi: "अपने समूह के साथ रहें। क्षेत्र विशाल है और अलग होना आसान है।",
          tr: "Grubunuzla kalın. Alan çok geniş ve kaybolmak kolaydır.",
          ru: "Оставайтесь с группой. Территория огромна, и легко потеряться.",
        },
      },
      {
        text: {
          en: "If you feel faint or unwell, seek medical help immediately. Medical posts are available.",
          ar: "إذا شعرت بالإغماء أو التوعك، اطلب المساعدة الطبية فوراً. المراكز الطبية متوفرة.",
          ur: "اگر بیہوشی یا تکلیف محسوس ہو، فوراً طبی مدد حاصل کریں۔ طبی مراکز دستیاب ہیں۔",
          hi: "अगर बेहोशी या तकलीफ महसूस हो, तुरंत चिकित्सा सहायता लें। चिकित्सा केंद्र उपलब्ध हैं।",
          tr: "Bayılacak gibi veya kötü hissederseniz, hemen tıbbi yardım isteyin. Sağlık noktaları mevcuttur.",
          ru: "Если почувствуете слабость или недомогание, немедленно обратитесь за медицинской помощью. Медпункты доступны.",
        },
      },
    ],
    hadith: {
      text: {
        en: "The Prophet (peace be upon him) said: 'Hajj is Arafat.' Meaning standing at Arafat is the essence of Hajj.",
        ar: "قال النبي ﷺ: 'الحج عرفة'. أي أن الوقوف بعرفة هو جوهر الحج.",
        ur: "نبی ﷺ نے فرمایا: 'حج عرفہ ہے۔' یعنی عرفات میں وقوف حج کا جوہر ہے۔",
        hi: "नबी ﷺ ने फरमाया: 'हज अरफात है।' यानी अरफात में खड़े होना हज का सार है।",
        tr: "Peygamber ﷺ buyurdu: 'Hac Arafat'tır.' Yani Arafat'ta vakfe haccın özüdür.",
        ru: "Пророк ﷺ сказал: «Хадж — это Арафат.» То есть стояние на Арафате — суть хаджа.",
      },
      source: "Sunan al-Tirmidhi",
    },
    importantRulings: [
      {
        text: {
          en: "Standing at Arafat is the pillar of Hajj. Without it, Hajj is not valid.",
          ar: "الوقوف بعرفة ركن الحج. بدونه لا يصح الحج.",
          ur: "عرفات میں وقوف حج کا رکن ہے۔ اس کے بغیر حج صحیح نہیں۔",
          hi: "अरफात में खड़े होना हज का स्तंभ है। इसके बिना हज वैध नहीं।",
          tr: "Arafat'ta vakfe haccın rüknüdür. Onsuz hac geçerli değildir.",
          ru: "Стояние на Арафате — столп хаджа. Без него хадж недействителен.",
        },
      },
      {
        text: {
          en: "You must be present at Arafat for at least a moment between noon and sunset on the 9th of Dhul Hijjah.",
          ar: "يجب أن تكون حاضراً في عرفة ولو لحظة بين الظهر والغروب في التاسع من ذي الحجة.",
          ur: "آپ کو 9 ذی الحجہ کو ظہر اور غروب کے درمیان کم از کم ایک لمحے کے لیے عرفات میں موجود ہونا ضروری ہے۔",
          hi: "आपको 9 ज़िल हिज्जा को दोपहर और सूर्यास्त के बीच कम से कम एक पल के लिए अरफात में मौजूद होना ज़रूरी है।",
          tr: "Zilhicce'nin 9'unda öğle ile güneş batımı arasında en azından bir an Arafat'ta bulunmanız gerekir.",
          ru: "Вы должны присутствовать на Арафате хотя бы мгновение между полуднем и закатом 9-го Зуль-Хиджа.",
        },
      },
    ],
  },
  {
    id: "muzdalifah",
    order: 6,
    title: {
      en: "Night at Muzdalifah",
      ar: "ليلة في مزدلفة",
      ur: "مزدلفہ میں رات",
      hi: "मुज़दलिफ़ा में रात",
      tr: "Müzdelife'de Gece",
      ru: "Ночь в Муздалифе",
    },
    description: {
      en: "Spend the night under the open sky at Muzdalifah",
      ar: "قضاء الليل تحت السماء المفتوحة في مزدلفة",
      ur: "مزدلفہ میں کھلے آسمان تلے رات گزارنا",
      hi: "मुज़दलिफ़ा में खुले आसमान के नीचे रात बिताएं",
      tr: "Müzdelife'de açık gökyüzü altında geceyi geçirin",
      ru: "Провести ночь под открытым небом в Муздалифе",
    },
    whatItIs: {
      en: "After leaving Arafat, you spend the night at Muzdalifah, an open area between Arafat and Mina. Here you pray Maghrib and Isha combined, collect pebbles for Rami, and rest under the stars.",
      ar: "بعد مغادرة عرفة، تقضي الليل في مزدلفة، وهي منطقة مفتوحة بين عرفة ومنى. هنا تصلي المغرب والعشاء جمعاً، وتجمع الحصى للرمي، وتستريح تحت النجوم.",
      ur: "عرفات سے نکلنے کے بعد آپ مزدلفہ میں رات گزارتے ہیں جو عرفات اور منیٰ کے درمیان کھلا میدان ہے۔ یہاں آپ مغرب اور عشاء جمع پڑھتے ہیں، رمی کے لیے کنکریاں جمع کرتے ہیں، اور ستاروں تلے آرام کرتے ہیں۔",
      hi: "अरफात छोड़ने के बाद आप मुज़दलिफ़ा में रात बिताते हैं जो अरफात और मिना के बीच खुला मैदान है। यहां आप मग़रिब और इशा मिलाकर पढ़ते हैं, रमी के लिए कंकड़ इकट्ठा करते हैं, और तारों के नीचे आराम करते हैं।",
      tr: "Arafat'tan ayrıldıktan sonra, Arafat ile Mina arasındaki açık alan olan Müzdelife'de geceyi geçirirsiniz. Burada Akşam ve Yatsı namazlarını birleştirerek kılarsınız, Cemerat için taş toplarsınız ve yıldızların altında dinlenirsiniz.",
      ru: "После ухода из Арафата вы проводите ночь в Муздалифе — открытой местности между Арафатом и Миной. Здесь вы совершаете Магриб и Иша вместе, собираете камешки для Рами и отдыхаете под звёздами.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Upon arriving at Muzdalifah, pray Maghrib and Isha combined (shortened).",
          ar: "عند الوصول إلى مزدلفة، صلِّ المغرب والعشاء جمعاً وقصراً.",
          ur: "مزدلفہ پہنچنے پر مغرب اور عشاء جمع (قصر) پڑھیں۔",
          hi: "मुज़दलिफ़ा पहुंचने पर मग़रिब और इशा मिलाकर (छोटी) पढ़ें।",
          tr: "Müzdelife'ye vardığınızda Akşam ve Yatsı namazlarını birleştirip kısaltarak kılın.",
          ru: "По прибытии в Муздалифу совершите Магриб и Иша вместе (сокращённо).",
        },
      },
      {
        step: 2,
        text: {
          en: "Collect 7 pebbles (small, like chickpeas) for throwing at Jamarat the next day.",
          ar: "اجمع 7 حصيات (صغيرة، بحجم الحمص) لرمي الجمرات في اليوم التالي.",
          ur: "اگلے دن جمرات پر مارنے کے لیے 7 کنکریاں (چھوٹی، چنے جتنی) جمع کریں۔",
          hi: "अगले दिन जमरात पर मारने के लिए 7 कंकड़ (छोटे, चने जितने) इकट्ठा करें।",
          tr: "Ertesi gün Cemerat'a atmak için 7 taş (küçük, nohut büyüklüğünde) toplayın.",
          ru: "Соберите 7 камешков (маленьких, размером с горошину) для бросания в Джамарат на следующий день.",
        },
      },
      {
        step: 3,
        text: {
          en: "Rest and sleep. You will need your energy for the next day's rituals.",
          ar: "استرح ونم. ستحتاج طاقتك لمناسك اليوم التالي.",
          ur: "آرام کریں اور سوئیں۔ اگلے دن کے مناسک کے لیے توانائی چاہیے۔",
          hi: "आराम करें और सोएं। अगले दिन के अनुष्ठानों के लिए ऊर्जा चाहिए।",
          tr: "Dinlenin ve uyuyun. Ertesi günün ibadetleri için enerjinize ihtiyacınız olacak.",
          ru: "Отдохните и поспите. Вам понадобится энергия для ритуалов следующего дня.",
        },
      },
      {
        step: 4,
        text: {
          en: "Leave for Mina after Fajr prayer (or after midnight for elderly/weak pilgrims).",
          ar: "انتقل إلى منى بعد صلاة الفجر (أو بعد منتصف الليل لكبار السن أو الضعفاء).",
          ur: "فجر کی نماز کے بعد منیٰ کی طرف چلیں (یا بزرگوں/کمزوروں کے لیے آدھی رات کے بعد)۔",
          hi: "फज्र की नमाज़ के बाद मिना की ओर चलें (या बुज़ुर्गों/कमज़ोरों के लिए आधी रात के बाद)।",
          tr: "Fecir namazından sonra Mina'ya gidin (yaşlı/zayıf hacılar gece yarısından sonra gidebilir).",
          ru: "Отправляйтесь в Мину после утренней молитвы (или после полуночи для пожилых/слабых паломников).",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not miss praying Maghrib and Isha at Muzdalifah.",
          ar: "لا تفوّت صلاة المغرب والعشاء في مزدلفة.",
          ur: "مزدلفہ میں مغرب اور عشاء کی نماز نہ چھوڑیں۔",
          hi: "मुज़दलिफ़ा में मग़रिब और इशा की नमाज़ न छोड़ें।",
          tr: "Müzdelife'de Akşam ve Yatsı namazlarını kaçırmayın.",
          ru: "Не пропустите молитву Магриб и Иша в Муздалифе.",
        },
      },
      {
        text: {
          en: "Do not collect pebbles that are too large. They should be small, like chickpeas.",
          ar: "لا تجمع حصيات كبيرة جداً. يجب أن تكون صغيرة، بحجم الحمص.",
          ur: "بہت بڑی کنکریاں نہ چنیں۔ وہ چھوٹی ہونی چاہئیں، چنے جتنی۔",
          hi: "बहुत बड़े कंकड़ न चुनें। वे छोटे होने चाहिए, चने जितने।",
          tr: "Çok büyük taşlar toplamayın. Nohut büyüklüğünde küçük olmalılar.",
          ru: "Не собирайте слишком большие камешки. Они должны быть маленькими, как горошины.",
        },
      },
      {
        text: {
          en: "Do not wander away from your group. Stay together.",
          ar: "لا تبتعد عن مجموعتك. ابقوا معاً.",
          ur: "اپنے گروپ سے دور نہ جائیں۔ ساتھ رہیں۔",
          hi: "अपने समूह से दूर न जाएं। साथ रहें।",
          tr: "Grupunuzdan uzaklaşmayın. Birlikte kalın.",
          ru: "Не уходите от группы. Держитесь вместе.",
        },
      },
    ],
    duaGuidance: {
      en: "Continue your prayers and remembrance of Allah. Make dua before sleeping and upon waking. Any sincere prayer is accepted.",
      ar: "استمر في الصلاة وذكر الله. ادعُ قبل النوم وعند الاستيقاظ. أي دعاء صادق مقبول.",
      ur: "نماز اور اللہ کا ذکر جاری رکھیں۔ سونے سے پہلے اور جاگنے پر دعا کریں۔ کوئی بھی مخلصانہ دعا قبول ہے۔",
      hi: "नमाज़ और अल्लाह का ज़िक्र जारी रखें। सोने से पहले और जागने पर दुआ करें। कोई भी सच्ची प्रार्थना स्वीकार है।",
      tr: "Namazlarınıza ve Allah'ı anmaya devam edin. Uyumadan önce ve uyanınca dua edin. Her samimi dua kabul edilir.",
      ru: "Продолжайте молитвы и поминание Аллаха. Делайте дуа перед сном и при пробуждении. Любая искренняя молитва принимается.",
    },
    safetyTips: [
      {
        text: {
          en: "It can get cold at night. Bring a blanket or warm clothing if possible.",
          ar: "قد يصبح الجو بارداً ليلاً. أحضر بطانية أو ملابس دافئة إن أمكن.",
          ur: "رات کو سردی ہو سکتی ہے۔ اگر ممکن ہو کمبل یا گرم کپڑے لائیں۔",
          hi: "रात को ठंड हो सकती है। अगर संभव हो कंबल या गर्म कपड़े लाएं।",
          tr: "Gece soğuk olabilir. Mümkünse battaniye veya sıcak giysi getirin.",
          ru: "Ночью может быть холодно. Принесите одеяло или тёплую одежду, если возможно.",
        },
      },
      {
        text: {
          en: "Stay close to your group. The area is crowded and dark.",
          ar: "ابقَ قريباً من مجموعتك. المنطقة مزدحمة ومظلمة.",
          ur: "اپنے گروپ کے قریب رہیں۔ علاقہ بھیڑ والا اور اندھیرا ہے۔",
          hi: "अपने समूह के पास रहें। क्षेत्र भीड़ वाला और अंधेरा है।",
          tr: "Grubunuza yakın kalın. Alan kalabalık ve karanlıktır.",
          ru: "Оставайтесь близко к группе. Место многолюдное и тёмное.",
        },
      },
      {
        text: {
          en: "Elderly and weak pilgrims may leave after midnight with permission.",
          ar: "يمكن لكبار السن والضعفاء المغادرة بعد منتصف الليل بإذن.",
          ur: "بزرگ اور کمزور حجاج اجازت کے ساتھ آدھی رات کے بعد جا سکتے ہیں۔",
          hi: "बुज़ुर्ग और कमज़ोर तीर्थयात्री अनुमति के साथ आधी रात के बाद जा सकते हैं।",
          tr: "Yaşlı ve zayıf hacılar izinle gece yarısından sonra ayrılabilir.",
          ru: "Пожилые и слабые паломники могут уехать после полуночи с разрешения.",
        },
      },
    ],
  },
  {
    id: "rami",
    order: 7,
    title: {
      en: "Rami al-Jamarat",
      ar: "رمي الجمرات",
      ur: "رمی الجمرات",
      hi: "रमी अल-जमरात",
      tr: "Cemerat Şeytan Taşlama",
      ru: "Рами аль-Джамарат",
    },
    description: {
      en: "Stone the Jamarat pillars",
      ar: "رمي أعمدة الجمرات",
      ur: "جمرات کے ستونوں پر کنکریاں مارنا",
      hi: "जमरात के स्तंभों पर पत्थर मारना",
      tr: "Cemerat sütunlarına taş atmak",
      ru: "Бросание камней в столбы Джамарат",
    },
    whatItIs: {
      en: "Rami is the ritual of throwing pebbles at pillars that represent the places where Ibrahim (AS) resisted Satan's temptations. On the 10th of Dhul Hijjah, you throw 7 pebbles at the large pillar (Jamrat al-Aqaba). On the 11th, 12th, and 13th, you stone all three pillars.",
      ar: "الرمي هو شعيرة رمي الحصى على أعمدة ترمز للأماكن التي قاوم فيها إبراهيم (عليه السلام) إغراءات الشيطان. في العاشر من ذي الحجة، ترمي 7 حصيات على الجمرة الكبرى (جمرة العقبة). في 11 و12 و13، ترمي الجمرات الثلاث.",
      ur: "رمی ستونوں پر کنکریاں مارنے کی رسم ہے جو ان جگہوں کی نمائندگی کرتے ہیں جہاں ابراہیم علیہ السلام نے شیطان کی فریب کاری کا مقابلہ کیا۔ 10 ذی الحجہ کو آپ بڑے ستون (جمرہ العقبہ) پر 7 کنکریاں مارتے ہیں۔ 11، 12، اور 13 کو تینوں ستونوں پر کنکریاں ماریں۔",
      hi: "रमी स्तंभों पर कंकड़ मारने का अनुष्ठान है जो उन स्थानों का प्रतिनिधित्व करते हैं जहां इब्राहीम (अ.स.) ने शैतान के प्रलोभनों का विरोध किया। 10 ज़िल हिज्जा को आप बड़े स्तंभ (जमरत अल-अक़बा) पर 7 कंकड़ मारते हैं। 11वीं, 12वीं और 13वीं को तीनों स्तंभों पर कंकड़ मारें।",
      tr: "Cemerat, Hz. İbrahim'in (AS) Şeytan'ın ayartmalarına karşı koyduğu yerleri temsil eden sütunlara taş atma ibadetidir. Zilhicce'nin 10'unda büyük sütuna (Cemre-tül Akabe) 7 taş atarsınız. 11, 12 ve 13'üncü günlerde üç sütunun hepsini taşlarsınız.",
      ru: "Рами — это ритуал бросания камешков в столбы, символизирующие места, где Ибрахим (мир ему) противостоял искушениям Шайтана. 10-го Зуль-Хиджа вы бросаете 7 камешков в большой столб (Джамрат аль-Акаба). 11-го, 12-го и 13-го вы бросаете камни во все три столба.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "On the 10th: Throw 7 pebbles at the large pillar (Jamrat al-Aqaba) only. Say 'Allahu Akbar' with each throw.",
          ar: "في العاشر: ارمِ 7 حصيات على الجمرة الكبرى (جمرة العقبة) فقط. قل 'الله أكبر' مع كل رمية.",
          ur: "10 تاریخ کو: صرف بڑے ستون (جمرہ العقبہ) پر 7 کنکریاں ماریں۔ ہر پھینک کے ساتھ 'اللہ اکبر' کہیں۔",
          hi: "10वीं को: केवल बड़े स्तंभ (जमरत अल-अक़बा) पर 7 कंकड़ मारें। हर फेंक के साथ 'अल्लाहु अकबर' कहें।",
          tr: "10. günde: Sadece büyük sütuna (Cemre-tül Akabe) 7 taş atın. Her atışta 'Allahu Ekber' deyin.",
          ru: "10-го: Бросьте 7 камешков только в большой столб (Джамрат аль-Акаба). Говорите «Аллаху Акбар» с каждым броском.",
        },
      },
      {
        step: 2,
        text: {
          en: "On the 11th, 12th (and optionally 13th): Stone all three pillars - small, medium, then large. 7 pebbles each.",
          ar: "في 11 و12 (واختيارياً 13): ارمِ الجمرات الثلاث - الصغرى ثم الوسطى ثم الكبرى. 7 حصيات لكل واحدة.",
          ur: "11، 12 (اور اختیاری طور پر 13) کو: تینوں ستونوں پر کنکریاں ماریں - چھوٹا، درمیانہ، پھر بڑا۔ ہر ایک پر 7 کنکریاں۔",
          hi: "11वीं, 12वीं (और वैकल्पिक 13वीं) को: तीनों स्तंभों पर पत्थर मारें - छोटा, मध्यम, फिर बड़ा। प्रत्येक पर 7 कंकड़।",
          tr: "11, 12 (ve isteğe bağlı 13) günlerinde: Üç sütunun hepsini taşlayın - küçük, orta, sonra büyük. Her birine 7 taş.",
          ru: "11-го, 12-го (и при желании 13-го): Бросайте камни во все три столба - маленький, средний, затем большой. По 7 камешков каждый.",
        },
      },
      {
        step: 3,
        text: {
          en: "After stoning the first and second pillars, stand aside and make dua. No dua after the third pillar - just leave.",
          ar: "بعد رمي الجمرة الأولى والثانية، قف جانباً وادعُ. لا دعاء بعد الجمرة الثالثة - غادر فقط.",
          ur: "پہلے اور دوسرے ستون پر کنکریاں مارنے کے بعد ایک طرف کھڑے ہو کر دعا کریں۔ تیسرے ستون کے بعد دعا نہیں - بس چلے جائیں۔",
          hi: "पहले और दूसरे स्तंभ पर पत्थर मारने के बाद एक तरफ खड़े होकर दुआ करें। तीसरे स्तंभ के बाद दुआ नहीं - बस चले जाएं।",
          tr: "Birinci ve ikinci sütunları taşladıktan sonra kenara çekilip dua edin. Üçüncü sütundan sonra dua yok - sadece ayrılın.",
          ru: "После бросания камней в первый и второй столбы отойдите в сторону и сделайте дуа. После третьего столба дуа нет - просто уходите.",
        },
      },
      {
        step: 4,
        text: {
          en: "Perform stoning after Dhuhr time (after noon). Avoid the most crowded times if possible.",
          ar: "أدِّ الرمي بعد وقت الظهر (بعد الزوال). تجنب أوقات الذروة إن أمكن.",
          ur: "ظہر کے بعد (دوپہر کے بعد) رمی کریں۔ اگر ممکن ہو سب سے زیادہ بھیڑ والے اوقات سے بچیں۔",
          hi: "ज़ुहर के बाद (दोपहर के बाद) पत्थर मारें। अगर संभव हो सबसे भीड़ वाले समय से बचें।",
          tr: "Taşlamayı Öğle vaktinden sonra (öğleden sonra) yapın. Mümkünse en kalabalık zamanlardan kaçının.",
          ru: "Совершайте бросание камней после времени Зухра (после полудня). По возможности избегайте самых многолюдных часов.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not throw all pebbles at once. Throw them one by one.",
          ar: "لا ترمِ كل الحصيات دفعة واحدة. ارمها واحدة تلو الأخرى.",
          ur: "تمام کنکریاں ایک ساتھ نہ پھینکیں۔ ایک ایک کرکے پھینکیں۔",
          hi: "सभी कंकड़ एक साथ न फेंकें। एक-एक करके फेंकें।",
          tr: "Tüm taşları bir kerede atmayın. Tek tek atın.",
          ru: "Не бросайте все камешки сразу. Бросайте по одному.",
        },
      },
      {
        text: {
          en: "Do not push others. The area is extremely crowded. Be patient.",
          ar: "لا تدفع الآخرين. المنطقة مزدحمة جداً. كن صبوراً.",
          ur: "دوسروں کو دھکا نہ دیں۔ علاقہ انتہائی بھیڑ والا ہے۔ صبر کریں۔",
          hi: "दूसरों को धक्का न दें। क्षेत्र अत्यंत भीड़भाड़ वाला है। धैर्य रखें।",
          tr: "Başkalarını itmeyin. Alan son derece kalabalıktır. Sabırlı olun.",
          ru: "Не толкайте других. Место крайне многолюдное. Будьте терпеливы.",
        },
      },
      {
        text: {
          en: "Ensure pebbles land in the basin around the pillar, not on the pillar itself.",
          ar: "تأكد من وقوع الحصى في الحوض حول العمود، وليس على العمود نفسه.",
          ur: "یقینی بنائیں کہ کنکریاں ستون کے گرد حوض میں گریں، ستون پر نہیں۔",
          hi: "सुनिश्चित करें कि कंकड़ स्तंभ के चारों ओर के बेसिन में गिरें, स्तंभ पर नहीं।",
          tr: "Taşların sütunun çevresindeki havuza düştüğünden emin olun, sütunun kendisine değil.",
          ru: "Убедитесь, что камешки падают в бассейн вокруг столба, а не на сам столб.",
        },
      },
      {
        text: {
          en: "Do not stone before the prescribed time. Follow the schedule.",
          ar: "لا ترمِ قبل الوقت المحدد. التزم بالجدول.",
          ur: "مقررہ وقت سے پہلے رمی نہ کریں۔ شیڈول پر عمل کریں۔",
          hi: "निर्धारित समय से पहले पत्थर न मारें। शेड्यूल का पालन करें।",
          tr: "Belirlenen zamandan önce taşlamayın. Programı takip edin.",
          ru: "Не бросайте камни до предписанного времени. Следуйте расписанию.",
        },
      },
    ],
    duaGuidance: {
      en: "Say 'Allahu Akbar' with each stone you throw. After the first and second pillars (on days 11-13), make dua facing the Qibla. Keep your prayers short as others are waiting.",
      ar: "قل 'الله أكبر' مع كل حصاة ترميها. بعد الجمرة الأولى والثانية (في أيام 11-13)، ادعُ مستقبلاً القبلة. اجعل دعاءك قصيراً لأن آخرين ينتظرون.",
      ur: "ہر کنکری کے ساتھ 'اللہ اکبر' کہیں۔ پہلے اور دوسرے ستون کے بعد (11-13 کے دنوں میں) قبلہ کی طرف رخ کرکے دعا کریں۔ دعا مختصر رکھیں کیونکہ دوسرے انتظار میں ہیں۔",
      hi: "हर पत्थर के साथ 'अल्लाहु अकबर' कहें। पहले और दूसरे स्तंभ के बाद (11-13 के दिनों में) क़िबला की ओर मुख करके दुआ करें। दुआ छोटी रखें क्योंकि दूसरे इंतज़ार में हैं।",
      tr: "Her taşla birlikte 'Allahu Ekber' deyin. Birinci ve ikinci sütunlardan sonra (11-13. günlerde) Kıble'ye dönerek dua edin. Dualarınızı kısa tutun çünkü başkaları bekliyor.",
      ru: "Говорите «Аллаху Акбар» с каждым камнем. После первого и второго столбов (в дни 11-13) делайте дуа лицом к Кибле. Делайте молитвы короткими, так как другие ждут.",
    },
    safetyTips: [
      {
        text: {
          en: "This is the most crowded ritual. Stay calm and move with the flow.",
          ar: "هذه أكثر الشعائر ازدحاماً. ابقَ هادئاً وتحرك مع التيار.",
          ur: "یہ سب سے زیادہ بھیڑ والی رسم ہے۔ پرسکون رہیں اور بہاؤ کے ساتھ چلیں۔",
          hi: "यह सबसे भीड़ वाला अनुष्ठान है। शांत रहें और प्रवाह के साथ चलें।",
          tr: "Bu en kalabalık ibadettir. Sakin kalın ve akışa uyun.",
          ru: "Это самый многолюдный ритуал. Сохраняйте спокойствие и двигайтесь с потоком.",
        },
      },
      {
        text: {
          en: "Use upper levels of the Jamarat bridge if you have difficulty walking.",
          ar: "استخدم الطوابق العليا من جسر الجمرات إذا كنت تجد صعوبة في المشي.",
          ur: "اگر چلنے میں دشواری ہو تو جمرات پل کی اوپری سطحیں استعمال کریں۔",
          hi: "अगर चलने में कठिनाई हो तो जमरात पुल की ऊपरी मंज़िलें उपयोग करें।",
          tr: "Yürümekte zorlanıyorsanız Cemerat köprüsünün üst katlarını kullanın.",
          ru: "Используйте верхние уровни моста Джамарат, если вам трудно ходить.",
        },
      },
      {
        text: {
          en: "Avoid carrying large bags. Keep belongings minimal for safety.",
          ar: "تجنب حمل حقائب كبيرة. احتفظ بالأغراض الضرورية فقط للسلامة.",
          ur: "بڑے بیگ لے جانے سے بچیں۔ حفاظت کے لیے سامان کم رکھیں۔",
          hi: "बड़े बैग न ले जाएं। सुरक्षा के लिए सामान कम रखें।",
          tr: "Büyük çantalar taşımaktan kaçının. Güvenlik için eşyalarınızı minimal tutun.",
          ru: "Избегайте больших сумок. Берите минимум вещей для безопасности.",
        },
      },
    ],
  },
  {
    id: "tawaf-ifadah",
    order: 8,
    title: {
      en: "Tawaf al-Ifadah",
      ar: "طواف الإفاضة",
      ur: "طواف الافاضہ",
      hi: "तवाफ अल-इफ़ादा",
      tr: "Tavaf-ı İfaza",
      ru: "Таваф аль-Ифада",
    },
    description: {
      en: "The obligatory Tawaf after Arafat",
      ar: "الطواف الواجب بعد عرفة",
      ur: "عرفات کے بعد واجب طواف",
      hi: "अरफात के बाद अनिवार्य तवाफ",
      tr: "Arafat'tan sonra farz tavaf",
      ru: "Обязательный Таваф после Арафата",
    },
    whatItIs: {
      en: "Tawaf al-Ifadah is a pillar of Hajj performed after Arafat. It is similar to the initial Tawaf but is obligatory for Hajj to be complete. It is usually performed on the 10th of Dhul Hijjah after stoning Jamrat al-Aqaba.",
      ar: "طواف الإفاضة ركن من أركان الحج يُؤدى بعد عرفة. وهو مشابه للطواف الأول لكنه واجب لإكمال الحج. يُؤدى عادة في العاشر من ذي الحجة بعد رمي جمرة العقبة.",
      ur: "طواف الافاضہ حج کا رکن ہے جو عرفات کے بعد ادا کیا جاتا ہے۔ یہ ابتدائی طواف کی طرح ہے لیکن حج کی تکمیل کے لیے واجب ہے۔ یہ عام طور پر 10 ذی الحجہ کو جمرہ العقبہ پر رمی کے بعد کیا جاتا ہے۔",
      hi: "तवाफ अल-इफ़ादा हज का स्तंभ है जो अरफात के बाद किया जाता है। यह प्रारंभिक तवाफ के समान है लेकिन हज पूर्ण होने के लिए अनिवार्य है। यह आमतौर पर 10 ज़िल हिज्जा को जमरत अल-अक़बा पर पत्थर मारने के बाद किया जाता है।",
      tr: "Tavaf-ı İfaza, Arafat'tan sonra yapılan haccın farzlarından biridir. İlk tavafa benzer ancak haccın tamamlanması için zorunludur. Genellikle Zilhicce'nin 10'unda Cemre-tül Akabe taşlamasından sonra yapılır.",
      ru: "Таваф аль-Ифада — это столп хаджа, совершаемый после Арафата. Он похож на первоначальный Таваф, но обязателен для завершения хаджа. Обычно совершается 10-го Зуль-Хиджа после бросания камней в Джамрат аль-Акаба.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Go to Masjid al-Haram after completing Rami on the 10th (or later if needed).",
          ar: "اذهب إلى المسجد الحرام بعد إكمال الرمي في العاشر (أو لاحقاً إذا لزم الأمر).",
          ur: "10 تاریخ کو رمی مکمل کرنے کے بعد مسجد الحرام جائیں (یا اگر ضرورت ہو تو بعد میں)۔",
          hi: "10वीं को रमी पूरी करने के बाद मस्जिद अल-हरम जाएं (या ज़रूरत हो तो बाद में)।",
          tr: "10. günde Rami'yi tamamladıktan sonra Mescid-i Haram'a gidin (veya gerekirse daha sonra).",
          ru: "Отправляйтесь в Мечеть аль-Харам после завершения Рами 10-го (или позже, если нужно).",
        },
      },
      {
        step: 2,
        text: {
          en: "Perform Tawaf exactly as described in the Tawaf section - seven rounds around the Kaaba.",
          ar: "أدِّ الطواف تماماً كما هو موضح في قسم الطواف - سبع جولات حول الكعبة.",
          ur: "طواف بالکل ویسے کریں جیسے طواف سیکشن میں بیان کیا گیا - کعبہ کے گرد سات چکر۔",
          hi: "तवाफ बिल्कुल वैसे करें जैसा तवाफ सेक्शन में बताया गया - काबा के चारों ओर सात चक्कर।",
          tr: "Tavafı, Tavaf bölümünde açıklandığı gibi yapın - Kâbe etrafında yedi tur.",
          ru: "Совершите Таваф точно так, как описано в разделе Таваф - семь кругов вокруг Каабы.",
        },
      },
      {
        step: 3,
        text: {
          en: "Pray two rak'ahs after Tawaf, behind Maqam Ibrahim if possible.",
          ar: "صلِّ ركعتين بعد الطواف، خلف مقام إبراهيم إن أمكن.",
          ur: "طواف کے بعد دو رکعت نماز پڑھیں، اگر ممکن ہو مقام ابراہیم کے پیچھے۔",
          hi: "तवाफ के बाद दो रकात नमाज़ पढ़ें, अगर संभव हो मक़ाम इब्राहीम के पीछे।",
          tr: "Tavaftan sonra, mümkünse Makam-ı İbrahim'in arkasında iki rekât namaz kılın.",
          ru: "Совершите два ракаата после Тавафа, позади Макама Ибрахима, если возможно.",
        },
      },
      {
        step: 4,
        text: {
          en: "Perform Sa'i between Safa and Marwa (7 laps) if you have not done it earlier.",
          ar: "أدِّ السعي بين الصفا والمروة (7 أشواط) إذا لم تكن قد فعلت ذلك سابقاً.",
          ur: "اگر پہلے نہیں کی تو صفا اور مروہ کے درمیان سعی کریں (7 چکر)۔",
          hi: "अगर पहले नहीं की तो सफा और मरवा के बीच सई करें (7 चक्कर)।",
          tr: "Daha önce yapmadıysanız Safa ile Merve arasında Sa'y yapın (7 şavt).",
          ru: "Совершите Саи между Сафа и Марва (7 кругов), если не сделали раньше.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not delay Tawaf al-Ifadah beyond the days of Tashriq without reason.",
          ar: "لا تؤخر طواف الإفاضة بعد أيام التشريق دون سبب.",
          ur: "بغیر وجہ طواف الافاضہ کو ایام تشریق کے بعد تک مؤخر نہ کریں۔",
          hi: "बिना कारण तवाफ अल-इफ़ादा को तश्रीक़ के दिनों के बाद तक विलंबित न करें।",
          tr: "Sebepsiz yere Tavaf-ı İfaza'yı Teşrik günlerinden sonraya ertelemeyin.",
          ru: "Не откладывайте Таваф аль-Ифада после дней Ташрик без причины.",
        },
      },
      {
        text: {
          en: "Do not forget that this Tawaf is obligatory - it is a pillar of Hajj.",
          ar: "لا تنسَ أن هذا الطواف واجب - إنه ركن من أركان الحج.",
          ur: "نہ بھولیں کہ یہ طواف واجب ہے - یہ حج کا رکن ہے۔",
          hi: "न भूलें कि यह तवाफ अनिवार्य है - यह हज का स्तंभ है।",
          tr: "Bu tavafın farz olduğunu unutmayın - haccın bir rüknüdür.",
          ru: "Не забывайте, что этот Таваф обязателен - это столп хаджа.",
        },
      },
      {
        text: {
          en: "Do not rush. Take your time even if tired from previous rituals.",
          ar: "لا تتعجل. خذ وقتك حتى لو كنت متعباً من المناسك السابقة.",
          ur: "جلدی نہ کریں۔ اپنا وقت لیں چاہے پچھلے مناسک سے تھکے ہوں۔",
          hi: "जल्दबाजी न करें। अपना समय लें भले ही पिछले अनुष्ठानों से थके हों।",
          tr: "Acele etmeyin. Önceki ibadetlerden yorgun olsanız bile acelenizi almayın.",
          ru: "Не торопитесь. Не спешите, даже если устали от предыдущих ритуалов.",
        },
      },
    ],
    duaGuidance: {
      en: "Same as Tawaf - make any sincere supplication. This is a blessed time to ask Allah for forgiveness and blessings.",
      ar: "مثل الطواف - ادعُ بأي دعاء صادق. هذا وقت مبارك لطلب المغفرة والبركات من الله.",
      ur: "طواف کی طرح - کوئی بھی مخلصانہ دعا کریں۔ یہ اللہ سے معافی اور برکات مانگنے کا مبارک وقت ہے۔",
      hi: "तवाफ की तरह - कोई भी सच्ची प्रार्थना करें। यह अल्लाह से माफी और आशीर्वाद मांगने का बरकत वाला समय है।",
      tr: "Tavaf ile aynı - samimi dua edin. Bu, Allah'tan af ve bereket dilemek için mübarek bir zamandır.",
      ru: "Как и при Тавафе - делайте любую искреннюю мольбу. Это благословенное время просить у Аллаха прощения и благословений.",
    },
    safetyTips: [
      {
        text: {
          en: "You may be very tired at this point. Take breaks and stay hydrated.",
          ar: "قد تكون متعباً جداً في هذه المرحلة. خذ استراحات وحافظ على رطوبة جسمك.",
          ur: "اس موقع پر آپ بہت تھکے ہو سکتے ہیں۔ آرام کریں اور پانی پیتے رہیں۔",
          hi: "इस समय आप बहुत थके हो सकते हैं। आराम करें और पानी पीते रहें।",
          tr: "Bu noktada çok yorgun olabilirsiniz. Ara verin ve su içmeyi ihmal etmeyin.",
          ru: "К этому моменту вы можете очень устать. Делайте перерывы и пейте воду.",
        },
      },
      {
        text: {
          en: "The mosque will be very crowded. Be patient and gentle with others.",
          ar: "المسجد سيكون مزدحماً جداً. كن صبوراً ولطيفاً مع الآخرين.",
          ur: "مسجد بہت بھیڑ والی ہوگی۔ صبر کریں اور دوسروں کے ساتھ نرمی سے پیش آئیں۔",
          hi: "मस्जिद बहुत भीड़ वाली होगी। धैर्य रखें और दूसरों के साथ नरमी से पेश आएं।",
          tr: "Mescit çok kalabalık olacaktır. Sabırlı olun ve başkalarına nazik davranın.",
          ru: "Мечеть будет очень многолюдной. Будьте терпеливы и мягки с другими.",
        },
      },
      {
        text: {
          en: "If you cannot perform it on the 10th, you may do it on the 11th, 12th, or 13th.",
          ar: "إذا لم تستطع أداءه في العاشر، يمكنك أداؤه في 11 أو 12 أو 13.",
          ur: "اگر 10 تاریخ کو نہ کر سکیں تو 11، 12، یا 13 کو کر سکتے ہیں۔",
          hi: "अगर 10वीं को नहीं कर सकते तो 11वीं, 12वीं, या 13वीं को कर सकते हैं।",
          tr: "10. günde yapamazsanız, 11, 12 veya 13. günde yapabilirsiniz.",
          ru: "Если не можете совершить 10-го, можете сделать это 11-го, 12-го или 13-го.",
        },
      },
    ],
  },
  {
    id: "qurbani-halq",
    order: 9,
    title: {
      en: "Qurbani & Halq/Qasr",
      ar: "الذبح والحلق/التقصير",
      ur: "قربانی اور حلق/قصر",
      hi: "कुर्बानी और हलक़/क़स्र",
      tr: "Kurban ve Traş",
      ru: "Жертвоприношение и бритьё/стрижка",
    },
    description: {
      en: "Animal sacrifice and shaving/trimming of hair",
      ar: "ذبح الأضحية وحلق أو تقصير الشعر",
      ur: "جانور کی قربانی اور بالوں کا حلق یا قصر",
      hi: "जानवर की कुर्बानी और बाल मुंडवाना/छोटे करना",
      tr: "Kurban kesimi ve saç traşı/kısaltma",
      ru: "Жертвоприношение животного и бритьё/стрижка волос",
    },
    whatItIs: {
      en: "After stoning Jamrat al-Aqaba on the 10th of Dhul Hijjah, pilgrims offer an animal sacrifice (Qurbani/Hady) and then shave (Halq) or trim (Qasr) their hair. This marks the partial exit from Ihram. Qurbani is typically arranged by your Hajj operator.",
      ar: "بعد رمي جمرة العقبة في العاشر من ذي الحجة، يقدم الحجاج أضحية (الهدي) ثم يحلقون أو يقصرون شعرهم. هذا يمثل التحلل الأول من الإحرام. عادة ما يتم ترتيب الذبح من قبل منظم الحج.",
      ur: "10 ذی الحجہ کو جمرہ العقبہ پر رمی کے بعد حجاج جانور کی قربانی (ہدی) دیتے ہیں اور پھر بال منڈواتے (حلق) یا چھوٹے کراتے (قصر) ہیں۔ یہ احرام سے جزوی طور پر باہر آنے کی علامت ہے۔ قربانی عام طور پر آپ کے حج آپریٹر کی طرف سے کی جاتی ہے۔",
      hi: "10 ज़िल हिज्जा को जमरत अल-अक़बा पर पत्थर मारने के बाद, तीर्थयात्री जानवर की कुर्बानी (हदी) देते हैं और फिर बाल मुंडवाते (हलक़) या छोटे कराते (क़स्र) हैं। यह इहराम से आंशिक रूप से बाहर आने का प्रतीक है। कुर्बानी आमतौर पर आपके हज ऑपरेटर द्वारा व्यवस्थित की जाती है।",
      tr: "Zilhicce'nin 10'unda Cemre-tül Akabe taşlamasından sonra hacılar kurban keser (Hedy) ve ardından saçlarını tıraş eder (Halak) veya kısaltır (Kasr). Bu, ihramdan kısmen çıkışı simgeler. Kurban genellikle hac operatörünüz tarafından ayarlanır.",
      ru: "После бросания камней в Джамрат аль-Акаба 10-го Зуль-Хиджа паломники приносят в жертву животное (Хадий) и затем бреют (Халк) или стригут (Каср) волосы. Это означает частичный выход из Ихрама. Жертвоприношение обычно организуется вашим хадж-оператором.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "After stoning Jamrat al-Aqaba, proceed with Qurbani. Your Hajj operator usually handles this on your behalf.",
          ar: "بعد رمي جمرة العقبة، انتقل إلى الذبح. عادة ما يتولى منظم الحج هذا نيابة عنك.",
          ur: "جمرہ العقبہ پر رمی کے بعد قربانی کریں۔ آپ کا حج آپریٹر عام طور پر آپ کی طرف سے یہ کرتا ہے۔",
          hi: "जमरत अल-अक़बा पर पत्थर मारने के बाद कुर्बानी करें। आपका हज ऑपरेटर आमतौर पर आपकी तरफ से यह करता है।",
          tr: "Cemre-tül Akabe taşlamasından sonra kurban işlemine geçin. Hac operatörünüz genellikle bunu sizin adınıza yapar.",
          ru: "После бросания камней в Джамрат аль-Акаба приступайте к жертвоприношению. Ваш хадж-оператор обычно делает это от вашего имени.",
        },
      },
      {
        step: 2,
        text: {
          en: "After Qurbani is completed (or confirmed), proceed to shave or trim your hair.",
          ar: "بعد إتمام الذبح (أو التأكيد عليه)، انتقل إلى حلق أو تقصير شعرك.",
          ur: "قربانی مکمل ہونے (یا تصدیق کے بعد) بال منڈوائیں یا چھوٹے کرائیں۔",
          hi: "कुर्बानी पूरी होने (या पुष्टि के बाद) बाल मुंडवाएं या छोटे कराएं।",
          tr: "Kurban tamamlandıktan (veya onaylandıktan) sonra saç traşına veya kısaltmaya geçin.",
          ru: "После завершения жертвоприношения (или подтверждения) приступайте к бритью или стрижке волос.",
        },
      },
      {
        step: 3,
        text: {
          en: "Men: Shaving the entire head (Halq) is preferred, but trimming (Qasr) is allowed. Women: Trim a fingertip's length of hair.",
          ar: "الرجال: حلق الرأس بالكامل (الحلق) مفضل، لكن التقصير مسموح. النساء: قص طول أنملة من الشعر.",
          ur: "مرد: پورے سر کا حلق افضل ہے، لیکن قصر جائز ہے۔ خواتین: انگلی کے پور کے برابر بال کاٹیں۔",
          hi: "पुरुष: पूरे सिर का मुंडन (हलक़) बेहतर है, लेकिन छोटे करना (क़स्र) जायज़ है। महिलाएं: उंगली के पोर जितने बाल काटें।",
          tr: "Erkekler: Tüm başı tıraş etmek (Halak) tercih edilir, ancak kısaltma (Kasr) da caizdir. Kadınlar: Parmak ucu uzunluğunda saç kesin.",
          ru: "Мужчины: Бритьё всей головы (Халк) предпочтительнее, но стрижка (Каср) допускается. Женщины: Отрежьте прядь волос длиной с кончик пальца.",
        },
      },
      {
        step: 4,
        text: {
          en: "After Halq/Qasr, you exit the first Tahallul. You may now wear regular clothes, but marital relations remain prohibited until Tawaf al-Ifadah.",
          ar: "بعد الحلق/التقصير، تخرج من التحلل الأول. يمكنك الآن ارتداء الملابس العادية، لكن العلاقات الزوجية تبقى محظورة حتى طواف الإفاضة.",
          ur: "حلق/قصر کے بعد آپ پہلے تحلل سے باہر آ جاتے ہیں۔ اب آپ عام کپڑے پہن سکتے ہیں، لیکن ازدواجی تعلقات طواف الافاضہ تک منع ہیں۔",
          hi: "हलक़/क़स्र के बाद आप पहले तहल्लुल से बाहर आ जाते हैं। अब आप सामान्य कपड़े पहन सकते हैं, लेकिन वैवाहिक संबंध तवाफ अल-इफ़ादा तक वर्जित हैं।",
          tr: "Halak/Kasr'dan sonra ilk tahallülden çıkarsınız. Artık normal giysiler giyebilirsiniz, ancak evlilik ilişkileri Tavaf-ı İfaza'ya kadar yasaktır.",
          ru: "После Халк/Каср вы выходите из первого Тахаллула. Теперь можете носить обычную одежду, но супружеские отношения запрещены до Тавафа аль-Ифада.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not shave before Qurbani is completed. Maintain the proper sequence.",
          ar: "لا تحلق قبل إتمام الذبح. حافظ على الترتيب الصحيح.",
          ur: "قربانی مکمل ہونے سے پہلے بال نہ منڈوائیں۔ صحیح ترتیب برقرار رکھیں۔",
          hi: "कुर्बानी पूरी होने से पहले बाल न मुंडवाएं। सही क्रम बनाए रखें।",
          tr: "Kurban tamamlanmadan saç tıraşı olmayın. Doğru sırayı koruyun.",
          ru: "Не брейтесь до завершения жертвоприношения. Соблюдайте правильную последовательность.",
        },
      },
      {
        text: {
          en: "Women should not shave their heads. Trimming a small amount is sufficient.",
          ar: "يجب ألا تحلق النساء رؤوسهن. قص كمية قليلة كافٍ.",
          ur: "خواتین اپنے سر نہ منڈوائیں۔ تھوڑے بال کاٹنا کافی ہے۔",
          hi: "महिलाएं अपना सिर न मुंडवाएं। थोड़े बाल काटना काफी है।",
          tr: "Kadınlar başlarını tıraş etmemelidir. Az miktarda kesmek yeterlidir.",
          ru: "Женщинам не следует брить голову. Достаточно подстричь небольшое количество волос.",
        },
      },
      {
        text: {
          en: "Do not assume Qurbani is done without confirmation from your Hajj operator.",
          ar: "لا تفترض أن الذبح تم دون تأكيد من منظم الحج.",
          ur: "حج آپریٹر سے تصدیق کے بغیر قربانی ہونے کا اندازہ نہ لگائیں۔",
          hi: "हज ऑपरेटर से पुष्टि के बिना कुर्बानी होने का अंदाज़ा न लगाएं।",
          tr: "Hac operatörünüzden onay almadan kurbanın kesildiğini varsaymayın.",
          ru: "Не предполагайте, что жертвоприношение совершено без подтверждения от хадж-оператора.",
        },
      },
      {
        text: {
          en: "Do not resume all normal activities immediately. Marital relations require Tawaf al-Ifadah first.",
          ar: "لا تستأنف جميع الأنشطة العادية فوراً. العلاقات الزوجية تتطلب طواف الإفاضة أولاً.",
          ur: "تمام عام سرگرمیاں فوراً شروع نہ کریں۔ ازدواجی تعلقات کے لیے پہلے طواف الافاضہ ضروری ہے۔",
          hi: "सभी सामान्य गतिविधियां तुरंत न शुरू करें। वैवाहिक संबंधों के लिए पहले तवाफ अल-इफ़ादा ज़रूरी है।",
          tr: "Tüm normal faaliyetlere hemen başlamayın. Evlilik ilişkileri önce Tavaf-ı İfaza gerektirir.",
          ru: "Не возобновляйте все обычные действия сразу. Супружеские отношения требуют сначала Тавафа аль-Ифада.",
        },
      },
    ],
    duaGuidance: {
      en: "There is no specific dua required. Thank Allah for enabling you to complete this stage. You may say any prayer of gratitude in your own language.",
      ar: "لا يوجد دعاء محدد مطلوب. اشكر الله على تمكينك من إكمال هذه المرحلة. يمكنك قول أي دعاء شكر بلغتك الخاصة.",
      ur: "کوئی مخصوص دعا ضروری نہیں۔ اللہ کا شکر ادا کریں کہ آپ نے یہ مرحلہ مکمل کیا۔ آپ اپنی زبان میں شکر کی کوئی بھی دعا کر سکتے ہیں۔",
      hi: "कोई विशेष दुआ आवश्यक नहीं है। अल्लाह का शुक्रिया अदा करें कि आपने यह चरण पूरा किया। आप अपनी भाषा में शुक्राने की कोई भी दुआ कर सकते हैं।",
      tr: "Belirli bir dua gerekli değildir. Bu aşamayı tamamlamanızı sağladığı için Allah'a şükredin. Kendi dilinizde herhangi bir şükür duası edebilirsiniz.",
      ru: "Никакой особой молитвы не требуется. Благодарите Аллаха за возможность завершить этот этап. Вы можете произнести любую молитву благодарности на своём языке.",
    },
    safetyTips: [
      {
        text: {
          en: "Use licensed barbers only. Many are available near Mina. Avoid unsterilized blades.",
          ar: "استخدم الحلاقين المرخصين فقط. يتوفر الكثير بالقرب من منى. تجنب الشفرات غير المعقمة.",
          ur: "صرف لائسنس یافتہ حجام استعمال کریں۔ منیٰ کے قریب بہت سے دستیاب ہیں۔ غیر جراثیم کش بلیڈ سے بچیں۔",
          hi: "केवल लाइसेंसशुदा नाई का उपयोग करें। मिना के पास कई उपलब्ध हैं। गैर-स्टरलाइज्ड ब्लेड से बचें।",
          tr: "Sadece lisanslı berberleri kullanın. Mina yakınında birçok mevcuttur. Sterilize edilmemiş jiletle kaçının.",
          ru: "Используйте только лицензированных парикмахеров. Многие доступны возле Мины. Избегайте нестерилизованных лезвий.",
        },
      },
      {
        text: {
          en: "Stay hydrated. This is a long day with many rituals.",
          ar: "حافظ على رطوبة جسمك. هذا يوم طويل مليء بالمناسك.",
          ur: "پانی پیتے رہیں۔ یہ بہت سے مناسک کا طویل دن ہے۔",
          hi: "पानी पीते रहें। यह कई अनुष्ठानों का लंबा दिन है।",
          tr: "Su içmeyi ihmal etmeyin. Birçok ibadetle dolu uzun bir gün.",
          ru: "Пейте достаточно воды. Это длинный день с множеством ритуалов.",
        },
      },
      {
        text: {
          en: "Keep your group identification with you. Crowds are significant on the 10th.",
          ar: "احتفظ بهوية مجموعتك معك. الحشود كبيرة في العاشر.",
          ur: "اپنے گروپ کی شناخت اپنے پاس رکھیں۔ 10 تاریخ کو بھیڑ بہت زیادہ ہوتی ہے۔",
          hi: "अपने समूह की पहचान अपने पास रखें। 10वीं को भीड़ बहुत होती है।",
          tr: "Grup kimliğinizi yanınızda bulundurun. 10. günde kalabalıklar yoğundur.",
          ru: "Держите при себе идентификацию группы. 10-го числа толпы значительны.",
        },
      },
    ],
    hadith: {
      text: {
        en: "The Prophet (peace be upon him) shaved his head and distributed his hair among his companions as a blessing.",
        ar: "حلق النبي ﷺ رأسه ووزع شعره بين أصحابه تبركاً.",
        ur: "نبی ﷺ نے اپنا سر منڈوایا اور اپنے بال برکت کے لیے صحابہ میں تقسیم کیے۔",
        hi: "नबी ﷺ ने अपना सिर मुंडवाया और अपने बाल बरकत के लिए सहाबा में बांटे।",
        tr: "Peygamber ﷺ başını tıraş etti ve saçlarını bereket olarak ashabı arasında dağıttı.",
        ru: "Пророк ﷺ побрил голову и раздал свои волосы среди сподвижников как благословение.",
      },
      source: "Sahih Muslim",
    },
    importantRulings: [
      {
        text: {
          en: "The sequence (Rami, Qurbani, Halq) is recommended but not strictly required. Please follow your Hajj group's guidance.",
          ar: "الترتيب (الرمي، الذبح، الحلق) مستحب لكنه ليس واجباً. يرجى اتباع إرشادات مجموعة الحج.",
          ur: "ترتیب (رمی، قربانی، حلق) مستحب ہے لیکن سختی سے ضروری نہیں۔ براہ کرم اپنے حج گروپ کی رہنمائی پر عمل کریں۔",
          hi: "क्रम (रमी, कुर्बानी, हलक़) अनुशंसित है लेकिन सख्ती से आवश्यक नहीं। कृपया अपने हज समूह के मार्गदर्शन का पालन करें।",
          tr: "Sıralama (Rami, Kurban, Traş) tavsiye edilir ancak kesinlikle gerekli değildir. Lütfen hac grubunuzun rehberliğini takip edin.",
          ru: "Последовательность (Рами, Курбани, Халк) рекомендуется, но не строго обязательна. Следуйте указаниям вашей группы хаджа.",
        },
      },
      {
        text: {
          en: "Halq (complete shaving) is more virtuous for men, but Qasr (trimming) is valid.",
          ar: "الحلق أفضل للرجال، لكن التقصير صحيح.",
          ur: "مردوں کے لیے حلق افضل ہے، لیکن قصر صحیح ہے۔",
          hi: "पुरुषों के लिए हलक़ (पूर्ण मुंडन) अधिक पुण्य है, लेकिन क़स्र (छोटे करना) वैध है।",
          tr: "Erkekler için Halak (tam tıraş) daha faziletlidir, ancak Kasr (kısaltma) geçerlidir.",
          ru: "Халк (полное бритьё) более добродетелен для мужчин, но Каср (стрижка) допустим.",
        },
      },
    ],
  },
  {
    id: "tawaf-wida",
    order: 10,
    title: {
      en: "Tawaf al-Wida",
      ar: "طواف الوداع",
      ur: "طواف الوداع",
      hi: "तवाफ अल-विदा",
      tr: "Veda Tavafı",
      ru: "Таваф аль-Вида",
    },
    description: {
      en: "The farewell Tawaf before leaving Makkah",
      ar: "طواف الوداع قبل مغادرة مكة",
      ur: "مکہ چھوڑنے سے پہلے وداعی طواف",
      hi: "मक्का छोड़ने से पहले विदाई तवाफ",
      tr: "Mekke'den ayrılmadan önce veda tavafı",
      ru: "Прощальный Таваф перед отъездом из Мекки",
    },
    whatItIs: {
      en: "Tawaf al-Wida is the farewell circumambulation performed just before leaving Makkah. It is the last act of Hajj, a final goodbye to the Sacred House. It is obligatory for those leaving Makkah.",
      ar: "طواف الوداع هو طواف الوداع الذي يُؤدى قبل مغادرة مكة مباشرة. إنه آخر عمل في الحج، وداع أخير للبيت الحرام. وهو واجب على من يغادر مكة.",
      ur: "طواف الوداع وداعی طواف ہے جو مکہ چھوڑنے سے ٹھیک پہلے کیا جاتا ہے۔ یہ حج کا آخری عمل ہے، بیت الحرام کو آخری الوداع۔ یہ مکہ چھوڑنے والوں پر واجب ہے۔",
      hi: "तवाफ अल-विदा विदाई परिक्रमा है जो मक्का छोड़ने से ठीक पहले की जाती है। यह हज का अंतिम कार्य है, पवित्र घर को अंतिम अलविदा। यह मक्का छोड़ने वालों पर अनिवार्य है।",
      tr: "Veda Tavafı, Mekke'den ayrılmadan hemen önce yapılan veda tavafıdır. Haccın son ibadetidir, Beytullah'a son vedadır. Mekke'den ayrılanlar için vaciptir.",
      ru: "Таваф аль-Вида — прощальное обхождение, совершаемое непосредственно перед отъездом из Мекки. Это последнее действие хаджа, прощание со Священным Домом. Он обязателен для покидающих Мекку.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Perform this Tawaf just before leaving Makkah. Make it your last act in the city.",
          ar: "أدِّ هذا الطواف قبل مغادرة مكة مباشرة. اجعله آخر عمل لك في المدينة.",
          ur: "یہ طواف مکہ چھوڑنے سے ٹھیک پہلے کریں۔ اسے شہر میں اپنا آخری عمل بنائیں۔",
          hi: "यह तवाफ मक्का छोड़ने से ठीक पहले करें। इसे शहर में अपना अंतिम कार्य बनाएं।",
          tr: "Bu tavafı Mekke'den ayrılmadan hemen önce yapın. Şehirdeki son işiniz olsun.",
          ru: "Совершите этот Таваф непосредственно перед отъездом из Мекки. Сделайте его последним действием в городе.",
        },
      },
      {
        step: 2,
        text: {
          en: "Circle the Kaaba seven times, as in previous Tawafs.",
          ar: "طُف حول الكعبة سبع مرات، كما في الأطوفة السابقة.",
          ur: "کعبہ کے گرد سات چکر لگائیں، جیسا کہ پچھلے طوافوں میں۔",
          hi: "काबा के चारों ओर सात चक्कर लगाएं, जैसा पिछले तवाफों में।",
          tr: "Önceki tavaflarda olduğu gibi Kâbe'nin etrafında yedi kez dönün.",
          ru: "Обойдите Каабу семь раз, как в предыдущих Тавафах.",
        },
      },
      {
        step: 3,
        text: {
          en: "Pray two rak'ahs after completing Tawaf.",
          ar: "صلِّ ركعتين بعد إكمال الطواف.",
          ur: "طواف مکمل کرنے کے بعد دو رکعت نماز پڑھیں۔",
          hi: "तवाफ पूरा करने के बाद दो रकात नमाज़ पढ़ें।",
          tr: "Tavafı tamamladıktan sonra iki rekât namaz kılın.",
          ru: "Совершите два ракаата после завершения Тавафа.",
        },
      },
      {
        step: 4,
        text: {
          en: "Leave the mosque walking backwards if possible, keeping the Kaaba in view for as long as you can, as a sign of love and respect.",
          ar: "غادر المسجد وأنت تمشي للخلف إن أمكن، مبقياً الكعبة في مرآك ما استطعت، كعلامة على الحب والاحترام.",
          ur: "اگر ممکن ہو پیچھے چلتے ہوئے مسجد سے نکلیں، جب تک ہو سکے کعبہ کو نظر میں رکھیں، محبت اور احترام کی علامت کے طور پر۔",
          hi: "अगर संभव हो पीछे की ओर चलते हुए मस्जिद छोड़ें, जब तक हो सके काबा को नज़र में रखें, प्रेम और सम्मान की निशानी के तौर पर।",
          tr: "Mümkünse geriye doğru yürüyerek mescidden ayrılın, sevgi ve saygı işareti olarak Kâbe'yi mümkün olduğunca gözünüzün önünde tutun.",
          ru: "Если возможно, покиньте мечеть, идя спиной вперёд, сохраняя Каабу в поле зрения как можно дольше, в знак любви и уважения.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Do not do shopping or business after Tawaf al-Wida. Leave Makkah immediately.",
          ar: "لا تتسوق أو تعمل بعد طواف الوداع. غادر مكة فوراً.",
          ur: "طواف الوداع کے بعد خریداری یا کاروبار نہ کریں۔ فوراً مکہ چھوڑیں۔",
          hi: "तवाफ अल-विदा के बाद खरीदारी या काम न करें। तुरंत मक्का छोड़ें।",
          tr: "Veda Tavafından sonra alışveriş veya iş yapmayın. Mekke'den hemen ayrılın.",
          ru: "Не занимайтесь покупками или делами после Таваф аль-Вида. Немедленно покиньте Мекку.",
        },
      },
      {
        text: {
          en: "Menstruating women are excused from this Tawaf. Follow your group leader's guidance.",
          ar: "النساء الحائض معفيات من هذا الطواف. اتبعي إرشادات قائد مجموعتك.",
          ur: "حیض والی خواتین کو اس طواف سے رخصت ہے۔ اپنے گروپ لیڈر کی رہنمائی پر عمل کریں۔",
          hi: "मासिक धर्म वाली महिलाओं को इस तवाफ से माफी है। अपने समूह नेता के मार्गदर्शन का पालन करें।",
          tr: "Adet halindeki kadınlar bu tavaftan muaftır. Grup liderinizin rehberliğini takip edin.",
          ru: "Женщины в период менструации освобождаются от этого Тавафа. Следуйте указаниям руководителя группы.",
        },
      },
      {
        text: {
          en: "Do not skip this Tawaf if you are able to perform it.",
          ar: "لا تفوّت هذا الطواف إذا كنت قادراً على أدائه.",
          ur: "اگر آپ ادا کر سکتے ہیں تو یہ طواف نہ چھوڑیں۔",
          hi: "अगर आप कर सकते हैं तो यह तवाफ न छोड़ें।",
          tr: "Yapabilecek durumdaysanız bu tavafı atlamayın.",
          ru: "Не пропускайте этот Таваф, если можете его совершить.",
        },
      },
    ],
    duaGuidance: {
      en: "This is your final moment at the Kaaba. Pour out your heart. Ask Allah for acceptance of your Hajj, for forgiveness, and for the opportunity to return. Many pilgrims weep during this Tawaf.",
      ar: "هذه لحظتك الأخيرة عند الكعبة. اسكب قلبك. اسأل الله قبول حجك، والمغفرة، وفرصة العودة. كثير من الحجاج يبكون خلال هذا الطواف.",
      ur: "یہ کعبہ پر آپ کا آخری لمحہ ہے۔ اپنا دل کھول دیں۔ اللہ سے حج کی قبولیت، معافی، اور واپس آنے کا موقع مانگیں۔ بہت سے حجاج اس طواف میں روتے ہیں۔",
      hi: "यह काबा पर आपका अंतिम क्षण है। अपना दिल खोल दें। अल्लाह से हज की स्वीकृति, माफी, और वापस आने का अवसर मांगें। बहुत से तीर्थयात्री इस तवाफ में रोते हैं।",
      tr: "Bu Kâbe'deki son anınız. Kalbinizi dökün. Allah'tan haccınızın kabulünü, af dilemeyi ve geri dönme fırsatını isteyin. Birçok hacı bu tavafta ağlar.",
      ru: "Это ваш последний момент у Каабы. Излейте своё сердце. Просите Аллаха о принятии вашего хаджа, о прощении и о возможности вернуться. Многие паломники плачут во время этого Тавафа.",
    },
    safetyTips: [
      {
        text: {
          en: "Take your time. Do not rush this sacred farewell.",
          ar: "خذ وقتك. لا تتعجل هذا الوداع المقدس.",
          ur: "اپنا وقت لیں۔ اس مقدس وداع میں جلدی نہ کریں۔",
          hi: "अपना समय लें। इस पवित्र विदाई में जल्दबाजी न करें।",
          tr: "Acelenizi almayın. Bu kutsal vedayı aceleye getirmeyin.",
          ru: "Не торопитесь. Не спешите с этим священным прощанием.",
        },
      },
      {
        text: {
          en: "Ensure your luggage and transport are arranged before performing this Tawaf.",
          ar: "تأكد من ترتيب حقائبك ووسيلة نقلك قبل أداء هذا الطواف.",
          ur: "یہ طواف کرنے سے پہلے اپنا سامان اور ٹرانسپورٹ کا انتظام یقینی بنائیں۔",
          hi: "इस तवाफ से पहले अपना सामान और परिवहन व्यवस्थित कर लें।",
          tr: "Bu tavafı yapmadan önce bagajlarınızın ve ulaşımınızın ayarlandığından emin olun.",
          ru: "Убедитесь, что ваш багаж и транспорт организованы перед совершением этого Тавафа.",
        },
      },
      {
        text: {
          en: "Stay with your group and proceed directly to your transport after Tawaf.",
          ar: "ابقَ مع مجموعتك وتوجه مباشرة إلى وسيلة نقلك بعد الطواف.",
          ur: "اپنے گروپ کے ساتھ رہیں اور طواف کے بعد سیدھے اپنی ٹرانسپورٹ کی طرف جائیں۔",
          hi: "अपने समूह के साथ रहें और तवाफ के बाद सीधे अपने परिवहन की ओर जाएं।",
          tr: "Grubunuzla kalın ve tavaftan sonra doğrudan ulaşım aracınıza gidin.",
          ru: "Оставайтесь с группой и направляйтесь прямо к транспорту после Тавафа.",
        },
      },
    ],
  },
];

export const getRitualById = (id: string): Ritual | undefined => {
  return MANASIK_RITUALS.find((r) => r.id === id);
};

export const getNextRitual = (currentId: string): Ritual | undefined => {
  const currentIndex = MANASIK_RITUALS.findIndex((r) => r.id === currentId);
  if (currentIndex === -1 || currentIndex === MANASIK_RITUALS.length - 1) {
    return undefined;
  }
  return MANASIK_RITUALS[currentIndex + 1];
};

export const getPreviousRitual = (currentId: string): Ritual | undefined => {
  const currentIndex = MANASIK_RITUALS.findIndex((r) => r.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return MANASIK_RITUALS[currentIndex - 1];
};
