import { useCallback, useEffect, useState } from "react";

const KEY_COMPLETED = "hajj-training-completed";
const KEY_QUIZ_SCORES = "hajj-training-quiz-scores";
const KEY_LAST_TOPIC = "hajj-training-last-topic";
const KEY_STREAK = "hajj-training-streak";
const KEY_LAST_ACTIVE = "hajj-training-last-active";

interface StreakData {
  count: number;
  lastActive: string; // YYYY-MM-DD
}

const readJSON = <T,>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const daysBetween = (a: string, b: string) => {
  const A = new Date(a).getTime();
  const B = new Date(b).getTime();
  return Math.round((B - A) / 86400000);
};

export const useTrainingProgress = (totalTopics: number) => {
  const [completed, setCompleted] = useState<string[]>(() => readJSON<string[]>(KEY_COMPLETED, []));
  const [quizScores, setQuizScores] = useState<Record<string, number>>(() =>
    readJSON<Record<string, number>>(KEY_QUIZ_SCORES, {}),
  );
  const [lastTopic, setLastTopic] = useState<string | null>(() => {
    try {
      return localStorage.getItem(KEY_LAST_TOPIC);
    } catch {
      return null;
    }
  });
  const [streak, setStreak] = useState<StreakData>(() =>
    readJSON<StreakData>(KEY_STREAK, { count: 0, lastActive: "" }),
  );

  useEffect(() => {
    try {
      localStorage.setItem(KEY_COMPLETED, JSON.stringify(completed));
    } catch {}
  }, [completed]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_QUIZ_SCORES, JSON.stringify(quizScores));
    } catch {}
  }, [quizScores]);

  useEffect(() => {
    try {
      if (lastTopic) localStorage.setItem(KEY_LAST_TOPIC, lastTopic);
    } catch {}
  }, [lastTopic]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_STREAK, JSON.stringify(streak));
    } catch {}
  }, [streak]);

  const touchActivity = useCallback(() => {
    const today = todayStr();
    setStreak((prev) => {
      if (!prev.lastActive) return { count: 1, lastActive: today };
      if (prev.lastActive === today) return prev;
      const diff = daysBetween(prev.lastActive, today);
      if (diff === 1) return { count: prev.count + 1, lastActive: today };
      if (diff > 1) return { count: 1, lastActive: today };
      return prev;
    });
    try {
      localStorage.setItem(KEY_LAST_ACTIVE, today);
    } catch {}
  }, []);

  const markCompleted = useCallback(
    (topicId: string) => {
      setCompleted((prev) => (prev.includes(topicId) ? prev : [...prev, topicId]));
      setLastTopic(topicId);
      touchActivity();
    },
    [touchActivity],
  );

  const markInProgress = useCallback(
    (topicId: string) => {
      setLastTopic(topicId);
      touchActivity();
    },
    [touchActivity],
  );

  const recordQuizScore = useCallback(
    (topicId: string, score: number) => {
      setQuizScores((prev) => ({ ...prev, [topicId]: Math.max(prev[topicId] ?? 0, score) }));
      touchActivity();
    },
    [touchActivity],
  );

  const reset = useCallback(() => {
    setCompleted([]);
    setQuizScores({});
    setLastTopic(null);
    setStreak({ count: 0, lastActive: "" });
  }, []);

  const progressPct = totalTopics > 0 ? Math.round((completed.length / totalTopics) * 100) : 0;

  return {
    completed,
    quizScores,
    lastTopic,
    streak: streak.count,
    progressPct,
    markCompleted,
    markInProgress,
    recordQuizScore,
    reset,
    isCompleted: (id: string) => completed.includes(id),
  };
};
