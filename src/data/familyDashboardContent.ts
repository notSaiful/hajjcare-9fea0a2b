import { Language } from "@/contexts/LanguageContext";

export type PilgrimStatus = "normal" | "assisted" | "emergency_managed";

export interface StatusDisplay {
  label: string;
  description: string;
  color: "green" | "yellow" | "red";
}

export const STATUS_CONTENT: Record<Language, Record<PilgrimStatus, StatusDisplay>> = {
  en: {
    normal: {
      label: "Normal",
      description: "Pilgrim is safe. No assistance required. All activities proceeding normally.",
      color: "green",
    },
    assisted: {
      label: "Assisted",
      description: "Pilgrim has requested or received help. Situation is under control. No action required from family.",
      color: "yellow",
    },
    emergency_managed: {
      label: "Emergency Managed",
      description: "An emergency was triggered. Authorities are handling the situation. Family will be informed only if required.",
      color: "red",
    },
  },
  ar: {
    normal: {
      label: "طبيعي",
      description: "الحاج بأمان. لا تحتاج مساعدة. جميع الأنشطة تسير بشكل طبيعي.",
      color: "green",
    },
    assisted: {
      label: "تمت المساعدة",
      description: "طلب الحاج المساعدة أو تلقاها. الوضع تحت السيطرة. لا يلزم أي إجراء من العائلة.",
      color: "yellow",
    },
    emergency_managed: {
      label: "تم التعامل مع الطوارئ",
      description: "تم تفعيل حالة طوارئ. السلطات تتعامل مع الموقف. سيتم إبلاغ العائلة فقط إذا لزم الأمر.",
      color: "red",
    },
  },
  ur: {
    normal: {
      label: "نارمل",
      description: "حاجی محفوظ ہے۔ کسی مدد کی ضرورت نہیں۔ تمام سرگرمیاں معمول کے مطابق جاری ہیں۔",
      color: "green",
    },
    assisted: {
      label: "مدد کی گئی",
      description: "حاجی نے مدد مانگی یا حاصل کی ہے۔ صورتحال قابو میں ہے۔ خاندان سے کوئی کارروائی درکار نہیں۔",
      color: "yellow",
    },
    emergency_managed: {
      label: "ایمرجنسی کا انتظام",
      description: "ایمرجنسی کو متحرک کیا گیا۔ حکام صورتحال کو سنبھال رہے ہیں۔ ضرورت ہونے پر ہی خاندان کو مطلع کیا جائے گا۔",
      color: "red",
    },
  },
  hi: {
    normal: {
      label: "सामान्य",
      description: "हाजी सुरक्षित हैं। कोई सहायता आवश्यक नहीं। सभी गतिविधियां सामान्य रूप से जारी हैं।",
      color: "green",
    },
    assisted: {
      label: "सहायता प्राप्त",
      description: "हाजी ने मदद मांगी या प्राप्त की है। स्थिति नियंत्रण में है। परिवार से कोई कार्रवाई आवश्यक नहीं।",
      color: "yellow",
    },
    emergency_managed: {
      label: "आपातकाल प्रबंधित",
      description: "आपातकाल शुरू किया गया। अधिकारी स्थिति संभाल रहे हैं। आवश्यक होने पर ही परिवार को सूचित किया जाएगा।",
      color: "red",
    },
  },
  tr: {
    normal: {
      label: "Normal",
      description: "Hacı güvende. Yardım gerekmiyor. Tüm faaliyetler normal şekilde devam ediyor.",
      color: "green",
    },
    assisted: {
      label: "Yardım Edildi",
      description: "Hacı yardım istedi veya aldı. Durum kontrol altında. Aileden herhangi bir işlem gerekmiyor.",
      color: "yellow",
    },
    emergency_managed: {
      label: "Acil Durum Yönetiliyor",
      description: "Acil durum tetiklendi. Yetkililer durumla ilgileniyor. Aile yalnızca gerekirse bilgilendirilecek.",
      color: "red",
    },
  },
  ru: {
    normal: {
      label: "Нормально",
      description: "Паломник в безопасности. Помощь не требуется. Все мероприятия проходят нормально.",
      color: "green",
    },
    assisted: {
      label: "Оказана помощь",
      description: "Паломник запросил или получил помощь. Ситуация под контролем. От семьи никаких действий не требуется.",
      color: "yellow",
    },
    emergency_managed: {
      label: "Экстренная ситуация управляется",
      description: "Была активирована экстренная ситуация. Власти занимаются ситуацией. Семья будет проинформирована только при необходимости.",
      color: "red",
    },
  },
};

export const CALMING_MESSAGE: Record<Language, { main: string; secondary: string }> = {
  en: {
    main: "No update means everything is normal.",
    secondary: "Please do not panic or contact authorities unless contacted.",
  },
  ar: {
    main: "عدم وجود تحديث يعني أن كل شيء طبيعي.",
    secondary: "يرجى عدم الذعر أو الاتصال بالسلطات إلا إذا تم الاتصال بك.",
  },
  ur: {
    main: "کوئی اپڈیٹ نہ ہونے کا مطلب سب ٹھیک ہے۔",
    secondary: "براہ کرم گھبرائیں نہیں یا حکام سے رابطہ نہ کریں جب تک آپ سے رابطہ نہ کیا جائے۔",
  },
  hi: {
    main: "कोई अपडेट न होने का मतलब सब ठीक है।",
    secondary: "कृपया घबराएं नहीं या अधिकारियों से संपर्क न करें जब तक संपर्क न किया जाए।",
  },
  tr: {
    main: "Güncelleme olmaması her şeyin yolunda olduğu anlamına gelir.",
    secondary: "Lütfen panik yapmayın veya sizinle iletişime geçilmedikçe yetkililerle iletişime geçmeyin.",
  },
  ru: {
    main: "Отсутствие обновлений означает, что все в порядке.",
    secondary: "Пожалуйста, не паникуйте и не связывайтесь с властями, если с вами не связались.",
  },
};

export const DASHBOARD_LABELS: Record<Language, {
  title: string;
  pilgrimName: string;
  shareConsent: string;
  shareEnabled: string;
  shareDisabled: string;
  enableSharing: string;
  disableSharing: string;
  consentNote: string;
  updateStatus: string;
  statusNormal: string;
  statusAssisted: string;
  statusEmergency: string;
  familyView: string;
  pilgrimView: string;
}> = {
  en: {
    title: "Family Status",
    pilgrimName: "Pilgrim",
    shareConsent: "Family Sharing",
    shareEnabled: "Family can see your status",
    shareDisabled: "Status is private",
    enableSharing: "Enable Sharing",
    disableSharing: "Disable Sharing",
    consentNote: "You can revoke access at any time",
    updateStatus: "Update Status",
    statusNormal: "I am Safe",
    statusAssisted: "I Need/Received Help",
    statusEmergency: "Emergency Managed",
    familyView: "Family View",
    pilgrimView: "Pilgrim Settings",
  },
  ar: {
    title: "حالة العائلة",
    pilgrimName: "الحاج",
    shareConsent: "مشاركة مع العائلة",
    shareEnabled: "العائلة تستطيع رؤية حالتك",
    shareDisabled: "الحالة خاصة",
    enableSharing: "تفعيل المشاركة",
    disableSharing: "إيقاف المشاركة",
    consentNote: "يمكنك إلغاء الوصول في أي وقت",
    updateStatus: "تحديث الحالة",
    statusNormal: "أنا بأمان",
    statusAssisted: "أحتاج/تلقيت مساعدة",
    statusEmergency: "تم التعامل مع الطوارئ",
    familyView: "عرض العائلة",
    pilgrimView: "إعدادات الحاج",
  },
  ur: {
    title: "خاندان کی حالت",
    pilgrimName: "حاجی",
    shareConsent: "خاندان سے شیئرنگ",
    shareEnabled: "خاندان آپ کی حالت دیکھ سکتا ہے",
    shareDisabled: "حالت نجی ہے",
    enableSharing: "شیئرنگ فعال کریں",
    disableSharing: "شیئرنگ غیر فعال کریں",
    consentNote: "آپ کسی بھی وقت رسائی منسوخ کر سکتے ہیں",
    updateStatus: "حالت اپڈیٹ کریں",
    statusNormal: "میں محفوظ ہوں",
    statusAssisted: "مجھے مدد چاہیے/ملی",
    statusEmergency: "ایمرجنسی کا انتظام",
    familyView: "خاندان کا نظارہ",
    pilgrimView: "حاجی کی ترتیبات",
  },
  hi: {
    title: "परिवार की स्थिति",
    pilgrimName: "हाजी",
    shareConsent: "परिवार शेयरिंग",
    shareEnabled: "परिवार आपकी स्थिति देख सकता है",
    shareDisabled: "स्थिति निजी है",
    enableSharing: "शेयरिंग सक्षम करें",
    disableSharing: "शेयरिंग अक्षम करें",
    consentNote: "आप कभी भी पहुंच रद्द कर सकते हैं",
    updateStatus: "स्थिति अपडेट करें",
    statusNormal: "मैं सुरक्षित हूं",
    statusAssisted: "मुझे मदद चाहिए/मिली",
    statusEmergency: "आपातकाल प्रबंधित",
    familyView: "परिवार दृश्य",
    pilgrimView: "हाजी सेटिंग्स",
  },
  tr: {
    title: "Aile Durumu",
    pilgrimName: "Hacı",
    shareConsent: "Aile Paylaşımı",
    shareEnabled: "Aile durumunuzu görebilir",
    shareDisabled: "Durum gizli",
    enableSharing: "Paylaşımı Etkinleştir",
    disableSharing: "Paylaşımı Devre Dışı Bırak",
    consentNote: "Erişimi istediğiniz zaman iptal edebilirsiniz",
    updateStatus: "Durumu Güncelle",
    statusNormal: "Güvendeyim",
    statusAssisted: "Yardıma İhtiyacım Var/Aldım",
    statusEmergency: "Acil Durum Yönetiliyor",
    familyView: "Aile Görünümü",
    pilgrimView: "Hacı Ayarları",
  },
  ru: {
    title: "Статус семьи",
    pilgrimName: "Паломник",
    shareConsent: "Семейный доступ",
    shareEnabled: "Семья может видеть ваш статус",
    shareDisabled: "Статус приватный",
    enableSharing: "Включить доступ",
    disableSharing: "Отключить доступ",
    consentNote: "Вы можете отозвать доступ в любое время",
    updateStatus: "Обновить статус",
    statusNormal: "Я в безопасности",
    statusAssisted: "Мне нужна/получил помощь",
    statusEmergency: "Экстренная ситуация управляется",
    familyView: "Семейный вид",
    pilgrimView: "Настройки паломника",
  },
};
