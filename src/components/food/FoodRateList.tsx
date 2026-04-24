import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Search,
  Apple,
  Milk,
  Beef,
  Wheat,
  CupSoda,
  Sandwich,
  Info,
  TrendingUp,
} from "lucide-react";

interface RateItem {
  name_en: string;
  name_hi: string;
  unit: string;
  priceSar: number;
  notes?: string;
}

interface RateCategory {
  key: string;
  title_en: string;
  title_hi: string;
  icon: typeof Apple;
  color: string;
  items: RateItem[];
}

// Approximate Saudi market rates (Makkah/Madinah, 2026 estimates)
// Prices vary by area; tourist zones near Haram are 20-40% higher
const CATEGORIES: RateCategory[] = [
  {
    key: "fruits",
    title_en: "Fruits",
    title_hi: "Fruits / फल",
    icon: Apple,
    color: "bg-red-500",
    items: [
      { name_en: "Banana", name_hi: "Kela / केला", unit: "1 kg", priceSar: 5 },
      { name_en: "Apple", name_hi: "Seb / सेब", unit: "1 kg", priceSar: 9 },
      { name_en: "Orange", name_hi: "Santra / संतरा", unit: "1 kg", priceSar: 7 },
      { name_en: "Mango", name_hi: "Aam / आम", unit: "1 kg", priceSar: 12 },
      { name_en: "Grapes", name_hi: "Angoor / अंगूर", unit: "1 kg", priceSar: 10 },
      { name_en: "Pomegranate", name_hi: "Anar / अनार", unit: "1 kg", priceSar: 12 },
      { name_en: "Watermelon", name_hi: "Tarbooz / तरबूज", unit: "1 kg", priceSar: 3 },
      { name_en: "Dates (Ajwa)", name_hi: "Khajoor Ajwa", unit: "1 kg", priceSar: 80, notes: "Premium variety" },
      { name_en: "Dates (Sukkari)", name_hi: "Khajoor Sukkari", unit: "1 kg", priceSar: 25 },
      { name_en: "Dates (regular)", name_hi: "Aam Khajoor", unit: "1 kg", priceSar: 12 },
    ],
  },
  {
    key: "dairy",
    title_en: "Milk & Dairy",
    title_hi: "Doodh / दूध",
    icon: Milk,
    color: "bg-blue-500",
    items: [
      { name_en: "Fresh Milk (Almarai)", name_hi: "Doodh", unit: "1 litre", priceSar: 6 },
      { name_en: "Laban (Buttermilk)", name_hi: "Laban / Lassi", unit: "1 litre", priceSar: 5 },
      { name_en: "Yoghurt (plain)", name_hi: "Dahi", unit: "500g", priceSar: 5 },
      { name_en: "Cheese slices", name_hi: "Cheese", unit: "200g pack", priceSar: 10 },
      { name_en: "Butter", name_hi: "Makkhan", unit: "200g", priceSar: 12 },
      { name_en: "Labneh", name_hi: "Labneh (thick yogurt)", unit: "500g", priceSar: 8 },
    ],
  },
  {
    key: "bakery",
    title_en: "Bread & Bakery",
    title_hi: "Roti / रोटी",
    icon: Wheat,
    color: "bg-amber-500",
    items: [
      { name_en: "Arabic Bread (Khubz)", name_hi: "Khubz / Arabi Roti", unit: "Pack of 6", priceSar: 2 },
      { name_en: "Tameez (large bread)", name_hi: "Tameez", unit: "1 piece", priceSar: 2 },
      { name_en: "Sandwich Bread", name_hi: "Bread loaf", unit: "1 loaf", priceSar: 5 },
      { name_en: "Croissant", name_hi: "Croissant", unit: "1 piece", priceSar: 4 },
      { name_en: "Samosa", name_hi: "Samosa", unit: "1 piece", priceSar: 1 },
    ],
  },
  {
    key: "meat",
    title_en: "Meat & Chicken",
    title_hi: "Gosht / गोश्त",
    icon: Beef,
    color: "bg-rose-600",
    items: [
      { name_en: "Chicken (whole)", name_hi: "Murgi", unit: "1 kg", priceSar: 18 },
      { name_en: "Chicken (boneless)", name_hi: "Boneless Murgi", unit: "1 kg", priceSar: 28 },
      { name_en: "Mutton", name_hi: "Bakra Gosht", unit: "1 kg", priceSar: 55 },
      { name_en: "Beef", name_hi: "Beef", unit: "1 kg", priceSar: 45 },
      { name_en: "Eggs", name_hi: "Anda", unit: "30 pcs tray", priceSar: 18 },
    ],
  },
  {
    key: "drinks",
    title_en: "Drinks & Water",
    title_hi: "Pani / पानी",
    icon: CupSoda,
    color: "bg-cyan-500",
    items: [
      { name_en: "Bottled Water", name_hi: "Pani ki bottle", unit: "1.5 L", priceSar: 2 },
      { name_en: "Bottled Water", name_hi: "Pani ki bottle", unit: "200ml (small)", priceSar: 1 },
      { name_en: "Zamzam (5L)", name_hi: "Zamzam", unit: "5 litre canister", priceSar: 0, notes: "Free at Haram" },
      { name_en: "Pepsi/Coke can", name_hi: "Cold drink", unit: "330ml", priceSar: 3 },
      { name_en: "Fresh Juice", name_hi: "Taza Juice", unit: "500ml", priceSar: 8 },
      { name_en: "Tea (chai)", name_hi: "Chai", unit: "1 cup", priceSar: 3 },
      { name_en: "Arabic Coffee", name_hi: "Qahwa", unit: "1 cup", priceSar: 5 },
    ],
  },
  {
    key: "meals",
    title_en: "Ready Meals (Restaurants)",
    title_hi: "Restaurant Khana",
    icon: Sandwich,
    color: "bg-emerald-600",
    items: [
      { name_en: "Mandi (chicken, half)", name_hi: "Mandi half", unit: "1 plate", priceSar: 18 },
      { name_en: "Mandi (chicken, full)", name_hi: "Mandi full", unit: "1 plate (2-3 people)", priceSar: 35 },
      { name_en: "Mandi (mutton)", name_hi: "Mutton Mandi", unit: "1 plate", priceSar: 45 },
      { name_en: "Biryani (chicken)", name_hi: "Chicken Biryani", unit: "1 plate", priceSar: 15 },
      { name_en: "Indian Thali", name_hi: "Hindustani Thali", unit: "1 plate", priceSar: 20 },
      { name_en: "Roti / Naan", name_hi: "Roti", unit: "1 piece", priceSar: 2 },
      { name_en: "Dal / curry", name_hi: "Dal sabzi", unit: "1 bowl", priceSar: 10 },
      { name_en: "Shawarma", name_hi: "Shawarma roll", unit: "1 piece", priceSar: 8 },
      { name_en: "Burger (chicken)", name_hi: "Burger", unit: "1 piece", priceSar: 15 },
    ],
  },
];

const SAR_TO_INR = 22.5; // approximate; user can mentally adjust

interface Props {
  language: string;
}

export function FoodRateList({ language }: Props) {
  const [search, setSearch] = useState("");
  const isHindi = ["hi", "ur"].includes(language);

  const filtered = useMemo(() => {
    if (!search.trim()) return CATEGORIES;
    const q = search.toLowerCase();
    return CATEGORIES.map((c) => ({
      ...c,
      items: c.items.filter(
        (i) =>
          i.name_en.toLowerCase().includes(q) ||
          i.name_hi.toLowerCase().includes(q) ||
          c.title_en.toLowerCase().includes(q),
      ),
    })).filter((c) => c.items.length > 0);
  }, [search]);

  const formatInr = (sar: number) => {
    if (sar === 0) return "Free";
    const inr = Math.round(sar * SAR_TO_INR);
    return `₹${inr}`;
  };

  return (
    <div className="space-y-4">
      {/* Header note */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-semibold text-foreground">
              Makkah & Madinah ke aam bazaar rates (Hajj 2026 estimate)
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Daam Saudi Riyal (SAR) mein hain. <strong>1 SAR ≈ ₹{SAR_TO_INR}</strong>.
              Haram ke 500m andar ki dukaanein 20–40% mehngi hoti hain. Hypermarkets jaise
              <strong> Bin Dawood, Panda, Lulu, Othaim </strong> sasti hain.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Item search karein... (e.g. banana, milk, mandi)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Categories */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            Koi item nahi mila. Doosra naam try karein.
          </CardContent>
        </Card>
      ) : (
        filtered.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card key={cat.key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className={`w-9 h-9 rounded-full ${cat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span>{isHindi ? cat.title_hi : cat.title_en}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {cat.items.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-9 px-3">Item</TableHead>
                      <TableHead className="h-9 px-2 text-right">SAR</TableHead>
                      <TableHead className="h-9 px-2 text-right">INR ≈</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cat.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="py-2 px-3">
                          <div className="text-sm font-medium leading-tight">
                            {isHindi ? item.name_hi : item.name_en}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.unit}</div>
                          {item.notes && (
                            <div className="text-xs text-primary mt-0.5">{item.notes}</div>
                          )}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-right text-sm font-semibold">
                          {item.priceSar === 0 ? "—" : `${item.priceSar}`}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-right text-sm text-muted-foreground">
                          {formatInr(item.priceSar)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Tips */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Paise bachane ke tips
          </div>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>Haram ke paas se nahi, 1 km door <strong>Bin Dawood / Panda / Lulu</strong> se kharidein.</li>
            <li>Pani ki bottle group mein 24-pack lein — per bottle SAR 0.50 hi padti hai.</li>
            <li>Restaurant mein mandi <strong>"nuss" (half)</strong> mangwayein — 2 logon ke liye kaafi hai.</li>
            <li>Indian dhabe (Hyderabadi/Bangalore) Saudi restaurants se sasta khana dete hain.</li>
            <li>Hotel ke buffet ki jagah local <em>matam</em> (canteen) try karein — 50% sasta.</li>
            <li>Zamzam aur kheema/khubz Haram ke andar bilkul muft milta hai.</li>
          </ul>
        </CardContent>
      </Card>

      <p className="text-[10px] text-muted-foreground text-center px-4">
        * Rates indicative hain aur dukaan/season ke hisaab se badal sakte hain. Currency rate bhi
        rozana change hota hai.
      </p>
    </div>
  );
}
