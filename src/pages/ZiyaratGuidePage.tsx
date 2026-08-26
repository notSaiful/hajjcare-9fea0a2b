import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility, BookOpen, Car, Clock3, Footprints, Heart, Landmark, MapPin, Search, ShieldAlert, Video } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { SEO } from "@/components/SEO";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type City = "Makkah" | "Madinah";
type Place = { id: string; city: City; name: string; nameHi: string; nameUr: string; summary: string; coordinates: [number, number]; reference?: string; note?: string };

const places: Place[] = [
  { id: "haram", city: "Makkah", name: "Masjid al-Haram & the Kaaba", nameHi: "मस्जिद अल-हरम और काबा", nameUr: "مسجد الحرام اور کعبہ", summary: "Islam's holiest mosque and the direction of prayer. Follow Haram staff and crowd-management instructions at all times.", coordinates: [21.4225, 39.8262], reference: "Qur'an 2:125, 3:96–97; official Haram guidance." },
  { id: "maqam", city: "Makkah", name: "Maqam Ibrahim, Hijr Ismail & Multazam", nameHi: "मकाम इब्राहीम, हिज्र इस्माईल और मुल्तज़म", nameUr: "مقام ابراہیم، حجر اسماعیل اور ملتزم", summary: "Sacred landmarks within the Haram. Access changes with crowd conditions; do not push or obstruct tawaf.", coordinates: [21.4225, 39.8262], reference: "Qur'an 2:125; consult qualified guides for fiqh questions." },
  { id: "zamzam", city: "Makkah", name: "Zamzam & Safa-Marwah", nameHi: "ज़मज़म और सफा-मरवा", nameUr: "زمزم اور صفا مروہ", summary: "Zamzam is available within the Haram. Safa and Marwah are part of Sa'i; follow the marked routes and staff directions.", coordinates: [21.4225, 39.8262], reference: "Qur'an 2:158; official Haram guidance." },
  { id: "noor", city: "Makkah", name: "Jabal al-Noor (Cave of Hira)", nameHi: "जबाल अन-नूर (ग़ार-ए-हिरा)", nameUr: "جبل النور (غار حرا)", summary: "Traditionally associated with the first revelation. The climb is demanding; visit only if permitted, healthy, and it does not affect worship.", coordinates: [21.4582, 39.8583], reference: "Qur'an 96:1–5; historical context from seerah literature." },
  { id: "thawr", city: "Makkah", name: "Jabal Thawr", nameHi: "जबाल थौर", nameUr: "جبل ثور", summary: "Associated with the Hijrah journey. It is a strenuous mountain route and not a required Hajj or Umrah ritual.", coordinates: [21.3839, 39.8215] },
  { id: "mina", city: "Makkah", name: "Mina & Masjid al-Khayf", nameHi: "मीना और मस्जिद अल-खैफ", nameUr: "منیٰ اور مسجد الخیف", summary: "A central Hajj site. During Hajj, prioritise your official camp, transport plan, and safety instructions.", coordinates: [21.4139, 39.8925] },
  { id: "arafah", city: "Makkah", name: "Arafat & Jabal al-Rahmah", nameHi: "अरफ़ात और जबाल अर-रहमा", nameUr: "عرفات اور جبل الرحمہ", summary: "The plain of Arafat is central to Hajj on its appointed day. Outside that time it remains a historical location; observe local access rules.", coordinates: [21.3549, 39.9849] },
  { id: "muzdalifah", city: "Makkah", name: "Muzdalifah & Jamarat", nameHi: "मुज़दलिफ़ा और जमरात", nameUr: "مزدلفہ اور جمرات", summary: "Core Hajj areas with controlled movement during the pilgrimage. Use official routes; do not attempt independent visits during operations.", coordinates: [21.3891, 39.9332] },
  { id: "mualla", city: "Makkah", name: "Jannat al-Mu'alla", nameHi: "जन्नत अल-मुअल्ला", nameUr: "جنت المعلیٰ", summary: "A historic cemetery associated with members of the Prophet's ﷺ family and early Muslims. Maintain respect and follow cemetery rules.", coordinates: [21.4352, 39.8322] },
  { id: "birthplace", city: "Makkah", name: "Traditional Birthplace Area", nameHi: "पारंपरिक जन्मस्थल क्षेत्र", nameUr: "روایتی مقامِ پیدائش کا علاقہ", summary: "An area traditionally associated with the Prophet Muhammad ﷺ. Historical claims should be understood with care; it is not a ritual destination.", coordinates: [21.4258, 39.8273], note: "Historical attribution varies." },
  { id: "nabawi", city: "Madinah", name: "Al-Masjid an-Nabawi & Rawdah", nameHi: "अल-मस्जिद अन-नबवी और रौज़ा", nameUr: "المسجد النبوی اور روضہ", summary: "The Prophet's Mosque and Rawdah. Use Nusuk/official arrangements where required and never compromise prayer etiquette or crowd safety.", coordinates: [24.4672, 39.6111] },
  { id: "quba", city: "Madinah", name: "Quba Mosque & Masjid al-Jumu'ah", nameHi: "क़ुबा मस्जिद और मस्जिद अल-जुमुआ", nameUr: "مسجد قبا اور مسجد الجمعہ", summary: "Important early Madinah mosques. Plan a calm visit outside prayer congestion and follow the mosque's instructions.", coordinates: [24.4391, 39.6179] },
  { id: "qiblatain", city: "Madinah", name: "Qiblatain Mosque", nameHi: "क़िब्लतैन मस्जिद", nameUr: "مسجد قبلتین", summary: "Traditionally linked to the change of qiblah. Treat it as an educational visit and respect worshippers' space.", coordinates: [24.4855, 39.5838] },
  { id: "baqi", city: "Madinah", name: "Jannat al-Baqi", nameHi: "जन्नत अल-बक़ी", nameUr: "جنت البقیع", summary: "Historic cemetery of many Companions and members of the Prophet's ﷺ family. Follow opening times, entry rules, and cemetery etiquette.", coordinates: [24.4661, 39.6148] },
  { id: "uhud", city: "Madinah", name: "Mount Uhud & Martyrs Cemetery", nameHi: "जबल उहुद और शहीदों का कब्रिस्तान", nameUr: "جبل احد اور شہداء کا قبرستان", summary: "Site of the Battle of Uhud and its martyrs. Learn its history respectfully; do not treat graves as places for rituals.", coordinates: [24.5037, 39.6145] },
  { id: "sabamasajid", city: "Madinah", name: "Seven Mosques & Khandaq Area", nameHi: "सात मस्जिदें और खंदक क्षेत्र", nameUr: "سات مساجد اور خندق کا علاقہ", summary: "Sites associated with the Battle of the Trench. The present structures and historical attributions should be understood as educational context.", coordinates: [24.4935, 39.584] },
  { id: "salman", city: "Madinah", name: "Salman al-Farsi Garden Area", nameHi: "सलमान अल-फ़ारसी बाग़ क्षेत्र", nameUr: "سلمان فارسی باغ کا علاقہ", summary: "A site traditionally associated with Salman al-Farsi رضي الله عنه. Confirm access and historical interpretation locally.", coordinates: [24.4364, 39.6323], note: "Access and attribution may vary." },
  { id: "aqiq", city: "Madinah", name: "Wadi al-Aqiq", nameHi: "वादी अल-अक़ीक़", nameUr: "وادی العقیق", summary: "A historic valley in the Madinah region. Check current weather, road conditions, and authority guidance before travel.", coordinates: [24.5147, 39.5229] },
];

const labels = {
  en: { title: "Historical Places & Ziyarat", subtitle: "Learn with respect. Ziyarat is optional.", notice: "This guide is for educational and historical awareness. Follow the Qur'an, authentic Sunnah, and Saudi authority instructions. Optional visits must never interfere with Hajj or Umrah rituals.", makkah: "Makkah", madinah: "Madinah", all: "All places", search: "Search a place or historical topic", directions: "Directions", save: "Save", saved: "Saved", learn: "Ask Zoya", details: "View details", transport: "Use official transport, licensed taxis, or walking routes only when safe.", etiquette: "Respect worshippers, avoid crowding, and follow site access rules.", history: "Historical background", significance: "Religious significance", references: "References & source note", planning: "Visit planning", access: "Accessibility", video: "Educational video search" },
  hi: { title: "ऐतिहासिक स्थान और ज़ियारत", subtitle: "सम्मान के साथ जानें। ज़ियारत वैकल्पिक है।", notice: "यह मार्गदर्शिका शैक्षिक और ऐतिहासिक जानकारी के लिए है। कुरआन, प्रामाणिक सुन्नत और सऊदी अधिकारियों के निर्देशों का पालन करें। वैकल्पिक यात्राएं हज या उमराह के कर्मों में बाधा नहीं बननी चाहिए।", makkah: "मक्का", madinah: "मदीना", all: "सभी स्थान", search: "स्थान या इतिहास खोजें", directions: "दिशा", save: "सहेजें", saved: "सहेजा गया", learn: "ज़ोया से पूछें", details: "विवरण देखें", transport: "केवल सुरक्षित होने पर आधिकारिक परिवहन, लाइसेंस टैक्सी या पैदल मार्ग लें।", etiquette: "इबादत करने वालों का सम्मान करें, भीड़ से बचें और प्रवेश नियम मानें।", history: "ऐतिहासिक पृष्ठभूमि", significance: "धार्मिक महत्व", references: "संदर्भ और स्रोत नोट", planning: "यात्रा योजना", access: "सुगम्यता", video: "शैक्षिक वीडियो खोज" },
  ur: { title: "تاریخی مقامات اور زیارت", subtitle: "احترام کے ساتھ جانیں۔ زیارت اختیاری ہے۔", notice: "یہ رہنما تعلیمی اور تاریخی آگاہی کے لیے ہے۔ قرآن، صحیح سنت اور سعودی حکام کی ہدایات پر عمل کریں۔ اختیاری زیارت حج یا عمرہ کے اعمال میں رکاوٹ نہ بنے۔", makkah: "مکہ", madinah: "مدینہ", all: "تمام مقامات", search: "مقام یا تاریخی موضوع تلاش کریں", directions: "راستہ", save: "محفوظ کریں", saved: "محفوظ شدہ", learn: "زویا سے پوچھیں", details: "تفصیل دیکھیں", transport: "صرف محفوظ ہونے پر سرکاری نقل و حمل، لائسنس یافتہ ٹیکسی یا پیدل راستہ استعمال کریں۔", etiquette: "نمازیوں کا احترام کریں، ہجوم سے بچیں اور رسائی کے اصول مانیں۔", history: "تاریخی پس منظر", significance: "دینی اہمیت", references: "حوالہ اور ماخذ نوٹ", planning: "دورے کی منصوبہ بندی", access: "رسائی", video: "تعلیمی ویڈیو تلاش" },
};

export default function ZiyaratGuidePage() {
  const { language, isRTL } = useLanguage();
  const t = labels[language as keyof typeof labels] ?? labels.en;
  const [city, setCity] = useState<City | "all">("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("hajcare-ziyarat-favorites") || "[]");
      if (Array.isArray(stored)) setSaved(new Set(stored.filter((id): id is string => typeof id === "string")));
    } catch { /* Favorites are optional. */ }
  }, []);

  const visiblePlaces = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return places.filter((place) => (city === "all" || place.city === city) && (!term || [place.name, place.nameHi, place.nameUr, place.summary].some((value) => value.toLocaleLowerCase().includes(term))));
  }, [city, query]);

  const toggleSaved = (id: string) => setSaved((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    localStorage.setItem("hajcare-ziyarat-favorites", JSON.stringify([...next]));
    return next;
  });

  const openDirections = (place: Place) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[0]},${place.coordinates[1]}`, "_blank", "noopener,noreferrer");
  const placeName = (place: Place) => language === "hi" ? place.nameHi : language === "ur" ? place.nameUr : place.name;

  return <MainLayout>
    <SEO title="Historical Places & Ziyarat Guide" description="Educational, respectful guide to historic places in Makkah and Madinah. Optional visits only; follow Saudi authority guidance." path="/ziyarat" type="article" />
    <main className="container mx-auto max-w-3xl space-y-4 px-4 pb-24 pt-5" dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title={t.title} subtitle={t.subtitle} icon={Landmark} iconVariant="amber" />
      <Card className="border-amber-300/60 bg-amber-50/70 dark:bg-amber-950/20"><CardContent className="flex gap-3 p-4 text-sm leading-relaxed"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><p>{t.notice}</p></CardContent></Card>
      <div className="flex flex-col gap-2 sm:flex-row"><label className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="h-11 pl-9" /></label><div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"><Button size="sm" variant={city === "all" ? "default" : "ghost"} onClick={() => setCity("all")}>{t.all}</Button><Button size="sm" variant={city === "Makkah" ? "default" : "ghost"} onClick={() => setCity("Makkah")}>{t.makkah}</Button><Button size="sm" variant={city === "Madinah" ? "default" : "ghost"} onClick={() => setCity("Madinah")}>{t.madinah}</Button></div></div>
      <div className="grid gap-3 sm:grid-cols-2">{visiblePlaces.map((place) => <Card key={place.id} className="border-border/70"><CardContent className="space-y-3 p-4"><div className="flex items-start justify-between gap-2"><div><Badge variant="secondary">{place.city === "Makkah" ? t.makkah : t.madinah}</Badge><h2 className="mt-2 text-base font-bold leading-tight">{placeName(place)}</h2></div><Button variant="ghost" size="icon" onClick={() => toggleSaved(place.id)} aria-label={saved.has(place.id) ? t.saved : t.save} aria-pressed={saved.has(place.id)}><Heart className={`h-4 w-4 ${saved.has(place.id) ? "fill-primary text-primary" : ""}`} /></Button></div><p className="text-sm leading-relaxed text-muted-foreground">{place.summary}</p>{place.note && <p className="text-xs text-amber-700 dark:text-amber-300">{place.note}</p>}<p className="flex gap-1.5 text-xs text-muted-foreground"><BookOpen className="h-3.5 w-3.5 shrink-0" />{t.etiquette}</p><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => setSelectedPlace(place)}>{t.details}</Button><Button size="sm" variant="outline" onClick={() => openDirections(place)}><MapPin className="mr-1.5 h-4 w-4" />{t.directions}</Button><TextToSpeechButton text={`${place.name}. ${place.summary}`} size="sm" showLabel={false} /></div></CardContent></Card>)}</div>
      <Card className="bg-muted/40"><CardContent className="flex gap-3 p-4 text-sm text-muted-foreground"><Car className="h-5 w-5 shrink-0 text-primary" /><div><p>{t.transport}</p><p className="mt-1 flex items-center gap-1.5"><Footprints className="h-4 w-4" />Check weather, accessibility, opening times, and official transport guidance before leaving.</p></div></CardContent></Card>
      <Dialog open={!!selectedPlace} onOpenChange={(open) => !open && setSelectedPlace(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {selectedPlace && <><DialogHeader><DialogTitle>{placeName(selectedPlace)}</DialogTitle><DialogDescription>{selectedPlace.city === "Makkah" ? t.makkah : t.madinah} · {t.notice}</DialogDescription></DialogHeader><div className="space-y-4 text-sm"><section><h3 className="font-semibold">{t.history}</h3><p className="mt-1 leading-relaxed text-muted-foreground">{selectedPlace.summary}</p></section><section><h3 className="font-semibold">{t.significance}</h3><p className="mt-1 leading-relaxed text-muted-foreground">This place is included for learning and respectful historical awareness. It is not an additional ritual; follow qualified guidance for worship questions.</p></section><section><h3 className="font-semibold">{t.references}</h3><p className="mt-1 leading-relaxed text-muted-foreground">{selectedPlace.reference ?? "Historical attribution and access conditions can vary. Confirm current details through Saudi authorities and qualified educators."}</p></section><section className="grid gap-3 rounded-xl bg-muted/50 p-3 sm:grid-cols-2"><div><h3 className="flex items-center gap-1.5 font-semibold"><Clock3 className="h-4 w-4" />{t.planning}</h3><p className="mt-1 text-muted-foreground">Visit outside peak prayer and crowd periods. Check weather and current access before departure.</p></div><div><h3 className="flex items-center gap-1.5 font-semibold"><Accessibility className="h-4 w-4" />{t.access}</h3><p className="mt-1 text-muted-foreground">Many sites involve uneven ground, crowds, or limited shade. Choose accessible transport and avoid strenuous routes if unwell.</p></div></section><div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => openDirections(selectedPlace)}><MapPin className="mr-1.5 h-4 w-4" />{t.directions}</Button><Button asChild size="sm" variant="outline"><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${selectedPlace.name} Islamic history educational`)}`} target="_blank" rel="noopener noreferrer"><Video className="mr-1.5 h-4 w-4" />{t.video}</a></Button><Button asChild size="sm" variant="ghost"><Link to={`/chat?question=${encodeURIComponent(`Why is ${selectedPlace.name} important? What authentic references and etiquette should I know before visiting?`)}`}>{t.learn}</Link></Button></div></div></>}
        </DialogContent>
      </Dialog>
    </main>
  </MainLayout>;
}
