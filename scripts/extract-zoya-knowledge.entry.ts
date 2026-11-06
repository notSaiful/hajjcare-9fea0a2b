/**
 * Flatten HajCare's verified src/data notes into the JSON Zoya is allowed to quote.
 * Personal rosters (inspectors, medical staff, maktab staff phones) are left out
 * so those numbers are not sent to the model.
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { PRE_HAJJ_FAQ } from "../src/data/preHajjFaqContent";
import { MANASIK_RITUALS } from "../src/data/manasikContent";
import { UMRAH_RITUALS } from "../src/data/umrahContent";
import { MAKKAH_GUIDE_TOPICS } from "../src/data/makkahGuideContent";
import { MADINAH_GUIDE_TOPICS } from "../src/data/madinahGuideContent";
import { PRE_HAJJ_SECTIONS } from "../src/data/preHajjIndiaContent";
import { RULES_SECTIONS } from "../src/data/saudiRulesContent";
import { govtServices } from "../src/data/govtServicesContent";
import { topicSummaries } from "../src/data/hajjTrainingContent";
import { postHajjSections, dailyPrompts } from "../src/data/postHajjContent";
import { PHASE_GUIDANCE, FAILSAFE_GUIDANCE, getElderlyModification } from "../src/data/guidanceContent";
import { STATUS_CONTENT, CALMING_MESSAGE } from "../src/data/familyDashboardContent";
import { freeUmrahContent } from "../src/data/freeUmrahContent";
import { HAJJ_STAGES, STAGE_LABELS } from "../src/data/hajjStagesContent";
import { makkahBuildingZones } from "../src/data/hajjBuildingZones";
import { hajjBuildings, emergencyContacts } from "../src/data/hajjBuildingsData";
import { hajjBusPoints } from "../src/data/hajjBusPoints";
import { makkahBuildingMapLinks, makkahRubaths } from "../src/data/makkahBuildingMapLinks";
import { madinahHotels } from "../src/data/madinahHotels";
import { MEDICAL_EMERGENCY_NUMBERS, MEDICAL_FACILITIES } from "../src/data/medicalFacilitiesContent";
import { IHPO_MAKKAH_DESKS } from "../src/data/ihpoMakkahDesks";
import { IHPO_MADINAH_DESKS } from "../src/data/ihpoMadinahDesks";
import { MINA_MAKTABS, MINA_FULL_MAP_URL } from "../src/data/minaTentLocations";
import { sukoonRdContent } from "../src/data/sukoonRdContent";

type Chunk = { id: string; source: string; title: string; text: string };

const chunks: Chunk[] = [];

function asText(value: unknown, includeAr = false): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => asText(item, includeAr)).filter(Boolean).join("\n");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const langs = includeAr ? ["ar", "en", "hi", "ur"] : ["en", "hi", "ur"];
    const hasLang = langs.some((lang) => typeof record[lang] === "string");
    if (hasLang) {
      return langs
        .map((lang) => {
          const text = record[lang];
          return typeof text === "string" && text.trim() ? `[${lang}] ${text.trim()}` : "";
        })
        .filter(Boolean)
        .join("\n");
    }
    const hasLangList = langs.some((lang) => Array.isArray(record[lang]));
    if (hasLangList) {
      return langs
        .map((lang) => {
          const list = record[lang];
          if (!Array.isArray(list) || !list.length) return "";
          return `[${lang}]\n- ${list.map((item) => asText(item, includeAr)).filter(Boolean).join("\n- ")}`;
        })
        .filter(Boolean)
        .join("\n");
    }
  }
  return "";
}

function addChunk(source: string, title: string, parts: Array<string | undefined | null>) {
  const text = parts.map((part) => (part || "").trim()).filter(Boolean).join("\n\n").trim();
  if (!text) return;
  const safeTitle = title.replace(/\s+/g, " ").trim().slice(0, 180) || source;
  chunks.push({
    id: `${source}-${chunks.length + 1}`,
    source,
    title: safeTitle,
    text,
  });
}

function formatSteps(steps: Array<{ step?: number; text: unknown }> | undefined, includeAr = false): string {
  if (!steps?.length) return "";
  return steps
    .map((step, index) => {
      const body = asText(step.text, includeAr);
      return body ? `${step.step ?? index + 1}. ${body}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function formatRitual(source: string, ritual: {
  id: string;
  title: Record<string, string>;
  description?: unknown;
  whatItIs?: unknown;
  steps?: Array<{ step?: number; text: unknown }>;
  mistakes?: Array<{ text: unknown }>;
  duaGuidance?: unknown;
  safetyTips?: Array<{ text: unknown }>;
  hadith?: { text: unknown; source?: string };
  importantRulings?: Array<{ text: unknown }>;
}) {
  addChunk(source, asText(ritual.title).split("\n")[0]?.replace(/^\[en\] /, "") || ritual.id, [
    `Id: ${ritual.id}`,
    asText(ritual.title, true),
    asText(ritual.description),
    asText(ritual.whatItIs),
    formatSteps(ritual.steps) ? `Steps:\n${formatSteps(ritual.steps)}` : "",
    ritual.mistakes?.length ? `Mistakes to avoid:\n${ritual.mistakes.map((item) => asText(item.text)).filter(Boolean).join("\n")}` : "",
    asText(ritual.duaGuidance, true) ? `Dua guidance (quote only this wording):\n${asText(ritual.duaGuidance, true)}` : "",
    ritual.safetyTips?.length ? `Safety:\n${ritual.safetyTips.map((item) => asText(item.text)).filter(Boolean).join("\n")}` : "",
    ritual.hadith ? `Hadith (quote only this wording) — ${ritual.hadith.source || "source in text"}:\n${asText(ritual.hadith.text, true)}` : "",
    ritual.importantRulings?.length ? `Rulings:\n${ritual.importantRulings.map((item) => asText(item.text)).filter(Boolean).join("\n")}` : "",
  ]);
}

for (const item of PRE_HAJJ_FAQ) {
  addChunk("pre-hajj-faq", asText(item.question).split("\n")[0]?.replace(/^\[en\] /, "") || "FAQ", [
    `Question:\n${asText(item.question, true)}`,
    `Answer:\n${asText(item.answer, true)}`,
  ]);
}

for (const ritual of MANASIK_RITUALS) formatRitual("manasik", ritual);
for (const ritual of UMRAH_RITUALS) formatRitual("umrah", ritual);
for (const topic of MAKKAH_GUIDE_TOPICS) formatRitual("makkah-guide", topic);
for (const topic of MADINAH_GUIDE_TOPICS) formatRitual("madinah-guide", topic);

for (const section of PRE_HAJJ_SECTIONS) {
  addChunk("pre-hajj-india", section.title.en || section.id, [
    asText(section.title, true),
    asText(section.description),
    section.content.map((item) => `${asText(item.title)}\n${asText(item.details)}`).join("\n\n"),
  ]);
}

for (const section of RULES_SECTIONS) {
  addChunk("saudi-rules", section.title.en || section.id, [
    asText(section.title, true),
    asText(section.description),
    section.rules.map((rule) => asText(rule.text, true)).filter(Boolean).join("\n"),
  ]);
}

for (const service of govtServices) {
  const contacts: string[] = [];
  if (service.contactInfo?.helpline) {
    contacts.push(`Helpline ${service.contactInfo.helpline}${service.contactInfo.email ? `, email ${service.contactInfo.email}` : ""}`);
  }
  for (const extra of service.contactInfo?.additionalNumbers || []) {
    contacts.push(`${asText(extra.label)}: ${extra.number}`);
  }
  for (const link of service.mapLinks || []) {
    contacts.push(`${asText(link.name)} — ${asText(link.address)}${link.phone ? `, phone ${link.phone}` : ""}. Map: ${link.mapUrl}`);
  }
  addChunk("govt-services", service.title.en || service.id, [
    asText(service.title, true),
    asText(service.description),
    asText(service.eligibility) ? `Eligibility:\n${asText(service.eligibility)}` : "",
    service.howToAccess?.length ? `How to access:\n${service.howToAccess.map((step) => asText(step)).join("\n")}` : "",
    service.locations?.length ? `Locations:\n${service.locations.map((place) => asText(place)).join("\n")}` : "",
    service.importantNotes?.length ? `Notes:\n${service.importantNotes.map((note) => asText(note)).join("\n")}` : "",
    contacts.length ? `Contacts:\n${contacts.join("\n")}` : "",
  ]);
}

for (const [topicId, summary] of Object.entries(topicSummaries)) {
  const duaLines = (["en", "hi", "ur"] as const).map((lang) => {
    const dua = summary.keyDua[lang];
    if (!dua) return "";
    return `[${lang}] ${dua.arabic}${dua.translit ? ` (${dua.translit})` : ""} — ${dua.meaning}`;
  }).filter(Boolean);
  addChunk("hajj-training", `Training: ${topicId}`, [
    `Topic: ${topicId}`,
    (["en", "hi", "ur"] as const).map((lang) => summary.bullets[lang]?.length ? `[${lang}]\n- ${summary.bullets[lang].join("\n- ")}` : "").filter(Boolean).join("\n\n"),
    duaLines.length ? `Key dua (quote only this wording):\n${duaLines.join("\n")}` : "",
  ]);
}

for (const section of postHajjSections) {
  addChunk("post-hajj", section.title.en || section.id, [
    asText(section.title, true),
    asText(section.description),
  ]);
}

for (const prompt of dailyPrompts) {
  addChunk("post-hajj-dua", `Post-Hajj day ${prompt.day}: ${prompt.title.en || ""}`.trim(), [
    `Day ${prompt.day}`,
    asText(prompt.title, true),
    asText(prompt.reflection),
    prompt.dua ? `Dua (quote only this wording):\n${asText(prompt.dua, true)}` : "",
    prompt.duaTranslation ? `Dua translation:\n${asText(prompt.duaTranslation, true)}` : "",
    asText(prompt.action),
    prompt.hadith ? `Hadith (quote only this wording):\n${asText(prompt.hadith, true)}` : "",
  ]);
}

for (const [phase, zones] of Object.entries(PHASE_GUIDANCE)) {
  const lines: string[] = [];
  for (const [zone, message] of Object.entries(zones)) {
    if (message === FAILSAFE_GUIDANCE) continue;
    lines.push([
      `${zone} — ${message.status}`,
      asText(message.instruction),
      asText(message.safety) ? `Safety: ${asText(message.safety)}` : "",
    ].filter(Boolean).join("\n"));
  }
  if (lines.length) addChunk("on-ground-guidance", `On-ground guidance: ${phase}`, lines);
}

addChunk("on-ground-guidance", "Failsafe guidance", [
  asText(FAILSAFE_GUIDANCE.instruction),
  asText(FAILSAFE_GUIDANCE.safety),
  `Elderly: [en] ${getElderlyModification("en")}\n[hi] ${getElderlyModification("hi")}\n[ur] ${getElderlyModification("ur")}`,
]);

addChunk("family-dashboard", "Family dashboard status labels", [
  (["en", "hi", "ur"] as const).map((lang) => {
    const pack = STATUS_CONTENT[lang];
    if (!pack) return "";
    return [`[${lang}]`, ...Object.entries(pack).map(([status, display]) => `${status}: ${display.label} — ${display.description}`)].join("\n");
  }).filter(Boolean).join("\n\n"),
  asText(CALMING_MESSAGE) ? `Calming message:\n${(["en", "hi", "ur"] as const).map((lang) => CALMING_MESSAGE[lang] ? `[${lang}] ${CALMING_MESSAGE[lang].main} ${CALMING_MESSAGE[lang].secondary}` : "").filter(Boolean).join("\n")}` : "",
]);

addChunk("hajj-stages", "Hajj stage names", [
  HAJJ_STAGES.map((stage) => {
    const en = STAGE_LABELS.en[stage.id] || stage.id;
    const hi = STAGE_LABELS.hi?.[stage.id] || "";
    const ur = STAGE_LABELS.ur?.[stage.id] || "";
    return `${stage.order}. ${stage.id}: [en] ${en}${hi ? ` | [hi] ${hi}` : ""}${ur ? ` | [ur] ${ur}` : ""}`;
  }).join("\n"),
]);

const freeUmrahKeys = ["title", "subtitle", "declarations", "neverUmrah", "lowIncome", "socialHarmony", "noMoneyPaid", "requiredDocuments", "masjidCertificate", "passportPhoto"] as const;
addChunk("free-umrah", "Free Umrah pilot application", [
  freeUmrahKeys.map((key) => {
    const lines = (["en", "hi", "ur"] as const).map((lang) => {
      const text = freeUmrahContent[lang]?.[key];
      return text ? `[${lang}] ${text}` : "";
    }).filter(Boolean);
    return lines.length ? `${key}:\n${lines.join("\n")}` : "";
  }).filter(Boolean).join("\n\n"),
]);

function flattenSukoon(value: unknown, trail: string[] = []): void {
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const title = asText(record.title);
  const body = [
    asText(record.subtitle),
    asText(record.description),
    asText(record.points),
    asText(record.items),
  ].filter(Boolean);
  if (title && body.length) {
    addChunk("sukoon-rd", title.split("\n")[0].replace(/^\[en\] /, ""), [asText(record.title), ...body]);
  }
  for (const [key, child] of Object.entries(record)) {
    if (key === "title" || key === "subtitle" || key === "points" || key === "items") continue;
    if (child && typeof child === "object") flattenSukoon(child, [...trail, key]);
  }
}
flattenSukoon(sukoonRdContent);

const zones = makkahBuildingZones.map((zone) => ({
  zone: zone.zoneName,
  zoneHi: zone.zoneNameHi,
  zoneUr: zone.zoneNameUr,
  landmark: zone.landmark,
  landmarkHi: zone.landmarkHi,
  start: zone.buildingStart,
  end: zone.buildingEnd,
  lat: zone.lat,
  lng: zone.lng,
}));

for (const zone of zones) {
  addChunk("building-zones", `${zone.zone} (buildings ${zone.start}-${zone.end})`, [
    `Buildings ${zone.start} to ${zone.end}`,
    `[en] ${zone.zone}`,
    `[hi] ${zone.zoneHi}`,
    `[ur] ${zone.zoneUr}`,
    `Landmark: ${zone.landmark} / ${zone.landmarkHi}`,
    `Area walking map (zone centre, not an individual door pin): https://www.google.com/maps/dir/?api=1&destination=${zone.lat},${zone.lng}&travelmode=walking`,
  ]);
}

for (const building of hajjBuildings) {
  addChunk("hajj-buildings", building.name, [
    `${building.name} (${building.city}, ${building.area})`,
    asText(building.description),
    building.phone ? `Phone: ${building.phone}` : "",
    `Map centre: https://www.google.com/maps/dir/?api=1&destination=${building.lat},${building.lng}&travelmode=walking`,
  ]);
}

for (const rubath of makkahRubaths) {
  addChunk("makkah-rubath", rubath.name, [
    `[en] ${rubath.name}`,
    `[hi] ${rubath.nameHi}`,
    `[ur] ${rubath.nameUr}`,
    `[ar] ${rubath.nameAr}`,
    `Map: ${rubath.url}`,
  ]);
}

const pins: Record<string, string> = {};
const pinNotes: Record<string, string> = {};
for (const link of makkahBuildingMapLinks) {
  const key = String(link.building);
  if (link.variant === "alt") {
    if (!pins[key]) {
      pins[key] = link.url;
      pinNotes[key] = "Updated (i) pin from the Haj 2026 building list";
    } else {
      pinNotes[key] = `Updated (i) pin also listed: ${link.url}`;
    }
  } else if (!pins[key] || pinNotes[key]?.startsWith("Updated (i) pin from")) {
    pins[key] = link.url;
    if (pinNotes[key]?.startsWith("Updated (i) pin from")) delete pinNotes[key];
  }
}

const busPoints: Record<string, string> = {};
for (const entry of hajjBusPoints) {
  const line = `${entry.busPoint}, ${entry.branchNumber} (${entry.branchName})${entry.isUpdated ? " [later update]" : ""}`;
  for (const building of entry.buildings) {
    const key = String(building);
    busPoints[key] = busPoints[key] ? `${busPoints[key]}; ${line}` : line;
  }
}

const medicalByBuilding: Record<string, string> = {};
const medicalGroups = new Map<string, string[]>();
for (const facility of MEDICAL_FACILITIES) {
  const line = [
    facility.description,
    facility.area,
    facility.building ? `building ${facility.building}` : "",
    facility.phone ? `phone ${facility.phone}` : "",
    `map ${facility.mapUrl}`,
  ].filter(Boolean).join(", ");
  const group = medicalGroups.get(facility.category) || [];
  group.push(line);
  medicalGroups.set(facility.category, group);
  if (facility.building && /^\d+$/.test(facility.building)) {
    medicalByBuilding[String(parseInt(facility.building, 10))] = line;
  }
}
for (const [category, lines] of medicalGroups) {
  addChunk("medical-facilities", `Makkah medical facilities (${category})`, [
    `IHPO medical emergency numbers: ${MEDICAL_EMERGENCY_NUMBERS.join(", ")}`,
    lines.join("\n"),
  ]);
}

for (const maktab of MINA_MAKTABS) {
  addChunk("mina-maktab", `Mina maktab ${maktab.maktab}`, [
    `Maktab ${maktab.maktab}`,
    maktab.description,
    `Camp street: ${maktab.campStreet}`,
    `Transport: ${maktab.transportation}`,
    `Mina area map: ${MINA_FULL_MAP_URL}`,
    "Staff names and personal phone numbers are not included in Zoya's context.",
  ]);
}

const hotels = madinahHotels.map((hotel) => ({
  code: hotel.code,
  name: hotel.name,
  madTashee: hotel.madTashee,
  map: hotel.mapLink,
}));

for (let index = 0; index < hotels.length; index += 20) {
  const slice = hotels.slice(index, index + 20);
  addChunk("madinah-hotels", `Madinah hotels codes ${slice[0].code}-${slice[slice.length - 1].code}`, [
    slice.map((hotel) => `Code ${hotel.code} (${hotel.name}), MOH tashee ${hotel.madTashee}. Map: ${hotel.map || "no verified pin — do not invent one"}`).join("\n"),
  ]);
}

function deskLine(desk: { department: string; departmentHi?: string; mobile: string; whenToCall?: string }): string {
  const mobile = desk.mobile.replace(/\D/g, "");
  return `${desk.department}${desk.departmentHi ? ` / ${desk.departmentHi}` : ""}: +966${mobile}${desk.whenToCall ? ` — ${desk.whenToCall}` : ""}`;
}

const rule911 = RULES_SECTIONS.flatMap((section) => section.rules.map((rule) => asText(rule.text, true))).find((text) => text.includes("911") && text.includes("997")) || "";

const emergency = [
  "Use only these contacts. Do not invent or correct any number.",
  rule911,
  `IHPO Makkah medical emergency numbers: ${MEDICAL_EMERGENCY_NUMBERS.join(", ")}`,
  `Makkah office main ${emergencyContacts.makkah.mainOffice}, Makkah medical ${emergencyContacts.makkah.medical}, emergency ${emergencyContacts.makkah.emergency}, Indian Embassy ${emergencyContacts.makkah.indianEmbassy}`,
  `Madinah office main ${emergencyContacts.madinah.mainOffice}, Madinah medical ${emergencyContacts.madinah.medical}, emergency ${emergencyContacts.madinah.emergency}, Indian Embassy ${emergencyContacts.madinah.indianEmbassy}`,
  "IHPO Makkah desks (dial +966 before the mobile):",
  ...IHPO_MAKKAH_DESKS.map(deskLine),
  "IHPO Madinah desks (dial +966 before the mobile):",
  ...IHPO_MADINAH_DESKS.map(deskLine),
  "HajCare support email: info@hajjcare.in (https://hajjcare.in/contact-us). HajCare is a digital guide, not the Haj Committee and not a travel agency.",
].filter(Boolean).join("\n");

const knowledge = {
  version: 1,
  excluded: [
    "hajInspectorsData personal roster",
    "medicalStaffContent personal phones",
    "maktabInspectorAllotment personal phones",
    "mina maktab staff names and personal phones",
  ],
  chunks,
  zones,
  pins,
  pinNotes,
  busPoints,
  medicalByBuilding,
  hotels,
  emergency,
};

export async function writeKnowledge(destination: string) {
  if (chunks.length < 40) throw new Error(`Knowledge corpus too small: ${chunks.length} chunks`);
  if (!zones.length) throw new Error("No building zones");
  if (!emergency.includes("911") || !emergency.includes("info@hajjcare.in")) {
    throw new Error("Emergency card is missing verified contacts");
  }
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, JSON.stringify(knowledge));
  console.log(`Wrote ${chunks.length} chunks, ${zones.length} zones, ${Object.keys(pins).length} pins, ${hotels.length} hotels to ${destination}`);
}
