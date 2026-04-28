import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Search, UserCheck, Loader2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { INSPECTOR_STATES } from "@/data/hajInspectorsData";
import { ForbiddenError } from "@/components/ForbiddenError";

interface InspectorForm {
  name: string;
  father_name: string;
  state: string;
  cover_number: string;
  mobile: string;
  whatsapp: string;
  duty_location: string;
  language: string;
  gender: string;
  category: string;
  quota: string;
  cbt_marks: string;
  interview_marks: string;
  total_marks: string;
  result: string;
  flight_schedule: string;
  emergency_control_room_no: string;
  total_haji_quota: string;
  total_hajis: string;
  total_groups: string;
  total_group_leaders: string;
  total_doctors: string;
  total_buildings: string;
  live_emergency_cases: string;
  live_complaints: string;
}

const emptyForm: InspectorForm = {
  name: "", father_name: "", state: "", cover_number: "", mobile: "", whatsapp: "",
  duty_location: "Makkah", language: "Hindi", gender: "Male", category: "", quota: "",
  cbt_marks: "", interview_marks: "", total_marks: "", result: "Selected",
  flight_schedule: "", emergency_control_room_no: "",
  total_haji_quota: "0", total_hajis: "0", total_groups: "0", total_group_leaders: "0",
  total_doctors: "0", total_buildings: "0", live_emergency_cases: "0", live_complaints: "0",
};

const toInt = (v: string) => v ? parseInt(v) || 0 : 0;
const toIntOrNull = (v: string) => v ? parseInt(v) || null : null;

const AdminInspectorsPage = () => {
  const { isAdmin } = useUserRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<InspectorForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: inspectors = [], isLoading } = useQuery({
    queryKey: ["admin-haj-inspectors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("haj_inspectors")
        .select("*")
        .order("state")
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: InspectorForm) => {
      const payload = {
        name: formData.name.trim(),
        father_name: formData.father_name.trim() || null,
        state: formData.state,
        cover_number: formData.cover_number.trim() || null,
        mobile: formData.mobile.trim() || null,
        whatsapp: formData.whatsapp.trim() || null,
        duty_location: formData.duty_location,
        language: formData.language,
        gender: formData.gender,
        category: formData.category || null,
        quota: formData.quota || null,
        cbt_marks: toIntOrNull(formData.cbt_marks),
        interview_marks: toIntOrNull(formData.interview_marks),
        total_marks: toIntOrNull(formData.total_marks),
        result: formData.result,
        flight_schedule: formData.flight_schedule.trim() || null,
        emergency_control_room_no: formData.emergency_control_room_no.trim() || null,
        total_haji_quota: toInt(formData.total_haji_quota),
        total_hajis: toInt(formData.total_hajis),
        total_groups: toInt(formData.total_groups),
        total_group_leaders: toInt(formData.total_group_leaders),
        total_doctors: toInt(formData.total_doctors),
        total_buildings: toInt(formData.total_buildings),
        live_emergency_cases: toInt(formData.live_emergency_cases),
        live_complaints: toInt(formData.live_complaints),
      };

      if (editId) {
        const { error } = await supabase.from("haj_inspectors").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("haj_inspectors").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? "Inspector updated" : "Inspector added");
      queryClient.invalidateQueries({ queryKey: ["admin-haj-inspectors"] });
      queryClient.invalidateQueries({ queryKey: ["haj-inspectors"] });
      setDialogOpen(false);
      setForm(emptyForm);
      setEditId(null);
    },
    onError: (err: any) => toast.error(err.message || "Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("haj_inspectors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Inspector removed");
      queryClient.invalidateQueries({ queryKey: ["admin-haj-inspectors"] });
      queryClient.invalidateQueries({ queryKey: ["haj-inspectors"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete"),
  });

  if (!isAdmin) return <ForbiddenError />;

  const filtered = inspectors.filter((i: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.name?.toLowerCase().includes(q) ||
      i.cover_number?.toLowerCase().includes(q) ||
      i.state?.toLowerCase().includes(q) ||
      i.mobile?.includes(q)
    );
  });

  const openEdit = (inspector: any) => {
    setEditId(inspector.id);
    setForm({
      name: inspector.name || "",
      father_name: inspector.father_name || "",
      state: inspector.state || "",
      cover_number: inspector.cover_number || "",
      mobile: inspector.mobile || "",
      whatsapp: inspector.whatsapp || "",
      duty_location: inspector.duty_location || "Makkah",
      language: inspector.language || "Hindi",
      gender: inspector.gender || "Male",
      category: inspector.category || "",
      quota: inspector.quota || "",
      cbt_marks: inspector.cbt_marks?.toString() || "",
      interview_marks: inspector.interview_marks?.toString() || "",
      total_marks: inspector.total_marks?.toString() || "",
      result: inspector.result || "Selected",
      flight_schedule: inspector.flight_schedule || "",
      emergency_control_room_no: inspector.emergency_control_room_no || "",
      total_haji_quota: inspector.total_haji_quota?.toString() || "0",
      total_hajis: inspector.total_hajis?.toString() || "0",
      total_groups: inspector.total_groups?.toString() || "0",
      total_group_leaders: inspector.total_group_leaders?.toString() || "0",
      total_doctors: inspector.total_doctors?.toString() || "0",
      total_buildings: inspector.total_buildings?.toString() || "0",
      live_emergency_cases: inspector.live_emergency_cases?.toString() || "0",
      live_complaints: inspector.live_complaints?.toString() || "0",
    });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const F = (label: string, key: keyof InspectorForm, type = "text") => (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            Manage Haj Inspectors
          </h1>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/inspectors/upload">
                <Upload className="w-4 h-4 mr-1" /> Upload PDF
              </Link>
            </Button>
            <Button onClick={openAdd} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search inspectors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <p className="text-sm text-muted-foreground">{filtered.length} inspectors</p>

        {isLoading && <p className="text-muted-foreground text-center py-8">Loading...</p>}

        <div className="space-y-2 pb-20">
          {filtered.map((inspector: any) => (
            <Card key={inspector.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{inspector.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {inspector.state} • {inspector.duty_location}
                    {inspector.cover_number && ` • Cover: ${inspector.cover_number}`}
                    {inspector.mobile && ` • ${inspector.mobile}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hajis: {inspector.total_hajis || 0} • Groups: {inspector.total_groups || 0} • Emergency: {inspector.live_emergency_cases || 0}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0 ml-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(inspector)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon" variant="ghost" className="text-destructive"
                    onClick={() => { if (confirm("Remove this inspector?")) deleteMutation.mutate(inspector.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Inspector" : "Add Inspector"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {F("Name *", "name")}
              {F("Father's Name", "father_name")}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>State *</Label>
                  <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{INSPECTOR_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duty Location *</Label>
                  <Select value={form.duty_location} onValueChange={(v) => setForm({ ...form, duty_location: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Makkah">Makkah</SelectItem>
                      <SelectItem value="Madinah">Madinah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {F("Cover Number", "cover_number")}
                {F("Mobile", "mobile")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {F("WhatsApp", "whatsapp")}
                {F("Language", "language")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Result</Label>
                  <Select value={form.result} onValueChange={(v) => setForm({ ...form, result: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Selected">Selected</SelectItem>
                      <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {F("Category", "category")}
                {F("Quota", "quota")}
              </div>

              <p className="text-sm font-semibold text-foreground pt-2 border-t">Flight & Emergency</p>
              {F("Flight Schedule", "flight_schedule")}
              {F("Emergency Control Room No.", "emergency_control_room_no")}

              <p className="text-sm font-semibold text-foreground pt-2 border-t">Operational Stats</p>
              <div className="grid grid-cols-2 gap-2">
                {F("Total Haji Quota", "total_haji_quota", "number")}
                {F("Total Hajis", "total_hajis", "number")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {F("Total Groups", "total_groups", "number")}
                {F("Total Group Leaders", "total_group_leaders", "number")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {F("Total Doctors", "total_doctors", "number")}
                {F("Total Buildings", "total_buildings", "number")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {F("Live Emergency Cases", "live_emergency_cases", "number")}
                {F("Live Complaints", "live_complaints", "number")}
              </div>

              <p className="text-sm font-semibold text-foreground pt-2 border-t">Marks</p>
              <div className="grid grid-cols-3 gap-2">
                {F("CBT", "cbt_marks", "number")}
                {F("Interview", "interview_marks", "number")}
                {F("Total", "total_marks", "number")}
              </div>

              <Button
                className="w-full"
                onClick={() => saveMutation.mutate(form)}
                disabled={!form.name || !form.state || saveMutation.isPending}
              >
                {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editId ? "Update" : "Add Inspector"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminInspectorsPage;
