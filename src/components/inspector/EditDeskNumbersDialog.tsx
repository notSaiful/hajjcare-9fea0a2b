import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { IHPODesk } from "@/data/ihpoMadinahDesks";
import { useDeskOverrides } from "@/hooks/useDeskOverrides";

interface EditDeskNumbersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: string;
  /** Original (base) desk roster — overrides are layered on top */
  baseDesks: IHPODesk[];
}

export const EditDeskNumbersDialog = ({
  open,
  onOpenChange,
  city,
  baseDesks,
}: EditDeskNumbersDialogProps) => {
  const { overrides, setBulk, clearAll } = useDeskOverrides(city);
  const { toast } = useToast();

  const initialDraft = useMemo(() => {
    const draft: Record<string, string> = {};
    baseDesks.forEach((d) => {
      draft[d.id] = overrides[d.id] ?? d.mobile ?? "";
    });
    return draft;
  }, [baseDesks, overrides]);

  const [draft, setDraft] = useState<Record<string, string>>(initialDraft);

  useEffect(() => {
    if (open) setDraft(initialDraft);
  }, [open, initialDraft]);

  const handleChange = (id: string, value: string) => {
    setDraft((prev) => ({ ...prev, [id]: value.replace(/\D/g, "") }));
  };

  const handleSave = () => {
    // Compute overrides relative to base values: store only diffs.
    const updates: Record<string, string> = {};
    baseDesks.forEach((d) => {
      const v = (draft[d.id] || "").trim();
      if (v !== (d.mobile || "")) updates[d.id] = v;
      else updates[d.id] = ""; // clear override if matches base
    });
    setBulk(updates);
    toast({
      title: "Saved",
      description: `${city} desk numbers updated on this device.`,
      duration: 2000,
    });
    onOpenChange(false);
  };

  const handleResetAll = () => {
    clearAll();
    const reset: Record<string, string> = {};
    baseDesks.forEach((d) => {
      reset[d.id] = d.mobile ?? "";
    });
    setDraft(reset);
    toast({
      title: "Reset",
      description: `All ${city} overrides cleared.`,
      duration: 2000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {city} Desk Numbers</DialogTitle>
          <DialogDescription>
            Update Saudi mobile numbers (digits only, no +966). Saved on this
            device only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {baseDesks.map((desk) => {
            const isOverridden =
              overrides[desk.id] !== undefined &&
              overrides[desk.id] !== (desk.mobile || "");
            return (
              <div key={desk.id} className="space-y-1">
                <Label
                  htmlFor={`desk-${desk.id}`}
                  className="text-xs flex items-center justify-between gap-2"
                >
                  <span className="font-medium">{desk.department}</span>
                  {isOverridden && (
                    <span className="text-[10px] text-amber-600">edited</span>
                  )}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    +966
                  </span>
                  <Input
                    id={`desk-${desk.id}`}
                    inputMode="numeric"
                    placeholder="5XXXXXXXX"
                    value={draft[desk.id] ?? ""}
                    onChange={(e) => handleChange(desk.id, e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResetAll}
            className="sm:mr-auto"
          >
            Reset all
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDeskNumbersDialog;
