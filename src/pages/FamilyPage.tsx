import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { useHajjLocation, HAJJ_STAGES, HajjStage } from "@/hooks/useHajjLocation";
import { FamilyGroupPanel } from "@/components/FamilyGroupPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, MapPin, Loader2, Navigation, Map, Radio, Eye, TestTube2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpeg";

// Available stages for manual selection (excluding 'unknown')
const SELECTABLE_STAGES: HajjStage[] = ["kaaba", "safa_marwa", "mina", "arafat", "muzdalifah", "jamarat", "outside"];

const FamilyPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { group, memberLocations, memberId, updateLocation } = useFamilyGroup();
  const { lat, lng, stage, stageInfo, isLoading: locationLoading } = useHajjLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Manual stage override for testing
  const [manualStage, setManualStage] = useState<HajjStage | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  // Determine active stage (manual override or GPS-detected)
  const activeStage = isTestMode && manualStage ? manualStage : stage;
  const activeStageInfo = HAJJ_STAGES[activeStage];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Update location for family group (uses active stage)
  useEffect(() => {
    if (group && lat && lng) {
      updateLocation(lat, lng, activeStage);
    }
  }, [group, lat, lng, activeStage, updateLocation]);

  // Handle manual stage change
  const handleManualStageChange = async (newStage: HajjStage) => {
    setManualStage(newStage);
    
    if (group) {
      // Use default coordinates if GPS not available
      const testLat = lat || 21.4225;
      const testLng = lng || 39.8262;
      
      await updateLocation(testLat, testLng, newStage);
      
      toast({
        title: isRTL ? "تم تحديث المرحلة" : "Stage Updated",
        description: isRTL 
          ? `تم تغيير مرحلتك إلى: ${HAJJ_STAGES[newStage].nameAr}`
          : `Your stage changed to: ${HAJJ_STAGES[newStage].nameEn}`,
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const otherMembers = memberLocations.filter(l => l.member_id !== memberId);

  const getStageLabel = (stageKey: string | null) => {
    if (!stageKey) return "-";
    const stageData = HAJJ_STAGES[stageKey as keyof typeof HAJJ_STAGES];
    if (stageData) {
      return language === "ar" ? stageData.nameAr : stageData.nameEn;
    }
    return stageKey;
  };

  const getStageColor = (stageKey: string | null) => {
    if (!stageKey) return "#808080";
    const stageData = HAJJ_STAGES[stageKey as keyof typeof HAJJ_STAGES];
    return stageData?.color || "#808080";
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container max-w-3xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 h-9 sm:h-10">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isRTL ? "العودة" : "Back"}</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
            <span className="font-semibold text-sm sm:text-base">
              {isRTL ? "الموقع المباشر والعائلة" : "Live Location & Family"}
            </span>
          </div>
          <div className="w-16 sm:w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Manual Stage Selector for Testing */}
        {group && (
          <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20">
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <TestTube2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  {isRTL ? "اختبار تتبع سكون" : "Sukoon Tracking Test"}
                </div>
                <Button
                  variant={isTestMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsTestMode(!isTestMode)}
                  className={isTestMode ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {isTestMode 
                    ? (isRTL ? "تفعيل" : "Active") 
                    : (isRTL ? "تفعيل الاختبار" : "Enable Test")
                  }
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <p className="text-xs text-muted-foreground mb-3">
                {isRTL 
                  ? "اختر مرحلة الحج يدوياً لاختبار إشعارات واتساب لعائلتك"
                  : "Manually select a Hajj stage to test WhatsApp notifications to your family"
                }
              </p>
              <Select
                value={manualStage || ""}
                onValueChange={(value) => handleManualStageChange(value as HajjStage)}
                disabled={!isTestMode}
              >
                <SelectTrigger className={`w-full ${!isTestMode ? "opacity-50" : ""}`}>
                  <SelectValue placeholder={isRTL ? "اختر المرحلة..." : "Select stage..."} />
                </SelectTrigger>
                <SelectContent>
                  {SELECTABLE_STAGES.map((stageKey) => {
                    const stageData = HAJJ_STAGES[stageKey];
                    return (
                      <SelectItem key={stageKey} value={stageKey}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stageData.color }}
                          />
                          <span>{language === "ar" ? stageData.nameAr : stageData.nameEn}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {isTestMode && manualStage && (
                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  {isRTL 
                    ? "وضع الاختبار نشط - سيتم إرسال إشعار عند تغيير المرحلة"
                    : "Test mode active - Notification will be sent on stage change"
                  }
                </p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Your Live Location Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="relative">
                <Radio className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              {isRTL ? "موقعك المباشر" : "Your Live Location"}
              {isTestMode && (
                <span className="ml-2 text-xs bg-orange-500/20 text-orange-600 px-2 py-0.5 rounded-full">
                  {isRTL ? "وضع الاختبار" : "Test Mode"}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {locationLoading && !isTestMode ? (
              <div className="flex items-center gap-3 p-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "جاري تحديد موقعك..." : "Determining your location..."}
                </span>
              </div>
            ) : !lat && !lng && !isTestMode ? (
              <div className="space-y-3 p-3 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-2 border-primary/20">
                  <Navigation className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" 
                    ? "يحتاج نظام سكون إلى إذن الموقع لتتبع مراحل الحج وإرسال إشعارات لعائلتك"
                    : language === "ur"
                    ? "سکون ٹریکنگ کو آپ کے حج کے مراحل کی نگرانی اور خاندان کو اطلاعات بھیجنے کے لیے لوکیشن کی اجازت درکار ہے"
                    : "Sukoon tracking needs location permission to track your Hajj stages and notify your family"
                  }
                </p>
                <Button 
                  className="w-full gap-2 h-12 text-base"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        () => {
                          // Permission granted - the useHajjLocation hook will pick it up
                          toast({
                            title: language === "ar" ? "تم تفعيل الموقع" : language === "ur" ? "لوکیشن فعال ہو گئی" : "Location Enabled",
                            description: language === "ar" ? "تم السماح بالوصول إلى موقعك بنجاح" : language === "ur" ? "لوکیشن تک رسائی کامیابی سے دی گئی" : "Location access granted successfully",
                          });
                          // Force refresh by reloading - the hook's watchPosition will take over
                          window.location.reload();
                        },
                        (err) => {
                          toast({
                            title: language === "ar" ? "تعذر الوصول للموقع" : language === "ur" ? "لوکیشن تک رسائی مسترد" : "Location Access Denied",
                            description: language === "ar" 
                              ? "يرجى السماح بالوصول إلى الموقع من إعدادات المتصفح"
                              : language === "ur"
                              ? "براہ کرم براؤزر سیٹنگز سے لوکیشن تک رسائی کی اجازت دیں"
                              : "Please allow location access in your browser settings",
                            variant: "destructive",
                          });
                        },
                        { enableHighAccuracy: true, timeout: 10000 }
                      );
                    } else {
                      toast({
                        title: language === "ar" ? "غير مدعوم" : language === "ur" ? "تعاون نہیں ہے" : "Not Supported",
                        description: language === "ar" ? "خدمة الموقع غير مدعومة في هذا المتصفح" : language === "ur" ? "اس براؤزر میں لوکیشن سروس دستیاب نہیں ہے" : "Geolocation is not supported by this browser",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <MapPin className="w-5 h-5" />
                  {language === "ar" ? "السماح بالوصول إلى الموقع" : language === "ur" ? "لوکیشن تک رسائی کی اجازت دیں" : "Allow Location Access"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Current Stage */}
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${activeStageInfo.color}15` }}
                >
                  <div 
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: activeStageInfo.color }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: activeStageInfo.color }}>
                      {language === "ar" ? activeStageInfo.nameAr : activeStageInfo.nameEn}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "ar" ? activeStageInfo.descriptionAr : activeStageInfo.descriptionEn}
                    </p>
                  </div>
                  <MapPin className="w-5 h-5" style={{ color: activeStageInfo.color }} />
                </div>

                {/* Coordinates */}
                {lat && lng && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>{isRTL ? "الإحداثيات:" : "Coordinates:"}</span>
                    <span className="font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                  </div>
                )}

                {/* View on Map Button */}
                <Link to="/map" className="block">
                  <Button className="w-full gap-2 h-11">
                    <Map className="w-4 h-4" />
                    {isRTL ? "عرض على الخريطة المباشرة" : "View on Live Map"}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Group Panel */}
        <FamilyGroupPanel />

        {/* Family Members Live Locations */}
        {group && otherMembers.length > 0 && (
          <Card className="bg-card/50 backdrop-blur border-blue-500/20">
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                {isRTL ? "مواقع أفراد العائلة" : "Family Member Locations"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-2.5 sm:space-y-3">
                {otherMembers.map((loc) => {
                  const memberStageColor = getStageColor(loc.current_stage);
                  return (
                    <div 
                      key={loc.member_id}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer"
                      onClick={() => navigate("/map")}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div 
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-soft border-2"
                          style={{ 
                            backgroundColor: `${memberStageColor}15`,
                            borderColor: `${memberStageColor}40`
                          }}
                        >
                          <Users className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: memberStageColor }} />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{loc.member_name}</p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">
                            {isRTL ? "آخر تحديث: " : "Last update: "}
                            {new Date(loc.updated_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <div 
                            className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded-full"
                            style={{ backgroundColor: `${memberStageColor}15` }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: memberStageColor }}
                            />
                            <span className="font-medium" style={{ color: memberStageColor }}>
                              {getStageLabel(loc.current_stage)}
                            </span>
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Link to="/map" className="block mt-4">
                <Button variant="outline" className="w-full h-10 sm:h-11 gap-2">
                  <Navigation className="w-4 h-4" />
                  {isRTL ? "عرض الجميع على الخريطة" : "View All on Map"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Family Members */}
        {group && otherMembers.length === 0 && (
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="py-6 sm:py-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-soft border-2 border-blue-500/20">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {isRTL 
                  ? "شارك رمز الدعوة مع عائلتك لتتبع مواقعهم المباشرة" 
                  : "Share the invite code with your family to track their live locations"
                }
              </p>
              <Link to="/map">
                <Button variant="outline" className="gap-2">
                  <Map className="w-4 h-4" />
                  {isRTL ? "استكشف الخريطة" : "Explore the Map"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default FamilyPage;
