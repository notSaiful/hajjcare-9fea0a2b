import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Accessibility, 
  Heart,
  User,
  IdCard,
  Flag,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmergencyAlert {
  id: string;
  pilgrim_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  country: string;
  medical_conditions: string[];
  wheelchair: boolean;
  location: string;
  latitude?: number;
  longitude?: number;
  inspector_name: string;
  inspector_phone: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED';
}

interface EmergencyAlertCardProps {
  alert: EmergencyAlert;
  onCall?: (phone: string) => void;
  onNavigate?: (lat: number, lng: number) => void;
  onRespond?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
}

const STATUS_STYLES = {
  ACTIVE: 'bg-red-600 animate-pulse',
  RESPONDING: 'bg-amber-500',
  RESOLVED: 'bg-emerald-500',
};

export function EmergencyAlertCard({ 
  alert, 
  onCall, 
  onNavigate,
  onRespond,
  onResolve 
}: EmergencyAlertCardProps) {
  const handleCall = () => {
    if (onCall) {
      onCall(alert.inspector_phone);
    } else {
      window.location.href = `tel:${alert.inspector_phone}`;
    }
  };

  const handleNavigate = () => {
    if (alert.latitude && alert.longitude) {
      if (onNavigate) {
        onNavigate(alert.latitude, alert.longitude);
      } else {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${alert.latitude},${alert.longitude}`,
          '_blank'
        );
      }
    }
  };

  return (
    <Card className={cn(
      "border-2 border-red-500 bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-background",
      "shadow-lg shadow-red-500/20",
      alert.status === 'ACTIVE' && "ring-2 ring-red-500 ring-offset-2"
    )}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-lg">🚨 EMERGENCY ALERT</span>
          </div>
          <Badge className={cn("text-white", STATUS_STYLES[alert.status])}>
            {alert.status}
          </Badge>
        </div>

        {/* Pilgrim Info */}
        <div className="bg-white dark:bg-card rounded-lg p-3 border space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-bold text-lg">{alert.name}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{alert.age}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Gender:</span>
              <span className="font-medium">{alert.gender}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Flag className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Country:</span>
            <span className="font-medium">{alert.country}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <IdCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Haj ID:</span>
            <span className="font-mono font-bold text-primary">{alert.pilgrim_id}</span>
          </div>
        </div>

        {/* Medical Conditions */}
        {(alert.medical_conditions.length > 0 || alert.wheelchair) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Stethoscope className="w-4 h-4 text-red-500" />
              <span>Medical:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {alert.medical_conditions.map((condition, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="bg-red-100 dark:bg-red-950 border-red-300 text-red-700 dark:text-red-300"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Mobility */}
        {alert.wheelchair && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Accessibility className="w-4 h-4 text-blue-500" />
              <span>Mobility:</span>
            </div>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-950 border-blue-300 text-blue-700 dark:text-blue-300">
              <Accessibility className="w-3 h-3 mr-1" />
              Wheelchair User
            </Badge>
          </div>
        )}

        {/* Location */}
        <div className="bg-amber-50 dark:bg-amber-950/50 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <div>
              <span className="text-sm text-muted-foreground">Current Location:</span>
              <p className="font-semibold text-amber-800 dark:text-amber-200">{alert.location}</p>
            </div>
          </div>
        </div>

        {/* Assigned Inspector */}
        <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Assigned Inspector:</span>
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">{alert.inspector_name}</p>
            <p className="text-sm font-mono text-emerald-700 dark:text-emerald-300">
              📞 {alert.inspector_phone}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleCall}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Inspector
          </Button>
          
          <Button 
            onClick={handleNavigate}
            variant="outline"
            className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950"
            disabled={!alert.latitude || !alert.longitude}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Navigate
          </Button>
        </div>

        {/* Status Action Buttons */}
        {alert.status === 'ACTIVE' && onRespond && (
          <Button 
            onClick={() => onRespond(alert.id)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            Mark as Responding
          </Button>
        )}
        
        {alert.status === 'RESPONDING' && onResolve && (
          <Button 
            onClick={() => onResolve(alert.id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Mark as Resolved
          </Button>
        )}

        {/* Timestamp */}
        <p className="text-xs text-center text-muted-foreground">
          Alert triggered: {new Date(alert.timestamp).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
