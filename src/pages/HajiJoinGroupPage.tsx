import { useState } from 'react';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, CheckCircle2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HajiJoinGroupPage = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<'code' | 'form' | 'success'>('code');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ pilgrimId: string; groupName: string } | null>(null);

  const [form, setForm] = useState({
    fullName: '', age: '', gender: 'Male',
    bloodGroup: '', disease: '', wheelchair: false,
    medicalConditions: '',
  });

  const handleCodeSubmit = () => {
    if (inviteCode.trim().length < 4) {
      toast({ title: 'Enter a valid invite code', variant: 'destructive' });
      return;
    }
    setStep('form');
  };

  const handleRegister = async () => {
    if (!form.fullName.trim() || !form.age || !form.gender) {
      toast({ title: 'Name, age, and gender are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('haji-self-register', {
        body: {
          inviteCode: inviteCode.trim(),
          fullName: form.fullName.trim(),
          age: parseInt(form.age),
          gender: form.gender,
          bloodGroup: form.bloodGroup || undefined,
          disease: form.disease || undefined,
          wheelchair: form.wheelchair,
          medicalConditions: form.medicalConditions
            ? form.medicalConditions.split(',').map(s => s.trim()).filter(Boolean)
            : [],
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: data.error, variant: 'destructive' });
        if (data.error === 'Invalid invite code') setStep('code');
        return;
      }

      setResult({ pilgrimId: data.pilgrimId, groupName: data.groupName });
      setStep('success');
      toast({ title: 'Successfully registered!' });
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-md mx-auto px-4 py-16 text-center">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to join your inspector's group.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {step === 'code' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Join Inspector Group
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit invite code provided by your Haj Inspector to join their group.
              </p>
              <div>
                <Label>Invite Code</Label>
                <Input
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                />
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p>🔒 <strong>Your privacy is protected:</strong></p>
                <p>• No passport or Aadhaar details required</p>
                <p>• Only basic health info is collected</p>
                <p>• Data is shared only with your assigned inspector</p>
              </div>
              <Button onClick={handleCodeSubmit} className="w-full" disabled={inviteCode.length < 6}>
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'form' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Full Name *</Label>
                <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="As per Hajj documents" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Age *</Label>
                  <Input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Years" />
                </div>
                <div>
                  <Label>Gender *</Label>
                  <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Blood Group</Label>
                  <Input value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))} placeholder="A+, B-, O+" />
                </div>
                <div>
                  <Label>Medical Condition</Label>
                  <Input value={form.disease} onChange={e => setForm(f => ({ ...f, disease: e.target.value }))} placeholder="Diabetes, BP, None" />
                </div>
              </div>
              <div>
                <Label>Other Conditions (comma separated)</Label>
                <Input value={form.medicalConditions} onChange={e => setForm(f => ({ ...f, medicalConditions: e.target.value }))} placeholder="Heart Patient, Asthma" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.wheelchair} onCheckedChange={v => setForm(f => ({ ...f, wheelchair: v }))} />
                <Label>Wheelchair Required</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('code')} className="flex-1">Back</Button>
                <Button onClick={handleRegister} disabled={loading || !form.fullName || !form.age} className="flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'success' && result && (
          <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
            <CardContent className="p-6 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500" />
              <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Registration Successful!</h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your Pilgrim ID:</p>
                <Badge variant="outline" className="text-lg px-4 py-2 font-mono">{result.pilgrimId}</Badge>
                <p className="text-sm text-muted-foreground">Group: <strong>{result.groupName}</strong></p>
              </div>
              <p className="text-xs text-muted-foreground">Save your Pilgrim ID. You can now access your group dashboard for announcements and emergency assistance.</p>
              <Button onClick={() => navigate('/my-hajj-group')} className="w-full">Go to My Dashboard</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default HajiJoinGroupPage;
