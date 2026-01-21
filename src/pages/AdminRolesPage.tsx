import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Users, 
  UserPlus, 
  Trash2, 
  RefreshCw,
  Search,
  Crown,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';

type AppRole = 'admin' | 'coordinator' | 'medical_staff' | 'user';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  email?: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  zone: string | null;
  created_at: string;
}

const roleConfig: Record<AppRole, { icon: React.ElementType; color: string; label: string }> = {
  admin: { icon: Crown, color: 'bg-amber-500', label: 'Admin' },
  coordinator: { icon: ClipboardList, color: 'bg-blue-500', label: 'Coordinator' },
  medical_staff: { icon: Stethoscope, color: 'bg-green-500', label: 'Medical Staff' },
  user: { icon: Users, color: 'bg-gray-500', label: 'User' },
};

const zones = [
  { value: 'makkah_medical', label: 'Makkah Medical' },
  { value: 'madinah_medical', label: 'Madinah Medical' },
  { value: 'mina_medical', label: 'Mina Medical' },
  { value: 'arafat_medical', label: 'Arafat Medical' },
  { value: 'general', label: 'General' },
];

const AdminRolesPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<AppRole>('coordinator');
  const [newZone, setNewZone] = useState<string>('general');
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const labels = {
    title: { en: 'Role Management', hi: 'भूमिका प्रबंधन' },
    subtitle: { en: 'Assign and manage user roles', hi: 'उपयोगकर्ता भूमिकाएं असाइन और प्रबंधित करें' },
    noAccess: { en: 'Access Denied', hi: 'पहुंच अस्वीकृत' },
    noAccessDesc: { en: 'Only administrators can access this page.', hi: 'केवल व्यवस्थापक ही इस पृष्ठ तक पहुंच सकते हैं।' },
    searchPlaceholder: { en: 'Search by name or phone...', hi: 'नाम या फोन से खोजें...' },
    refresh: { en: 'Refresh', hi: 'रिफ्रेश' },
    addRole: { en: 'Add Role', hi: 'भूमिका जोड़ें' },
    removeRole: { en: 'Remove', hi: 'हटाएं' },
    noUsers: { en: 'No users found', hi: 'कोई उपयोगकर्ता नहीं मिला' },
    selectRole: { en: 'Select Role', hi: 'भूमिका चुनें' },
    selectZone: { en: 'Select Zone (optional)', hi: 'ज़ोन चुनें (वैकल्पिक)' },
    save: { en: 'Save Role', hi: 'भूमिका सहेजें' },
    cancel: { en: 'Cancel', hi: 'रद्द करें' },
    roleAdded: { en: 'Role added successfully', hi: 'भूमिका सफलतापूर्वक जोड़ी गई' },
    roleRemoved: { en: 'Role removed successfully', hi: 'भूमिका सफलतापूर्वक हटाई गई' },
    totalUsers: { en: 'Total Users', hi: 'कुल उपयोगकर्ता' },
    admins: { en: 'Admins', hi: 'व्यवस्थापक' },
    coordinators: { en: 'Coordinators', hi: 'समन्वयक' },
    medicalStaff: { en: 'Medical Staff', hi: 'चिकित्सा कर्मचारी' },
  };

  const t = (key: keyof typeof labels) => labels[key][language as 'en' | 'hi'] || labels[key].en;

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      fetchData();
    }
  }, [roleLoading, isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all profiles (admin can see all)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, phone')
        .order('full_name', { ascending: true });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      setProfiles(profilesData || []);
      setUserRoles(rolesData as UserRole[] || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!selectedUserId || !newRole) return;

    setIsAddingRole(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUserId,
          role: newRole,
          zone: newRole !== 'admin' ? newZone : null,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('User already has this role');
        } else {
          throw error;
        }
      } else {
        toast.success(t('roleAdded'));
        setDialogOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error adding role:', err);
      toast.error('Failed to add role');
    } finally {
      setIsAddingRole(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast.success(t('roleRemoved'));
      setUserRoles(prev => prev.filter(r => r.id !== roleId));
    } catch (err) {
      console.error('Error removing role:', err);
      toast.error('Failed to remove role');
    }
  };

  const getUserRoles = (userId: string) => {
    return userRoles.filter(r => r.user_id === userId);
  };

  const filteredProfiles = profiles.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(query) ||
      p.phone?.includes(query)
    );
  });

  const stats = {
    total: profiles.length,
    admins: userRoles.filter(r => r.role === 'admin').length,
    coordinators: userRoles.filter(r => r.role === 'coordinator').length,
    medical: userRoles.filter(r => r.role === 'medical_staff').length,
  };

  if (roleLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <Shield className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">{t('noAccess')}</h1>
          <p className="text-muted-foreground mb-4">{t('noAccessDesc')}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">{t('totalUsers')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold text-foreground">{stats.admins}</div>
              <div className="text-xs text-muted-foreground">{t('admins')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ClipboardList className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-foreground">{stats.coordinators}</div>
              <div className="text-xs text-muted-foreground">{t('coordinators')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Stethoscope className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-foreground">{stats.medical}</div>
              <div className="text-xs text-muted-foreground">{t('medicalStaff')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('noUsers')}
            </div>
          ) : (
            filteredProfiles.map((profile) => {
              const roles = getUserRoles(profile.user_id);
              return (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">
                          {profile.full_name || 'Unnamed User'}
                        </div>
                        {profile.phone && (
                          <div className="text-sm text-muted-foreground">{profile.phone}</div>
                        )}
                        
                        {/* User's roles */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {roles.length === 0 ? (
                            <Badge variant="outline" className="text-muted-foreground">
                              No roles assigned
                            </Badge>
                          ) : (
                            roles.map((role) => {
                              const config = roleConfig[role.role];
                              const Icon = config.icon;
                              return (
                                <Badge 
                                  key={role.id} 
                                  className={`${config.color} text-white flex items-center gap-1`}
                                >
                                  <Icon className="w-3 h-3" />
                                  {config.label}
                                  {role.zone && <span className="opacity-75">({role.zone.replace('_', ' ')})</span>}
                                  <button
                                    onClick={() => handleRemoveRole(role.id)}
                                    className="ml-1 hover:bg-white/20 rounded p-0.5"
                                    title={t('removeRole')}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </Badge>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Add Role Button */}
                      <Dialog open={dialogOpen && selectedUserId === profile.user_id} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (open) setSelectedUserId(profile.user_id);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserPlus className="w-4 h-4 mr-1" />
                            {t('addRole')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <UserPlus className="w-5 h-5" />
                              {t('addRole')} - {profile.full_name || 'User'}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>{t('selectRole')}</Label>
                              <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                      <Crown className="w-4 h-4 text-amber-500" />
                                      Admin
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="coordinator">
                                    <div className="flex items-center gap-2">
                                      <ClipboardList className="w-4 h-4 text-blue-500" />
                                      Coordinator
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="medical_staff">
                                    <div className="flex items-center gap-2">
                                      <Stethoscope className="w-4 h-4 text-green-500" />
                                      Medical Staff
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {newRole !== 'admin' && (
                              <div className="space-y-2">
                                <Label>{t('selectZone')}</Label>
                                <Select value={newZone} onValueChange={setNewZone}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {zones.map((zone) => (
                                      <SelectItem key={zone.value} value={zone.value}>
                                        {zone.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                              {t('cancel')}
                            </Button>
                            <Button onClick={handleAddRole} disabled={isAddingRole}>
                              {isAddingRole ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <UserPlus className="w-4 h-4 mr-2" />
                              )}
                              {t('save')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminRolesPage;
