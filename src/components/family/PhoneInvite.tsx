import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Phone, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
];

interface SearchResult {
  user_id: string;
  full_name: string;
}

export const PhoneInvite = () => {
  const { isRTL } = useLanguage();
  const { group, members, refreshGroup } = useFamilyGroup();
  const { toast } = useToast();

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryOpen, setCountryOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];

  const handleSearch = async () => {
    if (!phone.trim() || !group) return;

    const fullPhone = `${countryCode}${phone}`;
    setIsSearching(true);
    setSearchResult(null);
    setNotFound(false);

    try {
      const { data, error } = await supabase.rpc("lookup_user_id_by_phone", {
        target_phone: fullPhone,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        // Check if already a member
        const alreadyMember = members.some((m) => m.user_id === data[0].user_id);
        if (alreadyMember) {
          toast({
            title: isRTL ? "موجود بالفعل" : "Already a member",
            description: isRTL ? "هذا الشخص موجود في المجموعة" : "This person is already in your group",
          });
          setNotFound(false);
          return;
        }
        setSearchResult(data[0]);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Phone search error:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل البحث" : "Search failed",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async () => {
    if (!searchResult || !group) return;

    setIsAdding(true);
    try {
      const newMemberId = crypto.randomUUID();

      const { error } = await supabase.from("group_members").insert({
        group_id: group.id,
        member_name: searchResult.full_name || "Member",
        member_id: newMemberId,
        user_id: searchResult.user_id,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: isRTL ? "موجود" : "Info", description: isRTL ? "موجود بالفعل" : "Already in the group" });
        } else {
          throw error;
        }
      } else {
        toast({
          title: isRTL ? "تمت الإضافة" : "Added!",
          description: isRTL
            ? `تمت إضافة ${searchResult.full_name} للمجموعة`
            : `${searchResult.full_name} added to the group`,
        });
        await refreshGroup();
      }

      setSearchResult(null);
      setPhone("");
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشلت الإضافة" : "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (!group) return null;

  return (
    <div className="space-y-2.5 pt-2 border-t border-border/50">
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <Phone className="h-3 w-3" />
        {isRTL ? "إضافة عضو بالهاتف" : "Add member by phone"}
      </p>

      <div className="flex gap-1.5">
        {/* Country code picker */}
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 px-2 gap-1 min-w-[80px] text-xs">
              <span>{selectedCountry.flag}</span>
              <span className="font-mono text-xs">{selectedCountry.code}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <ScrollArea className="h-[200px]">
              <div className="p-1.5 space-y-0.5">
                {countryCodes.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setCountryCode(c.code); setCountryOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm hover:bg-accent",
                      countryCode === c.code && "bg-accent"
                    )}
                  >
                    <span>{c.flag}</span>
                    <span className="flex-1 truncate">{c.country}</span>
                    <span className="text-xs text-muted-foreground font-mono">{c.code}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Phone input */}
        <Input
          type="tel"
          inputMode="numeric"
          placeholder={isRTL ? "رقم الهاتف" : "Phone number"}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 15));
            setSearchResult(null);
            setNotFound(false);
          }}
          dir="ltr"
          className="h-10 flex-1 font-mono text-sm"
        />

        {/* Search button */}
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 shrink-0"
          onClick={handleSearch}
          disabled={!phone.trim() || isSearching}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Search result */}
      {searchResult && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/10 animate-in fade-in">
          <span className="text-sm font-medium">{searchResult.full_name}</span>
          <Button size="sm" onClick={handleAdd} disabled={isAdding} className="h-8 gap-1.5 text-xs">
            <UserPlus className="h-3.5 w-3.5" />
            {isRTL ? "إضافة" : "Add"}
          </Button>
        </div>
      )}

      {/* Not found */}
      {notFound && (
        <p className="text-xs text-muted-foreground text-center py-1.5 animate-in fade-in">
          {isRTL
            ? "لم يتم العثور على مستخدم بهذا الرقم أو لم يفعّل المشاركة العائلية"
            : "No user found with this number, or family sharing is not enabled"}
        </p>
      )}
    </div>
  );
};
