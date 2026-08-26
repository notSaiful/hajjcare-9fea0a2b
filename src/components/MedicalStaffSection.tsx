import { memo, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Search, Stethoscope, UserRound, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { doctorsList, paramedicsList, medicalStaffLabels, MedicalStaff } from "@/data/medicalStaffContent";

const INITIAL_DISPLAY_COUNT = 10;

const StaffCard = memo(({ staff, callLabel }: { staff: MedicalStaff; callLabel: string }) => {
  const handleCall = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    window.location.href = `tel:+91${staff.phone}`;
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{staff.name}</p>
        <p className="text-xs text-muted-foreground truncate">{staff.specialization}</p>
        <p className="text-xs text-muted-foreground/70 truncate">{staff.state}</p>
      </div>
      <Button
        size="sm"
        variant="default"
        className="shrink-0 gap-1.5 h-9 px-3 bg-green-600 hover:bg-green-700 text-white"
        onClick={handleCall}
      >
        <Phone className="w-3.5 h-3.5" />
        <span className="text-xs">{callLabel}</span>
      </Button>
    </div>
  );
});

StaffCard.displayName = "StaffCard";

const StaffList = memo(({ 
  staffList, 
  searchQuery, 
  labels, 
  language 
}: { 
  staffList: MedicalStaff[]; 
  searchQuery: string; 
  labels: typeof medicalStaffLabels;
  language: string;
}) => {
  const [showAll, setShowAll] = useState(false);

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staffList;
    const query = searchQuery.toLowerCase();
    return staffList.filter(
      (staff) =>
        staff.name.toLowerCase().includes(query) ||
        staff.state.toLowerCase().includes(query) ||
        staff.specialization.toLowerCase().includes(query)
    );
  }, [staffList, searchQuery]);

  const displayedStaff = showAll ? filteredStaff : filteredStaff.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = filteredStaff.length > INITIAL_DISPLAY_COUNT;

  const callLabel = labels.call[language] || labels.call.en;

  return (
    <div className="space-y-2">
      {displayedStaff.map((staff) => (
        <StaffCard key={`${staff.sNo}-${staff.phone}`} staff={staff} callLabel={callLabel} />
      ))}
      
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 gap-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {labels.showLess[language] || labels.showLess.en}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {labels.showAll[language] || labels.showAll.en} ({filteredStaff.length})
            </>
          )}
        </Button>
      )}
      
      {filteredStaff.length === 0 && (
        <p className="text-center text-muted-foreground py-6 text-sm">
          No results found
        </p>
      )}
    </div>
  );
});

StaffList.displayName = "StaffList";

const MedicalStaffSection = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const labels = medicalStaffLabels;

  return (
    <Card className="border-2 border-emerald-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-soft border-2 border-emerald-500/20">
            <Stethoscope className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="text-lg">{labels.sectionTitle[language] || labels.sectionTitle.en}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {labels.sectionSubtitle[language] || labels.sectionSubtitle.en}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={labels.searchPlaceholder[language] || labels.searchPlaceholder.en}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="doctors" className="gap-2 text-xs sm:text-sm">
              <UserRound className="w-4 h-4" />
              {labels.doctorsTitle[language]?.split(" ")[0] || "Doctors"}
            </TabsTrigger>
            <TabsTrigger value="paramedics" className="gap-2 text-xs sm:text-sm">
              <Stethoscope className="w-4 h-4" />
              {labels.paramedicsTitle[language]?.split(" ")[0] || "Paramedics"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="mt-0">
            <StaffList 
              staffList={doctorsList} 
              searchQuery={searchQuery} 
              labels={labels}
              language={language}
            />
          </TabsContent>

          <TabsContent value="paramedics" className="mt-0">
            <StaffList 
              staffList={paramedicsList} 
              searchQuery={searchQuery} 
              labels={labels}
              language={language}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default memo(MedicalStaffSection);
