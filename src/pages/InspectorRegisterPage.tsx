import { useState } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StateSelector } from '@/components/StateSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  UserPlus, Shield, HandHeart, Headphones, CheckCircle2, 
  MessageCircle, ExternalLink, AlertTriangle, Loader2 
} from 'lucide-react';
import { z } from 'zod';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/LdH4cHBImrWIAwX2wv83Xz?mode=gi_t';

const registrationSchema = z.object({
  fullName: z.string().trim().min(3, 'Name must be at least 3 characters').max(100),
  mobile: z.string().regex(/^\d{10}$/, 'Enter valid 10-digit mobile number'),
  city: z.string().trim().min(2, 'City is required').max(50),
  state: z.string().min(1, 'State is required'),
  role: z.enum(['haj_inspector', 'volunteer', 'support_staff']),
  languagePreference: z.string().min(1),
});

type FormData = z.infer<typeof registrationSchema>;

const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'اردو' },
  { code: 'ar', label: 'العربية' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
];

const ROLES = [
  { value: 'haj_inspector', icon: Shield, label: 'Haj Inspector', labelHi: 'हज इंस्पेक्टर' },
  { value: 'volunteer', icon: HandHeart, label: 'Volunteer', labelHi: 'वॉलंटियर' },
  { value: 'support_staff', icon: Headphones, label: 'Support Staff', labelHi: 'सहायता कर्मी' },
];

const InspectorRegisterPage = () => {
  const { language } = useLanguage();
  const [form, setForm] = useState<Partial<FormData>>({
    languagePreference: 'hi',
    role: 'haj_inspector',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [duplicateChecked, setDuplicateChecked] = useState(false);

  const isHindi = language === 'hi' || language === 'ur';

  const updateField = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
    if (key === 'mobile') setDuplicateChecked(false);
  };

  const checkDuplicate = async (): Promise<boolean> => {
    if (!form.mobile || form.mobile.length !== 10) return false;
    const { data } = await supabase.rpc('check_inspector_mobile_exists', { p_mobile: form.mobile });
    if (data) {
      setErrors(prev => ({ ...prev, mobile: isHindi ? 'यह नंबर पहले से पंजीकृत है' : 'This number is already registered' }));
      return true;
    }
    setDuplicateChecked(true);
    return false;
  };

  const handleSubmit = async () => {
    const result = registrationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Duplicate check
      const isDuplicate = await checkDuplicate();
      if (isDuplicate) {
        setIsSubmitting(false);
        return;
      }

      const { data: reg, error } = await supabase
        .from('inspector_registrations')
        .insert({
          full_name: result.data.fullName,
          mobile: result.data.mobile,
          city: result.data.city,
          state: result.data.state,
          role: result.data.role,
          language_preference: result.data.languagePreference,
          status: result.data.role === 'haj_inspector' ? 'verified' : 'pending',
        })
        .select('id')
        .single();

      if (error) {
        if (error.code === '23505') {
          setErrors({ mobile: isHindi ? 'यह नंबर पहले से पंजीकृत है' : 'This number is already registered' });
        } else {
          toast.error(error.message);
        }
        setIsSubmitting(false);
        return;
      }

      // Audit log
      await supabase.from('inspector_audit_log').insert({
        registration_id: reg.id,
        action: 'registration_submitted',
        details: { role: result.data.role, state: result.data.state, city: result.data.city },
        performed_by: 'self',
      });

      setIsSuccess(true);
      toast.success(
        result.data.role === 'haj_inspector'
          ? 'Aapko HajjCare AI Help Directory mein Haj Inspector ke roop mein successfully add kar diya gaya hai.'
          : isHindi ? 'आपका पंजीकरण सफल रहा। एडमिन द्वारा सत्यापन के बाद डायरेक्टरी में जोड़ा जाएगा।' : 'Registration successful. You will be added after admin verification.'
      );
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-md mx-auto px-4 py-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isHindi ? 'पंजीकरण सफल!' : 'Registration Successful!'}
          </h1>
          <p className="text-muted-foreground">
            {form.role === 'haj_inspector'
              ? 'Aapko HajjCare AI Help Directory mein Haj Inspector ke roop mein successfully add kar diya gaya hai.'
              : isHindi ? 'आपका पंजीकरण प्राप्त हो गया है। एडमिन सत्यापन के बाद डायरेक्टरी में शामिल किया जाएगा।' : 'Your registration has been received. You will be added after admin verification.'}
          </p>
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">{isHindi ? 'अब WhatsApp ग्रुप से जुड़ें:' : 'Now join the WhatsApp Group:'}</p>
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {isHindi ? 'WhatsApp ग्रुप जॉइन करें' : 'Join WhatsApp Group'}
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-md mx-auto px-4 py-6 space-y-4 pb-20">
        {/* WhatsApp Group CTA */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{isHindi ? 'HajjCare आधिकारिक WhatsApp ग्रुप' : 'HajjCare Official WhatsApp Group'}</p>
              <p className="text-xs text-muted-foreground">{isHindi ? 'ग्रुप से जुड़ने के बाद नीचे फॉर्म भरें' : 'Join the group, then fill the form below'}</p>
            </div>
            <Button asChild size="sm" variant="outline" className="border-emerald-300 shrink-0">
              <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" />
                {isHindi ? 'जॉइन' : 'Join'}
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="w-5 h-5 text-primary" />
              {isHindi ? 'सत्यापन फॉर्म' : 'Verification Form'}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'कृपया सभी फ़ील्ड भरें। अधूरा फॉर्म अस्वीकृत होगा।' : 'All fields mandatory. Incomplete forms will be rejected.'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label>{isHindi ? 'पूरा नाम' : 'Full Name'} *</Label>
              <Input
                placeholder={isHindi ? 'अपना पूरा नाम लिखें' : 'Enter your full name'}
                value={form.fullName || ''}
                onChange={e => updateField('fullName', e.target.value)}
                maxLength={100}
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <Label>{isHindi ? 'मोबाइल नंबर (WhatsApp)' : 'Mobile Number (WhatsApp)'} *</Label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">+91</span>
                <Input
                  placeholder="10-digit number"
                  value={form.mobile || ''}
                  onChange={e => updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>
              {errors.mobile && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.mobile}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'WhatsApp नंबर = मोबाइल नंबर होना चाहिए' : 'Must match your WhatsApp number'}
              </p>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label>{isHindi ? 'शहर' : 'City'} *</Label>
              <Input
                placeholder={isHindi ? 'अपना शहर लिखें' : 'Enter your city'}
                value={form.city || ''}
                onChange={e => updateField('city', e.target.value)}
                maxLength={50}
              />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label>{isHindi ? 'राज्य' : 'State'} *</Label>
              <StateSelector
                value={form.state || ''}
                onValueChange={v => updateField('state', v)}
                placeholder={isHindi ? 'राज्य चुनें' : 'Select state'}
              />
              {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label>{isHindi ? 'भूमिका' : 'Role'} *</Label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => {
                  const Icon = r.icon;
                  const isSelected = form.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => updateField('role', r.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-center ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-xs font-medium">{isHindi ? r.labelHi : r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label>{isHindi ? 'भाषा वरीयता' : 'Language Preference'} *</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => updateField('languagePreference', lang.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.languagePreference === lang.code
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isHindi ? 'जमा हो रहा है...' : 'Submitting...'}</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> {isHindi ? 'पंजीकरण करें' : 'Register'}</>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {isHindi
                ? '🔐 बिना सत्यापन कोई डायरेक्टरी प्रवेश नहीं। डुप्लीकेट का पता चलने पर ब्लॉक किया जाएगा।'
                : '🔐 No verification = No directory entry. Duplicates will be blocked.'}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InspectorRegisterPage;
