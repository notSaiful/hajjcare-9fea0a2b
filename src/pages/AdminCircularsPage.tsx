import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Sparkles, Eye, EyeOff, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ForbiddenError } from "@/components/ForbiddenError";
import type { Circular } from "@/hooks/useCirculars";

export default function AdminCircularsPage() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [circularNumber, setCircularNumber] = useState("");
  const [circularDate, setCircularDate] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("normal");
  const [source, setSource] = useState("HCI");

  const SOURCE_LABELS: Record<string, string> = {
    HCI: "Haj Committee of India",
    Saudi_MoHU: "Saudi Ministry of Hajj & Umrah",
    Nusuk: "Nusuk Platform",
    GACA: "GACA (Saudi Aviation)",
    MoFA_KSA: "Saudi Ministry of Foreign Affairs",
    Other: "Other Official Source",
  };

  const circularsQuery = useQuery({
    queryKey: ["admin-circulars"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hajj_circulars")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Circular[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("hajj_circulars").insert({
        title,
        original_content: content,
        circular_number: circularNumber || null,
        circular_date: circularDate || null,
        source_url: sourceUrl || null,
        category,
        priority,
        source,
        source_name_display: SOURCE_LABELS[source] || source,
        auto_scraped: false,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Circular created" });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
      setShowForm(false);
      setTitle(""); setContent(""); setCircularNumber(""); setCircularDate(""); setSourceUrl("");
      setSource("HCI");
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const summarizeMutation = useMutation({
    mutationFn: async (circularId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-circular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ circular_id: circularId }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Failed to summarize");
      }
      return resp.json();
    },
    onSuccess: () => {
      toast({ title: "AI summaries generated!" });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from("hajj_circulars")
        .update({ is_published: published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
      queryClient.invalidateQueries({ queryKey: ["hajj-circulars"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hajj_circulars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Circular deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
    },
  });

  if (!isAdmin) return <MainLayout><ForbiddenError /></MainLayout>;

  return (
    <MainLayout>
      <PageHeader title="Manage Circulars" subtitle="Create, summarize & publish official Hajj/Umrah circulars (HCI + Saudi Govt)" />
      <div className="px-4 pb-24 max-w-2xl mx-auto space-y-4">
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          <Plus className="w-4 h-4 mr-2" />{showForm ? "Cancel" : "New Circular"}
        </Button>

        {showForm && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Title (English)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea placeholder="Full circular content..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Circular No." value={circularNumber} onChange={(e) => setCircularNumber(e.target.value)} />
                <Input type="date" value={circularDate} onChange={(e) => setCircularDate(e.target.value)} />
              </div>
              <Input placeholder="Source URL (optional)" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="visa">Visa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => createMutation.mutate()} disabled={!title || !content || createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Circular
              </Button>
            </CardContent>
          </Card>
        )}

        {circularsQuery.data?.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm">{c.title}</CardTitle>
                <div className="flex gap-1">
                  <Badge variant={c.is_published ? "default" : "secondary"}>
                    {c.is_published ? "Published" : "Draft"}
                  </Badge>
                  {c.ai_processed && <Badge variant="outline" className="text-xs">AI ✓</Badge>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(c.created_at), "dd MMM yyyy")} · <span className="font-medium">{c.source_name_display || c.source}</span>
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {c.summary_en && <p className="text-xs text-muted-foreground mb-2">{c.summary_en}</p>}
              <div className="flex gap-2 flex-wrap">
                {!c.ai_processed && (
                  <Button size="sm" variant="outline" onClick={() => summarizeMutation.mutate(c.id)}
                    disabled={summarizeMutation.isPending}>
                    {summarizeMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    AI Summarize
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => togglePublish.mutate({ id: c.id, published: !c.is_published })}>
                  {c.is_published ? <><EyeOff className="w-3 h-3 mr-1" />Unpublish</> : <><Eye className="w-3 h-3 mr-1" />Publish</>}
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(c.id)}>
                  <Trash2 className="w-3 h-3 mr-1" />Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
