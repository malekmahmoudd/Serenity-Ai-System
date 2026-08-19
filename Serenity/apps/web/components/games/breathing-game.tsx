"use client";

/**
 * Guided breathing pacer.
 *
 * DESIGN CONSTRAINTS THAT ARE NOT ARBITRARY
 * -----------------------------------------
 * 1. No failure state, no score, no "you missed a breath". Someone opens this
 *    while anxious; the last thing that helps is a second thing to be bad at.
 * 2. Leaving early is recorded as an incomplete session, not a lost one, and
 *    nothing in the UI frames it as a lapse.
 * 3. prefers-reduced-motion is honoured -- the circle still resizes because
 *    that IS the instruction, but the ambient pulsing and drifting stop.
 * 4. Exhale is never shorter than inhale in any offered pattern. Extended
 *    exhale is the part with an actual physiological basis for calming.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, Wind } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

type Phase = {
  key: "inhale" | "hold" | "exhale" | "rest";
  label: string;
  seconds: number;
};

type Pattern = {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
};

const PATTERNS: Pattern[] = [
  {
    id: "calm",
    name: "Calm",
    description: "4 in, 6 out. A gentle place to start.",
    phases: [
      { key: "inhale", label: "Breathe in", seconds: 4 },
      { key: "exhale", label: "Breathe out", seconds: 6 },
    ],
  },
  {
    id: "box",
    name: "Box",
    description: "Equal counts of four. Steadying when your mind is racing.",
    phases: [
      { key: "inhale", label: "Breathe in", seconds: 4 },
      { key: "hold", label: "Hold", seconds: 4 },
      { key: "exhale", label: "Breathe out", seconds: 4 },
      { key: "rest", label: "Rest", seconds: 4 },
    ],
  },
  {
    id: "unwind",
    name: "Unwind",
    description: "4 in, 7 hold, 8 out. Longer, for winding down.",
    phases: [
      { key: "inhale", label: "Breathe in", seconds: 4 },
      { key: "hold", label: "Hold", seconds: 7 },
      { key: "exhale", label: "Breathe out", seconds: 8 },
    ],
  },
];

const DEFAULT_PATTERN: Pattern = PATTERNS[0]!;
const TARGET_CYCLES = 6;

/** Circle scale per phase. Inhale expands, exhale contracts, holds sit still. */
function scaleFor(phaseKey: Phase["key"]): number {
  switch (phaseKey) {
    case "inhale":
      return 1;
    case "hold":
      return 1;
    case "exhale":
      return 0.55;
    default:
      return 0.55;
  }
}

export default function BreathingGame({
  onFinish,
}: {
  onFinish?: (result: { seconds: number; completed: boolean }) => void;
}) {
  const reduceMotion = useReducedMotion();

  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState<number>(
    DEFAULT_PATTERN.phases[0]?.seconds ?? 4,
  );
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const phase = pattern.phases[phaseIndex] ?? pattern.phases[0]!;

  // Report on unmount without making onFinish a tick dependency.
  const elapsedRef = useRef(0);
  const cyclesRef = useRef(0);
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useEffect(() => {
    cyclesRef.current = cycles;
  }, [cycles]);

  useEffect(() => {
    return () => {
      const seconds = elapsedRef.current;
      if (seconds > 0) {
        finishRef.current?.({
          seconds,
          completed: cyclesRef.current >= TARGET_CYCLES,
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
      setRemaining((value) => {
        if (value > 1) return value - 1;

        setPhaseIndex((index) => {
          const next = (index + 1) % pattern.phases.length;
          if (next === 0) setCycles((count) => count + 1);
          return next;
        });

        return 0; // replaced by the phase effect below
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, pattern]);

  // Whenever the phase changes, reset its countdown from the pattern.
  useEffect(() => {
    setRemaining(pattern.phases[phaseIndex]?.seconds ?? 4);
  }, [phaseIndex, pattern]);

  const reset = useCallback(() => {
    setRunning(false);
    setPhaseIndex(0);
    setCycles(0);
    setElapsed(0);
    setRemaining(pattern.phases[0]?.seconds ?? 4);
  }, [pattern]);

  const choosePattern = useCallback((next: Pattern) => {
    setPattern(next);
    setRunning(false);
    setPhaseIndex(0);
    setCycles(0);
    setElapsed(0);
    setRemaining(next.phases[0]?.seconds ?? 4);
  }, []);

  const progress = Math.min(100, (cycles / TARGET_CYCLES) * 100);
  const phaseDuration = phase.seconds;

  const circleTransition = useMemo(
    () =>
      reduceMotion
        ? { duration: 0.2 }
        : { duration: phaseDuration, ease: "easeInOut" as const },
    [reduceMotion, phaseDuration],
  );

  return (
    <div className="flex flex-col items-center gap-8 py-2">
      {/* -------------------------------------------------- pattern picker */}
      <div className="flex w-full flex-wrap justify-center gap-2">
        {PATTERNS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => choosePattern(option)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              option.id === pattern.id
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {option.name}
          </button>
        ))}
      </div>

      <p className="-mt-4 max-w-sm text-center text-xs text-muted-foreground">
        {pattern.description}
      </p>

      {/* ---------------------------------------------------------- circle */}
      <div className="relative flex h-64 w-64 items-center justify-center">
        {!reduceMotion && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/5"
            animate={{ scale: running ? [1, 1.08, 1] : 1 }}
            transition={{
              duration: 6,
              repeat: running ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        )}

        <motion.div
          className="absolute h-56 w-56 rounded-full border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 backdrop-blur-sm"
          animate={{ scale: running ? scaleFor(phase.key) : 0.75 }}
          transition={circleTransition}
        />

        <div className="relative z-10 text-center">
          <p className="text-lg font-medium tracking-tight">{phase.label}</p>
          <p className="mt-1 text-5xl font-bold tabular-nums text-primary">
            {remaining}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {cycles} of {TARGET_CYCLES} breaths
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------- progress */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {cycles >= TARGET_CYCLES && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            That&apos;s the set. Stay for as long as it&apos;s useful.
          </p>
        )}
      </div>

      {/* --------------------------------------------------------- controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setRunning((value) => !value)}
          size="lg"
          className="h-11 rounded-full px-6"
        >
          {running ? (
            <span className="flex items-center gap-2">
              <Pause className="h-4 w-4" /> Pause
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" /> {elapsed > 0 ? "Resume" : "Begin"}
            </span>
          )}
        </Button>

        <Button
          onClick={reset}
          variant="outline"
          size="lg"
          className="h-11 rounded-full px-5"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </span>
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Wind className="h-3.5 w-3.5" />
        Stop whenever you like — nothing here needs finishing.
      </p>
    </div>
  );
}
