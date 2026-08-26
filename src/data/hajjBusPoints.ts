// Bus point / branch mapping for Indian Hajj 2026 pilgrims (Azizia area)
// "(U)" marker = building was assigned to this bus point as a LATER UPDATE
// (originally not in the list, added later). Bus service & branch remain the same.

export interface BusPointEntry {
  busPoint: string;       // e.g. "5-A", "5-C"
  branchNumber: string;   // e.g. "Branch 5"
  branchName: string;     // e.g. "Azizia BH"
  buildings: number[];    // building numbers served by this bus point
  isUpdated: boolean;     // true => "(U)" – late addition
}

export const hajjBusPoints: BusPointEntry[] = [
  // --- Branch 1 ---
  { busPoint: "1-A", branchNumber: "Branch 1", branchName: "Old Azizia (MB)", buildings: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110], isUpdated: false },
  { busPoint: "1-B (U)", branchNumber: "Branch 1", branchName: "Old Azizia (MB)", buildings: [111, 112, 113], isUpdated: true },

  // --- Branch 2 ---
  { busPoint: "2", branchNumber: "Branch 2", branchName: "Old Azizia (BH)", buildings: [120, 121, 122, 123, 124, 125, 126, 127, 128], isUpdated: false },

  // --- Branch 3 ---
  { busPoint: "3", branchNumber: "Branch 3", branchName: "Old Azizia (AK)", buildings: [130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140], isUpdated: false },

  // --- Branch 4 ---
  { busPoint: "4-B", branchNumber: "Branch 4", branchName: "Main Road Azizia", buildings: [150, 151, 152, 153, 154, 155, 156, 157, 158], isUpdated: false },
  { busPoint: "4-C (U)", branchNumber: "Branch 4", branchName: "Main Road Azizia", buildings: [159, 160, 161], isUpdated: true },

  // --- Branch 5 (Azizia BH) ---
  { busPoint: "5-A", branchNumber: "Branch 5", branchName: "Azizia BH", buildings: [201, 202, 203, 204, 205, 206, 207, 208, 209], isUpdated: false },
  { busPoint: "5-B", branchNumber: "Branch 5", branchName: "Azizia BH", buildings: [210, 211, 212, 213, 214, 215], isUpdated: false },
  { busPoint: "5-C (U)", branchNumber: "Branch 5", branchName: "Azizia BH", buildings: [216, 217, 305], isUpdated: true },

  // --- Branch 6 (Qatari Masjid) ---
  { busPoint: "6", branchNumber: "Branch 6", branchName: "Qatari Masjid", buildings: [601, 602, 603, 604, 605, 606, 607, 608, 609, 610], isUpdated: false },

  // --- Branch 7 (Near Haram / Ajyad) ---
  { busPoint: "7", branchNumber: "Branch 7", branchName: "Ajyad Sad (Near Haram)", buildings: [701, 702, 703, 704, 705, 706, 707, 708, 709, 710], isUpdated: false },

  // --- Branch 8 (Mina Road / King Abdullah Kubri) ---
  { busPoint: "8", branchNumber: "Branch 8", branchName: "Mina Road (King Abdullah Kubri)", buildings: [801, 802, 803, 804, 805, 806, 807, 808, 809, 810], isUpdated: false },

  // --- Branch 9 (Rea-Zakhir) ---
  { busPoint: "9", branchNumber: "Branch 9", branchName: "Rea-Zakhir", buildings: [901, 902, 903], isUpdated: false },
  { busPoint: "9-A (U)", branchNumber: "Branch 9", branchName: "Rea-Zakhir", buildings: [904, 905, 906], isUpdated: true },
];

export interface BusPointMatch {
  entry: BusPointEntry;
  building: number;
}

export function findBusPointsForBuilding(buildingNumber: number): BusPointMatch[] {
  return hajjBusPoints
    .filter((e) => e.buildings.includes(buildingNumber))
    .map((entry) => ({ entry, building: buildingNumber }));
}
