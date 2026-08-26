import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink, FileText, Share2, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { MainLayout } from "@/components/MainLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNotices } from "@/hooks/useNotices";

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { notices, isLoading, isError } = useNotices({ id });
  const { toast } = useToast();
  const [sharing, setSharing] = useState(false);
  const notice = notices[0];
  const copyLink = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    toast({ title: "Link copied", description: "You can now share this official notice." });
  };
  const share = async () => {
    setSharing(true);
    try {
      if (navigator.share && notice) await navigator.share({ title: notice.title, text: notice.message.slice(0, 180), url: window.location.href });
      else await copyLink();
    } finally { setSharing(false); }
  };

  return <MainLayout>
    <SEO title={notice?.title || "Notice Details"} description={notice?.message.slice(0, 150) || "Official HajCare AI notice"} path={`/notices/${id || ""}`} />
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 pb-24">
      <Button variant="ghost" asChild><Link to="/notices"><ArrowLeft className="mr-2 h-4 w-4" />Back to Notice Board</Link></Button>
      {isLoading ? <Card><CardContent className="p-8 text-center">Loading notice…</CardContent></Card> : isError || !notice ? <Card><CardContent className="p-8 text-center"><h1 className="text-lg font-semibold">Notice unavailable</h1><p className="mt-2 text-sm text-muted-foreground">This notice may have expired or is not published.</p></CardContent></Card> : <>
        <Card className="overflow-hidden border-primary/20"><div className={`h-1 ${notice.priority === "urgent" ? "bg-destructive" : notice.priority === "important" ? "bg-amber-400" : "bg-primary"}`} /><CardHeader className="space-y-4"><div className="flex flex-wrap gap-2"><Badge variant="outline">{notice.category.replace(/_/g, " ")}</Badge><Badge variant="outline" className="border-primary/30 text-primary">Hajj {notice.hajj_year}</Badge>{notice.priority !== "normal" && <Badge variant={notice.priority === "urgent" ? "destructive" : "secondary"}>{notice.priority.toUpperCase()}</Badge>}</div><CardTitle className="text-2xl leading-tight sm:text-3xl">{notice.title}</CardTitle><div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"><span>Published {format(new Date(notice.published_at || notice.created_at), "dd MMM yyyy, HH:mm")}</span><span>Updated {format(new Date(notice.updated_at), "dd MMM yyyy, HH:mm")}</span>{notice.state_name && <span>{notice.state_name}{notice.district ? ` · ${notice.district}` : ""}</span>}</div></CardHeader><CardContent className="space-y-6"><div className="whitespace-pre-wrap text-base leading-8 text-foreground/90">{notice.message}</div><div className="flex flex-wrap items-center gap-2 border-t pt-4"><Button onClick={() => void share()} disabled={sharing}><Share2 className="mr-2 h-4 w-4" />Share Notice</Button><Button variant="outline" onClick={() => void copyLink()}><Copy className="mr-2 h-4 w-4" />Copy Link</Button>{notice.document_url && <Button variant="outline" asChild><a href={notice.document_url} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" />Read PDF</a></Button>}{notice.source_url && <Button variant="ghost" asChild><a href={notice.source_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Official source</a></Button>}</div>{notice.source_name && <p className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-emerald-600" />Source: {notice.source_name}</p>}</CardContent></Card>
      </>}
    </div>
  </MainLayout>;
}
