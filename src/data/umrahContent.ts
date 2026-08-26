import { Language, LocalizedString } from "@/contexts/LanguageContext";
import { Ritual, RitualStep, MistakeToAvoid, SafetyTip, HadithReference, ImportantRuling } from "./manasikContent";

export const UMRAH_RITUALS: Ritual[] = [
  {
    id: "umrah-ihram",
    order: 1,
    title: {
      en: "Ihram & Niyyah",
      ar: "الإحرام والنية",
      ur: "احرام اور نیت",
      hi: "इहराम और नियत",
      tr: "İhram ve Niyet",
      ru: "Ихрам и Намерение",
    },
    description: {
      en: "Enter the sacred state and make your intention for Umrah",
      ar: "الدخول في الحالة المقدسة وعقد نية العمرة",
      ur: "مقدس حالت میں داخل ہوں اور عمرہ کی نیت کریں",
      hi: "पवित्र अवस्था में प्रवेश करें और उमरा की नियत करें",
      tr: "Kutsal hale girin ve Umre için niyet edin",
      ru: "Войдите в священное состояние и сделайте намерение для Умры",
    },
    whatItIs: {
      en: "Ihram is the sacred state you enter before performing Umrah. It involves wearing simple garments and making your intention (niyyah) to perform Umrah. This state purifies your heart and prepares you spiritually for worship.",
      ar: "الإحرام هو الحالة المقدسة التي تدخلها قبل أداء العمرة. يشمل ارتداء ملابس بسيطة وعقد نية أداء العمرة. هذه الحالة تطهر قلبك وتعدك روحياً للعبادة.",
      ur: "احرام وہ مقدس حالت ہے جس میں آپ عمرہ کرنے سے پہلے داخل ہوتے ہیں۔ اس میں سادہ لباس پہننا اور عمرہ کی نیت کرنا شامل ہے۔ یہ حالت آپ کے دل کو پاک کرتی ہے اور آپ کو روحانی طور پر عبادت کے لیے تیار کرتی ہے۔",
      hi: "इहराम वह पवित्र अवस्था है जिसमें आप उमरा करने से पहले प्रवेश करते हैं। इसमें साधारण वस्त्र पहनना और उमरा करने की नियत (नीयत) करना शामिल है। यह अवस्था आपके दिल को शुद्ध करती है और आपको आध्यात्मिक रूप से इबादत के लिए तैयार करती है।",
      tr: "İhram, Umre yapmadan önce girdiğiniz kutsal haldir. Basit giysiler giymeyi ve Umre için niyet etmeyi içerir. Bu hal kalbinizi arındırır ve sizi manevi olarak ibadete hazırlar.",
      ru: "Ихрам — это священное состояние, в которое вы входите перед совершением Умры. Оно включает надевание простой одежды и формирование намерения (нийят) совершить Умру. Это состояние очищает ваше сердце и духовно готовит вас к поклонению.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Perform ghusl (full body wash) or at minimum wudu before reaching the Miqat.",
          ar: "اغتسل غسلاً كاملاً أو توضأ على الأقل قبل الوصول إلى الميقات.",
          ur: "میقات پہنچنے سے پہلے غسل یا کم از کم وضو کریں۔",
          hi: "मीकात पहुंचने से पहले गुस्ल (पूरे शरीर को धोना) या कम से कम वुज़ू करें।",
          tr: "Mikat'a ulaşmadan önce gusül veya en azından abdest alın.",
          ru: "Совершите гусль (полное омовение) или как минимум вуду перед достижением Миката.",
        },
      },
      {
        step: 2,
        text: {
          en: "Men: Wear two white unstitched cloths (izar and rida). Women: Wear modest clothing covering the body.",
          ar: "الرجال: ارتدِ قطعتين بيضاء غير مخيطتين (إزار ورداء). النساء: ارتدين ملابس محتشمة تغطي الجسم.",
          ur: "مرد: دو سفید بغیر سلی چادریں پہنیں (ازار اور رداء)۔ خواتین: جسم ڈھانپنے والا شائستہ لباس پہنیں۔",
          hi: "पुरुष: दो सफेद बिना सिले कपड़े पहनें (इज़ार और रिदा)। महिलाएं: शरीर को ढकने वाले शालीन कपड़े पहनें।",
          tr: "Erkekler: İki dikişsiz beyaz bez giyin (izar ve rida). Kadınlar: Vücudu örten tesettür giysisi giyin.",
          ru: "Мужчины: Наденьте два белых несшитых полотна (изар и рида). Женщины: Наденьте скромную одежду, покрывающую тело.",
        },
      },
      {
        step: 3,
        text: {
          en: "At the Miqat, make your intention by saying: 'Labbayk Allahumma Umratan' (O Allah, I answer Your call to perform Umrah).",
          ar: "عند الميقات، اعقد نيتك بقولك: 'لبيك اللهم عمرة'.",
          ur: "میقات پر اپنی نیت کریں اور کہیں: 'لبیک اللہم عمرۃ' (اے اللہ میں تیری پکار پر عمرہ کے لیے حاضر ہوں)۔",
          hi: "मीकात पर अपनी नियत करें और कहें: 'लब्बैक अल्लाहुम्मा उमरतन' (ऐ अल्लाह, मैं तेरी पुकार पर उमरा के लिए हाज़िर हूं)।",
          tr: "Mikat'ta niyetinizi şöyle belirtin: 'Lebbeyk Allahümme Umraten' (Allah'ım, Umre için çağrına icabet ediyorum).",
          ru: "На Микате сделайте намерение, сказав: «Лаббайк Аллахумма Умратан» (О Аллах, я отвечаю на Твой призыв совершить Умру).",
        },
      },
      {
        step: 4,
        text: {
          en: "Begin reciting the Talbiyah: 'Labbayk Allahumma Labbayk. Labbayka la sharika laka labbayk. Innal hamda wan-ni'mata laka wal-mulk. La sharika lak.'",
          ar: "ابدأ بترديد التلبية: 'لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك'.",
          ur: "تلبیہ پڑھنا شروع کریں: 'لبیک اللہم لبیک، لبیک لا شریک لک لبیک، ان الحمد والنعمۃ لک والملک، لا شریک لک'۔",
          hi: "तलबिया पढ़ना शुरू करें: 'लब्बैक अल्लाहुम्मा लब्बैक। लब्बैका ला शरीका लका लब्बैक। इन्नल हम्दा वन-नि'मता लका वल-मुल्क। ला शरीका लक।'",
          tr: "Telbiye okumaya başlayın: 'Lebbeyk Allahümme lebbeyk. Lebbeyk la şerike leke lebbeyk. İnnel hamde ven-ni'mete leke vel-mülk. La şerike lek.'",
          ru: "Начните произносить Тальбию: «Лаббайк Аллахумма Лаббайк. Лаббайка ла шарика лака лаббайк. Инналь хамда ван-ни'мата лака валь-мульк. Ла шарика лак.»",
        },
      },
      {
        step: 5,
        text: {
          en: "Continue reciting Talbiyah frequently until you begin Tawaf.",
          ar: "استمر في ترديد التلبية بكثرة حتى تبدأ الطواف.",
          ur: "طواف شروع کرنے تک کثرت سے تلبیہ پڑھتے رہیں۔",
          hi: "तवाफ शुरू करने तक बार-बार तलबिया पढ़ते रहें।",
          tr: "Tavafa başlayana kadar sık sık Telbiye okumaya devam edin.",
          ru: "Продолжайте часто произносить Тальбию до начала Тавафа.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Passing the Miqat without entering Ihram.",
          ar: "تجاوز الميقات بدون الدخول في الإحرام.",
          ur: "احرام باندھے بغیر میقات سے گزر جانا۔",
          hi: "इहराम बांधे बिना मीकात से गुज़र जाना।",
          tr: "İhrama girmeden Mikat'ı geçmek.",
          ru: "Проезд Миката без вхождения в Ихрам.",
        },
      },
      {
        text: {
          en: "Using scented products after entering Ihram.",
          ar: "استخدام منتجات معطرة بعد الدخول في الإحرام.",
          ur: "احرام کے بعد خوشبو دار مصنوعات استعمال کرنا۔",
          hi: "इहराम के बाद सुगंधित उत्पादों का उपयोग करना।",
          tr: "İhrama girdikten sonra kokulu ürünler kullanmak.",
          ru: "Использование ароматизированных продуктов после вхождения в Ихрам.",
        },
      },
      {
        text: {
          en: "Men covering their head after entering Ihram.",
          ar: "تغطية الرجال رؤوسهم بعد الدخول في الإحرام.",
          ur: "احرام کے بعد مردوں کا سر ڈھانپنا۔",
          hi: "इहराम के बाद पुरुषों का सिर ढकना।",
          tr: "Erkeklerin ihrama girdikten sonra başlarını örtmesi.",
          ru: "Мужчины покрывают голову после вхождения в Ихрам.",
        },
      },
      {
        text: {
          en: "Cutting nails or hair while in Ihram.",
          ar: "قص الأظافر أو الشعر أثناء الإحرام.",
          ur: "احرام کی حالت میں ناخن یا بال کاٹنا۔",
          hi: "इहराम की हालत में नाखून या बाल काटना।",
          tr: "İhramlıyken tırnak veya saç kesmek.",
          ru: "Стрижка ногтей или волос в состоянии Ихрама.",
        },
      },
    ],
    duaGuidance: {
      en: "You may make du'a in any language. A recommended du'a is: 'O Allah, I intend to perform Umrah, so make it easy for me and accept it from me.' Recite the Talbiyah frequently with humility and presence of heart.",
      ar: "يمكنك الدعاء بأي لغة. من الأدعية المستحبة: 'اللهم إني أريد العمرة فيسرها لي وتقبلها مني'. ردد التلبية بخشوع وحضور قلب.",
      ur: "آپ کسی بھی زبان میں دعا کر سکتے ہیں۔ ایک مسنون دعا ہے: 'اے اللہ میں عمرہ کا ارادہ رکھتا ہوں پس اسے میرے لیے آسان بنا اور قبول فرما۔' دل کی حاضری کے ساتھ عاجزی سے تلبیہ پڑھتے رہیں۔",
      hi: "आप किसी भी भाषा में दुआ कर सकते हैं। एक अनुशंसित दुआ है: 'ऐ अल्लाह मैं उमरा करना चाहता हूं, इसे मेरे लिए आसान बना और मुझसे कबूल फरमा।' दिल की उपस्थिति के साथ विनम्रता से तलबिया पढ़ते रहें।",
      tr: "Herhangi bir dilde dua edebilirsiniz. Önerilen bir dua: 'Allah'ım, Umre yapmak istiyorum, bana kolaylaştır ve benden kabul et.' Tevazu ve kalp huzuru ile sık sık Telbiye okuyun.",
      ru: "Вы можете делать дуа на любом языке. Рекомендуемая дуа: «О Аллах, я намереваюсь совершить Умру, облегчи мне это и прими от меня.» Часто произносите Тальбию со смирением и присутствием сердца.",
    },
    safetyTips: [
      {
        text: {
          en: "Wear comfortable footwear suitable for walking long distances.",
          ar: "ارتدِ حذاءً مريحاً مناسباً للمشي لمسافات طويلة.",
          ur: "لمبی مسافت چلنے کے لیے آرام دہ جوتے پہنیں۔",
          hi: "लंबी दूरी चलने के लिए उपयुक्त आरामदायक जूते पहनें।",
          tr: "Uzun mesafe yürümeye uygun rahat ayakkabılar giyin.",
          ru: "Носите удобную обувь, подходящую для длительной ходьбы.",
        },
      },
      {
        text: {
          en: "Stay hydrated and carry water with you.",
          ar: "حافظ على ترطيب جسمك واحمل معك الماء.",
          ur: "پانی پیتے رہیں اور اپنے ساتھ پانی رکھیں۔",
          hi: "पानी पीते रहें और अपने साथ पानी रखें।",
          tr: "Bol su için ve yanınızda su bulundurun.",
          ru: "Поддерживайте водный баланс и носите с собой воду.",
        },
      },
      {
        text: {
          en: "Keep your group contact information and meeting point noted.",
          ar: "احتفظ بمعلومات الاتصال بمجموعتك ونقطة الالتقاء مدونة.",
          ur: "اپنے گروپ کی رابطہ معلومات اور ملاقات کی جگہ نوٹ رکھیں۔",
          hi: "अपने समूह की संपर्क जानकारी और मिलने की जगह नोट रखें।",
          tr: "Grubunuzun iletişim bilgilerini ve buluşma noktasını not edin.",
          ru: "Запишите контактную информацию вашей группы и место встречи.",
        },
      },
    ],
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Umrah to Umrah is an expiation for the sins committed between them.' (Bukhari & Muslim)",
        ar: "قال النبي ﷺ: 'العمرة إلى العمرة كفارة لما بينهما.' (البخاري ومسلم)",
        ur: "نبی ﷺ نے فرمایا: 'ایک عمرہ سے دوسرے عمرہ تک درمیان کے گناہوں کا کفارہ ہے۔' (بخاری و مسلم)",
        hi: "नबी ﷺ ने फरमाया: 'एक उमरा से दूसरे उमरा तक बीच के गुनाहों का कफ्फारा है।' (बुखारी व मुस्लिम)",
        tr: "Peygamber ﷺ buyurdu: 'Umreden Umreye, ikisi arasındaki günahlara keffarettir.' (Buhari ve Müslim)",
        ru: "Пророк ﷺ сказал: «Умра до Умры — искупление грехов между ними.» (Бухари и Муслим)",
      },
      source: "Bukhari & Muslim",
    },
    importantRulings: [
      {
        text: {
          en: "Ihram must be entered at or before the designated Miqat. If you pass the Miqat without Ihram, please follow the guidance of your Hajj group or trainer.",
          ar: "يجب الدخول في الإحرام عند الميقات أو قبله. إذا تجاوزت الميقات بدون إحرام، يرجى اتباع إرشادات مجموعة الحج أو المدرب.",
          ur: "احرام مقررہ میقات پر یا اس سے پہلے باندھنا ضروری ہے۔ اگر آپ بغیر احرام کے میقات سے گزر گئے تو اپنے حج گروپ یا ٹرینر کی رہنمائی پر عمل کریں۔",
          hi: "इहराम निर्धारित मीकात पर या उससे पहले बांधना ज़रूरी है। अगर आप बिना इहराम के मीकात से गुज़र गए तो अपने हज समूह या ट्रेनर की मार्गदर्शन का पालन करें।",
          tr: "İhram, belirlenmiş Mikat'ta veya öncesinde girilmelidir. Mikat'ı ihrama girmeden geçerseniz, Hac grubunuzun veya eğitmeninizin rehberliğine uyun.",
          ru: "Ихрам должен быть принят на указанном Микате или до него. Если вы проехали Микат без Ихрама, следуйте указаниям вашей группы хаджа или наставника.",
        },
      },
      {
        text: {
          en: "While in Ihram, certain actions are prohibited including using perfume, cutting hair/nails, and (for men) covering the head.",
          ar: "أثناء الإحرام، بعض الأعمال محظورة منها استخدام العطور، وقص الشعر/الأظافر، و(للرجال) تغطية الرأس.",
          ur: "احرام کی حالت میں کچھ اعمال ممنوع ہیں جن میں خوشبو لگانا، بال/ناخن کاٹنا، اور (مردوں کے لیے) سر ڈھانپنا شامل ہے۔",
          hi: "इहराम में कुछ कार्य वर्जित हैं जिनमें खुशबू लगाना, बाल/नाखून काटना, और (पुरुषों के लिए) सिर ढकना शामिल है।",
          tr: "İhramlıyken parfüm kullanmak, saç/tırnak kesmek ve (erkekler için) başı örtmek gibi bazı eylemler yasaktır.",
          ru: "В состоянии Ихрама запрещены определённые действия, включая использование парфюма, стрижку волос/ногтей и (для мужчин) покрытие головы.",
        },
      },
    ],
  },
  {
    id: "umrah-tawaf",
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
      en: "Circumambulate the Ka'bah seven times",
      ar: "الطواف حول الكعبة سبع مرات",
      ur: "کعبہ کے گرد سات چکر لگانا",
      hi: "काबा के चारों ओर सात चक्कर लगाना",
      tr: "Kâbe'yi yedi kez tavaf etmek",
      ru: "Обойти Каабу семь раз",
    },
    whatItIs: {
      en: "Tawaf is the act of walking around the Ka'bah seven times in a counter-clockwise direction. It is a fundamental pillar of Umrah that symbolizes unity of believers in the worship of One God, as they move together in harmony around His sacred house.",
      ar: "الطواف هو المشي حول الكعبة سبع مرات في اتجاه عكس عقارب الساعة. وهو ركن أساسي من أركان العمرة يرمز إلى وحدة المؤمنين في عبادة الله الواحد، حيث يتحركون معاً في انسجام حول بيته المقدس.",
      ur: "طواف کعبہ کے گرد سات مرتبہ گھڑی کی مخالف سمت میں چلنے کا عمل ہے۔ یہ عمرہ کا بنیادی رکن ہے جو ایک خدا کی عبادت میں مومنین کی وحدت کی علامت ہے، جب وہ اس کے مقدس گھر کے گرد ہم آہنگی سے حرکت کرتے ہیں۔",
      hi: "तवाफ काबा के चारों ओर घड़ी की विपरीत दिशा में सात बार चलने का कार्य है। यह उमरा का एक मौलिक स्तंभ है जो एक ईश्वर की इबादत में विश्वासियों की एकता का प्रतीक है, जब वे उसके पवित्र घर के चारों ओर सामंजस्य में एक साथ चलते हैं।",
      tr: "Tavaf, Kâbe'nin etrafında saat yönünün tersine yedi kez yürümektir. Umre'nin temel bir rüknüdür ve inananların tek Allah'a ibadette birliğini simgeler; O'nun kutsal evinin etrafında uyum içinde birlikte hareket ederler.",
      ru: "Таваф — это обход вокруг Каабы семь раз против часовой стрелки. Это фундаментальный столп Умры, символизирующий единство верующих в поклонении Единому Богу, когда они движутся вместе в гармонии вокруг Его священного дома.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "Enter Masjid al-Haram and proceed towards the Ka'bah with humility and reverence.",
          ar: "ادخل المسجد الحرام وتوجه نحو الكعبة بخشوع وتواضع.",
          ur: "مسجد الحرام میں داخل ہوں اور عاجزی اور تعظیم کے ساتھ کعبہ کی طرف بڑھیں۔",
          hi: "मस्जिद अल-हरम में प्रवेश करें और विनम्रता और श्रद्धा के साथ काबा की ओर बढ़ें।",
          tr: "Mescid-i Haram'a girin ve huşu ve saygıyla Kâbe'ye doğru ilerleyin.",
          ru: "Войдите в Масджид аль-Харам и с смирением и благоговением направьтесь к Каабе.",
        },
      },
      {
        step: 2,
        text: {
          en: "Begin at the Black Stone (Hajar al-Aswad). If possible, touch or kiss it. If crowded, simply point towards it and say 'Bismillahi Allahu Akbar'.",
          ar: "ابدأ عند الحجر الأسود. إن أمكن، المسه أو قبّله. إذا كان مزدحماً، أشر إليه فقط وقل 'بسم الله الله أكبر'.",
          ur: "حجر اسود سے شروع کریں۔ اگر ممکن ہو تو اسے چھوئیں یا بوسہ دیں۔ اگر بھیڑ ہو تو صرف اس کی طرف اشارہ کریں اور کہیں 'بسم اللہ اللہ اکبر'۔",
          hi: "हजर-ए-असवद (काला पत्थर) से शुरू करें। अगर संभव हो तो इसे छुएं या चूमें। अगर भीड़ हो तो बस इसकी ओर इशारा करें और कहें 'बिस्मिल्लाहि अल्लाहु अकबर'।",
          tr: "Hacer-i Esved'den başlayın. Mümkünse dokunun veya öpün. Kalabalıksa, sadece işaret edin ve 'Bismillahi Allahu Ekber' deyin.",
          ru: "Начните у Чёрного камня (Хаджар аль-Асвад). Если возможно, прикоснитесь к нему или поцелуйте. Если многолюдно, просто укажите на него и скажите «Бисмилляхи Аллаху Акбар».",
        },
      },
      {
        step: 3,
        text: {
          en: "Walk around the Ka'bah keeping it on your left side. Complete seven full rounds (each round starts and ends at the Black Stone).",
          ar: "امشِ حول الكعبة مع إبقائها على يسارك. أكمل سبعة أشواط كاملة (كل شوط يبدأ وينتهي عند الحجر الأسود).",
          ur: "کعبہ کو اپنے بائیں جانب رکھتے ہوئے اس کے گرد چلیں۔ سات مکمل چکر لگائیں (ہر چکر حجر اسود سے شروع اور ختم ہوتا ہے)۔",
          hi: "काबा को अपनी बाईं ओर रखते हुए उसके चारों ओर चलें। सात पूर्ण चक्कर लगाएं (हर चक्कर काले पत्थर से शुरू और समाप्त होता है)।",
          tr: "Kâbe'yi sol tarafınızda tutarak etrafında yürüyün. Yedi tam tur tamamlayın (her tur Hacer-i Esved'de başlar ve biter).",
          ru: "Идите вокруг Каабы, держа её слева. Завершите семь полных кругов (каждый круг начинается и заканчивается у Чёрного камня).",
        },
      },
      {
        step: 4,
        text: {
          en: "Men should perform Raml (walk briskly) in the first three rounds and walk normally in the remaining four. Women walk at their normal pace throughout.",
          ar: "يجب على الرجال أداء الرمل (المشي السريع) في الأشواط الثلاثة الأولى والمشي بشكل عادي في الأربعة المتبقية. النساء يمشين بوتيرتهن العادية طوال الطواف.",
          ur: "مردوں کو پہلے تین چکروں میں رمل (تیز چلنا) کرنا چاہیے اور باقی چار میں عام رفتار سے چلیں۔ خواتین پوری طواف میں اپنی عام رفتار سے چلیں۔",
          hi: "पुरुषों को पहले तीन चक्करों में रमल (तेज़ चलना) करना चाहिए और बाकी चार में सामान्य गति से चलें। महिलाएं पूरे तवाफ में अपनी सामान्य गति से चलें।",
          tr: "Erkekler ilk üç turda Reml (hızlı yürüme) yapmalı ve kalan dörtte normal yürümelidir. Kadınlar tüm tavaf boyunca normal hızlarında yürür.",
          ru: "Мужчины должны выполнять Рамль (быстрая ходьба) в первых трёх кругах и идти обычным шагом в остальных четырёх. Женщины идут в своём обычном темпе на протяжении всего Тавафа.",
        },
      },
      {
        step: 5,
        text: {
          en: "Between the Yemeni Corner and the Black Stone, recite: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar.'",
          ar: "بين الركن اليماني والحجر الأسود، اقرأ: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.'",
          ur: "رکن یمانی اور حجر اسود کے درمیان پڑھیں: 'ربنا آتنا فی الدنیا حسنۃ و فی الآخرۃ حسنۃ و قنا عذاب النار۔'",
          hi: "यमनी कोने और काले पत्थर के बीच पढ़ें: 'रब्बना आतिना फिद-दुनिया हसनतन व फिल-आखिरति हसनतन व किना अधाबन-नार।'",
          tr: "Rükn-i Yemânî ile Hacer-i Esved arasında okuyun: 'Rabbena atina fid-dünya haseneten ve fil-ahireti haseneten ve kına azaben-nar.'",
          ru: "Между Йеменским углом и Чёрным камнем читайте: «Раббана атина фид-дунья хасанатан ва филь-ахирати хасанатан ва кина азабан-нар.»",
        },
      },
      {
        step: 6,
        text: {
          en: "After completing seven rounds, proceed to Maqam Ibrahim and pray two rak'ahs if possible. If crowded, pray anywhere in the mosque.",
          ar: "بعد إتمام سبعة أشواط، توجه إلى مقام إبراهيم وصلِّ ركعتين إن أمكن. إذا كان مزدحماً، صلِّ في أي مكان في المسجد.",
          ur: "سات چکر مکمل کرنے کے بعد مقام ابراہیم کی طرف جائیں اور اگر ممکن ہو تو دو رکعت نماز پڑھیں۔ اگر بھیڑ ہو تو مسجد میں کہیں بھی نماز پڑھیں۔",
          hi: "सात चक्कर पूरे करने के बाद मकाम इब्राहीम की ओर जाएं और अगर संभव हो तो दो रकात नमाज़ पढ़ें। अगर भीड़ हो तो मस्जिद में कहीं भी नमाज़ पढ़ें।",
          tr: "Yedi turu tamamladıktan sonra Makam-ı İbrahim'e gidin ve mümkünse iki rekât namaz kılın. Kalabalıksa, caminin herhangi bir yerinde kılın.",
          ru: "После завершения семи кругов подойдите к Макаму Ибрахима и совершите два раката, если возможно. Если многолюдно, молитесь в любом месте мечети.",
        },
      },
      {
        step: 7,
        text: {
          en: "Drink Zamzam water and make du'a.",
          ar: "اشرب ماء زمزم وادعُ الله.",
          ur: "زمزم کا پانی پئیں اور دعا کریں۔",
          hi: "ज़मज़म का पानी पिएं और दुआ करें।",
          tr: "Zemzem suyu için ve dua edin.",
          ru: "Выпейте воду Замзам и сделайте дуа.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Walking in the wrong direction (clockwise instead of counter-clockwise).",
          ar: "المشي في الاتجاه الخاطئ (مع عقارب الساعة بدلاً من عكسها).",
          ur: "غلط سمت میں چلنا (گھڑی کی سمت بجائے مخالف سمت)۔",
          hi: "गलत दिशा में चलना (घड़ी की दिशा में बजाय विपरीत दिशा)।",
          tr: "Yanlış yönde yürümek (saat yönünde değil, saat yönünün tersine olmalı).",
          ru: "Идти в неправильном направлении (по часовой стрелке вместо против часовой).",
        },
      },
      {
        text: {
          en: "Pushing or harming others while trying to touch the Black Stone.",
          ar: "الدفع أو إيذاء الآخرين أثناء محاولة لمس الحجر الأسود.",
          ur: "حجر اسود کو چھونے کی کوشش میں دوسروں کو دھکیلنا یا تکلیف دینا۔",
          hi: "काले पत्थर को छूने की कोशिश में दूसरों को धक्का देना या नुकसान पहुंचाना।",
          tr: "Hacer-i Esved'e dokunmaya çalışırken başkalarını itmek veya incitmek.",
          ru: "Толкать или причинять вред другим, пытаясь прикоснуться к Чёрному камню.",
        },
      },
      {
        text: {
          en: "Performing Tawaf without wudu (ablution).",
          ar: "أداء الطواف بدون وضوء.",
          ur: "وضو کے بغیر طواف کرنا۔",
          hi: "वुज़ू (अभ्लूशन) के बिना तवाफ करना।",
          tr: "Abdestsiz tavaf yapmak.",
          ru: "Совершение Тавафа без вуду (омовения).",
        },
      },
      {
        text: {
          en: "Raising your voice excessively or causing disturbance to others.",
          ar: "رفع صوتك بشكل مفرط أو إزعاج الآخرين.",
          ur: "بہت زیادہ آواز بلند کرنا یا دوسروں کو پریشان کرنا۔",
          hi: "बहुत ज़्यादा आवाज़ उठाना या दूसरों को परेशान करना।",
          tr: "Sesinizi aşırı yükseltmek veya başkalarına rahatsızlık vermek.",
          ru: "Чрезмерно повышать голос или беспокоить других.",
        },
      },
    ],
    duaGuidance: {
      en: "There is no specific du'a required for each round. You may recite Quran, make personal du'as, or engage in dhikr. The time between the Yemeni Corner and Black Stone is especially blessed for du'a.",
      ar: "لا يوجد دعاء محدد مطلوب لكل شوط. يمكنك تلاوة القرآن أو الدعاء الشخصي أو الذكر. الوقت بين الركن اليماني والحجر الأسود مبارك بشكل خاص للدعاء.",
      ur: "ہر چکر کے لیے کوئی مخصوص دعا لازم نہیں۔ آپ قرآن تلاوت کر سکتے ہیں، ذاتی دعائیں کر سکتے ہیں، یا ذکر کر سکتے ہیں۔ رکن یمانی اور حجر اسود کے درمیان کا وقت دعا کے لیے خاص طور پر مبارک ہے۔",
      hi: "हर चक्कर के लिए कोई विशेष दुआ ज़रूरी नहीं है। आप कुरआन की तिलावत कर सकते हैं, व्यक्तिगत दुआएं कर सकते हैं, या ज़िक्र कर सकते हैं। यमनी कोने और काले पत्थर के बीच का समय दुआ के लिए विशेष रूप से मुबारक है।",
      tr: "Her tur için belirli bir dua gerekli değildir. Kur'an okuyabilir, kişisel dualar edebilir veya zikir yapabilirsiniz. Rükn-i Yemânî ile Hacer-i Esved arasındaki zaman dua için özellikle mübarektir.",
      ru: "Для каждого круга не требуется определённая дуа. Вы можете читать Коран, делать личные дуа или заниматься зикром. Время между Йеменским углом и Чёрным камнем особенно благословенно для дуа.",
    },
    safetyTips: [
      {
        text: {
          en: "Stay aware of your surroundings and move with the flow of people.",
          ar: "كن على دراية بمحيطك وتحرك مع تدفق الناس.",
          ur: "اپنے ارد گرد کا خیال رکھیں اور لوگوں کے بہاؤ کے ساتھ چلیں۔",
          hi: "अपने आस-पास के बारे में जागरूक रहें और लोगों के प्रवाह के साथ चलें।",
          tr: "Çevrenizin farkında olun ve insanların akışıyla birlikte hareket edin.",
          ru: "Будьте внимательны к окружающей обстановке и двигайтесь вместе с потоком людей.",
        },
      },
      {
        text: {
          en: "Avoid the most crowded areas near the Ka'bah if you have mobility concerns.",
          ar: "تجنب المناطق الأكثر ازدحاماً بالقرب من الكعبة إذا كانت لديك مخاوف تتعلق بالحركة.",
          ur: "اگر آپ کو چلنے پھرنے میں دشواری ہو تو کعبہ کے قریب سب سے زیادہ بھیڑ والے علاقوں سے بچیں۔",
          hi: "अगर आपको चलने-फिरने में परेशानी है तो काबा के पास सबसे भीड़-भाड़ वाले क्षेत्रों से बचें।",
          tr: "Hareket kısıtlılığınız varsa Kâbe yakınındaki en kalabalık alanlardan kaçının.",
          ru: "Избегайте самых многолюдных мест возле Каабы, если у вас есть проблемы с передвижением.",
        },
      },
      {
        text: {
          en: "Take breaks if needed and maintain your physical well-being.",
          ar: "خذ فترات راحة إذا لزم الأمر وحافظ على صحتك البدنية.",
          ur: "اگر ضرورت ہو تو وقفہ لیں اور اپنی جسمانی صحت کا خیال رکھیں۔",
          hi: "ज़रूरत पड़ने पर ब्रेक लें और अपनी शारीरिक भलाई का ध्यान रखें।",
          tr: "Gerekirse mola verin ve fiziksel sağlığınızı koruyun.",
          ru: "Делайте перерывы при необходимости и заботьтесь о своём физическом состоянии.",
        },
      },
    ],
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Whoever performs Tawaf around this House seven times and does it well, it will be as if he freed a slave.' (Tirmidhi)",
        ar: "قال النبي ﷺ: 'من طاف بهذا البيت سبعاً وأحصاه كان كعتق رقبة.' (الترمذي)",
        ur: "نبی ﷺ نے فرمایا: 'جس نے اس گھر کے گرد سات بار طواف کیا اور اچھی طرح کیا، یہ ایسا ہے جیسے اس نے غلام آزاد کیا۔' (ترمذی)",
        hi: "नबी ﷺ ने फरमाया: 'जिसने इस घर के चारों ओर सात बार तवाफ किया और अच्छी तरह किया, यह ऐसा है जैसे उसने एक गुलाम आज़ाद किया।' (तिर्मिज़ी)",
        tr: "Peygamber ﷺ buyurdu: 'Kim bu Evi yedi kez tavaf ederse ve bunu güzel yaparsa, bir köle azat etmiş gibi olur.' (Tirmizi)",
        ru: "Пророк ﷺ сказал: «Кто совершит Таваф вокруг этого Дома семь раз и сделает это хорошо, это будет как если бы он освободил раба.» (Тирмизи)",
      },
      source: "Tirmidhi",
    },
    importantRulings: [
      {
        text: {
          en: "Wudu (ablution) is required for Tawaf. If wudu breaks during Tawaf, please follow the guidance of your Hajj group or trainer.",
          ar: "الوضوء مطلوب للطواف. إذا انتقض وضوؤك أثناء الطواف، يرجى اتباع إرشادات مجموعة الحج أو المدرب.",
          ur: "طواف کے لیے وضو ضروری ہے۔ اگر طواف کے دوران وضو ٹوٹ جائے تو اپنے حج گروپ یا ٹرینر کی رہنمائی پر عمل کریں۔",
          hi: "तवाफ के लिए वुज़ू ज़रूरी है। अगर तवाफ के दौरान वुज़ू टूट जाए तो अपने हज समूह या ट्रेनर की मार्गदर्शन का पालन करें।",
          tr: "Tavaf için abdest gereklidir. Tavaf sırasında abdest bozulursa, Hac grubunuzun veya eğitmeninizin rehberliğine uyun.",
          ru: "Для Тавафа требуется вуду (омовение). Если вуду нарушается во время Тавафа, следуйте указаниям вашей группы хаджа или наставника.",
        },
      },
      {
        text: {
          en: "Each round must be complete. Starting from the Black Stone and ending at the Black Stone counts as one round.",
          ar: "يجب أن يكون كل شوط كاملاً. البدء من الحجر الأسود والانتهاء عنده يعتبر شوطاً واحداً.",
          ur: "ہر چکر مکمل ہونا چاہیے۔ حجر اسود سے شروع ہو کر حجر اسود پر ختم ہونا ایک چکر شمار ہوتا ہے۔",
          hi: "हर चक्कर पूर्ण होना चाहिए। काले पत्थर से शुरू होकर काले पत्थर पर समाप्त होना एक चक्कर माना जाता है।",
          tr: "Her tur tam olmalıdır. Hacer-i Esved'den başlayıp Hacer-i Esved'de bitmek bir tur sayılır.",
          ru: "Каждый круг должен быть полным. Начало от Чёрного камня и окончание у Чёрного камня считается одним кругом.",
        },
      },
    ],
  },
  {
    id: "umrah-sai",
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
      en: "Walk between Safa and Marwah seven times",
      ar: "المشي بين الصفا والمروة سبع مرات",
      ur: "صفا اور مروہ کے درمیان سات مرتبہ چلنا",
      hi: "सफा और मरवा के बीच सात बार चलना",
      tr: "Safa ile Merve arasında yedi kez yürümek",
      ru: "Пройти между Сафой и Марвой семь раз",
    },
    whatItIs: {
      en: "Sa'i is walking between the hills of Safa and Marwah seven times. It commemorates Hajar's (may Allah be pleased with her) search for water for her son Ismail, demonstrating trust in Allah during times of difficulty.",
      ar: "السعي هو المشي بين جبلي الصفا والمروة سبع مرات. وهو إحياء لذكرى بحث هاجر (رضي الله عنها) عن الماء لابنها إسماعيل، مما يدل على الثقة بالله في أوقات الصعوبات.",
      ur: "سعی صفا اور مروہ کی پہاڑیوں کے درمیان سات مرتبہ چلنا ہے۔ یہ حضرت ہاجرہ (رضی اللہ عنہا) کی اپنے بیٹے اسماعیل کے لیے پانی کی تلاش کی یاد میں ہے، جو مشکل وقت میں اللہ پر بھروسے کی علامت ہے۔",
      hi: "सई सफा और मरवा की पहाड़ियों के बीच सात बार चलना है। यह हाजरा (रज़ि अल्लाहु अन्हा) की अपने बेटे इस्माईल के लिए पानी की तलाश की याद में है, जो मुश्किल समय में अल्लाह पर भरोसे का प्रतीक है।",
      tr: "Sa'y, Safa ile Merve tepeleri arasında yedi kez yürümektir. Hz. Hacer'in (radıyallahu anha) oğlu İsmail için su aramasını anmaktadır ve zorluk zamanlarında Allah'a güveni simgelemektedir.",
      ru: "Саи — это хождение между холмами Сафа и Марва семь раз. Это воспоминание о поиске Хаджар (да будет доволен ею Аллах) воды для её сына Исмаила, демонстрирующее доверие к Аллаху в трудные времена.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "After completing Tawaf and the two rak'ahs, proceed to Safa to begin Sa'i.",
          ar: "بعد إتمام الطواف والركعتين، توجه إلى الصفا لبدء السعي.",
          ur: "طواف اور دو رکعت مکمل کرنے کے بعد سعی شروع کرنے کے لیے صفا کی طرف جائیں۔",
          hi: "तवाफ और दो रकात पूरी करने के बाद सई शुरू करने के लिए सफा की ओर जाएं।",
          tr: "Tavaf ve iki rekâtı tamamladıktan sonra Sa'y'a başlamak için Safa'ya gidin.",
          ru: "После завершения Тавафа и двух ракатов направляйтесь к Сафе, чтобы начать Саи.",
        },
      },
      {
        step: 2,
        text: {
          en: "At Safa, face the Ka'bah, raise your hands and make du'a. Recite: 'Innas-Safa wal-Marwata min sha'a'irillah' (Safa and Marwah are among the symbols of Allah).",
          ar: "عند الصفا، استقبل الكعبة وارفع يديك وادعُ. اقرأ: 'إن الصفا والمروة من شعائر الله'.",
          ur: "صفا پر کعبہ کی طرف رخ کریں، ہاتھ اٹھائیں اور دعا کریں۔ پڑھیں: 'إن الصفا والمروۃ من شعائر اللہ' (صفا اور مروہ اللہ کی نشانیوں میں سے ہیں)۔",
          hi: "सफा पर काबा की ओर मुंह करें, हाथ उठाएं और दुआ करें। पढ़ें: 'इन्नस-सफा वल-मरवता मिन शआइरिल्लाह' (सफा और मरवा अल्लाह की निशानियों में से हैं)।",
          tr: "Safa'da Kâbe'ye dönün, ellerinizi kaldırın ve dua edin. Okuyun: 'İnnes-Safa vel-Mervete min şe'airillah' (Safa ve Merve Allah'ın şiarlarındandır).",
          ru: "На Сафе повернитесь лицом к Каабе, поднимите руки и сделайте дуа. Прочитайте: «Иннас-Сафа валь-Марвата мин шаа'ириллях» (Сафа и Марва — из символов Аллаха).",
        },
      },
      {
        step: 3,
        text: {
          en: "Walk from Safa towards Marwah. Men should jog lightly (if able) between the green lights marking the valley area.",
          ar: "امشِ من الصفا نحو المروة. يجب على الرجال الجري الخفيف (إن استطاعوا) بين الأضواء الخضراء التي تحدد منطقة الوادي.",
          ur: "صفا سے مروہ کی طرف چلیں۔ مردوں کو سبز روشنیوں کے درمیان (اگر قدرت ہو) ہلکا دوڑنا چاہیے جو وادی کے علاقے کی نشاندہی کرتی ہیں۔",
          hi: "सफा से मरवा की ओर चलें। पुरुषों को हरी बत्तियों के बीच (अगर संभव हो) हल्का दौड़ना चाहिए जो घाटी क्षेत्र को चिह्नित करती हैं।",
          tr: "Safa'dan Merve'ye doğru yürüyün. Erkekler, vadi bölgesini işaretleyen yeşil ışıklar arasında hafifçe koşmalıdır (yapabiliyorlarsa).",
          ru: "Идите от Сафы к Марве. Мужчинам следует слегка бежать (если могут) между зелёными огнями, отмечающими область долины.",
        },
      },
      {
        step: 4,
        text: {
          en: "Upon reaching Marwah, face the Ka'bah direction, raise your hands and make du'a. This completes one lap.",
          ar: "عند الوصول إلى المروة، استقبل اتجاه الكعبة وارفع يديك وادعُ. هذا يكمل شوطاً واحداً.",
          ur: "مروہ پہنچ کر کعبہ کی سمت رخ کریں، ہاتھ اٹھائیں اور دعا کریں۔ یہ ایک پھیرا مکمل ہوا۔",
          hi: "मरवा पहुंचकर काबा की दिशा में मुंह करें, हाथ उठाएं और दुआ करें। यह एक चक्कर पूरा हुआ।",
          tr: "Merve'ye ulaştığınızda Kâbe yönüne dönün, ellerinizi kaldırın ve dua edin. Bu bir şavt tamamlar.",
          ru: "Достигнув Марвы, повернитесь в сторону Каабы, поднимите руки и сделайте дуа. Это завершает один круг.",
        },
      },
      {
        step: 5,
        text: {
          en: "Continue walking back and forth between Safa and Marwah until you complete seven laps (ending at Marwah).",
          ar: "استمر في المشي ذهاباً وإياباً بين الصفا والمروة حتى تكمل سبعة أشواط (تنتهي عند المروة).",
          ur: "صفا اور مروہ کے درمیان آگے پیچھے چلتے رہیں جب تک سات پھیرے مکمل نہ ہوں (مروہ پر ختم)۔",
          hi: "सफा और मरवा के बीच आगे-पीछे चलते रहें जब तक सात चक्कर पूरे न हों (मरवा पर समाप्त)।",
          tr: "Yedi şavt tamamlayana kadar Safa ile Merve arasında ileri geri yürümeye devam edin (Merve'de biter).",
          ru: "Продолжайте ходить туда и обратно между Сафой и Марвой, пока не завершите семь кругов (заканчивая на Марве).",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Starting Sa'i from Marwah instead of Safa.",
          ar: "بدء السعي من المروة بدلاً من الصفا.",
          ur: "صفا کے بجائے مروہ سے سعی شروع کرنا۔",
          hi: "सफा के बजाय मरवा से सई शुरू करना।",
          tr: "Sa'y'a Safa yerine Merve'den başlamak.",
          ru: "Начинать Саи с Марвы вместо Сафы.",
        },
      },
      {
        text: {
          en: "Miscounting the number of laps (should be 7, ending at Marwah).",
          ar: "الخطأ في عد الأشواط (يجب أن تكون 7، وتنتهي عند المروة).",
          ur: "پھیروں کی غلط گنتی (7 ہونے چاہئیں، مروہ پر ختم)۔",
          hi: "चक्करों की गलत गिनती (7 होने चाहिए, मरवा पर समाप्त)।",
          tr: "Şavt sayısını yanlış saymak (7 olmalı, Merve'de bitmeli).",
          ru: "Неправильный подсчёт кругов (должно быть 7, заканчивая на Марве).",
        },
      },
      {
        text: {
          en: "Performing Sa'i before completing Tawaf.",
          ar: "أداء السعي قبل إتمام الطواف.",
          ur: "طواف مکمل کرنے سے پہلے سعی کرنا۔",
          hi: "तवाफ पूरा करने से पहले सई करना।",
          tr: "Tavafı tamamlamadan Sa'y yapmak.",
          ru: "Совершение Саи до завершения Тавафа.",
        },
      },
      {
        text: {
          en: "Not making du'a at Safa and Marwah.",
          ar: "عدم الدعاء عند الصفا والمروة.",
          ur: "صفا اور مروہ پر دعا نہ کرنا۔",
          hi: "सफा और मरवा पर दुआ न करना।",
          tr: "Safa ve Merve'de dua etmemek.",
          ru: "Не делать дуа на Сафе и Марве.",
        },
      },
    ],
    duaGuidance: {
      en: "Make du'a at Safa and Marwah facing the Ka'bah. You may make any du'a in your own language. There is no specific du'a required during the walk between the two hills—use this time for dhikr, Quran recitation, or personal supplication.",
      ar: "ادعُ عند الصفا والمروة مستقبلاً الكعبة. يمكنك الدعاء بأي لغة. لا يوجد دعاء محدد مطلوب أثناء المشي بين الجبلين—استغل هذا الوقت للذكر أو تلاوة القرآن أو الدعاء الشخصي.",
      ur: "صفا اور مروہ پر کعبہ کی طرف رخ کر کے دعا کریں۔ آپ اپنی زبان میں کوئی بھی دعا کر سکتے ہیں۔ دو پہاڑیوں کے درمیان چلتے ہوئے کوئی خاص دعا لازم نہیں—اس وقت کو ذکر، قرآن تلاوت، یا ذاتی دعا کے لیے استعمال کریں۔",
      hi: "सफा और मरवा पर काबा की ओर मुंह करके दुआ करें। आप अपनी भाषा में कोई भी दुआ कर सकते हैं। दो पहाड़ियों के बीच चलते समय कोई विशेष दुआ ज़रूरी नहीं—इस समय को ज़िक्र, कुरआन तिलावत, या व्यक्तिगत दुआ के लिए इस्तेमाल करें।",
      tr: "Safa ve Merve'de Kâbe'ye dönerek dua edin. Kendi dilinizde herhangi bir dua edebilirsiniz. İki tepe arasında yürürken belirli bir dua gerekli değildir—bu zamanı zikir, Kur'an okuma veya kişisel dua için kullanın.",
      ru: "Делайте дуа на Сафе и Марве, повернувшись лицом к Каабе. Вы можете делать любую дуа на своём языке. Во время ходьбы между двумя холмами не требуется определённой дуа — используйте это время для зикра, чтения Корана или личных молитв.",
    },
    safetyTips: [
      {
        text: {
          en: "The Sa'i area is air-conditioned. Stay hydrated but don't rush.",
          ar: "منطقة السعي مكيفة. حافظ على ترطيب جسمك ولكن لا تتسرع.",
          ur: "سعی کا علاقہ ایئر کنڈیشنڈ ہے۔ پانی پیتے رہیں لیکن جلدی نہ کریں۔",
          hi: "सई का क्षेत्र एयर-कंडीशंड है। पानी पीते रहें लेकिन जल्दी न करें।",
          tr: "Sa'y alanı klimalıdır. Sıvı alımını sürdürün ama acele etmeyin.",
          ru: "Зона Саи оснащена кондиционером. Пейте воду, но не торопитесь.",
        },
      },
      {
        text: {
          en: "Wheelchair paths are available for those who need them.",
          ar: "مسارات الكراسي المتحركة متاحة لمن يحتاجها.",
          ur: "جن کو ضرورت ہو ان کے لیے وہیل چیئر کے راستے دستیاب ہیں۔",
          hi: "जिन्हें ज़रूरत हो उनके लिए व्हीलचेयर के रास्ते उपलब्ध हैं।",
          tr: "İhtiyacı olanlar için tekerlekli sandalye yolları mevcuttur.",
          ru: "Для тех, кто нуждается, доступны дорожки для инвалидных колясок.",
        },
      },
      {
        text: {
          en: "Walk at a comfortable pace, especially if you are elderly or have health concerns.",
          ar: "امشِ بسرعة مريحة، خاصة إذا كنت مسناً أو لديك مخاوف صحية.",
          ur: "آرام دہ رفتار سے چلیں، خاص طور پر اگر آپ بزرگ ہیں یا صحت کے مسائل ہیں۔",
          hi: "आरामदायक गति से चलें, खासकर अगर आप बुज़ुर्ग हैं या स्वास्थ्य संबंधी चिंताएं हैं।",
          tr: "Rahat bir hızda yürüyün, özellikle yaşlıysanız veya sağlık endişeleriniz varsa.",
          ru: "Идите в удобном темпе, особенно если вы пожилой человек или у вас проблемы со здоровьем.",
        },
      },
    ],
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Perform Sa'i, for Allah has prescribed it for you.' (Ahmad)",
        ar: "قال النبي ﷺ: 'اسعوا فإن الله كتب عليكم السعي.' (أحمد)",
        ur: "نبی ﷺ نے فرمایا: 'سعی کرو کیونکہ اللہ نے تم پر سعی فرض کی ہے۔' (احمد)",
        hi: "नबी ﷺ ने फरमाया: 'सई करो क्योंकि अल्लाह ने तुम पर सई फ़र्ज़ की है।' (अहमद)",
        tr: "Peygamber ﷺ buyurdu: 'Sa'y yapın, çünkü Allah onu size farz kılmıştır.' (Ahmed)",
        ru: "Пророк ﷺ сказал: «Совершайте Саи, ибо Аллах предписал его вам.» (Ахмад)",
      },
      source: "Ahmad",
    },
    importantRulings: [
      {
        text: {
          en: "Sa'i must be completed in seven laps: from Safa to Marwah is one lap, from Marwah to Safa is another lap.",
          ar: "يجب إتمام السعي في سبعة أشواط: من الصفا إلى المروة شوط واحد، ومن المروة إلى الصفا شوط آخر.",
          ur: "سعی سات پھیروں میں مکمل ہونی چاہیے: صفا سے مروہ ایک پھیرا، مروہ سے صفا دوسرا پھیرا۔",
          hi: "सई सात चक्करों में पूरी होनी चाहिए: सफा से मरवा एक चक्कर, मरवा से सफा दूसरा चक्कर।",
          tr: "Sa'y yedi şavtta tamamlanmalıdır: Safa'dan Merve'ye bir şavt, Merve'den Safa'ya başka bir şavt.",
          ru: "Саи должен быть завершён за семь кругов: от Сафы до Марвы — один круг, от Марвы до Сафы — другой круг.",
        },
      },
      {
        text: {
          en: "Wudu is not required for Sa'i, but it is recommended to be in a state of purity.",
          ar: "الوضوء غير مطلوب للسعي، لكن يُستحب أن تكون على طهارة.",
          ur: "سعی کے لیے وضو لازم نہیں، لیکن پاکی کی حالت میں رہنا مستحب ہے۔",
          hi: "सई के लिए वुज़ू लाज़िम नहीं, लेकिन पाकी की हालत में रहना मुस्तहब है।",
          tr: "Sa'y için abdest gerekli değildir, ancak temiz olmak müstehaptır.",
          ru: "Вуду не обязателен для Саи, но рекомендуется находиться в состоянии чистоты.",
        },
      },
    ],
  },
  {
    id: "umrah-halq-qasr",
    order: 4,
    title: {
      en: "Halq / Qasr",
      ar: "الحلق / التقصير",
      ur: "حلق / قصر",
      hi: "हल्क / कसर",
      tr: "Halak / Taksir",
      ru: "Хальк / Каср",
    },
    description: {
      en: "Shave or trim your hair to complete Umrah",
      ar: "حلق أو تقصير الشعر لإتمام العمرة",
      ur: "عمرہ مکمل کرنے کے لیے بال منڈوانا یا کتروانا",
      hi: "उमरा पूरा करने के लिए बाल मुंडवाना या कटवाना",
      tr: "Umreyi tamamlamak için saçı tıraş etmek veya kısaltmak",
      ru: "Побрить или подстричь волосы для завершения Умры",
    },
    whatItIs: {
      en: "Halq (shaving the head completely) or Qasr (trimming the hair) marks the completion of Umrah and the exit from the state of Ihram. This act symbolizes renewal, humility before Allah, and the shedding of worldly attachments.",
      ar: "الحلق (حلق الرأس بالكامل) أو التقصير (تقصير الشعر) يمثل إتمام العمرة والخروج من حالة الإحرام. هذا الفعل يرمز إلى التجديد والتواضع أمام الله والتخلي عن التعلقات الدنيوية.",
      ur: "حلق (سر کو مکمل مونڈنا) یا قصر (بال کتروانا) عمرہ کی تکمیل اور احرام کی حالت سے نکلنے کی علامت ہے۔ یہ عمل تجدید، اللہ کے سامنے عاجزی، اور دنیاوی وابستگیوں سے آزادی کی علامت ہے۔",
      hi: "हल्क (सिर को पूरी तरह मुंडवाना) या कसर (बाल कटवाना) उमरा की पूर्णता और इहराम की अवस्था से बाहर निकलने का प्रतीक है। यह कार्य नवीनीकरण, अल्लाह के सामने विनम्रता, और सांसारिक आसक्तियों को छोड़ने का प्रतीक है।",
      tr: "Halak (başı tamamen tıraş etmek) veya Taksir (saçı kısaltmak) Umrenin tamamlanmasını ve ihram halinden çıkışı işaret eder. Bu eylem yenilenmeyi, Allah'ın huzurunda alçakgönüllülüğü ve dünyevi bağlardan arınmayı simgeler.",
      ru: "Хальк (полное бритьё головы) или Каср (укорачивание волос) означает завершение Умры и выход из состояния Ихрама. Этот акт символизирует обновление, смирение перед Аллахом и освобождение от мирских привязанностей.",
    },
    steps: [
      {
        step: 1,
        text: {
          en: "After completing Sa'i at Marwah, proceed to the designated barber area or any licensed barber near the Haram.",
          ar: "بعد إتمام السعي عند المروة، توجه إلى منطقة الحلاقين المخصصة أو أي حلاق مرخص بالقرب من الحرم.",
          ur: "مروہ پر سعی مکمل کرنے کے بعد، مخصوص نائی کے علاقے یا حرم کے قریب کسی لائسنس یافتہ نائی کے پاس جائیں۔",
          hi: "मरवा पर सई पूरी करने के बाद, निर्धारित नाई क्षेत्र या हरम के पास किसी लाइसेंस्ड नाई के पास जाएं।",
          tr: "Merve'de Sa'y'ı tamamladıktan sonra, belirlenen berber alanına veya Harem yakınındaki herhangi bir lisanslı berbere gidin.",
          ru: "После завершения Саи на Марве направляйтесь в специально отведённую зону парикмахеров или к любому лицензированному парикмахеру возле Харама.",
        },
      },
      {
        step: 2,
        text: {
          en: "Men: Choose either Halq (complete head shave - recommended) or Qasr (trimming hair from all parts of the head).",
          ar: "الرجال: اختر إما الحلق (حلق الرأس بالكامل - مستحب) أو التقصير (تقصير الشعر من جميع أجزاء الرأس).",
          ur: "مرد: حلق (مکمل سر منڈوانا - مستحب) یا قصر (سر کے تمام حصوں سے بال کتروانا) میں سے انتخاب کریں۔",
          hi: "पुरुष: हल्क (पूरे सिर की मुंडवाई - अनुशंसित) या कसर (सिर के सभी हिस्सों से बाल कटवाना) में से चुनें।",
          tr: "Erkekler: Halak (tam başı tıraş - tavsiye edilen) veya Taksir (başın tüm kısımlarından saç kısaltma) arasında seçim yapın.",
          ru: "Мужчины: Выберите либо Хальк (полное бритьё головы — рекомендуется), либо Каср (укорачивание волос со всех частей головы).",
        },
      },
      {
        step: 3,
        text: {
          en: "Women: Cut a small portion (about fingertip length) from the ends of your hair. Do not shave.",
          ar: "النساء: قصي جزءاً صغيراً (بطول طرف الإصبع تقريباً) من أطراف شعرك. لا تحلقي.",
          ur: "خواتین: اپنے بالوں کے سروں سے ایک چھوٹا حصہ (تقریباً انگلی کے سرے کے برابر) کاٹیں۔ منڈوائیں نہیں۔",
          hi: "महिलाएं: अपने बालों के सिरों से एक छोटा हिस्सा (लगभग उंगली के सिरे की लंबाई) काटें। मुंडवाएं नहीं।",
          tr: "Kadınlar: Saçınızın uçlarından küçük bir kısım (yaklaşık parmak ucu uzunluğu) kesin. Tıraş etmeyin.",
          ru: "Женщины: Отрежьте небольшую часть (примерно длиной с кончик пальца) от концов волос. Не брейте.",
        },
      },
      {
        step: 4,
        text: {
          en: "After Halq or Qasr, your Umrah is complete. You are now out of Ihram and all restrictions are lifted.",
          ar: "بعد الحلق أو التقصير، عمرتك مكتملة. أنت الآن خارج الإحرام وكل القيود مرفوعة.",
          ur: "حلق یا قصر کے بعد، آپ کا عمرہ مکمل ہے۔ اب آپ احرام سے باہر ہیں اور تمام پابندیاں ختم ہیں۔",
          hi: "हल्क या कसर के बाद, आपका उमरा पूर्ण है। अब आप इहराम से बाहर हैं और सभी प्रतिबंध हट गए हैं।",
          tr: "Halak veya Taksir'den sonra Umreniz tamamlandı. Artık ihramdan çıktınız ve tüm kısıtlamalar kalktı.",
          ru: "После Халька или Касра ваша Умра завершена. Теперь вы вышли из Ихрама, и все ограничения сняты.",
        },
      },
      {
        step: 5,
        text: {
          en: "Thank Allah for enabling you to complete this blessed journey. You may now change into regular clothes.",
          ar: "اشكر الله على توفيقك لإتمام هذه الرحلة المباركة. يمكنك الآن تغيير ملابسك إلى ملابس عادية.",
          ur: "اس مبارک سفر کو مکمل کرنے کی توفیق پر اللہ کا شکر ادا کریں۔ اب آپ عام کپڑے پہن سکتے ہیں۔",
          hi: "इस मुबारक सफ़र को पूरा करने की तौफ़ीक़ के लिए अल्लाह का शुक्र अदा करें। अब आप सामान्य कपड़े पहन सकते हैं।",
          tr: "Bu mübarek yolculuğu tamamlamanız için sizi muvaffak kıldığı için Allah'a şükredin. Artık normal kıyafetlerinizi giyebilirsiniz.",
          ru: "Поблагодарите Аллаха за возможность завершить это благословенное путешествие. Теперь вы можете переодеться в обычную одежду.",
        },
      },
    ],
    mistakes: [
      {
        text: {
          en: "Trimming only a small part of the head instead of hair from all over (for Qasr).",
          ar: "تقصير جزء صغير فقط من الرأس بدلاً من الشعر من جميع أنحاء الرأس (للتقصير).",
          ur: "(قصر کے لیے) سر کے صرف چھوٹے حصے سے بال کاٹنا بجائے پورے سر سے۔",
          hi: "(कसर के लिए) सिर के केवल छोटे हिस्से से बाल काटना बजाय पूरे सिर से।",
          tr: "(Taksir için) Başın tamamından değil sadece küçük bir kısmından saç kısaltmak.",
          ru: "(Для Касра) Укорачивание волос только с небольшой части головы вместо всей головы.",
        },
      },
      {
        text: {
          en: "Exiting Ihram before completing Halq/Qasr.",
          ar: "الخروج من الإحرام قبل إتمام الحلق/التقصير.",
          ur: "حلق/قصر سے پہلے احرام سے نکلنا۔",
          hi: "हल्क/कसर से पहले इहराम से बाहर निकलना।",
          tr: "Halak/Taksir'i tamamlamadan ihramdan çıkmak.",
          ru: "Выход из Ихрама до завершения Халька/Касра.",
        },
      },
      {
        text: {
          en: "Women shaving their heads (this is not permitted for women).",
          ar: "حلق النساء رؤوسهن (هذا غير مسموح للنساء).",
          ur: "خواتین کا سر منڈوانا (یہ خواتین کے لیے جائز نہیں)۔",
          hi: "महिलाओं का सिर मुंडवाना (यह महिलाओं के लिए जायज़ नहीं)।",
          tr: "Kadınların başlarını tıraş etmesi (kadınlar için caiz değildir).",
          ru: "Женщины бреют голову (это не разрешено для женщин).",
        },
      },
    ],
    duaGuidance: {
      en: "Make du'a thanking Allah for the blessing of completing Umrah. Ask for acceptance of your worship and for the opportunity to return. There is no specific du'a required—speak from your heart in any language.",
      ar: "ادعُ شاكراً الله على نعمة إتمام العمرة. اسأل قبول عبادتك وفرصة العودة. لا يوجد دعاء محدد مطلوب—تحدث من قلبك بأي لغة.",
      ur: "عمرہ مکمل کرنے کی نعمت پر اللہ کا شکر ادا کرتے ہوئے دعا کریں۔ اپنی عبادت کی قبولیت اور واپسی کے موقع کی دعا مانگیں۔ کوئی خاص دعا لازم نہیں—کسی بھی زبان میں دل سے بات کریں۔",
      hi: "उमरा पूरा करने की नेमत के लिए अल्लाह का शुक्र अदा करते हुए दुआ करें। अपनी इबादत की कबूलियत और वापसी के मौके की दुआ मांगें। कोई विशेष दुआ ज़रूरी नहीं—किसी भी भाषा में दिल से बात करें।",
      tr: "Umreyi tamamlama nimetinden dolayı Allah'a şükrederek dua edin. İbadetinizin kabul edilmesini ve tekrar gelme fırsatı için dua edin. Belirli bir dua gerekli değil—herhangi bir dilde kalbinizden konuşun.",
      ru: "Сделайте дуа, благодаря Аллаха за благословение завершения Умры. Просите о принятии вашего поклонения и о возможности вернуться. Определённой дуа не требуется — говорите от сердца на любом языке.",
    },
    safetyTips: [
      {
        text: {
          en: "Use only licensed barbers to ensure hygiene and safety.",
          ar: "استخدم فقط الحلاقين المرخصين لضمان النظافة والسلامة.",
          ur: "صفائی اور حفاظت کے لیے صرف لائسنس یافتہ نائی استعمال کریں۔",
          hi: "स्वच्छता और सुरक्षा के लिए केवल लाइसेंस्ड नाई का उपयोग करें।",
          tr: "Hijyen ve güvenliği sağlamak için yalnızca lisanslı berberleri kullanın.",
          ru: "Используйте только лицензированных парикмахеров для обеспечения гигиены и безопасности.",
        },
      },
      {
        text: {
          en: "Be patient during busy times as there may be long queues.",
          ar: "كن صبوراً خلال الأوقات المزدحمة حيث قد تكون هناك طوابير طويلة.",
          ur: "مصروف اوقات میں صبر کریں کیونکہ لمبی قطاریں ہو سکتی ہیں۔",
          hi: "व्यस्त समय में धैर्य रखें क्योंकि लंबी कतारें हो सकती हैं।",
          tr: "Yoğun zamanlarda uzun kuyruklar olabileceği için sabırlı olun.",
          ru: "Будьте терпеливы в загруженное время, так как могут быть длинные очереди.",
        },
      },
      {
        text: {
          en: "Women can trim their own hair in privacy if preferred.",
          ar: "يمكن للنساء تقصير شعرهن بأنفسهن في الخصوصية إذا رغبن.",
          ur: "خواتین چاہیں تو اپنے بال خود پرائیویسی میں کاٹ سکتی ہیں۔",
          hi: "महिलाएं चाहें तो प्राइवेसी में अपने बाल खुद काट सकती हैं।",
          tr: "Kadınlar isterlerse gizlilik içinde kendi saçlarını kesebilirler.",
          ru: "Женщины могут подстричь волосы самостоятельно в уединении, если предпочитают.",
        },
      },
    ],
    hadith: {
      text: {
        en: "The Prophet ﷺ made du'a three times for those who shave their heads and once for those who trim. (Bukhari & Muslim)",
        ar: "دعا النبي ﷺ ثلاث مرات لمن يحلقون رؤوسهم ومرة واحدة لمن يقصرون. (البخاري ومسلم)",
        ur: "نبی ﷺ نے سر منڈوانے والوں کے لیے تین بار اور کتروانے والوں کے لیے ایک بار دعا فرمائی۔ (بخاری و مسلم)",
        hi: "नबी ﷺ ने सिर मुंडवाने वालों के लिए तीन बार और कटवाने वालों के लिए एक बार दुआ फरमाई। (बुखारी व मुस्लिम)",
        tr: "Peygamber ﷺ başını tıraş edenlere üç kez, kısaltanlara bir kez dua etti. (Buhari ve Müslim)",
        ru: "Пророк ﷺ трижды сделал дуа за тех, кто бреет голову, и один раз за тех, кто подстригает. (Бухари и Муслим)",
      },
      source: "Bukhari & Muslim",
    },
    importantRulings: [
      {
        text: {
          en: "Halq (shaving) is more rewarded than Qasr (trimming) for men, but both are valid.",
          ar: "الحلق أفضل ثواباً من التقصير للرجال، لكن كلاهما صحيح.",
          ur: "مردوں کے لیے حلق (منڈوانا) قصر (کتروانا) سے زیادہ ثواب والا ہے، لیکن دونوں درست ہیں۔",
          hi: "पुरुषों के लिए हल्क (मुंडवाना) कसर (कटवाना) से ज़्यादा सवाब वाला है, लेकिन दोनों जायज़ हैं।",
          tr: "Erkekler için Halak (tıraş) Taksir'den (kısaltma) daha fazla sevaplıdır, ancak her ikisi de geçerlidir.",
          ru: "Хальк (бритьё) более вознаграждаем, чем Каср (укорачивание) для мужчин, но оба действительны.",
        },
      },
      {
        text: {
          en: "Women only perform Qasr, cutting approximately a fingertip's length from their hair.",
          ar: "النساء يقمن بالتقصير فقط، بقص ما يقارب طول طرف الإصبع من شعرهن.",
          ur: "خواتین صرف قصر کرتی ہیں، اپنے بالوں سے تقریباً انگلی کے سرے کے برابر کاٹتی ہیں۔",
          hi: "महिलाएं केवल कसर करती हैं, अपने बालों से लगभग उंगली के सिरे की लंबाई काटती हैं।",
          tr: "Kadınlar yalnızca Taksir yapar, saçlarından yaklaşık parmak ucu uzunluğu keserler.",
          ru: "Женщины выполняют только Каср, отрезая примерно длину кончика пальца от волос.",
        },
      },
      {
        text: {
          en: "After Halq/Qasr, all Ihram restrictions are lifted and Umrah is complete.",
          ar: "بعد الحلق/التقصير، ترفع جميع قيود الإحرام وتكتمل العمرة.",
          ur: "حلق/قصر کے بعد، احرام کی تمام پابندیاں ختم ہو جاتی ہیں اور عمرہ مکمل ہو جاتا ہے۔",
          hi: "हल्क/कसर के बाद, इहराम की सभी पाबंदियां खत्म हो जाती हैं और उमरा पूर्ण हो जाता है।",
          tr: "Halak/Taksir'den sonra tüm ihram kısıtlamaları kalkar ve Umre tamamlanır.",
          ru: "После Халька/Касра все ограничения Ихрама снимаются, и Умра завершена.",
        },
      },
    ],
  },
];

// Helper functions for Umrah rituals
export const getUmrahRitualById = (id: string): Ritual | undefined => {
  return UMRAH_RITUALS.find((ritual) => ritual.id === id);
};

export const getNextUmrahRitual = (currentId: string): Ritual | undefined => {
  const currentIndex = UMRAH_RITUALS.findIndex((r) => r.id === currentId);
  if (currentIndex === -1 || currentIndex === UMRAH_RITUALS.length - 1) {
    return undefined;
  }
  return UMRAH_RITUALS[currentIndex + 1];
};

export const getPreviousUmrahRitual = (currentId: string): Ritual | undefined => {
  const currentIndex = UMRAH_RITUALS.findIndex((r) => r.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return UMRAH_RITUALS[currentIndex - 1];
};
