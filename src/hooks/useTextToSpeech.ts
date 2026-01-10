import { useState, useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// Languages that should use ElevenLabs TTS for better quality
const ELEVENLABS_LANGUAGES = ["ur", "ar", "hi", "ta", "te", "mr", "bn", "or", "ml", "pa"];

// Map app language codes to speech synthesis language codes (fallback)
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

// Find the best matching voice for a language
const findVoiceForLanguage = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const langCodes = LANG_MAP[langCode] || [langCode];
  
  for (const code of langCodes) {
    // Try exact match first
    const exactMatch = voices.find(v => v.lang === code);
    if (exactMatch) return exactMatch;
    
    // Try prefix match (e.g., "ar" matches "ar-SA")
    const prefixMatch = voices.find(v => v.lang.startsWith(code.split('-')[0]));
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
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    // Load voices for Web Speech API fallback
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          voicesLoadedRef.current = true;
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speakWithElevenLabs = useCallback(async (text: string, lang: string) => {
    try {
      setIsLoading(true);
      setIsSpeaking(true);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, language: lang }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.audioContent) {
        // Stop any existing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        setIsLoading(false);
        await audio.play();
      }
    } catch (error) {
      console.error("ElevenLabs TTS error:", error);
      setIsSpeaking(false);
      setIsLoading(false);
      // Fallback to Web Speech API
      speakWithWebSpeech(text, lang);
    }
  }, []);

  const speakWithWebSpeech = useCallback((text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;

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

  const speak = useCallback((text: string) => {
    // Stop any ongoing speech first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    // Use ElevenLabs for languages with poor Web Speech API support
    if (ELEVENLABS_LANGUAGES.includes(language)) {
      speakWithElevenLabs(text, language);
    } else {
      speakWithWebSpeech(text, language);
    }
  }, [language, isSpeaking, speakWithElevenLabs, speakWithWebSpeech]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stop, isSpeaking, isSupported, isLoading, currentLanguage: language };
};
