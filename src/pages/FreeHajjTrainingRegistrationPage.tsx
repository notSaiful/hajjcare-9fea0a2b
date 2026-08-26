import { FormEvent, ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  EMBARKATION_POINTS,
  INDIAN_LOCATIONS,
  TRAINING_COMMUNITY_URLS,
} from "@/data/trainingRegistrationOptions";
import { ZOYA_LANGUAGES } from "@/lib/zoyaLanguages";
import {
  BookOpenCheck,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Download,
  Globe2,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Send,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from "lucide-react";

type Pilgrim = {
  name: string;
  mobile: string | null;
  whatsapp: string | null;
  address: string | null;
  category: string | null;
  pilgrim_count: number | null;
};
type RegistrationForm = {
  coverNumber: string;
  state: string;
  district: string;
  pilgrimCount: string;
  embarkationPoint: string;
  mobile: string;
  whatsapp: string;
  consent: boolean;
  whatsappDailyUpdates: boolean;
};
const blankForm: RegistrationForm = {
  coverNumber: "",
  state: "",
  district: "",
  pilgrimCount: "1",
  embarkationPoint: "",
  mobile: "",
  whatsapp: "",
  consent: false,
  whatsappDailyUpdates: false,
};

const languageLabels = ZOYA_LANGUAGES.map((language) => language.name);
const normalizeCover = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9/-]/g, "")
    .slice(0, 40);

export default function FreeHajjTrainingRegistrationPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<RegistrationForm>(blankForm);
  const [pilgrim, setPilgrim] = useState<Pilgrim | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );
  const [verifying, setVerifying] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [registrationCode, setRegistrationCode] = useState<string | null>(null);
  const [bookingStarted, setBookingStarted] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const districts = useMemo(
    () => INDIAN_LOCATIONS[form.state] || [],
    [form.state],
  );

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.consent)
      return toast({
        title: "Consent is required",
        description:
          "Please agree to the training communication purpose before verification.",
        variant: "destructive",
      });
    if (
      form.coverNumber.length < 5 ||
      !form.state ||
      !form.district ||
      !form.embarkationPoint
    )
      return toast({
        title: "Complete all required fields",
        description:
          "Cover Number, State, District, and Embarkation Point are mandatory.",
        variant: "destructive",
      });
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "hajj-training-registration",
        {
          body: {
            action: "verify",
            reservationId,
            coverNumber: form.coverNumber,
            state: form.state,
            district: form.district,
            embarkationPoint: form.embarkationPoint,
            consent: true,
          },
        },
      );
      if (error) throw error;
      if (!data?.verificationToken || !data?.pilgrim)
        throw new Error(
          data?.error ||
            "Record not found. Please check your Cover Number or contact HajCare AI Support.",
        );
      const record = data.pilgrim as Pilgrim;
      setPilgrim(record);
      setVerificationToken(data.verificationToken);
      setForm((current) => ({
        ...current,
        mobile: current.mobile || record.mobile || "",
        whatsapp: current.whatsapp || record.whatsapp || record.mobile || "",
      }));
    } catch (error) {
      console.error("Training registration verification failed", error);
      toast({
        title: "Record not found",
        description:
          "Please check your Cover Number or contact HajCare AI Support.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const startBooking = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\+?[0-9]{10,15}$/.test(form.mobile.replace(/\s/g, "")))
      return toast({
        title: "Enter a valid mobile number",
        variant: "destructive",
      });
    if (form.coverNumber.length < 5 || !form.state || !form.district || !/^[1-9][0-9]?$/.test(form.pilgrimCount))
      return toast({
        title: "Complete pilgrim details",
        description: "Cover Number, State, District, and group member count are required.",
        variant: "destructive",
      });
    if (!/^\+?[0-9]{10,15}$/.test(form.whatsapp.replace(/\s/g, "")))
      return toast({
        title: "Enter a valid WhatsApp number",
        variant: "destructive",
      });
    if (!form.consent)
      return toast({
        title: "Consent is required",
        description:
          "Please agree to the training communication purpose before continuing.",
        variant: "destructive",
      });
    setBookingSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "hajj-training-registration",
        {
          body: {
            action: "reserve",
            coverNumber: form.coverNumber,
            state: form.state,
            district: form.district,
            pilgrimCount: Number(form.pilgrimCount),
            contact: {
              mobile: form.mobile.trim(),
              whatsapp: form.whatsapp.trim(),
            },
            consent: true,
            whatsappDailyUpdates: form.whatsappDailyUpdates,
          },
        },
      );
      if (error) throw error;
      if (!data?.success || !data?.reservationId)
        throw new Error(data?.error || "Seat request could not be saved.");
      setReservationId(data.reservationId);
      setBookingStarted(true);
    } catch (error) {
      console.error("Training seat reservation failed", error);
      toast({
        title: "Registration unavailable",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const register = async () => {
    if (!verificationToken || !pilgrim) return;
    if (!/^\+?[0-9]{10,15}$/.test(form.mobile.replace(/\s/g, "")))
      return toast({
        title: "Enter a valid mobile number",
        variant: "destructive",
      });
    if (!/^\+?[0-9]{10,15}$/.test(form.whatsapp.replace(/\s/g, "")))
      return toast({
        title: "Enter a valid WhatsApp number",
        description:
          "A WhatsApp number is needed to confirm your free training seat.",
        variant: "destructive",
      });
    setRegistering(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "hajj-training-registration",
        {
          body: {
            action: "register",
            verificationToken,
            contact: {
              mobile: form.mobile.trim(),
              whatsapp: form.whatsapp.trim(),
            },
            consent: true,
            whatsappDailyUpdates: form.whatsappDailyUpdates,
            language: "en",
          },
        },
      );
      if (error) throw error;
      if (!data?.success || !data?.registrationId)
        throw new Error(data?.error || "Registration could not be completed.");
      setRegistrationCode(data.registrationId);
      setComplete(true);
    } catch (error) {
      console.error("Training registration submission failed", error);
      toast({
        title: "Registration unavailable",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
    encodeURIComponent("HajCare AI 100-Day Free Hajj Training") +
    "&details=" +
    encodeURIComponent(
      "Training dates and class links will be shared through HajCare AI.",
    );
  const whatsappShareUrl = registrationCode
    ? `https://wa.me/?text=${encodeURIComponent(
        `Assalamu Alaikum! My HajCare AI 100-Day Hajj Training registration ID is ${registrationCode}.`,
      )}`
    : "";
  const actionLink = (url: string, label: string, icon: ReactNode) =>
    url ? (
      <Button asChild className="w-full justify-start gap-3" variant="outline">
        <a href={url} target="_blank" rel="noreferrer">
          {icon}
          {label}
        </a>
      </Button>
    ) : (
      <Button
        type="button"
        className="w-full justify-start gap-3"
        variant="outline"
        disabled
      >
        {icon}
        {label} <span className="ml-auto text-xs font-normal">Coming soon</span>
      </Button>
    );

  if (complete)
    return (
      <MainLayout>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
          <Card className="overflow-hidden border-primary/20 shadow-xl">
            <div className="bg-gradient-to-br from-primary to-emerald-900 p-7 text-primary-foreground">
              <CheckCircle2 className="mb-4 h-12 w-12" />
              <h1 className="text-2xl font-bold">
                Your free seat is confirmed
              </h1>
              <p className="mt-2 text-base leading-7 text-white/90">
                Congratulations! Your free online Hajj training registration has
                been completed successfully.
              </p>
            </div>
            <CardContent className="space-y-4 p-5 sm:p-7">
              <p className="text-sm text-muted-foreground">
                Your confirmation is queued for the contact details you
                confirmed.
                {form.whatsappDailyUpdates
                  ? " Daily training updates are enabled for your WhatsApp number."
                  : " You can enable daily WhatsApp updates when you register."}{" "}
                The community and schedule links below become active when the
                training administrator publishes them.
              </p>
              {registrationCode && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Your Training Registration ID
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-primary">
                    {registrationCode}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Keep this ID safe for training support and future updates.
                  </p>
                </div>
              )}
              {whatsappShareUrl && (
                <Button asChild className="w-full justify-start gap-3" variant="outline">
                  <a href={whatsappShareUrl} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    Share Registration ID on WhatsApp
                  </a>
                </Button>
              )}
              {actionLink(
                TRAINING_COMMUNITY_URLS.whatsapp,
                "Join WhatsApp Community",
                <MessageCircle className="h-5 w-5 text-emerald-600" />,
              )}
              {actionLink(
                TRAINING_COMMUNITY_URLS.telegram,
                "Join Telegram Channel",
                <Send className="h-5 w-5 text-sky-600" />,
              )}
              <Button asChild className="w-full justify-start gap-3">
                <Link to="/hajj-training-videos">
                  <BookOpenCheck className="h-5 w-5" />
                  Training Dashboard
                </Link>
              </Button>
              {actionLink(
                TRAINING_COMMUNITY_URLS.schedule,
                "Download Training Schedule (PDF)",
                <Download className="h-5 w-5 text-amber-600" />,
              )}
              <Button
                asChild
                className="w-full justify-start gap-3"
                variant="outline"
              >
                <a href={calendarUrl} target="_blank" rel="noreferrer">
                  <CalendarPlus className="h-5 w-5 text-primary" />
                  Add Classes to Google Calendar
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <main className="mx-auto max-w-3xl px-4 py-6 pb-12 sm:py-10">
        <section className="rounded-3xl bg-gradient-to-br from-emerald-950 via-primary to-emerald-800 p-6 text-primary-foreground shadow-xl sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white/15 p-3">
              <UsersRound className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-200">
                100% Free · HajCare AI
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Book Your Free Hajj Training Seat
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
                Book your seat first with your contact details, then verify your
                Hajj Cover to confirm the registration for our 100-Day
                programme.
              </p>
              <div className="mt-4">
                <VoiceAssistant variant="cta" />
              </div>
            </div>
          </div>
        </section>
        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex gap-2 rounded-xl border p-3 text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            Verified Cover lookup
          </div>
          <div className="flex gap-2 rounded-xl border p-3 text-sm">
            <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
            Optional daily WhatsApp update
          </div>
          <div className="flex gap-2 rounded-xl border p-3 text-sm">
            <LockKeyhole className="h-4 w-4 shrink-0 text-primary" />
            Consent-based communication
          </div>
        </section>
        <Card className="mt-5 shadow-md">
          <CardContent className="p-5 sm:p-7">
            {!bookingStarted ? (
              <form className="space-y-5" onSubmit={startBooking}>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Step 1 of 2
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    Book your free training seat
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    First enter your Hajj group details. We will save your seat
                    request securely, then verify the Cover against authorised
                    Hajj records.
                  </p>
                </div>
                <div className="space-y-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-primary">
                    Hajj group details
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="booking-cover">
                      Cover Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="booking-cover"
                      value={form.coverNumber}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          coverNumber: normalizeCover(event.target.value),
                        }))
                      }
                      placeholder="Enter Hajj Cover Number"
                      autoComplete="off"
                      maxLength={40}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        State <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.state}
                        onValueChange={(state) =>
                          setForm((current) => ({
                            ...current,
                            state,
                            district: "",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(INDIAN_LOCATIONS)
                            .sort()
                            .map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        District <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.district}
                        onValueChange={(district) =>
                          setForm((current) => ({ ...current, district }))
                        }
                        disabled={!form.state}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              form.state ? "Select District" : "Select State first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-pilgrim-count">
                      Members in Group <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="booking-pilgrim-count"
                      type="number"
                      min={1}
                      max={99}
                      inputMode="numeric"
                      value={form.pilgrimCount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          pilgrimCount: event.target.value,
                        }))
                      }
                      placeholder="Number of pilgrims in this Cover"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="booking-mobile">
                      Mobile Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="booking-mobile"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.mobile}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          mobile: event.target.value,
                        }))
                      }
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-whatsapp">
                      WhatsApp Number{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="booking-whatsapp"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.whatsapp}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          whatsapp: event.target.value,
                        }))
                      }
                      placeholder="10-digit WhatsApp number"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                  <Checkbox
                    id="booking-whatsapp-daily-updates"
                    checked={form.whatsappDailyUpdates}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({
                        ...current,
                        whatsappDailyUpdates: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="booking-whatsapp-daily-updates"
                    className="cursor-pointer text-sm leading-6"
                  >
                    <span className="font-semibold text-foreground">
                      Send daily training updates on WhatsApp
                    </span>
                    <span className="mt-1 block text-muted-foreground">
                      Receive the day’s class reminder and important
                      announcements. You can opt out later.
                    </span>
                  </Label>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                  <Checkbox
                    id="consent"
                    checked={form.consent}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({
                        ...current,
                        consent: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="consent"
                    className="cursor-pointer text-sm leading-6"
                  >
                    I agree to use my information only for Hajj training and
                    communication purposes.
                  </Label>
                </div>
                <Button
                  className="w-full gap-2 sm:w-auto"
                  type="submit"
                  disabled={bookingSubmitting}
                >
                  {bookingSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Registration & Continue{" "}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </form>
            ) : !pilgrim ? (
              <form className="space-y-5" onSubmit={verify}>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Step 2 of 2
                  </p>
                  <h2 className="text-lg font-bold">Verify your Hajj Cover</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter the details exactly as registered with the authorised
                    Hajj records.
                  </p>
                </div>
                <div className="grid gap-3 rounded-2xl bg-muted/45 p-4 text-sm sm:grid-cols-3">
                  <div>
                    <span className="block text-muted-foreground">Cover Number</span>
                    <span className="font-semibold">{form.coverNumber}</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground">State / District</span>
                    <span className="font-semibold">{form.state}, {form.district}</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground">Group Members</span>
                    <span className="font-semibold">{form.pilgrimCount}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>
                    Embarkation Point{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.embarkationPoint}
                    onValueChange={(embarkationPoint) =>
                      setForm((current) => ({ ...current, embarkationPoint }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Embarkation Point" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMBARKATION_POINTS.map((point) => (
                        <SelectItem key={point} value={point}>
                          {point}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                  <Checkbox
                    id="consent"
                    checked={form.consent}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({
                        ...current,
                        consent: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="consent"
                    className="cursor-pointer text-sm leading-6"
                  >
                    I agree to use my information only for Hajj training and
                    communication purposes.
                  </Label>
                </div>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBookingStarted(false)}
                  >
                    Back to contact details
                  </Button>
                  <Button
                    className="w-full gap-2 sm:w-auto"
                    type="submit"
                    disabled={verifying}
                  >
                    {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
                    Verify Cover Number <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <section className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Pilgrim details verified
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Review the available verified record below, then confirm
                      or update your contact details before booking.
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary">
                  Available verified record
                </p>
                <dl className="grid gap-4 rounded-2xl bg-muted/45 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="mt-1 font-semibold">{pilgrim.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="mt-1 font-semibold">
                      {pilgrim.category || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      Number of Pilgrims in the Cover
                    </dt>
                    <dd className="mt-1 font-semibold">
                      {pilgrim.pilgrim_count || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Address</dt>
                    <dd className="mt-1 font-semibold">
                      {pilgrim.address || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Mobile Number</dt>
                    <dd className="mt-1 font-semibold">
                      {pilgrim.mobile || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">WhatsApp Number</dt>
                    <dd className="mt-1 font-semibold">
                      {pilgrim.whatsapp || pilgrim.mobile || "Not available"}
                    </dd>
                  </div>
                </dl>
                <div>
                  <h3 className="font-semibold">
                    Confirm or update contact details
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the fields below only if the mobile number or WhatsApp
                    number needs correction.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">
                      Mobile Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="mobile"
                      inputMode="tel"
                      value={form.mobile}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          mobile: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">
                      WhatsApp Number{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="whatsapp"
                      inputMode="tel"
                      value={form.whatsapp}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          whatsapp: event.target.value,
                        }))
                      }
                      placeholder="10-digit WhatsApp number"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                  <Checkbox
                    id="whatsapp-daily-updates"
                    checked={form.whatsappDailyUpdates}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({
                        ...current,
                        whatsappDailyUpdates: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="whatsapp-daily-updates"
                    className="cursor-pointer text-sm leading-6"
                  >
                    <span className="font-semibold text-foreground">
                      Send daily training updates on WhatsApp
                    </span>
                    <span className="mt-1 block text-muted-foreground">
                      Receive the day’s class reminder and important training
                      announcements on this WhatsApp number. You can opt out
                      later.
                    </span>
                  </Label>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 p-3 text-xs text-muted-foreground">
                  <Globe2 className="h-4 w-4 shrink-0 text-primary" />
                  Voice assistance supports: {languageLabels.join(", ")}.
                </div>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPilgrim(null);
                      setVerificationToken(null);
                    }}
                  >
                    Change Cover details
                  </Button>
                  <Button
                    className="gap-2"
                    onClick={() => void register()}
                    disabled={registering}
                  >
                    {registering && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Book my free seat & confirm
                  </Button>
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </main>
    </MainLayout>
  );
}
