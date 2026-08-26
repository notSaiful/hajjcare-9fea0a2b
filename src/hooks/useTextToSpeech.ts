import { useState, useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getZoyaLanguage } from "@/lib/zoyaLanguages";
import { supabase } from "@/integrations/supabase/client";

const MAX_CHUNK_LENGTH = 700;
const MAX_CACHE_ENTRIES = 24;
const audioCache = new Map<string, Blob>();

const splitText = (text: string) => {
  const sentences = text.match(/[^.!?।؟]+[.!?।؟]*/g) ?? [text];
  const chunks: string[] = [];
  let chunk = "";
  for (const sentence of sentences) {
    if (chunk && chunk.length + sentence.length > MAX_CHUNK_LENGTH) {
      chunks.push(chunk.trim());
      chunk = sentence;
    } else chunk += sentence;
  }
  if (chunk.trim()) chunks.push(chunk.trim());
  return chunks.length ? chunks : [text];
};

const telemetry = (event: string, details: Record<string, unknown>) =>
  console.info("[zoya-voice]", { event, at: new Date().toISOString(), ...details });

export const useTextToSpeech = () => {
  const { language: siteLanguage } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    audioRef.current?.pause();
    audioRef.current = null;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsLoading(false);
    telemetry("playback_stopped", {});
  }, []);

  const browserSpeak = useCallback(async (chunks: string[], code: string, requestId: number) => {
    const profile = getZoyaLanguage(code);
    if (!("speechSynthesis" in window)) throw new Error(`Voice is unavailable for ${profile.name} on this device.`);
    const voices = window.speechSynthesis.getVoices();
    const voice = profile.speechLocales
      .map((locale) => voices.find((item) => item.lang.toLowerCase() === locale.toLowerCase())
        ?? voices.find((item) => item.lang.toLowerCase().startsWith(locale.split("-")[0].toLowerCase())))
      .find(Boolean);
    if (!voice) throw new Error(`Voice is unavailable for ${profile.name} on this device.`);
    telemetry("tts_fallback_browser", { language: code, locale: voice.lang, voiceId: voice.voiceURI });
    for (const text of chunks) {
      if (requestId !== requestIdRef.current) return;
      await new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = voice.lang;
        utterance.rate = 0.9;
        utterance.onend = () => resolve();
        utterance.onerror = () => reject(new Error("Browser speech playback failed."));
        window.speechSynthesis.speak(utterance);
      });
    }
  }, []);

  const fetchAudio = useCallback(async (text: string, code: string, requestId: number) => {
    const cacheKey = `${code}:${text}`;
    const cached = audioCache.get(cacheKey);
    if (cached) return cached;
    const { data } = await supabase.auth.getSession();
    if (!data.session?.access_token) throw new Error("Signed-in neural voice is unavailable.");
    let lastError: Error | undefined;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (requestId !== requestIdRef.current) throw new Error("Playback cancelled.");
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rumik-tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${data.session.access_token}` },
          body: JSON.stringify({ text, language: code, locale: getZoyaLanguage(code).locale }),
        });
        if (!response.ok) throw new Error(`Neural voice returned ${response.status}.`);
        const blob = await response.blob();
        if (!blob.size) throw new Error("Neural voice returned empty audio.");
        audioCache.set(cacheKey, blob);
        if (audioCache.size > MAX_CACHE_ENTRIES) audioCache.delete(audioCache.keys().next().value as string);
        telemetry("tts_audio_ready", { language: code, retryAttempts: attempt });
        return blob;
      } catch (cause) {
        lastError = cause instanceof Error ? cause : new Error("Neural voice request failed.");
        telemetry("tts_retry", { language: code, attempt: attempt + 1, error: lastError.message });
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
      }
    }
    throw lastError;
  }, []);

  const speak = useCallback(async (text: string, languageCode = siteLanguage) => {
    if (!text.trim()) return;
    if (isSpeaking) { stop(); return; }
    stop();
    const requestId = requestIdRef.current;
    const profile = getZoyaLanguage(languageCode);
    const chunks = splitText(text);
    setError(null);
    setIsLoading(true);
    setIsSpeaking(true);
    telemetry("tts_started", { language: profile.code, ttsLanguage: profile.locale, chunks: chunks.length });
    try {
      for (const chunk of chunks) {
        const blob = await fetchAudio(chunk, profile.code, requestId);
        if (requestId !== requestIdRef.current) return;
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error("Neural audio playback failed."));
          audio.play().catch(reject);
        });
        URL.revokeObjectURL(url);
        objectUrlRef.current = null;
      }
      telemetry("tts_completed", { language: profile.code, playbackStatus: "completed" });
    } catch (cause) {
      if (requestId !== requestIdRef.current) return;
      try {
        await browserSpeak(chunks, profile.code, requestId);
        telemetry("tts_completed", { language: profile.code, playbackStatus: "browser-fallback" });
      } catch (fallbackCause) {
        const message = fallbackCause instanceof Error ? fallbackCause.message : `Voice is unavailable for ${profile.name}.`;
        setError(message);
        telemetry("tts_unavailable", { language: profile.code, fallbackReason: cause instanceof Error ? cause.message : "unknown", error: message });
      }
    } finally {
      if (requestId === requestIdRef.current) { setIsLoading(false); setIsSpeaking(false); }
    }
  }, [browserSpeak, fetchAudio, isSpeaking, siteLanguage, stop]);

  useEffect(() => stop, [stop]);
  return { speak, stop, isSpeaking, isSupported: true, isLoading, error, currentLanguage: siteLanguage };
};
