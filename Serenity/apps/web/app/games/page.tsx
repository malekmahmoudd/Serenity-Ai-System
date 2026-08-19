"use client";

/**
 * Public calming-exercise hub.
 *
 * WHY THIS IS NOT BEHIND SIGN-IN
 * ------------------------------
 * The same reasoning that lets /chat accept anonymous users: someone reaching
 * for a breathing exercise at 2am should not first meet an account form. The
 * exercises work fully signed-out. Sessions are still recorded to local
 * storage so the dashboard has something to show if they do sign in later --
 * see lib/wellness-store.ts for the (real, limited) scope of that.
 */

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Waves, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/container";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";

import BreathingGame from "@/components/games/breathing-game";
import OceanWaves from "@/components/games/ocean-waves";
import { useWellness } from "@/lib/wellness-store";

type GameId = "breathing" | "ocean";

type GameDef = {
  id: GameId;
  name: string;
  tagline: string;
  description: string;
  minutes: string;
  icon: LucideIcon;
  accent: string;
};

const GAMES: GameDef[] = [
  {
    id: "breathing",
    name: "Breathing patterns",
    tagline: "Follow a steady count",
    description:
      "A visual pacer for your breath, with three patterns to choose from. Useful when your breathing has gone shallow and you want something concrete to follow.",
    minutes: "2–5 min",
    icon: Wind,
    accent: "from-sky-500/20",
  },
  {
    id: "ocean",
    name: "Ocean waves",
    tagline: "No counting involved",
    description:
      "Match your breath to a slow swell rolling in and back out. The same idea as the pacer, without numbers on screen — better if counting makes you tense.",
    minutes: "2–6 min",
    icon: Waves,
    accent: "from-cyan-500/20",
  },
];

export default function GamesPage() {
  const [active, setActive] = useState<GameDef | null>(null);
  const { addSession } = useWellness();

  const handleFinish = useCallback(
    (game: GameDef, result: { seconds: number; completed: boolean }) => {
      // Ignore accidental opens -- a two-second glance isn't a session.
      if (result.seconds < 10) return;
      addSession({
        kind: game.id,
        label: game.name,
        seconds: result.seconds,
        completed: result.completed,
      });
    },
    [addSession],
  );

  return (
    <div className="min-h-screen w-full pt-24 pb-20">
      <Container>
        {/* ----------------------------------------------------------- hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Wind className="h-4 w-4 text-primary" />
            <span className="text-foreground/90">Calming exercises</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              Something to do with your hands
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            When talking feels like too much, these give you something simpler
            to follow. No account, no timer you have to beat, and you can close
            the tab mid-breath.
          </p>
        </div>

        {/* ---------------------------------------------------------- games */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {GAMES.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div
                    className={`absolute inset-0 -z-10 bg-gradient-to-br ${game.accent} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <div className="flex items-start justify-between">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {game.minutes}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold tracking-tight">
                        {game.name}
                      </h2>
                      <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
                        {game.tagline}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {game.description}
                      </p>
                    </div>

                    <Button
                      onClick={() => setActive(game)}
                      className="mt-auto w-full rounded-full"
                    >
                      <span className="flex items-center gap-2">
                        Start
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ------------------------------------------------------- footnote */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          Sessions are saved in this browser only, so your{" "}
          <Link
            href="/dashboard"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            dashboard
          </Link>{" "}
          can show them back to you. Nothing is sent anywhere.
        </p>

        {/* ------------------------------------------------------ crisis note */}
        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            These are for taking the edge off, not for emergencies. If you are
            in danger right now, call{" "}
            <strong className="text-foreground">123</strong> for an ambulance,
            or the mental health support line on{" "}
            <strong className="text-foreground">16328</strong> — free, 24/7 and
            confidential.
          </p>
        </div>
      </Container>

      {/* ----------------------------------------------------------- player */}
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{active?.name}</DialogTitle>
            <DialogDescription>{active?.tagline}</DialogDescription>
          </DialogHeader>

          {active?.id === "breathing" && (
            <BreathingGame
              onFinish={(result) => handleFinish(active, result)}
            />
          )}
          {active?.id === "ocean" && (
            <OceanWaves onFinish={(result) => handleFinish(active, result)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
