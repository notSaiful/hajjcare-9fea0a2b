import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User, 
  MapPin, 
  MessageSquare,
  Phone,
  RefreshCw,
  Shield,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';

type HealthTicket = {
  id: string;
  user_id: string | null;
  description: string;
  symptoms: string[] | null;
  zone: string | null;
  location_lat: number | null;
  location_lng: number | null;
  ai_triage_summary: string | null;
  ai_translated_text: string | null;
  ai_urgency_level: 'low' | 'medium' | 'high' | 'critical' | null;
  ai_category: string | null;
  ai_recommendations: string[] | null;
  status: string | null;
  coordinator_notes: string | null;
  professional_response: string | null;
  action_taken: string | null;
  outcome: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const statusLabels: Record<string, { en: string; hi: string; color: string }> = {
  submitted: { en: 'Submitted', hi: 'जमा किया गया', color: 'bg-gray-500' },
  ai_triaged: { en: 'AI Triaged', hi: 'AI द्वारा जांचा', color: 'bg-blue-500' },
  coordinator_reviewing: { en: 'Under Review', hi: 'समीक्षा जारी', color: 'bg-yellow-500' },
  whatsapp_alerted: { en: 'WhatsApp Alerted', hi: 'व्हाट्सएप अलर्ट', color: 'bg-purple-500' },
  professional_responding: { en: 'Professional Responding', hi: 'पेशेवर जवाब दे रहा', color: 'bg-indigo-500' },
  action_taken: { en: 'Action Taken', hi: 'कार्रवाई की गई', color: 'bg-teal-500' },
  resolved: { en: 'Resolved', hi: 'हल किया गया', color: 'bg-green-500' },
  closed: { en: 'Closed', hi: 'बंद', color: 'bg-gray-700' },
};

const urgencyColors: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const CoordinatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { hasAnyCoordinatorRole, isLoading: roleLoading } = useUserRole();
  const [tickets, setTickets] = useState<HealthTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<HealthTicket | null>(null);
  const [coordinatorNotes, setCoordinatorNotes] = useState('');
  const [professionalResponse, setProfessionalResponse] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [outcome, setOutcome] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const labels = {
    title: { en: 'Coordinator Dashboard', hi: 'समन्वयक डैशबोर्ड' },
    subtitle: { en: 'Health Ticket Management', hi: 'स्वास्थ्य टिकट प्रबंधन' },
    noAccess: { en: 'Access Denied', hi: 'पहुंच अस्वीकृत' },
    noAccessDesc: { en: 'You do not have coordinator privileges.', hi: 'आपके पास समन्वयक विशेषाधिकार नहीं हैं।' },
    loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
    noTickets: { en: 'No tickets found', hi: 'कोई टिकट नहीं मिला' },
    refresh: { en: 'Refresh', hi: 'रिफ्रेश' },
    all: { en: 'All', hi: 'सभी' },
    pending: { en: 'Pending', hi: 'लंबित' },
    critical: { en: 'Critical', hi: 'गंभीर' },
    resolved: { en: 'Resolved', hi: 'हल किया गया' },
    ticketDetails: { en: 'Ticket Details', hi: 'टिकट विवरण' },
    aiSummary: { en: 'AI Summary', hi: 'AI सारांश' },
    arabicTranslation: { en: 'Arabic Translation', hi: 'अरबी अनुवाद' },
    recommendations: { en: 'Recommendations', hi: 'सिफारिशें' },
    coordinatorNotes: { en: 'Coordinator Notes', hi: 'समन्वयक नोट्स' },
    professionalResponse: { en: 'Professional Response', hi: 'पेशेवर प्रतिक्रिया' },
    actionTaken: { en: 'Action Taken', hi: 'की गई कार्रवाई' },
    outcome: { en: 'Outcome', hi: 'परिणाम' },
    updateStatus: { en: 'Update Status', hi: 'स्थिति अपडेट करें' },
    save: { en: 'Save Changes', hi: 'बदलाव सहेजें' },
    updated: { en: 'Ticket updated successfully', hi: 'टिकट सफलतापूर्वक अपडेट हुआ' },
  };

  const t = (key: keyof typeof labels) => labels[key][language as 'en' | 'hi'] || labels[key].en;

  useEffect(() => {
    if (!roleLoading && !hasAnyCoordinatorRole) {
      return;
    }
    if (hasAnyCoordinatorRole) {
      fetchTickets();
      setupRealtimeSubscription();
    }
  }, [roleLoading, hasAnyCoordinatorRole]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('health_tickets_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'health_tickets' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTickets(prev => [payload.new as HealthTicket, ...prev]);
            toast.info('New health ticket received!');
          } else if (payload.eventType === 'UPDATE') {
            setTickets(prev => prev.map(t => t.id === payload.new.id ? payload.new as HealthTicket : t));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    try {
      const updates: Record<string, unknown> = {};
      if (coordinatorNotes) updates.coordinator_notes = coordinatorNotes;
      if (professionalResponse) updates.professional_response = professionalResponse;
      if (actionTaken) updates.action_taken = actionTaken;
      if (outcome) updates.outcome = outcome;
      if (newStatus) {
        updates.status = newStatus;
        if (newStatus === 'resolved') {
          updates.resolved_at = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from('health_tickets')
        .update(updates)
        .eq('id', selectedTicket.id);

      if (error) throw error;
      
      toast.success(t('updated'));
      setSelectedTicket(null);
      resetForm();
    } catch (err) {
      console.error('Error updating ticket:', err);
      toast.error('Failed to update ticket');
    }
  };

  const resetForm = () => {
    setCoordinatorNotes('');
    setProfessionalResponse('');
    setActionTaken('');
    setOutcome('');
    setNewStatus('');
  };

  const openTicketDialog = (ticket: HealthTicket) => {
    setSelectedTicket(ticket);
    setCoordinatorNotes(ticket.coordinator_notes || '');
    setProfessionalResponse(ticket.professional_response || '');
    setActionTaken(ticket.action_taken || '');
    setOutcome(ticket.outcome || '');
    setNewStatus(ticket.status || '');
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return !['resolved', 'closed'].includes(ticket.status || '');
    if (activeTab === 'critical') return ticket.ai_urgency_level === 'critical' || ticket.ai_urgency_level === 'high';
    if (activeTab === 'resolved') return ticket.status === 'resolved' || ticket.status === 'closed';
    return true;
  });

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => !['resolved', 'closed'].includes(t.status || '')).length,
    critical: tickets.filter(t => t.ai_urgency_level === 'critical' || t.ai_urgency_level === 'high').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  if (roleLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!hasAnyCoordinatorRole) {
    return (
      <MainLayout>
        <UnauthorizedAlert requiredRole="any_staff" pageName="Coordinator Dashboard" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Button onClick={fetchTickets} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">{t('all')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">{t('pending')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-500">{stats.critical}</div>
              <div className="text-sm text-muted-foreground">{t('critical')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-500">{stats.resolved}</div>
              <div className="text-sm text-muted-foreground">{t('resolved')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Tickets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">{t('all')}</TabsTrigger>
            <TabsTrigger value="pending">{t('pending')}</TabsTrigger>
            <TabsTrigger value="critical">{t('critical')}</TabsTrigger>
            <TabsTrigger value="resolved">{t('resolved')}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">{t('loading')}</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('noTickets')}
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <Dialog key={ticket.id}>
                  <DialogTrigger asChild>
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                      style={{ borderLeftColor: urgencyColors[ticket.ai_urgency_level || 'medium'].replace('bg-', '') }}
                      onClick={() => openTicketDialog(ticket)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <Badge className={urgencyColors[ticket.ai_urgency_level || 'medium']}>
                                {ticket.ai_urgency_level?.toUpperCase() || 'MEDIUM'}
                              </Badge>
                              <Badge variant="outline" className={statusLabels[ticket.status || 'submitted']?.color}>
                                {statusLabels[ticket.status || 'submitted']?.[language as 'en' | 'hi'] || ticket.status}
                              </Badge>
                              {ticket.ai_category && (
                                <Badge variant="secondary">{ticket.ai_category}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-foreground line-clamp-2 mb-2">
                              {ticket.ai_triage_summary || ticket.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(ticket.created_at || '').toLocaleString()}
                              </span>
                              {ticket.zone && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {ticket.zone}
                                </span>
                              )}
                            </div>
                          </div>
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                            ticket.ai_urgency_level === 'critical' ? 'text-red-500' :
                            ticket.ai_urgency_level === 'high' ? 'text-orange-500' :
                            'text-muted-foreground'
                          }`} />
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {t('ticketDetails')}
                        <Badge className={urgencyColors[ticket.ai_urgency_level || 'medium']}>
                          {ticket.ai_urgency_level?.toUpperCase()}
                        </Badge>
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      {/* Original Description */}
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
                        <p className="text-foreground">{ticket.description}</p>
                      </div>

                      {/* AI Summary */}
                      {ticket.ai_triage_summary && (
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <h4 className="font-medium text-sm text-blue-400 mb-1">{t('aiSummary')}</h4>
                          <p className="text-foreground">{ticket.ai_triage_summary}</p>
                        </div>
                      )}

                      {/* Arabic Translation */}
                      {ticket.ai_translated_text && (
                        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20" dir="rtl">
                          <h4 className="font-medium text-sm text-purple-400 mb-1 text-right">{t('arabicTranslation')}</h4>
                          <p className="text-foreground">{ticket.ai_translated_text}</p>
                        </div>
                      )}

                      {/* Recommendations */}
                      {ticket.ai_recommendations && ticket.ai_recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">{t('recommendations')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {ticket.ai_recommendations.map((rec, i) => (
                              <li key={i} className="text-foreground">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Status Update */}
                      <div className="pt-4 border-t space-y-4">
                        <div>
                          <label className="text-sm font-medium">{t('updateStatus')}</label>
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label[language as 'en' | 'hi'] || label.en}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">{t('coordinatorNotes')}</label>
                          <Textarea
                            value={coordinatorNotes}
                            onChange={(e) => setCoordinatorNotes(e.target.value)}
                            placeholder="Add notes..."
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">{t('professionalResponse')}</label>
                          <Textarea
                            value={professionalResponse}
                            onChange={(e) => setProfessionalResponse(e.target.value)}
                            placeholder="Medical professional response..."
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">{t('actionTaken')}</label>
                          <Textarea
                            value={actionTaken}
                            onChange={(e) => setActionTaken(e.target.value)}
                            placeholder="What action was taken..."
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">{t('outcome')}</label>
                          <Textarea
                            value={outcome}
                            onChange={(e) => setOutcome(e.target.value)}
                            placeholder="Final outcome..."
                            className="mt-1"
                          />
                        </div>

                        <Button onClick={handleUpdateTicket} className="w-full">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('save')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CoordinatorDashboardPage;
