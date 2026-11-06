import rawKnowledge from "./knowledge.json" with { type: "json" };

export type KnowledgeChunk = {
  id: string;
  source: string;
  title: string;
  text: string;
};

export type BuildingZoneRecord = {
  zone: string;
  zoneHi: string;
  zoneUr: string;
  landmark: string;
  landmarkHi: string;
  start: number;
  end: number;
  lat: number;
  lng: number;
};

export type HotelRecord = {
  code: number;
  name: string;
  madTashee: string;
  map: string | null;
};

export type KnowledgeBase = {
  version: number;
  excluded: string[];
  chunks: KnowledgeChunk[];
  zones: BuildingZoneRecord[];
  pins: Record<string, string>;
  pinNotes: Record<string, string>;
  busPoints: Record<string, string>;
  medicalByBuilding: Record<string, string>;
  hotels: HotelRecord[];
  emergency: string;
};

const knowledge = rawKnowledge as KnowledgeBase;

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "of", "to", "for", "and", "or", "in", "on", "my", "me",
  "what", "how", "please", "do", "does", "i", "we", "you", "your", "can", "could", "about",
  "tell", "hai", "hain", "ka", "ke", "ki", "kya", "mein", "aur", "se", "ko", "kaise",
  "batao", "bataye", "bataiye", "mujhe", "aap", "this", "that", "with", "from",
  "building", "buildings", "number", "nambar", "mera", "meri", "kahan", "kaha", "map",
]);

const HOTEL_NAME_STOP = new Set([
  "hotel", "hotels", "madinah", "madina", "building", "suites", "suite", "company", "al",
]);

const EMERGENCY_QUERY = /emergency|ambulance|police|hospital|clinic|embassy|ihpo|lost|missing|accident|crowd|sos|\b911\b|\b997\b|\b998\b|madad|ghabr|bimari|beemar|tabiyat|doctor|एम्बुलेंस|इमरजेंसी|मदद|हस्पताल|ایمرجنسی|ہسپتال|ایمبولینس/i;

const MAX_CHUNKS = 5;
const MAX_CHUNK_CHARS = 12000;

function tokensOf(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length >= 2 && !/^\d+$/.test(token) && !STOPWORDS.has(token));
}

function numbersOf(value: string): number[] {
  return [...value.matchAll(/\b(\d{1,4})\b/g)].map((match) => Number(match[1]));
}

function zoneMap(zone: BuildingZoneRecord): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${zone.lat},${zone.lng}&travelmode=walking`;
}

function buildingBlock(buildingNumber: number): string | null {
  const zone = knowledge.zones.find((item) => buildingNumber >= item.start && buildingNumber <= item.end);
  const key = String(buildingNumber);
  const pin = knowledge.pins[key];
  const bus = knowledge.busPoints[key];
  const medical = knowledge.medicalByBuilding[key];
  if (!zone && !pin && !bus && !medical) return null;

  const lines = [`Building ${buildingNumber}`];
  if (zone) {
    lines.push(`Zone: ${zone.zone}`);
    lines.push(`Zone Hindi: ${zone.zoneHi}`);
    lines.push(`Zone Urdu: ${zone.zoneUr}`);
    lines.push(`Landmark: ${zone.landmark} / ${zone.landmarkHi}`);
    lines.push(`Area walking map (zone centre, not a door pin): ${zoneMap(zone)}`);
  }
  if (pin) {
    const note = knowledge.pinNotes[key];
    lines.push(`Verified building map pin: ${pin}${note ? ` (${note})` : ""}`);
  } else {
    lines.push("No exact building pin is in the verified list. Do not invent one.");
  }
  if (bus) lines.push(`Bus point: ${bus}`);
  if (medical) lines.push(`Medical facility recorded for this building: ${medical}`);
  return lines.join("\n");
}

function hotelBlock(query: string, numbers: number[]): string {
  const wantsHotel = /hotel|madinah|madina|मदीना|مدینہ|tashee|tasreeh/i.test(query);
  const chosen: HotelRecord[] = [];
  const seen = new Set<number>();
  const add = (hotel: HotelRecord | undefined) => {
    if (!hotel || seen.has(hotel.code) || chosen.length >= 3) return;
    seen.add(hotel.code);
    chosen.push(hotel);
  };

  if (wantsHotel) {
    for (const number of numbers) add(knowledge.hotels.find((hotel) => hotel.code === number));
  }

  const queryLower = query.toLowerCase();
  for (const hotel of knowledge.hotels) {
    const nameTokens = hotel.name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4 && !HOTEL_NAME_STOP.has(token));
    const overlap = nameTokens.filter((token) => queryLower.includes(token));
    const longHit = overlap.some((token) => token.length >= 8);
    if (longHit || overlap.length >= 2) add(hotel);
  }

  if (!chosen.length) return "";
  return chosen.map((hotel) => {
    const map = hotel.map || "no verified pin — do not invent one";
    return `Madinah hotel code ${hotel.code}: ${hotel.name}. MOH tashee ${hotel.madTashee}. Map: ${map}`;
  }).join("\n");
}

function matchingChunks(queryTokens: string[]): KnowledgeChunk[] {
  const ranked = knowledge.chunks
    .map((chunk) => {
      const title = chunk.title.toLowerCase();
      const text = chunk.text.toLowerCase();
      let score = 0;
      for (const token of queryTokens) {
        if (title.includes(token)) score += 4;
        else if (text.includes(token)) score += 1;
      }
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.text.length - b.chunk.text.length);

  const selected: KnowledgeChunk[] = [];
  let used = 0;
  for (const item of ranked) {
    if (selected.length >= MAX_CHUNKS) break;
    if (used + item.chunk.text.length > MAX_CHUNK_CHARS && selected.length > 0) continue;
    selected.push(item.chunk);
    used += item.chunk.text.length;
  }
  return selected;
}

export function selectVerifiedContext(userQuery: string): string {
  const query = userQuery || "";
  const queryTokens = tokensOf(query);
  const numbers = numbersOf(query);
  const buildings = numbers
    .map(buildingBlock)
    .filter((block): block is string => Boolean(block))
    .slice(0, 3);
  const hotels = hotelBlock(query, numbers);
  const passages = matchingChunks(queryTokens);
  const includeEmergency = EMERGENCY_QUERY.test(query);

  const sections = [
    "HajCare support: info@hajjcare.in — https://hajjcare.in/contact-us. HajCare is a digital guide, not the Haj Committee and not a travel agency.",
    "Personal inspector rosters, doctor phone lists, and Mina camp staff phone numbers are not in this context. Direct those questions to the in-app directory or HajCare support.",
    buildings.length ? `MATCHED BUILDINGS\n${buildings.join("\n\n")}` : "",
    hotels ? `MATCHED MADINAH HOTELS\n${hotels}` : "",
    includeEmergency ? `EMERGENCY CONTACTS\n${knowledge.emergency}` : "",
    passages.length
      ? `VERIFIED PASSAGES\n${passages.map((chunk) => `### ${chunk.title} (${chunk.source})\n${chunk.text}`).join("\n\n")}`
      : "VERIFIED PASSAGES\nNo matching verified passage was found for this question.",
  ];

  return sections.filter(Boolean).join("\n\n");
}

export function knowledgeStats() {
  return {
    chunks: knowledge.chunks.length,
    zones: knowledge.zones.length,
    pins: Object.keys(knowledge.pins).length,
    hotels: knowledge.hotels.length,
  };
}
