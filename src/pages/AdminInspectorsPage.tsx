import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, UserCheck, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  duty_location: string;
  language: string;
  gender: string;
  category: string;
  quota: string;
  cbt_marks: string;
  interview_marks: string;
  total_marks: string;
  result: string;
}

const emptyForm: InspectorForm = {
  name: "",
  father_name: "",
  state: "",
  cover_number: "",
  mobile: "",
  duty_location: "Makkah",
  language: "Hindi",
  gender: "Male",
  category: "",
  quota: "",
  cbt_marks: "",
  interview_marks: "",
  total_marks: "",
  result: "Selected",
};

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
        duty_location: formData.duty_location,
        language: formData.language,
        gender: formData.gender,
        category: formData.category || null,
        quota: formData.quota || null,
        cbt_marks: formData.cbt_marks ? parseInt(formData.cbt_marks) : null,
        interview_marks: formData.interview_marks ? parseInt(formData.interview_marks) : null,
        total_marks: formData.total_marks ? parseInt(formData.total_marks) : null,
        result: formData.result,
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
      duty_location: inspector.duty_location || "Makkah",
      language: inspector.language || "Hindi",
      gender: inspector.gender || "Male",
      category: inspector.category || "",
      quota: inspector.quota || "",
      cbt_marks: inspector.cbt_marks?.toString() || "",
      interview_marks: inspector.interview_marks?.toString() || "",
      total_marks: inspector.total_marks?.toString() || "",
      result: inspector.result || "Selected",
    });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            Manage Haj Inspectors
          </h1>
          <Button onClick={openAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search inspectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
                </div>
                <div className="flex gap-1 shrink-0 ml-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(inspector)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("Remove this inspector?")) deleteMutation.mutate(inspector.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Inspector" : "Add Inspector"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Father's Name</Label>
                <Input value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>State *</Label>
                  <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {INSPECTOR_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
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
                <div>
                  <Label>Cover Number</Label>
                  <Input value={form.cover_number} onChange={(e) => setForm({ ...form, cover_number: e.target.value })} />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Language</Label>
                  <Input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div>
                  <Label>Quota</Label>
                  <Input value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>CBT Marks</Label>
                  <Input type="number" value={form.cbt_marks} onChange={(e) => setForm({ ...form, cbt_marks: e.target.value })} />
                </div>
                <div>
                  <Label>Interview</Label>
                  <Input type="number" value={form.interview_marks} onChange={(e) => setForm({ ...form, interview_marks: e.target.value })} />
                </div>
                <div>
                  <Label>Total</Label>
                  <Input type="number" value={form.total_marks} onChange={(e) => setForm({ ...form, total_marks: e.target.value })} />
                </div>
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
