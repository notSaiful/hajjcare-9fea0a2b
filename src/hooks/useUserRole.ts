import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'coordinator' | 'medical_staff' | 'inspector' | 'user';

interface UserRole {
  role: AppRole;
  zone: string | null;
}

export const useUserRole = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMedicalStaff, setIsMedicalStaff] = useState(false);
  const [isInspector, setIsInspector] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role, zone')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching roles:', error);
          setIsLoading(false);
          return;
        }

        const userRoles = (data || []).map(r => ({
          role: r.role as AppRole,
          zone: r.zone
        }));
        
        setRoles(userRoles);
        setIsCoordinator(userRoles.some(r => r.role === 'coordinator'));
        setIsAdmin(userRoles.some(r => r.role === 'admin'));
        setIsMedicalStaff(userRoles.some(r => r.role === 'medical_staff'));
        setIsInspector(userRoles.some(r => r.role === 'inspector'));
      } catch (err) {
        console.error('Error in useUserRole:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRoles();
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasAnyCoordinatorRole = isCoordinator || isAdmin || isMedicalStaff || isInspector;

  return {
    roles,
    isLoading,
    isCoordinator,
    isAdmin,
    isMedicalStaff,
    isInspector,
    hasAnyCoordinatorRole,
  };
};
