import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INSPECTOR_STATES } from "@/data/hajInspectorsData";
import {
  useCustomInspectors,
  type NewInspectorInput,
} from "@/hooks/useCustomInspectors";
import { toast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface AddInspectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm: NewInspectorInput = {
  name: "",
  state: "",
  coverNumber: "",
  indianMobile: "",
  ksaMobile: "",
  makkahBuilding: "",
  madinahBuilding: "",
  gender: "Male",
};

export const AddInspectorDialog = ({
  open,
  onOpenChange,
}: AddInspectorDialogProps) => {
  const { addInspector } = useCustomInspectors();
  const [form, setForm] = useState<NewInspectorInput>(initialForm);

  const handleChange =
    (field: keyof NewInspectorInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", description: "Please enter the inspector's name." });
      return;
    }
    if (!form.state.trim()) {
      toast({ title: "State is required", description: "Please pick a state." });
      return;
    }
    const created = addInspector(form);
    toast({
      title: "Inspector added",
      description: `${created.name} added to your network (this device).`,
    });
    setForm(initialForm);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setForm(initialForm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleCancel())}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            Add new inspector
          </DialogTitle>
          <DialogDescription className="text-xs">
            Saved only on this device. Useful to track colleagues not yet in the
            official list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="add-name" className="text-xs">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-name"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Full name"
              className="h-9"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="add-state" className="text-xs">
                State <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.state}
                onValueChange={(v) => setForm((f) => ({ ...f, state: v }))}
              >
                <SelectTrigger id="add-state" className="h-9">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {INSPECTOR_STATES.map((s) => (
                    <SelectItem key={s} value={s} className="text-sm">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="add-gender" className="text-xs">
                Gender
              </Label>
              <Select
                value={form.gender}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, gender: v as "Male" | "Female" }))
                }
              >
                <SelectTrigger id="add-gender" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-cover" className="text-xs">
              Cover #
            </Label>
            <Input
              id="add-cover"
              value={form.coverNumber}
              onChange={handleChange("coverNumber")}
              placeholder="e.g. AP-001"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-indian" className="text-xs">
              🇮🇳 Indian Mobile
            </Label>
            <Input
              id="add-indian"
              type="tel"
              inputMode="tel"
              value={form.indianMobile}
              onChange={handleChange("indianMobile")}
              placeholder="+91 9876543210"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-ksa" className="text-xs">
              🇸🇦 KSA Mobile
            </Label>
            <Input
              id="add-ksa"
              type="tel"
              inputMode="tel"
              value={form.ksaMobile}
              onChange={handleChange("ksaMobile")}
              placeholder="+966 5XXXXXXXX"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-makkah" className="text-xs">
              🕋 Makkah Building
            </Label>
            <Input
              id="add-makkah"
              value={form.makkahBuilding}
              onChange={handleChange("makkahBuilding")}
              placeholder="Building 216, Azizia"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-madinah" className="text-xs">
              🕌 Madinah Building
            </Label>
            <Input
              id="add-madinah"
              value={form.madinahBuilding}
              onChange={handleChange("madinahBuilding")}
              placeholder="Building 504, Markaziya"
              className="h-9"
            />
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Add inspector
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInspectorDialog;
