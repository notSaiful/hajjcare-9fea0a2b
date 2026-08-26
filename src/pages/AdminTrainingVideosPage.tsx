import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { ForbiddenError } from "@/components/ForbiddenError";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { detectVideoPlatform, formatSeconds, isSupportedExternalVideoUrl } from "@/lib/externalVideo";
import { CheckCircle2, ExternalLink, Eye, Plus, Trash2, Video } from "lucide-react";

type VideoLink = { id: string; title: string; external_url: string; platform: string; language: string; duration_seconds: number | null; lesson_number: number; lesson_order: number; published: boolean; description: string | null };
const db = supabase as any;
const emptyForm = { title: "", description: "", external_url: "", language: "en", duration_minutes: "", lesson_number: "1", lesson_order: "0" };

export default function AdminTrainingVideosPage() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("");
  const [bulkLinks, setBulkLinks] = useState("");
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-external-video-links"] });

  const videos = useQuery({ queryKey: ["admin-external-video-links"], enabled: isAdmin, queryFn: async () => {
    const { data, error } = await db.from("video_links").select("*").order("lesson_number").order("lesson_order");
    if (error) throw error;
    return data as VideoLink[];
  }});
  const create = useMutation({ mutationFn: async () => {
    const platform = detectVideoPlatform(form.external_url);
    if (!platform || !isSupportedExternalVideoUrl(form.external_url)) throw new Error("Use a supported HTTPS link: YouTube, Vimeo, Cloudflare Stream, CloudFront or Mux.");
    const { error } = await db.from("video_links").insert({ lesson_id: crypto.randomUUID(), course_id: "hajj-training", title: form.title.trim(), description: form.description.trim() || null, external_url: form.external_url.trim(), platform, language: form.language, duration_seconds: form.duration_minutes ? Number(form.duration_minutes) * 60 : null, lesson_number: Number(form.lesson_number), lesson_order: Number(form.lesson_order), created_by: user?.id });
    if (error) throw error;
  }, onSuccess: () => { refresh(); setForm(emptyForm); toast({ title: "External lesson added as draft" }); }, onError: (e: Error) => toast({ title: "Could not add lesson", description: e.message, variant: "destructive" }) });
  const update = useMutation({ mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => { const { error } = await db.from("video_links").update(values).eq("id", id); if (error) throw error; }, onSuccess: () => { refresh(); queryClient.invalidateQueries({ queryKey: ["published-external-video-links"] }); } });
  const remove = useMutation({ mutationFn: async (id: string) => { const { error } = await db.from("video_links").delete().eq("id", id); if (error) throw error; }, onSuccess: refresh, onError: (e: Error) => toast({ title: "Could not delete lesson", description: e.message, variant: "destructive" }) });
  const bulkImport = useMutation({ mutationFn: async () => {
    const rows = bulkLinks.split("\n").map((line) => line.split(",").map((value) => value.trim())).filter((row) => row.length >= 2 && row[0] && row[1]);
    const payload = rows.map(([title, external_url, language = "en", lesson_number = "1", duration_minutes = ""]) => {
      const platform = detectVideoPlatform(external_url);
      if (!platform) throw new Error(`Unsupported link for “${title}”.`);
      return { lesson_id: crypto.randomUUID(), course_id: "hajj-training", title, external_url, platform, language, lesson_number: Number(lesson_number), duration_seconds: duration_minutes ? Number(duration_minutes) * 60 : null, created_by: user?.id };
    });
    if (!payload.length) throw new Error("Add CSV lines: Title, URL, language, day, minutes.");
    const { error } = await db.from("video_links").insert(payload); if (error) throw error;
  }, onSuccess: () => { refresh(); setBulkLinks(""); toast({ title: "Lessons imported as drafts" }); }, onError: (e: Error) => toast({ title: "Import failed", description: e.message, variant: "destructive" }) });

  if (!isAdmin) return <MainLayout><ForbiddenError /></MainLayout>;
  const visible = (videos.data ?? []).filter((video) => `${video.title} ${video.language} ${video.lesson_number}`.toLowerCase().includes(filter.toLowerCase()));
  return <MainLayout><PageHeader title="External Video Library" subtitle="Only metadata is stored in HajCare. Publish only verified lessons from approved providers." />
    <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24">
      <Card className="border-primary/20"><CardContent className="space-y-3 p-4"><div className="flex items-center gap-2 font-semibold"><Plus className="h-4 w-4 text-primary" />Add external lesson</div>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Lesson title" />
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short lesson description" />
        <Input value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} placeholder="YouTube, Vimeo, Cloudflare Stream, CloudFront or Mux HTTPS URL" inputMode="url" />
        <div className="grid grid-cols-2 gap-2"><Select value={form.language} onValueChange={(language) => setForm({ ...form, language })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["en", "hi", "ur", "ar", "bn", "mr", "ta", "te", "ml", "kn"].map((language) => <SelectItem key={language} value={language}>{language.toUpperCase()}</SelectItem>)}</SelectContent></Select><Input value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} placeholder="Minutes" inputMode="numeric" /></div>
        <div className="grid grid-cols-2 gap-2"><Input value={form.lesson_number} onChange={(e) => setForm({ ...form, lesson_number: e.target.value })} placeholder="Day number" inputMode="numeric" /><Input value={form.lesson_order} onChange={(e) => setForm({ ...form, lesson_order: e.target.value })} placeholder="Lesson order" inputMode="numeric" /></div>
        <Button className="min-h-11 w-full" disabled={create.isPending || !form.title || !form.external_url} onClick={() => create.mutate()}><Video className="mr-2 h-4 w-4" />Add as draft</Button>
      </CardContent></Card>
      <Card><CardContent className="space-y-2 p-4"><p className="text-sm font-semibold">Bulk import draft links</p><Textarea value={bulkLinks} onChange={(e) => setBulkLinks(e.target.value)} placeholder="Title, https://youtu.be/example, en, 1, 12" /><Button variant="outline" className="w-full" disabled={bulkImport.isPending || !bulkLinks.trim()} onClick={() => bulkImport.mutate()}>Import CSV lines</Button></CardContent></Card>
      <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by title, language or day" />
      {visible.map((video) => <Card key={video.id}><CardContent className="flex items-start gap-3 p-4"><Video className="mt-0.5 h-5 w-5 text-primary" /><div className="min-w-0 flex-1"><p className="font-semibold">Day {video.lesson_number}: {video.title}</p><p className="mt-1 text-xs text-muted-foreground">{video.platform} · {video.language.toUpperCase()} · {formatSeconds(video.duration_seconds)} · {video.published ? "Published" : "Draft"}</p><p className="mt-1 truncate text-xs text-muted-foreground">{video.external_url}</p></div><div className="flex shrink-0 gap-1"><Button size="icon" variant="ghost" asChild aria-label="Preview external video"><a href={video.external_url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a></Button><Button size="icon" variant={video.published ? "default" : "outline"} aria-label={video.published ? "Unpublish" : "Publish"} onClick={() => update.mutate({ id: video.id, values: { published: !video.published } })}>{video.published ? <CheckCircle2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button><Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove.mutate(video.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></CardContent></Card>)}
      {!videos.isLoading && visible.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No external videos match. Add a verified lesson, then publish it.</p>}
    </div></MainLayout>;
}
