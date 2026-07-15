// VAPI assistant "tool-call" webhook bridge.
//
// The VAPI assistant (GPT-4o) handles the conversation, STT (Deepgram) and the
// Rumik custom-voice TTS leg. For deterministic facts that must NEVER be
// hallucinated — building/zone lookup with the exact Google Maps walking link —
// the assistant calls a tool; VAPI POSTs the tool-call here, we return the
// result, and the assistant speaks it back.
//
// VAPI POSTs: { message: { type: "tool-call", toolCallId, name, parameters, call, assistant, customer } }
// We respond with: { result: <string> }  (VAPI passes `result` back to the model).
//
// Auth: shared secret. VAPI sends it as the `x-vapi-secret` header (set in the
// assistant's server config). If VAPI_TOOL_SECRET is unset, the header is not
// checked (dev only — set it in production).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-vapi-secret",
};

// Indian Hajj Pilgrims — Makkah 2026 building-zone database.
// Source of truth (kept in sync with supabase/functions/hajj-chat/index.ts).
const BUILDING_ZONES = [
  { zone: "Old Aziziya (MB, BH, AK)", range: "101-499", lat: 21.3991, lng: 39.8375, landmark: "Old Aziziya area" },
  { zone: "Main Road Aziziyah", range: "501-530", lat: 21.4015, lng: 39.835, landmark: "Main Road Aziziyah" },
  { zone: "Qatari Masjid", range: "601-625", lat: 21.403, lng: 39.834, landmark: "near Qatari Masjid" },
  { zone: "Near Haram Sharif (Ajyad Sad)", range: "701-720", lat: 21.4195, lng: 39.8265, landmark: "walking distance from Haram" },
  { zone: "King Abdullah Kubri → Jamarat Road", range: "801-830", lat: 21.4135, lng: 39.873, landmark: "Mina Road" },
  { zone: "Near Jamarat Bus Station", range: "901-920", lat: 21.417, lng: 39.87, landmark: "Jamarat Bus Station" },
  { zone: "Al Khansa / Al Jumaysa", range: "1001-1040", lat: 21.426, lng: 39.8255, landmark: "Masjid Jinn Road" },
  { zone: "Mahbas Al Jinn", range: "1101-1130", lat: 21.424, lng: 39.8275, landmark: "Ajyad Road" },
  { zone: "Rusefa – Ibrahim Khalil Road", range: "1201-1215", lat: 21.415, lng: 39.823, landmark: "Ibrahim Khalil Road" },
  { zone: "Kudai Parking", range: "1301-1315", lat: 21.405, lng: 39.82, landmark: "Kudai Parking" },
  { zone: "Batha Quresh", range: "1401-1415", lat: 21.41, lng: 39.818, landmark: "Batha Quresh" },
  { zone: "Jarwal Jed. Makkah Road", range: "1501-1515", lat: 21.392, lng: 39.81, landmark: "Jarwal, Jeddah-Makkah Road" },
  { zone: "Al Diyafah", range: "1601-1615", lat: 21.395, lng: 39.815, landmark: "Al Diyafah" },
  { zone: "Rusefah", range: "1701-1715", lat: 21.416, lng: 39.821, landmark: "Rusefah" },
  { zone: "Al Naseem", range: "1801-1880", lat: 21.388, lng: 39.832, landmark: "Al Naseem" },
];

function findBuildingZone(num: number) {
  return BUILDING_ZONES.find((z) => {
    const [start, end] = z.range.split("-").map(Number);
    return num >= start && num <= end;
  });
}

function googleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

/** `lookupBuilding` tool: deterministic zone + Maps link for a building number. */
function lookupBuilding(parameters: Record<string, unknown>): string {
  const raw = parameters.buildingNumber ?? parameters.number ?? parameters.building;
  const num = Number(String(raw).replace(/\D/g, ""));
  if (!Number.isFinite(num) || num <= 0) {
    return "Building number not recognised. Ask the pilgrim for the 3- or 4-digit building number shown on their card.";
  }
  const zone = findBuildingZone(num);
  if (!zone) {
    return `Building ${num} is not in the Indian Hajj Pilgrim Makkah 2026 database. Ask the pilgrim to confirm the number, or to contact their Group Leader or the Haj Committee.`;
  }
  const [start, end] = zone.range.split("-").map(Number);
  const link = googleMapsLink(zone.lat, zone.lng);
  return [
    `Building ${num} is in zone: ${zone.zone} (building range ${start}-${end}, landmark: ${zone.landmark}).`,
    `Google Maps walking directions: ${link}`,
    `Tell the pilgrim to tap the link for turn-by-turn walking navigation. Keep it short.`,
  ].join(" ");
}

const TOOLS: Record<string, (params: Record<string, unknown>) => string> = {
  lookupBuilding,
};

interface ToolCallMessage {
  type?: string;
  toolCallId?: string;
  name?: string;
  parameters?: Record<string, unknown>;
}
interface ToolCallBody {
  message?: ToolCallMessage;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const secret = Deno.env.get("VAPI_TOOL_SECRET");
  if (secret && req.headers.get("x-vapi-secret") !== secret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: ToolCallBody;
  try {
    body = (await req.json()) as ToolCallBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const msg = body.message;
  if (!msg || msg.type !== "tool-call" || !msg.name) {
    // VAPI also sends status-update / end-of-call etc. to the same server URL;
    // acknowledge non-tool-call messages with 200 so VAPI doesn't retry.
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const handler = TOOLS[msg.name];
  if (!handler) {
    return new Response(
      JSON.stringify({
        result: `Tool "${msg.name}" is not implemented. Tell the pilgrim you'll connect them to support.`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const result = handler(msg.parameters || {});
    // VAPI tool-call webhook: return { result } — the model receives it as the
    // tool output and speaks it back. (toolCallId echoed for traceability.)
    return new Response(
      JSON.stringify({ result, toolCallId: msg.toolCallId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("vapi-tool-calls error:", err);
    return new Response(
      JSON.stringify({ result: "Sorry, I couldn't look that up right now. Please try again." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});