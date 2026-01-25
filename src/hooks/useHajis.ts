import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Haji } from '@/types/haji';
import { useToast } from '@/hooks/use-toast';

// Demo data for when database table doesn't exist yet
const DEMO_HAJIS: Haji[] = [
  { id: '1', haji_id: 'H001', name: 'Ahmed Ali', gender: 'Male', age: 68, family_id: 'F01', wheelchair: true, disease: 'Diabetes', blood_group: 'O+', status: 'NORMAL', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', haji_id: 'H002', name: 'Fatima Begum', gender: 'Female', age: 62, family_id: 'F01', wheelchair: false, disease: 'BP', blood_group: 'A+', status: 'EMERGENCY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', haji_id: 'H003', name: 'Salman Khan', gender: 'Male', age: 45, family_id: 'F02', wheelchair: false, disease: 'None', blood_group: 'B+', status: 'NORMAL', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', haji_id: 'H004', name: 'Aisha Rahman', gender: 'Female', age: 71, family_id: 'F03', wheelchair: true, disease: 'Heart Disease', blood_group: 'AB+', status: 'HOSPITAL', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', haji_id: 'H005', name: 'Mohammed Hussain', gender: 'Male', age: 55, family_id: 'F02', wheelchair: false, disease: 'Asthma', blood_group: 'A-', status: 'NORMAL', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', haji_id: 'H006', name: 'Zainab Khatun', gender: 'Female', age: 78, family_id: 'F04', wheelchair: true, disease: 'Arthritis', blood_group: 'B-', status: 'MISSING', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export function useHajis() {
  const [hajis, setHajis] = useState<Haji[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDemo, setIsUsingDemo] = useState(false);
  const { toast } = useToast();

  const fetchHajis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from database - use type assertion since table may not exist
      const { data, error: dbError } = await (supabase as any)
        .from('hajis')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) {
        // Table might not exist yet, use demo data
        console.log('Using demo data:', dbError.message);
        setHajis(DEMO_HAJIS);
        setIsUsingDemo(true);
      } else {
        setHajis((data as Haji[]) || []);
        setIsUsingDemo(false);
      }
    } catch (err) {
      console.error('Error fetching hajis:', err);
      setHajis(DEMO_HAJIS);
      setIsUsingDemo(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateHajiStatus = useCallback(async (hajiId: string, status: Haji['status']) => {
    if (isUsingDemo) {
      // Update demo data locally
      setHajis(prev => prev.map(h => 
        h.id === hajiId ? { ...h, status, updated_at: new Date().toISOString() } : h
      ));
      toast({ title: 'Status Updated', description: `Status changed to ${status}` });
      return true;
    }

    try {
      const { error: updateError } = await (supabase as any)
        .from('hajis')
        .update({ status })
        .eq('id', hajiId);

      if (updateError) throw updateError;
      
      await fetchHajis();
      toast({ title: 'Status Updated', description: `Status changed to ${status}` });
      return true;
    } catch (err) {
      console.error('Error updating status:', err);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
      return false;
    }
  }, [isUsingDemo, fetchHajis, toast]);

  useEffect(() => {
    fetchHajis();
  }, [fetchHajis]);

  // Realtime subscription
  useEffect(() => {
    if (isUsingDemo) return;

    const channel = supabase
      .channel('hajis-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hajis' },
        () => {
          fetchHajis();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isUsingDemo, fetchHajis]);

  return {
    hajis,
    isLoading,
    error,
    isUsingDemo,
    fetchHajis,
    updateHajiStatus,
  };
}
