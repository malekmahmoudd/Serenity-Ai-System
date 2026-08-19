"use client";

/**
 * Browser-local storage for mood, wellness checks and calming-exercise
 * sessions.
 *
 * WHY LOCALSTORAGE AND NOT THE BACKEND
 * ------------------------------------
 * The FastAPI service has no mood/activity endpoints -- see backend/main.py,
 * whose only user-facing routes are /chat, /auth/* and /health. Rather than
 * pretend otherwise with in-memory module state that silently resets on every
 * reload (which is what lib/static-dashboard-data.ts does), this keeps data in
 * localStorage so it genuinely survives a refresh.
 *
 * The honest limits of that, stated here so nobody has to rediscover them:
 * data is per-browser, does not follow the user to another device, and is lost
 * if they clear site data. The dashboard says so in the UI rather than letting
 * someone assume their history is safely stored somewhere.
 *
 * MIGRATING TO THE BACKEND LATER
 * ------------------------------
 * Everything below is deliberately shaped like rows in a table -- flat records
 * with an id and an ISO timestamp. Swapping the read/write helpers for fetch
 * calls should not require touching any component.
 *
 * HYDRATION
 * ---------
 * Nothing reads localStorage during render. `useWellness` starts empty and
 * loads in an effect, so the server-rendered markup and the first client
 * render always match. Components should branch on `ready` rather than
 * assuming data exists on first paint.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "serenity-wellness-v1";
const SCHEMA_VERSION = 1;

/* ------------------------------------------------------------------ types */

export type MoodEntry = {
  id: string;
  /** 1 (worst) to 10 (best). */
  score: number;
  note: string;
  at: string;
};

export type ExerciseSession = {
  id: string;
  kind: "breathing" | "ocean";
  label: string;
  /** Seconds actually spent, not the seconds intended. */
  seconds: number;
  /** False when the user left before the planned end. Not a failure. */
  completed: boolean;
  at: string;
};

export type WellnessCheck = {
  id: string;
  /** Keyed by question id, each 1-5. */
  answers: Record<string, number>;
  /** Normalised 0-100 for display. */
  score: number;
  at: string;
};

export type WellnessData = {
  version: number;
  moods: MoodEntry[];
  sessions: ExerciseSession[];
  checks: WellnessCheck[];
};

const EMPTY: WellnessData = {
  version: SCHEMA_VERSION,
  moods: [],
  sessions: [],
  checks: [],
};

/* -------------------------------------------------------------- utilities */

function makeId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Local calendar day key, so "today" means the user's today, not UTC's. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Tolerant of anything already in storage: a corrupted or hand-edited blob
 * degrades to empty rather than throwing on every page load.
 */
function parse(raw: string | null): WellnessData {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY;
    return {
      version: SCHEMA_VERSION,
      moods: Array.isArray(parsed.moods) ? (parsed.moods as MoodEntry[]) : [],
      sessions: Array.isArray(parsed.sessions)
        ? (parsed.sessions as ExerciseSession[])
        : [],
      checks: Array.isArray(parsed.checks)
        ? (parsed.checks as WellnessCheck[])
        : [],
    };
  } catch {
    return EMPTY;
  }
}

function read(): WellnessData {
  if (typeof window === "undefined") return EMPTY;
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY;
  }
}

function write(data: WellnessData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Private-browsing quota errors are not worth breaking the page over.
  }
}

/* ------------------------------------------------------------------ stats */

export type WellnessStats = {
  /** Mean mood over the window, 1-10, or null with no entries. */
  averageMood: number | null;
  /** Most recent mood entry, if any. */
  latestMood: MoodEntry | null;
  /** Positive = improving. Null when there isn't enough to compare. */
  moodTrend: number | null;
  /** Share of started exercises that ran to the end, 0-100. */
  completionRate: number | null;
  /** Distinct days in the window with any logged activity. */
  activeDays: number;
  /** Consecutive days up to today with activity. */
  streak: number;
  totalSessions: number;
  totalMinutes: number;
  latestCheck: WellnessCheck | null;
};

function withinDays(iso: string, days: number, now: Date): boolean {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return false;
  return now.getTime() - then <= days * 24 * 60 * 60 * 1000;
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

export function computeStats(
  data: WellnessData,
  windowDays = 7,
  now: Date = new Date(),
): WellnessStats {
  const moods = data.moods.filter((m) => withinDays(m.at, windowDays, now));
  const sessions = data.sessions.filter((s) =>
    withinDays(s.at, windowDays, now),
  );

  const sortedMoods = [...data.moods].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
  const latestMood = sortedMoods[0] ?? null;

  // Compare the two halves of the window rather than first-vs-last entry, so
  // one unusually bad afternoon doesn't read as a collapse.
  let moodTrend: number | null = null;
  if (moods.length >= 4) {
    const ordered = [...moods].sort(
      (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
    );
    const midpoint = Math.floor(ordered.length / 2);
    const earlier = mean(ordered.slice(0, midpoint).map((m) => m.score));
    const later = mean(ordered.slice(midpoint).map((m) => m.score));
    if (earlier !== null && later !== null) moodTrend = later - earlier;
  }

  const completionRate =
    sessions.length > 0
      ? Math.round(
          (sessions.filter((s) => s.completed).length / sessions.length) * 100,
        )
      : null;

  const activeKeys = new Set<string>();
  for (const entry of [...moods, ...sessions]) {
    const date = new Date(entry.at);
    if (!Number.isNaN(date.getTime())) activeKeys.add(dayKey(date));
  }

  let streak = 0;
  const cursor = new Date(now);
  while (activeKeys.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sortedChecks = [...data.checks].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  return {
    averageMood: mean(moods.map((m) => m.score)),
    latestMood,
    moodTrend,
    completionRate,
    activeDays: activeKeys.size,
    streak,
    totalSessions: sessions.length,
    totalMinutes: Math.round(
      sessions.reduce((sum, s) => sum + s.seconds, 0) / 60,
    ),
    latestCheck: sortedChecks[0] ?? null,
  };
}

/** Last `days` days oldest-first, for charting. Days with no data are null. */
export function moodSeries(
  data: WellnessData,
  days = 7,
  now: Date = new Date(),
): { key: string; label: string; score: number | null }[] {
  const buckets: { key: string; label: string; score: number | null }[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - offset);
    const key = dayKey(date);
    const scores = data.moods
      .filter((m) => {
        const at = new Date(m.at);
        return !Number.isNaN(at.getTime()) && dayKey(at) === key;
      })
      .map((m) => m.score);
    const average = mean(scores);
    buckets.push({
      key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      score: average === null ? null : Math.round(average * 10) / 10,
    });
  }

  return buckets;
}

/* ------------------------------------------------------------------- hook */

export function useWellness() {
  const [data, setData] = useState<WellnessData>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(read());
    setReady(true);
  }, []);

  // Keep two open tabs from overwriting each other's view of the world.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setData(read());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: WellnessData) => {
    setData(next);
    write(next);
  }, []);

  const addMood = useCallback(
    (score: number, note = "") => {
      const entry: MoodEntry = {
        id: makeId(),
        score: Math.min(10, Math.max(1, Math.round(score))),
        note: note.trim(),
        at: new Date().toISOString(),
      };
      commit({ ...read(), moods: [...read().moods, entry] });
      return entry;
    },
    [commit],
  );

  const addSession = useCallback(
    (session: Omit<ExerciseSession, "id" | "at">) => {
      const entry: ExerciseSession = {
        ...session,
        id: makeId(),
        at: new Date().toISOString(),
      };
      commit({ ...read(), sessions: [...read().sessions, entry] });
      return entry;
    },
    [commit],
  );

  const addCheck = useCallback(
    (answers: Record<string, number>) => {
      const values = Object.values(answers);
      const average = mean(values) ?? 0;
      const entry: WellnessCheck = {
        id: makeId(),
        answers,
        // 1-5 per answer mapped onto 0-100.
        score: Math.round(((average - 1) / 4) * 100),
        at: new Date().toISOString(),
      };
      commit({ ...read(), checks: [...read().checks, entry] });
      return entry;
    },
    [commit],
  );

  const reset = useCallback(() => {
    commit({ ...EMPTY });
  }, [commit]);

  const stats = useMemo(() => computeStats(data), [data]);

  return { data, ready, stats, addMood, addSession, addCheck, reset };
}
