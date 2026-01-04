import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DASHBOARD_LABELS, PilgrimStatus } from "@/data/familyDashboardContent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldAlert, Circle, Eye, EyeOff } from "lucide-react";

interface PilgrimStatusSettingsProps {
  currentStatus: PilgrimStatus;
  sharingEnabled: boolean;
  onStatusChange: (status: PilgrimStatus) => Promise<void>;
  onSharingChange: (enabled: boolean) => Promise<void>;
  isLoading?: boolean;
}

export const PilgrimStatusSettings = ({
  currentStatus,
  sharingEnabled,
  onStatusChange,
  onSharingChange,
  isLoading = false,
}: PilgrimStatusSettingsProps) => {
  const { language, isRTL } = useLanguage();
  const labels = DASHBOARD_LABELS[language];
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (status: PilgrimStatus) => {
    if (status === currentStatus || updating) return;
    setUpdating(true);
    try {
      await onStatusChange(status);
    } finally {
      setUpdating(false);
    }
  };

  const handleSharingToggle = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await onSharingChange(!sharingEnabled);
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions: { 
    status: PilgrimStatus; 
    label: string; 
    icon: typeof Shield;
    colorClass: string;
    bgClass: string;
  }[] = [
    { 
      status: "normal", 
      label: labels.statusNormal, 
      icon: ShieldCheck,
      colorClass: "text-status-safe",
      bgClass: "bg-status-safe-bg border-status-safe/30",
    },
    { 
      status: "assisted", 
      label: labels.statusAssisted, 
      icon: Shield,
      colorClass: "text-status-assistance",
      bgClass: "bg-status-assistance-bg border-status-assistance/30",
    },
    { 
      status: "emergency_managed", 
      label: labels.statusEmergency, 
      icon: ShieldAlert,
      colorClass: "text-status-emergency",
      bgClass: "bg-status-emergency-bg border-status-emergency/30",
    },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Consent Toggle Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {sharingEnabled ? (
              <Eye className="w-5 h-5 text-primary" />
            ) : (
              <EyeOff className="w-5 h-5 text-muted-foreground" />
            )}
            {labels.shareConsent}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {sharingEnabled ? labels.shareEnabled : labels.shareDisabled}
              </p>
              <p className="text-xs text-muted-foreground">
                {labels.consentNote}
              </p>
            </div>
            <Switch
              checked={sharingEnabled}
              onCheckedChange={handleSharingToggle}
              disabled={updating || isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Update Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Circle className="w-5 h-5 text-primary" />
            {labels.updateStatus}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = currentStatus === option.status;
            
            return (
              <Button
                key={option.status}
                variant="outline"
                className={`
                  w-full justify-start gap-3 h-auto py-4 px-4
                  transition-all duration-200
                  ${isSelected 
                    ? `${option.bgClass} border-2` 
                    : "border-border hover:bg-muted/50"
                  }
                `}
                onClick={() => handleStatusChange(option.status)}
                disabled={updating || isLoading}
              >
                <Icon className={`w-6 h-6 ${isSelected ? option.colorClass : "text-muted-foreground"}`} />
                <span className={`text-base ${isSelected ? "font-semibold" : ""}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <Circle 
                    className={`w-3 h-3 ${option.colorClass} ml-auto`}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                )}
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
