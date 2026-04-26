import { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  useCustomInspectors,
  type DuplicateMatch,
  type DuplicateStrategy,
  type NewInspectorInput,
} from "@/hooks/useCustomInspectors";
import { toast } from "@/hooks/use-toast";
import {
  parseInspectorImport,
  SAMPLE_CSV,
  SAMPLE_JSON,
  type ParseResult,
} from "@/lib/inspectorImportParser";
import {
  Upload,
  FileUp,
  ClipboardPaste,
  AlertCircle,
  CheckCircle2,
  Copy,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DupePreview = {
  input: NewInspectorInput;
  match: DuplicateMatch;
};

export const ImportInspectorsDialog = ({ open, onOpenChange }: Props) => {
  const { addManyInspectors, findDuplicate } = useCustomInspectors();
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ParseResult | null>(null);
  const [strategy, setStrategy] = useState<DuplicateStrategy>("skip");
  const fileRef = useRef<HTMLInputElement>(null);

  // Pre-compute duplicates whenever the parsed preview changes.
  const dupes: DupePreview[] = useMemo(() => {
    if (!preview) return [];
    const out: DupePreview[] = [];
    for (const input of preview.inspectors) {
      const match = findDuplicate(input);
      if (match) out.push({ input, match });
    }
    return out;
  }, [preview, findDuplicate]);

  const newCount = (preview?.inspectors.length ?? 0) - dupes.length;
  const updatableCount = dupes.filter((d) => d.match.isCustom).length;
  const officialDupeCount = dupes.length - updatableCount;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please use a file under 2MB.",
        variant: "destructive",
      });
      return;
    }
    const content = await file.text();
    setText(content);
    setPreview(parseInspectorImport(content));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleParse = () => {
    setPreview(parseInspectorImport(text));
  };

  const handleImport = () => {
    const parsed = preview ?? parseInspectorImport(text);
    if (parsed.inspectors.length === 0) {
      toast({
        title: "Nothing to import",
        description: parsed.errors[0] ?? "No valid rows found.",
        variant: "destructive",
      });
      setPreview(parsed);
      return;
    }
    const summary = addManyInspectors(parsed.inspectors, strategy);
    const parts: string[] = [];
    if (summary.added.length) parts.push(`${summary.added.length} added`);
    if (summary.updated.length) parts.push(`${summary.updated.length} updated`);
    if (summary.skipped.length)
      parts.push(`${summary.skipped.length} duplicate${summary.skipped.length === 1 ? "" : "s"} skipped`);
    if (parsed.skipped > 0) parts.push(`${parsed.skipped} invalid skipped`);
    toast({
      title: summary.added.length || summary.updated.length ? "Import complete" : "No changes",
      description: parts.join(" · ") || "Nothing to do.",
    });
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setText("");
    setPreview(null);
    setStrategy("skip");
  };

  const loadSample = (sample: string) => {
    setText(sample);
    setPreview(parseInspectorImport(sample));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleReset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            Import inspectors
          </DialogTitle>
          <DialogDescription className="text-xs">
            Paste CSV/JSON or upload a file. Saved only on this device.
            Required columns: <strong>name</strong>, <strong>state</strong>.
            Optional: cover, indian, ksa, makkah, madinah.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {/* Upload */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <FileUp className="w-3.5 h-3.5 mr-1" />
              Upload .csv / .json
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.json,text/csv,application/json,text/plain"
              className="hidden"
              onChange={handleFile}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadSample(SAMPLE_CSV)}
              className="text-xs"
            >
              CSV sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadSample(SAMPLE_JSON)}
              className="text-xs"
            >
              JSON sample
            </Button>
          </div>

          {/* Paste */}
          <div className="space-y-1.5">
            <Label htmlFor="import-text" className="text-xs flex items-center gap-1">
              <ClipboardPaste className="w-3 h-3" />
              Paste CSV or JSON
            </Label>
            <Textarea
              id="import-text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPreview(null);
              }}
              placeholder={`name,state,cover,indian,ksa,makkah,madinah\nMohammed Ali,Andhra Pradesh,AP-002,+91 98765...,...`}
              className="min-h-[140px] font-mono text-xs"
            />
          </div>

          {/* Preview / Validation */}
          {preview && (
            <div className="rounded-md border border-border bg-muted/30 p-2.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                {preview.inspectors.length > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
                <span className="font-medium">
                  {preview.inspectors.length} ready to import
                </span>
                {preview.skipped > 0 && (
                  <Badge variant="outline" className="text-[10px]">
                    {preview.skipped} skipped
                  </Badge>
                )}
              </div>
              {preview.errors.length > 0 && (
                <ul className="text-[11px] text-destructive space-y-0.5 max-h-24 overflow-y-auto">
                  {preview.errors.slice(0, 6).map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                  {preview.errors.length > 6 && (
                    <li>+ {preview.errors.length - 6} more…</li>
                  )}
                </ul>
              )}
              {preview.inspectors.length > 0 && (
                <div className="text-[11px] text-muted-foreground">
                  First: <strong>{preview.inspectors[0].name}</strong> ·{" "}
                  {preview.inspectors[0].state}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={handleParse} disabled={!text.trim()}>
            Preview
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleImport} disabled={!text.trim()}>
              <Upload className="w-3.5 h-3.5 mr-1" />
              Import
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportInspectorsDialog;
