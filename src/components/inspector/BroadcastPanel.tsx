import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Megaphone, Send, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: string;
  created_at: string;
}

interface Props {
  groupId: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  emergency: 'border-destructive bg-destructive/5',
  urgent: 'border-amber-500 bg-amber-50 dark:bg-amber-950/20',
  normal: '',
};

export function BroadcastPanel({ groupId }: Props) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', priority: 'normal' });

  const fetchAnnouncements = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('group_announcements')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(20);
    setAnnouncements(data || []);
  }, [groupId]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const handleSend = async () => {
    if (!user || !form.title.trim() || !form.message.trim()) return;
    setSubmitting(true);
    const { error } = await (supabase as any)
      .from('group_announcements')
      .insert({
        group_id: groupId,
        inspector_user_id: user.id,
        title: form.title.trim(),
        message: form.message.trim(),
        priority: form.priority,
      });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Announcement sent ✓' });
      setForm({ title: '', message: '', priority: 'normal' });
      setShowForm(false);
      fetchAnnouncements();
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-primary" />
          Broadcast to Group
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Send className="w-4 h-4 mr-1" /> New
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Bus departure at 6 AM" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Details for your group..." />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">🚨 Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSend} disabled={submitting || !form.title.trim() || !form.message.trim()} className="w-full">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send to All Pilgrims
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sent announcements */}
      <div className="space-y-2">
        {announcements.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">No announcements sent yet</p>
        ) : (
          announcements.map(a => (
            <div key={a.id} className={cn('rounded-lg border p-3 space-y-1', PRIORITY_STYLES[a.priority])}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{a.title}</h4>
                {a.priority !== 'normal' && (
                  <Badge variant={a.priority === 'emergency' ? 'destructive' : 'secondary'} className="text-xs">
                    {a.priority === 'emergency' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {a.priority}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{a.message}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(a.created_at), 'dd MMM, h:mm a')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
