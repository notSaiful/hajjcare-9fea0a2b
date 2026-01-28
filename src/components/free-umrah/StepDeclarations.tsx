import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { FreeUmrahFormData } from "./types";

interface StepDeclarationsProps {
  formData: FreeUmrahFormData;
  setFormData: (data: FreeUmrahFormData) => void;
  errors: Record<string, string>;
  selectedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileClear: () => void;
  t: {
    declarations: string;
    neverUmrah: string;
    lowIncome: string;
    socialHarmony: string;
    noMoneyPaid: string;
    proofDocument: string;
    uploadHint: string;
  };
}

export function StepDeclarations({
  formData,
  setFormData,
  errors,
  selectedFile,
  onFileSelect,
  onFileClear,
  t,
}: StepDeclarationsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      {/* File Upload */}
      <div className="space-y-2">
        <Label className="text-base">{t.proofDocument} <span className="text-xs text-muted-foreground">(Max 2MB)</span></Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp,application/pdf"
            onChange={onFileSelect}
            className="hidden"
          />
          {selectedFile ? (
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileClear();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">{t.uploadHint}</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPEG, PNG • Max 2MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
