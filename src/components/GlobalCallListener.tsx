import { useEffect, useState, useCallback } from "react";
import { 
  StreamVideoClient, 
  StreamVideo, 
  StreamCall,
  Call,
  CallingState,
} from "@stream-io/video-react-sdk";
import { IncomingCallOverlay } from "./IncomingCallOverlay";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface GlobalCallListenerProps {
  children: React.ReactNode;
}

export function GlobalCallListener({ children }: GlobalCallListenerProps) {
  const { user, loading: authLoading } = useAuth();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);

  // Initialize Stream client for listening to calls
  useEffect(() => {
    if (!user || authLoading) return;

    let streamClient: StreamVideoClient | null = null;

    const initClient = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) return;

        const response = await supabase.functions.invoke("stream-video-token", {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        });

        if (response.error || !response.data) {
          console.error("Failed to get Stream token for call listener");
          return;
        }

        const { token, userId, userName, apiKey } = response.data;

        streamClient = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: userName },
          token,
        });

        setClient(streamClient);

        // Listen for incoming ring calls
        streamClient.on("call.ring", (event) => {
          const call = streamClient!.call(event.call.type, event.call.id);
          
          // Only show incoming call if it's not created by current user
          if (event.call.created_by?.id !== userId) {
            setIncomingCall(call);
          }
        });

      } catch (error) {
        console.error("Error initializing call listener:", error);
      }
    };

    initClient();

    return () => {
      if (streamClient) {
        streamClient.disconnectUser();
      }
    };
  }, [user, authLoading]);

  const handleAcceptCall = useCallback(async () => {
    if (!incomingCall) return;

    try {
      await incomingCall.join();
      setActiveCall(incomingCall);
      setIncomingCall(null);
      
      // Navigate to video call page with the call
      window.location.href = `/video-call?callId=${incomingCall.id}`;
    } catch (error) {
      console.error("Error accepting call:", error);
      setIncomingCall(null);
    }
  }, [incomingCall]);

  const handleDeclineCall = useCallback(async () => {
    if (!incomingCall) return;

    try {
      await incomingCall.leave({ reject: true });
    } catch (error) {
      console.error("Error declining call:", error);
    } finally {
      setIncomingCall(null);
    }
  }, [incomingCall]);

  return (
    <>
      {children}
      
      {/* Incoming call overlay - shows above everything */}
      {incomingCall && client && (
        <StreamVideo client={client}>
          <StreamCall call={incomingCall}>
            <IncomingCallOverlay
              call={incomingCall}
              onAccept={handleAcceptCall}
              onDecline={handleDeclineCall}
            />
          </StreamCall>
        </StreamVideo>
      )}
    </>
  );
}
