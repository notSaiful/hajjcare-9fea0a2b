import React, { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  UserCog,
  ShieldCheck,
  Crown,
  ClipboardList,
  Stethoscope,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type AppRole = 'admin' | 'coordinator' | 'medical_staff' | 'inspector';

interface LookupResult {
  user_id: string;
  email: string | null;
  full_name: string | null;
  current_roles: Array<{ id: string; role: AppRole | 'user'; zone: string | null }>;
}

const roleOptions: Array<{ value: AppRole; label: string; icon: React.ElementType; color: string }> = [
  { value: 'inspector', label: 'Inspector', icon: ShieldCheck, color: 'text-emerald-600' },
  { value: 'coordinator', label: 'Coordinator', icon: ClipboardList, color: 'text-blue-600' },
  { value: 'medical_staff', label: 'Medical Staff', icon: Stethoscope, color: 'text-green-600' },
  { value: 'admin', label: 'Admin', icon: Crown, color: 'text-amber-600' },
];

const zoneOptions = [
  { value: 'none', label: 'No zone' },
  { value: 'general', label: 'General' },
  { value: 'makkah_medical', label: 'Makkah Medical' },
  { value: 'madinah_medical', label: 'Madinah Medical' },
  { value: 'mina_medical', label: 'Mina Medical' },
  { value: 'arafat_medical', label: 'Arafat Medical' },
];

// Accept either a UUID or an email
const identifierSchema = z
  .string()
  .trim()
  .min(3, 'Enter an email or user ID')
  .max(320, 'Identifier is too long')
  .refine(
    (v) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v) ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'Must be a valid email address or user ID (UUID)'
  );

/**
 * Quick role assignment by email or user ID.
 * Calls SECURITY DEFINER RPCs that admin-gate themselves on the server.
 */
export const RoleAssignByIdentifier: React.FC<{ onAssigned?: () => void }> = ({ onAssigned }) => {
  const [identifier, setIdentifier] = useState('');
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedRole, setSelectedRole] = useState<AppRole>('inspector');
  const [selectedZone, setSelectedZone] = useState<string>('none');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleSearch = async () => {
    setLookupError(null);
    setLookup(null);

    const parsed = identifierSchema.safeParse(identifier);
    if (!parsed.success) {
      setLookupError(parsed.error.errors[0]?.message ?? 'Invalid identifier');
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.rpc('lookup_user_for_role_assignment', {
        p_identifier: parsed.data,
      });

      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      if (!row || !row.user_id) {
        setLookupError('No user found with this email or ID');
        return;
      }

      setLookup({
        user_id: row.user_id,
        email: row.email,
        full_name: row.full_name,
        current_roles: (row.current_roles ?? []) as LookupResult['current_roles'],
      });
    } catch (err: any) {
      console.error('Lookup error:', err);
      setLookupError(err?.message ?? 'Lookup failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!lookup) return;
    setIsAssigning(true);
    try {
      const { data, error } = await supabase.rpc('assign_user_role', {
        p_identifier: lookup.user_id,
        p_role: selectedRole,
        p_zone: selectedZone === 'none' ? null : selectedZone,
      });

      if (error) throw error;

      const result = data as { success: boolean; already_existed?: boolean; error?: string };
      if (!result?.success) {
        toast.error(result?.error || 'Failed to assign role');
        return;
      }

      toast.success(
        result.already_existed
          ? `Role already assigned${selectedZone !== 'none' ? ' — zone updated' : ''}`
          : `${selectedRole} role assigned successfully`
      );

      // Refresh inline lookup
      await handleSearch();
      onAssigned?.();
    } catch (err: any) {
      console.error('Assign error:', err);
      toast.error(err?.message ?? 'Failed to assign role');
    } finally {
      setIsAssigning(false);
    }
  };

  const supportsZone = selectedRole !== 'admin' && selectedRole !== 'inspector';

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCog className="w-5 h-5 text-primary" />
          Assign role by email or user ID
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Look up any signed-in user by their email or user ID, then grant the inspector,
          coordinator, medical staff, or admin role.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="role-identifier">Email or user ID</Label>
          <div className="flex gap-2">
            <Input
              id="role-identifier"
              placeholder="user@example.com or 00000000-0000-0000-0000-000000000000"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              maxLength={320}
              autoComplete="off"
              spellCheck={false}
            />
            <Button onClick={handleSearch} disabled={isSearching || !identifier.trim()}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="ml-1 hidden sm:inline">Find</span>
            </Button>
          </div>
          {lookupError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>

        {/* Lookup result */}
        {lookup && (
          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground">
                  {lookup.full_name || 'Unnamed user'}
                </div>
                <div className="text-sm text-muted-foreground break-all">
                  {lookup.email || '(no email)'}
                </div>
                <div className="text-xs text-muted-foreground/80 font-mono break-all mt-1">
                  {lookup.user_id}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs font-medium text-muted-foreground self-center">
                Current roles:
              </span>
              {lookup.current_roles.length === 0 ? (
                <Badge variant="outline">None</Badge>
              ) : (
                lookup.current_roles.map((r) => (
                  <Badge key={r.id} variant="secondary">
                    {r.role}
                    {r.zone ? ` · ${r.zone}` : ''}
                  </Badge>
                ))
              )}
            </div>

            {/* Assignment controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="role-select">Role to assign</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                  <SelectTrigger id="role-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(({ value, label, icon: Icon, color }) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${color}`} />
                          {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {supportsZone && (
                <div className="space-y-1.5">
                  <Label htmlFor="zone-select">Zone (optional)</Label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger id="zone-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {zoneOptions.map((z) => (
                        <SelectItem key={z.value} value={z.value}>
                          {z.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Button onClick={handleAssign} disabled={isAssigning} className="w-full sm:w-auto">
              {isAssigning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 mr-2" />
              )}
              Assign {roleOptions.find((r) => r.value === selectedRole)?.label}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleAssignByIdentifier;
