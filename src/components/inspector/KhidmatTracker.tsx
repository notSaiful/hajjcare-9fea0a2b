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
import { Loader2, Plus, ClipboardList, UtensilsCrossed, HeartPulse, MessageCircle, Compass, Truck } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = [
  { value: 'meals_served', label: 'Meals Served', icon: UtensilsCrossed, color: 'bg-amber-500' },
  { value: 'health_check', label: 'Health Check', icon: HeartPulse, color: 'bg-red-500' },
  { value: 'complaint_resolved', label: 'Complaint Resolved', icon: MessageCircle, color: 'bg-blue-500' },
  { value: 'guidance_given', label: 'Guidance Given', icon: Compass, color: 'bg-emerald-500' },
  { value: 'transport_arranged', label: 'Transport Arranged', icon: Truck, color: 'bg-purple-500' },
  { value: 'other', label: 'Other', icon: ClipboardList, color: 'bg-gray-500' },
];

interface KhidmatLog {
  id: string;
  category: string;
  description: string | null;
  pilgrim_count: number;
  log_date: string;
  created_at: string;
}

interface Props {
  groupId: string;
}

export function KhidmatTracker({ groupId }: Props) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [logs, setLogs] = useState<KhidmatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: 'meals_served',
    description: '',
    pilgrimCount: '0',
  });

  const fetchLogs = useCallback(async () => {
    if (!groupId) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data } = await (supabase as any)
      .from('khidmat_logs')
      .select('*')
      .eq('group_id', groupId)
      .gte('log_date', today)
      .order('created_at', { ascending: false });
    setLogs(data || []);
    setLoading(false);
  }, [groupId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSubmit = async () => {
    if (!user || !groupId) return;
    setSubmitting(true);
    const { error } = await (supabase as any)
      .from('khidmat_logs')
      .insert({
        group_id: groupId,
        inspector_user_id: user.id,
        category: form.category,
        description: form.description || null,
        pilgrim_count: parseInt(form.pilgrimCount) || 0,
      });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Khidmat logged ✓' });
      setForm({ category: 'meals_served', description: '', pilgrimCount: '0' });
      setShowForm(false);
      fetchLogs();
    }
    setSubmitting(false);
  };

  // Today's summary
  const summary = CATEGORIES.map(cat => ({
    ...cat,
    count: logs.filter(l => l.category === cat.value).length,
    totalPilgrims: logs.filter(l => l.category === cat.value).reduce((s, l) => s + l.pilgrim_count, 0),
  })).filter(c => c.count > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          Today's Khidmat
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Log Service
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div>
              <Label>Service Type</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pilgrims Served</Label>
              <Input type="number" value={form.pilgrimCount} onChange={e => setForm(f => ({ ...f, pilgrimCount: e.target.value }))} />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <Button onClick={handleSubmit} disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Log Khidmat
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {summary.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {summary.map(s => {
            const Icon = s.icon;
            return (
              <Card key={s.value}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{s.count}x</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    {s.totalPilgrims > 0 && <div className="text-xs text-muted-foreground">{s.totalPilgrims} pilgrims</div>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        !loading && <p className="text-sm text-center text-muted-foreground py-4">No khidmat logged today. Start logging!</p>
      )}

      {/* Recent logs */}
      {logs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Recent</h4>
          {logs.slice(0, 5).map(log => {
            const cat = CATEGORIES.find(c => c.value === log.category);
            return (
              <div key={log.id} className="flex items-center gap-2 text-sm border-b pb-2 last:border-0">
                <Badge variant="outline" className="text-xs">{cat?.label || log.category}</Badge>
                {log.pilgrim_count > 0 && <span className="text-xs text-muted-foreground">{log.pilgrim_count} pilgrims</span>}
                {log.description && <span className="text-xs text-muted-foreground truncate flex-1">{log.description}</span>}
                <span className="text-xs text-muted-foreground">{format(new Date(log.created_at), 'h:mm a')}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
