import { useMemo, useRef, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { DIRECTORY_CATEGORIES, type DirectoryCategory, type MissionDirectoryContact, deleteMissionDirectoryContact, getMissionDirectoryContacts, saveMissionDirectoryContact } from "@/lib/missionDirectory";
import { CheckCircle2, FileUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Form = Partial<MissionDirectoryContact> & { name: string; category: DirectoryCategory; source_name: string };
const empty: Form = { name: "", category: "helpline", source_name: "Haj Committee of India", languages: [], verified: false };

const fieldNames: Array<keyof Form> = ["name", "designation", "phone", "whatsapp", "email", "city", "state", "embarkation_point", "building_number", "building_name", "sector", "address", "duty_area", "group_number", "specialization", "available_hours", "emergency_phone", "maps_url", "source_name", "source_url"];

export default function AdminMissionDirectoryPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Form>(empty);
  const contacts = useQuery({ queryKey: ["admin-mission-directory"], queryFn: () => getMissionDirectoryContacts(true) });
  const save = useMutation({ mutationFn: () => saveMissionDirectoryContact({ ...form, languages: form.languages || [] }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-mission-directory"] }); setForm(empty); toast({ title: "Directory contact saved" }); }, onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }) });
  const remove = useMutation({ mutationFn: deleteMissionDirectoryContact, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-mission-directory"] }) });
  const set = (key: keyof Form, value: string | boolean | string[]) => setForm((current) => ({ ...current, [key]: value }));

  const importCsv = async (file: File) => {
    const [head, ...lines] = (await file.text()).split(/\r?\n/).filter(Boolean);
    const headers = head.split(",").map((v) => v.trim());
    const invalid: string[] = [];
    for (const line of lines.slice(0, 500)) {
      const values = line.split(",").map((v) => v.trim());
      const row = Object.fromEntries(headers.map((key, i) => [key, values[i] || null]));
      if (!row.name || !DIRECTORY_CATEGORIES.includes(row.category as DirectoryCategory) || !row.source_name) { invalid.push(row.name || "unnamed row"); continue; }
      await saveMissionDirectoryContact({ ...row, category: row.category as DirectoryCategory, verified: false, languages: row.languages ? String(row.languages).split("|") : [] } as Form);
    }
    qc.invalidateQueries({ queryKey: ["admin-mission-directory"] });
    toast({ title: "CSV import complete", description: `${lines.length - invalid.length} queued for verification${invalid.length ? `; ${invalid.length} skipped.` : "."}` });
  };

  const rows = useMemo(() => contacts.data || [], [contacts.data]);
  return <MainLayout><PageHeader title="Mission Directory Management" subtitle="Only verified contacts appear to pilgrims. CSV imports always start unverified." />
    <main className="mx-auto max-w-5xl space-y-4 px-4 pb-24">
      <Card><CardContent className="grid gap-3 p-4 md:grid-cols-3">
        <Button variant="outline" onClick={() => input.current?.click()}><FileUp className="mr-2 h-4 w-4" />Import CSV</Button>
        <input ref={input} className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && importCsv(event.target.files[0])} />
        <p className="text-xs text-muted-foreground md:col-span-2">Required CSV columns: <code>name, category, source_name</code>. Optional fields use the database column names. Every imported row requires verification.</p>
      </CardContent></Card>
      <Card><CardContent className="grid gap-3 p-4 md:grid-cols-3">
        <Input className="md:col-span-2" placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Select value={form.category} onValueChange={(value) => set("category", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DIRECTORY_CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category.replaceAll("_", " ")}</SelectItem>)}</SelectContent></Select>
        {fieldNames.slice(1).map((field) => <Input key={field} placeholder={field.replaceAll("_", " ")} value={String(form[field] || "")} onChange={(e) => set(field, e.target.value)} />)}
        <Input placeholder="Languages (comma separated)" value={(form.languages || []).join(", ")} onChange={(e) => set("languages", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} />
        <label className="flex min-h-10 items-center justify-between rounded-md border px-3 text-sm">Verified for public display <Switch checked={Boolean(form.verified)} onCheckedChange={(value) => set("verified", value)} /></label>
        <Button className="md:col-span-3" disabled={!form.name || !form.source_name || save.isPending} onClick={() => save.mutate()}><Plus className="mr-2 h-4 w-4" />{form.id ? "Update contact" : "Add contact"}</Button>
      </CardContent></Card>
      <section className="space-y-2">{rows.map((contact) => <Card key={contact.id}><CardContent className="flex items-center gap-3 p-3"><CheckCircle2 className={contact.verified ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-amber-500"} /><div className="min-w-0 flex-1"><p className="font-medium">{contact.name}</p><p className="text-xs text-muted-foreground">{contact.category} · {contact.source_name} · {contact.verified ? "Verified" : "Pending verification"}</p></div><Button size="icon" variant="ghost" onClick={() => setForm(contact)} aria-label="Edit contact"><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(contact.id)} aria-label="Delete contact"><Trash2 className="h-4 w-4" /></Button></CardContent></Card>)}</section>
    </main></MainLayout>;
}
