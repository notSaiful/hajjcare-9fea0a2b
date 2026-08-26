import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, Bell, BellOff, Loader2 } from "lucide-react";

export default function FraudAlertsFeed() {
  const { language } = useLanguage();
  const { isSupported, isSubscribed, isLoading: pushLoading, subscribe, unsubscribe } = usePushNotifications();
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["fraud-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fraud_alerts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isSupported && (
        <Card className="p-3 flex items-center justify-between border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              {isSubscribed
                ? (language === "hi" ? "सूचनाएं सक्रिय" : "Notifications active")
                : (language === "hi" ? "फ्रॉड अलर्ट की सूचनाएं प्राप्त करें" : "Get notified on new fraud alerts")}
            </span>
          </div>
          <Button
            size="sm"
            variant={isSubscribed ? "outline" : "default"}
            disabled={pushLoading}
            onClick={() => isSubscribed ? unsubscribe() : subscribe()}
          >
            {pushLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSubscribed ? (
              <><BellOff className="w-4 h-4 mr-1" /> {language === "hi" ? "बंद करें" : "Turn Off"}</>
            ) : (
              <><Bell className="w-4 h-4 mr-1" /> {language === "hi" ? "सक्रिय करें" : "Enable"}</>
            )}
          </Button>
        </Card>
      )}
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className={`p-4 border-2 ${
            alert.severity === "critical"
              ? "border-destructive/40 bg-destructive/5"
              : "border-amber-400/30 bg-amber-50/30 dark:bg-amber-900/10"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                alert.severity === "critical"
                  ? "bg-destructive/10"
                  : "bg-amber-100 dark:bg-amber-900/30"
              }`}
            >
              <AlertTriangle
                className={`w-4 h-4 ${
                  alert.severity === "critical"
                    ? "text-destructive"
                    : "text-amber-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-semibold text-sm text-foreground">
                  {alert.title}
                </h4>
                <Badge
                  variant={alert.severity === "critical" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {alert.severity === "critical"
                    ? language === "hi" ? "गंभीर" : "Critical"
                    : language === "hi" ? "चेतावनी" : "Warning"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {alert.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {alert.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {alert.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
      {alerts.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {language === "hi" ? "कोई सक्रिय अलर्ट नहीं" : "No active alerts"}
        </p>
      )}
    </div>
  );
}
