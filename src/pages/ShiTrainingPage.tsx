import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent } from "@/components/ui/card";
import { IconCircle } from "@/components/IconCircle";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileText, 
  Stethoscope, 
  Plane, 
  ShieldCheck, 
  AlertTriangle, 
  HeartPulse,
  BookOpen,
  GraduationCap,
  Users,
  Download
} from "lucide-react";

interface TrainingMaterial {
  id: string;
  icon: typeof FileText;
  title: Record<string, string>;
  description: Record<string, string>;
  file: string;
  color: string;
}

const trainingMaterials: TrainingMaterial[] = [
  {
    id: "trainers-guide",
    icon: GraduationCap,
    title: { en: "Trainer's Training Program", ar: "برنامج تدريب المدربين", ur: "ٹرینرز ٹریننگ پروگرام", hi: "प्रशिक्षक प्रशिक्षण कार्यक्रम" },
    description: { en: "Practical tips on 5 days of Hajj, how to find tent in Mina", ar: "نصائح عملية لـ5 أيام الحج", ur: "حج کے 5 دنوں کے عملی نکات", hi: "हज के 5 दिनों की व्यावहारिक युक्तियाँ" },
    file: "/training/trainers-training-haj-2026.pdf",
    color: "emerald",
  },
  {
    id: "duties-role",
    icon: ShieldCheck,
    title: { en: "Duties & Role of SHI", ar: "واجبات ودور المفتش", ur: "ایس ایچ آئی کے فرائض", hi: "SHI के कर्तव्य और भूमिका" },
    description: { en: "Report, deploy, accompany, assist pilgrims in Hajj & Umrah", ar: "الإبلاغ والمرافقة ومساعدة الحجاج", ur: "حاجیوں کی رپورٹنگ، تعیناتی اور مدد", hi: "हाजियों की रिपोर्टिंग, तैनाती और सहायता" },
    file: "/training/duties-role-shi.pdf",
    color: "indigo",
  },
  {
    id: "medical-structure",
    icon: Stethoscope,
    title: { en: "Medical Structure in Haj", ar: "الهيكل الطبي في الحج", ur: "حج میں طبی ڈھانچہ", hi: "हज में चिकित्सा संरचना" },
    description: { en: "Healthcare system, medical facilities, and emergency protocols", ar: "نظام الرعاية الصحية والمرافق الطبية", ur: "صحت کی دیکھ بھال کا نظام", hi: "स्वास्थ्य देखभाल प्रणाली" },
    file: "/training/medical-structure-haj.pdf",
    color: "red",
  },
  {
    id: "dr-abdul-rahman",
    icon: HeartPulse,
    title: { en: "Medical Care Training", ar: "تدريب الرعاية الطبية", ur: "طبی دیکھ بھال کی تربیت", hi: "चिकित्सा देखभाल प्रशिक्षण" },
    description: { en: "Dr. Abdul Rahman's comprehensive medical guidance", ar: "إرشادات الدكتور عبدالرحمن الطبية", ur: "ڈاکٹر عبدالرحمن کی طبی رہنمائی", hi: "डॉ. अब्दुल रहमान का मेडिकल गाइडेंस" },
    file: "/training/dr-abdul-rahman-training.pdf",
    color: "rose",
  },
  {
    id: "airline-training",
    icon: Plane,
    title: { en: "Airline Procedures", ar: "إجراءات الطيران", ur: "ایئر لائن کے طریقہ کار", hi: "एयरलाइन प्रक्रियाएं" },
    description: { en: "Flight coordination, boarding, and in-flight guidance", ar: "تنسيق الرحلات والصعود", ur: "پرواز کی ہم آہنگی اور بورڈنگ", hi: "उड़ान समन्वय और बोर्डिंग" },
    file: "/training/airline-shi-training.pdf",
    color: "sky",
  },
  {
    id: "immigration",
    icon: FileText,
    title: { en: "Immigration Procedures", ar: "إجراءات الهجرة", ur: "امیگریشن کے طریقہ کار", hi: "इमिग्रेशन प्रक्रियाएं" },
    description: { en: "Emigration, documentation, and border formalities", ar: "وثائق الهجرة والإجراءات الحدودية", ur: "ہجرت کے دستاویزات اور حدود", hi: "प्रवास दस्तावेज और सीमा औपचारिकताएं" },
    file: "/training/immigration-shi-training.pdf",
    color: "teal",
  },
  {
    id: "disaster-management",
    icon: AlertTriangle,
    title: { en: "Disaster Management", ar: "إدارة الكوارث", ur: "آفات کا انتظام", hi: "आपदा प्रबंधन" },
    description: { en: "Emergency response, crowd control, and safety protocols", ar: "الاستجابة للطوارئ والسيطرة على الحشود", ur: "ہنگامی ردعمل اور ہجوم کنٹرول", hi: "आपातकालीन प्रतिक्रिया और भीड़ नियंत्रण" },
    file: "/training/disaster-management-training.pdf",
    color: "amber",
  },
  {
    id: "haj-medical-care",
    icon: HeartPulse,
    title: { en: "Haj Medical Care", ar: "الرعاية الطبية للحج", ur: "حج کی طبی دیکھ بھال", hi: "हज चिकित्सा देखभाल" },
    description: { en: "Comprehensive medical care guide for Hajj pilgrims", ar: "دليل الرعاية الطبية الشاملة", ur: "حاجیوں کے لیے طبی دیکھ بھال", hi: "हाजियों के लिए चिकित्सा देखभाल" },
    file: "/training/haj-medical-care.pdf",
    color: "red",
  },
  {
    id: "train-trainers-pptx",
    icon: BookOpen,
    title: { en: "Train the Trainers (PPTX)", ar: "تدريب المدربين", ur: "ٹرینرز کی تربیت", hi: "प्रशिक्षकों का प्रशिक्षण" },
    description: { en: "Haj 2026 presentation for training sessions", ar: "عرض الحج 2026 للتدريب", ur: "حج 2026 تربیتی پریزنٹیشن", hi: "हज 2026 प्रशिक्षण प्रस्तुति" },
    file: "/training/haj-2026-train-trainers.pptx",
    color: "violet",
  },
  {
    id: "trainers-shi-pptx",
    icon: Users,
    title: { en: "SHI Trainers Guide (PPTX)", ar: "دليل مدربي SHI", ur: "ایس ایچ آئی ٹرینرز گائیڈ", hi: "SHI प्रशिक्षक गाइड" },
    description: { en: "Comprehensive presentation for SHI trainers", ar: "عرض شامل لمدربي SHI", ur: "ایس ایچ آئی ٹرینرز کے لیے پریزنٹیشن", hi: "SHI प्रशिक्षकों के लिए प्रस्तुति" },
    file: "/training/trainers-for-haj-shi.pptx",
    color: "orange",
  },
];

const translations = {
  en: {
    title: "SHI Training Materials",
    subtitle: "State Haj Inspector training resources for Haj 2026",
    download: "Download",
    materials: "Training Materials",
  },
  ar: {
    title: "مواد تدريب SHI",
    subtitle: "موارد تدريب مفتش الحج للحج 2026",
    download: "تحميل",
    materials: "مواد التدريب",
  },
  ur: {
    title: "SHI ٹریننگ مواد",
    subtitle: "حج 2026 کے لیے ریاستی حج انسپکٹر کے تربیتی وسائل",
    download: "ڈاؤن لوڈ",
    materials: "تربیتی مواد",
  },
  hi: {
    title: "SHI प्रशिक्षण सामग्री",
    subtitle: "हज 2026 के लिए राज्य हज इंस्पेक्टर प्रशिक्षण संसाधन",
    download: "डाउनलोड",
    materials: "प्रशिक्षण सामग्री",
  },
};

const ShiTrainingPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleDownload = (file: string, title: string) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = title;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <IconCircle icon={GraduationCap} size="lg" variant="emerald" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>

        {/* Training Materials Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t.materials}
          </h2>
          
          <div className="grid gap-3">
            {trainingMaterials.map((material) => (
              <Card 
                key={material.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleDownload(material.file, material.title.en)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <IconCircle 
                      icon={material.icon} 
                      size="sm" 
                      variant={material.color as any}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {material.title[language] || material.title.en}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {material.description[language] || material.description.en}
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShiTrainingPage;
