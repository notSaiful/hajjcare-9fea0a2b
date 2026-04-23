import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users, Plus, Crown, CheckCircle2, AlertTriangle, MapPin,
  Trash2, Loader2, UserPlus, ClipboardCheck, Phone,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useInspectorPilgrims, InspectorPilgrim } from '@/hooks/useInspectorPilgrims';
import { format } from 'date-fns';

interface SubGroup {
  id: string;
  group_id: string;
  inspector_user_id: string;
  name: string;
  leader_pilgrim_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CheckIn {
  id: string;
  sub_group_id: string;
  location: string;
  status: string;
  missing_pilgrim_ids: string[];
  notes: string | null;
  created_at: string;
}

const MOVEMENT_LOCATIONS = ['Makkah', 'Mina', 'Muzdalifah', 'Arafat', 'Madinah', 'Other'];

export const SubGroupManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { group, pilgrims, fetchPilgrims } = useInspectorPilgrims();

  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubGroups = useCallback(async () => {
    if (!group) return;
    const { data } = await (supabase as any)
      .from('inspector_sub_groups')
      .select('*')
      .eq('group_id', group.id)
      .order('created_at', { ascending: true });
    setSubGroups(data || []);
  }, [group]);

  const fetchCheckIns = useCallback(async () => {
    if (!group) return;
    const ids = subGroups.map(sg => sg.id);
    if (ids.length === 0) { setCheckIns([]); return; }
    const { data } = await (supabase as any)
      .from('sub_group_checkins')
      .select('*')
      .in('sub_group_id', ids)
      .order('created_at', { ascending: false })
      .limit(50);
    setCheckIns(data || []);
  }, [group, subGroups]);

  useEffect(() => {
    setIsLoading(true);
    fetchSubGroups().finally(() => setIsLoading(false));
  }, [fetchSubGroups]);

  useEffect(() => { fetchCheckIns(); }, [fetchCheckIns]);

  const handleCreate = async () => {
    if (!group || !user || !newName.trim()) return;
    setSubmitting(true);
    const { error } = await (supabase as any)
      .from('inspector_sub_groups')
      .insert({
        group_id: group.id,
        inspector_user_id: user.id,
        name: newName.trim(),
      });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setNewName('');
    setCreateOpen(false);
    await fetchSubGroups();
    toast({ title: 'Sub-group created' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sub-group? Members will become unassigned.')) return;
    await (supabase as any).from('inspector_sub_groups').delete().eq('id', id);
    await fetchSubGroups();
    await fetchPilgrims();
    toast({ title: 'Sub-group deleted' });
  };

  const handleAssignLeader = async (subGroupId: string, pilgrimId: string | null) => {
    await (supabase as any)
      .from('inspector_sub_groups')
      .update({ leader_pilgrim_id: pilgrimId })
      .eq('id', subGroupId);
    if (pilgrimId) {
      // Mark the pilgrim as group leader & assign to this sub-group
      await (supabase as any)
        .from('inspector_pilgrims')
        .update({ is_group_leader: true, sub_group_id: subGroupId })
        .eq('id', pilgrimId);
    }
    await fetchSubGroups();
    await fetchPilgrims();
    toast({ title: 'Leader assigned' });
  };

  const handleAssignMember = async (pilgrimId: string, subGroupId: string | null) => {
    await (supabase as any)
      .from('inspector_pilgrims')
      .update({ sub_group_id: subGroupId })
      .eq('id', pilgrimId);
    await fetchPilgrims();
  };

  const unassigned = useMemo(
    () => pilgrims.filter(p => !(p as any).sub_group_id),
    [pilgrims]
  );

  if (!group) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Create your main pilgrim group first to manage sub-groups.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Sub-Group Coordination</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                For movements: Makkah, Mina, Muzdalifah, Arafat
              </p>
            </div>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" /> New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Sub-Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <label className="text-sm font-medium">Sub-group name</label>
                <Input
                  placeholder="e.g. Bus 1 — Tent A, or Family of Hakim sahab"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={80}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Name by bus, tent, or family for easy coordination.
                </p>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={submitting || !newName.trim()}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : subGroups.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No sub-groups yet</p>
            <p className="text-xs mt-1">Tap <strong>+ New</strong> to create your first sub-group.</p>
          </div>
        ) : (
          subGroups.map((sg) => {
            const members = pilgrims.filter(p => (p as any).sub_group_id === sg.id);
            const leader = pilgrims.find(p => p.id === sg.leader_pilgrim_id);
            const recentCheckIn = checkIns.find(c => c.sub_group_id === sg.id);

            return (
              <SubGroupItem
                key={sg.id}
                subGroup={sg}
                members={members}
                leader={leader}
                unassigned={unassigned}
                allPilgrims={pilgrims}
                recentCheckIn={recentCheckIn}
                onDelete={() => handleDelete(sg.id)}
                onAssignLeader={(pid) => handleAssignLeader(sg.id, pid)}
                onAssignMember={handleAssignMember}
                onCheckedIn={fetchCheckIns}
              />
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

/* ----------------------------- Sub-group item ----------------------------- */

interface SubGroupItemProps {
  subGroup: SubGroup;
  members: InspectorPilgrim[];
  leader?: InspectorPilgrim;
  unassigned: InspectorPilgrim[];
  allPilgrims: InspectorPilgrim[];
  recentCheckIn?: CheckIn;
  onDelete: () => void;
  onAssignLeader: (pilgrimId: string | null) => void;
  onAssignMember: (pilgrimId: string, subGroupId: string | null) => void;
  onCheckedIn: () => void;
}

const SubGroupItem = ({
  subGroup, members, leader, unassigned, allPilgrims, recentCheckIn,
  onDelete, onAssignLeader, onAssignMember, onCheckedIn,
}: SubGroupItemProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [location, setLocation] = useState('Mina');
  const [missingIds, setMissingIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [memberPickerOpen, setMemberPickerOpen] = useState(false);

  const handleCheckIn = async () => {
    if (!user) return;
    setSubmitting(true);
    const status = missingIds.length === 0 ? 'all_present' : 'missing';
    const { error } = await (supabase as any)
      .from('sub_group_checkins')
      .insert({
        sub_group_id: subGroup.id,
        inspector_user_id: user.id,
        location,
        status,
        missing_pilgrim_ids: missingIds,
        notes: notes.trim() || null,
      });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setCheckInOpen(false);
    setMissingIds([]);
    setNotes('');
    onCheckedIn();
    toast({
      title: status === 'all_present' ? 'All present ✓' : `${missingIds.length} missing reported`,
      variant: status === 'all_present' ? 'default' : 'destructive',
    });
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-start justify-between gap-2">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex-1 text-left min-w-0"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm truncate">{subGroup.name}</h4>
            <Badge variant="secondary" className="text-[10px]">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          {leader ? (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-700 dark:text-amber-300">
              <Crown className="w-3 h-3" />
              <span className="truncate">Leader: {leader.full_name}</span>
              {leader.phone && <Phone className="w-3 h-3 ml-1" />}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">No leader assigned</p>
          )}
          {recentCheckIn && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
              <MapPin className="w-3 h-3" />
              Last: {recentCheckIn.location} —{' '}
              <span className={recentCheckIn.status === 'all_present' ? 'text-emerald-600' : 'text-red-600'}>
                {recentCheckIn.status === 'all_present' ? 'all present' : `${recentCheckIn.missing_pilgrim_ids.length} missing`}
              </span>
              {' · '}
              {format(new Date(recentCheckIn.created_at), 'dd MMM, hh:mm a')}
            </div>
          )}
        </button>
        <Button size="icon" variant="ghost" onClick={onDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t bg-muted/30">
          {/* Leader assignment */}
          <div className="pt-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Sub-group Leader (volunteer for khidmat)
            </label>
            <Select
              value={subGroup.leader_pilgrim_id || 'none'}
              onValueChange={(v) => onAssignLeader(v === 'none' ? null : v)}
            >
              <SelectTrigger className="mt-1.5 h-9 text-sm">
                <SelectValue placeholder="Select leader…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— No leader —</SelectItem>
                {members.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.full_name} {m.age ? `(${m.age})` : ''}
                  </SelectItem>
                ))}
                {unassigned.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.full_name} {m.age ? `(${m.age})` : ''} — unassigned
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Members list */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Members ({members.length})
              </label>
              <Dialog open={memberPickerOpen} onOpenChange={setMemberPickerOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <UserPlus className="w-3 h-3" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add members to {subGroup.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-1.5 py-2">
                    {unassigned.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        All pilgrims are already in a sub-group.
                      </p>
                    ) : (
                      unassigned.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onAssignMember(p.id, subGroup.id);
                            toast({ title: `${p.full_name} added` });
                          }}
                          className="w-full text-left p-2 rounded-md border hover:bg-accent flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{p.full_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {p.age}y · {p.gender} {p.wheelchair ? '· ♿' : ''}
                            </div>
                          </div>
                          <Plus className="w-4 h-4 flex-shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {members.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No members yet — tap Add.</p>
            ) : (
              <div className="space-y-1">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between gap-2 text-sm bg-background rounded p-2 border">
                    <div className="min-w-0 flex-1 flex items-center gap-1.5">
                      {m.id === subGroup.leader_pilgrim_id && <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                      <span className="truncate">{m.full_name}</span>
                      <span className="text-xs text-muted-foreground">· {m.age}y</span>
                      {m.wheelchair && <span className="text-xs">♿</span>}
                    </div>
                    <Button
                      size="icon" variant="ghost" className="h-6 w-6"
                      onClick={() => onAssignMember(m.id, null)}
                      title="Remove from sub-group"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in action */}
          <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-1.5" disabled={members.length === 0}>
                <ClipboardCheck className="w-4 h-4" />
                Movement Check-in
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Check-in: {subGroup.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div>
                  <label className="text-sm font-medium">Location / Movement</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MOVEMENT_LOCATIONS.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Mark missing members (if any)</label>
                  <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto border rounded p-2">
                    {members.map(m => (
                      <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={missingIds.includes(m.id)}
                          onCheckedChange={(v) => {
                            setMissingIds(prev =>
                              v ? [...prev, m.id] : prev.filter(id => id !== m.id)
                            );
                          }}
                        />
                        <span className="flex-1">{m.full_name}</span>
                        <span className="text-xs text-muted-foreground">{m.age}y</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any issues, last seen location, etc."
                    rows={2}
                    maxLength={500}
                  />
                </div>

                <div className={`p-2.5 rounded-md text-sm ${
                  missingIds.length === 0
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200'
                }`}>
                  {missingIds.length === 0 ? (
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> All {members.length} members present</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {missingIds.length} of {members.length} missing</span>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCheckInOpen(false)}>Cancel</Button>
                <Button onClick={handleCheckIn} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Submit Check-in
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default SubGroupManager;
