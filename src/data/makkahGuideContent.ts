import { Language } from "@/contexts/LanguageContext";

export interface GuideStep {
  text: Record<Language, string>;
}

export interface MistakeToAvoid {
  text: Record<Language, string>;
}

export interface HadithReference {
  text: Record<Language, string>;
  source: string;
}

export interface MakkahGuideTopic {
  id: string;
  order: number;
  title: Record<Language, string>;
  whatItIs: Record<Language, string>;
  steps: GuideStep[];
  duaGuidance: Record<Language, string>;
  hadith?: HadithReference;
  mistakes: MistakeToAvoid[];
}

export const MAKKAH_GUIDE_TOPICS: MakkahGuideTopic[] = [
  {
    id: "entering-haram",
    order: 1,
    title: {
      en: "Entering Masjid al-Haram",
      ar: "دخول المسجد الحرام",
      ur: "مسجد الحرام میں داخلہ",
      hi: "मस्जिद अल-हराम में प्रवेश",
      tr: "Mescid-i Haram'a Giriş",
      ru: "Вход в Мечеть аль-Харам"
    },
    whatItIs: {
      en: "Masjid al-Haram is the holiest mosque in Islam, surrounding the Kaaba. Entering it is a moment of deep spiritual significance. Pilgrims should prepare their hearts with humility and gratitude.",
      ar: "المسجد الحرام هو أقدس مسجد في الإسلام، يحيط بالكعبة المشرفة. الدخول إليه لحظة ذات أهمية روحية عميقة. يجب على الحجاج تهيئة قلوبهم بالتواضع والشكر.",
      ur: "مسجد الحرام اسلام کی سب سے مقدس مسجد ہے جو کعبہ کے گرد واقع ہے۔ اس میں داخل ہونا گہری روحانی اہمیت کا لمحہ ہے۔ حجاج کو عاجزی اور شکر کے ساتھ اپنے دلوں کو تیار کرنا چاہیے۔",
      hi: "मस्जिद अल-हराम इस्लाम की सबसे पवित्र मस्जिद है, जो काबा को घेरती है। इसमें प्रवेश करना गहरी आध्यात्मिक महत्व का क्षण है। तीर्थयात्रियों को विनम्रता और कृतज्ञता के साथ अपने दिलों को तैयार करना चाहिए।",
      tr: "Mescid-i Haram, Kâbe'yi çevreleyen İslam'ın en kutsal camisidir. Buraya girmek derin manevi öneme sahip bir andır. Hacılar kalplerini tevazu ve şükranla hazırlamalıdır.",
      ru: "Мечеть аль-Харам — самая священная мечеть в исламе, окружающая Каабу. Вход в неё — момент глубокого духовного значения. Паломники должны подготовить свои сердца со смирением и благодарностью."
    },
    steps: [
      {
        text: {
          en: "Perform wudu (ablution) before leaving for the mosque",
          ar: "توضأ قبل الذهاب إلى المسجد",
          ur: "مسجد جانے سے پہلے وضو کریں",
          hi: "मस्जिद जाने से पहले वुज़ू (अब्लूशन) करें",
          tr: "Camiye gitmeden önce abdest alın",
          ru: "Совершите омовение (вуду) перед выходом в мечеть"
        }
      },
      {
        text: {
          en: "Enter with your right foot first",
          ar: "ادخل بقدمك اليمنى أولاً",
          ur: "پہلے دائیں پاؤں سے داخل ہوں",
          hi: "पहले अपने दाएं पैर से प्रवेश करें",
          tr: "Önce sağ ayağınızla girin",
          ru: "Входите сначала правой ногой"
        }
      },
      {
        text: {
          en: "Recite the du'a for entering the mosque",
          ar: "اقرأ دعاء دخول المسجد",
          ur: "مسجد میں داخل ہونے کی دعا پڑھیں",
          hi: "मस्जिद में प्रवेश की दुआ पढ़ें",
          tr: "Camiye giriş duasını okuyun",
          ru: "Прочитайте дуа для входа в мечеть"
        }
      },
      {
        text: {
          en: "Lower your gaze and walk calmly with humility",
          ar: "اخفض بصرك وامش بهدوء وتواضع",
          ur: "نگاہیں نیچی رکھیں اور سکون سے عاجزی کے ساتھ چلیں",
          hi: "अपनी नज़र नीची रखें और विनम्रता से शांति से चलें",
          tr: "Gözlerinizi indirin ve tevazu ile sakin bir şekilde yürüyün",
          ru: "Опустите взгляд и идите спокойно со смирением"
        }
      },
      {
        text: {
          en: "When you first see the Kaaba, stand still and make du'a — this is a blessed moment",
          ar: "عندما ترى الكعبة لأول مرة، قف وادع الله — هذه لحظة مباركة",
          ur: "جب آپ پہلی بار کعبہ دیکھیں، رک کر دعا کریں — یہ ایک مبارک لمحہ ہے",
          hi: "जब आप पहली बार काबा देखें, रुकें और दुआ करें — यह एक बरकत वाला क्षण है",
          tr: "Kâbe'yi ilk gördüğünüzde durun ve dua edin — bu mübarek bir andır",
          ru: "Когда вы впервые увидите Каабу, остановитесь и сделайте дуа — это благословенный момент"
        }
      }
    ],
    duaGuidance: {
      en: "Upon entering: 'Bismillah, Allahumma salli 'ala Muhammad. Allahumma aftah li abwaba rahmatik' (In the name of Allah, O Allah send blessings upon Muhammad. O Allah, open for me the doors of Your mercy). You may make any du'a in your own language.",
      ar: "عند الدخول: 'بسم الله، اللهم صل على محمد. اللهم افتح لي أبواب رحمتك'. يمكنك الدعاء بأي لغة تريدها.",
      ur: "داخل ہوتے وقت: 'بسم اللہ، اللهم صل على محمد۔ اللهم افتح لي أبواب رحمتك'۔ آپ اپنی زبان میں کوئی بھی دعا کر سکتے ہیں۔",
      hi: "प्रवेश करते समय: 'बिस्मिल्लाह, अल्लाहुम्मा सल्लि अला मुहम्मद। अल्लाहुम्मा अफ्ताह ली अब्वाब रहमतिक'। आप अपनी भाषा में कोई भी दुआ कर सकते हैं।",
      tr: "Girerken: 'Bismillah, Allahümme salli ala Muhammed. Allahümme eftah li ebvabe rahmetik'. Kendi dilinizde herhangi bir dua edebilirsiniz.",
      ru: "При входе: 'Бисмиллях, Аллахумма салли аля Мухаммад. Аллахумма ифтах ли абваба рахматик'. Вы можете делать дуа на своём языке."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ would enter the mosque with his right foot and say the du'a for entering.",
        ar: "كان النبي ﷺ يدخل المسجد برجله اليمنى ويقول دعاء الدخول.",
        ur: "نبی ﷺ مسجد میں دائیں پاؤں سے داخل ہوتے اور داخلے کی دعا پڑھتے۔",
        hi: "नबी ﷺ मस्जिद में अपने दाएं पैर से प्रवेश करते और प्रवेश की दुआ पढ़ते थे।",
        tr: "Peygamber ﷺ mescide sağ ayağıyla girer ve giriş duasını okurdu.",
        ru: "Пророк ﷺ входил в мечеть правой ногой и произносил дуа при входе."
      },
      source: "Abu Dawud"
    },
    mistakes: [
      {
        text: {
          en: "Rushing or pushing others while entering",
          ar: "الاندفاع أو دفع الآخرين عند الدخول",
          ur: "داخل ہوتے وقت جلدی کرنا یا دوسروں کو دھکیلنا",
          hi: "प्रवेश करते समय जल्दबाज़ी या दूसरों को धक्का देना",
          tr: "Girerken acele etmek veya başkalarını itmek",
          ru: "Спешка или толкание других при входе"
        }
      },
      {
        text: {
          en: "Talking loudly or using your phone while entering",
          ar: "التحدث بصوت عالٍ أو استخدام الهاتف أثناء الدخول",
          ur: "داخل ہوتے وقت اونچی آواز میں بات کرنا یا فون استعمال کرنا",
          hi: "प्रवेश करते समय ज़ोर से बात करना या फ़ोन का उपयोग करना",
          tr: "Girerken yüksek sesle konuşmak veya telefon kullanmak",
          ru: "Громкие разговоры или использование телефона при входе"
        }
      },
      {
        text: {
          en: "Entering with the left foot first",
          ar: "الدخول بالقدم اليسرى أولاً",
          ur: "بائیں پاؤں سے پہلے داخل ہونا",
          hi: "बाएं पैर से पहले प्रवेश करना",
          tr: "Önce sol ayakla girmek",
          ru: "Вход сначала левой ногой"
        }
      },
      {
        text: {
          en: "Blocking pathways or stopping in crowded areas",
          ar: "سد الممرات أو التوقف في المناطق المزدحمة",
          ur: "راستے روکنا یا بھیڑ والی جگہوں پر رکنا",
          hi: "रास्ते रोकना या भीड़ वाले क्षेत्रों में रुकना",
          tr: "Geçiş yollarını kapatmak veya kalabalık alanlarda durmak",
          ru: "Блокировка проходов или остановка в многолюдных местах"
        }
      }
    ]
  },
  {
    id: "respect-kaaba",
    order: 2,
    title: {
      en: "Respect for the Kaaba",
      ar: "احترام الكعبة",
      ur: "کعبہ کا احترام",
      hi: "काबा का सम्मान",
      tr: "Kâbe'ye Saygı",
      ru: "Уважение к Каабе"
    },
    whatItIs: {
      en: "The Kaaba is the Qibla — the direction Muslims face in prayer. It is the House of Allah, symbolizing unity of the Muslim Ummah. We do not worship the Kaaba; we worship Allah alone and honor what He has made sacred.",
      ar: "الكعبة هي القبلة — الاتجاه الذي يتوجه إليه المسلمون في الصلاة. هي بيت الله، ترمز إلى وحدة الأمة الإسلامية. نحن لا نعبد الكعبة؛ بل نعبد الله وحده ونكرم ما جعله مقدساً.",
      ur: "کعبہ قبلہ ہے — وہ سمت جس کی طرف مسلمان نماز میں رخ کرتے ہیں۔ یہ اللہ کا گھر ہے جو امت مسلمہ کی وحدت کی علامت ہے۔ ہم کعبہ کی عبادت نہیں کرتے؛ ہم صرف اللہ کی عبادت کرتے ہیں اور جو اس نے مقدس بنایا ہے اس کی تعظیم کرتے ہیں۔",
      hi: "काबा किबला है — वह दिशा जिसकी ओर मुसलमान नमाज़ में मुख करते हैं। यह अल्लाह का घर है, जो मुस्लिम उम्मत की एकता का प्रतीक है। हम काबा की पूजा नहीं करते; हम केवल अल्लाह की इबादत करते हैं और जो उसने पवित्र बनाया है उसका सम्मान करते हैं।",
      tr: "Kâbe, Kıble'dir — Müslümanların namazda yöneldiği yön. Allah'ın Evi'dir ve Müslüman Ümmetin birliğini simgeler. Biz Kâbe'ye tapmıyoruz; yalnızca Allah'a ibadet ediyoruz ve O'nun kutsal kıldığına saygı gösteriyoruz.",
      ru: "Кааба — это Кибла, направление, в котором мусульмане обращаются во время молитвы. Это Дом Аллаха, символизирующий единство мусульманской уммы. Мы не поклоняемся Каабе; мы поклоняемся только Аллаху и почитаем то, что Он сделал священным."
    },
    steps: [
      {
        text: {
          en: "Approach the Kaaba with reverence and a humble heart",
          ar: "اقترب من الكعبة بتوقير وقلب متواضع",
          ur: "کعبہ کے قریب عزت اور عاجز دل کے ساتھ جائیں",
          hi: "काबा के पास श्रद्धा और विनम्र हृदय के साथ जाएं",
          tr: "Kâbe'ye hürmet ve mütevazı bir kalple yaklaşın",
          ru: "Приближайтесь к Каабе с почтением и смиренным сердцем"
        }
      },
      {
        text: {
          en: "Keep your attention focused on Allah, not on taking photos",
          ar: "حافظ على تركيزك على الله، وليس على التقاط الصور",
          ur: "اپنی توجہ اللہ پر رکھیں، تصاویر لینے پر نہیں",
          hi: "अपना ध्यान अल्लाह पर केंद्रित रखें, फोटो लेने पर नहीं",
          tr: "Dikkatinizi fotoğraf çekmeye değil, Allah'a odaklayın",
          ru: "Держите своё внимание сосредоточенным на Аллахе, а не на фотографировании"
        }
      },
      {
        text: {
          en: "Avoid pointing at the Kaaba or turning your back to it unnecessarily",
          ar: "تجنب الإشارة إلى الكعبة أو إدارة ظهرك لها دون ضرورة",
          ur: "کعبہ کی طرف اشارہ کرنے یا بلا ضرورت اس کی طرف پیٹھ کرنے سے بچیں",
          hi: "काबा की ओर इशारा करने या अनावश्यक रूप से इसकी ओर पीठ करने से बचें",
          tr: "Kâbe'yi işaret etmekten veya gereksiz yere sırtınızı dönmekten kaçının",
          ru: "Избегайте указывать на Каабу или поворачиваться к ней спиной без необходимости"
        }
      },
      {
        text: {
          en: "If you touch or kiss the Black Stone, do so with calm respect — it is Sunnah, not obligatory",
          ar: "إذا لمست أو قبلت الحجر الأسود، افعل ذلك باحترام وهدوء — إنها سنة وليست واجبة",
          ur: "اگر آپ حجر اسود کو چھوئیں یا چومیں، تو سکون سے عزت کے ساتھ کریں — یہ سنت ہے، فرض نہیں",
          hi: "यदि आप हजर-ए-अस्वद को छूएं या चूमें, तो शांत सम्मान के साथ करें — यह सुन्नत है, अनिवार्य नहीं",
          tr: "Hacer-ül Esved'e dokunur veya öperseniz, bunu sakin bir saygıyla yapın — bu Sünnettir, farz değil",
          ru: "Если вы касаетесь или целуете Чёрный камень, делайте это спокойно и с уважением — это Сунна, не обязательство"
        }
      },
      {
        text: {
          en: "Remember that the sanctity comes from Allah, not from the structure itself",
          ar: "تذكر أن القدسية تأتي من الله، وليس من البناء نفسه",
          ur: "یاد رکھیں کہ تقدس اللہ کی طرف سے ہے، خود عمارت سے نہیں",
          hi: "याद रखें कि पवित्रता अल्लाह से आती है, संरचना से नहीं",
          tr: "Kutsallığın Allah'tan geldiğini, yapının kendisinden değil, unutmayın",
          ru: "Помните, что святость исходит от Аллаха, а не от самого строения"
        }
      }
    ],
    duaGuidance: {
      en: "There is no specific du'a required. Speak to Allah from your heart in any language. Ask for forgiveness, guidance, and blessings for yourself and loved ones.",
      ar: "لا يوجد دعاء محدد مطلوب. تحدث إلى الله من قلبك بأي لغة. اطلب المغفرة والهداية والبركة لنفسك ولأحبائك.",
      ur: "کوئی مخصوص دعا ضروری نہیں۔ کسی بھی زبان میں اپنے دل سے اللہ سے بات کریں۔ اپنے اور اپنے پیاروں کے لیے مغفرت، ہدایت اور برکت مانگیں۔",
      hi: "कोई विशेष दुआ आवश्यक नहीं है। किसी भी भाषा में अपने दिल से अल्लाह से बात करें। अपने और अपने प्रियजनों के लिए माफी, मार्गदर्शन और आशीर्वाद मांगें।",
      tr: "Belirli bir dua gerekli değildir. Herhangi bir dilde kalbinizden Allah'a hitap edin. Kendiniz ve sevdikleriniz için af, hidayet ve bereket isteyin.",
      ru: "Не требуется особой дуа. Обращайтесь к Аллаху от сердца на любом языке. Просите прощения, руководства и благословений для себя и близких."
    },
    hadith: {
      text: {
        en: "Umar ibn al-Khattab said to the Black Stone: 'I know you are only a stone and can neither harm nor benefit. Had I not seen the Prophet ﷺ kiss you, I would not have kissed you.'",
        ar: "قال عمر بن الخطاب للحجر الأسود: 'إني أعلم أنك حجر لا تضر ولا تنفع، ولولا أني رأيت رسول الله ﷺ يقبلك ما قبلتك.'",
        ur: "عمر بن الخطاب نے حجر اسود سے کہا: 'میں جانتا ہوں کہ تو صرف ایک پتھر ہے جو نہ نقصان پہنچا سکتا ہے نہ فائدہ۔ اگر میں نے نبی ﷺ کو تجھے چومتے نہ دیکھا ہوتا تو میں تجھے نہ چومتا۔'",
        hi: "उमर इब्न अल-खत्ताब ने हजर-ए-अस्वद से कहा: 'मैं जानता हूं कि तू केवल एक पत्थर है और न नुकसान पहुंचा सकता है न फायदा। अगर मैंने नबी ﷺ को तुझे चूमते नहीं देखा होता, तो मैं तुझे नहीं चूमता।'",
        tr: "Ömer bin Hattab, Hacer-ül Esved'e şöyle dedi: 'Biliyorum ki sen yalnızca bir taşsın, ne zarar verebilir ne fayda. Rasûlullah ﷺ'ı seni öperken görmeseydim, seni öpmezdim.'",
        ru: "Умар ибн аль-Хаттаб сказал Чёрному камню: 'Я знаю, что ты всего лишь камень и не можешь ни навредить, ни принести пользу. Если бы я не видел, как Пророк ﷺ целует тебя, я бы не поцеловал тебя.'"
      },
      source: "Bukhari & Muslim"
    },
    mistakes: [
      {
        text: {
          en: "Taking excessive photos or selfies during worship",
          ar: "التقاط صور أو سيلفي مفرط أثناء العبادة",
          ur: "عبادت کے دوران بہت زیادہ تصاویر یا سیلفیز لینا",
          hi: "इबादत के दौरान अत्यधिक फोटो या सेल्फी लेना",
          tr: "İbadet sırasında aşırı fotoğraf veya selfie çekmek",
          ru: "Чрезмерное фотографирование или селфи во время поклонения"
        }
      },
      {
        text: {
          en: "Pushing or fighting to touch the Black Stone",
          ar: "الدفع أو المشاجرة للوصول إلى الحجر الأسود",
          ur: "حجر اسود کو چھونے کے لیے دھکا دینا یا لڑنا",
          hi: "हजर-ए-अस्वद को छूने के लिए धक्का देना या लड़ना",
          tr: "Hacer-ül Esved'e dokunmak için itişmek veya kavga etmek",
          ru: "Толкание или борьба, чтобы дотронуться до Чёрного камня"
        }
      },
      {
        text: {
          en: "Believing the Kaaba or Black Stone has independent power",
          ar: "الاعتقاد بأن الكعبة أو الحجر الأسود له قوة مستقلة",
          ur: "یہ یقین رکھنا کہ کعبہ یا حجر اسود کی اپنی طاقت ہے",
          hi: "यह मानना कि काबा या हजर-ए-अस्वद की अपनी शक्ति है",
          tr: "Kâbe veya Hacer-ül Esved'in bağımsız bir güce sahip olduğuna inanmak",
          ru: "Вера в то, что Кааба или Чёрный камень обладают независимой силой"
        }
      },
      {
        text: {
          en: "Leaning on the Kaaba walls or touching the Kiswa roughly",
          ar: "الاستناد على جدران الكعبة أو لمس الكسوة بخشونة",
          ur: "کعبہ کی دیواروں پر ٹیک لگانا یا کسوہ کو سختی سے چھونا",
          hi: "काबा की दीवारों पर टिकना या किस्वा को रूखेपन से छूना",
          tr: "Kâbe duvarlarına yaslanmak veya örtüsüne sertçe dokunmak",
          ru: "Опираться на стены Каабы или грубо касаться покрывала"
        }
      }
    ]
  },
  {
    id: "tawaf-etiquette",
    order: 3,
    title: {
      en: "Tawaf Etiquette",
      ar: "آداب الطواف",
      ur: "طواف کے آداب",
      hi: "तवाफ़ के आदाब",
      tr: "Tavaf Adabı",
      ru: "Этикет тавафа"
    },
    whatItIs: {
      en: "Tawaf is the act of walking around the Kaaba seven times in a counter-clockwise direction. It is an act of devotion and remembrance of Allah. Proper etiquette ensures your Tawaf is accepted and you do not harm others.",
      ar: "الطواف هو المشي حول الكعبة سبع مرات عكس اتجاه عقارب الساعة. إنه عبادة وذكر لله. الآداب الصحيحة تضمن قبول طوافك وعدم إيذاء الآخرين.",
      ur: "طواف کعبہ کے گرد سات بار گھڑی کی مخالف سمت میں چلنا ہے۔ یہ اللہ کی عبادت اور ذکر کا عمل ہے۔ صحیح آداب آپ کے طواف کی قبولیت اور دوسروں کو نقصان نہ پہنچانے کو یقینی بناتے ہیں۔",
      hi: "तवाफ़ काबा के चारों ओर सात बार घड़ी की विपरीत दिशा में चलना है। यह अल्लाह की इबादत और ज़िक्र का कार्य है। उचित आदाब आपके तवाफ़ की स्वीकृति और दूसरों को नुकसान न पहुंचाना सुनिश्चित करते हैं।",
      tr: "Tavaf, Kâbe'nin etrafında saat yönünün tersine yedi kez dönmektir. Bu, Allah'ı anma ve ibadet eylemidir. Doğru adap, tavafınızın kabul edilmesini ve başkalarına zarar vermemenizi sağlar.",
      ru: "Таваф — это обход вокруг Каабы семь раз против часовой стрелки. Это акт поклонения и поминания Аллаха. Правильный этикет обеспечивает принятие вашего тавафа и предотвращает вред другим."
    },
    steps: [
      {
        text: {
          en: "Maintain wudu throughout your Tawaf",
          ar: "حافظ على وضوئك طوال الطواف",
          ur: "پورے طواف میں وضو برقرار رکھیں",
          hi: "पूरे तवाफ़ में वुज़ू बनाए रखें",
          tr: "Tavaf boyunca abdestli olun",
          ru: "Сохраняйте омовение на протяжении всего тавафа"
        }
      },
      {
        text: {
          en: "Walk calmly — do not run, push, or shove others",
          ar: "امش بهدوء — لا تركض أو تدفع أو تزاحم الآخرين",
          ur: "سکون سے چلیں — نہ دوڑیں، نہ دھکیلیں، نہ دوسروں کو دھکا دیں",
          hi: "शांति से चलें — न दौड़ें, न धक्का दें, न दूसरों को धकेलें",
          tr: "Sakin yürüyün — koşmayın, itmeyin veya başkalarını sıkıştırmayın",
          ru: "Идите спокойно — не бегите, не толкайте других"
        }
      },
      {
        text: {
          en: "Keep the Kaaba on your left side as you walk",
          ar: "اجعل الكعبة على يسارك أثناء المشي",
          ur: "چلتے وقت کعبہ کو اپنی بائیں طرف رکھیں",
          hi: "चलते समय काबा को अपनी बाईं ओर रखें",
          tr: "Yürürken Kâbe'yi sol tarafınızda tutun",
          ru: "Держите Каабу слева от себя во время ходьбы"
        }
      },
      {
        text: {
          en: "Focus on dhikr and du'a rather than conversation",
          ar: "ركز على الذكر والدعاء بدلاً من المحادثات",
          ur: "گفتگو کے بجائے ذکر اور دعا پر توجہ دیں",
          hi: "बातचीत के बजाय ज़िक्र और दुआ पर ध्यान दें",
          tr: "Sohbet yerine zikir ve duaya odaklanın",
          ru: "Сосредоточьтесь на зикре и дуа, а не на разговорах"
        }
      },
      {
        text: {
          en: "Be patient with delays and crowds — this is part of the test",
          ar: "كن صبوراً مع التأخير والازدحام — هذا جزء من الاختبار",
          ur: "تاخیر اور بھیڑ میں صبر رکھیں — یہ امتحان کا حصہ ہے",
          hi: "देरी और भीड़ में धैर्य रखें — यह परीक्षा का हिस्सा है",
          tr: "Gecikmeler ve kalabalıklara karşı sabırlı olun — bu imtihanın bir parçasıdır",
          ru: "Будьте терпеливы к задержкам и толпам — это часть испытания"
        }
      }
    ],
    duaGuidance: {
      en: "There is no fixed du'a required for each round. You may recite any du'a, dhikr, or Quran. Between the Yemeni Corner and Black Stone, it is Sunnah to say: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar.'",
      ar: "لا يوجد دعاء محدد لكل شوط. يمكنك قراءة أي دعاء أو ذكر أو قرآن. بين الركن اليماني والحجر الأسود، من السنة أن تقول: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.'",
      ur: "ہر چکر کے لیے کوئی مقررہ دعا ضروری نہیں۔ آپ کوئی بھی دعا، ذکر، یا قرآن پڑھ سکتے ہیں۔ رکن یمانی اور حجر اسود کے درمیان سنت ہے کہ کہیں: 'ربنا آتنا فی الدنیا حسنۃ وفی الآخرۃ حسنۃ وقنا عذاب النار۔'",
      hi: "हर चक्कर के लिए कोई निश्चित दुआ आवश्यक नहीं है। आप कोई भी दुआ, ज़िक्र, या कुरआन पढ़ सकते हैं। यमनी कोने और हजर-ए-अस्वद के बीच सुन्नत है: 'रब्बना आतिना फिद्दुन्या हसनतन व फिल आखिरति हसनतन व किना अज़ाबन्नार।'",
      tr: "Her tur için sabit bir dua gerekli değildir. Herhangi bir dua, zikir veya Kur'an okuyabilirsiniz. Rükn-ü Yemani ile Hacer-ül Esved arasında şu duayı okumak Sünnettir: 'Rabbena atina fid-dünya haseneten ve fil-ahireti haseneten ve kına azaben-nar.'",
      ru: "Нет обязательной дуа для каждого круга. Вы можете читать любую дуа, зикр или Коран. Между Йеменским углом и Чёрным камнем Сунна говорить: 'Раббана атина фид-дунья хасанатан ва филь-ахирати хасанатан ва кина азабан-нар.'"
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ performed Tawaf riding on a camel, touching the Black Stone with a stick when he reached it.",
        ar: "طاف النبي ﷺ على بعير، ويستلم الحجر الأسود بمحجن عندما يصل إليه.",
        ur: "نبی ﷺ نے اونٹ پر سوار ہو کر طواف کیا اور حجر اسود کو چھڑی سے چھوتے تھے جب وہاں پہنچتے۔",
        hi: "नबी ﷺ ने ऊंट पर सवार होकर तवाफ़ किया और हजर-ए-अस्वद को छड़ी से छूते थे जब वहां पहुंचते।",
        tr: "Peygamber ﷺ deve üzerinde tavaf etti ve Hacer-ül Esved'e ulaştığında onu bir asayla selamlardı.",
        ru: "Пророк ﷺ совершал таваф верхом на верблюде, касаясь Чёрного камня палкой, когда достигал его."
      },
      source: "Muslim"
    },
    mistakes: [
      {
        text: {
          en: "Stopping in the flow of people to take photos or rest",
          ar: "التوقف في تدفق الناس لالتقاط الصور أو الراحة",
          ur: "لوگوں کے بہاؤ میں تصاویر لینے یا آرام کے لیے رکنا",
          hi: "फोटो लेने या आराम करने के लिए लोगों के प्रवाह में रुकना",
          tr: "Fotoğraf çekmek veya dinlenmek için insan akışında durmak",
          ru: "Остановка в потоке людей для фотографирования или отдыха"
        }
      },
      {
        text: {
          en: "Raising your voice or arguing during Tawaf",
          ar: "رفع صوتك أو الجدال أثناء الطواف",
          ur: "طواف کے دوران آواز بلند کرنا یا بحث کرنا",
          hi: "तवाफ़ के दौरान आवाज़ ऊंची करना या बहस करना",
          tr: "Tavaf sırasında sesinizi yükseltmek veya tartışmak",
          ru: "Повышать голос или спорить во время тавафа"
        }
      },
      {
        text: {
          en: "Walking in the wrong direction or cutting across the mataf",
          ar: "المشي في الاتجاه الخاطئ أو القطع عبر المطاف",
          ur: "غلط سمت میں چلنا یا مطاف میں راستہ کاٹنا",
          hi: "गलत दिशा में चलना या मताफ़ को पार करना",
          tr: "Yanlış yönde yürümek veya matafı kesmek",
          ru: "Идти в неправильном направлении или пересекать матаф"
        }
      },
      {
        text: {
          en: "Harming others while trying to touch the Black Stone",
          ar: "إيذاء الآخرين أثناء محاولة لمس الحجر الأسود",
          ur: "حجر اسود کو چھونے کی کوشش میں دوسروں کو تکلیف دینا",
          hi: "हजर-ए-अस्वद को छूने की कोशिश में दूसरों को नुकसान पहुंचाना",
          tr: "Hacer-ül Esved'e dokunmaya çalışırken başkalarına zarar vermek",
          ru: "Причинять вред другим, пытаясь коснуться Чёрного камня"
        }
      },
      {
        text: {
          en: "Eating or drinking during Tawaf (unless medically necessary)",
          ar: "الأكل أو الشرب أثناء الطواف (إلا للضرورة الطبية)",
          ur: "طواف کے دوران کھانا پینا (جب تک طبی ضرورت نہ ہو)",
          hi: "तवाफ़ के दौरान खाना-पीना (जब तक चिकित्सकीय आवश्यकता न हो)",
          tr: "Tavaf sırasında yemek veya içmek (tıbbi gereklilik olmadıkça)",
          ru: "Есть или пить во время тавафа (если нет медицинской необходимости)"
        }
      }
    ]
  },
  {
    id: "prayer-behavior",
    order: 4,
    title: {
      en: "Prayer Behavior",
      ar: "سلوك الصلاة",
      ur: "نماز کا طریقہ",
      hi: "नमाज़ का तरीका",
      tr: "Namaz Adabı",
      ru: "Поведение во время молитвы"
    },
    whatItIs: {
      en: "Prayer in Masjid al-Haram carries immense reward. However, the mosque is crowded and shared by millions. Proper prayer behavior ensures you benefit spiritually while respecting others.",
      ar: "الصلاة في المسجد الحرام لها أجر عظيم. ومع ذلك، المسجد مزدحم ويشترك فيه الملايين. السلوك الصحيح في الصلاة يضمن استفادتك روحياً مع احترام الآخرين.",
      ur: "مسجد الحرام میں نماز کا بہت بڑا اجر ہے۔ تاہم مسجد میں بہت زیادہ بھیڑ ہوتی ہے اور لاکھوں لوگ آتے ہیں۔ صحیح نماز کا طریقہ آپ کی روحانی فائدے اور دوسروں کے احترام کو یقینی بناتا ہے۔",
      hi: "मस्जिद अल-हराम में नमाज़ का बहुत बड़ा सवाब है। हालांकि, मस्जिद में भीड़ होती है और लाखों लोग आते हैं। सही नमाज़ का तरीका आपके आध्यात्मिक लाभ और दूसरों के सम्मान को सुनिश्चित करता है।",
      tr: "Mescid-i Haram'da namaz büyük sevap taşır. Ancak cami kalabalıktır ve milyonlarca kişi tarafından paylaşılır. Doğru namaz adabı, başkalarına saygı gösterirken ruhani olarak faydalanmanızı sağlar.",
      ru: "Молитва в Мечети аль-Харам несёт огромную награду. Однако мечеть переполнена и разделена миллионами. Правильное поведение во время молитвы обеспечивает духовную пользу при уважении к другим."
    },
    steps: [
      {
        text: {
          en: "Find a spot that does not block pathways or doorways",
          ar: "ابحث عن مكان لا يسد الممرات أو الأبواب",
          ur: "ایسی جگہ تلاش کریں جو راستوں یا دروازوں کو نہ روکے",
          hi: "ऐसी जगह खोजें जो रास्तों या दरवाज़ों को न रोके",
          tr: "Geçiş yollarını veya kapıları kapatmayan bir yer bulun",
          ru: "Найдите место, которое не блокирует проходы или двери"
        }
      },
      {
        text: {
          en: "Straighten the rows (saff) and fill gaps — this is Sunnah",
          ar: "استو الصفوف واسدوا الفرج — هذه سنة",
          ur: "صفوں کو سیدھا کریں اور خالی جگہیں بھریں — یہ سنت ہے",
          hi: "सफों को सीधा करें और खाली जगहें भरें — यह सुन्नत है",
          tr: "Safları düzleştirin ve boşlukları doldurun — bu Sünnettir",
          ru: "Выравнивайте ряды и заполняйте промежутки — это Сунна"
        }
      },
      {
        text: {
          en: "Keep your prayer mat small and avoid spreading items around you",
          ar: "اجعل سجادتك صغيرة وتجنب نشر أغراضك حولك",
          ur: "اپنی جائے نماز چھوٹی رکھیں اور اپنے ارد گرد سامان نہ پھیلائیں",
          hi: "अपनी जायनमाज़ छोटी रखें और अपने आसपास सामान न फैलाएं",
          tr: "Seccadenizi küçük tutun ve etrafınıza eşya yaymayın",
          ru: "Держите молитвенный коврик маленьким и не раскладывайте вещи вокруг"
        }
      },
      {
        text: {
          en: "After prayer, move away promptly to make space for others",
          ar: "بعد الصلاة، انتقل بسرعة لإفساح المجال للآخرين",
          ur: "نماز کے بعد فوراً ہٹ جائیں تاکہ دوسروں کے لیے جگہ بنے",
          hi: "नमाज़ के बाद तुरंत हटें ताकि दूसरों के लिए जगह बने",
          tr: "Namazdan sonra başkalarına yer açmak için hemen ayrılın",
          ru: "После молитвы быстро уступите место другим"
        }
      },
      {
        text: {
          en: "If you need to rest, find a designated area away from prayer spaces",
          ar: "إذا احتجت للراحة، ابحث عن منطقة مخصصة بعيدة عن أماكن الصلاة",
          ur: "اگر آرام کی ضرورت ہو تو نماز کی جگہوں سے دور مخصوص جگہ تلاش کریں",
          hi: "अगर आराम की ज़रूरत हो तो नमाज़ की जगहों से दूर निर्धारित क्षेत्र में जाएं",
          tr: "Dinlenmeniz gerekiyorsa, namaz alanlarından uzak belirlenmiş bir yer bulun",
          ru: "Если вам нужен отдых, найдите специально отведённое место вдали от молитвенных зон"
        }
      }
    ],
    duaGuidance: {
      en: "After completing your obligatory prayer, make personal du'a in any language. The time after salah is blessed for supplication. Ask for forgiveness and blessings for yourself, family, and the Ummah.",
      ar: "بعد إتمام الصلاة المفروضة، ادع بما شئت بأي لغة. الوقت بعد الصلاة مبارك للدعاء. اطلب المغفرة والبركة لنفسك وعائلتك والأمة.",
      ur: "فرض نماز کے بعد کسی بھی زبان میں ذاتی دعا کریں۔ نماز کے بعد کا وقت دعا کے لیے مبارک ہے۔ اپنے، خاندان اور امت کے لیے مغفرت اور برکت مانگیں۔",
      hi: "फ़र्ज़ नमाज़ के बाद किसी भी भाषा में निजी दुआ करें। नमाज़ के बाद का समय दुआ के लिए मुबारक है। अपने, परिवार और उम्मत के लिए माफ़ी और बरकत मांगें।",
      tr: "Farz namazı tamamladıktan sonra herhangi bir dilde kişisel dua edin. Namaz sonrası dua için mübarek bir zamandır. Kendiniz, aileniz ve Ümmet için af ve bereket isteyin.",
      ru: "После обязательной молитвы делайте личную дуа на любом языке. Время после намаза благословенно для мольбы. Просите прощения и благословений для себя, семьи и уммы."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Straighten your rows, for straightening the rows is part of perfecting the prayer.'",
        ar: "قال النبي ﷺ: 'سووا صفوفكم، فإن تسوية الصفوف من تمام الصلاة.'",
        ur: "نبی ﷺ نے فرمایا: 'اپنی صفیں سیدھی کرو، کیونکہ صفوں کو سیدھا کرنا نماز کی تکمیل کا حصہ ہے۔'",
        hi: "नबी ﷺ ने फ़रमाया: 'अपनी सफ़ें सीधी करो, क्योंकि सफ़ों को सीधा करना नमाज़ को पूर्ण करने का हिस्सा है।'",
        tr: "Peygamber ﷺ buyurdu: 'Saflarınızı düzeltin, çünkü safları düzeltmek namazın tamamlanmasındandır.'",
        ru: "Пророк ﷺ сказал: 'Выравнивайте свои ряды, ибо выравнивание рядов — часть совершенства молитвы.'"
      },
      source: "Bukhari"
    },
    mistakes: [
      {
        text: {
          en: "Reserving large spaces during busy prayer times",
          ar: "حجز مساحات كبيرة خلال أوقات الصلاة المزدحمة",
          ur: "مصروف نماز کے اوقات میں بڑی جگہیں محفوظ کرنا",
          hi: "व्यस्त नमाज़ के समय बड़ी जगहें सुरक्षित करना",
          tr: "Yoğun namaz vakitlerinde büyük alanları ayırmak",
          ru: "Резервирование больших мест в часы пик молитв"
        }
      },
      {
        text: {
          en: "Praying in walkways or emergency exits",
          ar: "الصلاة في الممرات أو مخارج الطوارئ",
          ur: "راستوں یا ایمرجنسی راستوں میں نماز پڑھنا",
          hi: "रास्तों या आपातकालीन निकासों में नमाज़ पढ़ना",
          tr: "Koridorlarda veya acil çıkışlarda namaz kılmak",
          ru: "Молиться в проходах или аварийных выходах"
        }
      },
      {
        text: {
          en: "Sleeping in the prayer areas for extended periods",
          ar: "النوم في مناطق الصلاة لفترات طويلة",
          ur: "نماز کی جگہوں پر لمبے عرصے تک سونا",
          hi: "नमाज़ के क्षेत्रों में लंबे समय तक सोना",
          tr: "Namaz alanlarında uzun süre uyumak",
          ru: "Спать в молитвенных зонах длительное время"
        }
      },
      {
        text: {
          en: "Talking loudly or using phones during prayer",
          ar: "التحدث بصوت عالٍ أو استخدام الهاتف أثناء الصلاة",
          ur: "نماز کے دوران اونچی آواز میں بات کرنا یا فون استعمال کرنا",
          hi: "नमाज़ के दौरान ज़ोर से बात करना या फ़ोन का उपयोग करना",
          tr: "Namaz sırasında yüksek sesle konuşmak veya telefon kullanmak",
          ru: "Громко разговаривать или пользоваться телефоном во время молитвы"
        }
      }
    ]
  },
  {
    id: "general-conduct",
    order: 5,
    title: {
      en: "General Conduct in Makkah",
      ar: "السلوك العام في مكة",
      ur: "مکہ میں عمومی طرز عمل",
      hi: "मक्का में सामान्य आचरण",
      tr: "Mekke'de Genel Davranış",
      ru: "Общее поведение в Мекке"
    },
    whatItIs: {
      en: "Makkah is a sanctuary (Haram) where special rules of conduct apply. All pilgrims should maintain dignity, cleanliness, and respect for others. Your behavior here is part of your worship.",
      ar: "مكة حرم تسري فيه قواعد سلوك خاصة. يجب على جميع الحجاج الحفاظ على الكرامة والنظافة واحترام الآخرين. سلوكك هنا جزء من عبادتك.",
      ur: "مکہ ایک حرم ہے جہاں خاص آداب لاگو ہوتے ہیں۔ تمام حجاج کو وقار، صفائی اور دوسروں کا احترام برقرار رکھنا چاہیے۔ یہاں آپ کا طرز عمل آپ کی عبادت کا حصہ ہے۔",
      hi: "मक्का एक हरम है जहां विशेष आचार नियम लागू होते हैं। सभी तीर्थयात्रियों को गरिमा, स्वच्छता और दूसरों के प्रति सम्मान बनाए रखना चाहिए। यहां आपका व्यवहार आपकी इबादत का हिस्सा है।",
      tr: "Mekke, özel davranış kurallarının geçerli olduğu bir Harem'dir. Tüm hacılar vakar, temizlik ve başkalarına saygıyı korumalıdır. Buradaki davranışınız ibadetinizin bir parçasıdır.",
      ru: "Мекка — это святилище (Харам), где действуют особые правила поведения. Все паломники должны сохранять достоинство, чистоту и уважение к другим. Ваше поведение здесь — часть вашего поклонения."
    },
    steps: [
      {
        text: {
          en: "Speak gently and avoid arguments, even if provoked",
          ar: "تكلم بلطف وتجنب الجدال حتى لو أُثرت",
          ur: "نرمی سے بات کریں اور اشتعال انگیزی پر بھی بحث سے بچیں",
          hi: "धीरे से बोलें और उकसाने पर भी बहस से बचें",
          tr: "Nazikçe konuşun ve kışkırtılsanız bile tartışmaktan kaçının",
          ru: "Говорите мягко и избегайте споров, даже если вас провоцируют"
        }
      },
      {
        text: {
          en: "Dispose of waste properly — cleanliness is part of faith",
          ar: "تخلص من النفايات بشكل صحيح — النظافة من الإيمان",
          ur: "کچرے کو صحیح طریقے سے ٹھکانے لگائیں — صفائی ایمان کا حصہ ہے",
          hi: "कचरे का सही तरीके से निपटान करें — स्वच्छता ईमान का हिस्सा है",
          tr: "Atıkları düzgün şekilde atın — temizlik imanın bir parçasıdır",
          ru: "Правильно утилизируйте мусор — чистота — часть веры"
        }
      },
      {
        text: {
          en: "Dress modestly and appropriately for a sacred place",
          ar: "ارتد ملابس محتشمة ومناسبة لمكان مقدس",
          ur: "مقدس جگہ کے لیے شائستہ اور مناسب لباس پہنیں",
          hi: "पवित्र स्थान के लिए शालीन और उचित पोशाक पहनें",
          tr: "Kutsal bir yer için mütevazı ve uygun giyinin",
          ru: "Одевайтесь скромно и подобающе для священного места"
        }
      },
      {
        text: {
          en: "Help elderly, disabled, or lost pilgrims when you can",
          ar: "ساعد كبار السن والمعاقين والحجاج الضائعين عندما تستطيع",
          ur: "جب ممکن ہو بزرگوں، معذوروں یا گمشدہ حجاج کی مدد کریں",
          hi: "जब संभव हो बुज़ुर्गों, विकलांगों या खोए हुए तीर्थयात्रियों की मदद करें",
          tr: "Yapabildiğinizde yaşlılara, engellilere veya kaybolmuş hacılara yardım edin",
          ru: "Помогайте пожилым, инвалидам или заблудившимся паломникам, когда можете"
        }
      },
      {
        text: {
          en: "Follow the instructions of authorities and security personnel",
          ar: "اتبع تعليمات السلطات ورجال الأمن",
          ur: "حکام اور سیکیورٹی اہلکاروں کی ہدایات پر عمل کریں",
          hi: "अधिकारियों और सुरक्षा कर्मियों के निर्देशों का पालन करें",
          tr: "Yetkililerin ve güvenlik personelinin talimatlarına uyun",
          ru: "Следуйте указаниям властей и охраны"
        }
      }
    ],
    duaGuidance: {
      en: "Whenever you feel overwhelmed or tested, say: 'La hawla wa la quwwata illa billah' (There is no power nor strength except with Allah). Ask Allah for patience and ease.",
      ar: "كلما شعرت بالإرهاق أو الاختبار، قل: 'لا حول ولا قوة إلا بالله'. اسأل الله الصبر واليسر.",
      ur: "جب بھی آپ مشکل یا آزمائش محسوس کریں، کہیں: 'لا حول ولا قوة إلا بالله'۔ اللہ سے صبر اور آسانی مانگیں۔",
      hi: "जब भी आप अभिभूत या परीक्षित महसूस करें, कहें: 'ला हौला वला कुव्वता इल्ला बिल्लाह'। अल्लाह से सब्र और आसानी मांगें।",
      tr: "Bunaldığınızı veya sınandığınızı hissettiğinizde şöyle deyin: 'La havle ve la kuvvete illa billah'. Allah'tan sabır ve kolaylık isteyin.",
      ru: "Когда вы чувствуете себя подавленным или испытуемым, говорите: 'Ля хауля ва ля куввата илля биллях'. Просите Аллаха о терпении и облегчении."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.'",
        ar: "قال النبي ﷺ: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت.'",
        ur: "نبی ﷺ نے فرمایا: 'جو اللہ اور آخرت کے دن پر ایمان رکھتا ہے، وہ اچھی بات کہے یا خاموش رہے۔'",
        hi: "नबी ﷺ ने फ़रमाया: 'जो अल्लाह और आख़िरत के दिन पर ईमान रखता है, वह अच्छी बात कहे या चुप रहे।'",
        tr: "Peygamber ﷺ buyurdu: 'Allah'a ve ahiret gününe iman eden, ya hayır söylesin ya da sussun.'",
        ru: "Пророк ﷺ сказал: 'Кто верит в Аллаха и Последний день, пусть говорит благое или молчит.'"
      },
      source: "Bukhari & Muslim"
    },
    mistakes: [
      {
        text: {
          en: "Arguing with shopkeepers, drivers, or other pilgrims",
          ar: "الجدال مع أصحاب المحلات أو السائقين أو الحجاج الآخرين",
          ur: "دکانداروں، ڈرائیوروں یا دوسرے حجاج سے بحث کرنا",
          hi: "दुकानदारों, ड्राइवरों या अन्य तीर्थयात्रियों से बहस करना",
          tr: "Dükkân sahipleri, sürücüler veya diğer hacılarla tartışmak",
          ru: "Спорить с продавцами, водителями или другими паломниками"
        }
      },
      {
        text: {
          en: "Littering or not maintaining personal hygiene",
          ar: "إلقاء القمامة أو عدم الحفاظ على النظافة الشخصية",
          ur: "کچرا پھینکنا یا ذاتی صفائی کا خیال نہ رکھنا",
          hi: "कचरा फेंकना या व्यक्तिगत स्वच्छता का ध्यान न रखना",
          tr: "Çöp atmak veya kişisel hijyeni korumamak",
          ru: "Мусорить или не соблюдать личную гигиену"
        }
      },
      {
        text: {
          en: "Being impatient or unkind to others in crowded situations",
          ar: "عدم الصبر أو القسوة على الآخرين في المواقف المزدحمة",
          ur: "بھیڑ کے حالات میں بے صبری یا دوسروں سے بدسلوکی",
          hi: "भीड़ की स्थिति में अधीर या दूसरों के साथ असभ्य होना",
          tr: "Kalabalık durumlarda sabırsız veya başkalarına kaba olmak",
          ru: "Быть нетерпеливым или недобрым к другим в многолюдных ситуациях"
        }
      },
      {
        text: {
          en: "Ignoring safety announcements or emergency instructions",
          ar: "تجاهل إعلانات السلامة أو تعليمات الطوارئ",
          ur: "حفاظتی اعلانات یا ہنگامی ہدایات کو نظرانداز کرنا",
          hi: "सुरक्षा घोषणाओं या आपातकालीन निर्देशों को अनदेखा करना",
          tr: "Güvenlik duyurularını veya acil durum talimatlarını görmezden gelmek",
          ru: "Игнорировать объявления о безопасности или экстренные инструкции"
        }
      }
    ]
  }
];

// Helper functions
export const getMakkahGuideTopic = (id: string): MakkahGuideTopic | undefined => {
  return MAKKAH_GUIDE_TOPICS.find(topic => topic.id === id);
};

export const getMakkahGuideTopicByOrder = (order: number): MakkahGuideTopic | undefined => {
  return MAKKAH_GUIDE_TOPICS.find(topic => topic.order === order);
};

export const getNextMakkahGuideTopic = (currentId: string): MakkahGuideTopic | undefined => {
  const currentTopic = getMakkahGuideTopic(currentId);
  if (!currentTopic) return undefined;
  return getMakkahGuideTopicByOrder(currentTopic.order + 1);
};

export const getPreviousMakkahGuideTopic = (currentId: string): MakkahGuideTopic | undefined => {
  const currentTopic = getMakkahGuideTopic(currentId);
  if (!currentTopic) return undefined;
  return getMakkahGuideTopicByOrder(currentTopic.order - 1);
};
