import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Clock,
  Fingerprint,
  Languages,
  LifeBuoy,
  Lock,
  MessageSquareHeart,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/container";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

/**
 * Every claim on this page is deliberately traceable to something the system
 * actually does -- see backend/classifier.py (ONNX label set), safety.py
 * (crisis rules), crypto.py (encryption at rest), config.py (RETENTION_DAYS)
 * and main.py (anonymous chat + rate limits). If a capability changes there,
 * change it here too rather than letting the marketing drift ahead of the
 * product.
 */

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
};

const CORE_FEATURES: Feature[] = [
  {
    icon: MessageSquareHeart,
    title: "A conversation, not a form",
    description:
      "Write in your own words, at whatever length feels right. There is no questionnaire to complete and no score at the end.",
    accent: "from-rose-500/20",
  },
  {
    icon: Brain,
    title: "Pattern recognition",
    description:
      "A small on-device classifier reads what you write and surfaces themes it recognises. These are prompts to reflect on, never diagnoses.",
    accent: "from-violet-500/20",
  },
  {
    icon: LifeBuoy,
    title: "Crisis-aware by design",
    description:
      "Language suggesting immediate danger is detected before anything else runs, and the response leads with real help lines rather than a generated reply.",
    accent: "from-red-500/20",
  },
  {
    icon: Clock,
    title: "Available whenever",
    description:
      "No appointments and no waiting rooms. Serenity is there at 3am on a Tuesday, which is often exactly when it is needed.",
    accent: "from-amber-500/20",
  },
  {
    icon: Fingerprint,
    title: "Use it without an account",
    description:
      "Anonymous conversations work fully. A signup wall in front of someone about to disclose something serious is the wrong trade-off.",
    accent: "from-emerald-500/20",
  },
  {
    icon: Languages,
    title: "Continuity across a session",
    description:
      "Serenity keeps track of the thread of a conversation, so you are not restating your situation from scratch with every message.",
    accent: "from-sky-500/20",
  },
];

const PRIVACY_POINTS: Feature[] = [
  {
    icon: Lock,
    title: "Encrypted at rest",
    description:
      "Stored conversations are encrypted with a managed key, not held as plain text in a database.",
    accent: "from-emerald-500/20",
  },
  {
    icon: Trash2,
    title: "Deleted after 90 days",
    description:
      "Conversations are removed on a rolling 90-day schedule. Retention is a setting with a real ceiling, not an indefinite default.",
    accent: "from-blue-500/20",
  },
  {
    icon: ShieldCheck,
    title: "No one is reading along",
    description:
      "Nobody monitors these conversations in real time. That is also why Serenity cannot contact anyone on your behalf.",
    accent: "from-indigo-500/20",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.accent} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <CardContent className="space-y-3 p-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold tracking-tight">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen w-full pt-24 pb-20">
      <Container>
        {/* ---------------------------------------------------------- hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
            <MessageSquareHeart className="h-4 w-4 text-primary" />
            <span className="text-foreground/90">What Serenity does</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              Built to listen
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Serenity is a space to think through how you are feeling, out loud,
            without booking anything or explaining yourself to a stranger first.
            Here is what it actually offers.
          </p>
        </div>

        {/* ------------------------------------------------------ features */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* ------------------------------------------------------- privacy */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              What happens to what you write
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              People type things here they have not said to anyone. The handling
              of that is a feature, not fine print.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PRIVACY_POINTS.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            Replies are generated by a third-party AI provider, which means your
            messages are sent to them to produce a response. The{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              privacy page
            </Link>{" "}
            sets out the detail.
          </p>
        </div>

        {/* --------------------------------------------------- limitations */}
        <div className="mt-24 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 md:p-10">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            What it is not
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Serenity is not a therapist, not a doctor, and not a crisis service,
            and it cannot contact anyone on your behalf. Anything it suggests is
            a starting point for a conversation with a qualified person, never a
            diagnosis. If you are in danger right now, call{" "}
            <strong className="text-foreground">123</strong> for an ambulance,
            or reach the mental health support line on{" "}
            <strong className="text-foreground">16328</strong> — free, 24/7 and
            confidential.
          </p>
        </div>

        {/* ------------------------------------------------------------ cta */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Start whenever you are ready
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            No account needed. You can close the tab at any point.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full bg-gradient-to-r from-primary via-primary/90 to-secondary px-8 shadow-lg shadow-primary/20 transition-all duration-500 hover:to-primary hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="/therapy/new">
                <span className="flex items-center gap-2 font-medium">
                  Start a conversation
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-8">
              <Link href="/about">About the project</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
