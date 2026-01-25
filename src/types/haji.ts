export interface Haji {
  id: string;
  haji_id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  family_id: string;
  wheelchair: boolean;
  disease: string;
  blood_group: string;
  status: 'NORMAL' | 'EMERGENCY' | 'MISSING' | 'HOSPITAL';
  assigned_inspector_id?: string;
  created_at: string;
  updated_at: string;
}

export type HajiStatus = Haji['status'];

export const STATUS_COLORS: Record<HajiStatus, string> = {
  NORMAL: 'bg-emerald-500',
  EMERGENCY: 'bg-red-500',
  MISSING: 'bg-amber-500',
  HOSPITAL: 'bg-blue-500',
};

export const STATUS_LABELS: Record<HajiStatus, string> = {
  NORMAL: 'Normal',
  EMERGENCY: 'Emergency',
  MISSING: 'Missing',
  HOSPITAL: 'Hospital',
};
