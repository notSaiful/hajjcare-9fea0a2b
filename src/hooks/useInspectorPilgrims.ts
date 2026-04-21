import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface InspectorPilgrim {
  id: string;
  group_id: string;
  inspector_user_id: string;
  pilgrim_id: string;
  full_name: string;
  father_name: string | null;
  age: number;
  gender: 'Male' | 'Female';
  blood_group: string | null;
  phone: string | null;
  emergency_contact: string | null;
  passport_number: string | null;
  state: string | null;
  city: string | null;
  family_tag: string | null;
  wheelchair: boolean;
  medical_conditions: string[];
  disease: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'NORMAL' | 'EMERGENCY' | 'MISSING' | 'HOSPITAL';
  is_group_leader: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InspectorGroup {
  id: string;
  inspector_user_id: string;
  group_name: string;
  whatsapp_group_link: string | null;
  invite_code: string | null;
  max_capacity: number;
  created_at: string;
  updated_at: string;
}

export interface DemographicAnalysis {
  total: number;
  male: number;
  female: number;
  seniors: number;
  wheelchair: number;
  medicalRisk: number;
  avgAge: number;
  ageGroups: { label: string; count: number }[];
  riskDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  stateDistribution: Record<string, number>;
  suggestedLeaders: InspectorPilgrim[];
}

function computeRiskLevel(p: Partial<InspectorPilgrim>): InspectorPilgrim['risk_level'] {
  let score = 0;
  if ((p.age ?? 0) > 70) score += 3;
  else if ((p.age ?? 0) > 60) score += 2;
  if (p.wheelchair) score += 2;
  if ((p.medical_conditions?.length ?? 0) > 0) score += 1;
  if (p.disease && p.disease !== 'None') score += 1;
  if (score >= 5) return 'critical';
  if (score >= 3) return 'high';
  if (score >= 1) return 'medium';
  return 'low';
}

export function useInspectorPilgrims() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [group, setGroup] = useState<InspectorGroup | null>(null);
  const [pilgrims, setPilgrims] = useState<InspectorPilgrim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroup = useCallback(async () => {
    if (!user) return;
    const { data, error } = await (supabase as any)
      .from('inspector_pilgrim_groups')
      .select('*')
      .eq('inspector_user_id', user.id)
      .maybeSingle();
    if (!error && data) setGroup(data);
    else setGroup(null);
  }, [user]);

  const createGroup = useCallback(async (name: string) => {
    if (!user) return null;
    const { data, error } = await (supabase as any)
      .from('inspector_pilgrim_groups')
      .insert({ inspector_user_id: user.id, group_name: name })
      .select()
      .single();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
    setGroup(data);
    return data;
  }, [user, toast]);

  const updateGroupWhatsApp = useCallback(async (link: string) => {
    if (!group) return;
    await (supabase as any)
      .from('inspector_pilgrim_groups')
      .update({ whatsapp_group_link: link })
      .eq('id', group.id);
    setGroup(prev => prev ? { ...prev, whatsapp_group_link: link } : null);
    toast({ title: 'WhatsApp link updated' });
  }, [group, toast]);

  const fetchPilgrims = useCallback(async () => {
    if (!group) { setPilgrims([]); return; }
    const { data, error } = await (supabase as any)
      .from('inspector_pilgrims')
      .select('*')
      .eq('group_id', group.id)
      .order('created_at', { ascending: false });
    if (!error) setPilgrims(data || []);
  }, [group]);

  const addPilgrim = useCallback(async (pilgrim: Partial<InspectorPilgrim>) => {
    if (!group || !user) return false;
    if (pilgrims.length >= group.max_capacity) {
      toast({ title: 'Group full', description: `Max ${group.max_capacity} pilgrims`, variant: 'destructive' });
      return false;
    }
    const risk_level = computeRiskLevel(pilgrim);
    const { error } = await (supabase as any)
      .from('inspector_pilgrims')
      .insert({
        ...pilgrim,
        group_id: group.id,
        inspector_user_id: user.id,
        risk_level,
        medical_conditions: pilgrim.medical_conditions || [],
      });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    await fetchPilgrims();
    toast({ title: 'Pilgrim added' });
    return true;
  }, [group, user, pilgrims.length, fetchPilgrims, toast]);

  const bulkAddPilgrims = useCallback(async (pilgrimList: Partial<InspectorPilgrim>[]) => {
    if (!group || !user) return 0;
    const remaining = group.max_capacity - pilgrims.length;
    const toAdd = pilgrimList.slice(0, remaining).map(p => ({
      ...p,
      group_id: group.id,
      inspector_user_id: user.id,
      risk_level: computeRiskLevel(p),
      medical_conditions: p.medical_conditions || [],
    }));
    if (toAdd.length === 0) return 0;
    const { error, data } = await (supabase as any)
      .from('inspector_pilgrims')
      .insert(toAdd)
      .select();
    if (error) {
      toast({ title: 'Bulk upload error', description: error.message, variant: 'destructive' });
      return 0;
    }
    await fetchPilgrims();
    toast({ title: `${data?.length || 0} pilgrims added` });
    return data?.length || 0;
  }, [group, user, pilgrims.length, fetchPilgrims, toast]);

  const updatePilgrimStatus = useCallback(async (id: string, status: InspectorPilgrim['status']) => {
    const { error } = await (supabase as any)
      .from('inspector_pilgrims')
      .update({ status })
      .eq('id', id);
    if (!error) {
      setPilgrims(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      toast({ title: `Status → ${status}` });
    }
  }, [toast]);

  const toggleGroupLeader = useCallback(async (id: string) => {
    const pilgrim = pilgrims.find(p => p.id === id);
    if (!pilgrim) return;
    await (supabase as any)
      .from('inspector_pilgrims')
      .update({ is_group_leader: !pilgrim.is_group_leader })
      .eq('id', id);
    setPilgrims(prev => prev.map(p => p.id === id ? { ...p, is_group_leader: !p.is_group_leader } : p));
  }, [pilgrims]);

  const deletePilgrim = useCallback(async (id: string) => {
    await (supabase as any).from('inspector_pilgrims').delete().eq('id', id);
    setPilgrims(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Pilgrim removed' });
  }, [toast]);

  // Demographics analysis
  const demographics = useMemo((): DemographicAnalysis => {
    const total = pilgrims.length;
    const male = pilgrims.filter(p => p.gender === 'Male').length;
    const female = pilgrims.filter(p => p.gender === 'Female').length;
    const seniors = pilgrims.filter(p => p.age > 60).length;
    const wheelchair = pilgrims.filter(p => p.wheelchair).length;
    const medicalRisk = pilgrims.filter(p => p.risk_level === 'high' || p.risk_level === 'critical').length;
    const avgAge = total > 0 ? Math.round(pilgrims.reduce((s, p) => s + p.age, 0) / total) : 0;

    const ageGroups = [
      { label: '18-30', count: pilgrims.filter(p => p.age >= 18 && p.age <= 30).length },
      { label: '31-45', count: pilgrims.filter(p => p.age >= 31 && p.age <= 45).length },
      { label: '46-60', count: pilgrims.filter(p => p.age >= 46 && p.age <= 60).length },
      { label: '61-70', count: pilgrims.filter(p => p.age >= 61 && p.age <= 70).length },
      { label: '70+', count: pilgrims.filter(p => p.age > 70).length },
    ];

    const riskDistribution: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const statusDistribution: Record<string, number> = { NORMAL: 0, EMERGENCY: 0, MISSING: 0, HOSPITAL: 0 };
    const stateDistribution: Record<string, number> = {};

    pilgrims.forEach(p => {
      riskDistribution[p.risk_level] = (riskDistribution[p.risk_level] || 0) + 1;
      statusDistribution[p.status] = (statusDistribution[p.status] || 0) + 1;
      if (p.state) stateDistribution[p.state] = (stateDistribution[p.state] || 0) + 1;
    });

    // Auto-suggest group leaders: age 30-55, no medical risk, male or female
    const suggestedLeaders = pilgrims.filter(p =>
      p.age >= 30 && p.age <= 55 &&
      p.risk_level === 'low' &&
      !p.wheelchair &&
      p.phone
    ).slice(0, 5);

    return { total, male, female, seniors, wheelchair, medicalRisk, avgAge, ageGroups, riskDistribution, statusDistribution, stateDistribution, suggestedLeaders };
  }, [pilgrims]);

  useEffect(() => {
    setIsLoading(true);
    fetchGroup().finally(() => setIsLoading(false));
  }, [fetchGroup]);

  useEffect(() => {
    if (group) fetchPilgrims();
  }, [group, fetchPilgrims]);

  // Polling fallback (Realtime disabled for inspector_pilgrims due to sensitive PII)
  useEffect(() => {
    if (!group) return;
    const interval = setInterval(() => { fetchPilgrims(); }, 30000);
    return () => clearInterval(interval);
  }, [group, fetchPilgrims]);

  return {
    group, pilgrims, isLoading, demographics,
    createGroup, updateGroupWhatsApp,
    addPilgrim, bulkAddPilgrims, updatePilgrimStatus,
    toggleGroupLeader, deletePilgrim, fetchPilgrims,
  };
}
