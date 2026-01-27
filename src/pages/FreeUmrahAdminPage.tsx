import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Search, Loader2, CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { adminContent } from "@/data/freeUmrahContent";
import { ApplicantDetailsModal } from "@/components/ApplicantDetailsModal";
import { FreeUmrahStats } from "@/components/FreeUmrahStats";

interface Applicant {
  id: string;
  application_id: string;
  full_name: string;
  age: number;
  mobile: string;
  state: string;
  city: string | null;
  pincode: string | null;
  role: string;
  masjid_name: string;
  years_of_service: number;
  never_umrah: boolean;
  low_income: boolean;
  social_harmony: boolean;
  no_money_paid: boolean;
  proof_type: string | null;
  proof_url: string | null;
  status: string;
  created_at: string;
}

const FreeUmrahAdminPage = () => {
  const { language } = useLanguage();
  const { isAdmin, isCoordinator, isLoading: roleLoading } = useUserRole();
  const t = adminContent[language as keyof typeof adminContent] || adminContent.en;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [detailsApplicant, setDetailsApplicant] = useState<Applicant | null>(null);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: "approve" | "reject" | null }>({
    open: false,
    action: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchQuery, statusFilter]);

  const fetchApplicants = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load applications");
      console.error(error);
    } else {
      setApplicants(data || []);
    }
    setIsLoading(false);
  };

  const filterApplicants = () => {
    let filtered = [...applicants];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.full_name.toLowerCase().includes(query) ||
          a.application_id.toLowerCase().includes(query) ||
          a.mobile.includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredApplicants(filtered);
  };

  const sendWhatsAppNotification = async (applicant: Applicant, newStatus: string) => {
    if (newStatus !== 'Approved' && newStatus !== 'Rejected') return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/free-umrah-notify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            applicationId: applicant.application_id,
            applicantName: applicant.full_name,
            mobile: applicant.mobile,
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        toast.success("WhatsApp notification sent");
      } else {
        console.error("WhatsApp notification failed");
      }
    } catch (err) {
      console.error("Error sending WhatsApp notification:", err);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedApplicant) return;

    setIsUpdating(true);
    const { error } = await supabase
      .from("applicants")
      .update({ status: newStatus })
      .eq("id", selectedApplicant.id);

    if (error) {
      toast.error("Failed to update status");
      console.error(error);
    } else {
      toast.success(t.updated);
      setApplicants((prev) =>
        prev.map((a) => (a.id === selectedApplicant.id ? { ...a, status: newStatus } : a))
      );
      
      // Send WhatsApp notification for Approved/Rejected
      if (newStatus === 'Approved' || newStatus === 'Rejected') {
        await sendWhatsAppNotification(selectedApplicant, newStatus);
      }
    }

    setIsUpdating(false);
    setActionDialog({ open: false, action: null });
    setSelectedApplicant(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Applied":
        return <Badge variant="secondary">{status}</Badge>;
      case "Under Review":
        return <Badge className="bg-accent text-accent-foreground">{status}</Badge>;
      case "Approved":
        return <Badge className="bg-primary/10 text-primary border-primary/20">{status}</Badge>;
      case "Rejected":
        return <Badge variant="destructive">{status}</Badge>;
      case "Completed":
        return <Badge className="bg-secondary text-secondary-foreground">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin && !isCoordinator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to view this page.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold truncate">{t.title}</h1>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Statistics Dashboard */}
        <FreeUmrahStats applicants={applicants} language={language} />

        <Card>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder={t.filter} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">{t.loading}</span>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{t.noApplications}</div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.applicant}</TableHead>
                      <TableHead className="hidden md:table-cell">{t.details}</TableHead>
                      <TableHead>{t.status}</TableHead>
                      <TableHead className="text-right">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{applicant.full_name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {applicant.application_id}
                            </p>
                            <p className="text-xs text-muted-foreground">{applicant.mobile}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-muted-foreground">{t.role}:</span> {applicant.role}
                            </p>
                            <p>
                              <span className="text-muted-foreground">{t.masjid}:</span>{" "}
                              {applicant.masjid_name}
                            </p>
                            <p>
                              <span className="text-muted-foreground">{t.service}:</span>{" "}
                              {applicant.years_of_service} years
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailsApplicant(applicant)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">{t.viewDetails || "Details"}</span>
                            </Button>
                            {applicant.status === "Applied" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedApplicant(applicant);
                                  updateStatus("Under Review");
                                }}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">{t.underReview}</span>
                              </Button>
                            )}
                            {(applicant.status === "Applied" ||
                              applicant.status === "Under Review") && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedApplicant(applicant);
                                    setActionDialog({ open: true, action: "approve" });
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  <span className="hidden sm:inline">{t.approve}</span>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedApplicant(applicant);
                                    setActionDialog({ open: true, action: "reject" });
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  <span className="hidden sm:inline">{t.reject}</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ open, action: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? t.confirmApprove : t.confirmReject}
            </DialogTitle>
            <DialogDescription>
              {selectedApplicant && (
                <span>
                  {selectedApplicant.full_name} ({selectedApplicant.application_id})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, action: null })}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.action === "reject" ? "destructive" : "default"}
              onClick={() => updateStatus(actionDialog.action === "approve" ? "Approved" : "Rejected")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : actionDialog.action === "approve" ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              {actionDialog.action === "approve" ? t.approve : t.reject}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        applicant={detailsApplicant}
        open={!!detailsApplicant}
        onOpenChange={(open) => !open && setDetailsApplicant(null)}
        language={language}
      />
    </div>
  );
};

export default FreeUmrahAdminPage;
