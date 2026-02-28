import { useState, useEffect, useCallback } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Bell, Phone, AlertTriangle, Shield, Users, Megaphone, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PilgrimRecord {
  id: string;
  pilgrim_id: string;
  full_name: string;
  group_id: string;
  status: string;
  risk_level: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: string;
  created_at: string;
}

interface GroupInfo {
  id: string;
  group_name: string;
  whatsapp_group_link: string | null;
  inspector_user_id: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  emergency: 'border-destructive bg-destructive/10',
  urgent: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
  normal: 'border-border',
};

const HajiGroupDashboardPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [pilgrim, setPilgrim] = useState<PilgrimRecord | null>(null);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    // Find pilgrim record
    const { data: pilgrimData } = await (supabase as any)
      .from('inspector_pilgrims')
      .select('id, pilgrim_id, full_name, group_id, status, risk_level')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!pilgrimData) {
      setLoading(false);
      return;
    }
    setPilgrim(pilgrimData);

    // Fetch group info
    const { data: groupData } = await (supabase as any)
      .from('inspector_pilgrim_groups')
      .select('id, group_name, whatsapp_group_link, inspector_user_id')
      .eq('id', pilgrimData.group_id)
      .single();

    if (groupData) setGroup(groupData);

    // Fetch announcements
    const { data: announcementsData } = await (supabase as any)
      .from('group_announcements')
      .select('id, title, message, priority, created_at')
      .eq('group_id', pilgrimData.group_id)
      .order('created_at', { ascending: false })
      .limit(20);

    setAnnouncements(announcementsData || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime announcements
  useEffect(() => {
    if (!pilgrim?.group_id) return;
    const channel = supabase
      .channel('haji-announcements')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'group_announcements',
        filter: `group_id=eq.${pilgrim.group_id}`,
      }, (payload) => {
        setAnnouncements(prev => [payload.new as Announcement, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [pilgrim?.group_id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-md mx-auto px-4 py-16 text-center">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Please sign in to view your group dashboard.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pilgrim) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <Users className="w-12 h-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-bold">No Group Found</h2>
          <p className="text-sm text-muted-foreground">You haven't joined any inspector group yet.</p>
          <Button onClick={() => navigate('/join-group')}>Join a Group</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Status Card */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg">Assalamu Alaikum</h2>
              <Badge variant="outline" className="font-mono text-xs">{pilgrim.pilgrim_id}</Badge>
            </div>
            <p className="text-sm font-medium">{pilgrim.full_name}</p>
            <p className="text-xs text-muted-foreground">{group?.group_name}</p>
            <div className="flex gap-2 mt-3">
              <Badge className={cn(
                'text-white',
                pilgrim.status === 'NORMAL' ? 'bg-emerald-500' :
                pilgrim.status === 'EMERGENCY' ? 'bg-destructive' :
                pilgrim.status === 'HOSPITAL' ? 'bg-blue-500' : 'bg-amber-500'
              )}>
                {pilgrim.status}
              </Badge>
              <Badge variant="outline">{pilgrim.risk_level} risk</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="destructive"
            className="h-16 flex-col gap-1"
            onClick={() => navigate('/help')}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs">Emergency Help</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col gap-1"
            onClick={() => navigate('/help')}
          >
            <HeartPulse className="w-5 h-5" />
            <span className="text-xs">Health Help</span>
          </Button>
          {group?.whatsapp_group_link && (
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 col-span-2"
              onClick={() => window.open(group.whatsapp_group_link!, '_blank')}
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">Contact Inspector (WhatsApp)</span>
            </Button>
          )}
        </div>

        {/* Announcements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No announcements yet</p>
            ) : (
              announcements.map(a => (
                <div key={a.id} className={cn('rounded-lg border p-3 space-y-1', PRIORITY_STYLES[a.priority] || PRIORITY_STYLES.normal)}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{a.title}</h4>
                    {a.priority !== 'normal' && (
                      <Badge variant={a.priority === 'emergency' ? 'destructive' : 'secondary'} className="text-xs">
                        {a.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(a.created_at), 'dd MMM, h:mm a')}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HajiGroupDashboardPage;
