import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { PilgrimStatus } from "@/data/familyDashboardContent";

const GROUP_ID_KEY = "hajj_group_id";

interface UsePilgrimStatusResult {
  status: PilgrimStatus;
  sharingEnabled: boolean;
  lastUpdated: string | null;
  isLoading: boolean;
  updateStatus: (newStatus: PilgrimStatus) => Promise<void>;
  toggleSharing: (enabled: boolean) => Promise<void>;
  refreshStatus: () => Promise<void>;
}

export const usePilgrimStatus = (): UsePilgrimStatusResult => {
  const [status, setStatus] = useState<PilgrimStatus>("normal");
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadStatus = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Load sharing preference from profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("family_sharing_enabled")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setSharingEnabled(profileData.family_sharing_enabled ?? false);
      }

      // Load current status from member_locations
      const groupId = localStorage.getItem(GROUP_ID_KEY);
      if (groupId) {
        const { data: locationData } = await supabase
          .from("member_locations")
          .select("pilgrim_status, updated_at")
          .eq("group_id", groupId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (locationData) {
          setStatus((locationData.pilgrim_status as PilgrimStatus) || "normal");
          setLastUpdated(locationData.updated_at);
        }
      }
    } catch (error) {
      console.error("Error loading pilgrim status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const updateStatus = useCallback(async (newStatus: PilgrimStatus) => {
    if (!user) return;

    const groupId = localStorage.getItem(GROUP_ID_KEY);
    if (!groupId) {
      toast({
        title: "Error",
        description: "Please join a family group first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the RPC function to update status along with location
      const { error } = await supabase.rpc("upsert_member_location", {
        p_group_id: groupId,
        p_latitude: 0,
        p_longitude: 0,
        p_current_stage: null,
        p_pilgrim_status: newStatus,
      });

      if (error) throw error;

      setStatus(newStatus);
      setLastUpdated(new Date().toISOString());
      
      toast({
        title: "Status Updated",
        description: "Your status has been updated",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const toggleSharing = useCallback(async (enabled: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ family_sharing_enabled: enabled })
        .eq("user_id", user.id);

      if (error) throw error;

      setSharingEnabled(enabled);
      
      toast({
        title: enabled ? "Sharing Enabled" : "Sharing Disabled",
        description: enabled 
          ? "Family can now see your status" 
          : "Your status is now private",
      });
    } catch (error) {
      console.error("Error toggling sharing:", error);
      toast({
        title: "Error",
        description: "Failed to update sharing preference",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  return {
    status,
    sharingEnabled,
    lastUpdated,
    isLoading,
    updateStatus,
    toggleSharing,
    refreshStatus: loadStatus,
  };
};
