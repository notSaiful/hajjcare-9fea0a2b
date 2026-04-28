/**
 * IHPO (Indian Haj Pilgrim Officers) — Makkah Desk Directory for HAJ 2026.
 *
 * NOTE: Official Makkah desk numbers are pending. Entries below mirror the
 * Madinah desk structure with empty `mobile` values — the panel will show
 * "Number pending" and disable Call/WhatsApp until numbers are filled in.
 * Replace the empty strings with the official Saudi mobile numbers (no
 * country code) when received.
 */

import type { IHPODesk } from "@/data/ihpoMadinahDesks";

export const IHPO_MAKKAH_DESKS: IHPODesk[] = [
  {
    id: "ihpo-mak-shi",
    department: "SHI",
    departmentHi: "स्टेट हज इंस्पेक्टर",
    mobile: "",
    whenToCall: "State-level coordination / SHI matters",
  },
  {
    id: "ihpo-mak-coordination",
    department: "Co-ordination",
    departmentHi: "को-ऑर्डिनेशन",
    mobile: "",
    whenToCall: "General coordination & duty roster",
  },
  {
    id: "ihpo-mak-welfare",
    department: "Welfare",
    departmentHi: "वेलफेयर",
    mobile: "",
    whenToCall: "Pilgrim welfare / general help",
  },
  {
    id: "ihpo-mak-arrival",
    department: "Arrival Desk",
    departmentHi: "अराइवल डेस्क",
    mobile: "",
    whenToCall: "Flight landing / arrival issues (Jeddah)",
  },
  {
    id: "ihpo-mak-airport",
    department: "Airport (Jeddah)",
    departmentHi: "एयरपोर्ट (जेद्दा)",
    mobile: "",
    whenToCall: "Airport / immigration support",
  },
  {
    id: "ihpo-mak-baggage-desk",
    department: "Misplaced Baggage — Desk",
    departmentHi: "गुम सामान — डेस्क",
    mobile: "",
    whenToCall: "Report lost luggage at the desk",
  },
  {
    id: "ihpo-mak-baggage-field",
    department: "Misplaced Baggage — Field",
    departmentHi: "गुम सामान — फील्ड",
    mobile: "",
    whenToCall: "On-ground baggage tracing team",
  },
  {
    id: "ihpo-mak-computer",
    department: "Computer Cell",
    departmentHi: "कंप्यूटर सेल",
    mobile: "",
    whenToCall: "Documents / data / technical issues",
  },
  {
    id: "ihpo-mak-reception",
    department: "Reception",
    departmentHi: "रिसेप्शन",
    mobile: "",
    whenToCall: "Front-desk / general queries",
  },
  {
    id: "ihpo-mak-dispensary",
    department: "Reception — Dispensary",
    departmentHi: "रिसेप्शन — डिस्पेंसरी",
    mobile: "",
    whenToCall: "Health / medical assistance",
  },
];
