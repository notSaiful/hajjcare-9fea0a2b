import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StateSelector } from "@/components/StateSelector";
import { FreeUmrahFormData } from "./types";

interface StepLocationProps {
  formData: FreeUmrahFormData;
  setFormData: (data: FreeUmrahFormData) => void;
  errors: Record<string, string>;
  t: {
    state: string;
    city: string;
    pincode: string;
  };
}

export function StepLocation({ formData, setFormData, errors, t }: StepLocationProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-2">
        <Label className="text-base">{t.state} *</Label>
        <StateSelector
          value={formData.state}
          onValueChange={(value) => setFormData({ ...formData, state: value })}
          placeholder={t.state}
          className="h-12"
        />
        {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className="text-base">{t.city} *</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Enter your city"
          className="h-12 text-base"
        />
        {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pincode" className="text-base">{t.pincode} *</Label>
        <Input
          id="pincode"
          value={formData.pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setFormData({ ...formData, pincode: value });
          }}
          maxLength={6}
          inputMode="numeric"
          placeholder="6-digit pincode"
          className="h-12 text-base"
        />
        {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
      </div>
    </div>
  );
}
