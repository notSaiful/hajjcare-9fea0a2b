import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { FreeUmrahFormData } from "./types";

interface StepDeclarationsProps {
  formData: FreeUmrahFormData;
  setFormData: (data: FreeUmrahFormData) => void;
  errors: Record<string, string>;
  masjidCertificate: File | null;
  passportPhoto: File | null;
  onMasjidCertSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPassportPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMasjidCertClear: () => void;
  onPassportPhotoClear: () => void;
  t: {
    declarations: string;
    neverUmrah: string;
    lowIncome: string;
    socialHarmony: string;
    noMoneyPaid: string;
    masjidCertificate: string;
    passportPhoto: string;
    requiredDocuments: string;
  };
}

export function StepDeclarations({
  formData,
  setFormData,
  errors,
  masjidCertificate,
  passportPhoto,
  onMasjidCertSelect,
  onPassportPhotoSelect,
  onMasjidCertClear,
  onPassportPhotoClear,
  t,
}: StepDeclarationsProps) {
  const masjidCertRef = useRef<HTMLInputElement>(null);
  const passportPhotoRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-4">
        <Label className="text-base font-semibold">{t.declarations}</Label>
        
        <div className="space-y-3 bg-muted/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="never_umrah"
              checked={formData.never_umrah}
              onCheckedChange={(checked) => setFormData({ ...formData, never_umrah: !!checked })}
              className="mt-0.5"
            />
            <Label htmlFor="never_umrah" className="text-sm leading-relaxed cursor-pointer">
              {t.neverUmrah} *
            </Label>
          </div>
          {errors.never_umrah && <p className="text-sm text-destructive ml-6">{errors.never_umrah}</p>}

          <div className="flex items-start gap-3">
            <Checkbox
              id="low_income"
              checked={formData.low_income}
              onCheckedChange={(checked) => setFormData({ ...formData, low_income: !!checked })}
              className="mt-0.5"
            />
            <Label htmlFor="low_income" className="text-sm leading-relaxed cursor-pointer">
              {t.lowIncome} *
            </Label>
          </div>
          {errors.low_income && <p className="text-sm text-destructive ml-6">{errors.low_income}</p>}

          <div className="flex items-start gap-3">
            <Checkbox
              id="social_harmony"
              checked={formData.social_harmony}
              onCheckedChange={(checked) => setFormData({ ...formData, social_harmony: !!checked })}
              className="mt-0.5"
            />
            <Label htmlFor="social_harmony" className="text-sm leading-relaxed cursor-pointer">
              {t.socialHarmony} *
            </Label>
          </div>
          {errors.social_harmony && <p className="text-sm text-destructive ml-6">{errors.social_harmony}</p>}

          <div className="flex items-start gap-3">
            <Checkbox
              id="no_money_paid"
              checked={formData.no_money_paid}
              onCheckedChange={(checked) => setFormData({ ...formData, no_money_paid: !!checked })}
              className="mt-0.5"
            />
            <Label htmlFor="no_money_paid" className="text-sm leading-relaxed cursor-pointer">
              {t.noMoneyPaid} *
            </Label>
          </div>
          {errors.no_money_paid && <p className="text-sm text-destructive ml-6">{errors.no_money_paid}</p>}
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">{t.requiredDocuments} * <span className="text-xs text-muted-foreground">(Both required, Max 2MB each)</span></Label>
        
        {/* Document 1: Masjid Registration Certificate */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t.masjidCertificate}</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              masjidCertificate ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => masjidCertRef.current?.click()}
          >
            <input
              ref={masjidCertRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp,application/pdf"
              onChange={onMasjidCertSelect}
              className="hidden"
            />
            {masjidCertificate ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground truncate max-w-[180px]">
                  {masjidCertificate.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMasjidCertClear();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload Masjid Registration Certificate</span>
              </div>
            )}
          </div>
          {errors.masjid_certificate && <p className="text-sm text-destructive">{errors.masjid_certificate}</p>}
        </div>

        {/* Document 2: Passport Photo */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t.passportPhoto}</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              passportPhoto ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => passportPhotoRef.current?.click()}
          >
            <input
              ref={passportPhotoRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
              onChange={onPassportPhotoSelect}
              className="hidden"
            />
            {passportPhoto ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground truncate max-w-[180px]">
                  {passportPhoto.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPassportPhotoClear();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload Passport-size Photograph</span>
              </div>
            )}
          </div>
          {errors.passport_photo && <p className="text-sm text-destructive">{errors.passport_photo}</p>}
        </div>

        <p className="text-xs text-muted-foreground">
          PDF or Images (JPEG, PNG) • Max 2MB each
        </p>
      </div>
    </div>
  );
}
