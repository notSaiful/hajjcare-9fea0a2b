import { useLanguage } from "@/contexts/LanguageContext";
import { sukoonRdContent } from "@/data/sukoonRdContent";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle2 } from "lucide-react";
import sbiCardImage from "@/assets/sbi-hajj-card.png";

export default function SbiRdGuide() {
  const { language } = useLanguage();
  const guide = sukoonRdContent.sbiGuide;

  const getLabel = (obj: Record<string, string>) => obj[language] || obj.en;
  const getList = (obj: Record<string, string[]>) => obj[language] || obj.en;

  return (
    <div className="space-y-5">
      <Card className="p-5 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {getLabel(guide.title)}
          </h3>
        </div>

        {/* SBI Card Image */}
        <img
          src={sbiCardImage}
          alt="SBI Hajj RD Card"
          className="w-full rounded-xl mb-4 border"
          loading="lazy"
        />

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {getList(guide.steps).map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <span className="text-sm text-foreground">{step}</span>
            </div>
          ))}
        </div>

        {/* Required Documents */}
        <div className="bg-accent/30 rounded-xl p-4">
          <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {language === "hi" ? "आवश्यक दस्तावेज़" : language === "ur" ? "ضروری دستاویزات" : "Required Documents"}
          </h4>
          <ul className="space-y-2">
            {getList(guide.documents).map((doc, i) => (
              <li key={i} className="flex gap-2 items-center text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* FAQ */}
      <Card className="p-5 border">
        <h4 className="font-semibold text-foreground mb-3">
          {language === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : language === "ur" ? "اکثر پوچھے جانے والے سوالات" : "Frequently Asked Questions"}
        </h4>
        <div className="space-y-4">
          {[
            {
              q: language === "hi" ? "RD का न्यूनतम जमा कितना है?" : "What is the minimum RD deposit?",
              a: language === "hi" ? "SBI RD का न्यूनतम ₹100 प्रति माह है।" : "SBI RD minimum is ₹100 per month.",
            },
            {
              q: language === "hi" ? "क्या RD समय से पहले तोड़ सकते हैं?" : "Can I break RD before maturity?",
              a: language === "hi" ? "हाँ, लेकिन 1% ब्याज पेनल्टी लगेगी।" : "Yes, but 1% interest penalty applies.",
            },
            {
              q: language === "hi" ? "क्या ऑनलाइन RD खोल सकते हैं?" : "Can I open RD online?",
              a: language === "hi" ? "हाँ, SBI YONO ऐप से RD खोल सकते हैं।" : "Yes, you can open RD via SBI YONO app.",
            },
          ].map((faq, i) => (
            <div key={i}>
              <p className="font-medium text-sm text-foreground">{faq.q}</p>
              <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
