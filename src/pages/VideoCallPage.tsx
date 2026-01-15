import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  CallControls,
  useCallStateHooks,
  CallingState,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Video, PhoneCall, Copy, Check, Loader2, LogIn, Plus } from "lucide-react";
import { toast } from "sonner";

const labels = {
  title: { en: "Video Call", ar: "مكالمة فيديو", ur: "ویڈیو کال", hi: "वीडियो कॉल", ta: "வீடியோ அழைப்பு", te: "వీడియో కాల్", mr: "व्हिडिओ कॉल", bn: "ভিডিও কল", or: "ଭିଡିଓ କଲ", ml: "വീഡിയോ കോൾ", pa: "ਵੀਡੀਓ ਕਾਲ" },
  subtitle: { en: "Connect with your family during Hajj", ar: "تواصل مع عائلتك أثناء الحج", ur: "حج کے دوران اپنے خاندان سے رابطہ کریں", hi: "हज के दौरान अपने परिवार से जुड़ें", ta: "ஹஜ்ஜின் போது உங்கள் குடும்பத்துடன் இணையுங்கள்", te: "హజ్ సమయంలో మీ కుటుంబంతో కనెక్ట్ అవ్వండి", mr: "हज दरम्यान तुमच्या कुटुंबाशी कनेक्ट व्हा", bn: "হজের সময় আপনার পরিবারের সাথে সংযোগ করুন", or: "ହଜ ସମୟରେ ଆପଣଙ୍କ ପରିବାର ସହିତ ସଂଯୋଗ କରନ୍ତୁ", ml: "ഹജ്ജ് സമയത്ത് നിങ്ങളുടെ കുടുംബവുമായി ബന്ധപ്പെടുക", pa: "ਹੱਜ ਦੌਰਾਨ ਆਪਣੇ ਪਰਿਵਾਰ ਨਾਲ ਜੁੜੋ" },
  createCall: { en: "Create New Call", ar: "إنشاء مكالمة جديدة", ur: "نئی کال بنائیں", hi: "नई कॉल बनाएं", ta: "புதிய அழைப்பை உருவாக்கவும்", te: "కొత్త కాల్ సృష్టించండి", mr: "नवीन कॉल तयार करा", bn: "নতুন কল তৈরি করুন", or: "ନୂଆ କଲ ସୃଷ୍ଟି କରନ୍ତୁ", ml: "പുതിയ കോൾ സൃഷ്ടിക്കുക", pa: "ਨਵੀਂ ਕਾਲ ਬਣਾਓ" },
  joinCall: { en: "Join Call", ar: "الانضمام إلى المكالمة", ur: "کال میں شامل ہوں", hi: "कॉल में शामिल हों", ta: "அழைப்பில் சேரவும்", te: "కాల్‌లో చేరండి", mr: "कॉलमध्ये सामील व्हा", bn: "কলে যোগ দিন", or: "କଲରେ ଯୋଗ ଦିଅନ୍ତୁ", ml: "കോളിൽ ചേരുക", pa: "ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ" },
  enterCallId: { en: "Enter Call ID", ar: "أدخل معرف المكالمة", ur: "کال آئی ڈی درج کریں", hi: "कॉल आईडी दर्ज करें", ta: "அழைப்பு ஐடியை உள்ளிடவும்", te: "కాల్ ఐడి నమోదు చేయండి", mr: "कॉल आयडी प्रविष्ट करा", bn: "কল আইডি লিখুন", or: "କଲ ଆଇଡି ପ୍ରବେଶ କରନ୍ତୁ", ml: "കോൾ ഐഡി നൽകുക", pa: "ਕਾਲ ਆਈਡੀ ਦਾਖਲ ਕਰੋ" },
  callId: { en: "Call ID", ar: "معرف المكالمة", ur: "کال آئی ڈی", hi: "कॉल आईडी", ta: "அழைப்பு ஐடி", te: "కాల్ ఐడి", mr: "कॉल आयडी", bn: "কল আইডি", or: "କଲ ଆଇଡି", ml: "കോൾ ഐഡി", pa: "ਕਾਲ ਆਈਡੀ" },
  copied: { en: "Copied!", ar: "تم النسخ!", ur: "کاپی ہو گیا!", hi: "कॉपी हो गया!", ta: "நகலெடுக்கப்பட்டது!", te: "కాపీ చేయబడింది!", mr: "कॉपी केले!", bn: "কপি করা হয়েছে!", or: "କପି ହୋଇଛି!", ml: "പകർത്തി!", pa: "ਕਾਪੀ ਕੀਤਾ!" },
  shareCallId: { en: "Share this Call ID with family members", ar: "شارك معرف المكالمة مع أفراد العائلة", ur: "اس کال آئی ڈی کو خاندان کے افراد کے ساتھ شیئر کریں", hi: "इस कॉल आईडी को परिवार के सदस्यों के साथ साझा करें", ta: "இந்த அழைப்பு ஐடியை குடும்ப உறுப்பினர்களுடன் பகிரவும்", te: "ఈ కాల్ ఐడిని కుటుంబ సభ్యులతో షేర్ చేయండి", mr: "हे कॉल आयडी कुटुंबातील सदस्यांसोबत शेअर करा", bn: "এই কল আইডি পরিবারের সদস্যদের সাথে শেয়ার করুন", or: "ଏହି କଲ ଆଇଡି ପରିବାର ସଦସ୍ୟଙ୍କ ସହ ଅଂଶୀଦାର କରନ୍ତୁ", ml: "ഈ കോൾ ഐഡി കുടുംബാംഗങ്ങളുമായി പങ്കിടുക", pa: "ਇਸ ਕਾਲ ਆਈਡੀ ਨੂੰ ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ" },
  leaveCall: { en: "Leave Call", ar: "مغادرة المكالمة", ur: "کال چھوڑیں", hi: "कॉल छोड़ें", ta: "அழைப்பை விடுங்கள்", te: "కాల్ వదిలివేయండి", mr: "कॉल सोडा", bn: "কল ছেড়ে দিন", or: "କଲ ଛାଡନ୍ତୁ", ml: "കോൾ വിടുക", pa: "ਕਾਲ ਛੱਡੋ" },
  connecting: { en: "Connecting...", ar: "جاري الاتصال...", ur: "کنیکٹ ہو رہا ہے...", hi: "कनेक्ट हो रहा है...", ta: "இணைக்கிறது...", te: "కనెక్ట్ అవుతోంది...", mr: "कनेक्ट होत आहे...", bn: "সংযুক্ত হচ্ছে...", or: "ସଂଯୋଗ ହେଉଛି...", ml: "ബന്ധിപ്പിക്കുന്നു...", pa: "ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ..." },
  loginRequired: { en: "Please login to make video calls", ar: "يرجى تسجيل الدخول لإجراء مكالمات فيديو", ur: "ویڈیو کالز کرنے کے لیے لاگ ان کریں", hi: "वीडियो कॉल करने के लिए कृपया लॉगिन करें", ta: "வீடியோ அழைப்புகள் செய்ய உள்நுழையவும்", te: "వీడియో కాల్స్ చేయడానికి దయచేసి లాగిన్ అవ్వండి", mr: "व्हिडिओ कॉल करण्यासाठी कृपया लॉगिन करा", bn: "ভিডিও কল করতে অনুগ্রহ করে লগইন করুন", or: "ଭିଡିଓ କଲ କରିବାକୁ ଦୟାକରି ଲଗଇନ କରନ୍ତୁ", ml: "വീഡിയോ കോളുകൾ ചെയ്യാൻ ദയവായി ലോഗിൻ ചെയ്യുക", pa: "ਵੀਡੀਓ ਕਾਲਾਂ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਲੌਗਇਨ ਕਰੋ" },
  login: { en: "Login", ar: "تسجيل الدخول", ur: "لاگ ان", hi: "लॉगिन", ta: "உள்நுழை", te: "లాగిన్", mr: "लॉगिन", bn: "লগইন", or: "ଲଗଇନ", ml: "ലോഗിൻ", pa: "ਲੌਗਇਨ" },
};

function CallUI({ callId, onLeave }: { callId: string; onLeave: () => void }) {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { language } = useLanguage();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{labels.connecting[language] || labels.connecting.en}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{labels.callId[language] || labels.callId.en}</p>
          <p className="font-mono font-medium">{callId}</p>
        </div>
        <CopyButton text={callId} />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        {labels.shareCallId[language] || labels.shareCallId.en}
      </p>
      <div className="aspect-video bg-black rounded-xl overflow-hidden">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>
      <CallControls onLeave={onLeave} />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(labels.copied[language] || labels.copied.en);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export default function VideoCallPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<StreamVideoClient["call"]> | null>(null);
  const [callId, setCallId] = useState("");
  const [joinCallId, setJoinCallId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initializeClient = useCallback(async () => {
    if (!user) return null;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return null;

      const response = await supabase.functions.invoke("stream-video-token", {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (response.error) {
        console.error("Failed to get Stream token:", response.error);
        toast.error("Failed to initialize video call");
        return null;
      }

      const { token, userId, userName, apiKey } = response.data;

      const streamClient = new StreamVideoClient({
        apiKey,
        user: {
          id: userId,
          name: userName,
        },
        token,
      });

      setClient(streamClient);
      return streamClient;
    } catch (error) {
      console.error("Error initializing Stream client:", error);
      toast.error("Failed to initialize video call");
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (user && !client) {
      initializeClient();
    }

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user, client, initializeClient]);

  const createNewCall = async () => {
    setIsLoading(true);
    try {
      let streamClient = client;
      if (!streamClient) {
        streamClient = await initializeClient();
        if (!streamClient) {
          setIsLoading(false);
          return;
        }
      }

      const newCallId = `hajj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newCall = streamClient.call("default", newCallId);
      
      await newCall.join({ create: true });
      
      setCall(newCall);
      setCallId(newCallId);
    } catch (error) {
      console.error("Error creating call:", error);
      toast.error("Failed to create call");
    } finally {
      setIsLoading(false);
    }
  };

  const joinExistingCall = async () => {
    if (!joinCallId.trim()) return;
    
    setIsLoading(true);
    try {
      let streamClient = client;
      if (!streamClient) {
        streamClient = await initializeClient();
        if (!streamClient) {
          setIsLoading(false);
          return;
        }
      }

      const existingCall = streamClient.call("default", joinCallId.trim());
      await existingCall.join();
      
      setCall(existingCall);
      setCallId(joinCallId.trim());
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Failed to join call. Please check the Call ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveCall = async () => {
    if (call) {
      await call.leave();
      setCall(null);
      setCallId("");
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container max-w-md mx-auto py-8 px-4">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{labels.title[language] || labels.title.en}</CardTitle>
              <CardDescription>
                {labels.loginRequired[language] || labels.loginRequired.en}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/auth")} className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                {labels.login[language] || labels.login.en}
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto py-6 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
          <p className="text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
        </div>

        {call && client ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallUI callId={callId} onLeave={leaveCall} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="space-y-6">
            {/* Create New Call */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={createNewCall}
                  disabled={isLoading}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {labels.createCall[language] || labels.createCall.en}
                </Button>
              </CardContent>
            </Card>

            {/* Join Existing Call */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  {labels.joinCall[language] || labels.joinCall.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={labels.enterCallId[language] || labels.enterCallId.en}
                  value={joinCallId}
                  onChange={(e) => setJoinCallId(e.target.value)}
                  className="font-mono"
                />
                <Button
                  onClick={joinExistingCall}
                  disabled={isLoading || !joinCallId.trim()}
                  className="w-full gap-2"
                  variant="secondary"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PhoneCall className="h-4 w-4" />
                  )}
                  {labels.joinCall[language] || labels.joinCall.en}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
