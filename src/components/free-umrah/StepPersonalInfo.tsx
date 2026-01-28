import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FreeUmrahFormData } from "./types";

interface StepPersonalInfoProps {
  formData: FreeUmrahFormData;
  setFormData: (data: FreeUmrahFormData) => void;
  errors: Record<string, string>;
  t: {
    fullName: string;
    age: string;
    mobile: string;
  };
}

export function StepPersonalInfo({ formData, setFormData, errors, t }: StepPersonalInfoProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-base">{t.fullName} *</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Enter your full name"
          className="h-12 text-base"
        />
        {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="age" className="text-base">{t.age} *</Label>
        <Input
          id="age"
          type="number"
          min="18"
          max="100"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          placeholder="18-100"
          className="h-12 text-base"
        />
        {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
      </div>

      {/* WhatsApp Number - India Only */}
      <div className="space-y-2">
        <Label className="text-base">{t.mobile} * <span className="text-xs text-muted-foreground">(WhatsApp)</span></Label>
        <div className="flex gap-2">
          <div className="flex items-center justify-center px-3 h-12 bg-muted rounded-md text-sm font-medium text-muted-foreground border">
            🇮🇳 +91
          </div>
          <Input
            id="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="9876543210"
            value={formData.mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData({ ...formData, mobile: value });
            }}
            className="flex-1 h-12 text-base"
          />
        </div>
        {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
      </div>
    </div>
  );
}
