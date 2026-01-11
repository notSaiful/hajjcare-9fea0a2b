import { Language, LocalizedString } from "@/contexts/LanguageContext";

export type GuidanceStatus = "WAIT" | "MOVE" | "PREPARE" | "ASSISTANCE";

export interface GuidanceMessage {
  status: GuidanceStatus;
  instruction: LocalizedString;
  safety?: LocalizedString;
}

export type HajjPhase = 
  | "pre_hajj"
  | "day_8_mina"
  | "day_9_arafat_morning"
  | "day_9_arafat_standing"
  | "day_9_arafat_sunset"
  | "night_muzdalifah"
  | "day_10_rami"
  | "day_10_tawaf"
  | "days_11_12_mina"
  | "day_13_farewell"
  | "post_hajj";

export type LocationZone = 
  | "camp"
  | "mina"
  | "arafat"
  | "muzdalifah"
  | "haram"
  | "jamarat"
  | "transit"
  | "unknown";

export interface GuidanceContext {
  phase: HajjPhase;
  zone: LocationZone;
  isElderly?: boolean;
  isMedicallyVulnerable?: boolean;
  hasGroupSchedule?: boolean;
  officialAdvisory?: string;
}

// Status labels in all languages
export const STATUS_LABELS: Record<GuidanceStatus, LocalizedString> = {
  WAIT: {
    en: "WAIT",
    ar: "انتظر",
    ur: "انتظار",
    hi: "प्रतीक्षा",
    tr: "BEKLE",
    ru: "ЖДИТЕ",
  },
  MOVE: {
    en: "MOVE",
    ar: "تحرك",
    ur: "چلیں",
    hi: "चलें",
    tr: "HAREKET",
    ru: "ДВИЖЕНИЕ",
  },
  PREPARE: {
    en: "PREPARE",
    ar: "استعد",
    ur: "تیار ہوں",
    hi: "तैयार हों",
    tr: "HAZIRLAN",
    ru: "ГОТОВЬТЕСЬ",
  },
  ASSISTANCE: {
    en: "ASSISTANCE",
    ar: "مساعدة",
    ur: "مدد",
    hi: "सहायता",
    tr: "YARDIM",
    ru: "ПОМОЩЬ",
  },
};

// Default fail-safe message
export const FAILSAFE_GUIDANCE: GuidanceMessage = {
  status: "WAIT",
  instruction: {
    en: "Please remain where you are and follow official instructions.",
    ar: "يرجى البقاء في مكانك واتباع التعليمات الرسمية.",
    ur: "براہ کرم اپنی جگہ رہیں اور سرکاری ہدایات پر عمل کریں۔",
    hi: "कृपया अपनी जगह रहें और आधिकारिक निर्देशों का पालन करें।",
    tr: "Lütfen bulunduğunuz yerde kalın ve resmi talimatları takip edin.",
    ru: "Пожалуйста, оставайтесь на месте и следуйте официальным указаниям.",
  },
  safety: {
    en: "Stay calm and hydrated.",
    ar: "ابقَ هادئاً واشرب الماء.",
    ur: "پرسکون رہیں اور پانی پیتے رہیں۔",
    hi: "शांत रहें और पानी पीते रहें।",
    tr: "Sakin olun ve su içmeyi unutmayın.",
    ru: "Сохраняйте спокойствие и пейте воду.",
  },
};

// Phase-specific guidance messages
export const PHASE_GUIDANCE: Record<HajjPhase, Record<LocationZone, GuidanceMessage>> = {
  pre_hajj: {
    camp: {
      status: "PREPARE",
      instruction: {
        en: "Complete your preparation. Ensure you have your ID and essentials packed.",
        ar: "أكمل تحضيراتك. تأكد من حزم هويتك ومستلزماتك.",
        ur: "اپنی تیاری مکمل کریں۔ اپنی شناخت اور ضروری سامان یقینی بنائیں۔",
        hi: "अपनी तैयारी पूरी करें। अपनी पहचान और ज़रूरी सामान पैक करें।",
        tr: "Hazırlığınızı tamamlayın. Kimliğinizi ve gerekli eşyalarınızı paketleyin.",
        ru: "Завершите подготовку. Убедитесь, что у вас есть документы и необходимые вещи.",
      },
      safety: {
        en: "Rest well before the journey begins.",
        ar: "استرح جيداً قبل بدء الرحلة.",
        ur: "سفر شروع ہونے سے پہلے اچھی طرح آرام کریں۔",
        hi: "यात्रा शुरू होने से पहले अच्छी तरह आराम करें।",
        tr: "Yolculuk başlamadan önce iyi dinlenin.",
        ru: "Хорошо отдохните перед началом путешествия.",
      },
    },
    mina: FAILSAFE_GUIDANCE,
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: {
      status: "PREPARE",
      instruction: {
        en: "Perform Umrah rituals if required. Prepare for Hajj starting the 8th of Dhul Hijjah.",
        ar: "أدِّ مناسك العمرة إذا لزم الأمر. استعد للحج بدءاً من الثامن من ذي الحجة.",
        ur: "اگر ضروری ہو تو عمرہ کے مناسک ادا کریں۔ 8 ذی الحجہ سے حج کی تیاری کریں۔",
        hi: "यदि आवश्यक हो तो उमरा करें। 8 ज़िल हिज्जा से हज की तैयारी करें।",
        tr: "Gerekirse Umre ibadetlerini yapın. 8 Zilhicce'de başlayacak hac için hazırlanın.",
        ru: "Совершите умру, если требуется. Готовьтесь к хаджу, начиная с 8-го Зуль-Хиджа.",
      },
    },
    jamarat: FAILSAFE_GUIDANCE,
    transit: FAILSAFE_GUIDANCE,
    unknown: FAILSAFE_GUIDANCE,
  },
  day_8_mina: {
    camp: {
      status: "PREPARE",
      instruction: {
        en: "Prepare to depart for Mina. Wait for your group coordinator's signal.",
        ar: "استعد للانطلاق إلى منى. انتظر إشارة منسق مجموعتك.",
        ur: "منیٰ جانے کی تیاری کریں۔ اپنے گروپ کوآرڈینیٹر کے اشارے کا انتظار کریں۔",
        hi: "मिना जाने की तैयारी करें। अपने समूह समन्वयक के संकेत का इंतज़ार करें।",
        tr: "Mina'ya hareket için hazırlanın. Grup koordinatörünüzün işaretini bekleyin.",
        ru: "Готовьтесь к отправлению в Мину. Ждите сигнала от координатора группы.",
      },
      safety: {
        en: "Carry water and your identification.",
        ar: "احمل الماء وهويتك.",
        ur: "پانی اور اپنی شناخت ساتھ رکھیں۔",
        hi: "पानी और अपना पहचान पत्र साथ रखें।",
        tr: "Su ve kimliğinizi yanınızda bulundurun.",
        ru: "Возьмите воду и удостоверение личности.",
      },
    },
    mina: {
      status: "WAIT",
      instruction: {
        en: "Settle in your tent at Mina. Pray and rest. You will stay here until tomorrow morning.",
        ar: "استقر في خيمتك بمنى. صلِّ واسترح. ستبقى هنا حتى صباح الغد.",
        ur: "منیٰ میں اپنے خیمے میں آرام سے رہیں۔ نماز پڑھیں اور آرام کریں۔ آپ کل صبح تک یہاں رہیں گے۔",
        hi: "मिना में अपने टेंट में बस जाएं। नमाज़ पढ़ें और आराम करें। आप कल सुबह तक यहां रहेंगे।",
        tr: "Mina'daki çadırınıza yerleşin. Namaz kılın ve dinlenin. Yarın sabaha kadar burada kalacaksınız.",
        ru: "Устройтесь в палатке в Мине. Молитесь и отдыхайте. Вы останетесь здесь до завтрашнего утра.",
      },
      safety: {
        en: "Note your tent number and location.",
        ar: "دوّن رقم خيمتك وموقعها.",
        ur: "اپنے خیمے کا نمبر اور مقام نوٹ کریں۔",
        hi: "अपने टेंट का नंबर और स्थान नोट करें।",
        tr: "Çadır numaranızı ve konumunu not edin.",
        ru: "Запишите номер и расположение вашей палатки.",
      },
    },
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: FAILSAFE_GUIDANCE,
    jamarat: FAILSAFE_GUIDANCE,
    transit: {
      status: "MOVE",
      instruction: {
        en: "Proceed calmly with your group to Mina. Stay together and follow your leader.",
        ar: "تحرك بهدوء مع مجموعتك إلى منى. ابقَ مع المجموعة واتبع قائدك.",
        ur: "اپنے گروپ کے ساتھ سکون سے منیٰ کی طرف بڑھیں۔ ساتھ رہیں اور اپنے لیڈر کی پیروی کریں۔",
        hi: "अपने समूह के साथ शांति से मिना की ओर बढ़ें। साथ रहें और अपने नेता का पालन करें।",
        tr: "Grubunuzla birlikte sakin bir şekilde Mina'ya ilerleyin. Birlikte kalın ve liderinizi takip edin.",
        ru: "Спокойно следуйте с группой в Мину. Держитесь вместе и следуйте за лидером.",
      },
    },
    unknown: FAILSAFE_GUIDANCE,
  },
  day_9_arafat_morning: {
    camp: FAILSAFE_GUIDANCE,
    mina: {
      status: "PREPARE",
      instruction: {
        en: "Prepare to leave for Arafat after Fajr. Wait for your group's departure time.",
        ar: "استعد للانطلاق إلى عرفة بعد الفجر. انتظر وقت مغادرة مجموعتك.",
        ur: "فجر کے بعد عرفات جانے کی تیاری کریں۔ اپنے گروپ کی روانگی کا انتظار کریں۔",
        hi: "फज्र के बाद अरफात जाने की तैयारी करें। अपने समूह की रवानगी का इंतज़ार करें।",
        tr: "Fecirden sonra Arafat'a hareket için hazırlanın. Grubunuzun hareket zamanını bekleyin.",
        ru: "Готовьтесь к отправлению в Арафат после Фаджра. Ждите времени отправления группы.",
      },
      safety: {
        en: "This is the most important day. Carry extra water.",
        ar: "هذا أهم يوم. احمل ماءً إضافياً.",
        ur: "یہ سب سے اہم دن ہے۔ زیادہ پانی ساتھ رکھیں۔",
        hi: "यह सबसे महत्वपूर्ण दिन है। अतिरिक्त पानी ले जाएं।",
        tr: "Bu en önemli gün. Fazladan su taşıyın.",
        ru: "Это самый важный день. Возьмите дополнительную воду.",
      },
    },
    arafat: {
      status: "WAIT",
      instruction: {
        en: "You have arrived at Arafat. Rest and make dua until the standing begins at noon.",
        ar: "لقد وصلت إلى عرفة. استرح وادعُ حتى يبدأ الوقوف عند الظهر.",
        ur: "آپ عرفات پہنچ گئے۔ آرام کریں اور دعا کریں جب تک دوپہر کو وقوف شروع نہ ہو۔",
        hi: "आप अरफात पहुंच गए। आराम करें और दुआ करें जब तक दोपहर को वक़ूफ़ शुरू न हो।",
        tr: "Arafat'a vardınız. Öğlen vakfesi başlayana kadar dinlenin ve dua edin.",
        ru: "Вы прибыли в Арафат. Отдыхайте и делайте дуа до начала стояния в полдень.",
      },
    },
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: FAILSAFE_GUIDANCE,
    jamarat: FAILSAFE_GUIDANCE,
    transit: {
      status: "MOVE",
      instruction: {
        en: "Proceed to Arafat with your group. Stay calm and follow your leader.",
        ar: "توجه إلى عرفة مع مجموعتك. ابقَ هادئاً واتبع قائدك.",
        ur: "اپنے گروپ کے ساتھ عرفات کی طرف جائیں۔ پرسکون رہیں اور اپنے لیڈر کی پیروی کریں۔",
        hi: "अपने समूह के साथ अरफात जाएं। शांत रहें और अपने नेता का पालन करें।",
        tr: "Grubunuzla birlikte Arafat'a gidin. Sakin olun ve liderinizi takip edin.",
        ru: "Следуйте в Арафат с группой. Сохраняйте спокойствие и следуйте за лидером.",
      },
    },
    unknown: FAILSAFE_GUIDANCE,
  },
  day_9_arafat_standing: {
    camp: FAILSAFE_GUIDANCE,
    mina: FAILSAFE_GUIDANCE,
    arafat: {
      status: "WAIT",
      instruction: {
        en: "Remain at Arafat. This is the heart of Hajj. Make sincere dua until sunset.",
        ar: "ابقَ في عرفة. هذا قلب الحج. ادعُ بإخلاص حتى الغروب.",
        ur: "عرفات میں رہیں۔ یہ حج کا دل ہے۔ غروب تک مخلصانہ دعا کریں۔",
        hi: "अरफात में रहें। यह हज का दिल है। सूर्यास्त तक सच्ची दुआ करें।",
        tr: "Arafat'ta kalın. Haccın kalbi budur. Gün batımına kadar samimi dua edin.",
        ru: "Оставайтесь в Арафате. Это сердце хаджа. Делайте искренние дуа до заката.",
      },
      safety: {
        en: "Stay hydrated. Use umbrella for shade. Do not leave before sunset.",
        ar: "حافظ على الترطيب. استخدم مظلة للظل. لا تغادر قبل الغروب.",
        ur: "پانی پیتے رہیں۔ سایے کے لیے چھتری استعمال کریں۔ غروب سے پہلے نہ جائیں۔",
        hi: "पानी पीते रहें। छाया के लिए छाता उपयोग करें। सूर्यास्त से पहले न जाएं।",
        tr: "Su içmeyi unutmayın. Gölge için şemsiye kullanın. Gün batmadan ayrılmayın.",
        ru: "Пейте воду. Используйте зонт для тени. Не уходите до заката.",
      },
    },
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: FAILSAFE_GUIDANCE,
    jamarat: FAILSAFE_GUIDANCE,
    transit: FAILSAFE_GUIDANCE,
    unknown: FAILSAFE_GUIDANCE,
  },
  day_9_arafat_sunset: {
    camp: FAILSAFE_GUIDANCE,
    mina: FAILSAFE_GUIDANCE,
    arafat: {
      status: "PREPARE",
      instruction: {
        en: "Sunset has begun. Prepare to depart for Muzdalifah. Wait for your group's signal.",
        ar: "بدأ الغروب. استعد للانطلاق إلى مزدلفة. انتظر إشارة مجموعتك.",
        ur: "غروب شروع ہو گیا۔ مزدلفہ جانے کی تیاری کریں۔ اپنے گروپ کے اشارے کا انتظار کریں۔",
        hi: "सूर्यास्त शुरू हो गया। मुज़दलिफ़ा जाने की तैयारी करें। अपने समूह के संकेत का इंतज़ार करें।",
        tr: "Gün batımı başladı. Müzdelife'ye hareket için hazırlanın. Grubunuzun işaretini bekleyin.",
        ru: "Закат начался. Готовьтесь к отправлению в Муздалифу. Ждите сигнала группы.",
      },
      safety: {
        en: "Do not pray Maghrib until you reach Muzdalifah.",
        ar: "لا تصلِّ المغرب حتى تصل إلى مزدلفة.",
        ur: "مزدلفہ پہنچنے تک مغرب نہ پڑھیں۔",
        hi: "मुज़दलिफ़ा पहुंचने तक मग़रिब न पढ़ें।",
        tr: "Müzdelife'ye ulaşana kadar Akşam namazını kılmayın.",
        ru: "Не молитесь Магриб, пока не достигнете Муздалифы.",
      },
    },
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: FAILSAFE_GUIDANCE,
    jamarat: FAILSAFE_GUIDANCE,
    transit: {
      status: "MOVE",
      instruction: {
        en: "Proceed to Muzdalifah with your group. The journey may take time. Stay patient.",
        ar: "توجه إلى مزدلفة مع مجموعتك. قد تستغرق الرحلة وقتاً. كن صبوراً.",
        ur: "اپنے گروپ کے ساتھ مزدلفہ کی طرف جائیں۔ سفر میں وقت لگ سکتا ہے۔ صبر رکھیں۔",
        hi: "अपने समूह के साथ मुज़दलिफ़ा की ओर जाएं। यात्रा में समय लग सकता है। धैर्य रखें।",
        tr: "Grubunuzla birlikte Müzdelife'ye gidin. Yolculuk zaman alabilir. Sabırlı olun.",
        ru: "Следуйте в Муздалифу с группой. Путь может занять время. Будьте терпеливы.",
      },
    },
    unknown: FAILSAFE_GUIDANCE,
  },
  night_muzdalifah: {
    camp: FAILSAFE_GUIDANCE,
    mina: FAILSAFE_GUIDANCE,
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: {
      status: "WAIT",
      instruction: {
        en: "You are at Muzdalifah. Pray Maghrib and Isha combined. Collect pebbles and rest.",
        ar: "أنت في مزدلفة. صلِّ المغرب والعشاء جمعاً. اجمع الحصى واسترح.",
        ur: "آپ مزدلفہ میں ہیں۔ مغرب اور عشاء جمع پڑھیں۔ کنکریاں جمع کریں اور آرام کریں۔",
        hi: "आप मुज़दलिफ़ा में हैं। मग़रिब और इशा मिलाकर पढ़ें। कंकड़ इकट्ठा करें और आराम करें।",
        tr: "Müzdelife'desiniz. Akşam ve Yatsı namazlarını birleştirerek kılın. Taş toplayın ve dinlenin.",
        ru: "Вы в Муздалифе. Совершите Магриб и Иша вместе. Соберите камешки и отдохните.",
      },
      safety: {
        en: "Stay with your group. The area is crowded and dark.",
        ar: "ابقَ مع مجموعتك. المنطقة مزدحمة ومظلمة.",
        ur: "اپنے گروپ کے ساتھ رہیں۔ علاقہ بھیڑ والا اور اندھیرا ہے۔",
        hi: "अपने समूह के साथ रहें। क्षेत्र भीड़ वाला और अंधेरा है।",
        tr: "Grubunuzla birlikte kalın. Alan kalabalık ve karanlıktır.",
        ru: "Оставайтесь с группой. Место многолюдное и тёмное.",
      },
    },
    haram: FAILSAFE_GUIDANCE,
    jamarat: FAILSAFE_GUIDANCE,
    transit: FAILSAFE_GUIDANCE,
    unknown: FAILSAFE_GUIDANCE,
  },
  day_10_rami: {
    camp: FAILSAFE_GUIDANCE,
    mina: {
      status: "WAIT",
      instruction: {
        en: "You are in Mina. Wait for your turn to perform Rami at Jamarat.",
        ar: "أنت في منى. انتظر دورك لأداء الرمي في الجمرات.",
        ur: "آپ منیٰ میں ہیں۔ جمرات پر رمی کے لیے اپنی باری کا انتظار کریں۔",
        hi: "आप मिना में हैं। जमरात पर रमी के लिए अपनी बारी का इंतज़ार करें।",
        tr: "Mina'dasınız. Cemerat'ta taşlama için sıranızı bekleyin.",
        ru: "Вы в Мине. Ждите своей очереди для Рами в Джамарате.",
      },
    },
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: {
      status: "PREPARE",
      instruction: {
        en: "Prepare to leave for Mina after Fajr. Elderly may leave after midnight.",
        ar: "استعد للانطلاق إلى منى بعد الفجر. كبار السن يمكنهم المغادرة بعد منتصف الليل.",
        ur: "فجر کے بعد منیٰ جانے کی تیاری کریں۔ بزرگ آدھی رات کے بعد جا سکتے ہیں۔",
        hi: "फज्र के बाद मिना जाने की तैयारी करें। बुज़ुर्ग आधी रात के बाद जा सकते हैं।",
        tr: "Fecirden sonra Mina'ya hareket için hazırlanın. Yaşlılar gece yarısından sonra gidebilir.",
        ru: "Готовьтесь к отправлению в Мину после Фаджра. Пожилые могут уехать после полуночи.",
      },
    },
    haram: FAILSAFE_GUIDANCE,
    jamarat: {
      status: "MOVE",
      instruction: {
        en: "Stone the large pillar with 7 pebbles. Say Allahu Akbar with each throw. Then leave.",
        ar: "ارمِ الجمرة الكبرى بسبع حصيات. قل الله أكبر مع كل رمية. ثم غادر.",
        ur: "بڑے ستون پر 7 کنکریاں ماریں۔ ہر پھینک کے ساتھ اللہ اکبر کہیں۔ پھر چلے جائیں۔",
        hi: "बड़े स्तंभ पर 7 कंकड़ मारें। हर फेंक के साथ अल्लाहु अकबर कहें। फिर चले जाएं।",
        tr: "Büyük sütuna 7 taş atın. Her atışta Allahu Ekber deyin. Sonra ayrılın.",
        ru: "Бросьте 7 камешков в большой столб. Говорите Аллаху Акбар с каждым броском. Затем уходите.",
      },
      safety: {
        en: "Stay calm in crowds. Do not push.",
        ar: "ابقَ هادئاً في الزحام. لا تدفع.",
        ur: "بھیڑ میں پرسکون رہیں۔ دھکا نہ دیں۔",
        hi: "भीड़ में शांत रहें। धक्का न दें।",
        tr: "Kalabalıkta sakin kalın. İtmeyin.",
        ru: "Сохраняйте спокойствие в толпе. Не толкайтесь.",
      },
    },
    transit: {
      status: "MOVE",
      instruction: {
        en: "Proceed calmly to your destination. Follow your group leader.",
        ar: "تقدم بهدوء إلى وجهتك. اتبع قائد مجموعتك.",
        ur: "سکون سے اپنی منزل کی طرف بڑھیں۔ اپنے گروپ لیڈر کی پیروی کریں۔",
        hi: "शांति से अपनी मंज़िल की ओर बढ़ें। अपने समूह नेता का पालन करें।",
        tr: "Sakin bir şekilde hedefinize ilerleyin. Grup liderinizi takip edin.",
        ru: "Спокойно следуйте к месту назначения. Следуйте за лидером группы.",
      },
    },
    unknown: FAILSAFE_GUIDANCE,
  },
  day_10_tawaf: {
    camp: FAILSAFE_GUIDANCE,
    mina: {
      status: "PREPARE",
      instruction: {
        en: "After Rami, prepare for Tawaf al-Ifadah at Masjid al-Haram.",
        ar: "بعد الرمي، استعد لطواف الإفاضة في المسجد الحرام.",
        ur: "رمی کے بعد مسجد الحرام میں طواف الافاضہ کی تیاری کریں۔",
        hi: "रमी के बाद मस्जिद अल-हरम में तवाफ अल-इफ़ादा की तैयारी करें।",
        tr: "Rami'den sonra Mescid-i Haram'da Tavaf-ı İfaza için hazırlanın.",
        ru: "После Рами готовьтесь к Тавафу аль-Ифада в Мечети аль-Харам.",
      },
    },
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: {
      status: "MOVE",
      instruction: {
        en: "Perform Tawaf al-Ifadah. Circle the Kaaba seven times. This is obligatory for Hajj.",
        ar: "أدِّ طواف الإفاضة. طُف حول الكعبة سبع مرات. هذا ركن من أركان الحج.",
        ur: "طواف الافاضہ ادا کریں۔ کعبہ کے گرد سات چکر لگائیں۔ یہ حج کا رکن ہے۔",
        hi: "तवाफ अल-इफ़ादा करें। काबा के चारों ओर सात चक्कर लगाएं। यह हज के लिए अनिवार्य है।",
        tr: "Tavaf-ı İfaza'yı yapın. Kâbe'nin etrafında yedi kez dönün. Bu haccın farzlarındandır.",
        ru: "Совершите Таваф аль-Ифада. Обойдите Каабу семь раз. Это обязательно для хаджа.",
      },
      safety: {
        en: "Take your time. Do not rush.",
        ar: "خذ وقتك. لا تتعجل.",
        ur: "اپنا وقت لیں۔ جلدی نہ کریں۔",
        hi: "अपना समय लें। जल्दबाजी न करें।",
        tr: "Acelenizi almayın.",
        ru: "Не торопитесь.",
      },
    },
    jamarat: FAILSAFE_GUIDANCE,
    transit: {
      status: "MOVE",
      instruction: {
        en: "Proceed to Masjid al-Haram for Tawaf al-Ifadah.",
        ar: "توجه إلى المسجد الحرام لطواف الإفاضة.",
        ur: "طواف الافاضہ کے لیے مسجد الحرام کی طرف جائیں۔",
        hi: "तवाफ अल-इफ़ादा के लिए मस्जिद अल-हरम की ओर जाएं।",
        tr: "Tavaf-ı İfaza için Mescid-i Haram'a gidin.",
        ru: "Следуйте в Мечеть аль-Харам для Тавафа аль-Ифада.",
      },
    },
    unknown: FAILSAFE_GUIDANCE,
  },
  days_11_12_mina: {
    camp: FAILSAFE_GUIDANCE,
    mina: {
      status: "WAIT",
      instruction: {
        en: "Stay in Mina. Perform Rami at all three pillars after Dhuhr each day.",
        ar: "ابقَ في منى. أدِّ الرمي على الجمرات الثلاث بعد الظهر كل يوم.",
        ur: "منیٰ میں رہیں۔ ہر روز ظہر کے بعد تینوں ستونوں پر رمی کریں۔",
        hi: "मिना में रहें। हर दिन ज़ुहर के बाद तीनों स्तंभों पर रमी करें।",
        tr: "Mina'da kalın. Her gün Öğle'den sonra üç sütunun hepsini taşlayın.",
        ru: "Оставайтесь в Мине. Совершайте Рами у всех трёх столбов после Зухра каждый день.",
      },
      safety: {
        en: "Rest in your tent between rituals.",
        ar: "استرح في خيمتك بين المناسك.",
        ur: "مناسک کے درمیان اپنے خیمے میں آرام کریں۔",
        hi: "अनुष्ठानों के बीच अपने टेंट में आराम करें।",
        tr: "İbadetler arasında çadırınızda dinlenin.",
        ru: "Отдыхайте в палатке между ритуалами.",
      },
    },
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: FAILSAFE_GUIDANCE,
    jamarat: {
      status: "MOVE",
      instruction: {
        en: "Stone all three pillars: small, medium, then large. 7 pebbles each. Make dua after first two.",
        ar: "ارمِ الجمرات الثلاث: الصغرى ثم الوسطى ثم الكبرى. 7 حصيات لكل منها. ادعُ بعد الأوليين.",
        ur: "تینوں ستونوں پر کنکریاں ماریں: چھوٹا، درمیانہ، پھر بڑا۔ ہر ایک پر 7 کنکریاں۔ پہلے دو کے بعد دعا کریں۔",
        hi: "तीनों स्तंभों पर कंकड़ मारें: छोटा, मध्यम, फिर बड़ा। प्रत्येक पर 7 कंकड़। पहले दो के बाद दुआ करें।",
        tr: "Üç sütunu taşlayın: küçük, orta, sonra büyük. Her birine 7 taş. İlk ikisinden sonra dua edin.",
        ru: "Бросайте камни во все три столба: маленький, средний, затем большой. По 7 камешков каждый. Делайте дуа после первых двух.",
      },
    },
    transit: {
      status: "MOVE",
      instruction: {
        en: "Proceed to Jamarat for stoning. Follow crowd management instructions.",
        ar: "توجه إلى الجمرات للرمي. اتبع تعليمات إدارة الحشود.",
        ur: "رمی کے لیے جمرات کی طرف جائیں۔ بھیڑ کے انتظام کی ہدایات پر عمل کریں۔",
        hi: "पत्थर मारने के लिए जमरात जाएं। भीड़ प्रबंधन निर्देशों का पालन करें।",
        tr: "Taşlama için Cemerat'a gidin. Kalabalık yönetimi talimatlarını takip edin.",
        ru: "Следуйте к Джамарату для бросания камней. Следуйте указаниям по управлению толпой.",
      },
    },
    unknown: FAILSAFE_GUIDANCE,
  },
  day_13_farewell: {
    camp: FAILSAFE_GUIDANCE,
    mina: {
      status: "PREPARE",
      instruction: {
        en: "Complete final Rami if staying. Then prepare to leave Mina for Tawaf al-Wida.",
        ar: "أكمل الرمي الأخير إذا بقيت. ثم استعد لمغادرة منى لطواف الوداع.",
        ur: "اگر رکے ہیں تو آخری رمی مکمل کریں۔ پھر طواف الوداع کے لیے منیٰ چھوڑنے کی تیاری کریں۔",
        hi: "अगर रुके हैं तो अंतिम रमी पूरी करें। फिर तवाफ अल-विदा के लिए मिना छोड़ने की तैयारी करें।",
        tr: "Kalıyorsanız son taşlamayı tamamlayın. Sonra Veda Tavafı için Mina'dan ayrılmaya hazırlanın.",
        ru: "Завершите последний Рами, если остаётесь. Затем готовьтесь покинуть Мину для Тавафа аль-Вида.",
      },
    },
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: {
      status: "MOVE",
      instruction: {
        en: "Perform Tawaf al-Wida (Farewell Tawaf). This should be your last act before leaving Makkah.",
        ar: "أدِّ طواف الوداع. يجب أن يكون هذا آخر عمل لك قبل مغادرة مكة.",
        ur: "طواف الوداع ادا کریں۔ مکہ چھوڑنے سے پہلے یہ آپ کا آخری عمل ہونا چاہیے۔",
        hi: "तवाफ अल-विदा (विदाई तवाफ) करें। मक्का छोड़ने से पहले यह आपका अंतिम कार्य होना चाहिए।",
        tr: "Veda Tavafı yapın. Mekke'den ayrılmadan önce bu son işiniz olmalı.",
        ru: "Совершите Таваф аль-Вида (прощальный Таваф). Это должно быть вашим последним действием перед отъездом из Мекки.",
      },
      safety: {
        en: "Do not delay departure after this Tawaf.",
        ar: "لا تؤخر المغادرة بعد هذا الطواف.",
        ur: "اس طواف کے بعد روانگی میں تاخیر نہ کریں۔",
        hi: "इस तवाफ के बाद रवानगी में देरी न करें।",
        tr: "Bu tavaftan sonra ayrılmayı geciktirmeyin.",
        ru: "Не откладывайте отъезд после этого Тавафа.",
      },
    },
    jamarat: FAILSAFE_GUIDANCE,
    transit: {
      status: "MOVE",
      instruction: {
        en: "Proceed to Masjid al-Haram for Tawaf al-Wida.",
        ar: "توجه إلى المسجد الحرام لطواف الوداع.",
        ur: "طواف الوداع کے لیے مسجد الحرام کی طرف جائیں۔",
        hi: "तवाफ अल-विदा के लिए मस्जिद अल-हरम की ओर जाएं।",
        tr: "Veda Tavafı için Mescid-i Haram'a gidin.",
        ru: "Следуйте в Мечеть аль-Харам для Тавафа аль-Вида.",
      },
    },
    unknown: FAILSAFE_GUIDANCE,
  },
  post_hajj: {
    camp: {
      status: "WAIT",
      instruction: {
        en: "Hajj is complete. May Allah accept your Hajj. Rest and follow departure instructions.",
        ar: "اكتمل الحج. تقبل الله حجك. استرح واتبع تعليمات المغادرة.",
        ur: "حج مکمل ہو گیا۔ اللہ آپ کا حج قبول فرمائے۔ آرام کریں اور روانگی کی ہدایات پر عمل کریں۔",
        hi: "हज पूर्ण हो गया। अल्लाह आपका हज क़बूल करे। आराम करें और रवानगी निर्देशों का पालन करें।",
        tr: "Hac tamamlandı. Allah haccınızı kabul etsin. Dinlenin ve hareket talimatlarını takip edin.",
        ru: "Хадж завершён. Да примет Аллах ваш хадж. Отдыхайте и следуйте указаниям по отъезду.",
      },
    },
    mina: FAILSAFE_GUIDANCE,
    arafat: FAILSAFE_GUIDANCE,
    muzdalifah: FAILSAFE_GUIDANCE,
    haram: {
      status: "WAIT",
      instruction: {
        en: "Hajj is complete. You may perform additional prayers. Follow departure schedule.",
        ar: "اكتمل الحج. يمكنك أداء صلوات إضافية. اتبع جدول المغادرة.",
        ur: "حج مکمل ہو گیا۔ آپ اضافی نمازیں ادا کر سکتے ہیں۔ روانگی کے شیڈول پر عمل کریں۔",
        hi: "हज पूर्ण हो गया। आप अतिरिक्त नमाज़ पढ़ सकते हैं। रवानगी शेड्यूल का पालन करें।",
        tr: "Hac tamamlandı. Ek namazlar kılabilirsiniz. Hareket programını takip edin.",
        ru: "Хадж завершён. Вы можете совершить дополнительные молитвы. Следуйте расписанию отъезда.",
      },
    },
    jamarat: FAILSAFE_GUIDANCE,
    transit: FAILSAFE_GUIDANCE,
    unknown: FAILSAFE_GUIDANCE,
  },
};

// Elderly-specific modifications
export const getElderlyModification = (language: Language): string => {
  const modifications: LocalizedString = {
    en: "Take your time. Rest when needed.",
    ar: "خذ وقتك. استرح عند الحاجة.",
    ur: "اپنا وقت لیں۔ ضرورت پر آرام کریں۔",
    hi: "अपना समय लें। ज़रूरत पर आराम करें।",
  };
  return modifications[language] || modifications.en;
};

// Get guidance based on context
export const getGuidance = (context: GuidanceContext): GuidanceMessage => {
  try {
    const phaseGuidance = PHASE_GUIDANCE[context.phase];
    if (!phaseGuidance) {
      return FAILSAFE_GUIDANCE;
    }

    const zoneGuidance = phaseGuidance[context.zone];
    if (!zoneGuidance) {
      return FAILSAFE_GUIDANCE;
    }

    return zoneGuidance;
  } catch {
    return FAILSAFE_GUIDANCE;
  }
};
