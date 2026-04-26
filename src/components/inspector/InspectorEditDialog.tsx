import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HajInspector } from "@/data/hajInspectorsData";
import {
  useInspectorOverrides,
  type InspectorEditableFields,
} from "@/hooks/useInspectorOverrides";
import {
  useCustomInspectors,
  isCustomInspectorId,
} from "@/hooks/useCustomInspectors";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, Save, Trash2 } from "lucide-react";

interface InspectorEditDialogProps {
  inspector: HajInspector;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormState = {
  [K in keyof InspectorEditableFields]: string;
};

const toForm = (i: HajInspector): FormState => ({
  coverNumber: i.coverNumber ?? "",
  indianMobile: i.indianMobile ?? "",
  ksaMobile: i.ksaMobile ?? "",
  makkahBuilding: i.makkahBuilding ?? "",
  madinahBuilding: i.madinahBuilding ?? "",
});

/**
 * Per-device edit dialog. Overrides are saved to localStorage
 * via useInspectorOverrides — they do not modify the underlying dataset.
 * `inspector` is expected to already include any current overrides applied,
 * so the form pre-fills with the values the user currently sees.
 */
export const InspectorEditDialog = ({
  inspector,
  open,
  onOpenChange,
}: InspectorEditDialogProps) => {
  const { setOverride, clearOverride, hasOverride } = useInspectorOverrides();
  const [form, setForm] = useState<FormState>(() => toForm(inspector));

  // Reset form when opening for a different inspector
  useEffect(() => {
    if (open) setForm(toForm(inspector));
  }, [open, inspector]);

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    setOverride(inspector.id, form);
    toast({
      title: "Inspector details updated",
      description: `${inspector.name} — saved on this device.`,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    clearOverride(inspector.id);
    toast({
      title: "Reset to original",
      description: `${inspector.name} — your edits removed on this device.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Edit inspector details</DialogTitle>
          <DialogDescription className="text-xs">
            {inspector.name} • {inspector.state}
            <br />
            <span className="text-muted-foreground">
              Saved only on this device. Doesn’t change the official record.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="coverNumber" className="text-xs">
              Cover #
            </Label>
            <Input
              id="coverNumber"
              value={form.coverNumber}
              onChange={handleChange("coverNumber")}
              placeholder="e.g. AP-001"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="indianMobile" className="text-xs">
              🇮🇳 Indian Mobile
            </Label>
            <Input
              id="indianMobile"
              type="tel"
              inputMode="tel"
              value={form.indianMobile}
              onChange={handleChange("indianMobile")}
              placeholder="+91 9876543210"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ksaMobile" className="text-xs">
              🇸🇦 KSA Mobile
            </Label>
            <Input
              id="ksaMobile"
              type="tel"
              inputMode="tel"
              value={form.ksaMobile}
              onChange={handleChange("ksaMobile")}
              placeholder="+966 5XXXXXXXX"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="makkahBuilding" className="text-xs">
              🕋 Makkah Building
            </Label>
            <Input
              id="makkahBuilding"
              value={form.makkahBuilding}
              onChange={handleChange("makkahBuilding")}
              placeholder="Building 216, Azizia"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="madinahBuilding" className="text-xs">
              🕌 Madinah Building
            </Label>
            <Input
              id="madinahBuilding"
              value={form.madinahBuilding}
              onChange={handleChange("madinahBuilding")}
              placeholder="Building 504, Markaziya"
              className="h-9"
            />
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!hasOverride(inspector.id)}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              <Save className="w-3.5 h-3.5 mr-1" />
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InspectorEditDialog;
