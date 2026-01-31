import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const GROUP_ID_KEY = "hajj_group_id";

interface UseSukoonNotifyReturn {
  notifyFamilyOfStageChange: (newStage: string, memberName?: string) => Promise<boolean>;
}

/**
 * Hook to notify family members via WhatsApp when a Haji reaches a new ritual stage
 */
export const useSukoonNotify = (): UseSukoonNotifyReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const lastNotifiedStage = useRef<string | null>(null);

  const notifyFamilyOfStageChange = useCallback(async (
    newStage: string,
    memberName?: string
  ): Promise<boolean> => {
    // Prevent duplicate notifications for the same stage
    if (lastNotifiedStage.current === newStage) {
      return false;
    }

    if (!user) {
      console.log("User not authenticated, skipping family notification");
      return false;
    }

    const groupId = localStorage.getItem(GROUP_ID_KEY);
    if (!groupId) {
      console.log("No group ID found, skipping family notification");
      return false;
    }

    // Get member_id for the current user in the group (use .limit(1) to handle duplicates gracefully)
    const { data: memberDataArr } = await supabase
      .from("group_members")
      .select("member_id, member_name")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .limit(1);

    const memberData = memberDataArr?.[0];
    if (!memberData) {
      console.log("User not found in group, skipping notification");
      return false;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        console.log("No valid session for notification");
        return false;
      }

      const response = await supabase.functions.invoke("sukoon-stage-notify", {
        body: {
          memberId: memberData.member_id,
          groupId,
          newStage,
          memberName: memberName || memberData.member_name,
        },
      });

      if (response.error) {
        console.error("Error sending stage notification:", response.error);
        return false;
      }

      lastNotifiedStage.current = newStage;

      const { alertsSent = 0 } = response.data || {};
      if (alertsSent > 0) {
        toast({
          title: "Family Notified",
          description: `${alertsSent} family member(s) received your Hajj status update`,
        });
      }

      return true;
    } catch (error) {
      console.error("Failed to send stage notification:", error);
      return false;
    }
  }, [user, toast]);

  return {
    notifyFamilyOfStageChange,
  };
};
