import { Language, LocalizedString } from "@/contexts/LanguageContext";

export interface GuideStep {
  text: LocalizedString;
}

export interface MistakeToAvoid {
  text: LocalizedString;
}

export interface HadithReference {
  text: LocalizedString;
  source: string;
}

export interface MakkahGuideTopic {
  id: string;
  order: number;
  title: LocalizedString;
  whatItIs: LocalizedString;
  steps: GuideStep[];
  duaGuidance: LocalizedString;
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
  },
  {
    id: "crowd-optimized-tawaf",
    order: 6,
    title: {
      en: "Crowd-Optimized Tawaf & Sa'i Schedule",
      ar: "جدول الطواف والسعي المُحسّن للزحام",
      ur: "بھیڑ سے بچاؤ طواف و سعی شیڈول",
      hi: "भीड़-अनुकूल तवाफ़ और सई शेड्यूल",
    },
    whatItIs: {
      en: "Crowd density at Masjid al-Haram varies dramatically by hour. Performing Tawaf and Sa'i at the wrong time can turn a 45-minute act into 3+ hours of crushing crowds. This guide gives you field-tested timing strategies used by experienced Hajj group leaders.",
      ar: "تتفاوت كثافة الزحام في المسجد الحرام بشكل كبير حسب الساعة. أداء الطواف والسعي في الوقت الخاطئ قد يحول عملاً مدته 45 دقيقة إلى أكثر من 3 ساعات من الزحام الخانق.",
      ur: "مسجد الحرام میں بھیڑ ہر گھنٹے بدلتی ہے۔ غلط وقت پر طواف اور سعی 45 منٹ کے عمل کو 3+ گھنٹے کی مشکل میں بدل سکتی ہے۔",
      hi: "मस्जिद अल-हराम में भीड़ हर घंटे बदलती है। गलत समय पर तवाफ़ और सई 45 मिनट के काम को 3+ घंटे की भीड़ में बदल सकती है।",
    },
    steps: [
      {
        text: {
          en: "BEST WINDOW: 2:00 AM – 4:30 AM (after Isha, before Tahajjud crowd). Mataf is 60-70% empty. Walk-in, walk-out in under 50 minutes total for Tawaf + Sa'i.",
          ar: "أفضل وقت: 2:00 صباحاً – 4:30 صباحاً (بعد العشاء، قبل زحام التهجد). المطاف فارغ بنسبة 60-70%. إتمام الطواف والسعي في أقل من 50 دقيقة.",
          ur: "بہترین وقت: رات 2:00 – 4:30 (عشاء کے بعد، تہجد کی بھیڑ سے پہلے)۔ مطاف 60-70% خالی۔ 50 منٹ سے کم میں طواف و سعی مکمل۔",
          hi: "सर्वश्रेष्ठ समय: रात 2:00 – 4:30 (इशा के बाद, तहज्जुद भीड़ से पहले)। मताफ़ 60-70% खाली। 50 मिनट से कम में तवाफ़ + सई।",
        }
      },
      {
        text: {
          en: "SECOND BEST: 10:00 AM – 11:30 AM (post-Dhuha, pre-Dhuhr). Most pilgrims return to hotels after Fajr. This window opens up especially on non-Friday days.",
          ar: "ثاني أفضل وقت: 10:00 صباحاً – 11:30 صباحاً (بعد الضحى، قبل الظهر). معظم الحجاج يعودون للفنادق بعد الفجر.",
          ur: "دوسرا بہترین وقت: صبح 10:00 – 11:30 (ضحی کے بعد، ظہر سے پہلے)۔ زیادہ تر حجاج فجر کے بعد ہوٹل لوٹ جاتے ہیں۔",
          hi: "दूसरा सर्वश्रेष्ठ: सुबह 10:00 – 11:30 (ज़ुहा के बाद, ज़ुहर से पहले)। अधिकांश तीर्थयात्री फज्र के बाद होटल लौट जाते हैं।",
        }
      },
      {
        text: {
          en: "AVOID AT ALL COSTS: 30 minutes before any Adhan, especially Maghrib and Isha. The mataf becomes a prayer area and movement stops completely. You will be stuck standing for 30-45 minutes.",
          ar: "تجنب تماماً: قبل 30 دقيقة من أي أذان، خاصة المغرب والعشاء. يتحول المطاف إلى منطقة صلاة ويتوقف الحركة تماماً.",
          ur: "مکمل اجتناب کریں: کسی بھی اذان سے 30 منٹ پہلے، خاص طور پر مغرب اور عشاء۔ مطاف نماز کی جگہ بن جاتا ہے اور حرکت مکمل بند ہو جاتی ہے۔",
          hi: "पूरी तरह बचें: किसी भी अज़ान से 30 मिनट पहले, खासकर मग़रिब और इशा। मताफ़ नमाज़ का क्षेत्र बन जाता है और चलना पूरी तरह रुक जाता है।",
        }
      },
      {
        text: {
          en: "FRIDAY RULE: Avoid Tawaf from 10:00 AM Friday until after Jumu'ah prayer completely clears (approximately 2:30 PM). The entire Haram is at maximum capacity.",
          ar: "قاعدة الجمعة: تجنب الطواف من 10:00 صباحاً الجمعة حتى بعد انتهاء صلاة الجمعة تماماً (حوالي 2:30 مساءً).",
          ur: "جمعہ کا اصول: جمعہ کو صبح 10:00 سے نماز جمعہ مکمل ختم ہونے تک (تقریباً 2:30 بجے) طواف سے بچیں۔",
          hi: "जुमे का नियम: शुक्रवार सुबह 10:00 से जुमे की नमाज़ पूरी तरह खत्म होने तक (लगभग 2:30 बजे) तवाफ़ से बचें।",
        }
      },
      {
        text: {
          en: "USE UPPER FLOORS: If ground-level mataf is packed, go to the first or second floor. The circumference is larger (longer walk) but the crowd density drops by 50-70%. Wheelchair Tawaf is available on designated floors.",
          ar: "استخدم الطوابق العلوية: إذا كان المطاف الأرضي مزدحماً، اذهب للطابق الأول أو الثاني. المسافة أطول لكن الكثافة تنخفض 50-70%.",
          ur: "اوپری منزلیں استعمال کریں: اگر نچلا مطاف بھرا ہو تو پہلی یا دوسری منزل پر جائیں۔ فاصلہ زیادہ ہے لیکن بھیڑ 50-70% کم ہے۔",
          hi: "ऊपरी मंज़िलें इस्तेमाल करें: अगर ज़मीनी मताफ़ भरा हो तो पहली या दूसरी मंज़िल पर जाएं। परिधि बड़ी है लेकिन भीड़ 50-70% कम है।",
        }
      }
    ],
    duaGuidance: {
      en: "Before starting Tawaf, say 'Bismillah, Allahu Akbar' at the Black Stone line. Between Rukn Yamani and Hajar al-Aswad: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina adhaban-nar.' Use remaining time for personal du'a in your language.",
      ar: "قبل بدء الطواف، قل 'بسم الله، الله أكبر' عند خط الحجر الأسود. بين الركن اليماني والحجر الأسود: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.'",
      ur: "طواف شروع کرنے سے پہلے حجر اسود کی لائن پر 'بسم اللہ، اللہ اکبر' کہیں۔ رکن یمانی اور حجر اسود کے درمیان: 'ربنا آتنا فی الدنیا حسنۃ...'",
      hi: "तवाफ़ शुरू करने से पहले हजर-ए-अस्वद की लाइन पर 'बिस्मिल्लाह, अल्लाहु अकबर' कहें। रुक्न-ए-यमानी और हजर-ए-अस्वद के बीच: 'रब्बना आतिना...'",
    },
    mistakes: [
      {
        text: {
          en: "Starting Tawaf 20 minutes before Adhan — you'll get stuck mid-round when prayer starts",
          ar: "بدء الطواف قبل 20 دقيقة من الأذان — ستعلق في منتصف الشوط عند بدء الصلاة",
          ur: "اذان سے 20 منٹ پہلے طواف شروع کرنا — نماز شروع ہونے پر آپ درمیان میں پھنس جائیں گے",
          hi: "अज़ान से 20 मिनट पहले तवाफ़ शुरू करना — नमाज़ शुरू होने पर आप बीच में फंस जाएंगे",
        }
      },
      {
        text: {
          en: "Insisting on ground-floor Tawaf during peak hours — upper floors give the same reward with 70% less crowd",
          ar: "الإصرار على طواف الأرضي في أوقات الذروة — الطوابق العلوية تعطي نفس الأجر مع 70% أقل ازدحاماً",
          ur: "پیک اوقات میں نچلی منزل پر طواف کی ضد — اوپری منزلوں پر وہی اجر ہے 70% کم بھیڑ کے ساتھ",
          hi: "पीक समय में ज़मीनी मंज़िल पर तवाफ़ की ज़िद — ऊपरी मंज़िलों पर वही सवाब है 70% कम भीड़ के साथ",
        }
      },
      {
        text: {
          en: "Attempting Sa'i immediately after Tawaf during Maghrib/Isha — take a break, hydrate, then resume after the crowd thins",
          ar: "محاولة السعي فوراً بعد الطواف في المغرب/العشاء — خذ استراحة واشرب ماء ثم استأنف بعد انخفاض الزحام",
          ur: "مغرب/عشاء میں طواف کے فوراً بعد سعی کی کوشش — وقفہ لیں، پانی پیئیں، پھر بھیڑ کم ہونے پر دوبارہ شروع کریں",
          hi: "मग़रिब/इशा में तवाफ़ के तुरंत बाद सई की कोशिश — ब्रेक लें, पानी पिएं, फिर भीड़ कम होने पर दोबारा शुरू करें",
        }
      }
    ]
  },
  {
    id: "umrah-execution-plan",
    order: 7,
    title: {
      en: "Step-by-Step Umrah Execution Plan",
      ar: "خطة أداء العمرة خطوة بخطوة",
      ur: "عمرہ ادائیگی کا مکمل منصوبہ",
      hi: "चरण-दर-चरण उमरा निष्पादन योजना",
    },
    whatItIs: {
      en: "A complete, operationally precise Umrah plan from Miqat to Halq/Taqsir. No generic advice — this is a field-tested execution sequence designed for zero confusion and maximum spiritual focus. Follow each step exactly.",
      ar: "خطة عمرة كاملة ودقيقة عملياً من الميقات إلى الحلق/التقصير. لا نصائح عامة — هذا تسلسل تنفيذ مُختبر ميدانياً مصمم لعدم الارتباك والتركيز الروحي الأقصى.",
      ur: "میقات سے حلق/تقصیر تک مکمل، عملی طور پر درست عمرہ منصوبہ۔ کوئی عمومی مشورے نہیں — یہ میدانی تجربے پر مبنی عملی ترتیب ہے۔",
      hi: "मीकात से हल्क/तक्सीर तक पूर्ण, व्यावहारिक रूप से सटीक उमरा योजना। कोई सामान्य सलाह नहीं — यह शून्य भ्रम के लिए डिज़ाइन किया गया है।",
    },
    steps: [
      {
        text: {
          en: "STEP 1 — IHRAM AT MIQAT: Shower, wear Ihram garments (men: two white unstitched cloths; women: normal modest clothing). Make niyyah: 'Labbayk Allahumma Umrah' and begin Talbiyah. Do NOT pass Miqat without Ihram.",
          ar: "الخطوة 1 — الإحرام في الميقات: اغتسل، ارتد ملابس الإحرام. انوِ: 'لبيك اللهم عمرة' وابدأ التلبية. لا تتجاوز الميقات بدون إحرام.",
          ur: "مرحلہ 1 — میقات پر احرام: غسل کریں، احرام کے کپڑے پہنیں۔ نیت کریں: 'لبیک اللهم عمرة' اور تلبیہ شروع کریں۔ بغیر احرام میقات نہ گزریں۔",
          hi: "चरण 1 — मीकात पर इहराम: गुस्ल करें, इहराम के कपड़े पहनें। नियत करें: 'लब्बैक अल्लाहुम्मा उमरह' और तलबिया शुरू करें। बिना इहराम मीकात न गुज़रें।",
        }
      },
      {
        text: {
          en: "STEP 2 — ENTER HARAM & BEGIN TAWAF: Enter Masjid al-Haram with right foot. Stop Talbiyah. Begin Tawaf from Black Stone line (green light marker). 7 complete rounds counter-clockwise. Men: Idtiba (right shoulder uncovered) + Raml (brisk walk) in first 3 rounds.",
          ar: "الخطوة 2 — ادخل الحرم وابدأ الطواف: ادخل المسجد الحرام بالقدم اليمنى. توقف عن التلبية. ابدأ الطواف من خط الحجر الأسود. 7 أشواط كاملة.",
          ur: "مرحلہ 2 — حرم میں داخل ہوں اور طواف شروع کریں: دائیں پاؤں سے داخل ہوں۔ تلبیہ بند کریں۔ حجر اسود کی لائن سے طواف شروع کریں۔ 7 مکمل چکر۔",
          hi: "चरण 2 — हरम में प्रवेश करें और तवाफ़ शुरू करें: दाएं पैर से प्रवेश करें। तलबिया रोकें। हजर-ए-अस्वद की लाइन से तवाफ़ शुरू करें। 7 पूर्ण चक्कर।",
        }
      },
      {
        text: {
          en: "STEP 3 — PRAY 2 RAK'AHS AT MAQAM IBRAHIM: After completing Tawaf, pray 2 rak'ahs behind Maqam Ibrahim if possible. If area is packed, pray anywhere in the Haram — the reward is the same. Recite Surah Al-Kafirun and Surah Al-Ikhlas.",
          ar: "الخطوة 3 — صلِّ ركعتين عند مقام إبراهيم: بعد إتمام الطواف، صلِّ ركعتين خلف مقام إبراهيم إن أمكن.",
          ur: "مرحلہ 3 — مقام ابراہیم پر 2 رکعات پڑھیں: طواف مکمل کرنے کے بعد، اگر ممکن ہو تو مقام ابراہیم کے پیچھے 2 رکعات پڑھیں۔",
          hi: "चरण 3 — मक़ाम-ए-इब्राहीम पर 2 रकात पढ़ें: तवाफ़ पूरा करने के बाद, यदि संभव हो तो मक़ाम इब्राहीम के पीछे 2 रकात पढ़ें।",
        }
      },
      {
        text: {
          en: "STEP 4 — DRINK ZAMZAM: Drink Zamzam water facing the Kaaba. Make du'a while drinking. The Prophet ﷺ said: 'The water of Zamzam is for whatever purpose it is drunk for.'",
          ar: "الخطوة 4 — اشرب ماء زمزم: اشرب ماء زمزم مستقبلاً الكعبة. ادعُ أثناء الشرب.",
          ur: "مرحلہ 4 — زمزم پیئیں: کعبہ کی طرف منہ کر کے زمزم پیئیں۔ پیتے وقت دعا کریں۔",
          hi: "चरण 4 — ज़मज़म पिएं: काबा की ओर मुंह करके ज़मज़म पिएं। पीते समय दुआ करें।",
        }
      },
      {
        text: {
          en: "STEP 5 — SA'I (SAFA TO MARWAH): Walk to Safa hill. Recite: 'Inna as-Safa wal-Marwata min sha'a'irillah.' Face Kaaba from Safa, make du'a. Walk to Marwah (1 lap). Men jog between green lights. Complete 7 laps (ending at Marwah).",
          ar: "الخطوة 5 — السعي (الصفا إلى المروة): امشِ إلى الصفا. اقرأ: 'إن الصفا والمروة من شعائر الله.' 7 أشواط (تنتهي عند المروة).",
          ur: "مرحلہ 5 — سعی (صفا سے مروہ): صفا کی طرف چلیں۔ پڑھیں: 'إن الصفا والمروة من شعائر الله۔' 7 چکر (مروہ پر ختم)۔",
          hi: "चरण 5 — सई (सफ़ा से मरवा): सफ़ा की ओर चलें। पढ़ें: 'इन्नस-सफ़ा वल-मरवत...' 7 चक्कर (मरवा पर समाप्त)।",
        }
      },
      {
        text: {
          en: "STEP 6 — HALQ/TAQSIR: Men: shave head completely (Halq — greater reward) or trim hair equally from all sides (Taqsir). Women: cut a fingertip-length from the end of their hair. This completes Umrah. Ihram restrictions are now lifted.",
          ar: "الخطوة 6 — الحلق/التقصير: الرجال: احلق الرأس كاملاً (حلق — أجر أعظم) أو قصّر الشعر. النساء: قص قدر أنملة من أطراف الشعر. هذا يُتم العمرة.",
          ur: "مرحلہ 6 — حلق/تقصیر: مرد: سر مکمل مونڈیں (حلق — زیادہ اجر) یا بال کتریں۔ خواتین: بالوں کے سرے سے انگلی کے پور برابر کاٹیں۔ عمرہ مکمل۔",
          hi: "चरण 6 — हल्क/तक्सीर: पुरुष: पूरा सर मुंडवाएं (हल्क — ज़्यादा सवाब) या बाल कटवाएं। महिलाएं: बालों के सिरे से उंगली के पोर जितना काटें। उमरा पूर्ण।",
        }
      }
    ],
    duaGuidance: {
      en: "At each stage, make personal du'a in your language. Key moments for du'a: first sight of Kaaba, during Tawaf (especially between Rukn Yamani and Black Stone), on Safa and Marwah hills, and while drinking Zamzam.",
      ar: "في كل مرحلة، ادعُ بلغتك. لحظات مهمة للدعاء: رؤية الكعبة الأولى، أثناء الطواف، على الصفا والمروة، وأثناء شرب زمزم.",
      ur: "ہر مرحلے پر اپنی زبان میں دعا کریں۔ دعا کے اہم لمحات: کعبہ کی پہلی نظر، طواف کے دوران، صفا و مروہ پر، اور زمزم پیتے وقت۔",
      hi: "हर चरण पर अपनी भाषा में दुआ करें। दुआ के महत्वपूर्ण क्षण: काबा की पहली नज़र, तवाफ़ के दौरान, सफ़ा और मरवा पर, और ज़मज़म पीते समय।",
    },
    mistakes: [
      {
        text: {
          en: "Passing the Miqat without entering Ihram — you must return to Miqat or pay a penalty (dam/sacrifice)",
          ar: "تجاوز الميقات بدون إحرام — يجب العودة للميقات أو دفع فدية (دم)",
          ur: "بغیر احرام میقات گزر جانا — واپس میقات جانا ہوگا یا دم دینا ہوگا",
          hi: "बिना इहराम मीकात गुज़र जाना — मीकात वापस जाना होगा या दम देना होगा",
        }
      },
      {
        text: {
          en: "Counting Sa'i laps wrong — Safa→Marwah is lap 1, Marwah→Safa is lap 2. You must end on Marwah (lap 7)",
          ar: "خطأ في عد أشواط السعي — الصفا→المروة هو الشوط 1. يجب أن تنتهي عند المروة (الشوط 7)",
          ur: "سعی کے چکروں کی غلط گنتی — صفا→مروہ پہلا چکر ہے۔ آپ کو مروہ پر ختم کرنا ہے (چکر 7)",
          hi: "सई के चक्करों की गलत गिनती — सफ़ा→मरवा पहला चक्कर है। आपको मरवा पर समाप्त करना है (चक्कर 7)",
        }
      },
      {
        text: {
          en: "Women cutting hair publicly — go back to your hotel/room for Taqsir. It's not required to do it at the Haram",
          ar: "النساء يقصصن شعرهن علنياً — عودي للفندق/الغرفة للتقصير. ليس مطلوباً في الحرم",
          ur: "خواتین کا عوامی طور پر بال کاٹنا — تقصیر کے لیے ہوٹل/کمرے میں واپس جائیں۔ حرم میں ضروری نہیں",
          hi: "महिलाओं का सार्वजनिक रूप से बाल काटना — तक्सीर के लिए होटल/कमरे में जाएं। हरम में ज़रूरी नहीं",
        }
      }
    ]
  },
  {
    id: "wheelchair-elderly-umrah",
    order: 8,
    title: {
      en: "Wheelchair & Elderly-Safe Umrah Methods",
      ar: "طرق العمرة الآمنة لكبار السن وذوي الكراسي المتحركة",
      ur: "وہیل چیئر اور بزرگوں کے لیے محفوظ عمرہ طریقے",
      hi: "व्हीलचेयर और बुज़ुर्गों के लिए सुरक्षित उमरा तरीके",
    },
    whatItIs: {
      en: "Every year, elderly and disabled pilgrims face preventable suffering because their groups don't plan wheelchair logistics. This guide covers wheelchair rental, designated floors, attendant protocols, and energy-conservation strategies tested with 70+ year-old pilgrims.",
      ar: "كل عام يعاني الحجاج المسنون والمعاقون من معاناة يمكن تجنبها لأن مجموعاتهم لا تخطط للوجستيات الكراسي المتحركة.",
      ur: "ہر سال بزرگ اور معذور حجاج قابل اجتناب مشکلات کا سامنا کرتے ہیں کیونکہ ان کے گروپ وہیل چیئر کی لاجسٹکس کی منصوبہ بندی نہیں کرتے۔",
      hi: "हर साल, बुज़ुर्ग और विकलांग तीर्थयात्री रोकी जा सकने वाली तकलीफ़ झेलते हैं क्योंकि उनके ग्रुप व्हीलचेयर लॉजिस्टिक्स की योजना नहीं बनाते।",
    },
    steps: [
      {
        text: {
          en: "WHEELCHAIR RENTAL: Available at Haram gates (King Fahd Gate, King Abdul Aziz Gate). Cost: ~150-200 SAR per use with attendant. Book through your Mu'allim or hotel concierge for better rates. Electric scooters available for Sa'i corridor.",
          ar: "استئجار الكرسي المتحرك: متوفر عند أبواب الحرم. التكلفة: ~150-200 ريال مع المرافق. احجز من خلال المعلم أو الفندق.",
          ur: "وہیل چیئر کرایہ: حرم کے دروازوں پر دستیاب۔ قیمت: ~150-200 ریال مع خادم۔ معلم یا ہوٹل سے بک کریں۔",
          hi: "व्हीलचेयर किराया: हरम गेट पर उपलब्ध। लागत: ~150-200 रियाल सेवक के साथ। मुअल्लिम या होटल से बुक करें।",
        }
      },
      {
        text: {
          en: "TAWAF FLOOR: Wheelchair Tawaf is on the ROOF/designated floor (check current season arrangement). Ground floor wheelchair Tawaf is NOT recommended during peak — you'll get stuck in foot traffic. Always use the designated wheelchair lane.",
          ar: "طابق الطواف: طواف الكرسي المتحرك على السطح/الطابق المخصص. الطابق الأرضي غير موصى به في أوقات الذروة.",
          ur: "طواف کی منزل: وہیل چیئر طواف چھت/مخصوص منزل پر ہوتا ہے۔ پیک اوقات میں نچلی منزل تجویز نہیں کی جاتی۔",
          hi: "तवाफ़ मंज़िल: व्हीलचेयर तवाफ़ छत/निर्धारित मंज़िल पर होता है। पीक समय में ज़मीनी मंज़िल अनुशंसित नहीं।",
        }
      },
      {
        text: {
          en: "ENERGY CONSERVATION: Break Umrah into two sessions if needed — Tawaf in early morning, Sa'i after rest. This is permissible. Carry ORS packets, glucose biscuits, and a small water bottle. Rest at Zamzam stations between Tawaf and Sa'i.",
          ar: "الحفاظ على الطاقة: قسّم العمرة إلى جلستين إذا لزم الأمر — الطواف صباحاً والسعي بعد الراحة. هذا جائز.",
          ur: "توانائی بچاؤ: ضرورت ہو تو عمرہ دو حصوں میں تقسیم کریں — صبح طواف، آرام کے بعد سعی۔ یہ جائز ہے۔",
          hi: "ऊर्जा संरक्षण: ज़रूरत हो तो उमरा दो हिस्सों में बांटें — सुबह तवाफ़, आराम के बाद सई। यह जायज़ है।",
        }
      },
      {
        text: {
          en: "ATTENDANT RULES: Your wheelchair pusher must have a valid Haram access permit. Brief them on the route before entering. They should NOT rush or cut through crowds recklessly. Tip 50-100 SAR for good service.",
          ar: "قواعد المرافق: يجب أن يكون لدى دافع الكرسي تصريح دخول الحرم صالح. أعطه توجيهات المسار قبل الدخول.",
          ur: "خادم کے اصول: وہیل چیئر دھکیلنے والے کے پاس حرم کا درست پرمٹ ہونا ضروری ہے۔ داخل ہونے سے پہلے راستے کی ہدایات دیں۔",
          hi: "सेवक नियम: व्हीलचेयर चलाने वाले के पास वैध हरम एक्सेस परमिट होना चाहिए। प्रवेश से पहले रास्ते की जानकारी दें।",
        }
      },
      {
        text: {
          en: "MEDICAL KIT: Carry medications, inhaler if needed, blood pressure medication, diabetic supplies, sunscreen, and a wide-brim hat for outdoor sections. Identify the nearest first-aid station BEFORE starting.",
          ar: "حقيبة طبية: احمل الأدوية، البخاخ إذا لزم، أدوية الضغط، مستلزمات السكري، واقي شمس. حدد أقرب محطة إسعافات أولية قبل البدء.",
          ur: "طبی کٹ: ادویات رکھیں، انہیلر، بلڈ پریشر کی دوائیں، ذیابیطس کا سامان، سن سکرین۔ شروع کرنے سے پہلے قریبی فرسٹ ایڈ اسٹیشن معلوم کریں۔",
          hi: "मेडिकल किट: दवाइयां, इनहेलर, ब्लड प्रेशर की दवाइयां, डायबिटिक सप्लाइज़, सनस्क्रीन रखें। शुरू करने से पहले निकटतम फ़र्स्ट एड स्टेशन पहचानें।",
        }
      }
    ],
    duaGuidance: {
      en: "Make du'a for ease and acceptance: 'Allahumma yassir wa la tu'assir' (O Allah, make it easy and do not make it difficult). Your Umrah performed with difficulty carries GREATER reward than one done in comfort.",
      ar: "ادعُ بالتيسير والقبول: 'اللهم يسّر ولا تعسّر'. عمرتك التي أُديت بمشقة لها أجر أعظم.",
      ur: "آسانی اور قبولیت کے لیے دعا کریں: 'اللهم يسّر ولا تعسّر'۔ مشکل سے ادا کی گئی آپ کی عمرہ کا اجر زیادہ ہے۔",
      hi: "आसानी और कुबूलियत के लिए दुआ करें: 'अल्लाहुम्मा यस्सिर वला तुअस्सिर'। मुश्किल से अदा किए गए उमरा का सवाब ज़्यादा है।",
    },
    mistakes: [
      {
        text: {
          en: "Forcing elderly pilgrims to walk when they clearly need a wheelchair — pride should not override safety",
          ar: "إجبار الحجاج المسنين على المشي عندما يحتاجون كرسياً متحركاً — الكبرياء لا يجب أن يتغلب على السلامة",
          ur: "بزرگ حجاج کو چلنے پر مجبور کرنا جب واضح طور پر وہیل چیئر کی ضرورت ہو — غرور سے حفاظت اہم ہے",
          hi: "बुज़ुर्ग तीर्थयात्रियों को चलने पर मजबूर करना जब स्पष्ट रूप से व्हीलचेयर की ज़रूरत हो — अहंकार सुरक्षा से ऊपर नहीं होना चाहिए",
        }
      },
      {
        text: {
          en: "Not carrying medications or medical ID — if you collapse, paramedics need to know your conditions immediately",
          ar: "عدم حمل الأدوية أو بطاقة طبية — إذا أُغمي عليك، يحتاج المسعفون لمعرفة حالتك فوراً",
          ur: "ادویات یا میڈیکل آئی ڈی نہ رکھنا — اگر آپ گریں تو پیرامیڈکس کو فوراً آپ کی حالت جاننی ہوگی",
          hi: "दवाइयां या मेडिकल आईडी न रखना — अगर आप गिरें तो पैरामेडिक्स को तुरंत आपकी स्थिति जानने की ज़रूरत है",
        }
      }
    ]
  },
  {
    id: "heat-management",
    order: 9,
    title: {
      en: "Heat & Dehydration Management",
      ar: "إدارة الحرارة والجفاف",
      ur: "گرمی اور پانی کی کمی سے بچاؤ",
      hi: "गर्मी और निर्जलीकरण प्रबंधन",
    },
    whatItIs: {
      en: "Makkah temperatures routinely hit 45-50°C during Hajj season. Heatstroke is the #1 preventable killer of pilgrims. This is not optional reading — this is survival protocol. Every year, pilgrims die because they ignored hydration and heat management basics.",
      ar: "تصل درجات الحرارة في مكة بانتظام إلى 45-50 درجة مئوية خلال موسم الحج. ضربة الشمس هي القاتل الأول الذي يمكن الوقاية منه.",
      ur: "حج کے موسم میں مکہ کا درجہ حرارت عام طور پر 45-50°C تک پہنچ جاتا ہے۔ ہیٹ اسٹروک حجاج کی سب سے بڑی قابل اجتناب وجہ وفات ہے۔",
      hi: "हज सीज़न में मक्का का तापमान नियमित रूप से 45-50°C तक पहुंचता है। हीटस्ट्रोक तीर्थयात्रियों की #1 रोकी जा सकने वाली मौत की वजह है।",
    },
    steps: [
      {
        text: {
          en: "HYDRATION RULE: Drink minimum 3-4 liters of water daily. Do NOT wait until you feel thirsty — by then you're already dehydrated. Carry a refillable bottle at ALL times. Zamzam stations are everywhere in the Haram.",
          ar: "قاعدة الترطيب: اشرب 3-4 لترات ماء يومياً كحد أدنى. لا تنتظر حتى تشعر بالعطش. احمل زجاجة قابلة لإعادة التعبئة دائماً.",
          ur: "پانی کا اصول: روزانہ کم از کم 3-4 لیٹر پانی پیئیں۔ پیاس لگنے تک انتظار نہ کریں۔ ہمیشہ دوبارہ بھرنے والی بوتل رکھیں۔",
          hi: "हाइड्रेशन नियम: रोज़ कम से कम 3-4 लीटर पानी पिएं। प्यास लगने तक इंतज़ार न करें। हमेशा रिफ़िलेबल बोतल रखें।",
        }
      },
      {
        text: {
          en: "OUTDOOR TIMING: Never walk outdoors between 11:00 AM – 3:00 PM if avoidable. If you must, use umbrellas, wet towels on the neck, and stay in shaded corridors. The tunnel walkways between Aziziya/Misfalah and Haram are shaded.",
          ar: "توقيت الخروج: لا تمش في الخارج بين 11:00 صباحاً – 3:00 مساءً إذا أمكن. استخدم المظلات والمناشف المبللة.",
          ur: "باہر نکلنے کا وقت: اگر ممکن ہو تو صبح 11:00 – دوپہر 3:00 کے درمیان باہر نہ چلیں۔ چھتریاں اور گیلے تولیے استعمال کریں۔",
          hi: "बाहर का समय: अगर संभव हो तो सुबह 11:00 – दोपहर 3:00 के बीच बाहर न चलें। छतरियां और गीले तौलिये इस्तेमाल करें।",
        }
      },
      {
        text: {
          en: "ORS & ELECTROLYTES: Carry ORS (Oral Rehydration Salt) packets — available at any Saudi pharmacy for ~2 SAR. Dissolve one in your water bottle. This prevents the dangerous sodium/potassium loss that causes collapse.",
          ar: "أملاح الإرواء: احمل أكياس ORS — متوفرة في أي صيدلية سعودية بـ~2 ريال. تمنع فقدان الصوديوم/البوتاسيوم الخطير.",
          ur: "ORS اور الیکٹرولائٹس: ORS پیکٹ رکھیں — کسی بھی سعودی فارمیسی میں ~2 ریال میں دستیاب۔ خطرناک سوڈیم/پوٹاشیم کی کمی سے بچاتا ہے۔",
          hi: "ORS और इलेक्ट्रोलाइट्स: ORS पैकेट रखें — किसी भी सऊदी फ़ार्मेसी में ~2 रियाल में उपलब्ध। खतरनाक सोडियम/पोटेशियम की कमी से बचाता है।",
        }
      },
      {
        text: {
          en: "HEATSTROKE SIGNS: Confusion, stopped sweating, hot dry skin, rapid heartbeat, headache, nausea. If you see ANY of these in yourself or others: STOP immediately, move to shade, pour water on head/neck, and call emergency (911 in Saudi Arabia).",
          ar: "علامات ضربة الشمس: ارتباك، توقف التعرق، جلد ساخن جاف، تسارع القلب. توقف فوراً، انتقل للظل، واتصل بالطوارئ (911).",
          ur: "ہیٹ اسٹروک کی علامات: الجھن، پسینہ بند، گرم خشک جلد، تیز دھڑکن۔ فوراً رکیں، سائے میں جائیں، سر/گردن پر پانی ڈالیں، 911 کال کریں۔",
          hi: "हीटस्ट्रोक के संकेत: भ्रम, पसीना बंद, गर्म सूखी त्वचा, तेज़ धड़कन। तुरंत रुकें, छाया में जाएं, सिर/गर्दन पर पानी डालें, 911 कॉल करें।",
        }
      },
      {
        text: {
          en: "COOLING STRATEGY: Bring a small spray bottle to mist your face. Wear light-colored, loose, breathable fabrics. Use cooling towels (soak in cold water, wring, wrap around neck). Saudi pharmacies sell instant cold packs for ~10 SAR.",
          ar: "استراتيجية التبريد: احمل رشاش صغير لرش الوجه. ارتد ملابس فاتحة وفضفاضة. استخدم مناشف التبريد.",
          ur: "ٹھنڈا رکھنے کی حکمت عملی: چہرے پر پانی چھڑکنے کے لیے چھوٹی سپرے بوتل لائیں۔ ہلکے رنگ کے ڈھیلے کپڑے پہنیں۔",
          hi: "ठंडा रखने की रणनीति: चेहरे पर स्प्रे करने के लिए छोटी स्प्रे बोतल लाएं। हल्के रंग के ढीले कपड़े पहनें।",
        }
      }
    ],
    duaGuidance: {
      en: "The Prophet ﷺ sought refuge from severe heat: 'Allahumma ajirni min an-nar' (O Allah, protect me from the Fire). When drinking water, say 'Bismillah' and make du'a for health and strength to complete your ibadah.",
      ar: "استعاذ النبي ﷺ من شدة الحر: 'اللهم أجرني من النار'. عند شرب الماء قل 'بسم الله' وادعُ بالصحة.",
      ur: "نبی ﷺ نے شدید گرمی سے پناہ مانگی: 'اللهم أجرني من النار'۔ پانی پیتے وقت 'بسم اللہ' کہیں اور صحت کی دعا کریں۔",
      hi: "नबी ﷺ ने कड़ी गर्मी से पनाह मांगी: 'अल्लाहुम्मा अजिर्नी मिनन्नार'। पानी पीते समय 'बिस्मिल्लाह' कहें और सेहत की दुआ करें।",
    },
    mistakes: [
      {
        text: {
          en: "Skipping water because you don't feel thirsty — dehydration kills before thirst appears in extreme heat",
          ar: "تجاهل شرب الماء لعدم الشعور بالعطش — الجفاف يقتل قبل ظهور العطش في الحر الشديد",
          ur: "پیاس نہ لگنے پر پانی نہ پینا — شدید گرمی میں پیاس لگنے سے پہلے پانی کی کمی جان لے سکتی ہے",
          hi: "प्यास न लगने पर पानी न पीना — अत्यधिक गर्मी में प्यास लगने से पहले निर्जलीकरण जान ले सकता है",
        }
      },
      {
        text: {
          en: "Walking to Haram during peak afternoon heat — use hotel shuttle, taxi, or wait for cooler hours",
          ar: "المشي للحرم خلال حر الظهيرة — استخدم نقل الفندق أو التاكسي أو انتظر ساعات أبرد",
          ur: "دوپہر کی شدید گرمی میں حرم تک پیدل چلنا — ہوٹل شٹل، ٹیکسی استعمال کریں یا ٹھنڈے اوقات کا انتظار کریں",
          hi: "दोपहर की चरम गर्मी में हरम तक पैदल चलना — होटल शटल, टैक्सी इस्तेमाल करें या ठंडे घंटों का इंतज़ार करें",
        }
      },
      {
        text: {
          en: "Ignoring early heatstroke symptoms in group members — confusion and stoppage of sweat means EMERGENCY, not tiredness",
          ar: "تجاهل أعراض ضربة الشمس المبكرة — الارتباك وتوقف التعرق يعني حالة طوارئ وليس تعب",
          ur: "گروپ ممبران میں ہیٹ اسٹروک کی ابتدائی علامات نظرانداز کرنا — الجھن اور پسینہ بند ہونا ایمرجنسی ہے، تھکاوٹ نہیں",
          hi: "ग्रुप सदस्यों में हीटस्ट्रोक के शुरुआती लक्षणों को नज़रअंदाज़ करना — भ्रम और पसीना बंद होना इमरजेंसी है, थकान नहीं",
        }
      }
    ]
  },
  {
    id: "transport-makkah",
    order: 10,
    title: {
      en: "Real-World Transport & Taxi Guide",
      ar: "دليل النقل والتاكسي الواقعي",
      ur: "حقیقی ٹرانسپورٹ اور ٹیکسی گائیڈ",
      hi: "वास्तविक परिवहन और टैक्सी गाइड",
    },
    whatItIs: {
      en: "Transport in Makkah during Hajj/Umrah season is chaotic. Taxis overcharge, roads are blocked, and walking distances are deceptive. This guide gives you real prices, app names, and tactics to avoid getting stranded or scammed.",
      ar: "النقل في مكة خلال موسم الحج/العمرة فوضوي. سيارات الأجرة تبالغ في الأسعار، والطرق مغلقة. هذا الدليل يعطيك الأسعار الحقيقية وأسماء التطبيقات.",
      ur: "حج/عمرہ کے موسم میں مکہ میں ٹرانسپورٹ افراتفری ہوتی ہے۔ ٹیکسیاں زیادہ پیسے لیتی ہیں، سڑکیں بند ہوتی ہیں۔ یہ گائیڈ حقیقی قیمتیں اور ایپ کے نام دیتا ہے۔",
      hi: "हज/उमरा सीज़न में मक्का में परिवहन अव्यवस्थित होता है। टैक्सी ज़्यादा चार्ज करती हैं, सड़कें बंद होती हैं। यह गाइड असली कीमतें और ऐप के नाम देता है।",
    },
    steps: [
      {
        text: {
          en: "USE RIDE-HAILING APPS: Uber and Careem both work in Makkah. Always use app-metered rides — never negotiate with street taxis. Typical Haram-to-Aziziya ride: 15-25 SAR by app vs 50-80 SAR negotiated with street taxi.",
          ar: "استخدم تطبيقات النقل: أوبر وكريم يعملان في مكة. استخدم الرحلات بالعداد دائماً — لا تفاوض سيارات الشارع.",
          ur: "رائیڈ ہیلنگ ایپس استعمال کریں: اوبر اور کریم دونوں مکہ میں کام کرتے ہیں۔ ہمیشہ ایپ سے سواری لیں — سڑک ٹیکسی سے سودا نہ کریں۔",
          hi: "राइड-हेलिंग ऐप्स इस्तेमाल करें: उबर और करीम दोनों मक्का में काम करते हैं। हमेशा ऐप से सवारी लें — सड़क टैक्सी से मोल-तोल न करें।",
        }
      },
      {
        text: {
          en: "WALKING DISTANCES (real, not Google Maps): Hotel in Aziziya to Haram = 35-45 min walk (2.5-3 km, uphill return). Misfalah to Haram = 15-20 min. Kudai to Haram = 40-60 min. Factor in heat and crowd slowdown.",
          ar: "مسافات المشي (حقيقية): فندق العزيزية إلى الحرم = 35-45 دقيقة. مسفلة إلى الحرم = 15-20 دقيقة.",
          ur: "پیدل فاصلے (حقیقی): عزیزیہ ہوٹل سے حرم = 35-45 منٹ۔ مسفلہ سے حرم = 15-20 منٹ۔ کداء سے حرم = 40-60 منٹ۔",
          hi: "पैदल दूरी (वास्तविक): अज़ीज़िया होटल से हरम = 35-45 मिनट। मिसफ़लाह से हरम = 15-20 मिनट। कुदाई से हरम = 40-60 मिनट।",
        }
      },
      {
        text: {
          en: "HAJJ TRANSPORT (MINA/ARAFAT/MUZDALIFAH): Your Mu'allim arranges buses. Do NOT rely on private transport — roads are one-way and closed to private vehicles. Keep your Hajj bus wristband/sticker visible at all times.",
          ar: "نقل الحج: يرتب المعلم الحافلات. لا تعتمد على النقل الخاص — الطرق باتجاه واحد ومغلقة للسيارات الخاصة.",
          ur: "حج ٹرانسپورٹ: آپ کا معلم بسیں ترتیب دیتا ہے۔ نجی ٹرانسپورٹ پر انحصار نہ کریں — سڑکیں ون وے ہیں اور نجی گاڑیوں کے لیے بند ہیں۔",
          hi: "हज परिवहन: आपका मुअल्लिम बसें व्यवस्थित करता है। निजी परिवहन पर भरोसा न करें — सड़कें वन-वे हैं और निजी वाहनों के लिए बंद हैं।",
        }
      },
      {
        text: {
          en: "SURGE PRICING ALERT: After Isha prayer and after Fajr prayer, ride-hailing prices surge 2-3x. Walk if your hotel is within 20 minutes, or wait 30-45 minutes for prices to normalize.",
          ar: "تنبيه ارتفاع الأسعار: بعد صلاة العشاء والفجر ترتفع أسعار التطبيقات 2-3 أضعاف. امش إذا كان فندقك قريباً أو انتظر.",
          ur: "قیمتوں میں اضافے کی وارننگ: عشاء اور فجر کی نماز کے بعد ایپ کی قیمتیں 2-3 گنا بڑھ جاتی ہیں۔ اگر ہوٹل 20 منٹ کے فاصلے پر ہو تو چلیں۔",
          hi: "सर्ज प्राइसिंग अलर्ट: इशा और फज्र की नमाज़ के बाद ऐप की कीमतें 2-3 गुना बढ़ जाती हैं। अगर होटल 20 मिनट में हो तो पैदल जाएं।",
        }
      }
    ],
    duaGuidance: {
      en: "When traveling: 'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin' (Glory be to the One who has subjected this for us, and we were not able to do it ourselves). Recite this in any vehicle.",
      ar: "عند السفر: 'سبحان الذي سخر لنا هذا وما كنا له مقرنين'. اقرأها في أي مركبة.",
      ur: "سفر کے وقت: 'سبحان الذی سخر لنا ہذا وما کنا لہ مقرنین'۔ کسی بھی گاڑی میں پڑھیں۔",
      hi: "यात्रा करते समय: 'सुबहानल्लज़ी सख़्ख़रा लना हाज़ा वमा कुन्ना लहू मुक्रिनीन'। किसी भी गाड़ी में पढ़ें।",
    },
    mistakes: [
      {
        text: {
          en: "Negotiating with street taxi drivers — they will always overcharge. Use Uber/Careem for fair, metered pricing",
          ar: "التفاوض مع سائقي الأجرة — سيبالغون دائماً في السعر. استخدم أوبر/كريم",
          ur: "سڑک ٹیکسی ڈرائیوروں سے سودا — وہ ہمیشہ زیادہ لیں گے۔ اوبر/کریم استعمال کریں",
          hi: "सड़क टैक्सी ड्राइवरों से मोल-तोल — वे हमेशा ज़्यादा लेंगे। उबर/करीम इस्तेमाल करें",
        }
      },
      {
        text: {
          en: "Walking back to Aziziya hotel after Isha in the dark without a group — unsafe and exhausting uphill walk",
          ar: "المشي إلى فندق العزيزية بعد العشاء في الظلام بدون مجموعة — مشي غير آمن ومرهق صعوداً",
          ur: "عشاء کے بعد اندھیرے میں اکیلے عزیزیہ ہوٹل تک پیدل واپسی — غیر محفوظ اور تھکا دینے والی چڑھائی",
          hi: "इशा के बाद अंधेरे में अकेले अज़ीज़िया होटल तक पैदल वापसी — असुरक्षित और थकाऊ चढ़ाई",
        }
      }
    ]
  },
  {
    id: "crisis-emergency-handling",
    order: 11,
    title: {
      en: "Crisis & Emergency Handling",
      ar: "التعامل مع الأزمات والطوارئ",
      ur: "بحران اور ایمرجنسی ہینڈلنگ",
      hi: "संकट और आपातकालीन प्रबंधन",
    },
    whatItIs: {
      en: "Stampedes, crowd crushes, medical emergencies, and separation from groups happen every Hajj season. This is your crisis protocol. Read it, memorize the key points, and share with your group leader BEFORE you need it.",
      ar: "التدافع وانسحاق الحشود والطوارئ الطبية والانفصال عن المجموعات تحدث كل موسم حج. هذا بروتوكول الأزمات الخاص بك.",
      ur: "بھگدڑ، بھیڑ کا دباؤ، طبی ایمرجنسی، اور گروپ سے بچھڑنا ہر حج سیزن میں ہوتا ہے۔ یہ آپ کا بحرانی پروٹوکول ہے۔",
      hi: "भगदड़, भीड़ का दबाव, मेडिकल इमरजेंसी, और ग्रुप से बिछड़ना हर हज सीज़न में होता है। यह आपका संकट प्रोटोकॉल है।",
    },
    steps: [
      {
        text: {
          en: "CROWD CRUSH SURVIVAL: If caught in a dense crowd — cross your arms over your chest (protective position). Do NOT bend down to pick up anything. Move diagonally to the edge, not against the flow. If you fall, get up IMMEDIATELY or curl into fetal position protecting your head.",
          ar: "النجاة من انسحاق الحشود: إذا علقت في حشد كثيف — ضع ذراعيك متقاطعتين على صدرك. لا تنحني. تحرك بشكل مائل نحو الطرف.",
          ur: "بھیڑ سے بچاؤ: اگر گھنی بھیڑ میں پھنس جائیں — بازو سینے پر کراس کریں۔ نیچے نہ جھکیں۔ ترچھی سمت کنارے کی طرف بڑھیں۔",
          hi: "भीड़ से बचाव: अगर घनी भीड़ में फंस जाएं — बाज़ू सीने पर क्रॉस करें। नीचे न झुकें। तिरछी दिशा में किनारे की ओर बढ़ें।",
        }
      },
      {
        text: {
          en: "SEPARATION PROTOCOL: Before entering Haram, agree on a meeting point with your group (e.g., 'King Fahd Gate, pillar #3'). Keep your phone charged. Share your live location via WhatsApp. Carry a card with your hotel name/address in Arabic.",
          ar: "بروتوكول الانفصال: قبل دخول الحرم، اتفق على نقطة التقاء مع مجموعتك. اشحن هاتفك. شارك موقعك المباشر عبر واتساب.",
          ur: "بچھڑنے کا پروٹوکول: حرم میں داخل ہونے سے پہلے گروپ کے ساتھ ملاقات کی جگہ طے کریں۔ فون چارج رکھیں۔ واٹس ایپ پر لائیو لوکیشن شیئر کریں۔",
          hi: "बिछड़ने का प्रोटोकॉल: हरम में प्रवेश से पहले अपने ग्रुप के साथ मिलने की जगह तय करें। फ़ोन चार्ज रखें। व्हाट्सऐप पर लाइव लोकेशन शेयर करें।",
        }
      },
      {
        text: {
          en: "MEDICAL EMERGENCY: Saudi emergency number is 911. Red Crescent ambulances are stationed at every Haram gate. First-aid rooms are inside the Haram on every floor. If someone collapses: check breathing, call 911, do NOT move them unless in immediate danger.",
          ar: "الطوارئ الطبية: رقم الطوارئ السعودي 911. سيارات إسعاف الهلال الأحمر عند كل باب. غرف إسعافات أولية في كل طابق.",
          ur: "طبی ایمرجنسی: سعودی ایمرجنسی نمبر 911 ہے۔ ہلال احمر ایمبولینسز ہر حرم گیٹ پر ہیں۔ فرسٹ ایڈ رومز ہر منزل پر ہیں۔",
          hi: "मेडिकल इमरजेंसी: सऊदी इमरजेंसी नंबर 911 है। रेड क्रिसेंट एम्बुलेंस हर हरम गेट पर हैं। फ़र्स्ट एड रूम हर मंज़िल पर हैं।",
        }
      },
      {
        text: {
          en: "POLICE INTERACTION: Always carry your passport or a color photocopy. If stopped by police, remain calm, show your Hajj/Umrah permit (Nusuk app), and cooperate fully. If you don't speak Arabic, say 'Hindi' or 'Urdu' — they will find a translator.",
          ar: "التعامل مع الشرطة: احمل جواز سفرك دائماً أو صورة ملونة. إذا أوقفتك الشرطة، ابق هادئاً وأظهر تصريح الحج/العمرة.",
          ur: "پولیس سے بات: ہمیشہ پاسپورٹ یا رنگین کاپی رکھیں۔ اگر پولیس روکے تو پرسکون رہیں، حج/عمرہ پرمٹ (نسک ایپ) دکھائیں۔",
          hi: "पुलिस से बातचीत: हमेशा पासपोर्ट या रंगीन कॉपी रखें। अगर पुलिस रोके तो शांत रहें, हज/उमरा परमिट (नुसुक ऐप) दिखाएं।",
        }
      },
      {
        text: {
          en: "LOST ELDERLY/CHILDREN: Report immediately to the nearest Haram security booth. Provide a recent photo, full name, and nationality. Saudi authorities have facial recognition systems at the Haram — they can locate people within minutes.",
          ar: "فقدان المسنين/الأطفال: أبلغ فوراً أقرب كشك أمن. قدم صورة حديثة والاسم والجنسية. السلطات السعودية لديها أنظمة تعرف على الوجوه.",
          ur: "بزرگوں/بچوں کا گم ہونا: فوراً قریبی حرم سیکیورٹی بوتھ کو رپورٹ کریں۔ حالیہ تصویر، مکمل نام، اور قومیت دیں۔",
          hi: "बुज़ुर्गों/बच्चों का खो जाना: तुरंत निकटतम हरम सुरक्षा बूथ को रिपोर्ट करें। हाल की फ़ोटो, पूरा नाम, और राष्ट्रीयता दें।",
        }
      }
    ],
    duaGuidance: {
      en: "In times of distress: 'La ilaha illallahu al-Azeem al-Haleem, la ilaha illallahu Rabbu al-arsh al-azeem, la ilaha illallahu Rabbu as-samawati wa Rabbu al-ard wa Rabbu al-arsh al-kareem.' Also: 'Hasbunallahu wa ni'mal wakeel' (Allah is sufficient for us and He is the best disposer of affairs).",
      ar: "في الشدة: 'لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السموات ورب الأرض ورب العرش الكريم.' و'حسبنا الله ونعم الوكيل.'",
      ur: "مشکل کے وقت: 'لا إله إلا الله العظيم الحليم...' اور 'حسبنا الله ونعم الوكيل'۔",
      hi: "मुसीबत के समय: 'ला इलाहा इल्लल्लाहुल अज़ीमुल हलीम...' और 'हसबुनल्लाहु व निअमल वकील'।",
    },
    mistakes: [
      {
        text: {
          en: "Not having a pre-agreed meeting point — 'near the Kaaba' is NOT a meeting point when 2 million people are there",
          ar: "عدم وجود نقطة التقاء متفق عليها — 'قرب الكعبة' ليست نقطة التقاء عندما يكون هناك 2 مليون شخص",
          ur: "'کعبہ کے قریب' ملاقات کی جگہ نہیں ہے جب 20 لاکھ لوگ ہوں — پہلے سے جگہ طے کریں",
          hi: "'काबा के पास' मिलने की जगह नहीं है जब 20 लाख लोग हों — पहले से जगह तय करें",
        }
      },
      {
        text: {
          en: "Panicking in dense crowds and pushing — this causes stampedes. Stay calm, protect your chest, move diagonally",
          ar: "الذعر في الحشود الكثيفة والدفع — هذا يسبب التدافع. ابق هادئاً وتحرك بشكل مائل",
          ur: "گھنی بھیڑ میں گھبرانا اور دھکا دینا — یہ بھگدڑ کا سبب بنتا ہے۔ پرسکون رہیں، ترچھی سمت بڑھیں",
          hi: "घनी भीड़ में घबराना और धक्का देना — यह भगदड़ का कारण बनता है। शांत रहें, तिरछी दिशा में बढ़ें",
        }
      },
      {
        text: {
          en: "Not carrying hotel address in Arabic — if lost, you can't communicate your destination to taxi drivers or police",
          ar: "عدم حمل عنوان الفندق بالعربية — إذا ضعت، لن تستطيع إيصال وجهتك للسائقين أو الشرطة",
          ur: "عربی میں ہوٹل کا پتہ نہ رکھنا — اگر گم ہو جائیں تو ڈرائیوروں یا پولیس کو منزل نہیں بتا سکیں گے",
          hi: "अरबी में होटल का पता न रखना — अगर खो जाएं तो ड्राइवरों या पुलिस को मंज़िल नहीं बता सकेंगे",
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
