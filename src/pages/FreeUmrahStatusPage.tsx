import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatusDisplay } from "@/components/free-umrah/ApplicationStatusDisplay";
import { freeUmrahContent } from "@/data/freeUmrahContent";
import { Search, Loader2, ArrowLeft } from "lucide-react";

const extractApplicationId = (input: string): string => {
  const trimmed = input.trim();
  const umrMatch = trimmed.match(/UMR-\d{4}-\d{6}/i);
  return umrMatch ? umrMatch[0].toUpperCase() : trimmed;
};

const FreeUmrahStatusPage = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const t = freeUmrahContent[language as keyof typeof freeUmrahContent] || freeUmrahContent.en;

const [inputId, setInputId] = useState(() => searchParams.get("id") || "");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checkedApplicationId, setCheckedApplicationId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validationMessages: Record<string, { empty: string; invalid: string }> = {
    en: { empty: "Please enter an Application ID", invalid: "Invalid format. Expected: UMR-2026-000001" },
    hi: { empty: "कृपया आवेदन आईडी दर्ज करें", invalid: "अमान्य प्रारूप। अपेक्षित: UMR-2026-000001" },
    ur: { empty: "براہ کرم درخواست آئی ڈی درج کریں", invalid: "غلط فارمیٹ۔ متوقع: UMR-2026-000001" },
    ar: { empty: "يرجى إدخال رقم الطلب", invalid: "تنسيق غير صالح. المتوقع: UMR-2026-000001" },
  };

  const handleCheck = async () => {
    const vm = validationMessages[language] || validationMessages.en;
    const trimmed = inputId.trim();

    if (!trimmed) {
      setValidationError(vm.empty);
      return;
    }

    const queryId = extractApplicationId(trimmed);
    if (!/^UMR-\d{4}-\d{6}$/i.test(queryId)) {
      setValidationError(vm.invalid);
      return;
    }

    setValidationError(null);

    setIsChecking(true);
    setCheckResult(null);
    setCheckedApplicationId(null);

    try {
      const { data, error } = await supabase
        .from("applicants_status_check" as any)
        .select("status, application_id, created_at")
        .eq("application_id", queryId)
        .maybeSingle();

      if (error || !data) {
        setCheckResult("not_found");
      } else {
        const typed = data as unknown as { status: string; application_id: string };
        setCheckResult(typed.status);
        setCheckedApplicationId(typed.application_id);
      }
    } catch {
      setCheckResult("not_found");
    }
    setIsChecking(false);
  };

  // Auto-check if id is provided via URL
  useEffect(() => {
    if (inputId) handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  const labels: Record<string, { heading: string; placeholder: string; hint: string }> = {
    en: { heading: "Track Your Free Umrah Application", placeholder: "Enter Application ID (e.g. UMR-2026-000001)", hint: "You can paste the full ID like GA – Nainpur – UMR-2026-000027 or just the UMR number" },
    hi: { heading: "अपने मुफ्त उमराह आवेदन को ट्रैक करें", placeholder: "आवेदन आईडी दर्ज करें (जैसे UMR-2026-000001)", hint: "आप पूरी आईडी जैसे GA – Nainpur – UMR-2026-000027 या सिर्फ UMR नंबर पेस्ट कर सकते हैं" },
    ur: { heading: "اپنی مفت عمرہ درخواست ٹریک کریں", placeholder: "درخواست آئی ڈی درج کریں (مثلاً UMR-2026-000001)", hint: "آپ پوری آئی ڈی جیسے GA – Nainpur – UMR-2026-000027 یا صرف UMR نمبر پیسٹ کر سکتے ہیں" },
    ar: { heading: "تتبع طلب العمرة المجانية", placeholder: "أدخل رقم الطلب (مثل UMR-2026-000001)", hint: "يمكنك لصق المعرف الكامل مثل GA – Nainpur – UMR-2026-000027 أو رقم UMR فقط" },
  };

  const l = labels[language] || labels.en;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SimpleHeader />
      <main className="flex-1 container max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/free-umrah" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">{l.heading}</h1>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              {t.checkStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder={l.placeholder}
                value={inputId}
                onChange={(e) => { setInputId(e.target.value); setValidationError(null); }}
                onKeyDown={handleKeyDown}
                className={`font-mono text-sm ${validationError ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              <Button onClick={handleCheck} disabled={isChecking || !inputId.trim()}>
                {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : t.check}
              </Button>
            </div>
            {validationError && (
              <p className="text-xs text-destructive font-medium">{validationError}</p>
            )}
            <p className="text-xs text-muted-foreground">{l.hint}</p>

            {checkResult && (
              <ApplicationStatusDisplay
                checkResult={checkResult}
                checkedApplicationId={checkedApplicationId}
                formattedIdentifier={checkedApplicationId}
                language={language}
                applicationIdLabel={t.applicationId}
                updateDocumentLabel={t.updateDocument || "Update Document"}
                onRecheck={handleCheck}
              />
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/free-umrah" className="text-sm text-primary hover:underline">
            {language === "hi" ? "नया आवेदन करें" : language === "ur" ? "نئی درخواست دیں" : "Apply for Free Umrah →"}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreeUmrahStatusPage;
