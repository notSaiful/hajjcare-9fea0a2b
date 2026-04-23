import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Mail, Lock, User, MapPin, Eye, EyeOff, ShieldCheck, FileText, Database, Bell } from "lucide-react";
import { z } from "zod";
import { MfaVerifyForm } from "./MfaVerifyForm";

const EMBARKATION_POINTS = [
  "Srinagar", "Gaya", "Guwahati", "Indore", "Jaipur", "Nagpur",
  "Delhi", "Mumbai", "Kolkata", "Bengaluru", "Hyderabad",
  "Cochin (Kochi)", "Chennai", "Ahmedabad", "Lucknow",
  "Kannur", "Calicut (Kozhikode)", "Vijayawada",
] as const;

const emailSchema = z.string().email("Invalid email address").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(128);
const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(100)
  .regex(/^[\p{L}\p{M}\s'-]+$/u, "Name can only contain letters, spaces, hyphens and apostrophes");

const labels = {
  en: { signIn: "Sign In", signUp: "Sign Up", email: "Email Address", password: "Password", fullName: "Full Name", embarkation: "Embarkation Point", showPassword: "Show", hidePassword: "Hide", haveAccount: "Have an account? Sign in", noAccount: "No account? Sign up", welcome: "Welcome back, pilgrim", joinUs: "Join the Hajj journey", consentTitle: "Privacy & Terms Review", consentDesc: "Please review and accept before creating your account.", consentData: "How we use your data:", consentProfile: "Your name and embarkation point are stored securely to personalize your Hajj journey.", consentAuth: "Your email is used for authentication and account recovery only.", consentNotify: "We may send you important Hajj-related notifications and safety alerts.", consentPrivacy: "Your data is never shared with third parties without your consent.", consentAgree: "I have reviewed and agree to the Privacy Policy and Terms of Service", consentConfirm: "Create Account", consentCancel: "Go Back" },
  ar: { signIn: "تسجيل الدخول", signUp: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور", fullName: "الاسم الكامل", embarkation: "نقطة المغادرة", showPassword: "إظهار", hidePassword: "إخفاء", haveAccount: "لديك حساب؟ سجل دخولك", noAccount: "ليس لديك حساب؟ أنشئ واحداً", welcome: "مرحباً بعودتك أيها الحاج", joinUs: "انضم إلى رحلة الحج", consentTitle: "مراجعة الخصوصية والشروط", consentDesc: "يرجى المراجعة والموافقة قبل إنشاء حسابك.", consentData: "كيف نستخدم بياناتك:", consentProfile: "يتم تخزين اسمك ونقطة مغادرتك بأمان لتخصيص رحلة الحج.", consentAuth: "يُستخدم بريدك الإلكتروني للمصادقة واسترداد الحساب فقط.", consentNotify: "قد نرسل إليك إشعارات مهمة تتعلق بالحج وتنبيهات السلامة.", consentPrivacy: "لا تتم مشاركة بياناتك مع أطراف ثالثة بدون موافقتك.", consentAgree: "لقد راجعت وأوافق على سياسة الخصوصية وشروط الخدمة", consentConfirm: "إنشاء الحساب", consentCancel: "رجوع" },
  ur: { signIn: "لاگ ان", signUp: "اکاؤنٹ بنائیں", email: "ای میل", password: "پاسورڈ", fullName: "پورا نام", embarkation: "روانگی کا مقام", showPassword: "دکھائیں", hidePassword: "چھپائیں", haveAccount: "اکاؤنٹ ہے؟ لاگ ان کریں", noAccount: "اکاؤنٹ نہیں؟ بنائیں", welcome: "خوش آمدید حاجی", joinUs: "حج کے سفر میں شامل ہوں", consentTitle: "رازداری اور شرائط کا جائزہ", consentDesc: "اکاؤنٹ بنانے سے پہلے جائزہ لیں اور قبول کریں۔", consentData: "ہم آپ کا ڈیٹا کیسے استعمال کرتے ہیں:", consentProfile: "آپ کا نام اور روانگی کا مقام محفوظ طریقے سے ذخیرہ کیا جاتا ہے۔", consentAuth: "آپ کا ای میل صرف تصدیق اور اکاؤنٹ بحالی کے لیے استعمال ہوتا ہے۔", consentNotify: "ہم آپ کو اہم حج سے متعلق اطلاعات بھیج سکتے ہیں۔", consentPrivacy: "آپ کا ڈیٹا تیسرے فریق کے ساتھ شیئر نہیں کیا جاتا۔", consentAgree: "میں نے رازداری کی پالیسی اور شرائط کا جائزہ لیا اور قبول کیا", consentConfirm: "اکاؤنٹ بنائیں", consentCancel: "واپس" },
  hi: { signIn: "लॉग इन", signUp: "खाता बनाएं", email: "ईमेल", password: "पासवर्ड", fullName: "पूरा नाम", embarkation: "प्रस्थान बिंदु", showPassword: "दिखाएं", hidePassword: "छिपाएं", haveAccount: "खाता है? लॉग इन करें", noAccount: "खाता नहीं? बनाएं", welcome: "वापसी पर स्वागत है", joinUs: "हज यात्रा में शामिल हों", consentTitle: "गोपनीयता और शर्तों की समीक्षा", consentDesc: "खाता बनाने से पहले कृपया समीक्षा करें और स्वीकार करें।", consentData: "हम आपका डेटा कैसे उपयोग करते हैं:", consentProfile: "आपका नाम और प्रस्थान बिंदु सुरक्षित रूप से संग्रहीत किया जाता है।", consentAuth: "आपका ईमेल केवल प्रमाणीकरण और खाता पुनर्प्राप्ति के लिए उपयोग होता है।", consentNotify: "हम आपको महत्वपूर्ण हज संबंधी सूचनाएं भेज सकते हैं।", consentPrivacy: "आपका डेटा तीसरे पक्ष के साथ साझा नहीं किया जाता।", consentAgree: "मैंने गोपनीयता नीति और सेवा शर्तों की समीक्षा की और स्वीकार किया", consentConfirm: "खाता बनाएं", consentCancel: "वापस" },
};

interface EmailAuthFormProps {
  onSuccess: () => void;
}

export function EmailAuthForm({ onSuccess }: EmailAuthFormProps) {
  const isSignUp = false;
  const setIsSignUp = (_: boolean) => {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [embarkationPoint, setEmbarkationPoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const { signUp, signIn } = useAuth();
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();

  const t = labels[language as keyof typeof labels] || labels.en;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (isSignUp) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) newErrors.fullName = nameResult.error.errors[0].message;
      if (!embarkationPoint) newErrors.embarkationPoint = "Please select your embarkation point";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSignUp) {
      setConsentAgreed(false);
      setShowConsentModal(true);
      return;
    }
    doSubmit();
  };

  const doSubmit = async () => {
    setIsLoading(true);
    setShowConsentModal(false);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName, embarkationPoint);
        if (error) {
          toast({ title: "Error", description: error.message.includes("already registered") ? "Email already registered" : error.message, variant: "destructive" });
        } else {
          toast({ title: isRTL ? "تم إنشاء الحساب" : "Account Created", description: isRTL ? "مرحباً بك" : "Welcome to Haj Care AI" });
          onSuccess();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Error", description: isRTL ? "بيانات الدخول غير صحيحة" : "Invalid credentials", variant: "destructive" });
        } else {
          // Check if user has MFA enrolled
          const { data: factors, error: mfaError } = await supabase.auth.mfa.listFactors();
          if (!mfaError && factors?.totp?.length > 0) {
            const verifiedFactor = factors.totp.find((f) => f.status === "verified");
            if (verifiedFactor) {
              setMfaFactorId(verifiedFactor.id);
              setIsLoading(false);
              return; // Don't call onSuccess yet - need MFA verification
            }
          }
          onSuccess();
        }
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Show MFA verification if needed
  if (mfaFactorId) {
    return <MfaVerifyForm factorId={mfaFactorId} onSuccess={onSuccess} />;
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? t.joinUs : t.welcome}
      </p>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {isSignUp && (
          <>
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors"
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive px-2">{errors.fullName}</p>}
            </div>

            {/* Embarkation Point */}
            <div className="space-y-1.5">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Select value={embarkationPoint} onValueChange={setEmbarkationPoint}>
                  <SelectTrigger className="pl-12 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors">
                    <SelectValue placeholder={t.embarkation} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {EMBARKATION_POINTS.map((point) => (
                      <SelectItem key={point} value={point}>{point}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.embarkationPoint && <p className="text-xs text-destructive px-2">{errors.embarkationPoint}</p>}
            </div>
          </>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors"
              dir="ltr"
            />
          </div>
          {errors.email && <p className="text-xs text-destructive px-2">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-14 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? t.hidePassword : t.showPassword}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive px-2">{errors.password}</p>}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold rounded-2xl auth-gradient-btn transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isSignUp ? t.signUp : t.signIn}
        </Button>
      </form>

      {/* Sign-up disabled — sign-in only */}

      {/* Consent Review Modal - only for signup */}
      <Dialog open={showConsentModal} onOpenChange={(v) => { if (!v) setConsentAgreed(false); setShowConsentModal(v); }}>
        <DialogContent className="sm:max-w-md rounded-2xl" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
              {t.consentTitle}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t.consentDesc}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-4 py-2">
              <p className="text-sm font-medium text-foreground">{t.consentData}</p>
              <ul className="space-y-3">
                {[
                  { icon: User, text: t.consentProfile },
                  { icon: Database, text: t.consentAuth },
                  { icon: Bell, text: t.consentNotify },
                  { icon: FileText, text: t.consentPrivacy },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  🔒 {t.consentPrivacy}
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={consentAgreed}
                  onCheckedChange={(v) => setConsentAgreed(v === true)}
                  className="mt-0.5"
                />
                <span className="text-sm font-medium text-foreground leading-snug">
                  {t.consentAgree}
                </span>
              </label>
            </div>
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setShowConsentModal(false); setConsentAgreed(false); }} className="rounded-xl">
              {t.consentCancel}
            </Button>
            <Button onClick={doSubmit} disabled={!consentAgreed || isLoading} className="rounded-xl">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.consentConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
