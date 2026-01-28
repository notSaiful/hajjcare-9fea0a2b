import { useState, useMemo } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HAJ_INSPECTORS, INSPECTOR_STATES, getStateStats, HajInspector } from '@/data/hajInspectorsData';
import { Search, Users, CheckCircle, Clock, User, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StateSelector } from '@/components/StateSelector';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from '@/contexts/LanguageContext';

const HajInspectorsDirectoryPage = () => {
  const { language } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      subtitle: 'Selected candidates for Haj Inspector positions',
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
      subtitle: 'المرشحون المختارون لمناصب مفتش الحج',
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
      subtitle: 'حج انسپکٹر عہدوں کے لیے منتخب امیدوار',
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
      subtitle: 'हज इंस्पेक्टर पदों के लिए चयनित उम्मीदवार',
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
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <div className="text-2xl font-bold text-emerald-600">{stats.selected}</div>
                <div className="text-xs text-muted-foreground">{t.selected}</div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <div className="text-2xl font-bold text-amber-600">{stats.waitlisted}</div>
                <div className="text-xs text-muted-foreground">{t.waitlisted}</div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-muted-foreground">{t.total}</div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {stats.male} {t.male}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {stats.female} {t.female}
              </span>
            </div>
          </CardContent>
        </Card>

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

        {/* Inspector List */}
        <div className="space-y-3 pb-20">
          {filteredInspectors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t.noResults}
            </div>
          ) : (
            filteredInspectors.map((inspector) => (
              <InspectorCard 
                key={inspector.id} 
                inspector={inspector} 
                isExpanded={expandedId === inspector.id}
                onToggle={() => setExpandedId(expandedId === inspector.id ? null : inspector.id)}
                translations={t}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

interface InspectorCardProps {
  inspector: HajInspector;
  isExpanded: boolean;
  onToggle: () => void;
  translations: Record<string, string>;
}

const InspectorCard = ({ inspector, isExpanded, onToggle, translations: t }: InspectorCardProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{inspector.name}</h3>
                  <Badge 
                    variant={inspector.result === 'Selected' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs shrink-0",
                      inspector.result === 'Selected' 
                        ? "bg-emerald-500 hover:bg-emerald-600" 
                        : "bg-amber-500 hover:bg-amber-600"
                    )}
                  >
                    {inspector.result === 'Selected' ? (
                      <><CheckCircle className="w-3 h-3 mr-1" />{t.selected}</>
                    ) : (
                      <><Clock className="w-3 h-3 mr-1" />{t.waitlisted}</>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{inspector.state}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-muted-foreground">{t.totalMarks}: <strong className="text-foreground">{inspector.totalMarks}</strong></span>
                  <Badge variant="outline" className="text-xs">{inspector.gender}</Badge>
                </div>
              </div>
              <div className="ml-2 text-muted-foreground">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 space-y-3 border-t">
            <div className="grid grid-cols-2 gap-3 pt-3 text-sm">
              <div>
                <span className="text-muted-foreground">{t.fatherName}:</span>
                <p className="font-medium">{inspector.fatherName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t.category}:</span>
                <p className="font-medium">{inspector.category}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{inspector.cbtMarks}</div>
                <div className="text-xs text-muted-foreground">{t.cbtMarks}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{inspector.interviewMarks}</div>
                <div className="text-xs text-muted-foreground">{t.interviewMarks}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-600">{inspector.totalMarks}</div>
                <div className="text-xs text-muted-foreground">{t.totalMarks}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{inspector.quota}</Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground">ID: {inspector.id}</Badge>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default HajInspectorsDirectoryPage;
