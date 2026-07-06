import { useState, useCallback, useRef, useEffect } from 'react';

interface UseEmergencyAlertOptions {
  vibrationPattern?: number[];
  soundEnabled?: boolean;
}

export function useEmergencyAlert(options: UseEmergencyAlertOptions = {}) {
  const {
    vibrationPattern = [0, 1000, 500, 1000], // Pattern: wait, vibrate, pause, vibrate...
    soundEnabled = true,
  } = options;

  const [isAlertActive, setIsAlertActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const vibrationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create ambulance-like siren sound
  const createSirenSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      audioContextRef.current = new AudioContextClass();
      const ctx = audioContextRef.current;

      // Create oscillator for siren
      oscillatorRef.current = ctx.createOscillator();
      gainNodeRef.current = ctx.createGain();

      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.setValueAtTime(600, ctx.currentTime);
      
      // Create siren effect - oscillate between frequencies
      const sirenDuration = 0.5; // seconds per cycle
      const lowFreq = 600;
      const highFreq = 900;

      // Loop the siren pattern
      const scheduleFrequencyChange = (startTime: number) => {
        if (!oscillatorRef.current || !audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        oscillatorRef.current.frequency.setValueAtTime(lowFreq, startTime);
        oscillatorRef.current.frequency.linearRampToValueAtTime(highFreq, startTime + sirenDuration);
        oscillatorRef.current.frequency.linearRampToValueAtTime(lowFreq, startTime + sirenDuration * 2);
      };

      // Schedule multiple cycles
      for (let i = 0; i < 100; i++) {
        scheduleFrequencyChange(ctx.currentTime + i * sirenDuration * 2);
      }

      gainNodeRef.current.gain.setValueAtTime(0.3, ctx.currentTime);

      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(ctx.destination);
      oscillatorRef.current.start();
    } catch (error) {
      console.error('Error creating siren sound:', error);
    }
  }, [soundEnabled]);

  // Start continuous vibration pattern
  const startVibration = useCallback(() => {
    if (!navigator.vibrate) return;

    // Create looping vibration
    const loopVibration = () => {
      navigator.vibrate(vibrationPattern);
    };

    loopVibration();
    
    // Calculate total pattern duration and restart
    const patternDuration = vibrationPattern.reduce((a, b) => a + b, 0);
    vibrationIntervalRef.current = setInterval(loopVibration, patternDuration);
  }, [vibrationPattern]);

  // Stop vibration
  const stopVibration = useCallback(() => {
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
    navigator.vibrate?.(0);
  }, []);

  // Stop siren sound
  const stopSirenSound = useCallback(() => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping siren:', error);
    }
  }, []);

  // Start emergency alert
  const startEmergencyAlert = useCallback(() => {
    setIsAlertActive(true);
    createSirenSound();
    startVibration();
  }, [createSirenSound, startVibration]);

  // Stop emergency alert
  const stopEmergencyAlert = useCallback(() => {
    setIsAlertActive(false);
    stopSirenSound();
    stopVibration();
  }, [stopSirenSound, stopVibration]);

  // Single trigger (one-shot vibration + sound burst)
  const triggerAlertOnce = useCallback(() => {
    navigator.vibrate?.(vibrationPattern);
    
    if (soundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.5);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } catch (error) {
        console.error('Error playing alert sound:', error);
      }
    }
  }, [vibrationPattern, soundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSirenSound();
      stopVibration();
    };
  }, [stopSirenSound, stopVibration]);

  return {
    isAlertActive,
    startEmergencyAlert,
    stopEmergencyAlert,
    triggerAlertOnce,
  };
}
