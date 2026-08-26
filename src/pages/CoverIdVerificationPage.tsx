import { ChangeEvent, useMemo, useRef, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, FileScan, Loader2, LockKeyhole, QrCode, ScanLine, ShieldAlert, ShieldCheck, Upload, UserRoundCheck } from "lucide-react";

type Verification = {
  cover_number: string | null;
  haji_name: string;
  hajj_group_number: string | null;
  building_hotel_camp: string | null;
  nationality: string | null;
};

type RpcClient = {
  rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: Verification[] | null; error: Error | null }>;
};

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats?: string[] }) => BarcodeDetectorLike;
  }
}

const MAX_DOCUMENT_SIZE = 4 * 1024 * 1024;
const coverReference = (value: string) => value.trim().replace(/[^a-zA-Z0-9/-]/g, "").slice(0, 40);

const CoverIdVerificationPage = () => {
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [reference, setReference] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Verification | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [referenceSource, setReferenceSource] = useState<"manual" | "qr" | "ocr">("manual");

  const canVerify = useMemo(() => consent && reference.length >= 5 && !loading, [consent, reference.length, loading]);

  const verify = async (source: "manual" | "qr" | "ocr") => {
    const cleanReference = coverReference(reference);
    if (cleanReference.length < 5) {
      toast({ title: "Enter a valid Cover ID", description: "Use the number printed on the pilgrim’s Hajj Cover ID.", variant: "destructive" });
      return;
    }
    if (!consent) {
      toast({ title: "Consent is required", description: "Confirm that the pilgrim has permitted this operational verification.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await (supabase as unknown as RpcClient).rpc("verify_hajj_cover_id", {
        p_reference: cleanReference,
        p_source: source,
        p_consent_confirmed: true,
      });
      if (error) throw error;
      const record = data?.[0];
      if (!record) {
        toast({ title: "No verified record found", description: "Check the ID or contact the authorised Hajj help desk. Do not attempt repeated searches.", variant: "destructive" });
        return;
      }
      setResult(record);
      toast({ title: "Cover ID verified", description: "Only operational assistance details have been displayed." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification service is unavailable.";
      console.error("Cover ID verification failed", error);
      toast({ title: "Verification unavailable", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const readQr = async (file: File) => {
    if (!window.BarcodeDetector) {
      toast({ title: "QR scanning is not supported on this device", description: "Enter the Cover ID manually or use a newer Android/Chrome device." });
      return;
    }
    setScanning(true);
    try {
      const image = await createImageBitmap(file);
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const code = (await detector.detect(image))[0]?.rawValue?.trim();
      image.close();
      if (!code) throw new Error("No readable QR code was found in this image.");
      const extracted = code.match(/(?:cover(?:[_ -]?id|[_ -]?number)?[=:])?([A-Za-z0-9/-]{5,40})/i)?.[1] || code;
      setReference(coverReference(extracted));
      setReferenceSource("qr");
      toast({ title: "QR code read", description: "Review the extracted Cover ID, confirm consent, then verify." });
    } catch (error) {
      toast({ title: "QR scan failed", description: error instanceof Error ? error.message : "Try a clearer image or enter the number manually.", variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  const handleDocument = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_DOCUMENT_SIZE) {
      toast({ title: "Use a clear image under 4 MB", description: "JPG, PNG, or WebP only. PDF files and document uploads are not retained.", variant: "destructive" });
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setDocumentImage(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
    await readQr(file);
  };

  const runOcr = async () => {
    if (!documentImage) return;
    if (!consent) {
      toast({ title: "Consent is required", description: "Confirm permission before sending an image to the configured OCR service.", variant: "destructive" });
      return;
    }
    setOcrLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("cover-id-ocr", { body: { image: documentImage, consentConfirmed: true } });
      if (error) throw error;
      if (!data?.coverId) {
        toast({ title: "No Cover ID could be extracted", description: "Enter the number manually after reviewing the document.", variant: "destructive" });
        return;
      }
      setReference(coverReference(data.coverId));
      setReferenceSource("ocr");
      toast({ title: "Cover ID extracted", description: "Review the value before verification. OCR is not a confirmation of identity." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "OCR service is unavailable.";
      console.error("Cover ID OCR failed", error);
      toast({ title: "OCR unavailable", description: message, variant: "destructive" });
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 pb-12 sm:px-6">
        <section className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-800 to-emerald-950 p-6 text-primary-foreground shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-3 border-white/30 bg-white/15 text-white hover:bg-white/15">Authorised staff only</Badge>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Hajj Cover ID Verification</h1>
              <p className="mt-2 text-sm leading-6 text-white/85 sm:text-base">Confirm a pilgrim’s Cover ID to provide timely, respectful assistance. Use only with the pilgrim’s permission and a legitimate operational need.</p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15"><ShieldCheck className="h-8 w-8" /></div>
          </div>
        </section>

        <Card className="border-amber-300/60 bg-amber-50/70 shadow-sm dark:bg-amber-950/20">
          <CardContent className="flex gap-3 p-4 text-sm leading-6 text-amber-950 dark:text-amber-100">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
            <p><strong>Privacy safeguard:</strong> this tool shows only the minimum information needed for assistance. It does not display contact numbers or retain the uploaded scan. Every verification is audit-logged for authorised compliance review.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div>
              <h2 className="font-semibold">1. Scan or enter Cover ID</h2>
              <p className="mt-1 text-sm text-muted-foreground">Scan the QR code on the official Cover ID, or enter the ID number manually.</p>
            </div>
            <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={(event) => void handleDocument(event)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="outline" className="h-auto justify-start gap-3 p-4 text-left" disabled={scanning} onClick={() => fileInput.current?.click()}>
                {scanning ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <QrCode className="h-5 w-5 text-primary" />}
                <span><span className="block font-semibold">Scan QR code</span><span className="block text-xs font-normal text-muted-foreground">Camera or image · not stored</span></span>
              </Button>
              <Button type="button" variant="outline" className="h-auto justify-start gap-3 p-4 text-left" onClick={() => fileInput.current?.click()}>
                <Camera className="h-5 w-5 text-primary" />
                <span><span className="block font-semibold">Upload Cover ID image</span><span className="block text-xs font-normal text-muted-foreground">QR detection only · JPG, PNG, WebP</span></span>
              </Button>
            </div>
            {fileName && <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground"><span>Selected image: {fileName}. It stays on this device unless you explicitly choose OCR.</span><Button type="button" size="sm" variant="secondary" disabled={!documentImage || ocrLoading} onClick={() => void runOcr()}>{ocrLoading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <FileScan className="mr-1 h-3.5 w-3.5" />}Extract with OCR</Button></div>}
            <div className="space-y-2">
              <Label htmlFor="cover-id">Indian Hajj Cover ID</Label>
              <Input id="cover-id" value={reference} onChange={(event) => { setReference(coverReference(event.target.value)); setReferenceSource("manual"); }} placeholder="Enter Cover ID number" autoComplete="off" spellCheck={false} maxLength={40} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <h2 className="font-semibold">2. Confirm permission and verify</h2>
            <div className="flex items-start gap-3 rounded-xl border bg-muted/35 p-4">
              <Checkbox id="verification-consent" checked={consent} onCheckedChange={(value) => setConsent(value === true)} />
              <Label htmlFor="verification-consent" className="cursor-pointer text-sm leading-6">I confirm that the pilgrim, or their lawful representative in an emergency, has permitted this verification for Hajj assistance.</Label>
            </div>
            <Button type="button" className="w-full gap-2 sm:w-auto" disabled={!canVerify} onClick={() => void verify(referenceSource)}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />} Verify Cover ID
            </Button>
          </CardContent>
        </Card>

        {result && <Card className="border-emerald-300 bg-emerald-50/60 shadow-md dark:bg-emerald-950/20">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3"><div className="rounded-full bg-emerald-600 p-2 text-white"><UserRoundCheck className="h-5 w-5" /></div><div><h2 className="font-semibold text-emerald-950 dark:text-emerald-100">Verified pilgrim record</h2><p className="text-xs text-emerald-800/80 dark:text-emerald-200/80">Use this information only to provide assistance.</p></div></div>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Pilgrim name</dt><dd className="mt-1 font-semibold">{result.haji_name}</dd></div>
              <div><dt className="text-muted-foreground">Cover ID</dt><dd className="mt-1 font-semibold">{result.cover_number || "Verified"}</dd></div>
              <div><dt className="text-muted-foreground">Hajj group</dt><dd className="mt-1 font-semibold">{result.hajj_group_number || "Not available"}</dd></div>
              <div><dt className="text-muted-foreground">Camp / accommodation</dt><dd className="mt-1 font-semibold">{result.building_hotel_camp || "Not available"}</dd></div>
            </dl>
          </CardContent>
        </Card>}

        <section className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="flex gap-2 rounded-xl border p-3"><LockKeyhole className="mt-0.5 h-4 w-4 text-primary" /><span>No ID image storage</span></div>
          <div className="flex gap-2 rounded-xl border p-3"><FileScan className="mt-0.5 h-4 w-4 text-primary" /><span>Minimal data display</span></div>
          <div className="flex gap-2 rounded-xl border p-3"><Upload className="mt-0.5 h-4 w-4 text-primary" /><span>Official database connection required</span></div>
        </section>
      </div>
    </MainLayout>
  );
};

export default CoverIdVerificationPage;
