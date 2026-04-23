import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Megaphone, Users, MapPin, Shield, MessageCircle, HandHeart, CheckCircle2, Loader2, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ADVISORY_KEY = 'shi_madinah_subgroup_advisory_2026';

/**
 * Official advisory from SHI Desk, Madinah.
 * Includes an "I understand" acknowledgment that records the inspector's
 * confirmation in the advisory_acknowledgments table.
 */
export const SubGroupAdvisoryCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [acknowledged, setAcknowledged] = useState(false);
  const [acknowledgedAt, setAcknowledgedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ackCount, setAckCount] = useState<number>(0);
  const [totalInspectors, setTotalInspectors] = useState<number>(0);

  // Fetch acknowledgment stats (public via RPC)
  const fetchStats = useCallback(async () => {
    const { data, error } = await (supabase as any).rpc('get_advisory_ack_stats', {
      p_advisory_key: ADVISORY_KEY,
    });
    if (!error && data && data.length > 0) {
      setAckCount(Number(data[0].acknowledged_count) || 0);
      setTotalInspectors(Number(data[0].total_inspectors) || 0);
    }
  }, []);

  // Check existing acknowledgment + load stats
  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchStats();
      if (user) {
        const { data } = await (supabase as any)
          .from('advisory_acknowledgments')
          .select('acknowledged_at')
          .eq('user_id', user.id)
          .eq('advisory_key', ADVISORY_KEY)
          .maybeSingle();
        if (mounted && data) {
          setAcknowledged(true);
          setAcknowledgedAt(data.acknowledged_at);
        }
      }
      if (mounted) setIsLoading(false);
    })();
    return () => { mounted = false; };
  }, [user, fetchStats]);

  const handleAcknowledge = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to acknowledge this advisory.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    const { error } = await (supabase as any)
      .from('advisory_acknowledgments')
      .insert({
        user_id: user.id,
        advisory_key: ADVISORY_KEY,
        user_agent: navigator.userAgent,
      });
    setIsSubmitting(false);
    if (error) {
      toast({ title: 'Failed to record', description: error.message, variant: 'destructive' });
      return;
    }
    setAcknowledged(true);
    setAcknowledgedAt(new Date().toISOString());
    // Refresh aggregate count
    fetchStats();
    toast({
      title: 'Acknowledged ✓',
      description: 'Your acknowledgment has been recorded with SHI Desk.',
    });
  };

  const progressPct = totalInspectors > 0
    ? Math.min(100, Math.round((ackCount / totalInspectors) * 100))
    : 0;

  return (
    <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/40 shadow-md">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-amber-900 dark:text-amber-100">
                Important Advisory
              </h3>
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] px-2 py-0">
                OFFICIAL
              </Badge>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-200/80 mt-0.5">
              SHI Desk, Madinah
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 space-y-2">
          <p className="text-sm text-foreground leading-relaxed">
            All <span className="font-semibold">SHIs</span> are requested to form{' '}
            <span className="font-semibold text-amber-700 dark:text-amber-300">sub-groups</span>{' '}
            within their groups for better coordination during movements to{' '}
            <span className="font-medium">Makkah, Mina, Muzdalifah, and Arafat</span>.
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Each sub-group should identify a leader{' '}
            <span className="text-xs text-muted-foreground">(volunteers — willing for khidmat)</span>{' '}
            who will:
          </p>
        </div>

        {/* Responsibilities */}
        <div className="space-y-2">
          <ResponsibilityRow
            icon={<MapPin className="w-4 h-4" />}
            text="Help coordinate and guide the group during movements and luggage"
          />
          <ResponsibilityRow
            icon={<Users className="w-4 h-4" />}
            text="Ensure all members remain together and accounted for"
          />
          <ResponsibilityRow
            icon={<MessageCircle className="w-4 h-4" />}
            text="Act as the point of contact for communication and updates"
          />
          <ResponsibilityRow
            icon={<HandHeart className="w-4 h-4" />}
            text="Assist anyone in need within the group"
          />
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-2 pt-2 border-t border-amber-200 dark:border-amber-800">
          <Shield className="w-4 h-4 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
            This will greatly help in maintaining discipline, avoiding confusion, and ensuring
            everyone's safety, especially during crowded and critical times.
          </p>
        </div>

        {/* Acknowledgment Progress Indicator */}
        <div className="bg-white/70 dark:bg-black/30 rounded-lg p-3 space-y-2 border border-amber-200/60 dark:border-amber-800/60">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-100">
              <TrendingUp className="w-3.5 h-3.5" />
              SHI Acknowledgment Progress
            </div>
            <div className="text-xs font-bold text-amber-800 dark:text-amber-200">
              {ackCount} / {totalInspectors || '—'}
            </div>
          </div>
          <Progress
            value={progressPct}
            className="h-2 bg-amber-100 dark:bg-amber-950/50 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-emerald-500"
          />
          <div className="flex items-center justify-between text-[11px] text-amber-800/80 dark:text-amber-200/80">
            <span>{progressPct}% acknowledged</span>
            <span>
              {totalInspectors > 0
                ? `${totalInspectors - ackCount} pending`
                : 'Awaiting registrations'}
            </span>
          </div>
        </div>

        {/* Acknowledgment Button */}
        <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
          {isLoading ? (
            <Button disabled variant="outline" className="w-full">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
            </Button>
          ) : acknowledged ? (
            <div className="flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 rounded-lg p-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <div className="text-center">
                <div>Acknowledged</div>
                {acknowledgedAt && (
                  <div className="text-[11px] font-normal opacity-80">
                    {format(new Date(acknowledgedAt), "dd MMM yyyy, hh:mm a")}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Button
              onClick={handleAcknowledge}
              disabled={isSubmitting || !user}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold h-11"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> I understand</>
              )}
            </Button>
          )}
          {!user && !isLoading && (
            <p className="text-[11px] text-center text-muted-foreground mt-2">
              Sign in to record your acknowledgment
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ResponsibilityRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-start gap-2.5">
    <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <p className="text-sm text-foreground leading-snug pt-1">{text}</p>
  </div>
);

export default SubGroupAdvisoryCard;
