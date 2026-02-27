import { Language, LocalizedString } from "@/contexts/LanguageContext";

export interface GuideStep {
  order: number;
  instruction: LocalizedString;
}

export interface HadithReference {
  text: LocalizedString;
  source: string;
}

export interface ImportantBoundary {
  text: LocalizedString;
}

export interface MistakeToAvoid {
  id: string;
  text: LocalizedString;
}

export interface MadinahGuideTopic {
  id: string;
  order: number;
  title: LocalizedString;
  whatItIs: LocalizedString;
  steps: GuideStep[];
  duaGuidance: LocalizedString;
  hadith?: HadithReference;
  importantBoundaries: ImportantBoundary[];
  mistakes: MistakeToAvoid[];
}

export const MADINAH_GUIDE_TOPICS: MadinahGuideTopic[] = [
  {
    id: "entering-nabawi",
    order: 1,
    title: {
      en: "Entering Masjid an-Nabawi",
      ar: "دخول المسجد النبوي",
      ur: "مسجد نبوی میں داخلہ",
      hi: "मस्जिद-ए-नबवी में प्रवेश",
      tr: "Mescid-i Nebevi'ye Giriş",
      ru: "Вход в мечеть Пророка"
    },
    whatItIs: {
      en: "Masjid an-Nabawi is the Prophet's ﷺ mosque in Madinah, one of the three sacred mosques in Islam. Entering with proper etiquette shows respect for this blessed place and its history.",
      ar: "المسجد النبوي هو مسجد النبي ﷺ في المدينة المنورة، أحد المساجد الثلاثة المقدسة في الإسلام. الدخول بالآداب الصحيحة يُظهر الاحترام لهذا المكان المبارك وتاريخه.",
      ur: "مسجد نبوی مدینہ منورہ میں نبی کریم ﷺ کی مسجد ہے، اسلام کی تین مقدس مساجد میں سے ایک۔ صحیح آداب کے ساتھ داخل ہونا اس مبارک جگہ اور اس کی تاریخ کا احترام ظاہر کرتا ہے۔",
      hi: "मस्जिद-ए-नबवी मदीना में पैगंबर ﷺ की मस्जिद है, इस्लाम की तीन पवित्र मस्जिदों में से एक। उचित शिष्टाचार के साथ प्रवेश इस धन्य स्थान और इसके इतिहास के प्रति सम्मान दर्शाता है।",
      tr: "Mescid-i Nebevi, Medine'de Hz. Peygamber'in ﷺ mescididir ve İslam'ın üç kutsal mescidinden biridir. Uygun edeplerle girmek bu mübarek mekana ve tarihine saygı gösterir.",
      ru: "Мечеть Пророка в Медине — одна из трёх священных мечетей Ислама. Вход с соблюдением этикета выражает уважение к этому благословенному месту и его истории."
    },
    steps: [
      {
        order: 1,
        instruction: {
          en: "Enter with your right foot first, saying: 'Bismillah, Allahumma salli 'ala Muhammad, Allahumma aftah li abwaba rahmatik' (In the name of Allah, O Allah send blessings upon Muhammad, O Allah open for me the doors of Your mercy).",
          ar: "ادخل برجلك اليمنى أولاً، قائلاً: 'بسم الله، اللهم صلِّ على محمد، اللهم افتح لي أبواب رحمتك'.",
          ur: "اپنے دائیں پاؤں سے پہلے داخل ہوں، یہ کہتے ہوئے: 'بسم اللہ، اللهم صلّ على محمد، اللهم افتح لي أبواب رحمتك'۔",
          hi: "दाएं पैर से पहले प्रवेश करें, कहते हुए: 'बिस्मिल्लाह, अल्लाहुम्मा सल्लि अला मुहम्मद, अल्लाहुम्मा अफ्तह ली अब्वाबा रहमतिक'।",
          tr: "Sağ ayağınızla girin ve şunu söyleyin: 'Bismillah, Allahümme salli ala Muhammed, Allahümme iftah li ebvabe rahmetik'.",
          ru: "Входите с правой ноги, говоря: 'Бисмиллях, Аллахумма салли аля Мухаммад, Аллахумма ифтах ли абваба рахматик'."
        }
      },
      {
        order: 2,
        instruction: {
          en: "Walk calmly and quietly without rushing or pushing others.",
          ar: "امشِ بهدوء وسكينة دون استعجال أو دفع الآخرين.",
          ur: "سکون اور خاموشی سے چلیں، جلدی یا دوسروں کو دھکا نہ دیں۔",
          hi: "शांति और चुपचाप चलें, जल्दबाजी या दूसरों को धक्का न दें।",
          tr: "Sakin ve sessizce yürüyün, acele etmeyin veya başkalarını itmeyin.",
          ru: "Идите спокойно и тихо, не торопитесь и не толкайте других."
        }
      },
      {
        order: 3,
        instruction: {
          en: "Pray two rak'ahs of Tahiyyat al-Masjid (greeting the mosque) if you are able.",
          ar: "صلِّ ركعتين تحية المسجد إن استطعت.",
          ur: "اگر ممکن ہو تو تحیۃ المسجد کی دو رکعات پڑھیں۔",
          hi: "यदि संभव हो तो तहियत-उल-मस्जिद की दो रकात पढ़ें।",
          tr: "Mümkünse Tahiyyetü'l-mescid olarak iki rekat namaz kılın.",
          ru: "Если возможно, совершите два ракаата приветствия мечети."
        }
      },
      {
        order: 4,
        instruction: {
          en: "Find a place to sit and engage in dhikr, du'a, or Quran recitation.",
          ar: "ابحث عن مكان للجلوس واشتغل بالذكر أو الدعاء أو تلاوة القرآن.",
          ur: "بیٹھنے کی جگہ تلاش کریں اور ذکر، دعا، یا قرآن کی تلاوت میں مشغول ہوں۔",
          hi: "बैठने की जगह खोजें और ज़िक्र, दुआ, या कुरान पढ़ने में व्यस्त हों।",
          tr: "Oturacak bir yer bulun ve zikir, dua veya Kur'an tilaveti ile meşgul olun.",
          ru: "Найдите место для сидения и займитесь зикром, дуа или чтением Корана."
        }
      }
    ],
    duaGuidance: {
      en: "Upon entering: 'Allahumma aftah li abwaba rahmatik' (O Allah, open for me the doors of Your mercy). You may make any personal du'a in your own language.",
      ar: "عند الدخول: 'اللهم افتح لي أبواب رحمتك'. يمكنك الدعاء بأي دعاء شخصي بلغتك.",
      ur: "داخل ہوتے وقت: 'اللهم افتح لي أبواب رحمتك'۔ آپ اپنی زبان میں کوئی بھی ذاتی دعا کر سکتے ہیں۔",
      hi: "प्रवेश करते समय: 'अल्लाहुम्मा अफ्तह ली अब्वाबा रहमतिक'। आप अपनी भाषा में कोई भी व्यक्तिगत दुआ कर सकते हैं।",
      tr: "Girerken: 'Allahümme iftah li ebvabe rahmetik'. Kendi dilinizde kişisel dua edebilirsiniz.",
      ru: "При входе: 'Аллахумма ифтах ли абваба рахматик'. Можете читать любые личные дуа на своём языке."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'A prayer in this mosque of mine is better than a thousand prayers elsewhere, except for Masjid al-Haram.'",
        ar: "قال النبي ﷺ: 'صلاة في مسجدي هذا أفضل من ألف صلاة فيما سواه إلا المسجد الحرام'.",
        ur: "نبی کریم ﷺ نے فرمایا: 'میری اس مسجد میں ایک نماز مسجد حرام کے سوا ہر جگہ سے ہزار نمازوں سے بہتر ہے۔'",
        hi: "पैगंबर ﷺ ने कहा: 'मेरी इस मस्जिद में एक नमाज़ मस्जिद-उल-हराम के अलावा हर जगह से हज़ार नमाज़ों से बेहतर है।'",
        tr: "Hz. Peygamber ﷺ buyurdu: 'Benim bu mescidimde kılınan bir namaz, Mescid-i Haram hariç başka yerlerde kılınan bin namazdan daha faziletlidir.'",
        ru: "Пророк ﷺ сказал: 'Молитва в моей мечети лучше тысячи молитв в других местах, кроме Заповедной мечети.'"
      },
      source: "Sahih al-Bukhari"
    },
    importantBoundaries: [
      {
        text: {
          en: "Maintain quiet reverence at all times within the mosque.",
          ar: "حافظ على السكينة والهدوء في جميع الأوقات داخل المسجد.",
          ur: "مسجد کے اندر ہر وقت خاموش احترام برقرار رکھیں۔",
          hi: "मस्जिद के अंदर हर समय शांत सम्मान बनाए रखें।",
          tr: "Mescid içinde her zaman sessiz bir hürmet içinde olun.",
          ru: "Сохраняйте тихое благоговение внутри мечети."
        }
      },
      {
        text: {
          en: "Follow the directions of the mosque staff and security.",
          ar: "اتبع توجيهات موظفي المسجد والأمن.",
          ur: "مسجد کے عملے اور سیکیورٹی کی ہدایات پر عمل کریں۔",
          hi: "मस्जिद के कर्मचारियों और सुरक्षा के निर्देशों का पालन करें।",
          tr: "Mescid görevlilerinin ve güvenliğin talimatlarına uyun.",
          ru: "Следуйте указаниям персонала и охраны мечети."
        }
      }
    ],
    mistakes: [
      {
        id: "nabawi-1",
        text: {
          en: "Speaking loudly or having phone conversations inside the mosque.",
          ar: "التحدث بصوت عالٍ أو إجراء مكالمات هاتفية داخل المسجد.",
          ur: "مسجد کے اندر اونچی آواز میں بات کرنا یا فون پر بات کرنا۔",
          hi: "मस्जिद के अंदर ज़ोर से बोलना या फ़ोन पर बात करना।",
          tr: "Mescid içinde yüksek sesle konuşmak veya telefonda konuşmak.",
          ru: "Громкие разговоры или телефонные звонки внутри мечети."
        }
      },
      {
        id: "nabawi-2",
        text: {
          en: "Rushing or pushing to reach specific spots.",
          ar: "الاستعجال أو الدفع للوصول إلى أماكن معينة.",
          ur: "مخصوص جگہوں تک پہنچنے کے لیے جلدی یا دھکا دینا۔",
          hi: "विशेष स्थानों तक पहुंचने के लिए जल्दबाजी या धक्का देना।",
          tr: "Belirli yerlere ulaşmak için acele etmek veya itmek.",
          ru: "Спешка или толкотня, чтобы достичь определённых мест."
        }
      },
      {
        id: "nabawi-3",
        text: {
          en: "Blocking pathways or sitting in walking areas.",
          ar: "سد الممرات أو الجلوس في مناطق المشي.",
          ur: "راستے بند کرنا یا چلنے والی جگہوں پر بیٹھنا۔",
          hi: "रास्ते बंद करना या चलने वाले क्षेत्रों में बैठना।",
          tr: "Geçiş yollarını kapatmak veya yürüme alanlarında oturmak.",
          ru: "Блокирование проходов или сидение на пешеходных дорожках."
        }
      }
    ]
  },
  {
    id: "salawat-prophet",
    order: 2,
    title: {
      en: "Sending Salawat upon the Prophet ﷺ",
      ar: "الصلاة على النبي ﷺ",
      ur: "نبی کریم ﷺ پر درود بھیجنا",
      hi: "पैगंबर ﷺ पर सलावात भेजना",
      tr: "Hz. Peygamber'e ﷺ Salavat Getirmek",
      ru: "Приветствие Пророку ﷺ"
    },
    whatItIs: {
      en: "Sending salawat (blessings) upon the Prophet ﷺ is an act of love and respect. In Madinah, pilgrims increase their salawat as they are in the city of the beloved Messenger ﷺ.",
      ar: "الصلاة على النبي ﷺ هي عمل من أعمال المحبة والاحترام. في المدينة، يُكثر الحجاج من الصلاة على النبي لأنهم في مدينة الرسول الحبيب ﷺ.",
      ur: "نبی کریم ﷺ پر درود بھیجنا محبت اور احترام کا عمل ہے۔ مدینہ میں، زائرین درود زیادہ پڑھتے ہیں کیونکہ وہ محبوب رسول ﷺ کے شہر میں ہیں۔",
      hi: "पैगंबर ﷺ पर सलावात भेजना प्रेम और सम्मान का कार्य है। मदीना में, तीर्थयात्री अपना सलावात बढ़ाते हैं क्योंकि वे प्रिय रसूल ﷺ के शहर में हैं।",
      tr: "Hz. Peygamber'e ﷺ salavat getirmek sevgi ve saygı ifadesidir. Medine'de hacılar, sevgili Resul'ün ﷺ şehrinde oldukları için salavatlarını artırırlar.",
      ru: "Приветствие Пророку ﷺ — это акт любви и уважения. В Медине паломники увеличивают салават, находясь в городе любимого Посланника ﷺ."
    },
    steps: [
      {
        order: 1,
        instruction: {
          en: "Recite salawat frequently throughout your stay: 'Allahumma salli 'ala Muhammad wa 'ala aali Muhammad' (O Allah, send blessings upon Muhammad and upon the family of Muhammad).",
          ar: "أكثر من الصلاة على النبي طوال إقامتك: 'اللهم صلِّ على محمد وعلى آل محمد'.",
          ur: "اپنے قیام کے دوران بار بار درود پڑھیں: 'اللهم صلّ على محمد وعلى آل محمد'۔",
          hi: "अपने प्रवास के दौरान बार-बार सलावात पढ़ें: 'अल्लाहुम्मा सल्लि अला मुहम्मद व अला आलि मुहम्मद'।",
          tr: "Kalışınız boyunca sık sık salavat getirin: 'Allahümme salli ala Muhammed ve ala ali Muhammed'.",
          ru: "Часто читайте салават во время пребывания: 'Аллахумма салли аля Мухаммад ва аля али Мухаммад'."
        }
      },
      {
        order: 2,
        instruction: {
          en: "Increase your salawat especially on Fridays, as the Prophet ﷺ encouraged this practice.",
          ar: "أكثر من الصلاة على النبي خاصة يوم الجمعة، كما حثّ على ذلك النبي ﷺ.",
          ur: "خاص طور پر جمعے کے دن درود زیادہ پڑھیں، جیسا کہ نبی کریم ﷺ نے اس کی ترغیب دی۔",
          hi: "विशेष रूप से जुमे के दिन अपना सलावात बढ़ाएं, जैसा कि पैगंबर ﷺ ने इसे प्रोत्साहित किया।",
          tr: "Özellikle Cuma günleri salavatınızı artırın, Hz. Peygamber ﷺ bunu teşvik etmiştir.",
          ru: "Увеличивайте салават особенно по пятницам, как побуждал Пророк ﷺ."
        }
      },
      {
        order: 3,
        instruction: {
          en: "You may recite any form of salawat you know, including longer versions like Salat al-Ibrahimiyya.",
          ar: "يمكنك قراءة أي صيغة للصلاة على النبي تعرفها، بما في ذلك الصيغ الطويلة مثل الصلاة الإبراهيمية.",
          ur: "آپ کوئی بھی درود پڑھ سکتے ہیں جو آپ جانتے ہیں، بشمول طویل صورتیں جیسے صلاۃ ابراہیمیہ۔",
          hi: "आप कोई भी सलावात पढ़ सकते हैं जो आप जानते हैं, जिसमें सलात अल-इब्राहीमिया जैसे लंबे संस्करण शामिल हैं।",
          tr: "Bildiğiniz herhangi bir salavat formülünü okuyabilirsiniz, Salat-ı İbrahimiye gibi uzun versiyonlar dahil.",
          ru: "Можете читать любую форму салавата, которую знаете, включая длинные версии, такие как Салат аль-Ибрахимийя."
        }
      },
      {
        order: 4,
        instruction: {
          en: "Maintain a state of gratitude and love while sending blessings.",
          ar: "حافظ على حالة من الشكر والحب أثناء الصلاة على النبي.",
          ur: "درود بھیجتے وقت شکر گزاری اور محبت کی کیفیت برقرار رکھیں۔",
          hi: "आशीर्वाद भेजते समय कृतज्ञता और प्रेम की स्थिति बनाए रखें।",
          tr: "Salavat getirirken şükür ve sevgi halini muhafaza edin.",
          ru: "Сохраняйте состояние благодарности и любви, отправляя благословения."
        }
      }
    ],
    duaGuidance: {
      en: "The simplest form: 'Allahumma salli 'ala Muhammad'. You may also recite: 'Allahumma salli 'ala Muhammadin wa 'ala aali Muhammadin kama sallayta 'ala Ibrahima wa 'ala aali Ibrahima, innaka Hamidun Majid.'",
      ar: "أبسط صيغة: 'اللهم صلِّ على محمد'. يمكنك أيضًا قراءة: 'اللهم صلِّ على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد'.",
      ur: "سب سے آسان صورت: 'اللهم صلّ على محمد'۔ آپ یہ بھی پڑھ سکتے ہیں: 'اللهم صلّ على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد'۔",
      hi: "सबसे सरल रूप: 'अल्लाहुम्मा सल्लि अला मुहम्मद'। आप यह भी पढ़ सकते हैं: 'अल्लाहुम्मा सल्लि अला मुहम्मदिन व अला आलि मुहम्मदिन कमा सल्लैता अला इब्राहीमा व अला आलि इब्राहीमा इन्नका हमीदुन मजीद'।",
      tr: "En basit formu: 'Allahümme salli ala Muhammed'. Şunu da okuyabilirsiniz: 'Allahümme salli ala Muhammedin ve ala ali Muhammedin kema salleyte ala İbrahime ve ala ali İbrahime inneke Hamidun Mecid'.",
      ru: "Простейшая форма: 'Аллахумма салли аля Мухаммад'. Можете также читать: 'Аллахумма салли аля Мухаммадин ва аля али Мухаммадин кама саллайта аля Ибрахима ва аля али Ибрахима иннака Хамидун Маджид'."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Whoever sends blessings upon me once, Allah will send blessings upon him tenfold.'",
        ar: "قال النبي ﷺ: 'من صلى عليّ صلاة واحدة صلى الله عليه بها عشرًا'.",
        ur: "نبی کریم ﷺ نے فرمایا: 'جو مجھ پر ایک بار درود بھیجے، اللہ اس پر دس رحمتیں نازل فرماتا ہے۔'",
        hi: "पैगंबर ﷺ ने कहा: 'जो मुझ पर एक बार सलावात भेजता है, अल्लाह उस पर दस गुना रहमत भेजता है।'",
        tr: "Hz. Peygamber ﷺ buyurdu: 'Kim bana bir kez salat getirirse, Allah ona on kez salat eder.'",
        ru: "Пророк ﷺ сказал: 'Кто пошлёт мне благословение один раз, Аллах пошлёт ему благословение десятикратно.'"
      },
      source: "Sahih Muslim"
    },
    importantBoundaries: [
      {
        text: {
          en: "Salawat is an act of worship directed to Allah, asking Him to bless the Prophet ﷺ.",
          ar: "الصلاة على النبي عبادة موجهة لله، نطلب منه أن يُصلّي على النبي ﷺ.",
          ur: "درود اللہ کی طرف موجہ عبادت ہے، ہم اللہ سے نبی ﷺ پر رحمت بھیجنے کی درخواست کرتے ہیں۔",
          hi: "सलावात अल्लाह की ओर निर्देशित इबादत है, उससे पैगंबर ﷺ पर आशीर्वाद भेजने की प्रार्थना।",
          tr: "Salavat, Allah'a yöneltilen bir ibadettir, O'ndan Hz. Peygamber'e ﷺ salat etmesini isteriz.",
          ru: "Салават — это поклонение, направленное к Аллаху, с просьбой благословить Пророка ﷺ."
        }
      },
      {
        text: {
          en: "Your salawat reaches the Prophet ﷺ wherever you are; there is no need to be at a specific location.",
          ar: "صلاتك على النبي تصله ﷺ أينما كنت؛ لا حاجة للتواجد في مكان معين.",
          ur: "آپ کا درود نبی ﷺ تک پہنچتا ہے چاہے آپ کہیں بھی ہوں؛ کسی خاص جگہ ہونے کی ضرورت نہیں۔",
          hi: "आपका सलावात पैगंबर ﷺ तक पहुंचता है चाहे आप कहीं भी हों; किसी विशेष स्थान पर होने की आवश्यकता नहीं।",
          tr: "Salavatınız nerede olursanız olun Hz. Peygamber'e ﷺ ulaşır; belirli bir yerde olmanıza gerek yoktur.",
          ru: "Ваш салават достигает Пророка ﷺ, где бы вы ни находились; нет необходимости быть в определённом месте."
        }
      }
    ],
    mistakes: [
      {
        id: "salawat-1",
        text: {
          en: "Believing salawat can only be accepted in specific locations.",
          ar: "الاعتقاد بأن الصلاة على النبي لا تُقبل إلا في أماكن معينة.",
          ur: "یہ ماننا کہ درود صرف مخصوص جگہوں پر قبول ہوتا ہے۔",
          hi: "यह मानना कि सलावात केवल विशेष स्थानों पर ही स्वीकार होता है।",
          tr: "Salavatın yalnızca belirli yerlerde kabul edileceğine inanmak.",
          ru: "Вера в то, что салават принимается только в определённых местах."
        }
      },
      {
        id: "salawat-2",
        text: {
          en: "Reciting salawat loudly in a way that disturbs others praying.",
          ar: "قراءة الصلاة على النبي بصوت عالٍ بشكل يزعج المصلين الآخرين.",
          ur: "درود اتنی اونچی آواز میں پڑھنا جو دوسرے نمازیوں کو پریشان کرے۔",
          hi: "इतनी ऊंची आवाज में सलावात पढ़ना जो अन्य नमाज़ियों को परेशान करे।",
          tr: "Başkalarının namazını bozacak şekilde yüksek sesle salavat getirmek.",
          ru: "Чтение салавата громко, мешая другим молящимся."
        }
      },
      {
        id: "salawat-3",
        text: {
          en: "Inventing new forms of salawat with unauthentic additions.",
          ar: "اختراع صيغ جديدة للصلاة على النبي بإضافات غير ثابتة.",
          ur: "غیر مستند اضافوں کے ساتھ درود کی نئی صورتیں ایجاد کرنا۔",
          hi: "अप्रामाणिक अतिरिक्त के साथ सलावात के नए रूपों का आविष्कार करना।",
          tr: "Sahih olmayan ilavelerle yeni salavat formları icat etmek.",
          ru: "Изобретение новых форм салавата с недостоверными дополнениями."
        }
      }
    ]
  },
  {
    id: "visiting-rawdah",
    order: 3,
    title: {
      en: "Visiting the Rawdah",
      ar: "زيارة الروضة",
      ur: "روضہ کی زیارت",
      hi: "रौज़ा की ज़ियारत",
      tr: "Ravza Ziyareti",
      ru: "Посещение Равды"
    },
    whatItIs: {
      en: "The Rawdah is the blessed area between the Prophet's ﷺ pulpit (minbar) and his house (now his resting place). The Prophet ﷺ described it as 'a garden from the gardens of Paradise.'",
      ar: "الروضة هي المنطقة المباركة بين منبر النبي ﷺ وبيته (الآن مرقده). وصفها النبي ﷺ بأنها 'روضة من رياض الجنة'.",
      ur: "روضہ وہ مبارک جگہ ہے جو نبی ﷺ کے منبر اور آپ کے گھر (اب آپ کی آرام گاہ) کے درمیان ہے۔ نبی کریم ﷺ نے اسے 'جنت کے باغوں میں سے ایک باغ' قرار دیا۔",
      hi: "रौज़ा पैगंबर ﷺ के मिंबर और उनके घर (अब उनकी आराम गाह) के बीच का मुबारक क्षेत्र है। पैगंबर ﷺ ने इसे 'जन्नत के बागों में से एक बाग' बताया।",
      tr: "Ravza, Hz. Peygamber'in ﷺ minberi ile evi (şimdi kabri) arasındaki mübarek alandır. Hz. Peygamber ﷺ buraları 'Cennet bahçelerinden bir bahçe' olarak nitelendirmiştir.",
      ru: "Равда — благословенная область между минбаром Пророка ﷺ и его домом (ныне местом его упокоения). Пророк ﷺ описал её как 'сад из садов Рая'."
    },
    steps: [
      {
        order: 1,
        instruction: {
          en: "Access to the Rawdah is managed by mosque staff. Follow the designated entry times and routes, especially for women who have separate timings.",
          ar: "الوصول إلى الروضة يُنظّم من قِبَل موظفي المسجد. اتبع أوقات وطرق الدخول المحددة، خاصة للنساء اللواتي لديهن أوقات منفصلة.",
          ur: "روضہ تک رسائی مسجد کے عملے کی نگرانی میں ہے۔ مقررہ اوقات اور راستوں پر عمل کریں، خاص طور پر خواتین کے لیے جن کے الگ اوقات ہیں۔",
          hi: "रौज़ा तक पहुंच मस्जिद कर्मचारियों द्वारा प्रबंधित है। निर्धारित प्रवेश समय और मार्गों का पालन करें, विशेष रूप से महिलाओं के लिए जिनके अलग समय हैं।",
          tr: "Ravza'ya erişim mescid görevlileri tarafından yönetilir. Belirlenen giriş zamanlarını ve güzergahlarını takip edin, özellikle ayrı vakitleri olan hanımlar için.",
          ru: "Доступ в Равду контролируется персоналом мечети. Следуйте установленному времени и маршрутам входа, особенно для женщин, у которых отдельное время."
        }
      },
      {
        order: 2,
        instruction: {
          en: "Wait patiently in line without pushing. The Rawdah can be very crowded.",
          ar: "انتظر بصبر في الصف دون دفع. قد تكون الروضة مزدحمة جدًا.",
          ur: "قطار میں صبر سے انتظار کریں، دھکا نہ دیں۔ روضہ بہت بھیڑ والا ہو سکتا ہے۔",
          hi: "धक्का दिए बिना धैर्यपूर्वक लाइन में प्रतीक्षा करें। रौज़ा बहुत भीड़ वाला हो सकता है।",
          tr: "Sırada sabırla bekleyin, itmeyin. Ravza çok kalabalık olabilir.",
          ru: "Терпеливо ждите в очереди, не толкаясь. В Равде может быть очень многолюдно."
        }
      },
      {
        order: 3,
        instruction: {
          en: "When inside, pray two rak'ahs if there is space. If not, make du'a and move on to allow others access.",
          ar: "عند الدخول، صلِّ ركعتين إذا وُجد مكان. إن لم يكن، ادعُ وتحرك لإفساح المجال للآخرين.",
          ur: "جب اندر جائیں تو جگہ ہو تو دو رکعات پڑھیں۔ اگر نہ ہو تو دعا کریں اور آگے بڑھیں تاکہ دوسروں کو جگہ ملے۔",
          hi: "अंदर जाने पर, यदि जगह हो तो दो रकात पढ़ें। यदि नहीं, तो दुआ करें और दूसरों को जगह देने के लिए आगे बढ़ें।",
          tr: "İçeri girdiğinizde yer varsa iki rekat namaz kılın. Yoksa dua edin ve başkalarına yer açmak için ilerleyin.",
          ru: "Внутри совершите два ракаата, если есть место. Если нет, сделайте дуа и освободите место для других."
        }
      },
      {
        order: 4,
        instruction: {
          en: "Do not linger excessively; be mindful of others waiting to enter.",
          ar: "لا تتأخر كثيرًا؛ كن مراعيًا للآخرين المنتظرين للدخول.",
          ur: "زیادہ دیر نہ ٹھہریں؛ دوسروں کا خیال رکھیں جو داخل ہونے کا انتظار کر رہے ہیں۔",
          hi: "अत्यधिक समय न लगाएं; प्रवेश की प्रतीक्षा कर रहे दूसरों का ध्यान रखें।",
          tr: "Çok fazla oyalanmayın; girmeyi bekleyen diğerlerini düşünün.",
          ru: "Не задерживайтесь слишком долго; помните о других, ожидающих входа."
        }
      }
    ],
    duaGuidance: {
      en: "Make any sincere du'a in your own language. This is a special place for supplication, but du'a is accepted everywhere. Ask Allah for whatever your heart desires.",
      ar: "ادعُ بأي دعاء صادق بلغتك. هذا مكان خاص للدعاء، لكن الدعاء مقبول في كل مكان. اسأل الله ما يشتهي قلبك.",
      ur: "اپنی زبان میں کوئی بھی خلوص سے دعا کریں۔ یہ دعا کی خاص جگہ ہے، لیکن دعا ہر جگہ قبول ہوتی ہے۔ اللہ سے اپنے دل کی ہر مراد مانگیں۔",
      hi: "अपनी भाषा में कोई भी सच्ची दुआ करें। यह दुआ के लिए विशेष स्थान है, लेकिन दुआ हर जगह स्वीकार होती है। अल्लाह से जो भी आपका दिल चाहे मांगें।",
      tr: "Kendi dilinizde samimi bir dua edin. Burası dua için özel bir yerdir, ancak dua her yerde kabul edilir. Kalbinizin arzuladığı her şeyi Allah'tan isteyin.",
      ru: "Делайте любую искреннюю дуа на своём языке. Это особое место для мольбы, но дуа принимается везде. Просите у Аллаха всё, чего желает ваше сердце."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'The area between my house and my pulpit is a garden from the gardens of Paradise.'",
        ar: "قال النبي ﷺ: 'ما بين بيتي ومنبري روضة من رياض الجنة'.",
        ur: "نبی کریم ﷺ نے فرمایا: 'میرے گھر اور میرے منبر کے درمیان جنت کے باغوں میں سے ایک باغ ہے۔'",
        hi: "पैगंबर ﷺ ने कहा: 'मेरे घर और मेरे मिंबर के बीच का क्षेत्र जन्नत के बागों में से एक बाग है।'",
        tr: "Hz. Peygamber ﷺ buyurdu: 'Evimle minberim arası, cennet bahçelerinden bir bahçedir.'",
        ru: "Пророк ﷺ сказал: 'Область между моим домом и моим минбаром — сад из садов Рая.'"
      },
      source: "Sahih al-Bukhari"
    },
    importantBoundaries: [
      {
        text: {
          en: "If you cannot enter the Rawdah due to crowds, your prayers elsewhere in Masjid an-Nabawi are still blessed.",
          ar: "إذا لم تستطع دخول الروضة بسبب الزحام، فصلاتك في أي مكان آخر من المسجد النبوي مباركة.",
          ur: "اگر بھیڑ کی وجہ سے روضہ میں داخل نہ ہو سکیں تو مسجد نبوی میں کہیں بھی آپ کی نماز مبارک ہے۔",
          hi: "यदि भीड़ के कारण रौज़ा में प्रवेश नहीं कर सकते, तो मस्जिद-ए-नबवी में कहीं भी आपकी नमाज़ मुबारक है।",
          tr: "Kalabalık nedeniyle Ravza'ya giremezseniz, Mescid-i Nebevi'nin herhangi bir yerinde kıldığınız namaz da mübarektir.",
          ru: "Если не можете войти в Равду из-за толпы, ваши молитвы в любом месте мечети Пророка также благословенны."
        }
      },
      {
        text: {
          en: "Please follow the guidance given by your Hajj group or trainer regarding Rawdah access.",
          ar: "يرجى اتباع توجيهات مجموعة الحج أو المدرب الخاص بك بشأن الوصول إلى الروضة.",
          ur: "روضہ تک رسائی کے بارے میں اپنے حج گروپ یا ٹرینر کی ہدایات پر عمل کریں۔",
          hi: "रौज़ा तक पहुंच के बारे में अपने हज ग्रुप या ट्रेनर के मार्गदर्शन का पालन करें।",
          tr: "Ravza'ya erişim konusunda Hac grubunuzun veya eğitmeninizin rehberliğine uyun.",
          ru: "Следуйте указаниям вашей хадж-группы или наставника относительно доступа в Равду."
        }
      }
    ],
    mistakes: [
      {
        id: "rawdah-1",
        text: {
          en: "Pushing, shoving, or fighting to enter the Rawdah.",
          ar: "الدفع أو المشاحنة أو القتال للدخول إلى الروضة.",
          ur: "روضہ میں داخل ہونے کے لیے دھکا دینا، دھکم پیل کرنا یا لڑنا۔",
          hi: "रौज़ा में प्रवेश के लिए धक्का देना, धक्कम-धक्का करना या लड़ना।",
          tr: "Ravza'ya girmek için itmek, kakışmak veya kavga etmek.",
          ru: "Толкание, расталкивание или драка для входа в Равду."
        }
      },
      {
        id: "rawdah-2",
        text: {
          en: "Staying too long and blocking others from accessing the blessed area.",
          ar: "البقاء طويلاً ومنع الآخرين من الوصول إلى المنطقة المباركة.",
          ur: "بہت دیر ٹھہرنا اور دوسروں کو مبارک جگہ تک پہنچنے سے روکنا۔",
          hi: "बहुत देर रुकना और दूसरों को मुबारक क्षेत्र तक पहुंचने से रोकना।",
          tr: "Çok uzun süre kalarak başkalarının mübarek alana erişimini engellemek.",
          ru: "Слишком долгое пребывание и блокирование доступа других к благословенному месту."
        }
      },
      {
        id: "rawdah-3",
        text: {
          en: "Becoming upset or angry if unable to enter the Rawdah.",
          ar: "الانزعاج أو الغضب إذا لم تستطع دخول الروضة.",
          ur: "روضہ میں داخل نہ ہو سکنے پر پریشان یا ناراض ہونا۔",
          hi: "रौज़ा में प्रवेश न मिलने पर परेशान या नाराज़ होना।",
          tr: "Ravza'ya giremediğinizde üzülmek veya kızmak.",
          ru: "Расстраиваться или злиться, если не удаётся войти в Равду."
        }
      }
    ]
  },
  {
    id: "grave-etiquette",
    order: 4,
    title: {
      en: "Grave Etiquette",
      ar: "آداب زيارة القبر",
      ur: "قبر کے آداب",
      hi: "क़ब्र के आदाब",
      tr: "Kabir Ziyareti Adabı",
      ru: "Этикет посещения могилы"
    },
    whatItIs: {
      en: "The Prophet ﷺ is buried in his former house, which is now enclosed within Masjid an-Nabawi. Pilgrims may offer greetings (salam) to the Prophet ﷺ and his companions Abu Bakr and Umar (may Allah be pleased with them) who are also buried there.",
      ar: "النبي ﷺ مدفون في بيته السابق، الذي أصبح الآن جزءًا من المسجد النبوي. يمكن للحجاج إلقاء السلام على النبي ﷺ وصاحبيه أبي بكر وعمر رضي الله عنهما المدفونَين هناك أيضًا.",
      ur: "نبی کریم ﷺ اپنے سابق گھر میں مدفون ہیں، جو اب مسجد نبوی کا حصہ ہے۔ زائرین نبی کریم ﷺ اور آپ کے صحابہ ابوبکر و عمر رضی اللہ عنہما کو سلام پیش کر سکتے ہیں جو وہاں دفن ہیں۔",
      hi: "पैगंबर ﷺ अपने पुराने घर में दफ़न हैं, जो अब मस्जिद-ए-नबवी का हिस्सा है। तीर्थयात्री पैगंबर ﷺ और उनके साथियों अबू बक्र और उमर (रज़ि.) को सलाम पेश कर सकते हैं जो वहां दफ़न हैं।",
      tr: "Hz. Peygamber ﷺ, artık Mescid-i Nebevi'nin içinde yer alan eski evinde metfundur. Hacılar, Hz. Peygamber'e ﷺ ve orada medfun olan ashabı Hz. Ebu Bekir ve Hz. Ömer'e (r.a.) selam verebilirler.",
      ru: "Пророк ﷺ похоронен в своём бывшем доме, который теперь находится внутри мечети Пророка. Паломники могут передать приветствие Пророку ﷺ и его сподвижникам Абу Бакру и Умару (да будет доволен ими Аллах), которые также там похоронены."
    },
    steps: [
      {
        order: 1,
        instruction: {
          en: "Approach the area calmly and respectfully. Face the grave (the green dome area) and say: 'As-salamu alayka ya Rasulullah' (Peace be upon you, O Messenger of Allah).",
          ar: "اقترب من المنطقة بهدوء واحترام. واجه القبر (منطقة القبة الخضراء) وقل: 'السلام عليك يا رسول الله'.",
          ur: "اس جگہ کی طرف سکون اور احترام سے جائیں۔ قبر (سبز گنبد والے علاقے) کی طرف منہ کریں اور کہیں: 'السلام عليك يا رسول الله'۔",
          hi: "शांति और सम्मान से उस क्षेत्र की ओर जाएं। क़ब्र (हरे गुंबद वाले क्षेत्र) की ओर मुंह करें और कहें: 'अस्सलामु अलैका या रसूलल्लाह'।",
          tr: "Alana sakin ve saygılı bir şekilde yaklaşın. Kabre (yeşil kubbe bölgesi) yönelin ve şunu söyleyin: 'Es-selamu aleyke ya Resulallah'.",
          ru: "Подойдите к месту спокойно и уважительно. Обратитесь к могиле (область зелёного купола) и скажите: 'Ас-саляму алейка йа Расулюллах'."
        }
      },
      {
        order: 2,
        instruction: {
          en: "Move slightly to the right and greet Abu Bakr (رضي الله عنه): 'As-salamu alayka ya Aba Bakr, khalifata Rasulillah' (Peace be upon you, O Abu Bakr, successor of the Messenger of Allah).",
          ar: "تحرك قليلاً إلى اليمين وسلّم على أبي بكر رضي الله عنه: 'السلام عليك يا أبا بكر خليفة رسول الله'.",
          ur: "تھوڑا دائیں طرف جائیں اور ابوبکر (رضی اللہ عنہ) کو سلام کریں: 'السلام عليك يا أبا بكر خليفة رسول الله'۔",
          hi: "थोड़ा दाईं ओर जाएं और अबू बक्र (रज़ि.) को सलाम करें: 'अस्सलामु अलैका या अबा बक्र, ख़लीफ़त रसूलिल्लाह'।",
          tr: "Biraz sağa ilerleyin ve Hz. Ebu Bekir'e (r.a.) selam verin: 'Es-selamu aleyke ya Eba Bekr, halifete Resulillah'.",
          ru: "Сдвиньтесь немного вправо и поприветствуйте Абу Бакра (да будет доволен им Аллах): 'Ас-саляму алейка йа Аба Бакр, халифата Расулиллях'."
        }
      },
      {
        order: 3,
        instruction: {
          en: "Move slightly more to the right and greet Umar (رضي الله عنه): 'As-salamu alayka ya Umar, Amir al-Mu'minin' (Peace be upon you, O Umar, Commander of the Faithful).",
          ar: "تحرك أكثر قليلاً إلى اليمين وسلّم على عمر رضي الله عنه: 'السلام عليك يا عمر أمير المؤمنين'.",
          ur: "تھوڑا اور دائیں طرف جائیں اور عمر (رضی اللہ عنہ) کو سلام کریں: 'السلام عليك يا عمر أمير المؤمنين'۔",
          hi: "थोड़ा और दाईं ओर जाएं और उमर (रज़ि.) को सलाम करें: 'अस्सलामु अलैका या उमर, अमीर-उल-मोमिनीन'।",
          tr: "Biraz daha sağa ilerleyin ve Hz. Ömer'e (r.a.) selam verin: 'Es-selamu aleyke ya Ömer, Emiru'l-Mü'minin'.",
          ru: "Сдвиньтесь ещё немного вправо и поприветствуйте Умара (да будет доволен им Аллах): 'Ас-саляму алейка йа Умар, Амир аль-Муъминин'."
        }
      },
      {
        order: 4,
        instruction: {
          en: "Then turn away and face the Qiblah to make du'a to Allah alone.",
          ar: "ثم انصرف واستقبل القبلة للدعاء لله وحده.",
          ur: "پھر مڑ کر قبلہ کی طرف منہ کریں اور صرف اللہ سے دعا کریں۔",
          hi: "फिर मुड़ जाएं और क़िब्ला की ओर मुंह करके केवल अल्लाह से दुआ करें।",
          tr: "Sonra dönün ve yalnızca Allah'a dua etmek için Kıble'ye yönelin.",
          ru: "Затем повернитесь и обратитесь к Кибле, чтобы делать дуа только Аллаху."
        }
      }
    ],
    duaGuidance: {
      en: "Greetings (salam) are for the Prophet ﷺ and his companions. Du'a (supplication) is made only to Allah. After greeting, face the Qiblah and make du'a to Allah for anything you need.",
      ar: "السلام للنبي ﷺ وأصحابه. الدعاء لله وحده. بعد السلام، استقبل القبلة وادعُ الله بما تحتاج.",
      ur: "سلام نبی ﷺ اور صحابہ کے لیے ہے۔ دعا صرف اللہ سے کی جاتی ہے۔ سلام کے بعد، قبلہ کی طرف منہ کریں اور اللہ سے جو چاہیں مانگیں۔",
      hi: "सलाम पैगंबर ﷺ और उनके साथियों के लिए है। दुआ केवल अल्लाह से की जाती है। सलाम के बाद, क़िब्ला की ओर मुंह करें और अल्लाह से जो चाहें मांगें।",
      tr: "Selam Hz. Peygamber ﷺ ve ashabı içindir. Dua yalnızca Allah'a yapılır. Selamdan sonra Kıble'ye dönün ve Allah'tan ihtiyaçlarınızı isteyin.",
      ru: "Приветствие (салям) — для Пророка ﷺ и его сподвижников. Дуа (мольба) обращается только к Аллаху. После приветствия повернитесь к Кибле и просите Аллаха о чём угодно."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Do not make my grave a place of celebration, and send blessings upon me, for your blessings reach me wherever you are.'",
        ar: "قال النبي ﷺ: 'لا تجعلوا قبري عيدًا، وصلّوا عليّ فإن صلاتكم تبلغني حيث كنتم'.",
        ur: "نبی کریم ﷺ نے فرمایا: 'میری قبر کو میلے کی جگہ نہ بناؤ، اور مجھ پر درود بھیجو کیونکہ تمہارا درود مجھ تک پہنچتا ہے تم جہاں بھی ہو۔'",
        hi: "पैगंबर ﷺ ने कहा: 'मेरी क़ब्र को उत्सव का स्थान न बनाओ, और मुझ पर दरूद भेजो, क्योंकि तुम्हारा दरूद मुझ तक पहुंचता है तुम जहां भी हो।'",
        tr: "Hz. Peygamber ﷺ buyurdu: 'Kabrimi bayram yeri yapmayın, bana salavat getirin; çünkü salavatınız nerede olursanız olun bana ulaşır.'",
        ru: "Пророк ﷺ сказал: 'Не превращайте мою могилу в место празднеств, и посылайте мне благословения, ибо ваши благословения достигают меня, где бы вы ни были.'"
      },
      source: "Sunan Abu Dawud"
    },
    importantBoundaries: [
      {
        text: {
          en: "Supplications (du'a) are made to Allah alone, not to the Prophet ﷺ or anyone else.",
          ar: "الدعاء لله وحده، لا للنبي ﷺ ولا لأي أحد آخر.",
          ur: "دعائیں صرف اللہ سے کی جاتی ہیں، نبی ﷺ یا کسی اور سے نہیں۔",
          hi: "दुआएं केवल अल्लाह से की जाती हैं, पैगंबर ﷺ या किसी और से नहीं।",
          tr: "Dualar yalnızca Allah'a yapılır, Hz. Peygamber'e ﷺ veya başka birine değil.",
          ru: "Мольбы (дуа) обращаются только к Аллаху, а не к Пророку ﷺ или кому-либо ещё."
        }
      },
      {
        text: {
          en: "Do not touch, kiss, or wipe the barriers around the grave area.",
          ar: "لا تلمس أو تقبّل أو تمسح الحواجز حول منطقة القبر.",
          ur: "قبر کے ارد گرد رکاوٹوں کو نہ چھوئیں، نہ چومیں، نہ پوچھیں۔",
          hi: "क़ब्र क्षेत्र के आसपास की रुकावटों को न छुएं, न चूमें, न पोंछें।",
          tr: "Kabir alanının etrafındaki bariyerlere dokunmayın, öpmeyin veya silmeyin.",
          ru: "Не прикасайтесь, не целуйте и не протирайте барьеры вокруг могилы."
        }
      },
      {
        text: {
          en: "A brief, respectful greeting is sufficient. Avoid prolonged stays that block others.",
          ar: "السلام الموجز والمحترم كافٍ. تجنب البقاء الطويل الذي يعيق الآخرين.",
          ur: "مختصر، باعزت سلام کافی ہے۔ لمبا ٹھہرنا جو دوسروں کی راہ میں رکاوٹ ہو، سے بچیں۔",
          hi: "संक्षिप्त, सम्मानजनक सलाम पर्याप्त है। लंबे समय तक रुकने से बचें जो दूसरों को रोके।",
          tr: "Kısa, saygılı bir selam yeterlidir. Başkalarını engelleyecek uzun süreli duruşlardan kaçının.",
          ru: "Краткое уважительное приветствие достаточно. Избегайте длительного пребывания, которое мешает другим."
        }
      }
    ],
    mistakes: [
      {
        id: "grave-1",
        text: {
          en: "Making du'a to the Prophet ﷺ instead of to Allah.",
          ar: "الدعاء للنبي ﷺ بدلاً من الله.",
          ur: "اللہ کی بجائے نبی ﷺ سے دعا کرنا۔",
          hi: "अल्लाह की बजाय पैगंबर ﷺ से दुआ करना।",
          tr: "Allah yerine Hz. Peygamber'e ﷺ dua etmek.",
          ru: "Обращение с дуа к Пророку ﷺ вместо Аллаха."
        }
      },
      {
        id: "grave-2",
        text: {
          en: "Touching or trying to enter the barriers around the grave.",
          ar: "لمس أو محاولة الدخول إلى الحواجز حول القبر.",
          ur: "قبر کے ارد گرد رکاوٹوں کو چھونا یا داخل ہونے کی کوشش کرنا۔",
          hi: "क़ब्र के आसपास की रुकावटों को छूना या प्रवेश करने की कोशिश करना।",
          tr: "Kabrin etrafındaki bariyerlere dokunmak veya içeri girmeye çalışmak.",
          ru: "Прикосновение к барьерам или попытка войти за них."
        }
      },
      {
        id: "grave-3",
        text: {
          en: "Excessive wailing, crying loudly, or emotional displays that disturb others.",
          ar: "النواح المفرط، البكاء بصوت عالٍ، أو إظهار المشاعر التي تزعج الآخرين.",
          ur: "ضرورت سے زیادہ نوحہ، اونچی آواز میں رونا، یا جذباتی مظاہرے جو دوسروں کو پریشان کریں۔",
          hi: "अत्यधिक विलाप, ज़ोर से रोना, या भावनात्मक प्रदर्शन जो दूसरों को परेशान करे।",
          tr: "Aşırı ağıt, yüksek sesle ağlama veya başkalarını rahatsız eden duygusal gösteriler.",
          ru: "Чрезмерные причитания, громкий плач или эмоциональные проявления, которые беспокоят других."
        }
      },
      {
        id: "grave-4",
        text: {
          en: "Throwing money, letters, or objects toward the grave area.",
          ar: "رمي النقود أو الرسائل أو الأشياء نحو منطقة القبر.",
          ur: "قبر کی طرف پیسے، خطوط، یا چیزیں پھینکنا۔",
          hi: "क़ब्र क्षेत्र की ओर पैसे, पत्र, या वस्तुएं फेंकना।",
          tr: "Kabir bölgesine para, mektup veya eşya atmak.",
          ru: "Бросание денег, писем или предметов в сторону могилы."
        }
      }
    ]
  },
  {
    id: "general-conduct-madinah",
    order: 5,
    title: {
      en: "General Conduct in Madinah",
      ar: "السلوك العام في المدينة",
      ur: "مدینہ میں عمومی طرز عمل",
      hi: "मदीना में सामान्य आचरण",
      tr: "Medine'de Genel Davranış",
      ru: "Общее поведение в Медине"
    },
    whatItIs: {
      en: "Madinah is the city of the Prophet ﷺ, a place of peace and tranquility. Pilgrims should maintain respectful and calm behavior throughout their stay to honor this blessed city.",
      ar: "المدينة هي مدينة النبي ﷺ، مكان السلام والسكينة. يجب على الحجاج الحفاظ على سلوك محترم وهادئ طوال إقامتهم تكريمًا لهذه المدينة المباركة.",
      ur: "مدینہ نبی کریم ﷺ کا شہر ہے، امن و سکون کی جگہ۔ زائرین کو اپنے پورے قیام کے دوران اس مبارک شہر کے احترام میں محترمانہ اور پرسکون رویہ رکھنا چاہیے۔",
      hi: "मदीना पैगंबर ﷺ का शहर है, शांति और सुकून की जगह। तीर्थयात्रियों को इस धन्य शहर के सम्मान में अपने पूरे प्रवास के दौरान सम्मानजनक और शांत व्यवहार बनाए रखना चाहिए।",
      tr: "Medine, Hz. Peygamber'in ﷺ şehridir, huzur ve sükûnet yeridir. Hacılar, bu mübarek şehre hürmeten kalışları boyunca saygılı ve sakin davranmalıdırlar.",
      ru: "Медина — город Пророка ﷺ, место мира и спокойствия. Паломники должны сохранять уважительное и спокойное поведение на протяжении всего пребывания, чтя этот благословенный город."
    },
    steps: [
      {
        order: 1,
        instruction: {
          en: "Pray as many prayers as possible in Masjid an-Nabawi, especially the five daily prayers.",
          ar: "صلِّ أكبر عدد ممكن من الصلوات في المسجد النبوي، خاصة الصلوات الخمس اليومية.",
          ur: "مسجد نبوی میں زیادہ سے زیادہ نمازیں پڑھیں، خاص طور پر پانچ وقت کی نمازیں۔",
          hi: "मस्जिद-ए-नबवी में जितनी संभव हो उतनी नमाज़ें पढ़ें, विशेष रूप से पांच दैनिक नमाज़ें।",
          tr: "Mescid-i Nebevi'de mümkün olduğunca çok namaz kılın, özellikle beş vakit namaz.",
          ru: "Совершайте как можно больше молитв в мечети Пророка, особенно пять ежедневных молитв."
        }
      },
      {
        order: 2,
        instruction: {
          en: "Spend time in dhikr, Quran recitation, and reflection.",
          ar: "اقضِ وقتًا في الذكر وتلاوة القرآن والتأمل.",
          ur: "ذکر، قرآن کی تلاوت، اور تفکر میں وقت گزاریں۔",
          hi: "ज़िक्र, कुरान तिलावत, और चिंतन में समय बिताएं।",
          tr: "Zikir, Kur'an tilaveti ve tefekkürle vakit geçirin.",
          ru: "Проводите время в зикре, чтении Корана и размышлениях."
        }
      },
      {
        order: 3,
        instruction: {
          en: "Be kind and patient with fellow pilgrims and local residents.",
          ar: "كن لطيفًا وصبورًا مع الحجاج الآخرين والسكان المحليين.",
          ur: "ساتھی زائرین اور مقامی رہائشیوں کے ساتھ مہربان اور صبر کرنے والے رہیں۔",
          hi: "साथी तीर्थयात्रियों और स्थानीय निवासियों के साथ दयालु और धैर्यवान रहें।",
          tr: "Diğer hacılara ve yerel halka karşı nazik ve sabırlı olun.",
          ru: "Будьте добры и терпеливы с другими паломниками и местными жителями."
        }
      },
      {
        order: 4,
        instruction: {
          en: "Keep your accommodation clean and respect shared spaces.",
          ar: "حافظ على نظافة مسكنك واحترم الأماكن المشتركة.",
          ur: "اپنی رہائش کو صاف رکھیں اور مشترکہ جگہوں کا احترام کریں۔",
          hi: "अपने आवास को साफ रखें और साझा स्थानों का सम्मान करें।",
          tr: "Konaklama yerinizi temiz tutun ve ortak alanların hakkına riayet edin.",
          ru: "Содержите своё жильё в чистоте и уважайте общие пространства."
        }
      },
      {
        order: 5,
        instruction: {
          en: "Use your time in Madinah for worship, not for excessive shopping or sightseeing.",
          ar: "استخدم وقتك في المدينة للعبادة، وليس للتسوق المفرط أو السياحة.",
          ur: "مدینہ میں اپنا وقت عبادت کے لیے استعمال کریں، ضرورت سے زیادہ خریداری یا سیر و تفریح کے لیے نہیں۔",
          hi: "मदीना में अपना समय इबादत के लिए उपयोग करें, अत्यधिक खरीदारी या दर्शनीय स्थलों की यात्रा के लिए नहीं।",
          tr: "Medine'deki vaktinizi ibadet için kullanın, aşırı alışveriş veya gezi için değil.",
          ru: "Используйте время в Медине для поклонения, а не для чрезмерного шопинга или экскурсий."
        }
      }
    ],
    duaGuidance: {
      en: "Make abundant du'a during your stay. Ask Allah for forgiveness, guidance, and blessings for yourself and your family. Any du'a in any language is accepted.",
      ar: "أكثر من الدعاء خلال إقامتك. اسأل الله المغفرة والهداية والبركة لك ولعائلتك. أي دعاء بأي لغة مقبول.",
      ur: "اپنے قیام کے دوران کثرت سے دعا کریں۔ اللہ سے اپنے اور اپنے خاندان کے لیے مغفرت، ہدایت اور برکت مانگیں۔ کسی بھی زبان میں کوئی بھی دعا قبول ہے۔",
      hi: "अपने प्रवास के दौरान भरपूर दुआ करें। अल्लाह से अपने और अपने परिवार के लिए माफी, मार्गदर्शन और आशीर्वाद मांगें। किसी भी भाषा में कोई भी दुआ स्वीकार होती है।",
      tr: "Kalışınız boyunca bol bol dua edin. Allah'tan kendiniz ve aileniz için mağfiret, hidayet ve bereket isteyin. Herhangi bir dilde herhangi bir dua kabul edilir.",
      ru: "Делайте обильные дуа во время пребывания. Просите у Аллаха прощения, руководства и благословения для себя и своей семьи. Любая дуа на любом языке принимается."
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ said: 'Madinah is a sanctuary from this place to that. Its trees should not be cut and no innovation should be innovated in it.'",
        ar: "قال النبي ﷺ: 'المدينة حَرَم من كذا إلى كذا، لا يُقطع شجرها، ولا يُحدث فيها بدعة'.",
        ur: "نبی کریم ﷺ نے فرمایا: 'مدینہ یہاں سے وہاں تک حرم ہے، اس کے درخت نہ کاٹے جائیں اور نہ اس میں کوئی بدعت ایجاد کی جائے۔'",
        hi: "पैगंबर ﷺ ने कहा: 'मदीना यहां से वहां तक हरम है, इसके पेड़ न काटे जाएं और न इसमें कोई बिदअत ईजाद की जाए।'",
        tr: "Hz. Peygamber ﷺ buyurdu: 'Medine şuradan şuraya kadar haremdir. Ağaçları kesilmez ve içinde bid'at çıkarılmaz.'",
        ru: "Пророк ﷺ сказал: 'Медина — это заповедник отсюда и дотуда. Её деревья не должны срубаться, и в ней не должны вводиться нововведения.'"
      },
      source: "Sahih al-Bukhari"
    },
    importantBoundaries: [
      {
        text: {
          en: "Respect prayer times and mosque rules at all times.",
          ar: "احترم أوقات الصلاة وقواعد المسجد في جميع الأوقات.",
          ur: "ہر وقت نماز کے اوقات اور مسجد کے قواعد کا احترام کریں۔",
          hi: "हर समय नमाज़ के समय और मस्जिद के नियमों का सम्मान करें।",
          tr: "Her zaman namaz vakitlerine ve mescid kurallarına saygı gösterin.",
          ru: "Всегда уважайте время молитв и правила мечети."
        }
      },
      {
        text: {
          en: "Follow Saudi regulations and security instructions.",
          ar: "اتبع الأنظمة السعودية وتعليمات الأمن.",
          ur: "سعودی قوانین اور سیکیورٹی ہدایات پر عمل کریں۔",
          hi: "सऊदी नियमों और सुरक्षा निर्देशों का पालन करें।",
          tr: "Suudi düzenlemelerine ve güvenlik talimatlarına uyun.",
          ru: "Следуйте саудовским правилам и указаниям безопасности."
        }
      }
    ],
    mistakes: [
      {
        id: "conduct-1",
        text: {
          en: "Wasting time in excessive shopping or worldly activities.",
          ar: "إضاعة الوقت في التسوق المفرط أو الأنشطة الدنيوية.",
          ur: "ضرورت سے زیادہ خریداری یا دنیاوی سرگرمیوں میں وقت ضائع کرنا۔",
          hi: "अत्यधिक खरीदारी या दुनियावी गतिविधियों में समय बर्बाद करना।",
          tr: "Aşırı alışveriş veya dünyevi faaliyetlerle vakit kaybetmek.",
          ru: "Трата времени на чрезмерный шопинг или мирские занятия."
        }
      },
      {
        id: "conduct-2",
        text: {
          en: "Missing congregational prayers due to laziness or poor planning.",
          ar: "تفويت صلاة الجماعة بسبب الكسل أو سوء التخطيط.",
          ur: "سستی یا خراب منصوبہ بندی کی وجہ سے جماعت کی نماز چھوڑنا۔",
          hi: "आलस्य या खराब योजना के कारण जमाअत की नमाज़ छोड़ना।",
          tr: "Tembellik veya kötü planlama nedeniyle cemaat namazlarını kaçırmak.",
          ru: "Пропуск коллективных молитв из-за лени или плохого планирования."
        }
      },
      {
        id: "conduct-3",
        text: {
          en: "Engaging in arguments, disputes, or negative speech.",
          ar: "الدخول في جدالات أو نزاعات أو كلام سلبي.",
          ur: "بحث، جھگڑوں، یا منفی گفتگو میں مشغول ہونا۔",
          hi: "बहस, विवादों, या नकारात्मक बातों में शामिल होना।",
          tr: "Tartışmalara, anlaşmazlıklara veya olumsuz konuşmalara girmek.",
          ru: "Участие в спорах, конфликтах или негативных разговорах."
        }
      },
      {
        id: "conduct-4",
        text: {
          en: "Littering or disrespecting the cleanliness of the city.",
          ar: "إلقاء القمامة أو عدم احترام نظافة المدينة.",
          ur: "کچرا پھیلانا یا شہر کی صفائی کا عدم احترام۔",
          hi: "कूड़ा फैलाना या शहर की स्वच्छता का अनादर करना।",
          tr: "Çöp atmak veya şehrin temizliğine saygısızlık etmek.",
          ru: "Мусорить или не уважать чистоту города."
        }
      }
    ]
  },
  {
    id: "rawdah-booking-strategy",
    order: 6,
    title: { en: "Rawdah Booking Strategy & Nusuk App", ar: "استراتيجية حجز الروضة وتطبيق نسك", ur: "روضہ بکنگ حکمت عملی اور نسک ایپ", hi: "रौज़ा बुकिंग रणनीति और नुसुक ऐप" },
    whatItIs: { en: "Rawdah access is now managed through the Nusuk app booking system. Slots fill up within minutes of release. Without a strategy, you'll spend your entire Madinah stay without ever entering the Rawdah.", ar: "الوصول للروضة يُدار عبر نظام حجز تطبيق نسك. الأماكن تمتلئ في دقائق.", ur: "روضہ تک رسائی اب نسک ایپ بکنگ سسٹم سے ہوتی ہے۔ سلاٹ منٹوں میں بھر جاتے ہیں۔", hi: "रौज़ा तक पहुंच अब नुसुक ऐप बुकिंग सिस्टम से होती है। स्लॉट मिनटों में भर जाते हैं।" },
    steps: [
      { order: 1, instruction: { en: "INSTALL NUSUK APP BEFORE TRAVEL: Download from App Store/Play Store. Register with your passport details. Do this at least 1 week before arriving in Madinah.", ar: "ثبّت تطبيق نسك قبل السفر: حمّله وسجّل ببيانات جواز السفر قبل أسبوع.", ur: "سفر سے پہلے نسک ایپ انسٹال کریں۔ پاسپورٹ سے رجسٹر کریں۔ مدینہ پہنچنے سے 1 ہفتہ پہلے کریں۔", hi: "यात्रा से पहले नुसुक ऐप इंस्टॉल करें। पासपोर्ट से रजिस्टर करें। मदीना पहुंचने से 1 हफ़्ते पहले करें।" } },
      { order: 2, instruction: { en: "BOOKING TIMING: New Rawdah slots release at 12:00 AM Saudi time. Set alarm for 11:55 PM, open app, refresh at midnight. Women's slots released separately.", ar: "توقيت الحجز: تُطلق أماكن الروضة في 12:00 منتصف الليل. اضبط منبه 11:55 مساءً.", ur: "بکنگ کا وقت: نئے سلاٹ رات 12:00 سعودی وقت پر آتے ہیں۔ رات 11:55 کا الارم لگائیں۔", hi: "बुकिंग समय: नए स्लॉट रात 12:00 सऊदी समय पर आते हैं। रात 11:55 का अलार्म लगाएं।" } },
      { order: 3, instruction: { en: "BEST SLOT TIMES: Early morning (after Fajr, 5:30-7:00 AM) — shortest queues. Late night (10:00-11:30 PM) — also less crowded. Avoid post-Dhuhr and post-Asr slots.", ar: "أفضل الأوقات: الصباح الباكر بعد الفجر. الليل المتأخر أيضاً أقل ازدحاماً.", ur: "بہترین اوقات: صبح سویرے فجر کے بعد۔ دیر رات بھی کم بھیڑ والے ہیں۔", hi: "सर्वश्रेष्ठ समय: सुबह-सवेरे फज्र के बाद। देर रात भी कम भीड़ वाले हैं।" } },
      { order: 4, instruction: { en: "WOMEN'S ACCESS: Women have separate designated time slots (typically morning hours). Same Nusuk app booking. Arrive 15 minutes before your slot. Sections clearly marked with barriers and staff guidance.", ar: "دخول النساء: أوقات مخصصة منفصلة. نفس الحجز عبر نسك. اصلي قبل 15 دقيقة.", ur: "خواتین کی رسائی: الگ مخصوص سلاٹ (عام طور پر صبح)۔ نسک ایپ سے بکنگ۔ 15 منٹ پہلے پہنچیں۔", hi: "महिलाओं की पहुंच: अलग निर्धारित स्लॉट (आमतौर पर सुबह)। नुसुक ऐप से बुकिंग। 15 मिनट पहले पहुंचें।" } }
    ],
    duaGuidance: { en: "Prepare your du'a list before entering. Pray 2 rak'ahs and make extensive du'a. If you cannot get a slot, your prayers anywhere in Masjid an-Nabawi carry 1000x reward.", ar: "جهّز قائمة أدعيتك. صلِّ ركعتين وادعُ. صلاتك في أي مكان بالمسجد النبوي بألف صلاة.", ur: "دعاؤں کی فہرست تیار رکھیں۔ 2 رکعات پڑھیں۔ مسجد نبوی میں کہیں بھی نماز 1000 گنا ثواب۔", hi: "दुआओं की सूची तैयार रखें। 2 रकात पढ़ें। मस्जिद-ए-नबवी में कहीं भी नमाज़ 1000 गुना सवाब।" },
    importantBoundaries: [{ text: { en: "Your allotted Rawdah time is typically 10-15 minutes. Move when asked by staff.", ar: "وقتك المخصص 10-15 دقيقة. تحرك عندما يُطلب.", ur: "مقررہ وقت 10-15 منٹ۔ عملے کی ہدایت پر آگے بڑھیں۔", hi: "निर्धारित समय 10-15 मिनट। स्टाफ़ के कहने पर आगे बढ़ें।" } }],
    mistakes: [
      { id: "rb-1", text: { en: "Waiting until Madinah to install Nusuk app — registration takes time and slots may be gone.", ar: "انتظار الوصول لتثبيت نسك — التسجيل يأخذ وقتاً.", ur: "مدینہ پہنچ کر نسک انسٹال کرنا — رجسٹریشن میں وقت لگتا ہے۔", hi: "मदीना पहुंचकर नुसुक इंस्टॉल करना — रजिस्ट्रेशन में समय लगता है।" } },
      { id: "rb-2", text: { en: "Trying to enter Rawdah without a booking — security will turn you away.", ar: "محاولة الدخول بدون حجز — الأمن سيرفضك.", ur: "بغیر بکنگ روضہ میں داخل ہونا — سیکیورٹی واپس بھیج دے گی۔", hi: "बिना बुकिंग रौज़ा में प्रवेश — सुरक्षा वापस भेज देगी।" } }
    ]
  },
  {
    id: "prayer-optimization-schedule",
    order: 7,
    title: { en: "Daily Prayer Optimization Schedule", ar: "جدول تحسين الصلاة اليومي", ur: "روزانہ نماز کی بہترین ترتیب", hi: "दैनिक नमाज़ अनुकूलन शेड्यूल" },
    whatItIs: { en: "Every prayer in Masjid an-Nabawi equals 1,000 prayers elsewhere. A well-planned daily schedule maximizes your prayer count while managing energy and sleep.", ar: "كل صلاة في المسجد النبوي تعادل 1000 صلاة. جدول مُحكم يزيد عدد صلواتك.", ur: "مسجد نبوی میں ہر نماز 1000 نمازوں کے برابر ہے۔ اچھی منصوبہ بندی سے نمازوں کی تعداد بڑھائیں۔", hi: "मस्जिद-ए-नबवी में हर नमाज़ 1000 नमाज़ों के बराबर है। अच्छी योजना से नमाज़ों की संख्या बढ़ाएं।" },
    steps: [
      { order: 1, instruction: { en: "FAJR: Arrive 45 min before Adhan. Pray Tahajjud. After Fajr, stay for Ishraq (15-20 min after sunrise) — reward of complete Hajj & Umrah (Tirmidhi).", ar: "الفجر: اصل قبل 45 دقيقة. صلِّ التهجد. ابق للإشراق — أجر حج وعمرة.", ur: "فجر: 45 منٹ پہلے پہنچیں۔ تہجد پڑھیں۔ اشراق تک رکیں — مکمل حج و عمرہ کا ثواب۔", hi: "फज्र: 45 मिनट पहले पहुंचें। तहज्जुद पढ़ें। इश्राक तक रुकें — पूरे हज और उमरा का सवाब।" } },
      { order: 2, instruction: { en: "REST: Return to hotel after Ishraq (~7 AM). Sleep until 11 AM. This is critical recovery. Exhaustion collapses happen to pilgrims who skip sleep.", ar: "الراحة: عد للفندق بعد الإشراق. نم حتى 11 صباحاً. هذه فترة تعافي حرجة.", ur: "آرام: اشراق کے بعد ہوٹل واپسی۔ 11 بجے تک سوئیں۔ یہ بحالی کا اہم وقت ہے۔", hi: "आराम: इश्राक के बाद होटल वापसी। 11 बजे तक सोएं। यह रिकवरी का ज़रूरी समय है।" } },
      { order: 3, instruction: { en: "DHUHR-ASR BLOCK: Arrive 30 min before Dhuhr, stay through Asr. Use gap for Quran and du'a. Saves two round trips.", ar: "الظهر-العصر: اصل قبل 30 دقيقة. ابق للعصر. استغل الوقت للقرآن.", ur: "ظہر-عصر بلاک: 30 منٹ پہلے پہنچیں، عصر تک رکیں۔ قرآن اور دعا کے لیے وقت۔", hi: "ज़ुहर-अस्र ब्लॉक: 30 मिनट पहले पहुंचें, अस्र तक रुकें। क़ुरआन और दुआ के लिए समय।" } },
      { order: 4, instruction: { en: "MAGHRIB-ISHA BLOCK: Arrive before Maghrib, stay through Isha. After Isha — Rawdah visit (if booked) or extended du'a. Hotel by 10:30 PM for sleep.", ar: "المغرب-العشاء: اصل قبل المغرب. بعد العشاء — الروضة أو الدعاء. الفندق بحلول 10:30.", ur: "مغرب-عشاء: مغرب سے پہلے پہنچیں۔ عشاء کے بعد — روضہ یا دعا۔ 10:30 تک ہوٹل۔", hi: "मग़रिब-इशा: मग़रिब से पहले पहुंचें। इशा के बाद — रौज़ा या दुआ। 10:30 तक होटल।" } }
    ],
    duaGuidance: { en: "Best times for du'a: last third of night, between Adhan and Iqamah, after obligatory prayers, sitting after Fajr until sunrise.", ar: "أفضل أوقات الدعاء: الثلث الأخير من الليل، بين الأذان والإقامة، بعد الفريضة.", ur: "دعا کے بہترین اوقات: رات کا آخری تہائی، اذان اور اقامت کے درمیان، فرض نماز کے بعد۔", hi: "दुआ के सर्वश्रेष्ठ समय: रात का आखिरी तिहाई, अज़ान और इक़ामत के बीच, फ़र्ज़ नमाज़ के बाद।" },
    importantBoundaries: [],
    mistakes: [
      { id: "po-1", text: { en: "All 5 prayers + Tahajjud with no sleep — you'll collapse by day 3.", ar: "الخمس كلها + التهجد بدون نوم — ستنهار في اليوم الثالث.", ur: "پانچوں نمازیں + تہجد بغیر نیند — تیسرے دن گریں گے۔", hi: "पांचों नमाज़ें + तहज्जुद बिना नींद — तीसरे दिन गिर जाएंगे।" } },
      { id: "po-2", text: { en: "Leaving after Fajr instead of staying for Ishraq — you miss Hajj/Umrah reward for just 20 min wait.", ar: "المغادرة بعد الفجر بدل الإشراق — تفوت أجر حج وعمرة.", ur: "فجر کے بعد چلے جانا بجائے اشراق — 20 منٹ سے حج/عمرہ کا ثواب۔", hi: "फज्र के बाद चले जाना बजाय इश्राक — 20 मिनट से हज/उमरा का सवाब।" } }
    ]
  },
  {
    id: "smart-ziyarat-routing",
    order: 8,
    title: { en: "Smart Ziyarat Routing", ar: "تخطيط الزيارات الذكي", ur: "ذہین زیارت کی ترتیب", hi: "स्मार्ट ज़ियारत रूटिंग" },
    whatItIs: { en: "Madinah has several significant sites beyond the mosque. This guide provides optimized routing that minimizes backtracking and avoids peak crowd times.", ar: "في المدينة عدة مواقع مهمة. هذا الدليل يوفر ترتيباً مُحسّناً يقلل التراجع ويتجنب أوقات الذروة.", ur: "مدینہ میں مسجد کے علاوہ کئی اہم مقامات ہیں۔ یہ گائیڈ بہترین ترتیب فراہم کرتا ہے۔", hi: "मदीना में मस्जिद के अलावा कई महत्वपूर्ण स्थान हैं। यह गाइड इष्टतम क्रम प्रदान करता है।" },
    steps: [
      { order: 1, instruction: { en: "MASJID QUBA: Visit after Fajr or before Dhuhr. Pray 2 rak'ahs — reward equals an Umrah (Tirmidhi). ~3.5 km south. Taxi ~10-15 SAR.", ar: "مسجد قباء: زره بعد الفجر. صلِّ ركعتين — أجر عمرة. ~3.5 كم. تاكسي ~10-15 ريال.", ur: "مسجد قباء: فجر کے بعد جائیں۔ 2 رکعات — عمرہ کا ثواب۔ ~3.5 کلومیٹر۔ ٹیکسی ~10-15 ریال۔", hi: "मस्जिद क़ुबा: फज्र के बाद जाएं। 2 रकात — उमरा का सवाब। ~3.5 किमी। टैक्सी ~10-15 रियाल।" } },
      { order: 2, instruction: { en: "UHUD & MARTYRS: Visit early morning (7-9 AM) when cooler. Greet martyrs with salam. Do NOT climb Mount Uhud — steep and unsafe. Taxi ~15-20 SAR.", ar: "أحد والشهداء: صباحاً (7-9). سلّم على الشهداء. لا تتسلق الجبل. تاكسي ~15-20 ريال.", ur: "احد اور شہداء: صبح (7-9) جائیں۔ سلام کریں۔ جبل احد پر نہ چڑھیں۔ ٹیکسی ~15-20 ریال۔", hi: "उहद और शहीद: सुबह (7-9) जाएं। सलाम करें। जबल उहद पर न चढ़ें। टैक्सी ~15-20 रियाल।" } },
      { order: 3, instruction: { en: "JANNAT UL-BAQI: Right next to Masjid an-Nabawi (east side). Open after Fajr and after Dhuhr. Stand at entrance, face graves, greet with salam. Men only.", ar: "جنة البقيع: بجوار المسجد النبوي. مفتوحة بعد الفجر والظهر. قف وسلّم. للرجال فقط.", ur: "جنت البقیع: مسجد نبوی کے ساتھ۔ فجر اور ظہر کے بعد کھلتا ہے۔ دروازے پر سلام کریں۔ صرف مرد۔", hi: "जन्नतुल-बक़ी: मस्जिद-ए-नबवी के बगल में। फज्र और ज़ुहर के बाद खुलता है। दरवाज़े पर सलाम करें। सिर्फ़ पुरुष।" } },
      { order: 4, instruction: { en: "OPTIMAL ORDER: Day 1 — Settle, prayers, Baqi. Day 2 — Quba (AM), Uhud + Martyrs (combine). Day 3+ — Focus on prayers, Rawdah, Quran. Don't sacrifice prayer quality for ziyarat.", ar: "الترتيب المثالي: يوم 1 — استقرار، صلاة، البقيع. يوم 2 — قباء وأحد. يوم 3+ — صلاة وروضة وقرآن.", ur: "بہترین ترتیب: دن 1 — آباد ہونا، نمازیں، بقیع۔ دن 2 — قباء، احد۔ دن 3+ — نمازیں، روضہ، قرآن۔", hi: "इष्टतम क्रम: दिन 1 — बसना, नमाज़ें, बक़ी। दिन 2 — क़ुबा, उहद। दिन 3+ — नमाज़ें, रौज़ा, क़ुरआन।" } }
    ],
    duaGuidance: { en: "At Baqi: 'As-salamu alaikum ahl ad-diyar min al-mu'minin wal-muslimin...' At Uhud: Reflect on sacrifice and ask Allah for steadfastness.", ar: "عند البقيع: 'السلام عليكم أهل الديار...' عند أحد: تأمل في التضحية واسأل الله الثبات.", ur: "بقیع پر: 'السلام عليکم أہل الديار...' احد پر: قربانی پر غور کریں اور استقامت مانگیں۔", hi: "बक़ी पर: 'अस्सलामु अलैकुम अहलद-दियार...' उहद पर: कुर्बानी पर विचार करें।" },
    importantBoundaries: [{ text: { en: "These are historical sites for learning, not for performing rituals. Do not pray AT graves.", ar: "مواقع تاريخية للتعلم لا للطقوس. لا تصلِّ عند القبور.", ur: "یہ سیکھنے کے لیے ہیں، رسومات کے لیے نہیں۔ قبروں پر نماز نہ پڑھیں۔", hi: "ये सीखने के लिए हैं, रस्में अदा करने के लिए नहीं। क़ब्रों पर नमाज़ न पढ़ें।" } }],
    mistakes: [
      { id: "zr-1", text: { en: "Visiting Uhud in peak afternoon heat — people faint regularly. Go early morning only.", ar: "زيارة أحد في حر الظهيرة — يُغمى على الناس. صباحاً فقط.", ur: "دوپہر کی گرمی میں احد — لوگ بے ہوش ہوتے ہیں۔ صرف صبح۔", hi: "दोपहर की गर्मी में उहद — लोग बेहोश होते हैं। सिर्फ सुबह।" } },
      { id: "zr-2", text: { en: "Spending full days on ziyarat and missing prayers at Masjid an-Nabawi — 1000x reward prayers matter more.", ar: "تفويت الصلاة بالمسجد النبوي للزيارات — الصلاة بألف صلاة أهم.", ur: "زیارتوں میں دن گزارنا اور مسجد نبوی کی نمازیں چھوڑنا — 1000 گنا نمازیں اہم ہیں۔", hi: "ज़ियारतों में दिन गुज़ारना और मस्जिद-ए-नबवी की नमाज़ें छोड़ना — 1000 गुना नमाज़ें ज़्यादा अहम हैं।" } }
    ]
  },
  {
    id: "transport-madinah",
    order: 9,
    title: { en: "Madinah Transport & Taxi Guide", ar: "دليل النقل في المدينة", ur: "مدینہ ٹرانسپورٹ گائیڈ", hi: "मदीना परिवहन गाइड" },
    whatItIs: { en: "Madinah transport is more organized than Makkah, but pilgrims still get overcharged. This covers real prices, ride apps, and walking route safety.", ar: "النقل في المدينة أكثر تنظيماً لكن الحجاج يتعرضون لزيادة الأسعار.", ur: "مدینہ ٹرانسپورٹ مکہ سے زیادہ منظم ہے لیکن حجاج زیادہ پیسے دیتے ہیں۔", hi: "मदीना परिवहन मक्का से ज़्यादा व्यवस्थित है लेकिन तीर्थयात्री ज़्यादा पैसे देते हैं।" },
    steps: [
      { order: 1, instruction: { en: "USE RIDE APPS: Uber/Careem work well. Hotel→Haram: 8-15 SAR. Hotel→Quba: 10-20 SAR. Hotel→Uhud: 15-25 SAR. Street taxis charge 2-3x more.", ar: "استخدم أوبر/كريم. الفندق→الحرم: 8-15 ريال. سيارات الشارع تبالغ 2-3 أضعاف.", ur: "اوبر/کریم استعمال کریں۔ ہوٹل→حرم: 8-15 ریال۔ سڑک ٹیکسی 2-3 گنا زیادہ۔", hi: "उबर/करीम इस्तेमाल करें। होटल→हरम: 8-15 रियाल। सड़क टैक्सी 2-3 गुना ज़्यादा।" } },
      { order: 2, instruction: { en: "WALKING: Most central hotels are 10-15 min walk. Shaded pedestrian walkways are well-maintained. Night walks are pleasant and safe.", ar: "المشي: معظم الفنادق المركزية 10-15 دقيقة مشياً. الممرات المظللة ممتازة.", ur: "پیدل: زیادہ تر مرکزی ہوٹل 10-15 منٹ پیدل۔ سایہ دار راستے اچھے ہیں۔", hi: "पैदल: अधिकांश केंद्रीय होटल 10-15 मिनट पैदल। छायादार रास्ते अच्छे हैं।" } },
      { order: 3, instruction: { en: "AIRPORT: ~15 km from center. Pre-book via hotel or Uber/Careem (40-60 SAR). Do NOT use airport taxi touts (100-150 SAR).", ar: "المطار: ~15 كم. احجز مسبقاً أو استخدم أوبر (40-60 ريال). لا تستخدم سيارات المطار.", ur: "ایئرپورٹ: ~15 کلومیٹر۔ پہلے سے بک کریں یا اوبر (40-60 ریال)۔ ایئرپورٹ ٹاؤٹس استعمال نہ کریں۔", hi: "एयरपोर्ट: ~15 किमी। पहले से बुक करें या उबर (40-60 रियाल)। एयरपोर्ट दलालों से न लें।" } },
      { order: 4, instruction: { en: "HARAMAIN TRAIN: Madinah→Makkah in ~2.5 hours. Book on SAR website or Almosafer app. 150-300 SAR. Much better than 5-6 hour bus ride.", ar: "قطار الحرمين: المدينة→مكة في ~2.5 ساعة. احجز عبر SAR. 150-300 ريال.", ur: "حرمین ٹرین: مدینہ→مکہ ~2.5 گھنٹے۔ SAR ویب سائٹ سے بک کریں۔ 150-300 ریال۔", hi: "हरमैन ट्रेन: मदीना→मक्का ~2.5 घंटे। SAR वेबसाइट से बुक करें। 150-300 रियाल।" } }
    ],
    duaGuidance: { en: "Travel du'a: 'Subhanal-ladhi sakh-khara lana hadha...' When leaving Madinah, make du'a to return again.", ar: "دعاء السفر: 'سبحان الذي سخر لنا هذا...' عند المغادرة ادعُ بالعودة.", ur: "سفر کی دعا: 'سبحان الذی سخر لنا ہذا...' مدینہ سے رخصت ہوتے وقت واپسی کی دعا کریں۔", hi: "यात्रा दुआ: 'सुबहानल्लज़ी सख़्ख़रा...' मदीना से विदा होते समय वापसी की दुआ करें।" },
    importantBoundaries: [],
    mistakes: [
      { id: "tm-1", text: { en: "Taking street taxis without ride apps — always use Uber/Careem for fair prices.", ar: "أخذ سيارات الشارع بدون تطبيقات — استخدم أوبر/كريم.", ur: "ایپ کے بغیر سڑک ٹیکسی — ہمیشہ اوبر/کریم استعمال کریں۔", hi: "ऐप के बिना सड़क टैक्सी — हमेशा उबर/करीम इस्तेमाल करें।" } },
      { id: "tm-2", text: { en: "Not booking Haramain train in advance during peak season — trains sell out days ahead.", ar: "عدم حجز القطار مسبقاً — يُباع قبل أيام.", ur: "پیک سیزن میں ٹرین پہلے سے نہ بک کرنا — دن پہلے بھر جاتی ہیں۔", hi: "पीक सीज़न में ट्रेन पहले से न बुक करना — दिन पहले भर जाती हैं।" } }
    ]
  },
  {
    id: "elderly-women-itinerary",
    order: 10,
    title: { en: "Elderly & Women-Safe Itineraries", ar: "جداول آمنة للمسنين والنساء", ur: "بزرگوں اور خواتین کے لیے محفوظ ترتیب", hi: "बुज़ुर्गों और महिलाओं के लिए सुरक्षित कार्यक्रम" },
    whatItIs: { en: "Elderly pilgrims and women face unique challenges: extreme heat, long walks, crowded prayer areas, and limited Rawdah access. This provides customized itineraries prioritizing safety and maximum spiritual benefit.", ar: "يواجه المسنون والنساء تحديات: حرارة، مسافات، زحام. جداول مخصصة للسلامة.", ur: "بزرگ اور خواتین کو منفرد چیلنجز: گرمی، لمبی چال، بھری جگہیں۔ حفاظت کے لیے مخصوص ترتیب۔", hi: "बुज़ुर्ग और महिलाओं को अनोखी चुनौतियां: गर्मी, लंबी चाल, भरे क्षेत्र। सुरक्षा के लिए कस्टम कार्यक्रम।" },
    steps: [
      { order: 1, instruction: { en: "ELDERLY: Focus on 3 prayers in mosque (Fajr, Dhuhr, Maghrib). Pray Asr & Isha in hotel. Use wheelchair without hesitation. Stay on flat pathways.", ar: "المسنون: 3 صلوات في المسجد. العصر والعشاء في الفندق. استخدم الكرسي المتحرك.", ur: "بزرگ: مسجد میں 3 نمازیں۔ عصر اور عشاء ہوٹل میں۔ وہیل چیئر بلا تردد استعمال کریں۔", hi: "बुज़ुर्ग: मस्जिद में 3 नमाज़ें। अस्र और इशा होटल में। व्हीलचेयर बिना हिचक इस्तेमाल करें।" } },
      { order: 2, instruction: { en: "WOMEN'S SECTIONS: Entry through Gates 25, 29. Separate Rawdah times (morning). Check posted schedule daily. Always travel in groups after Isha.", ar: "أقسام النساء: دخول من أبواب 25، 29. أوقات روضة منفصلة. سافري في مجموعات بعد العشاء.", ur: "خواتین کے حصے: گیٹ 25، 29 سے داخلہ۔ الگ روضہ اوقات۔ عشاء کے بعد گروپ میں جائیں۔", hi: "महिला सेक्शन: गेट 25, 29 से प्रवेश। अलग रौज़ा समय। इशा के बाद ग्रुप में जाएं।" } },
      { order: 3, instruction: { en: "HYDRATION: Carry water, ORS, medications at ALL times. Set phone alarms for medication. Eat before going to mosque — never go on empty stomach.", ar: "الترطيب: احمل الماء والأدوية دائماً. اضبط منبهات الأدوية. كل قبل الذهاب.", ur: "پانی: ہمیشہ پانی، ORS، ادویات رکھیں۔ دوائیوں کا الارم لگائیں۔ خالی پیٹ مسجد نہ جائیں۔", hi: "पानी: हमेशा पानी, ORS, दवाइयां रखें। दवाइयों का अलार्म लगाएं। खाली पेट मस्जिद न जाएं।" } },
      { order: 4, instruction: { en: "COMPANION SYSTEM: Never go to mosque alone. Have a younger companion who knows the route, carries charged phone, and can communicate with staff.", ar: "نظام المرافقة: لا تذهب وحدك. رافق شخصاً يعرف الطريق وهاتفه مشحون.", ur: "ساتھی نظام: اکیلے مسجد نہ جائیں۔ ایک نوجوان ساتھی ہو جو راستہ جانتا ہو۔", hi: "साथी प्रणाली: अकेले मस्जिद न जाएं। एक युवा साथी हो जो रास्ता जानता हो।" } }
    ],
    duaGuidance: { en: "'Allahumma inni a'udhu bika min al-ajzi wal-kasali' (O Allah, I seek refuge from weakness and laziness). Prayers performed with difficulty carry extra reward.", ar: "'اللهم إني أعوذ بك من العجز والكسل'. الصلوات بمشقة لها أجر إضافي.", ur: "'اللهم إني أعوذ بك من العجز والکسل'۔ مشکل سے ادا کی گئی نمازوں کا اجر زیادہ ہے۔", hi: "'अल्लाहुम्मा इन्नी अऊज़ु बिका मिनल अज्ज़ि वल-कसलि'। मुश्किल से अदा नमाज़ों का सवाब ज़्यादा है।" },
    importantBoundaries: [{ text: { en: "It is permissible for elderly or sick pilgrims to pray in the hotel. The reward of intention is preserved.", ar: "يجوز للمسنين الصلاة في الفندق. أجر النية محفوظ.", ur: "بزرگوں کے لیے ہوٹل میں نماز جائز ہے۔ نیت کا ثواب محفوظ ہے۔", hi: "बुज़ुर्गों के लिए होटल में नमाज़ जायज़ है। नीयत का सवाब सुरक्षित है।" } }],
    mistakes: [
      { id: "ew-1", text: { en: "Forcing elderly to attend all 5 prayers — causes dangerous exhaustion and falls.", ar: "إجبار المسنين على الخمس — يسبب إرهاقاً خطيراً.", ur: "بزرگوں کو پانچوں نمازوں پر مجبور کرنا — خطرناک تھکاوٹ۔", hi: "बुज़ुर्गों को पांचों नमाज़ों पर मजबूर करना — खतरनाक थकान।" } },
      { id: "ew-2", text: { en: "Women going alone to late-night prayers — always travel in groups after Isha.", ar: "ذهاب النساء وحدهن ليلاً — سافري في مجموعات.", ur: "خواتین کا رات اکیلے جانا — ہمیشہ گروپ میں جائیں۔", hi: "महिलाओं का रात अकेले जाना — हमेशा ग्रुप में जाएं।" } }
    ]
  }
];

// Helper functions
export const getMadinahGuideTopic = (id: string): MadinahGuideTopic | undefined => {
  return MADINAH_GUIDE_TOPICS.find(topic => topic.id === id);
};

export const getMadinahGuideTopicByOrder = (order: number): MadinahGuideTopic | undefined => {
  return MADINAH_GUIDE_TOPICS.find(topic => topic.order === order);
};

export const getNextMadinahGuideTopic = (currentId: string): MadinahGuideTopic | undefined => {
  const current = getMadinahGuideTopic(currentId);
  if (!current) return undefined;
  return getMadinahGuideTopicByOrder(current.order + 1);
};

export const getPreviousMadinahGuideTopic = (currentId: string): MadinahGuideTopic | undefined => {
  const current = getMadinahGuideTopic(currentId);
  if (!current) return undefined;
  return getMadinahGuideTopicByOrder(current.order - 1);
};
