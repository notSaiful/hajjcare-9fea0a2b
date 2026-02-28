import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Save, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface InspectorProfile {
  name: string;
  state: string;
  cover_number: string;
  batch: string;
  embarkation_point: string;
  mobile: string;
  whatsapp: string;
  departure_date: string;
}

const EMPTY_PROFILE: InspectorProfile = {
  name: '',
  state: '',
  cover_number: '',
  batch: '',
  embarkation_point: '',
  mobile: '',
  whatsapp: '',
  departure_date: '',
};

const InspectorMyProfile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<InspectorProfile>(EMPTY_PROFILE);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('inspector_my_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        name: data.name || '',
        state: data.state || '',
        cover_number: data.cover_number || '',
        batch: data.batch || '',
        embarkation_point: data.embarkation_point || '',
        mobile: data.mobile || '',
        whatsapp: data.whatsapp || '',
        departure_date: data.departure_date || '',
      });
      setHasProfile(true);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const payload = {
      user_id: user.id,
      ...profile,
      departure_date: profile.departure_date || null,
    };

    let error;
    if (hasProfile) {
      ({ error } = await supabase
        .from('inspector_my_profile')
        .update(payload)
        .eq('user_id', user.id));
    } else {
      ({ error } = await supabase
        .from('inspector_my_profile')
        .insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Profile updated successfully' });
      setHasProfile(true);
    }
    setSaving(false);
  };

  const updateField = (field: keyof InspectorProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-primary/20">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">My Profile</span>
              </div>
              <Badge variant={hasProfile ? 'default' : 'outline'} className="text-xs">
                {hasProfile ? (
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Saved</span>
                ) : (
                  '➕ Add / Edit'
                )}
              </Badge>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0 space-y-3">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">Name</label>
                  <Input
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={e => updateField('name', e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">State</label>
                    <Input
                      placeholder="State"
                      value={profile.state}
                      onChange={e => updateField('state', e.target.value)}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Cover Number / Batch</label>
                    <Input
                      placeholder="Cover No."
                      value={profile.cover_number}
                      onChange={e => updateField('cover_number', e.target.value)}
                      maxLength={30}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Batch</label>
                    <Input
                      placeholder="Batch"
                      value={profile.batch}
                      onChange={e => updateField('batch', e.target.value)}
                      maxLength={30}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Embarkation Point</label>
                    <Input
                      placeholder="City"
                      value={profile.embarkation_point}
                      onChange={e => updateField('embarkation_point', e.target.value)}
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Mobile</label>
                    <Input
                      placeholder="+91..."
                      value={profile.mobile}
                      onChange={e => updateField('mobile', e.target.value.replace(/[^0-9+]/g, ''))}
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">WhatsApp</label>
                    <Input
                      placeholder="+91..."
                      value={profile.whatsapp}
                      onChange={e => updateField('whatsapp', e.target.value.replace(/[^0-9+]/g, ''))}
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">Departure Date</label>
                  <Input
                    type="date"
                    value={profile.departure_date}
                    onChange={e => updateField('departure_date', e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving || !profile.name.trim()}
                  className="w-full"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Profile
                </Button>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default InspectorMyProfile;
