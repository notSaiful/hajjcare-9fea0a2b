import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Pause, Play, RotateCcw, Square, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getZoyaLanguage } from "@/lib/zoyaLanguages";
import { useLanguage } from "@/contexts/LanguageContext";

export type AccessibleRuleAudioItem = {
  id: string;
  text: string;
  /** Optional DOM id to highlight while this item is being read. */
  anchorId?: string;
  label?: string;
};

type Props = {
  items: AccessibleRuleAudioItem[];
  language: string;
  onActiveChange?: (anchorId: string | undefined) => void;
};

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;
const audioMemoryCache = new Map<string, Blob>();
const CACHE_NAME = "hajcare-rules-voice-v1";

const LABELS: Record<string, Record<string, string>> = {
  play: { en: "Play rules audio", ar: "تشغيل صوت القواعد", ur: "قواعد کی آڈیو چلائیں", hi: "नियमों का ऑडियो चलाएँ", mr: "नियमांचा ऑडिओ सुरू करा", bn: "নিয়মের অডিও চালান", ta: "விதிகள் ஆடியோ இயக்கவும்", te: "నియమాల ఆడియో ప్లే చేయండి", gu: "નિયમોનો ઑડિયો ચલાવો", pa: "ਨਿਯਮਾਂ ਦੀ ਆਡੀਓ ਚਲਾਓ", ml: "നിയമങ്ങളുടെ ഓഡിയോ പ്ലേ ചെയ്യുക", kn: "ನಿಯಮಗಳ ಆಡಿಯೊ ಪ್ಲೇ ಮಾಡಿ" },
  pause: { en: "Pause rules audio", ar: "إيقاف صوت القواعد مؤقتاً", ur: "قواعد کی آڈیو روکیں", hi: "नियमों का ऑडियो रोकें", mr: "नियमांचा ऑडिओ थांबवा", bn: "নিয়মের অডিও থামান", ta: "விதிகள் ஆடியோ இடைநிறுத்தவும்", te: "నియమాల ఆడియో పాజ్ చేయండి", gu: "નિયમોનો ઑડિયો થોભાવો", pa: "ਨਿਯਮਾਂ ਦੀ ਆਡੀਓ ਰੋਕੋ", ml: "നിയമങ്ങളുടെ ഓഡിയോ നിർത്തുക", kn: "ನಿಯಮಗಳ ಆಡಿಯೊ ವಿರಾಮಗೊಳಿಸಿ" },
  resume: { en: "Resume rules audio", ar: "متابعة صوت القواعد", ur: "قواعد کی آڈیو دوبارہ شروع کریں", hi: "नियमों का ऑडियो फिर शुरू करें", mr: "नियमांचा ऑडिओ पुन्हा सुरू करा", bn: "নিয়মের অডিও আবার চালান", ta: "விதிகள் ஆடியோ மீண்டும் இயக்கவும்", te: "నియమాల ఆడియో రెజ్యూమ్ చేయండి", gu: "નિયમોનો ઑડિયો ફરી શરૂ કરો", pa: "ਨਿਯਮਾਂ ਦੀ ਆਡੀਓ ਮੁੜ ਚਲਾਓ", ml: "നിയമങ്ങളുടെ ഓഡിയോ പുനരാരംഭിക്കുക", kn: "ನಿಯಮಗಳ ಆಡಿಯೊ ಪುನರಾರಂಭಿಸಿ" },
  stop: { en: "Stop rules audio", ar: "إيقاف صوت القواعد", ur: "قواعد کی آڈیو بند کریں", hi: "नियमों का ऑडियो बंद करें", mr: "नियमांचा ऑडिओ बंद करा", bn: "নিয়মের অডিও বন্ধ করুন", ta: "விதிகள் ஆடியோ நிறுத்தவும்", te: "నియమాల ఆడియో ఆపండి", gu: "નિયમોનો ઑડિયો બંધ કરો", pa: "ਨਿਯਮਾਂ ਦੀ ਆਡੀਓ ਬੰਦ ਕਰੋ", ml: "നിയമങ്ങളുടെ ഓഡിയോ നിർത്തുക", kn: "ನಿಯಮಗಳ ಆಡಿಯೊ ನಿಲ್ಲಿಸಿ" },
  previous: { en: "Previous rule", ar: "القاعدة السابقة", ur: "پچھلا قاعدہ", hi: "पिछला नियम", mr: "मागील नियम", bn: "আগের নিয়ম", ta: "முந்தைய விதி", te: "మునుపటి నియమం", gu: "પહેલો નિયમ", pa: "ਪਿਛਲਾ ਨਿਯਮ", ml: "മുമ്പത്തെ നിയമം", kn: "ಹಿಂದಿನ ನಿಯಮ" },
  next: { en: "Next rule", ar: "القاعدة التالية", ur: "اگلا قاعدہ", hi: "अगला नियम", mr: "पुढील नियम", bn: "পরের নিয়ম", ta: "அடுத்த விதி", te: "తదుపరి నియమం", gu: "આગળનો નિયમ", pa: "ਅਗਲਾ ਨਿਯਮ", ml: "അടുത്ത നിയമം", kn: "ಮುಂದಿನ ನಿಯಮ" },
  speed: { en: "Playback speed", ar: "سرعة التشغيل", ur: "پلے بیک رفتار", hi: "प्लेबैक गति", mr: "प्लेबॅक वेग", bn: "প্লেব্যাক গতি", ta: "இயக்க வேகம்", te: "ప్లేబ్యాక్ వేగం", gu: "પ્લેબેક ઝડપ", pa: "ਪਲੇਬੈਕ ਗਤੀ", ml: "പ്ലേബാക്ക് വേഗത", kn: "ಪ್ಲೇಬ್ಯಾಕ್ ವೇಗ" },
  reading: { en: "Reading", ar: "جارٍ القراءة", ur: "پڑھا جا رہا ہے", hi: "पढ़ा जा रहा है", mr: "वाचले जात आहे", bn: "পড়া হচ্ছে", ta: "படிக்கப்படுகிறது", te: "చదువుతోంది", gu: "વાંચી રહ્યું છે", pa: "ਪੜ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ", ml: "വായിക്കുന്നു", kn: "ಓದಲಾಗುತ್ತಿದೆ" },
  progressSaved: { en: "Listening progress is saved on this device.", ar: "يتم حفظ تقدم الاستماع على هذا الجهاز.", ur: "سننے کی پیش رفت اس فون میں محفوظ ہے۔", hi: "सुनने की प्रगति इस डिवाइस पर सेव होती है।", mr: "ऐकण्याची प्रगती या डिव्हाइसवर जतन केली जाते.", bn: "শোনার অগ্রগতি এই ডিভাইসে সংরক্ষিত হয়।", ta: "கேட்கும் முன்னேற்றம் இந்த சாதனத்தில் சேமிக்கப்படுகிறது.", te: "వినే పురోగతి ఈ పరికరంలో సేవ్ చేయబడుతుంది.", gu: "સાંભળવાની પ્રગતિ આ ઉપકરણ પર સાચવાય છે.", pa: "ਸੁਣਨ ਦੀ ਪ੍ਰਗਤੀ ਇਸ ਡਿਵਾਈਸ ਉੱਤੇ ਸੁਰੱਖਿਅਤ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।", ml: "കേൾവി പുരോഗതി ഈ ഉപകരണത്തിൽ സംരക്ഷിക്കുന്നു.", kn: "ಆಲಿಸುವ ಪ್ರಗತಿಯನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ." },
  unavailable: { en: "AI voice is unavailable; device speech is being used.", ar: "الصوت الذكي غير متاح؛ يتم استخدام صوت الجهاز.", ur: "اے آئی آواز دستیاب نہیں؛ فون کی آواز استعمال ہو رہی ہے۔", hi: "AI आवाज़ उपलब्ध नहीं है; डिवाइस की आवाज़ इस्तेमाल हो रही है।", mr: "AI आवाज उपलब्ध नाही; डिव्हाइसचा आवाज वापरला जात आहे.", bn: "AI ভয়েস পাওয়া যাচ্ছে না; ডিভাইসের ভয়েস ব্যবহার করা হচ্ছে।", ta: "AI குரல் கிடைக்கவில்லை; சாதனக் குரல் பயன்படுத்தப்படுகிறது.", te: "AI వాయిస్ అందుబాటులో లేదు; పరికరం వాయిస్ ఉపయోగించబడుతోంది.", gu: "AI અવાજ ઉપલબ્ધ નથી; ઉપકરણનો અવાજ વપરાઈ રહ્યો છે.", pa: "AI ਆਵਾਜ਼ ਉਪਲਬਧ ਨਹੀਂ; ਡਿਵਾਈਸ ਦੀ ਆਵਾਜ਼ ਵਰਤੀ ਜਾ ਰਹੀ ਹੈ।", ml: "AI ശബ്ദം ലഭ്യമല്ല; ഉപകരണ ശബ്ദം ഉപയോഗിക്കുന്നു.", kn: "AI ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ; ಸಾಧನದ ಧ್ವನಿ ಬಳಸಲಾಗುತ್ತಿದೆ." },
};

const label = (key: string, language: string) => LABELS[key]?.[language] || LABELS[key]?.en || key;

const cacheRequest = (key: string) => new Request(`${window.location.origin}/__hajcare_rules_voice/${encodeURIComponent(key)}`);

const safeStorageKey = (language: string, items: AccessibleRuleAudioItem[]) => {
  const source = `${language}:${items.map((item) => `${item.id}:${item.text}`).join("|")}`;
  let hash = 5381;
  for (let index = 0; index < source.length; index += 1) hash = (hash * 33) ^ source.charCodeAt(index);
  return `hajcare:rules-audio-progress-v2:${(hash >>> 0).toString(16)}`;
};

export const AccessibleRulesAudioPlayer = ({ items, language, onActiveChange }: Props) => {
  const { isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [usedBrowserVoice, setUsedBrowserVoice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const generationRef = useRef(0);
  const progressKey = useMemo(() => safeStorageKey(language, items), [items, language]);

  const persistProgress = useCallback((index: number, seconds = 0) => {
    try { localStorage.setItem(progressKey, JSON.stringify({ index, seconds, updatedAt: Date.now() })); } catch { /* optional */ }
  }, [progressKey]);

  const clearMedia = useCallback(() => {
    generationRef.current += 1;
    audioRef.current?.pause();
    audioRef.current = null;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    utteranceRef.current = null;
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const fetchNeuralAudio = useCallback(async (item: AccessibleRuleAudioItem, generation: number) => {
    const cacheKey = `${language}:${item.id}:${item.text}`;
    const memory = audioMemoryCache.get(cacheKey);
    if (memory) return memory;
    const session = await supabase.auth.getSession();
    const request = cacheRequest(cacheKey);
    if ("caches" in window) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) {
        const blob = await cached.blob();
        audioMemoryCache.set(cacheKey, blob);
        return blob;
      }
    }
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rumik-tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, ...(session.data.session?.access_token ? { Authorization: `Bearer ${session.data.session.access_token}` } : {}), "x-hajcare-a11y": "rules-audio" },
      body: JSON.stringify({ text: item.text, language, locale: getZoyaLanguage(language).locale }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Voice service returned ${response.status}`);
    const blob = await response.blob();
    if (!blob.size || generation !== generationRef.current) throw new Error("Voice playback cancelled");
    audioMemoryCache.set(cacheKey, blob);
    if ("caches" in window) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, new Response(blob, { headers: { "Content-Type": blob.type || "audio/wav" } }));
    }
    return blob;
  }, [language]);

  const browserSpeak = useCallback((item: AccessibleRuleAudioItem, generation: number) => new Promise<void>((resolve, reject) => {
    if (!("speechSynthesis" in window)) { reject(new Error("Speech is not supported on this device.")); return; }
    const voices = window.speechSynthesis.getVoices();
    const profile = getZoyaLanguage(language);
    const regionalFallbacks: Record<string, string[]> = {
      mr: ["hi-IN", "hi"], gom: ["hi-IN", "hi"], doi: ["hi-IN", "hi"], mai: ["hi-IN", "hi"], brx: ["hi-IN", "hi"], ne: ["hi-IN", "hi"], sa: ["hi-IN", "hi"], ks: ["ur-IN", "ur", "hi-IN", "hi"], mni: ["bn-IN", "bn", "hi-IN", "hi"], sat: ["bn-IN", "bn", "hi-IN", "hi"], sd: ["ur-PK", "ur", "hi-IN", "hi"],
    };
    const requestedLocales = [...profile.speechLocales, ...(regionalFallbacks[language] || [])];
    const softVoice = (candidate: SpeechSynthesisVoice) => /female|samantha|lekha|google|natural|neural|zira|veena|heera|rishi/i.test(candidate.name);
    const voice = requestedLocales.map((locale) => voices.find((candidate) => candidate.lang.toLowerCase() === locale.toLowerCase()) || voices.find((candidate) => candidate.lang.toLowerCase().startsWith(locale.split("-")[0].toLowerCase()))).find(Boolean)
      || voices.find(softVoice)
      || voices[0];
    if (!voice) { reject(new Error(`No ${profile.name} voice is installed on this device.`)); return; }
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    // A slightly slower rate and gentle pitch make the fallback voice easier
    // to understand for elderly and low-vision pilgrims.
    utterance.rate = Math.min(1.5, 0.82 * speed);
    utterance.pitch = 1.04;
    utterance.volume = 0.94;
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(event.error || "Device speech failed."));
    utteranceRef.current = utterance;
    if (generation === generationRef.current) window.speechSynthesis.speak(utterance);
  }), [language, speed]);

  const playAt = useCallback(async (requestedIndex: number) => {
    if (!items.length) return;
    const index = Math.max(0, Math.min(requestedIndex, items.length - 1));
    let resumeSeconds = 0;
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || "null") as { index?: number; seconds?: number } | null;
      if (saved?.index === index && typeof saved.seconds === "number") resumeSeconds = Math.max(0, saved.seconds);
    } catch { /* optional */ }
    clearMedia();
    const generation = generationRef.current;
    setCurrentIndex(index);
    persistProgress(index, resumeSeconds);
    onActiveChange?.(items[index].anchorId);
    setError(null);
    setIsLoading(true);
    setIsPlaying(true);
    try {
      const blob = await fetchNeuralAudio(items[index], generation);
      if (generation !== generationRef.current) return;
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.playbackRate = speed;
      audioRef.current = audio;
      audio.onloadedmetadata = () => {
        if (resumeSeconds > 0 && resumeSeconds < audio.duration) audio.currentTime = resumeSeconds;
      };
      audio.ontimeupdate = () => persistProgress(index, audio.currentTime);
      audio.onended = () => {
        persistProgress(index + 1 < items.length ? index + 1 : index, 0);
        if (index + 1 < items.length) void playAt(index + 1);
        else { setIsPlaying(false); setIsLoading(false); }
      };
      audio.onerror = () => {
        if (generation === generationRef.current) {
          setIsPlaying(false);
          setIsLoading(false);
          setError("Neural audio playback failed. Try again or use the device voice.");
        }
      };
      await audio.play();
      setIsLoading(false);
      setUsedBrowserVoice(false);
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
    } catch (neuralError) {
      if (generation !== generationRef.current) return;
      setUsedBrowserVoice(true);
      setIsLoading(false);
      try {
        await browserSpeak(items[index], generation);
        if (generation === generationRef.current) {
          persistProgress(index + 1 < items.length ? index + 1 : index, 0);
          if (index + 1 < items.length) void playAt(index + 1);
          else setIsPlaying(false);
        }
      } catch (browserError) {
        if (generation === generationRef.current) {
          setIsPlaying(false);
          setError(browserError instanceof Error ? browserError.message : "Voice playback failed.");
        }
      }
    }
  }, [browserSpeak, clearMedia, fetchNeuralAudio, items, onActiveChange, persistProgress, progressKey, speed]);

  const pause = useCallback(() => {
    persistProgress(currentIndex, audioRef.current?.currentTime || 0);
    audioRef.current?.pause();
    if (window.speechSynthesis?.speaking) window.speechSynthesis.pause();
    setIsPlaying(false);
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
  }, [currentIndex, persistProgress]);

  const resume = useCallback(async () => {
    if (audioRef.current) { await audioRef.current.play(); setIsPlaying(true); return; }
    if (window.speechSynthesis?.paused) { window.speechSynthesis.resume(); setIsPlaying(true); return; }
    void playAt(currentIndex);
  }, [currentIndex, playAt]);

  const stop = useCallback(() => {
    persistProgress(currentIndex, audioRef.current?.currentTime || 0);
    clearMedia();
    onActiveChange?.(undefined);
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "none";
  }, [clearMedia, currentIndex, onActiveChange, persistProgress]);

  const changeSpeed = (nextSpeed: number) => {
    setSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    if (utteranceRef.current && window.speechSynthesis?.speaking) {
      // SpeechSynthesisUtterance.rate is not mutable on all platforms; restart
      // the current rule so the new speed is honoured consistently.
      const index = currentIndex;
      clearMedia();
      setTimeout(() => void playAt(index), 0);
    }
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || "null") as { index?: number } | null;
      if (saved?.index != null && saved.index >= 0 && saved.index < items.length) {
        setCurrentIndex(saved.index);
        onActiveChange?.(items[saved.index].anchorId);
      }
    } catch { /* optional */ }
  }, [items, onActiveChange, progressKey]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler("play", () => void resume());
      navigator.mediaSession.setActionHandler("pause", pause);
      navigator.mediaSession.setActionHandler("stop", stop);
      navigator.mediaSession.setActionHandler("nexttrack", () => void playAt(currentIndex + 1));
      navigator.mediaSession.setActionHandler("previoustrack", () => void playAt(Math.max(0, currentIndex - 1)));
    } catch { /* Media Session actions vary by browser */ }
    return () => { try { navigator.mediaSession.setActionHandler("nexttrack", null); navigator.mediaSession.setActionHandler("previoustrack", null); } catch { /* optional */ } };
  }, [currentIndex, pause, playAt, resume, stop]);

  useEffect(() => () => clearMedia(), [clearMedia]);

  if (!items.length) return null;
  const current = items[currentIndex];
  const isPaused = !isPlaying && (Boolean(audioRef.current) || Boolean(window.speechSynthesis?.paused));

  return (
    <section className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 shadow-sm" aria-label={label("play", language)} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
          <Volume2 className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">{label("play", language)}</h2>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {isLoading ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{label("reading", language)}…</span> : `${currentIndex + 1} / ${items.length}${current?.label ? ` · ${current.label}` : ""}`}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button type="button" size="lg" className="min-h-11 gap-2" onClick={() => (isPlaying ? pause() : isPaused ? void resume() : void playAt(currentIndex))} aria-label={isPlaying ? label("pause", language) : isPaused ? label("resume", language) : label("play", language)}>
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <span className="sr-only">{isPlaying ? label("pause", language) : isPaused ? label("resume", language) : label("play", language)}</span>
        </Button>
        <Button type="button" variant="outline" size="lg" className="min-h-11" onClick={() => void playAt(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} aria-label={label("previous", language)} title={label("previous", language)}><SkipBack className="h-5 w-5" /></Button>
        <Button type="button" variant="outline" size="lg" className="min-h-11" onClick={() => void playAt(Math.min(items.length - 1, currentIndex + 1))} disabled={currentIndex === items.length - 1} aria-label={label("next", language)} title={label("next", language)}><SkipForward className="h-5 w-5" /></Button>
        <Button type="button" variant="outline" size="lg" className="min-h-11" onClick={stop} aria-label={label("stop", language)} title={label("stop", language)}><Square className="h-5 w-5" /></Button>
        <label className="ml-auto flex min-h-11 items-center gap-2 text-sm font-medium" htmlFor="rules-audio-speed"><span>{label("speed", language)}</span><select id="rules-audio-speed" value={speed} onChange={(event) => changeSpeed(Number(event.target.value))} className="h-11 rounded-md border-2 border-input bg-background px-2 text-base" aria-label={label("speed", language)}>{SPEEDS.map((value) => <option key={value} value={value}>{value}x</option>)}</select></label>
      </div>
      {usedBrowserVoice && <p className="mt-3 text-xs text-muted-foreground" role="status">{label("unavailable", language)}</p>}
      {error && <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">{error}</p>}
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><RotateCcw className="h-3.5 w-3.5" /> {label("reading", language)} {currentIndex + 1} — {label("progressSaved", language)}</p>
    </section>
  );
};
