import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  Loader2,
  Download,
  Check,
  AlertCircle,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { ForbiddenError } from "@/components/ForbiddenError";
import {
  extractPdfText,
  parseInspectorRows,
  rowsToTsSnippet,
  type ParsedRow,
} from "@/lib/inspectorPdfParser";
import { fileToJpegDataUrls } from "@/lib/pdfImageRenderer";
import { useCustomInspectors } from "@/hooks/useCustomInspectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INSPECTOR_STATES } from "@/data/hajInspectorsData";
import { supabase } from "@/integrations/supabase/client";

type Source = "text-layer" | "ocr";

const AdminInspectorUploadPage = () => {
  const { isAdmin } = useUserRole();
  const { addManyInspectors } = useCustomInspectors();

  const [state, setState] = useState("Bihar");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [source, setSource] = useState<Source | null>(null);
  const [rawText, setRawText] = useState("");

  if (!isAdmin) return <ForbiddenError />;

  const isPdf = !!file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
  const isImage = !!file && file.type.startsWith("image/");

  const resetResults = () => {
    setRows([]);
    setRawText("");
    setSource(null);
  };

  /** Hybrid: try fast PDF text-layer parser first; if no/few rows, fall through to OCR. */
  const handleParse = async () => {
    if (!file) {
      toast.error("Please choose a PDF or image first");
      return;
    }
    resetResults();

    if (isPdf) {
      setParsing(true);
      try {
        const text = await extractPdfText(file);
        setRawText(text);
        const parsed = parseInspectorRows(text, state);
        if (parsed.length > 0) {
          setRows(parsed);
          setSource("text-layer");
          toast.success(`Parsed ${parsed.length} rows from the PDF text layer`);
          return;
        }
        toast.message("No text layer found — running AI OCR fallback…");
      } catch (e) {
        console.error(e);
        toast.message("PDF text extraction failed — running AI OCR fallback…");
      } finally {
        setParsing(false);
      }
    }

    await runOcr();
  };

  const runOcr = async () => {
    if (!file) return;
    setOcrRunning(true);
    try {
      const images = await fileToJpegDataUrls(file);
      if (images.length === 0) {
        toast.error("Could not render any pages from the file");
        return;
      }

      const { data, error } = await supabase.functions.invoke("inspector-ocr", {
        body: { state, images },
      });

      if (error) {
        // Surface rate-limit / payment errors clearly
        const msg =
          (error as any)?.context?.body?.error ||
          (error as any)?.message ||
          "OCR request failed";
        toast.error(msg);
        return;
      }

      const ocrRows = Array.isArray(data?.rows) ? (data.rows as ParsedRow[]) : [];
      if (ocrRows.length === 0) {
        toast.warning("AI OCR returned no rows — try a clearer scan");
        return;
      }
      setRows(ocrRows);
      setSource("ocr");
      toast.success(`AI OCR extracted ${ocrRows.length} rows`);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "OCR failed");
    } finally {
      setOcrRunning(false);
    }
  };

  const handleImport = () => {
    if (rows.length === 0) return;
    const summary = addManyInspectors(rows, "skip");
    toast.success(
      `Imported: ${summary.added.length} added, ${summary.updated.length} updated, ${summary.skipped.length} skipped`
    );
  };

  const handleDownloadSnippet = () => {
    const snippet = `// ${state} — generated ${new Date().toISOString().slice(0, 10)} (${rows.length} records, source: ${source ?? "unknown"})\n${rowsToTsSnippet(rows)}\n`;
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

  const busy = parsing || ocrRunning;

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Inspector List
          </h1>
          <p className="text-sm text-muted-foreground">
            Drop in an official Hajj inspector PDF or a photo/screenshot of an
            Annexure-I page. We try fast text extraction first; if that fails we
            fall back to AI vision OCR.
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
              <Label>PDF or image (JPG/PNG)</Label>
              <Input
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  resetResults();
                }}
              />
              {file && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {isImage ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleParse} disabled={!file || busy} className="w-full">
                {parsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                {isImage ? "Run AI OCR" : "Parse (auto)"}
              </Button>
              <Button
                onClick={runOcr}
                disabled={!file || busy}
                variant="outline"
                className="w-full"
                title="Force AI vision OCR even if text layer parses"
              >
                {ocrRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Force OCR
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              AI OCR uses Lovable AI credits. Up to 12 pages per upload.
            </p>
          </CardContent>
        </Card>

        {rows.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between gap-2">
                <span>2. Preview ({rows.length} rows)</span>
                <div className="flex items-center gap-1">
                  {source === "ocr" && (
                    <Badge variant="outline" className="text-[10px]">
                      <Sparkles className="w-3 h-3 mr-1" /> AI OCR
                    </Badge>
                  )}
                  <Badge variant="secondary">{state}</Badge>
                </div>
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
                      <span className="text-muted-foreground shrink-0">{r.totalMarks ?? "—"}</span>
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
                (de-duplicated). For permanent global records, download the .ts
                snippet and paste it into{" "}
                <code className="font-mono">src/data/hajInspectorsData.ts</code>.
                {source === "ocr" && " Review OCR results carefully — names and IDs can occasionally be misread."}
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
