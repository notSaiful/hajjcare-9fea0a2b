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

      {/* WhatsApp Number with Country Code */}
      <div className="space-y-2">
        <Label className="text-base">{t.mobile} * <span className="text-xs text-muted-foreground">(WhatsApp)</span></Label>
        <div className="flex gap-2">
          <Select
            value={formData.country_code}
            onValueChange={(value) => setFormData({ ...formData, country_code: value })}
          >
            <SelectTrigger className="w-[110px] h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="+91">🇮🇳 +91</SelectItem>
              <SelectItem value="+966">🇸🇦 +966</SelectItem>
              <SelectItem value="+92">🇵🇰 +92</SelectItem>
              <SelectItem value="+880">🇧🇩 +880</SelectItem>
              <SelectItem value="+60">🇲🇾 +60</SelectItem>
              <SelectItem value="+62">🇮🇩 +62</SelectItem>
              <SelectItem value="+971">🇦🇪 +971</SelectItem>
              <SelectItem value="+974">🇶🇦 +974</SelectItem>
              <SelectItem value="+965">🇰🇼 +965</SelectItem>
              <SelectItem value="+973">🇧🇭 +973</SelectItem>
              <SelectItem value="+968">🇴🇲 +968</SelectItem>
              <SelectItem value="+20">🇪🇬 +20</SelectItem>
              <SelectItem value="+90">🇹🇷 +90</SelectItem>
              <SelectItem value="+44">🇬🇧 +44</SelectItem>
              <SelectItem value="+1">🇺🇸 +1</SelectItem>
              <SelectItem value="+61">🇦🇺 +61</SelectItem>
              <SelectItem value="+27">🇿🇦 +27</SelectItem>
              <SelectItem value="+234">🇳🇬 +234</SelectItem>
              <SelectItem value="+33">🇫🇷 +33</SelectItem>
              <SelectItem value="+49">🇩🇪 +49</SelectItem>
            </SelectContent>
          </Select>
          <Input
            id="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={15}
            placeholder="9876543210"
            value={formData.mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 15);
              setFormData({ ...formData, mobile: value });
            }}
            className="flex-1 h-12 text-base"
          />
        </div>
        {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
        {errors.country_code && <p className="text-sm text-destructive">{errors.country_code}</p>}
      </div>
    </div>
  );
}
