/**
 * IHPO (Indian Haj Pilgrim Officers) — Madinah Desk Directory for HAJ 2026.
 * All numbers are Saudi (KSA) — dial with +966 prefix.
 *
 * Source: Official IHPO Madinah desk roster shared for HAJ 2026.
 */

export interface IHPODesk {
  id: string;
  /** Department / desk name in English */
  department: string;
  /** Hindi/Urdu friendly label (optional) */
  departmentHi?: string;
  /** Local Saudi mobile number, no country code */
  mobile: string;
  /** Short situational tag — when to call this desk */
  whenToCall?: string;
}

export const IHPO_MADINAH_DESKS: IHPODesk[] = [
  {
    id: "ihpo-mad-shi",
    department: "SHI",
    departmentHi: "स्टेट हज इंस्पेक्टर",
    mobile: "567460891",
    whenToCall: "State-level coordination / SHI matters",
  },
  {
    id: "ihpo-mad-coordination",
    department: "Co-ordination",
    departmentHi: "को-ऑर्डिनेशन",
    mobile: "564277602",
    whenToCall: "General coordination & duty roster",
  },
  {
    id: "ihpo-mad-welfare",
    department: "Welfare",
    departmentHi: "वेलफेयर",
    mobile: "541897098",
    whenToCall: "Pilgrim welfare / general help",
  },
  {
    id: "ihpo-mad-arrival",
    department: "Arrival Desk",
    departmentHi: "अराइवल डेस्क",
    mobile: "543160438",
    whenToCall: "Flight landing / arrival issues",
  },
  {
    id: "ihpo-mad-airport",
    department: "Airport",
    departmentHi: "एयरपोर्ट",
    mobile: "541471626",
    whenToCall: "Airport / immigration support",
  },
  {
    id: "ihpo-mad-baggage-desk",
    department: "Misplaced Baggage — Desk",
    departmentHi: "गुम सामान — डेस्क",
    mobile: "543991342",
    whenToCall: "Report lost luggage at the desk",
  },
  {
    id: "ihpo-mad-baggage-field",
    department: "Misplaced Baggage — Field",
    departmentHi: "गुम सामान — फील्ड",
    mobile: "567519806",
    whenToCall: "On-ground baggage tracing team",
  },
  {
    id: "ihpo-mad-computer",
    department: "Computer Cell",
    departmentHi: "कंप्यूटर सेल",
    mobile: "542800316",
    whenToCall: "Documents / data / technical issues",
  },
  {
    id: "ihpo-mad-reception",
    department: "Reception",
    departmentHi: "रिसेप्शन",
    mobile: "567480631",
    whenToCall: "Front-desk / general queries",
  },
  {
    id: "ihpo-mad-dispensary",
    department: "Reception — Dispensary",
    departmentHi: "रिसेप्शन — डिस्पेंसरी",
    mobile: "546463143",
    whenToCall: "Health / medical assistance",
  },
];
