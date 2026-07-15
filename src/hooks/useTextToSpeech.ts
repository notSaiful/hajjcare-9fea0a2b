import { useState, useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// ALL read-aloud voice is Rumik (`muga`) via the `rumik-tts` edge function. The
// browser SpeechSynthesis (Web Speech) API is kept ONLY as a last-resort fallback
// when Rumik or the network is down, so the read-aloud button still works on bad
// pilgrim connections. Replaces the previous ElevenLabs + Web-Speech-for-English mix.

// Map app language codes to speech synthesis language codes (Web Speech fallback only).
const LANG_MAP: Record<string, string[]> = {
  en: ["en-US", "en-GB", "en"],
  ar: ["ar-SA", "ar-EG", "ar"],
  ur: ["ur-PK", "ur-IN", "ur"],
  hi: ["hi-IN", "hi"],
  ta: ["ta-IN", "ta"],
  te: ["te-IN", "te"],
  mr: ["mr-IN", "mr"],
  bn: ["bn-IN", "bn-BD", "bn"],
  or: ["or-IN", "or"],
  ml: ["ml-IN", "ml"],
  pa: ["pa-IN", "pa-PK", "pa"],
};

const findVoiceForLanguage = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const langCodes = LANG_MAP[langCode] || [langCode];

  for (const code of langCodes) {
    const exactMatch = voices.find((v) => v.lang === code);
    if (exactMatch) return exactMatch;
    const prefixMatch = voices.find((v) => v.lang.startsWith(code.split("-")[0]));
    if (prefixMatch) return prefixMatch;
  }
  return null;
};

export const useTextToSpeech = () => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) voicesLoadedRef.current = true;
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const speakWithWebSpeech = useCallback((text: string, lang: string) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = findVoiceForLanguage(lang);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = LANG_MAP[lang]?.[0] || "en-US";
    }
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakWithRumik = useCallback(
    async (text: string, lang: string) => {
      try {
        setIsLoading(true);
        setIsSpeaking(true);

        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;

        if (!accessToken) {
          // No session → Web Speech fallback (matches prior behaviour for signed-out users).
          setIsLoading(false);
          setIsSpeaking(false);
          speakWithWebSpeech(text, lang);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rumik-tts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ text, language: lang }),
          }
        );

        if (!response.ok) throw new Error(`Rumik TTS failed: ${response.status}`);

        // Rumik returns a 24 kHz mono WAV; play it via a blob URL on an <audio> element.
        const blob = await response.blob();
        cleanupAudio();
        const audioUrl = URL.createObjectURL(blob);
        objectUrlRef.current = audioUrl;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          cleanupAudio();
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          cleanupAudio();
        };

        setIsLoading(false);
        await audio.play();
      } catch (error) {
        console.error("Rumik TTS error, falling back to Web Speech:", error);
        setIsSpeaking(false);
        setIsLoading(false);
        cleanupAudio();
        // Last-resort fallback so the button still speaks on a dead network.
        speakWithWebSpeech(text, lang);
      }
    },
    [cleanupAudio, speakWithWebSpeech]
  );

  const speak = useCallback(
    (text: string) => {
      // Stop any ongoing speech first.
      cleanupAudio();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      // Every language → Rumik.
      speakWithRumik(text, language);
    },
    [isSpeaking, language, speakWithRumik, cleanupAudio]
  );

  const stop = useCallback(() => {
    cleanupAudio();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsLoading(false);
  }, [cleanupAudio]);

  useEffect(() => {
    return () => {
      cleanupAudio();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [cleanupAudio]);

  return { speak, stop, isSpeaking, isSupported, isLoading, currentLanguage: language };
};