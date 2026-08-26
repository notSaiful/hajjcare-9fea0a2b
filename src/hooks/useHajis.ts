import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Haji } from '@/types/haji';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error: dbError } = await supabase
        .from('hajis' as never)
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) {
        console.error('Unable to load Hajis:', dbError.message);
        setHajis([]);
        setError('Hajis are temporarily unavailable. Please try again later.');
        setIsUsingDemo(false);
      } else {
        setHajis((data as unknown as Haji[]) || []);
        setIsUsingDemo(false);
      }
    } catch (err: unknown) {
      console.error('Error fetching hajis:', err);
      setHajis([]);
      setError('Hajis are temporarily unavailable. Please try again later.');
      setIsUsingDemo(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateHajiStatus = useCallback(async (hajiId: string, status: Haji['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('hajis' as never)
        .update({ status } as never)
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
  }, [fetchHajis, toast]);

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
