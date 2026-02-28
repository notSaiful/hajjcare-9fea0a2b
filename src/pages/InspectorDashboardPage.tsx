import { useState, useMemo } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';
import { useNavigate } from 'react-router-dom';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HajiCard } from '@/components/inspector/HajiCard';
import { EmergencyAlertCard, EmergencyAlert } from '@/components/inspector/EmergencyAlertCard';
import { useHajis } from '@/hooks/useHajis';
import { useEmergencyAlert } from '@/hooks/useEmergencyAlert';
import { Haji, HajiStatus, STATUS_COLORS, STATUS_LABELS } from '@/types/haji';
import { 
  AlertTriangle, 
  Users, 
  Loader2, 
  Filter,
  ArrowUpDown,
  Accessibility,
  Heart,
  Search,
  Bell,
  BellOff
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import InspectorMyProfile from '@/components/inspector/InspectorMyProfile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Demo emergency alert matching the user's format
const DEMO_EMERGENCY_ALERT: EmergencyAlert = {
  id: 'ea-001',
  pilgrim_id: 'HCI2026-458921',
  name: 'Abdul Rahman',
  age: 67,
  gender: 'Male',
  country: 'India',
  medical_conditions: ['Diabetic', 'Heart Patient'],
  wheelchair: true,
  location: 'Masjid al-Haram – Gate 79',
  latitude: 21.4225,
  longitude: 39.8262,
  inspector_name: 'Md Anisul Haque',
  inspector_phone: '+91XXXXXXXX',
  timestamp: new Date().toISOString(),
  status: 'ACTIVE',
};

const InspectorDashboardPage = () => {
  const navigate = useNavigate();
  const { hasAnyCoordinatorRole, isInspector, isLoading: roleLoading } = useUserRole();
  const { hajis, isLoading, isUsingDemo, updateHajiStatus } = useHajis();
  const { triggerAlertOnce, startEmergencyAlert, stopEmergencyAlert, isAlertActive } = useEmergencyAlert();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HajiStatus | 'ALL'>('ALL');
  const [selectedHaji, setSelectedHaji] = useState<Haji | null>(null);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Stats calculation
  const stats = useMemo(() => {
    const total = hajis.length;
    const emergency = hajis.filter(h => h.status === 'EMERGENCY').length;
    const missing = hajis.filter(h => h.status === 'MISSING').length;
    const hospital = hajis.filter(h => h.status === 'HOSPITAL').length;
    const wheelchair = hajis.filter(h => h.wheelchair).length;
    const senior = hajis.filter(h => h.age > 60).length;
    
    return { total, emergency, missing, hospital, wheelchair, senior };
  }, [hajis]);

  // Emergency mode sorting - prioritize vulnerable
  const sortedHajis = useMemo(() => {
    let filtered = [...hajis];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(query) ||
        h.haji_id.toLowerCase().includes(query) ||
        h.family_id.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(h => h.status === statusFilter);
    }
    
    // Emergency mode sorting
    if (emergencyMode) {
      filtered.sort((a, b) => {
        const priorityA = (a.wheelchair ? 3 : 0) + (a.age > 60 ? 2 : 0) + (a.status !== 'NORMAL' ? 1 : 0);
        const priorityB = (b.wheelchair ? 3 : 0) + (b.age > 60 ? 2 : 0) + (b.status !== 'NORMAL' ? 1 : 0);
        return priorityB - priorityA;
      });
    }
    
    return filtered;
  }, [hajis, emergencyMode, searchQuery, statusFilter]);

  const handleStatusChange = async (status: HajiStatus) => {
    if (selectedHaji) {
      await updateHajiStatus(selectedHaji.id, status);
      setSelectedHaji(prev => prev ? { ...prev, status } : null);
    }
  };

  // Demo: trigger emergency alert
  const handleDemoAlert = () => {
    setActiveAlert(DEMO_EMERGENCY_ALERT);
    if (soundEnabled) {
      triggerAlertOnce();
    }
  };

  // Handle alert status changes
  const handleAlertRespond = (alertId: string) => {
    setActiveAlert(prev => prev ? { ...prev, status: 'RESPONDING' } : null);
  };

  const handleAlertResolve = (alertId: string) => {
    setActiveAlert(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
    // Auto-dismiss after resolved
    setTimeout(() => setActiveAlert(null), 2000);
  };

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAnyCoordinatorRole && !isInspector) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 py-16">
          <UnauthorizedAlert requiredRole="any_staff" pageName="Inspector Dashboard" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Demo Mode Banner */}
        {isUsingDemo && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
            📋 Demo Mode - Showing sample data
          </div>
        )}

        {/* Section 1: My Profile */}
        <InspectorMyProfile />

        {/* Summary Card - matches txtSummary */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Inspector Dashboard
              </h2>
              <Badge variant="outline" className="text-xs">
                {stats.total} Hajis
              </Badge>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <div className="text-2xl font-bold text-red-600">{stats.emergency}</div>
                <div className="text-xs text-muted-foreground">Emergency</div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <div className="text-2xl font-bold text-amber-600">{stats.missing}</div>
                <div className="text-xs text-muted-foreground">Missing</div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <div className="text-2xl font-bold text-blue-600">{stats.hospital}</div>
                <div className="text-xs text-muted-foreground">Hospital</div>
              </div>
            </div>
            
            {/* Secondary stats */}
            <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Accessibility className="w-4 h-4" /> {stats.wheelchair} Wheelchair
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {stats.senior} Seniors
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Emergency Alert */}
        {activeAlert && (
          <EmergencyAlertCard
            alert={activeAlert}
            onRespond={handleAlertRespond}
            onResolve={handleAlertResolve}
          />
        )}

        {/* Demo Alert Trigger & Sound Toggle */}
        <div className="flex gap-2">
          <Button
            onClick={handleDemoAlert}
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
          >
            <Bell className="w-4 h-4 mr-2" />
            Simulate Alert
          </Button>
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="outline"
            size="icon"
            className={cn(
              soundEnabled ? "text-emerald-600" : "text-muted-foreground"
            )}
          >
            {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </Button>
        </div>

        {/* Emergency Mode Button - matches btnEmergencyMode */}
        <Button
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={cn(
            "w-full h-12 text-base font-bold transition-all",
            emergencyMode 
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse" 
              : "bg-destructive/10 hover:bg-destructive/20 text-destructive"
          )}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          {emergencyMode ? 'EMERGENCY MODE ACTIVE' : 'EMERGENCY MODE'}
        </Button>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, ID, family..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as HajiStatus | 'ALL')}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="EMERGENCY">Emergency</SelectItem>
              <SelectItem value="MISSING">Missing</SelectItem>
              <SelectItem value="HOSPITAL">Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Emergency Mode Indicator */}
        {emergencyMode && (
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 rounded-lg p-2">
            <ArrowUpDown className="w-4 h-4" />
            Sorted by priority: Wheelchair → Seniors → Non-normal status
          </div>
        )}

        {/* Haji List - matches recyclerHaji */}
        <div className="space-y-3 pb-20">
          {sortedHajis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hajis found matching your criteria
            </div>
          ) : (
            sortedHajis.map((haji) => (
              <HajiCard 
                key={haji.id} 
                haji={haji} 
                onClick={setSelectedHaji}
              />
            ))
          )}
        </div>
      </main>

      {/* Haji Detail Dialog */}
      <Dialog open={!!selectedHaji} onOpenChange={() => setSelectedHaji(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedHaji?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedHaji && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Haji ID:</span>
                  <p className="font-medium">{selectedHaji.haji_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Family:</span>
                  <p className="font-medium">{selectedHaji.family_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Age:</span>
                  <p className="font-medium">{selectedHaji.age} years</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Blood:</span>
                  <p className="font-medium">{selectedHaji.blood_group}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Condition:</span>
                  <p className="font-medium">{selectedHaji.disease}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Wheelchair:</span>
                  <p className="font-medium">{selectedHaji.wheelchair ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Update Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['NORMAL', 'EMERGENCY', 'MISSING', 'HOSPITAL'] as HajiStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant={selectedHaji.status === status ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        selectedHaji.status === status && STATUS_COLORS[status],
                        selectedHaji.status === status && 'text-white'
                      )}
                      onClick={() => handleStatusChange(status)}
                    >
                      {STATUS_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InspectorDashboardPage;
