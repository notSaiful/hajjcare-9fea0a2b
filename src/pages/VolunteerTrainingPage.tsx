import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GraduationCap,
  HandHeart,
  HeartPulse,
  Headphones,
  Lock,
  Siren,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const RECEIPT = /^(?:V-[A-Z]{3}-[A-Z]{3}-[0-9]{4}|HC-[0-9A-F]{8})$/;

export const VOLUNTEER_MODULES: { title: string; titleHi: string; description: string; descriptionHi: string; icon: LucideIcon }[] = [
  {
    title: "HajCare AI orientation and Hajj-Umrah-only scope",
    titleHi: "HajCare AI की जानकारी और सिर्फ़ हज-उमरा दायरा",
    description: "What this service is for: helping pilgrims with Hajj and Umrah only, and what a volunteer does not take on.",
    descriptionHi: "यह सेवा किसके लिए है: हाजियों की हज और उमरा में मदद, और वॉलंटियर किन बातों में नहीं पड़ता।",
    icon: GraduationCap,
  },
  {
    title: "Helping pilgrims respectfully",
    titleHi: "हाजियों की इज़्ज़त के साथ मदद",
    description: "How to speak, guide, and assist pilgrims during Hajj and Umrah without rushing them or speaking over them.",
    descriptionHi: "हज और उमरा के दौरान हाजी से कैसे बात करें, राह दिखाएँ और मदद करें, बिना जल्दबाज़ी या उनकी बात काटे।",
    icon: HandHeart,
  },
  {
    title: "Basic first aid and health awareness",
    titleHi: "बुनियादी प्राथमिक इलाज और सेहत की समझ",
    description: "Everyday health signs to notice on a Hajj or Umrah journey, and when to hand the pilgrim to a qualified responder.",
    descriptionHi: "हज या उमरा के सफ़र में कौन सी आम सेहत की निशानियाँ देखें, और कब हाजी को प्रशिक्षित मददगार के हवाले करें।",
    icon: HeartPulse,
  },
  {
    title: "Call and helpdesk etiquette",
    titleHi: "कॉल और हेल्पडेस्क का तरीक़ा",
    description: "How to answer a pilgrim or family call about Hajj and Umrah travel, lodging, and the next step.",
    descriptionHi: "हाजी या घरवालों की हज-उमरा, सफ़र और ठहरने की कॉल कैसे सुनें और अगला क़दम बताएँ।",
    icon: Headphones,
  },
  {
    title: "Privacy and consent of pilgrim data",
    titleHi: "हाजी के डेटा की गोपनीयता और सहमति",
    description: "What pilgrim details a volunteer may see, what needs consent, and what must not be shared.",
    descriptionHi: "वॉलंटियर हाजी की कौन सी जानकारी देख सकता है, किसके लिए सहमति चाहिए, और क्या साझा नहीं करना।",
    icon: Lock,
  },
  {
    title: "Emergency escalation",
    titleHi: "इमरजेंसी को आगे बढ़ाना",
    description: "How a volunteer raises a Hajj or Umrah emergency to the right HajCare responder instead of handling it alone.",
    descriptionHi: "वॉलंटियर हज या उमरा की इमरजेंसी को अकेले निपटाने के बजाय सही HajCare मददगार तक कैसे पहुँचाए।",
    icon: Siren,
  },
  {
    title: "Using the HajCare tools",
    titleHi: "HajCare के औज़ार इस्तेमाल करना",
    description: "Where a registered volunteer will find Hajj and Umrah tools once the lessons are published.",
    descriptionHi: "रजिस्टर वॉलंटियर को हज और उमरा के औज़ार कहाँ मिलेंगे, जब ये पाठ तैयार हो जाएँ।",
    icon: Wrench,
  },
];

const VolunteerTrainingPage = () => {
  const { isRTL } = useLanguage();
  const [params] = useSearchParams();
  const receipt = params.get("receipt") ?? "";
  const receiptOk = RECEIPT.test(receipt);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SEO
        title="Volunteer Training"
        description="Hajj and Umrah volunteer training modules for HajCare AI. Lessons open after volunteer registration. Content is coming soon."
        path="/volunteer/training"
        type="website"
      />
      <SimpleHeader logoSrc="/assets/hajcare-ai-logo-640.png" />
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">Volunteer training · वॉलंटियर ट्रेनिंग</p>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
            Hajj and Umrah volunteer lessons
          </h1>
          <p className="text-sm text-muted-foreground">
            हज और उमरा में हाजियों की मदद के लिए छोटे पाठ। Training access follows registration. Register as a volunteer first. These lessons are not open yet.
          </p>
          <p className="text-sm text-muted-foreground">
            ट्रेनिंग रजिस्ट्रेशन के बाद मिलती है। पहले वॉलंटियर के रूप में रजिस्टर करें। ये पाठ अभी तैयार नहीं हैं।
          </p>
        </div>

        {receiptOk ? (
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Receipt · रसीद</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm break-all">{receipt}</p>
              <p className="text-sm text-muted-foreground mt-2">This receipt is the volunteer id returned after login-free registration. The lessons below are not open yet.</p>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-3">
          {VOLUNTEER_MODULES.map((module, index) => {
            const Icon = module.icon;
            return (
              <Card key={module.title} className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-start gap-3">
                    <span className="bg-primary/10 text-primary w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="space-y-1">
                      <span className="block">{index + 1}. {module.title}</span>
                      <span className="block text-sm font-normal text-muted-foreground">{module.titleHi}</span>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground">{module.description}</p>
                  <p className="text-sm text-muted-foreground">{module.descriptionHi}</p>
                  <Badge variant="secondary">Coming soon · जल्द</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button asChild className="w-full">
          <Link to="/volunteer">Register as volunteer · वॉलंटियर रजिस्टर करें</Link>
        </Button>
      </main>
      <p className="text-center text-xs text-muted-foreground py-8">HajCare AI · info@hajjcare.in</p>
    </div>
  );
};

export default VolunteerTrainingPage;
