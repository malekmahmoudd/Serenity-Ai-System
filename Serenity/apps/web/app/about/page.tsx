import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/container";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

/**
 * ---------------------------------------------------------------------------
 * PLACEHOLDER COPY -- REPLACE BEFORE ANY PUBLIC LAUNCH
 * ---------------------------------------------------------------------------
 * The layout here is real and finished. The words are not: the mission text
 * and the origin story below are stand-ins written to show the shape of the
 * page, and they make no factual claims about why this was built. Search this
 * file for PLACEHOLDER to find every block that needs your real copy.
 *
 * There is deliberately no team or credits section. That was removed on
 * request -- if one is ever added back, it belongs here rather than bolted
 * onto the footer.
 *
 * Anything describing what the product DOES should stay consistent with
 * /features and /privacy -- those pages are written against the actual
 * backend behaviour, and this one should not drift ahead of them.
 */

type Principle = {
  icon: LucideIcon;
  title: string;
  description: string;
};

// PLACEHOLDER: these three principles are a reasonable starting frame, but
// rewrite them in your own voice -- they are the part of the page people
// actually read.
const PRINCIPLES: Principle[] = [
  {
    icon: HeartHandshake,
    title: "Low barrier to starting",
    description:
      "The hardest part of asking for help is the first sentence. No signup, no intake form, no waiting room — you can begin talking immediately and stop whenever you want.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about its limits",
    description:
      "Serenity says plainly what it is not. It does not present itself as a clinician, and it points toward qualified people rather than standing in for them.",
  },
  {
    icon: Compass,
    title: "Built to hand off",
    description:
      "Success is not someone using this forever. It is someone finding the words for what they are dealing with, and taking those words to a person who can help.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full pt-24 pb-20">
      <Container>
        {/* ---------------------------------------------------------- hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
            <HeartHandshake className="h-4 w-4 text-primary" />
            <span className="text-foreground/90">About the project</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              Why SerenityX exists
            </span>
          </h1>

          {/* PLACEHOLDER: one or two sentences on the problem you set out to
              address. This is the line people quote back to you. */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Most people who are struggling do not start by booking an
            appointment. They start by trying to put words to it, usually alone
            and usually at a bad hour. SerenityX is a place to do that part.
          </p>
        </div>

        {/* --------------------------------------------------------- story */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Where this came from
          </h2>

          {/* PLACEHOLDER: the origin story. What prompted this, what you tried
              first, what you learned. Two or three short paragraphs is plenty
              — resist the urge to write a manifesto. */}
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Replace this paragraph with how the project actually started —
              the moment, the frustration, or the gap you noticed that made
              building this feel worth the effort.
            </p>
            <p>
              Then use this one for what you learned along the way: what you
              built first, what did not work, and what changed your mind about
              the right shape for the product.
            </p>
            <p>
              Close with where things stand today and what you are working on
              next. Being straightforward about what is unfinished reads as
              more trustworthy than claiming everything is solved.
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------- principles */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              What guides the decisions
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Every product choice here comes back to these three.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => {
              const Icon = principle.icon;
              return (
                <Card
                  key={principle.title}
                  className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="space-y-3 p-6">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* --------------------------------------------------- limitations */}
        <div className="mt-24 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 md:p-10">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Being clear about what this is
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            SerenityX is not a therapist, not a doctor, and not a crisis
            service, and it cannot contact anyone on your behalf. Anything it
            suggests is a starting point for a conversation with a qualified
            person, never a diagnosis. If you are in danger right now, call{" "}
            <strong className="text-foreground">123</strong> for an ambulance,
            or reach the mental health support line on{" "}
            <strong className="text-foreground">16328</strong> — free, 24/7 and
            confidential.
          </p>
        </div>

        {/* ------------------------------------------------------------ cta */}
        <div className="mt-20 text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-8"
            >
              <Link href="/features">See what it does</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
