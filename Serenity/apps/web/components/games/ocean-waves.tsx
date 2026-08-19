"use client";

/**
 * Ocean waves breathing.
 *
 * Same underlying mechanic as the breathing pacer, deliberately different in
 * register: the wave rolling up the shore is the cue, so there are no counts
 * to follow and nothing on screen ticking down. For some people a numeric
 * countdown is itself activating, and this is the version to reach for then.
 *
 * The swell is rendered as two offset SVG paths animated on a slow loop. Under
 * prefers-reduced-motion the motion stops entirely and the cue becomes textual
 * -- an animated horizon is exactly the sort of thing that triggers nausea for
 * a vestibular-sensitive user.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, Waves } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

const IN_SECONDS = 4;
const OUT_SECONDS = 6;
const CYCLE = IN_SECONDS + OUT_SECONDS;
const TARGET_CYCLES = 6;

export default function OceanWaves({
  onFinish,
}: {
  onFinish?: (result: { seconds: number; completed: boolean }) => void;
}) {
  const reduceMotion = useReducedMotion();

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const elapsedRef = useRef(0);
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useEffect(() => {
    return () => {
      const seconds = elapsedRef.current;
      if (seconds > 0) {
        finishRef.current?.({
          seconds,
          completed: seconds >= CYCLE * TARGET_CYCLES,
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsed(0);
  }, []);

  const positionInCycle = elapsed % CYCLE;
  const breathingIn = positionInCycle < IN_SECONDS;
  const cycles = Math.floor(elapsed / CYCLE);

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      {/* ----------------------------------------------------------- scene */}
      <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-b from-sky-500/10 via-cyan-500/10 to-blue-600/20">
        {/* horizon glow */}
        <div className="absolute inset-x-0 top-8 mx-auto h-24 w-24 rounded-full bg-amber-200/20 blur-2xl" />

        {/* swell */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-32"
          animate={
            reduceMotion || !running
              ? { y: 0 }
              : { y: breathingIn ? -18 : 10 }
          }
          transition={{
            duration: breathingIn ? IN_SECONDS : OUT_SECONDS,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M0,40 C60,10 120,70 200,45 C280,20 340,75 400,45 L400,120 L0,120 Z"
              className="fill-cyan-400/30"
            />
            <path
              d="M0,60 C70,35 130,85 200,62 C270,40 330,88 400,62 L400,120 L0,120 Z"
              className="fill-blue-500/40"
            />
          </svg>
        </motion.div>

        {/* cue */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <motion.p
            key={breathingIn ? "in" : "out"}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-medium tracking-tight text-foreground/90"
          >
            {running
              ? breathingIn
                ? "Breathe in with the swell"
                : "Let it roll back out"
              : "Ready when you are"}
          </motion.p>
          {running && (
            <p className="mt-2 text-xs text-muted-foreground">
              {cycles} {cycles === 1 ? "wave" : "waves"}
            </p>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------- controls */}
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
          Reset
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-center text-xs text-muted-foreground">
        <Waves className="h-3.5 w-3.5" />
        No counting, no target. Follow the water for as long as it helps.
      </p>
    </div>
  );
}
