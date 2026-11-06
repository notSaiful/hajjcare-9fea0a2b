import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import {
  LessonOneGateway,
  LessonOneRow,
  saveLessonOneVideo,
  selectLessonOneTarget,
  validateLessonOneFile,
} from "@/lib/lessonOneVideoUpload";

type Props = {
  enabled: boolean;
  gateway?: LessonOneGateway;
  onSaved?: () => void;
};

export function LessonOneVideoUpload({ enabled, gateway, onSaved }: Props) {
  const [rows, setRows] = useState<LessonOneRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gatewayRef = useRef(gateway);
  gatewayRef.current = gateway;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const load = async () => {
      try {
        const api = gatewayRef.current ?? (await import("@/lib/lessonOneSupabaseGateway")).createSupabaseLessonOneGateway();
        const next = await api.listLessonOne();
        if (!cancelled) setRows(next);
      } catch (cause) {
        if (!cancelled) {
          setRows([]);
          setError(cause instanceof Error ? cause.message : "Video 1 could not be loaded.");
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  if (!enabled) return null;

  const target = rows ? selectLessonOneTarget(rows) : null;
  const current = target?.row ?? null;

  const reload = async (api: LessonOneGateway) => {
    setRows(await api.listLessonOne());
  };

  const run = async (file: File, replaceConfirmed: boolean) => {
    setError(null);
    setSuccess(null);
    setBusy(true);
    setProgress(0);
    try {
      const api = gateway ?? (await import("@/lib/lessonOneSupabaseGateway")).createSupabaseLessonOneGateway();
      const known = rows ?? await api.listLessonOne();
      await saveLessonOneVideo({
        gateway: api,
        file,
        rows: known,
        replaceConfirmed,
        onProgress: setProgress,
      });
      setSuccess("Video 1 saved as a draft. Publish it when you are ready. / वीडियो 1 ड्राफ्ट के रूप में सहेजा गया। तैयार होने पर प्रकाशित करें।");
      setPendingFile(null);
      await reload(api);
      onSaved?.();
    } catch (cause) {
      setSuccess(null);
      setError(cause instanceof Error && cause.message ? cause.message : "Upload failed. Video 1 was not changed.");
    } finally {
      setBusy(false);
    }
  };

  const onPick = (file: File) => {
    setSuccess(null);
    const problem = validateLessonOneFile(file);
    if (problem) {
      setError(problem);
      setPendingFile(null);
      return;
    }
    if (target?.error) {
      setError(target.error);
      return;
    }
    if (current?.external_url) {
      setError(null);
      setPendingFile(file);
      return;
    }
    void run(file, false);
  };

  return (
    <Card className="border-primary/30" data-testid="video-1-upload">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <Upload className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-semibold">Video 1 · वीडियो 1</h2>
            <p className="text-sm text-muted-foreground">
              Attach / Upload video · वीडियो जोड़ें / अपलोड करें
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Choose the Hindi MP4 from this device (about 27 MB, maximum 40 MB). Other lessons stay unchanged. The current video is kept unless you confirm a replacement.
            </p>
          </div>
        </div>

        {rows === null && <p className="text-sm text-muted-foreground">Loading Video 1…</p>}
        {current && (
          <p className="text-xs text-muted-foreground">
            Current Video 1: {current.published ? "Published" : "Draft"} · {current.external_url ? "file attached" : "no file yet"}
          </p>
        )}
        {rows && !current && !target?.error && (
          <p className="text-xs text-muted-foreground">No Video 1 file saved yet. / अभी कोई वीडियो 1 फ़ाइल सहेजी नहीं है।</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,.mp4"
          className="sr-only"
          aria-label="Attach / Upload video"
          disabled={busy || rows === null}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onPick(file);
          }}
        />
        <Button
          type="button"
          className="min-h-11 w-full"
          disabled={busy || rows === null}
          onClick={() => inputRef.current?.click()}
        >
          Attach / Upload video · वीडियो जोड़ें / अपलोड करें
        </Button>

        {pendingFile && (
          <div role="alertdialog" aria-label="Replace Video 1" className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
            <p>Replace the current Video 1? The existing video stays until this upload succeeds.</p>
            <p>मौजूदा वीडियो 1 तभी बदलेगा जब नया अपलोड पूरा हो जाए।</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" className="min-h-11" disabled={busy} onClick={() => void run(pendingFile, true)}>
                Replace / बदलें
              </Button>
              <Button type="button" variant="outline" className="min-h-11" disabled={busy} onClick={() => setPendingFile(null)}>
                Keep current / रहने दें
              </Button>
            </div>
          </div>
        )}

        {progress !== null && busy && (
          <div className="space-y-1">
            <Progress value={progress} aria-label="Upload progress" />
            <p className="text-xs text-muted-foreground" role="status">Uploading… {progress}%</p>
          </div>
        )}
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        {success && <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">{success}</p>}
        <p className="text-xs text-muted-foreground">
          <Link to="/admin/training-videos" className="underline">Publish Video 1</Link> from the training library when the draft looks right. Public visitors cannot upload.
        </p>
      </CardContent>
    </Card>
  );
}
