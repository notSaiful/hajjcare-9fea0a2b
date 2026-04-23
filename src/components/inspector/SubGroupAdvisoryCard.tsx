import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Users, MapPin, Shield, MessageCircle, HandHeart } from 'lucide-react';

/**
 * Official advisory from SHI Desk, Madinah.
 * Reminds Haj State Inspectors to form sub-groups with volunteer leaders
 * for coordinated movement to Makkah, Mina, Muzdalifah and Arafat.
 * No personal details of leaders are displayed — only responsibilities.
 */
export const SubGroupAdvisoryCard = () => {
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
