import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, Loader2, Download, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { ForbiddenError } from "@/components/ForbiddenError";
import {
  extractPdfText,
  parseInspectorRows,
  rowsToTsSnippet,
  type ParsedRow,
} from "@/lib/inspectorPdfParser";
import { useCustomInspectors } from "@/hooks/useCustomInspectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INSPECTOR_STATES } from "@/data/hajInspectorsData";

const AdminInspectorUploadPage = () => {
  const { isAdmin } = useUserRole();
  const { addManyInspectors } = useCustomInspectors();

  const [state, setState] = useState("Kerala");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [rawText, setRawText] = useState("");

  if (!isAdmin) return <ForbiddenError />;

  const handleParse = async () => {
    if (!file) {
      toast.error("Please choose a PDF first");
      return;
    }
    setParsing(true);
    try {
      const text = await extractPdfText(file);
      setRawText(text);
      const parsed = parseKeralaInspectorRows(text, state);
      setRows(parsed);
      if (parsed.length === 0) {
        toast.warning("No inspector rows detected — check the PDF format");
      } else {
        toast.success(`Parsed ${parsed.length} inspector rows`);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to parse PDF");
    } finally {
      setParsing(false);
    }
  };

  const handleImport = () => {
    if (rows.length === 0) return;
    const summary = addManyInspectors(rows, "skip");
    toast.success(
      `Imported: ${summary.added.length} added, ${summary.updated.length} updated, ${summary.skipped.length} skipped (duplicates)`
    );
  };

  const handleDownloadSnippet = () => {
    const snippet = `// ${state} — generated ${new Date().toISOString().slice(0, 10)} (${rows.length} records)\n${rowsToTsSnippet(rows)}\n`;
    const blob = new Blob([snippet], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.toLowerCase().replace(/\s+/g, "-")}-inspectors-snippet.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Inspector List (PDF)
          </h1>
          <p className="text-sm text-muted-foreground">
            Drop in an official Hajj inspector PDF. The parser extracts rows and
            adds them to your device's inspector dataset.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Choose state & file</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INSPECTOR_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>PDF file</Label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setRows([]);
                  setRawText("");
                }}
              />
              {file && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>
            <Button onClick={handleParse} disabled={!file || parsing} className="w-full">
              {parsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              Parse PDF
            </Button>
          </CardContent>
        </Card>

        {rows.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>2. Preview ({rows.length} rows)</span>
                <Badge variant="secondary">{state}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScrollArea className="h-64 rounded border bg-muted/30">
                <div className="p-2 space-y-1">
                  {rows.slice(0, 200).map((r, i) => (
                    <div key={i} className="text-xs flex items-center gap-2 border-b border-border/50 pb-1">
                      <span className="font-mono text-muted-foreground shrink-0">{r.applicationId?.slice(-6)}</span>
                      <span className="font-medium truncate flex-1">{r.name}</span>
                      <Badge variant={r.result === "Selected" ? "default" : "outline"} className="text-[10px]">
                        {r.result}
                      </Badge>
                      <span className="text-muted-foreground shrink-0">{r.totalMarks}</span>
                    </div>
                  ))}
                  {rows.length > 200 && (
                    <p className="text-xs text-center text-muted-foreground pt-2">
                      …and {rows.length - 200} more
                    </p>
                  )}
                </div>
              </ScrollArea>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleImport} className="w-full">
                  <Check className="w-4 h-4 mr-2" />
                  Import to device
                </Button>
                <Button onClick={handleDownloadSnippet} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download .ts
                </Button>
              </div>

              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                "Import to device" merges into this browser's local dataset
                (de-duplicated). To make the records permanent for all users,
                download the .ts snippet and paste it into{" "}
                <code className="font-mono">src/data/hajInspectorsData.ts</code>.
              </p>
            </CardContent>
          </Card>
        )}

        {rawText && rows.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Raw extracted text (debug)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 rounded border bg-muted/30">
                <pre className="p-2 text-xs whitespace-pre-wrap">{rawText.slice(0, 5000)}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminInspectorUploadPage;
