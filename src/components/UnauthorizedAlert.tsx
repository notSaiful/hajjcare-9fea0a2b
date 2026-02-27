import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface UnauthorizedAlertProps {
  requiredRole: 'admin' | 'coordinator' | 'medical_staff' | 'any_staff' | 'inspector';
  pageName?: string;
}

const roleLabels: Record<string, { en: string; hi: string }> = {
  admin: { en: 'Administrator', hi: 'व्यवस्थापक' },
  coordinator: { en: 'Coordinator', hi: 'समन्वयक' },
  medical_staff: { en: 'Medical Staff', hi: 'चिकित्सा कर्मचारी' },
  any_staff: { en: 'Coordinator / Medical Staff', hi: 'समन्वयक / चिकित्सा कर्मचारी' },
  inspector: { en: 'Haj Inspector', hi: 'हज इंस्पेक्टर' },
};

const labels = {
  title: { en: 'Access Denied', hi: 'पहुंच अस्वीकृत' },
  subtitle: { en: 'You do not have the required permissions to access this page.', hi: 'इस पृष्ठ तक पहुंचने के लिए आपके पास आवश्यक अनुमतियां नहीं हैं।' },
  requiredLabel: { en: 'Required Role', hi: 'आवश्यक भूमिका' },
  attemptLogged: { en: 'This access attempt has been noted for security purposes.', hi: 'इस पहुंच प्रयास को सुरक्षा उद्देश्यों के लिए नोट किया गया है।' },
  goHome: { en: 'Go to Home', hi: 'होम पर जाएं' },
  goBack: { en: 'Go Back', hi: 'वापस जाएं' },
};

export const UnauthorizedAlert: React.FC<UnauthorizedAlertProps> = ({ requiredRole, pageName }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (language as 'en' | 'hi') || 'en';

  const t = (key: keyof typeof labels) => labels[key][lang] || labels[key].en;
  const roleName = roleLabels[requiredRole]?.[lang] || roleLabels[requiredRole]?.en || requiredRole;

  useEffect(() => {
    const page = pageName || window.location.pathname;
    console.warn(`[Security] Unauthorized access attempt to "${page}" — required role: ${requiredRole}`);
    toast.error(lang === 'hi' ? `पहुंच अस्वीकृत: ${page}` : `Access Denied: ${page}`, { duration: 4000 });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-md w-full border-destructive/30 bg-destructive/5">
        <CardContent className="p-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-destructive">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>

          <div className="flex items-center justify-center gap-2 px-3 py-2 bg-muted rounded-md">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              {t('requiredLabel')}: <span className="text-primary">{roleName}</span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground italic">{t('attemptLogged')}</p>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('goBack')}
            </Button>
            <Button className="flex-1" onClick={() => navigate('/')}>
              {t('goHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
