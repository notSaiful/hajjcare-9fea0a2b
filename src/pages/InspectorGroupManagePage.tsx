import { useState, useMemo, useRef } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { useInspectorPilgrims, InspectorPilgrim } from '@/hooks/useInspectorPilgrims';
import { useUserRole } from '@/hooks/useUserRole';
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Users, Plus, Upload, Search, AlertTriangle, Shield, Crown, Trash2, ExternalLink, Phone, Accessibility, Heart, MessageCircle, BarChart3, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const RISK_COLORS: Record<string, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-600 animate-pulse',
};

const STATUS_COLORS: Record<string, string> = {
  NORMAL: 'bg-emerald-500',
  EMERGENCY: 'bg-red-500',
  MISSING: 'bg-amber-500',
  HOSPITAL: 'bg-blue-500',
};

function CreateGroupForm({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <Card className="border-dashed border-2 border-primary/30">
      <CardContent className="p-6 text-center space-y-4">
        <Users className="w-12 h-12 mx-auto text-primary/50" />
        <h3 className="text-lg font-semibold">Create Your Pilgrim Group</h3>
        <p className="text-sm text-muted-foreground">Manage up to 150 pilgrims assigned to you</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <Input placeholder="Group name (e.g. Batch 12 - Delhi)" value={name} onChange={e => setName(e.target.value)} />
          <Button onClick={() => name.trim() && onCreate(name.trim())} disabled={!name.trim()}>Create</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddPilgrimDialog({ onAdd, currentCount, max }: { onAdd: (p: Partial<InspectorPilgrim>) => Promise<boolean>; currentCount: number; max: number }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    pilgrim_id: '', full_name: '', father_name: '', age: '', gender: 'Male',
    blood_group: '', phone: '', emergency_contact: '', passport_number: '',
    state: '', city: '', family_tag: '', wheelchair: false, disease: '',
    medical_conditions: '', notes: '',
  });

  const handleSubmit = async () => {
    if (!form.pilgrim_id || !form.full_name || !form.age) return;
    const success = await onAdd({
      pilgrim_id: form.pilgrim_id.trim(),
      full_name: form.full_name.trim(),
      father_name: form.father_name || null,
      age: parseInt(form.age),
      gender: form.gender as 'Male' | 'Female',
      blood_group: form.blood_group || null,
      phone: form.phone || null,
      emergency_contact: form.emergency_contact || null,
      passport_number: form.passport_number || null,
      state: form.state || null,
      city: form.city || null,
      family_tag: form.family_tag || null,
      wheelchair: form.wheelchair,
      disease: form.disease || 'None',
      medical_conditions: form.medical_conditions ? form.medical_conditions.split(',').map(s => s.trim()) : [],
      notes: form.notes || null,
    });
    if (success) {
      setForm({ pilgrim_id: '', full_name: '', father_name: '', age: '', gender: 'Male', blood_group: '', phone: '', emergency_contact: '', passport_number: '', state: '', city: '', family_tag: '', wheelchair: false, disease: '', medical_conditions: '', notes: '' });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={currentCount >= max}>
          <Plus className="w-4 h-4 mr-1" /> Add Pilgrim
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Pilgrim ({currentCount}/{max})</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Pilgrim ID *</Label><Input value={form.pilgrim_id} onChange={e => setForm(f => ({ ...f, pilgrim_id: e.target.value }))} placeholder="HCI2026-XXX" /></div>
            <div><Label>Full Name *</Label><Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Father's Name</Label><Input value={form.father_name} onChange={e => setForm(f => ({ ...f, father_name: e.target.value }))} /></div>
            <div><Label>Age *</Label><Input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Blood Group</Label><Input value={form.blood_group} onChange={e => setForm(f => ({ ...f, blood_group: e.target.value }))} placeholder="A+, B-, O+" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>Emergency Contact</Label><Input value={form.emergency_contact} onChange={e => setForm(f => ({ ...f, emergency_contact: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Passport No.</Label><Input value={form.passport_number} onChange={e => setForm(f => ({ ...f, passport_number: e.target.value }))} /></div>
            <div><Label>Family Tag</Label><Input value={form.family_tag} onChange={e => setForm(f => ({ ...f, family_tag: e.target.value }))} placeholder="Family A" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>State</Label><Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></div>
            <div><Label>City</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
          </div>
          <div><Label>Disease / Condition</Label><Input value={form.disease} onChange={e => setForm(f => ({ ...f, disease: e.target.value }))} placeholder="Diabetes, BP, None" /></div>
          <div><Label>Medical Conditions (comma separated)</Label><Input value={form.medical_conditions} onChange={e => setForm(f => ({ ...f, medical_conditions: e.target.value }))} placeholder="Heart Patient, Asthma" /></div>
          <div className="flex items-center gap-2">
            <Switch checked={form.wheelchair} onCheckedChange={v => setForm(f => ({ ...f, wheelchair: v }))} />
            <Label>Wheelchair Required</Label>
          </div>
          <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          <Button onClick={handleSubmit} className="w-full" disabled={!form.pilgrim_id || !form.full_name || !form.age}>Add Pilgrim</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BulkUploadDialog({ onBulkAdd }: { onBulkAdd: (list: Partial<InspectorPilgrim>[]) => Promise<number> }) {
  const [open, setOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [parsing, setParsing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): Partial<InspectorPilgrim>[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ''; });
      return {
        pilgrim_id: obj.pilgrim_id || obj.id || `P-${Math.random().toString(36).slice(2, 8)}`,
        full_name: obj.full_name || obj.name || 'Unknown',
        father_name: obj.father_name || null,
        age: parseInt(obj.age) || 40,
        gender: (obj.gender === 'Female' ? 'Female' : 'Male') as 'Male' | 'Female',
        blood_group: obj.blood_group || null,
        phone: obj.phone || null,
        emergency_contact: obj.emergency_contact || null,
        passport_number: obj.passport_number || obj.passport || null,
        state: obj.state || null,
        city: obj.city || null,
        family_tag: obj.family_tag || obj.family || null,
        wheelchair: obj.wheelchair === 'true' || obj.wheelchair === 'yes' || obj.wheelchair === '1',
        disease: obj.disease || 'None',
        medical_conditions: obj.medical_conditions ? obj.medical_conditions.split(';').map((s: string) => s.trim()) : [],
      };
    }).filter(p => p.full_name && p.full_name !== 'Unknown');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target?.result as string || '');
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    setParsing(true);
    const list = parseCSV(csvText);
    if (list.length === 0) {
      toast({ title: 'No valid records found', variant: 'destructive' });
      setParsing(false);
      return;
    }
    const count = await onBulkAdd(list);
    if (count > 0) { setCsvText(''); setOpen(false); }
    setParsing(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Upload className="w-4 h-4 mr-1" /> Bulk Upload</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Bulk Upload Pilgrims (CSV)</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">CSV headers: pilgrim_id, full_name, father_name, age, gender, blood_group, phone, emergency_contact, passport_number, state, city, family_tag, wheelchair, disease, medical_conditions</p>
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="block w-full text-sm" />
          <Textarea value={csvText} onChange={e => setCsvText(e.target.value)} rows={8} placeholder="Or paste CSV data here..." className="font-mono text-xs" />
          <Button onClick={handleUpload} disabled={!csvText.trim() || parsing} className="w-full">
            {parsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload & Process
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DemographicsPanel({ demographics }: { demographics: ReturnType<typeof useInspectorPilgrims>['demographics'] }) {
  const d = demographics;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total', value: d.total, icon: Users },
          { label: 'Male', value: d.male, icon: UserCheck },
          { label: 'Female', value: d.female, icon: UserCheck },
          { label: 'Seniors (60+)', value: d.seniors, icon: Heart },
          { label: 'Wheelchair', value: d.wheelchair, icon: Accessibility },
          { label: 'High Risk', value: d.medicalRisk, icon: AlertTriangle },
        ].map(s => (
          <Card key={s.label} className="text-center">
            <CardContent className="p-3">
              <s.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Age Distribution</CardTitle></CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {d.ageGroups.map(g => (
              <div key={g.label} className="flex items-center gap-2">
                <span className="text-xs w-12">{g.label}</span>
                <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${d.total > 0 ? (g.count / d.total) * 100 : 0}%` }} />
                </div>
                <span className="text-xs font-medium w-8 text-right">{g.count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Average Age: {d.avgAge} years</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Risk Classification</CardTitle></CardHeader>
        <CardContent className="p-3">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(d.riskDistribution).map(([k, v]) => (
              <Badge key={k} className={cn('text-white', RISK_COLORS[k])}>{k}: {v}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {d.suggestedLeaders.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500" /> Suggested Group Leaders</CardTitle></CardHeader>
          <CardContent className="p-3 space-y-2">
            {d.suggestedLeaders.map(l => (
              <div key={l.id} className="flex items-center justify-between text-sm border-b pb-1 last:border-0">
                <span className="font-medium">{l.full_name} ({l.age}y, {l.gender})</span>
                <span className="text-xs text-muted-foreground">{l.phone}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Criteria: Age 30-55, low risk, has phone</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmergencyPanel({ pilgrims, onStatusChange }: { pilgrims: InspectorPilgrim[]; onStatusChange: (id: string, status: InspectorPilgrim['status']) => void }) {
  const critical = pilgrims.filter(p => p.status !== 'NORMAL');
  const highRisk = pilgrims.filter(p => p.risk_level === 'critical' || p.risk_level === 'high');

  return (
    <div className="space-y-4">
      {critical.length === 0 && highRisk.length === 0 ? (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
          <CardContent className="p-6 text-center">
            <Shield className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">All Clear — No Active Emergencies</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {critical.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-destructive mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Active Alerts ({critical.length})</h3>
              <div className="space-y-2">
                {critical.map(p => (
                  <Card key={p.id} className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold">{p.full_name}</span>
                          <span className="text-xs ml-2 text-muted-foreground">{p.pilgrim_id}</span>
                        </div>
                        <Badge className={cn('text-white text-xs', STATUS_COLORS[p.status])}>{p.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2 text-xs text-muted-foreground">
                        <span>{p.age}y, {p.gender}</span>
                        {p.wheelchair && <Badge variant="outline" className="text-xs"><Accessibility className="w-3 h-3 mr-1" />Wheelchair</Badge>}
                        {p.disease !== 'None' && <Badge variant="outline" className="text-xs bg-destructive/10">{p.disease}</Badge>}
                      </div>
                      <div className="flex gap-1">
                        {(['NORMAL', 'EMERGENCY', 'MISSING', 'HOSPITAL'] as const).map(s => (
                          <Button key={s} size="sm" variant={p.status === s ? 'default' : 'outline'} className="text-xs flex-1" onClick={() => onStatusChange(p.id, s)}>{s}</Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {highRisk.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-amber-600 mb-2">⚠️ High Risk Pilgrims ({highRisk.length})</h3>
              <div className="space-y-1">
                {highRisk.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-sm bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2">
                    <span>{p.full_name} ({p.age}y)</span>
                    <div className="flex items-center gap-1">
                      <Badge className={cn('text-white text-xs', RISK_COLORS[p.risk_level])}>{p.risk_level}</Badge>
                      {p.phone && <a href={`tel:${p.phone}`}><Phone className="w-4 h-4 text-emerald-600" /></a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const InspectorGroupManagePage = () => {
  const { isInspector, hasAnyCoordinatorRole, isLoading: roleLoading } = useUserRole();
  const { group, pilgrims, isLoading, demographics, createGroup, updateGroupWhatsApp, addPilgrim, bulkAddPilgrims, updatePilgrimStatus, toggleGroupLeader, deletePilgrim } = useInspectorPilgrims();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [whatsAppLink, setWhatsAppLink] = useState('');

  const filtered = useMemo(() => {
    let list = pilgrims;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.full_name.toLowerCase().includes(q) || p.pilgrim_id.toLowerCase().includes(q) || (p.family_tag?.toLowerCase().includes(q)));
    }
    if (statusFilter !== 'ALL') list = list.filter(p => p.status === statusFilter);
    return list;
  }, [pilgrims, search, statusFilter]);

  if (isLoading || roleLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!isInspector && !hasAnyCoordinatorRole) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 py-16"><UnauthorizedAlert requiredRole="inspector" pageName="Pilgrim Group Management" /></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Pilgrim Group Management</h1>

        {!group ? (
          <CreateGroupForm onCreate={createGroup} />
        ) : (
          <>
            {/* Group Header */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{group.group_name}</h2>
                    <p className="text-xs text-muted-foreground">{pilgrims.length}/{group.max_capacity} pilgrims</p>
                  </div>
                  <div className="flex gap-2">
                    <AddPilgrimDialog onAdd={addPilgrim} currentCount={pilgrims.length} max={group.max_capacity} />
                    <BulkUploadDialog onBulkAdd={bulkAddPilgrims} />
                  </div>
                </div>
                {/* Capacity bar */}
                <div className="mt-2 bg-muted rounded-full h-2 overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", pilgrims.length > 130 ? 'bg-destructive' : 'bg-primary')} style={{ width: `${(pilgrims.length / group.max_capacity) * 100}%` }} />
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">WhatsApp Group</span>
                </div>
                {group.whatsapp_group_link ? (
                  <div className="flex items-center gap-2 mt-2">
                    <a href={group.whatsapp_group_link} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 underline flex items-center gap-1">
                      Open Group <ExternalLink className="w-3 h-3" />
                    </a>
                    <Button size="sm" variant="ghost" onClick={() => { setWhatsAppLink(''); updateGroupWhatsApp(''); }}>Remove</Button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="https://chat.whatsapp.com/..." value={whatsAppLink} onChange={e => setWhatsAppLink(e.target.value)} className="text-sm" />
                    <Button size="sm" onClick={() => whatsAppLink && updateGroupWhatsApp(whatsAppLink)}>Link</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="pilgrims" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="pilgrims">Pilgrims</TabsTrigger>
                <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4 mr-1" /> Analytics</TabsTrigger>
                <TabsTrigger value="emergency"><AlertTriangle className="w-4 h-4 mr-1" /> Emergency</TabsTrigger>
              </TabsList>

              <TabsContent value="pilgrims" className="space-y-3 mt-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search name, ID, family..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="EMERGENCY">Emergency</SelectItem>
                      <SelectItem value="MISSING">Missing</SelectItem>
                      <SelectItem value="HOSPITAL">Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-xs text-muted-foreground">{filtered.length} results</p>

                <div className="space-y-2 pb-20">
                  {filtered.map(p => (
                    <Card key={p.id} className={cn(p.status !== 'NORMAL' && 'border-l-4 border-l-destructive')}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {p.is_group_leader && <Crown className="w-4 h-4 text-amber-500" />}
                            <span className="font-bold text-sm">{p.full_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge className={cn('text-white text-xs', RISK_COLORS[p.risk_level])}>{p.risk_level}</Badge>
                            <Badge className={cn('text-white text-xs', STATUS_COLORS[p.status])}>{p.status}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{p.pilgrim_id}</span>
                          <span>{p.gender}, {p.age}y</span>
                          {p.blood_group && <span>🩸 {p.blood_group}</span>}
                          {p.family_tag && <span>👨‍👩‍👧 {p.family_tag}</span>}
                          {p.state && <span>📍 {p.state}</span>}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {p.wheelchair && <Badge variant="outline" className="text-xs"><Accessibility className="w-3 h-3 mr-1" />Wheelchair</Badge>}
                          {p.disease !== 'None' && <Badge variant="outline" className="text-xs bg-destructive/10"><Heart className="w-3 h-3 mr-1" />{p.disease}</Badge>}
                          {p.medical_conditions?.map((c, i) => <Badge key={i} variant="outline" className="text-xs">{c}</Badge>)}
                        </div>
                        <div className="flex gap-1 pt-1">
                          <Button size="sm" variant="ghost" className="text-xs" onClick={() => toggleGroupLeader(p.id)}>
                            <Crown className={cn("w-3 h-3 mr-1", p.is_group_leader && "text-amber-500")} />
                            {p.is_group_leader ? 'Remove Leader' : 'Make Leader'}
                          </Button>
                          {p.phone && <a href={`tel:${p.phone}`}><Button size="sm" variant="ghost" className="text-xs"><Phone className="w-3 h-3 mr-1" />Call</Button></a>}
                          <Button size="sm" variant="ghost" className="text-xs text-destructive ml-auto" onClick={() => deletePilgrim(p.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground">No pilgrims found</p>}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-3">
                <DemographicsPanel demographics={demographics} />
              </TabsContent>

              <TabsContent value="emergency" className="mt-3">
                <EmergencyPanel pilgrims={pilgrims} onStatusChange={updatePilgrimStatus} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default InspectorGroupManagePage;
