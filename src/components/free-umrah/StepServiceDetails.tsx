import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FreeUmrahFormData } from "./types";

interface StepServiceDetailsProps {
  formData: FreeUmrahFormData;
  setFormData: (data: FreeUmrahFormData) => void;
  errors: Record<string, string>;
  t: {
    role: string;
    masjidName: string;
    masjidRegistrationNumber: string;
    yearsOfService: string;
  };
}

export function StepServiceDetails({ formData, setFormData, errors, t }: StepServiceDetailsProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-2">
        <Label className="text-base">{t.role} *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder={t.role} />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="Imam">Imam</SelectItem>
            <SelectItem value="Muazzin">Muazzin</SelectItem>
            <SelectItem value="Hafiz">Hafiz</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="masjid_name" className="text-base">{t.masjidName} *</Label>
        <Input
          id="masjid_name"
          value={formData.masjid_name}
          onChange={(e) => setFormData({ ...formData, masjid_name: e.target.value })}
          placeholder="Enter masjid name"
          className="h-12 text-base"
        />
        {errors.masjid_name && <p className="text-sm text-destructive">{errors.masjid_name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="masjid_registration_number" className="text-base">{t.masjidRegistrationNumber} *</Label>
        <Input
          id="masjid_registration_number"
          value={formData.masjid_registration_number}
          onChange={(e) => setFormData({ ...formData, masjid_registration_number: e.target.value })}
          placeholder="Enter masjid registration number"
          className="h-12 text-base"
        />
        {errors.masjid_registration_number && <p className="text-sm text-destructive">{errors.masjid_registration_number}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="years_of_service" className="text-base">{t.yearsOfService} *</Label>
        <Input
          id="years_of_service"
          type="number"
          min="0"
          value={formData.years_of_service}
          onChange={(e) => setFormData({ ...formData, years_of_service: e.target.value })}
          placeholder="Years of service"
          className="h-12 text-base"
        />
        {errors.years_of_service && <p className="text-sm text-destructive">{errors.years_of_service}</p>}
      </div>
    </div>
  );
}
