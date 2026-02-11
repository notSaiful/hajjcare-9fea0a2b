import { useLanguage } from "@/contexts/LanguageContext";
import { useLinkRequests, LinkRequest } from "@/hooks/useLinkRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Clock, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const LinkRequestsPanel = () => {
  const { isRTL } = useLanguage();
  const { incomingRequests, outgoingRequests, respondToRequest, cancelRequest, loading } = useLinkRequests();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleRespond = async (requestId: string, approve: boolean) => {
    setProcessingId(requestId);
    const { error } = await respondToRequest(requestId, approve);
    setProcessingId(null);

    if (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: approve
          ? (isRTL ? "تمت الموافقة" : "Request Approved")
          : (isRTL ? "تم الرفض" : "Request Declined"),
        description: approve
          ? (isRTL ? "تمت إضافتك إلى المجموعة العائلية" : "You've been added to the family group")
          : (isRTL ? "تم رفض الطلب" : "The request has been declined"),
      });
    }
  };

  const handleCancel = async (requestId: string) => {
    await cancelRequest(requestId);
    toast({
      title: isRTL ? "تم الإلغاء" : "Cancelled",
      description: isRTL ? "تم إلغاء طلب الربط" : "Link request cancelled",
    });
  };

  const pendingOutgoing = outgoingRequests.filter((r) => r.status === "pending");
  const hasContent = incomingRequests.length > 0 || pendingOutgoing.length > 0;

  if (!hasContent && !loading) return null;

  return (
    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            {isRTL ? "طلبات الربط" : "Link Requests"}
          </div>
          {incomingRequests.length > 0 && (
            <Badge variant="destructive" className="animate-pulse text-xs">
              {incomingRequests.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Incoming Requests */}
        {incomingRequests.map((req) => (
          <IncomingRequestCard
            key={req.id}
            request={req}
            isRTL={isRTL}
            isProcessing={processingId === req.id}
            onApprove={() => handleRespond(req.id, true)}
            onReject={() => handleRespond(req.id, false)}
          />
        ))}

        {/* Pending Outgoing */}
        {pendingOutgoing.map((req) => (
          <OutgoingRequestCard
            key={req.id}
            request={req}
            isRTL={isRTL}
            onCancel={() => handleCancel(req.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

function IncomingRequestCard({
  request,
  isRTL,
  isProcessing,
  onApprove,
  onReject,
}: {
  request: LinkRequest;
  isRTL: boolean;
  isProcessing: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const timeAgo = getTimeAgo(request.created_at, isRTL);

  return (
    <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-2 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{request.requester_name}</p>
            <p className="text-[10px] text-muted-foreground">
              {isRTL ? "يريد إضافتك إلى" : "wants to add you to"}{" "}
              <span className="font-medium">{request.group_name}</span>
            </p>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {timeAgo}
        </span>
      </div>

      {request.message && (
        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg italic">
          "{request.message}"
        </p>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 h-9 gap-1.5 text-xs"
          onClick={onApprove}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          {isRTL ? "موافقة" : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-9 gap-1.5 text-xs"
          onClick={onReject}
          disabled={isProcessing}
        >
          <X className="w-3.5 h-3.5" />
          {isRTL ? "رفض" : "Decline"}
        </Button>
      </div>
    </div>
  );
}

function OutgoingRequestCard({
  request,
  isRTL,
  onCancel,
}: {
  request: LinkRequest;
  isRTL: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {isRTL ? "في انتظار الموافقة" : "Awaiting approval"}
        </span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 text-xs text-destructive hover:text-destructive"
        onClick={onCancel}
      >
        {isRTL ? "إلغاء" : "Cancel"}
      </Button>
    </div>
  );
}

function getTimeAgo(dateStr: string, isRTL: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return isRTL ? "الآن" : "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
