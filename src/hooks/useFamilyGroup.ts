import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FamilyGroup {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  member_name: string;
  member_id: string;
  joined_at: string;
}

export interface MemberLocation {
  id: string;
  member_id: string;
  group_id: string;
  latitude: number;
  longitude: number;
  current_stage: string | null;
  updated_at: string;
  member_name?: string;
}

const MEMBER_ID_KEY = "hajj_member_id";
const GROUP_ID_KEY = "hajj_group_id";
const MEMBER_NAME_KEY = "hajj_member_name";

const getOrCreateMemberId = (): string => {
  let memberId = localStorage.getItem(MEMBER_ID_KEY);
  if (!memberId) {
    memberId = crypto.randomUUID();
    localStorage.setItem(MEMBER_ID_KEY, memberId);
  }
  return memberId;
};

export const useFamilyGroup = () => {
  const [group, setGroup] = useState<FamilyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [memberLocations, setMemberLocations] = useState<MemberLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberId] = useState(getOrCreateMemberId);
  const [memberName, setMemberName] = useState(localStorage.getItem(MEMBER_NAME_KEY) || "");
  const { toast } = useToast();

  const loadGroup = useCallback(async () => {
    const groupId = localStorage.getItem(GROUP_ID_KEY);
    if (!groupId) return;

    setIsLoading(true);
    try {
      const { data: groupData, error: groupError } = await supabase
        .from("family_groups")
        .select("*")
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      const { data: membersData, error: membersError } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId);

      if (membersError) throw membersError;
      setMembers(membersData || []);

      const { data: locationsData, error: locationsError } = await supabase
        .from("member_locations")
        .select("*")
        .eq("group_id", groupId);

      if (locationsError) throw locationsError;
      
      // Merge member names with locations
      const locationsWithNames = (locationsData || []).map(loc => {
        const member = (membersData || []).find(m => m.member_id === loc.member_id);
        return { ...loc, member_name: member?.member_name };
      });
      setMemberLocations(locationsWithNames);
    } catch (error) {
      console.error("Error loading group:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  // Subscribe to realtime location updates
  useEffect(() => {
    const groupId = localStorage.getItem(GROUP_ID_KEY);
    if (!groupId) return;

    const channel = supabase
      .channel("member-locations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "member_locations",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const newLoc = payload.new as MemberLocation;
            const member = members.find(m => m.member_id === newLoc.member_id);
            setMemberLocations(prev => {
              const existing = prev.findIndex(l => l.member_id === newLoc.member_id);
              const locWithName = { ...newLoc, member_name: member?.member_name };
              if (existing >= 0) {
                return prev.map((l, i) => i === existing ? locWithName : l);
              }
              return [...prev, locWithName];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [members]);

  const createGroup = async (groupName: string, creatorName: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem(MEMBER_NAME_KEY, creatorName);
      setMemberName(creatorName);

      const { data: groupData, error: groupError } = await supabase
        .from("family_groups")
        .insert({ name: groupName, created_by: memberId })
        .select()
        .single();

      if (groupError) throw groupError;

      const { error: memberError } = await supabase
        .from("group_members")
        .insert({ group_id: groupData.id, member_name: creatorName, member_id: memberId });

      if (memberError) throw memberError;

      localStorage.setItem(GROUP_ID_KEY, groupData.id);
      setGroup(groupData);
      setMembers([{ id: "", group_id: groupData.id, member_name: creatorName, member_id: memberId, joined_at: new Date().toISOString() }]);
      
      toast({ title: "Success", description: "Family group created!" });
      return groupData;
    } catch (error) {
      console.error("Error creating group:", error);
      toast({ title: "Error", description: "Failed to create group", variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (inviteCode: string, userName: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem(MEMBER_NAME_KEY, userName);
      setMemberName(userName);

      const { data: groupData, error: groupError } = await supabase
        .from("family_groups")
        .select("*")
        .eq("invite_code", inviteCode.toLowerCase())
        .single();

      if (groupError || !groupData) {
        toast({ title: "Error", description: "Invalid invite code", variant: "destructive" });
        return null;
      }

      const { error: memberError } = await supabase
        .from("group_members")
        .insert({ group_id: groupData.id, member_name: userName, member_id: memberId });

      if (memberError) {
        if (memberError.code === "23505") {
          toast({ title: "Info", description: "You're already in this group" });
          localStorage.setItem(GROUP_ID_KEY, groupData.id);
          await loadGroup();
          return groupData;
        }
        throw memberError;
      }

      localStorage.setItem(GROUP_ID_KEY, groupData.id);
      setGroup(groupData);
      await loadGroup();
      
      toast({ title: "Success", description: "Joined family group!" });
      return groupData;
    } catch (error) {
      console.error("Error joining group:", error);
      toast({ title: "Error", description: "Failed to join group", variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveGroup = async () => {
    const groupId = localStorage.getItem(GROUP_ID_KEY);
    if (!groupId) return;

    try {
      await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("member_id", memberId);

      await supabase
        .from("member_locations")
        .delete()
        .eq("group_id", groupId)
        .eq("member_id", memberId);

      localStorage.removeItem(GROUP_ID_KEY);
      setGroup(null);
      setMembers([]);
      setMemberLocations([]);
      
      toast({ title: "Success", description: "Left the group" });
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({ title: "Error", description: "Failed to leave group", variant: "destructive" });
    }
  };

  const updateLocation = async (latitude: number, longitude: number, currentStage: string | null) => {
    const groupId = localStorage.getItem(GROUP_ID_KEY);
    if (!groupId) return;

    try {
      await supabase.rpc("upsert_member_location", {
        p_member_id: memberId,
        p_group_id: groupId,
        p_latitude: latitude,
        p_longitude: longitude,
        p_current_stage: currentStage,
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return {
    group,
    members,
    memberLocations,
    isLoading,
    memberId,
    memberName,
    createGroup,
    joinGroup,
    leaveGroup,
    updateLocation,
    refreshGroup: loadGroup,
  };
};
