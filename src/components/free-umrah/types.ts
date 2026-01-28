// Shared form data type for Free Umrah application wizard
export interface FreeUmrahFormData {
  full_name: string;
  age: string;
  mobile: string;
  state: string;
  city: string;
  pincode: string;
  role: string;
  masjid_name: string;
  years_of_service: string;
  never_umrah: boolean;
  low_income: boolean;
  social_harmony: boolean;
  no_money_paid: boolean;
  proof_type: string;
}

export const initialFormData: FreeUmrahFormData = {
  full_name: "",
  age: "",
  mobile: "",
  state: "",
  city: "",
  pincode: "",
  role: "",
  masjid_name: "",
  years_of_service: "",
  never_umrah: false,
  low_income: false,
  social_harmony: false,
  no_money_paid: false,
  proof_type: "Masjid Certificate",
};
