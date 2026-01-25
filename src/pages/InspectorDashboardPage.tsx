import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleHeader } from '@/components/SimpleHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HajiCard } from '@/components/inspector/HajiCard';
import { useHajis } from '@/hooks/useHajis';
import { Haji, HajiStatus, STATUS_COLORS, STATUS_LABELS } from '@/types/haji';
import { 
  AlertTriangle, 
  Users, 
  Loader2, 
  Filter,
  ArrowUpDown,
  Accessibility,
  Heart,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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

const InspectorDashboardPage = () => {
  const navigate = useNavigate();
  const { hajis, isLoading, isUsingDemo, updateHajiStatus } = useHajis();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HajiStatus | 'ALL'>('ALL');
  const [selectedHaji, setSelectedHaji] = useState<Haji | null>(null);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

        {/* Emergency Mode Button - matches btnEmergencyMode */}
        <Button
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={cn(
            "w-full h-12 text-base font-bold transition-all",
            emergencyMode 
              ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" 
              : "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-300"
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
