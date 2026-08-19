"use client";

/**
 * Signed-in wellness dashboard.
 *
 * WHAT IS AND IS NOT REAL HERE
 * ----------------------------
 * Every number on this page is derived from what the user actually did, held
 * in localStorage (lib/wellness-store.ts). There is no invented history: an
 * account with no entries shows empty states, not a demo chart. The previous
 * version of this file rendered hardcoded figures, which is worse than showing
 * nothing -- someone reading "your mood improved 15% this week" from a
 * constant has been told something false about their own life.
 *
 * ON STREAKS
 * ----------
 * The streak counter never scolds. There is no "you broke your streak", no
 * red state, no comparison to a previous best. Streak mechanics borrowed from
 * habit apps turn into guilt very quickly, and guilt is the opposite of what
 * someone tracking their mood after a bad fortnight needs. It counts up when
 * there is something to count and stays quiet otherwise.
 *
 * ON LOW SCORES
 * -------------
 * A sustained low mood surfaces crisis resources, gently and without alarm.
 * This mirrors the consent modal and matches how the backend's safety layer
 * treats the same signal.
 */

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Flame,
  HeartPulse,
  Info,
  MessageSquare,
  Smile,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wind,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Slider } from "@workspace/ui/components/slider";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

import { useSession } from "@/lib/contexts/session-context";
import { moodSeries, useWellness } from "@/lib/wellness-store";

/* ------------------------------------------------------------ wellness check */

type CheckQuestion = { id: string; prompt: string };

// Deliberately plain language, and deliberately only five questions. This is a
// self-reflection prompt, not a screening instrument -- it is not PHQ-9 or
// GAD-7 and must not be presented as though it were.
const CHECK_QUESTIONS: CheckQuestion[] = [
  { id: "sleep", prompt: "I've been sleeping reasonably well" },
  { id: "energy", prompt: "I've had enough energy for the day" },
  { id: "connection", prompt: "I've felt connected to people around me" },
  { id: "coping", prompt: "I've been able to handle what came up" },
  { id: "enjoyment", prompt: "I've enjoyed something this week" },
];

const SCALE_LABELS = ["Not at all", "Rarely", "Sometimes", "Often", "Mostly"];

function moodFace(score: number) {
  if (score >= 8) return { label: "Good", tone: "text-emerald-500" };
  if (score >= 6) return { label: "Okay", tone: "text-teal-500" };
  if (score >= 4) return { label: "Mixed", tone: "text-amber-500" };
  if (score >= 2) return { label: "Low", tone: "text-orange-500" };
  return { label: "Very low", tone: "text-rose-500" };
}

/* ---------------------------------------------------------------- stat card */

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <Icon className={cn("h-4 w-4", accent ?? "text-primary")} />
        </div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------- page */

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useSession();
  const router = useRouter();
  const { data, ready, stats, addMood, addCheck } = useWellness();

  const [moodOpen, setMoodOpen] = useState(false);
  const [moodValue, setMoodValue] = useState<number[]>([6]);
  const [moodNote, setMoodNote] = useState("");

  const [checkOpen, setCheckOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Computed only after the store has hydrated. moodSeries derives weekday
  // labels from the current date, and the server (UTC on Vercel) and the
  // browser can disagree about what day it is -- rendering it during SSR
  // produces a hydration mismatch for anyone not on UTC.
  const series = useMemo(() => (ready ? moodSeries(data, 7) : []), [data, ready]);
  const currentMood = moodValue[0] ?? 6;

  const saveMood = useCallback(() => {
    addMood(currentMood, moodNote);
    setMoodNote("");
    setMoodOpen(false);
  }, [addMood, currentMood, moodNote]);

  const saveCheck = useCallback(() => {
    addCheck(answers);
    setAnswers({});
    setCheckOpen(false);
  }, [addCheck, answers]);

  /* ------------------------------------------------------- auth states */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted-foreground">
          You need to sign in to view this page.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/games">Use the calming exercises instead</Link>
          </Button>
        </div>
      </div>
    );
  }

  const latest = stats.latestMood;
  const showSupport =
    latest !== null &&
    latest.score <= 3 &&
    stats.averageMood !== null &&
    stats.averageMood <= 4;

  const answeredAll = CHECK_QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <Container className="space-y-6 pt-24 pb-16">
        {/* -------------------------------------------------------- header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.name || user.email}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here&apos;s what you&apos;ve logged recently.
            </p>
          </div>
          <Button variant="outline" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>

        {/* ------------------------------------------------- quick actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            onClick={() => router.push("/therapy/new")}
            size="lg"
            className="h-12 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Start a conversation
            </span>
          </Button>
          <Button
            onClick={() => setMoodOpen(true)}
            variant="outline"
            size="lg"
            className="h-12 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <Smile className="h-4 w-4" /> Log mood
            </span>
          </Button>
          <Button
            onClick={() => setCheckOpen(true)}
            variant="outline"
            size="lg"
            className="h-12 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" /> Wellness check
            </span>
          </Button>
        </div>

        {/* -------------------------------------------------------- support */}
        {showSupport && (
          <Card className="border-amber-500/25 bg-amber-500/5">
            <CardContent className="p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your last few entries have been low. That&apos;s worth saying
                out loud to someone — the support line on{" "}
                <strong className="text-foreground">16328</strong> is free, 24/7
                and confidential, and{" "}
                <strong className="text-foreground">123</strong> reaches an
                ambulance if you&apos;re in danger right now.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ---------------------------------------------------------- stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={HeartPulse}
            label="Mood score"
            value={
              !ready
                ? "—"
                : stats.averageMood === null
                  ? "—"
                  : `${stats.averageMood.toFixed(1)}/10`
            }
            hint={
              stats.averageMood === null
                ? "No entries this week"
                : "7-day average"
            }
          />
          <StatCard
            icon={
              stats.moodTrend !== null && stats.moodTrend < 0
                ? TrendingDown
                : TrendingUp
            }
            label="Trend"
            value={
              !ready || stats.moodTrend === null
                ? "—"
                : `${stats.moodTrend > 0 ? "+" : ""}${stats.moodTrend.toFixed(1)}`
            }
            hint={
              stats.moodTrend === null
                ? "Needs a few more entries"
                : "Recent half vs earlier half"
            }
            accent={
              stats.moodTrend !== null && stats.moodTrend < 0
                ? "text-amber-500"
                : "text-emerald-500"
            }
          />
          <StatCard
            icon={CheckCircle2}
            label="Completion"
            value={
              !ready || stats.completionRate === null
                ? "—"
                : `${stats.completionRate}%`
            }
            hint={
              stats.completionRate === null
                ? "No exercises yet"
                : `${stats.totalSessions} started this week`
            }
          />
          <StatCard
            icon={Flame}
            label="Active days"
            value={!ready ? "—" : `${stats.activeDays}`}
            hint={stats.streak > 1 ? `${stats.streak} in a row` : "Last 7 days"}
            accent="text-orange-500"
          />
        </div>

        {/* ----------------------------------------------------- mood chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Mood over the last week</CardTitle>
            <CardDescription>
              One bar per day. Empty means nothing logged, not a zero.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-44 items-end justify-between gap-2">
              {!ready && (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm text-muted-foreground">Loading…</span>
                </div>
              )}
              {series.map((day) => {
                const height =
                  day.score === null ? 0 : Math.max(6, (day.score / 10) * 100);
                return (
                  <div
                    key={day.key}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex h-32 w-full items-end">
                      {day.score === null ? (
                        <div className="h-1.5 w-full rounded-full bg-border/60" />
                      ) : (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5 }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary"
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {day.label}
                    </span>
                    <span className="text-xs font-medium tabular-nums">
                      {day.score === null ? "–" : day.score}
                    </span>
                  </div>
                );
              })}
            </div>

            {ready && data.moods.length === 0 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Nothing logged yet. Your first entry will show up here.
              </p>
            )}
          </CardContent>
        </Card>

        {/* -------------------------------------------- latest check + games */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Wellness check</CardTitle>
              <CardDescription>
                Five questions about your week. A prompt to reflect, not a
                clinical screening.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.latestCheck ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {stats.latestCheck.score}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last taken{" "}
                    {new Date(stats.latestCheck.at).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t taken one yet.
                </p>
              )}
              <Button
                variant="outline"
                onClick={() => setCheckOpen(true)}
                className="w-full rounded-xl"
              >
                {stats.latestCheck ? "Take it again" : "Take the check"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Calming exercises</CardTitle>
              <CardDescription>
                {stats.totalMinutes > 0
                  ? `${stats.totalMinutes} minute${stats.totalMinutes === 1 ? "" : "s"} this week.`
                  : "Breathing patterns and ocean waves, whenever you want them."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                  <Wind className="h-3 w-3" /> Breathing
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3" /> Ocean waves
                </span>
              </div>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/games">
                  <span className="flex items-center gap-2">
                    Open exercises <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* -------------------------------------------------- storage notice */}
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Everything on this page is stored in this browser only. It
            won&apos;t follow you to another device, and clearing your browser
            data will erase it. Your conversations are handled separately — see
            the{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-foreground"
            >
              privacy page
            </Link>
            .
          </span>
        </p>
      </Container>

      {/* ------------------------------------------------------- mood dialog */}
      <Dialog open={moodOpen} onOpenChange={setMoodOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How are you doing?</DialogTitle>
            <DialogDescription>
              There&apos;s no right answer and nothing to optimise.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="text-center">
              <p className="text-5xl font-bold tabular-nums text-primary">
                {currentMood}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  moodFace(currentMood).tone,
                )}
              >
                {moodFace(currentMood).label}
              </p>
            </div>

            <Slider
              value={moodValue}
              onValueChange={setMoodValue}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very low</span>
              <span>Good</span>
            </div>

            <Input
              value={moodNote}
              onChange={(event) => setMoodNote(event.target.value)}
              placeholder="Anything you want to note (optional)"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button onClick={saveMood} className="flex-1">
              Save entry
            </Button>
            <Button
              variant="outline"
              onClick={() => setMoodOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------ check dialog */}
      <Dialog open={checkOpen} onOpenChange={setCheckOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Wellness check</DialogTitle>
            <DialogDescription>
              Thinking about the past week. This is for your own reflection —
              it isn&apos;t a diagnostic test and no one else sees it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {CHECK_QUESTIONS.map((question) => (
              <div key={question.id} className="space-y-2">
                <p className="text-sm font-medium">{question.prompt}</p>
                <div className="flex gap-1.5">
                  {SCALE_LABELS.map((label, index) => {
                    const value = index + 1;
                    const selected = answers[question.id] === value;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: value,
                          }))
                        }
                        className={cn(
                          "flex-1 rounded-lg border px-1 py-2 text-[11px] leading-tight transition-colors",
                          selected
                            ? "border-primary/50 bg-primary/10 text-foreground"
                            : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              onClick={saveCheck}
              disabled={!answeredAll}
              className="flex-1"
            >
              {answeredAll ? "Save check" : "Answer all five"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCheckOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
