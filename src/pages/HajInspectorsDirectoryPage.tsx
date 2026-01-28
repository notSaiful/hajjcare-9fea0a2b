import { useState, useMemo } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HAJ_INSPECTORS, getStateStats } from '@/data/hajInspectorsData';
import { Search, Award } from 'lucide-react';
import { StateSelector } from '@/components/StateSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { InspectorStatsCard } from '@/components/inspector/InspectorStatsCard';
import { StateGroupedInspectors } from '@/components/inspector/StateGroupedInspectors';

const HajInspectorsDirectoryPage = () => {
  const { language } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter inspectors
  const filteredInspectors = useMemo(() => {
    let filtered = HAJ_INSPECTORS;
    
    if (selectedState) {
      filtered = filtered.filter(i => i.state.toLowerCase() === selectedState.toLowerCase());
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(query) ||
        i.fatherName.toLowerCase().includes(query) ||
        i.id.includes(query)
      );
    }
    
    return filtered;
  }, [selectedState, searchQuery]);

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
      searchPlaceholder: 'Search by name or ID...',
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
    },
    ar: {
      title: 'مفتشو الحج 2026',
      subtitle: 'المرشحون المختارون مصنفون حسب الولاية',
      selectState: 'اختر الولاية',
      searchPlaceholder: 'البحث بالاسم أو الرقم...',
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
    },
    ur: {
      title: 'حج انسپکٹرز 2026',
      subtitle: 'ریاست کے لحاظ سے منتخب امیدوار',
      selectState: 'ریاست منتخب کریں',
      searchPlaceholder: 'نام یا آئی ڈی سے تلاش کریں...',
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
    },
    hi: {
      title: 'हज इंस्पेक्टर 2026',
      subtitle: 'राज्य के अनुसार चयनित उम्मीदवार',
      selectState: 'राज्य चुनें',
      searchPlaceholder: 'नाम या आईडी से खोजें...',
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
    },
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
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
