export interface HajjBuilding {
  id: string;
  name: string;
  nameAr: string;
  nameUr: string;
  city: "makkah" | "madinah";
  area: string;
  areaAr: string;
  lat: number;
  lng: number;
  type: "office" | "dispensary" | "accommodation" | "hospital";
  phone?: string;
  fax?: string;
  description: Record<string, string>;
}

export const hajjBuildings: HajjBuilding[] = [
  // MAKKAH BUILDINGS
  {
    id: "makkah-office",
    name: "Indian Haj Office & Dispensary",
    nameAr: "مكتب الحج الهندي والمستوصف",
    nameUr: "انڈین حج آفس و ڈسپنسری",
    city: "makkah",
    area: "Jarwal, Near Egypt Air Office",
    areaAr: "جرول، بالقرب من مكتب مصر للطيران",
    lat: 21.4167,
    lng: 39.8167,
    type: "office",
    phone: "+966-2-5420391",
    fax: "+966-2-5424390",
    description: {
      en: "Main Indian Hajj Pilgrims Office cum Medical Office in Makkah. Handles all pilgrim services, medical emergencies, and documentation.",
      hi: "मक्का में मुख्य भारतीय हज यात्री कार्यालय सह चिकित्सा कार्यालय।",
      ur: "مکہ میں اہم انڈین حج حجاج آفس اور طبی دفتر۔",
    },
  },
  {
    id: "makkah-azizia-1",
    name: "Azizia Building Complex - Zone A",
    nameAr: "مجمع مباني العزيزية - المنطقة أ",
    nameUr: "عزیزیہ بلڈنگ کمپلیکس - زون اے",
    city: "makkah",
    area: "Azizia, Makkah",
    areaAr: "العزيزية، مكة المكرمة",
    lat: 21.3891,
    lng: 39.8579,
    type: "accommodation",
    description: {
      en: "Indian pilgrim accommodation buildings in Azizia area. Houses pilgrims from multiple Indian states.",
      hi: "अज़ीज़िया क्षेत्र में भारतीय हाजी आवास भवन।",
      ur: "عزیزیہ علاقے میں انڈین حاجی رہائشی عمارات۔",
    },
  },
  {
    id: "makkah-azizia-2",
    name: "Azizia Building Complex - Zone B",
    nameAr: "مجمع مباني العزيزية - المنطقة ب",
    nameUr: "عزیزیہ بلڈنگ کمپلیکس - زون بی",
    city: "makkah",
    area: "Azizia South, Makkah",
    areaAr: "العزيزية الجنوبية، مكة",
    lat: 21.3870,
    lng: 39.8600,
    type: "accommodation",
    description: {
      en: "Additional Indian pilgrim buildings in Azizia South. Includes separate sections for ladies.",
      hi: "अज़ीज़िया दक्षिण में अतिरिक्त भारतीय हाजी भवन।",
      ur: "عزیزیہ جنوب میں اضافی انڈین حاجی عمارات۔",
    },
  },
  {
    id: "makkah-misfalah",
    name: "Misfalah Area Buildings",
    nameAr: "مباني منطقة مسفلة",
    nameUr: "مسفلہ علاقے کی عمارات",
    city: "makkah",
    area: "Misfalah, Near Haram",
    areaAr: "مسفلة، قرب الحرم",
    lat: 21.4225,
    lng: 39.8262,
    type: "accommodation",
    description: {
      en: "Close to Masjid al-Haram. Walking distance accommodation for Indian pilgrims.",
      hi: "मस्जिद अल-हराम के पास। भारतीय हाजियों के लिए पैदल दूरी पर आवास।",
      ur: "مسجد الحرام کے قریب۔ انڈین حاجیوں کے لیے پیدل فاصلے پر رہائش۔",
    },
  },
  {
    id: "makkah-hospital",
    name: "Indian Medical Mission - Makkah",
    nameAr: "البعثة الطبية الهندية - مكة",
    nameUr: "انڈین میڈیکل مشن - مکہ",
    city: "makkah",
    area: "Near Indian Haj Office, Jarwal",
    areaAr: "بالقرب من مكتب الحج الهندي، جرول",
    lat: 21.4170,
    lng: 39.8170,
    type: "hospital",
    phone: "+966-2-5420392",
    description: {
      en: "24/7 medical facility for Indian Hajj pilgrims. Hindi, Urdu & English speaking doctors available.",
      hi: "भारतीय हज यात्रियों के लिए 24/7 चिकित्सा सुविधा।",
      ur: "انڈین حج حجاج کے لیے 24/7 طبی سہولت۔",
    },
  },
  // MADINAH BUILDINGS
  {
    id: "madinah-office",
    name: "Indian Haj Office - Madinah",
    nameAr: "مكتب الحج الهندي - المدينة المنورة",
    nameUr: "انڈین حج آفس - مدینہ منورہ",
    city: "madinah",
    area: "Near Masjid-e-Nabawi, Madinah",
    areaAr: "بالقرب من المسجد النبوي، المدينة",
    lat: 24.4672,
    lng: 39.6112,
    type: "office",
    phone: "+966-4-8220224",
    fax: "+966-4-8264854",
    description: {
      en: "Main Indian Hajj Office in Madinah. Provides pilgrim assistance, medical aid, and documentation services.",
      hi: "मदीना में मुख्य भारतीय हज कार्यालय।",
      ur: "مدینہ میں اہم انڈین حج آفس۔",
    },
  },
  {
    id: "madinah-hotel-zone",
    name: "Madinah Hotel Zone - Indian Pilgrims",
    nameAr: "منطقة فنادق المدينة - الحجاج الهنود",
    nameUr: "مدینہ ہوٹل زون - انڈین حجاج",
    city: "madinah",
    area: "Central Area, Near Masjid-e-Nabawi",
    areaAr: "المنطقة المركزية، قرب المسجد النبوي",
    lat: 24.4685,
    lng: 39.6130,
    type: "accommodation",
    description: {
      en: "Hotel accommodations for Indian pilgrims near Masjid-e-Nabawi. Multiple hotels allocated for different state groups.",
      hi: "मस्जिद-ए-नबवी के पास भारतीय हाजियों के लिए होटल।",
      ur: "مسجد نبوی کے قریب انڈین حاجیوں کے لیے ہوٹل۔",
    },
  },
  {
    id: "madinah-dispensary",
    name: "Indian Medical Dispensary - Madinah",
    nameAr: "المستوصف الطبي الهندي - المدينة",
    nameUr: "انڈین طبی ڈسپنسری - مدینہ",
    city: "madinah",
    area: "Near Indian Haj Office, Madinah",
    areaAr: "بالقرب من مكتب الحج الهندي، المدينة",
    lat: 24.4675,
    lng: 39.6115,
    type: "dispensary",
    phone: "+966-4-8220225",
    description: {
      en: "Medical dispensary providing free medicines and treatment to Indian Hajj pilgrims in Madinah.",
      hi: "मदीना में भारतीय हज यात्रियों को मुफ्त दवाएं और इलाज।",
      ur: "مدینہ میں انڈین حج حجاج کو مفت ادویات اور علاج۔",
    },
  },
  {
    id: "makkah-shisha",
    name: "Shisha Area Buildings",
    nameAr: "مباني منطقة الششة",
    nameUr: "شیشہ علاقے کی عمارات",
    city: "makkah",
    area: "Shisha, Makkah",
    areaAr: "الششة، مكة المكرمة",
    lat: 21.4100,
    lng: 39.8350,
    type: "accommodation",
    description: {
      en: "Indian pilgrim accommodation in Shisha area, Makkah. Bus service available to Haram.",
      hi: "शीशा क्षेत्र में भारतीय हाजी आवास। हरम तक बस सेवा उपलब्ध।",
      ur: "شیشہ علاقے میں انڈین حاجی رہائش۔ حرم تک بس سروس دستیاب۔",
    },
  },
  {
    id: "makkah-kudai",
    name: "Kudai Area Buildings",
    nameAr: "مباني منطقة كدي",
    nameUr: "کدئی علاقے کی عمارات",
    city: "makkah",
    area: "Kudai, Makkah",
    areaAr: "كدي، مكة المكرمة",
    lat: 21.4050,
    lng: 39.8280,
    type: "accommodation",
    description: {
      en: "Pilgrim buildings in Kudai area. State-wise allocation for Indian Hajj groups.",
      hi: "कुदई क्षेत्र में हाजी भवन। राज्यवार आवंटन।",
      ur: "کدئی علاقے میں حاجی عمارات۔ ریاستی تقسیم۔",
    },
  },
];

export const emergencyContacts = {
  makkah: {
    mainOffice: "+966-2-5420391",
    medical: "+966-2-5420392",
    emergency: "911",
    indianEmbassy: "+966-11-4884144",
  },
  madinah: {
    mainOffice: "+966-4-8220224",
    medical: "+966-4-8220225",
    emergency: "911",
    indianEmbassy: "+966-11-4884144",
  },
};
