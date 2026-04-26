import { useState, useMemo } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HAJ_INSPECTORS, getStateStats, type HajInspector } from '@/data/hajInspectorsData';
import { hajjBusPoints } from '@/data/hajjBusPoints';
import { Search, Award, MessageCircle, ExternalLink, UserPlus, Users, ClipboardList, SlidersHorizontal, X } from 'lucide-react';
import { StateSelector } from '@/components/StateSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { InspectorStatsCard } from '@/components/inspector/InspectorStatsCard';
import { StateGroupedInspectors } from '@/components/inspector/StateGroupedInspectors';
import { useNavigate } from 'react-router-dom';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/LdH4cHBImrWIAwX2wv83Xz?mode=gi_t';

// Set of building numbers known to be "(U)" updated late additions.
const UPDATED_BUILDING_NUMBERS = new Set<number>(
  hajjBusPoints.filter((b) => b.isUpdated).flatMap((b) => b.buildings)
);

// Inspector counts as "updated assignment" if their Makkah building string
// either contains "(U)" or references a known updated building number.
const hasUpdatedAssignment = (i: HajInspector): boolean => {
  const m = i.makkahBuilding;
  if (!m) return false;
  if (/\(U\)/i.test(m)) return true;
  const nums = m.match(/\d{2,4}/g);
  if (!nums) return false;
  return nums.some((n) => UPDATED_BUILDING_NUMBERS.has(parseInt(n, 10)));
};

type CityFilter = 'all' | 'makkah' | 'madinah';
type AssignmentFilter = 'all' | 'updated';

const HajInspectorsDirectoryPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<CityFilter>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter inspectors
  const filteredInspectors = useMemo(() => {
    let filtered = HAJ_INSPECTORS;

    if (selectedState) {
      filtered = filtered.filter(i => i.state.toLowerCase() === selectedState.toLowerCase());
    }

    if (cityFilter === 'makkah') {
      filtered = filtered.filter(i => !!i.makkahBuilding);
    } else if (cityFilter === 'madinah') {
      filtered = filtered.filter(i => !!i.madinahBuilding);
    }

    if (assignmentFilter === 'updated') {
      filtered = filtered.filter(hasUpdatedAssignment);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.fatherName.toLowerCase().includes(query) ||
        i.id.includes(query) ||
        (i.coverNumber?.toLowerCase().includes(query) ?? false) ||
        (i.indianMobile?.includes(query) ?? false) ||
        (i.ksaMobile?.includes(query) ?? false) ||
        (i.makkahBuilding?.toLowerCase().includes(query) ?? false) ||
        (i.madinahBuilding?.toLowerCase().includes(query) ?? false)
      );
    }

    return filtered;
  }, [selectedState, searchQuery, cityFilter, assignmentFilter]);

  const activeFilterCount =
    (cityFilter !== 'all' ? 1 : 0) + (assignmentFilter !== 'all' ? 1 : 0);

  const clearAdvancedFilters = () => {
    setCityFilter('all');
    setAssignmentFilter('all');
  };

  // Stats for selected state or all
  const stats = useMemo(() => {
    if (selectedState) {
      return getStateStats(selectedState);
    }
    const selected = HAJ_INSPECTORS.filter(i => i.result === 'Selected').length;
    const waitlisted = HAJ_INSPECTORS.filter(i => i.result === 'Waitlisted').length;
    const male = HAJ_INSPECTORS.filter(i => i.gender === 'Male').length;
    const female = HAJ_INSPECTORS.filter(i => i.gender === 'Female').length;
    return { total: HAJ_INSPECTORS.length, selected, waitlisted, male, female };
  }, [selectedState]);

  const translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Haj Inspectors 2026',
      subtitle: 'Selected candidates grouped by State',
      selectState: 'Select State',
      searchPlaceholder: 'Search by name, ID, cover #, mobile or building...',
      selected: 'Selected',
      waitlisted: 'Waitlisted',
      total: 'Total',
      male: 'Male',
      female: 'Female',
      cbtMarks: 'CBT Marks',
      interviewMarks: 'Interview',
      totalMarks: 'Total',
      fatherName: 'Father\'s Name',
      category: 'Category',
      quota: 'Quota',
      noResults: 'No inspectors found matching your criteria',
      allStates: 'All States',
      coverNumber: 'Cover #',
      indianMobile: 'Indian Mobile',
      ksaMobile: 'KSA Mobile',
      makkahBuilding: 'Makkah Building',
      madinahBuilding: 'Madinah Building',
      contactInfo: 'Contact',
      buildingInfo: 'Posting / Building',
      contactPending: 'Contact and building details will be updated soon.',
      filters: 'Filters',
      advancedFilters: 'Advanced Filters',
      city: 'City',
      allCities: 'All',
      makkah: 'Makkah',
      madinah: 'Madinah',
      assignment: 'Assignment',
      onlyUpdated: 'Only updated (U)',
      clearFilters: 'Clear filters',
    },
    ar: {
      title: 'مفتشو الحج 2026',
      subtitle: 'المرشحون المختارون مصنفون حسب الولاية',
      selectState: 'اختر الولاية',
      searchPlaceholder: 'ابحث بالاسم، الرقم، رقم الغلاف، الجوال أو المبنى...',
      selected: 'مختار',
      waitlisted: 'قائمة الانتظار',
      total: 'المجموع',
      male: 'ذكر',
      female: 'أنثى',
      cbtMarks: 'درجات CBT',
      interviewMarks: 'المقابلة',
      totalMarks: 'المجموع',
      fatherName: 'اسم الأب',
      category: 'الفئة',
      quota: 'الحصة',
      noResults: 'لم يتم العثور على مفتشين',
      allStates: 'جميع الولايات',
      coverNumber: 'رقم الغلاف',
      indianMobile: 'جوال هندي',
      ksaMobile: 'جوال سعودي',
      makkahBuilding: 'مبنى مكة',
      madinahBuilding: 'مبنى المدينة',
      contactInfo: 'الاتصال',
      buildingInfo: 'المبنى / الموقع',
      contactPending: 'سيتم تحديث بيانات الاتصال والمبنى قريباً.',
      filters: 'فلاتر',
      advancedFilters: 'فلاتر متقدمة',
      city: 'المدينة',
      allCities: 'الكل',
      makkah: 'مكة',
      madinah: 'المدينة المنورة',
      assignment: 'التعيين',
      onlyUpdated: 'المحدّثة فقط (U)',
      clearFilters: 'مسح الفلاتر',
    },
    ur: {
      title: 'حج انسپکٹرز 2026',
      subtitle: 'ریاست کے لحاظ سے منتخب امیدوار',
      selectState: 'ریاست منتخب کریں',
      searchPlaceholder: 'نام، آئی ڈی، کور نمبر، موبائل یا عمارت سے تلاش...',
      selected: 'منتخب',
      waitlisted: 'انتظار کی فہرست',
      total: 'کل',
      male: 'مرد',
      female: 'عورت',
      cbtMarks: 'CBT نمبرات',
      interviewMarks: 'انٹرویو',
      totalMarks: 'کل',
      fatherName: 'والد کا نام',
      category: 'قسم',
      quota: 'کوٹہ',
      noResults: 'کوئی انسپکٹر نہیں ملا',
      allStates: 'تمام ریاستیں',
      coverNumber: 'کور نمبر',
      indianMobile: 'انڈین موبائل',
      ksaMobile: 'KSA موبائل',
      makkahBuilding: 'مکہ بلڈنگ',
      madinahBuilding: 'مدینہ بلڈنگ',
      contactInfo: 'رابطہ',
      buildingInfo: 'پوسٹنگ / بلڈنگ',
      contactPending: 'رابطہ اور بلڈنگ کی تفصیلات جلد اپ ڈیٹ ہوں گی۔',
      filters: 'فلٹرز',
      advancedFilters: 'ایڈوانسڈ فلٹرز',
      city: 'شہر',
      allCities: 'سب',
      makkah: 'مکہ',
      madinah: 'مدینہ',
      assignment: 'تقرری',
      onlyUpdated: 'صرف اپڈیٹڈ (U)',
      clearFilters: 'فلٹرز صاف کریں',
    },
    hi: {
      title: 'हज इंस्पेक्टर 2026',
      subtitle: 'राज्य के अनुसार चयनित उम्मीदवार',
      selectState: 'राज्य चुनें',
      searchPlaceholder: 'नाम, ID, कवर #, मोबाइल या बिल्डिंग से खोजें...',
      selected: 'चयनित',
      waitlisted: 'प्रतीक्षा सूची',
      total: 'कुल',
      male: 'पुरुष',
      female: 'महिला',
      cbtMarks: 'CBT अंक',
      interviewMarks: 'साक्षात्कार',
      totalMarks: 'कुल',
      fatherName: 'पिता का नाम',
      category: 'श्रेणी',
      quota: 'कोटा',
      noResults: 'कोई इंस्पेक्टर नहीं मिला',
      allStates: 'सभी राज्य',
      coverNumber: 'कवर नंबर',
      indianMobile: 'भारतीय मोबाइल',
      ksaMobile: 'KSA मोबाइल',
      makkahBuilding: 'मक्का बिल्डिंग',
      madinahBuilding: 'मदीना बिल्डिंग',
      contactInfo: 'संपर्क',
      buildingInfo: 'पोस्टिंग / बिल्डिंग',
      contactPending: 'संपर्क और बिल्डिंग की जानकारी जल्द अपडेट होगी।',
      filters: 'फ़िल्टर',
      advancedFilters: 'एडवांस फ़िल्टर',
      city: 'शहर',
      allCities: 'सभी',
      makkah: 'मक्का',
      madinah: 'मदीना',
      assignment: 'पोस्टिंग',
      onlyUpdated: 'केवल अपडेटेड (U)',
      clearFilters: 'फ़िल्टर साफ़ करें',
    },
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Inspector Group Management CTA */}
        <Button onClick={() => navigate('/inspector-group')} variant="default" className="w-full h-12 text-base font-semibold">
          <ClipboardList className="w-5 h-5 mr-2" />
          {language === 'hi' ? 'मेरा तीर्थयात्री समूह प्रबंधित करें' : language === 'ur' ? 'میرا زائرین گروپ منظم کریں' : 'Manage My Pilgrim Group (150 Pilgrims)'}
        </Button>

        {/* WhatsApp Group + Register CTA */}
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1 border-emerald-300 dark:border-emerald-700">
            <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
              WhatsApp Group
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
          <Button onClick={() => navigate('/haj-inspector-register')} className="flex-1">
            <UserPlus className="w-4 h-4 mr-1.5" />
            {language === 'hi' ? 'पंजीकरण' : 'Register'}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            {t.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>

        {/* Stats Card */}
        <InspectorStatsCard stats={stats} translations={t} />

        {/* Filters */}
        <div className="space-y-3">
          <StateSelector
            value={selectedState}
            onValueChange={setSelectedState}
            placeholder={t.selectState}
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Advanced Filters toggle */}
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced((s) => !s)}
              className="h-9"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              {t.advancedFilters}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAdvancedFilters}
                className="h-9 text-muted-foreground"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                {t.clearFilters}
              </Button>
            )}
          </div>

          {showAdvanced && (
            <Card className="border-dashed">
              <CardContent className="p-3 space-y-3">
                {/* City filter */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    {t.city}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      { v: 'all' as const, label: t.allCities },
                      { v: 'makkah' as const, label: t.makkah },
                      { v: 'madinah' as const, label: t.madinah },
                    ]).map((opt) => (
                      <Button
                        key={opt.v}
                        type="button"
                        size="sm"
                        variant={cityFilter === opt.v ? 'default' : 'outline'}
                        onClick={() => setCityFilter(opt.v)}
                        className="h-8 text-xs"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Assignment filter */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    {t.assignment}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant={assignmentFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setAssignmentFilter('all')}
                      className="h-8 text-xs"
                    >
                      {t.allCities}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={assignmentFilter === 'updated' ? 'default' : 'outline'}
                      onClick={() => setAssignmentFilter('updated')}
                      className={`h-8 text-xs ${
                        assignmentFilter === 'updated'
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : 'border-amber-300 text-amber-700 dark:text-amber-400 dark:border-amber-700'
                      }`}
                    >
                      ⚠️ {t.onlyUpdated}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cityFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {t.city}: {cityFilter === 'makkah' ? t.makkah : t.madinah}
                  <button
                    type="button"
                    onClick={() => setCityFilter('all')}
                    aria-label="Remove city filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {assignmentFilter === 'updated' && (
                <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
                  ⚠️ {t.onlyUpdated}
                  <button
                    type="button"
                    onClick={() => setAssignmentFilter('all')}
                    aria-label="Remove assignment filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredInspectors.length} {t.total.toLowerCase()} {selectedState && `• ${selectedState}`}
        </div>

        {/* Inspector List - Grouped by State */}
        <div className="pb-20">
          {filteredInspectors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t.noResults}
            </div>
          ) : (
            <StateGroupedInspectors 
              inspectors={filteredInspectors}
              selectedState={selectedState}
              translations={t}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default HajInspectorsDirectoryPage;
