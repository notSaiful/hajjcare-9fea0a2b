import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { DIRECTORY_CATEGORIES, type DirectoryCategory, type MissionDirectoryContact, getMissionDirectoryContacts, normalizedPhone } from "@/lib/missionDirectory";
import { Building2, Copy, ExternalLink, Heart, Loader2, MapPin, MessageCircle, Navigation, Phone, Search, Share2, ShieldCheck, Smartphone, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const categoryLabels: Record<DirectoryCategory, string> = {
  building: "Building Directory", inspector: "Hajj Inspectors", doctor: "Doctors", branch_office: "Branch Offices", mission_official: "Indian Hajj Mission Officials", medical_emergency: "Medical Emergency", emergency_service: "Emergency Services", transport: "Transport", accommodation: "Accommodation", group_leader: "Group Leaders", helpline: "Helpline", saudi_service: "Saudi Government Services",
};
const cities = ["Makkah", "Madinah", "Mina", "Arafat", "Muzdalifah", "Jeddah", "Saudi Arabia", "India"];
const localKey = "hajcare-mission-directory-cache-v1";
const favouriteKey = "hajcare-mission-directory-favourites";

function ContactCard({ contact, favourite, onFavourite }: { contact: MissionDirectoryContact; favourite: boolean; onFavourite: () => void }) {
  const { toast } = useToast();
  const copy = async () => { await navigator.clipboard?.writeText([contact.name, contact.designation, contact.phone || contact.whatsapp, contact.email].filter(Boolean).join("\n")); toast({ title: "Contact copied" }); };
  const share = async () => { const text = [contact.name, contact.designation, contact.phone || contact.whatsapp].filter(Boolean).join(" · "); if (navigator.share) await navigator.share({ title: contact.name, text }); else await copy(); };
  const phone = contact.phone || contact.emergency_phone;
  const whatsapp = contact.whatsapp || contact.phone;
  return <Card className="border-primary/10 shadow-sm"><CardContent className="p-4">
    <div className="flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start gap-2"><h2 className="font-semibold">{contact.name}</h2><Badge className="bg-emerald-600"><ShieldCheck className="mr-1 h-3 w-3" />Verified</Badge></div><p className="text-sm text-muted-foreground">{[contact.designation, contact.specialization, contact.duty_area].filter(Boolean).join(" · ")}</p><p className="mt-1 text-xs text-muted-foreground">{[contact.city, contact.building_number && `Building ${contact.building_number}`, contact.sector, contact.available_hours].filter(Boolean).join(" · ")}</p></div><Button size="icon" variant="ghost" onClick={onFavourite} aria-label="Save contact"><Star className={`h-4 w-4 ${favourite ? "fill-amber-400 text-amber-500" : ""}`} /></Button></div>
    {contact.address && <p className="mt-3 text-sm">{contact.address}</p>}
    <div className="mt-3 flex flex-wrap gap-1.5">
      {phone && <Button asChild size="sm"><a href={`tel:${normalizedPhone(phone)}`}><Phone className="mr-1.5 h-4 w-4" />Call</a></Button>}
      {whatsapp && <Button asChild size="sm" variant="outline"><a href={`https://wa.me/${normalizedPhone(whatsapp).replace(/^\+/, "")}`} target="_blank" rel="noreferrer"><MessageCircle className="mr-1.5 h-4 w-4" />WhatsApp</a></Button>}
      {phone && <Button asChild size="sm" variant="ghost"><a href={`sms:${normalizedPhone(phone)}`}><Smartphone className="h-4 w-4" /><span className="sr-only">SMS</span></a></Button>}
      {contact.email && <Button asChild size="sm" variant="ghost"><a href={`mailto:${contact.email}`}>Email</a></Button>}
      {contact.maps_url && <Button asChild size="sm" variant="ghost"><a href={contact.maps_url} target="_blank" rel="noreferrer"><Navigation className="mr-1 h-4 w-4" />Navigate</a></Button>}
      <Button size="sm" variant="ghost" onClick={copy}><Copy className="h-4 w-4" /><span className="sr-only">Copy</span></Button><Button size="sm" variant="ghost" onClick={share}><Share2 className="h-4 w-4" /><span className="sr-only">Share</span></Button>
    </div><p className="mt-3 text-[11px] text-muted-foreground">Source: {contact.source_url ? <a className="underline" href={contact.source_url} target="_blank" rel="noreferrer">{contact.source_name}</a> : contact.source_name}</p>
  </CardContent></Card>;
}

export default function HajMissionDirectoryPage() {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("all"); const [city, setCity] = useState("all"); const [embarkation, setEmbarkation] = useState(""); const [building, setBuilding] = useState(""); const [onlyInspectors, setOnlyInspectors] = useState(false); const [onlyDoctors, setOnlyDoctors] = useState(false);
  const [cached, setCached] = useState<MissionDirectoryContact[]>([]); const [favourites, setFavourites] = useState<string[]>(() => JSON.parse(localStorage.getItem(favouriteKey) || "[]"));
  const directory = useQuery({ queryKey: ["mission-directory"], queryFn: getMissionDirectoryContacts, staleTime: 5 * 60_000 });
  useEffect(() => { if (directory.data) { localStorage.setItem(localKey, JSON.stringify(directory.data)); setCached(directory.data); } else { try { setCached(JSON.parse(localStorage.getItem(localKey) || "[]")); } catch { /* offline cache is optional */ } } }, [directory.data]);
  const contacts = directory.data || cached;
  const filtered = useMemo(() => contacts.filter((c) => { const haystack = Object.values(c).flatMap((value) => Array.isArray(value) ? value : [value]).join(" ").toLowerCase(); return (!query || haystack.includes(query.toLowerCase())) && (category === "all" || c.category === category) && (city === "all" || c.city === city) && (!embarkation || c.embarkation_point?.toLowerCase().includes(embarkation.toLowerCase())) && (!building || c.building_number?.includes(building)) && (!onlyInspectors || c.category === "inspector") && (!onlyDoctors || c.category === "doctor"); }), [contacts, query, category, city, embarkation, building, onlyInspectors, onlyDoctors]);
  const toggleFavourite = (id: string) => { const next = favourites.includes(id) ? favourites.filter((item) => item !== id) : [...favourites, id]; setFavourites(next); localStorage.setItem(favouriteKey, JSON.stringify(next)); };
  const title = language === "hi" ? "भारतीय हज मिशन स्मार्ट डायरेक्टरी" : language === "ur" ? "انڈین حج مشن اسمارٹ ڈائریکٹری" : "Indian Hajj Mission Smart Directory";
  return <MainLayout><SEO title="Indian Hajj Mission Smart Directory" description="Verified Indian and Saudi Hajj contacts with calling, WhatsApp and navigation." path="/haj-directory" type="website" />
    <main className="mx-auto max-w-6xl px-4 pb-24" dir={isRTL ? "rtl" : "ltr"}><header className="py-7 text-center"><p className="mb-2 text-xl">🇮🇳</p><h1 className="text-2xl font-bold sm:text-3xl">{title}</h1><p className="mt-2 text-muted-foreground">All important Indian & Saudi Hajj contacts at your fingertips.</p></header>
      <Card className="mb-5 border-primary/20 bg-primary/5"><CardContent className="grid gap-3 p-4 md:grid-cols-6"><div className="relative md:col-span-2"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search name, building, duty area…" value={query} onChange={(e) => setQuery(e.target.value)} /></div><Input placeholder="Building number" value={building} onChange={(e) => setBuilding(e.target.value)} /><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{DIRECTORY_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{categoryLabels[item]}</SelectItem>)}</SelectContent></Select><Select value={city} onValueChange={setCity}><SelectTrigger><SelectValue placeholder="City" /></SelectTrigger><SelectContent><SelectItem value="all">All cities</SelectItem>{cities.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Input placeholder="Embarkation point" value={embarkation} onChange={(e) => setEmbarkation(e.target.value)} /><div className="flex gap-2 md:col-span-6"><Button size="sm" variant={onlyInspectors ? "default" : "outline"} onClick={() => setOnlyInspectors(!onlyInspectors)}>Hajj Inspector</Button><Button size="sm" variant={onlyDoctors ? "default" : "outline"} onClick={() => setOnlyDoctors(!onlyDoctors)}>Doctor</Button><Button size="sm" variant="ghost" onClick={() => { setQuery(""); setCategory("all"); setCity("all"); setEmbarkation(""); setBuilding(""); setOnlyDoctors(false); setOnlyInspectors(false); }}>Clear filters</Button></div></CardContent></Card>
      <section className="mb-5 grid gap-3 sm:grid-cols-3"><Card><CardContent className="p-4"><p className="text-sm font-semibold">Live Google Maps</p><p className="text-xs text-muted-foreground">Open any verified contact location and navigate with your installed map app.</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm font-semibold">Offline contact access</p><p className="text-xs text-muted-foreground">Verified contacts are saved on this device after the first successful load.</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm font-semibold">Need to report an issue?</p><Button asChild className="mt-2" size="sm"><a href="/grievances">Submit complaint</a></Button></CardContent></Card></section>
      {directory.isLoading && <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>}{!directory.isLoading && filtered.length === 0 && <Card><CardContent className="p-8 text-center"><MapPin className="mx-auto mb-2 h-7 w-7 text-muted-foreground" /><p className="font-medium">No verified contacts match these filters.</p><p className="mt-1 text-sm text-muted-foreground">Administrators can add and verify official contacts from the management dashboard.</p></CardContent></Card>}<section className="grid gap-3 md:grid-cols-2">{filtered.map((contact) => <ContactCard key={contact.id} contact={contact} favourite={favourites.includes(contact.id)} onFavourite={() => toggleFavourite(contact.id)} />)}</section>
      <p className="mt-6 flex items-center justify-center gap-1 text-center text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" />Only administrator-verified contacts are displayed. For immediate danger, call local emergency services.</p>
    </main></MainLayout>;
}
