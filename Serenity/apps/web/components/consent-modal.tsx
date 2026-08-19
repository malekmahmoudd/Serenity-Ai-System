"use client";

import { useEffect, useState } from "react";

/**
 * Consent gate, shown before the first message of a conversation.
 *
 * WHY THIS BLOCKS RATHER THAN INFORMS
 * -----------------------------------
 * People type mental-health information here. It is stored (encrypted, 90
 * days) and sent to a third-party AI provider. They need to know that BEFORE
 * the first message, not from a footer link afterwards. "Not now" therefore
 * returns them to the home page -- consent that cannot be withheld is not
 * consent.
 *
 * WHY THIS STILL SAYS "NEVER A DIAGNOSIS"
 * ---------------------------------------
 * The explicit accuracy figure that used to sit on this screen was removed
 * by product decision. The scope clause below is what remains of that
 * disclosure, and it is load-bearing: the classifier can surface labels as
 * consequential as "suicidal" or "schizophrenia" from a few sentences of
 * writing, and it suggests categories rather than establishing findings. A
 * user who reads a suggestion as a clinical result is the failure mode this
 * sentence exists to prevent -- do not drop it as well.
 *
 * STORAGE KEY
 * -----------
 * Acceptance is remembered per browser, not per account, so a shared device
 * does not silently consent on someone else's behalf. Bump CONSENT_VERSION
 * whenever the terms change materially -- that re-prompts everyone, which is
 * the point.
 */

const CONSENT_VERSION = "2026-08-v1";
const STORAGE_KEY = `serenity-consent-${CONSENT_VERSION}`;

export function hasConsented(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "accepted";
}

export default function ConsentModal({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsented()) setVisible(true);
    else onAccept();
  }, [onAccept]);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    localStorage.setItem(`${STORAGE_KEY}-at`, new Date().toISOString());
    setVisible(false);
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-2xl sm:p-8">
        <h2 className="mb-5 text-xl font-semibold text-white">
          Before we start
        </h2>

        <p className="mb-6 text-sm leading-relaxed">
          Serenity is a supportive space to think through how you&apos;re
          feeling. It is{" "}
          <strong className="text-white">
            not a therapist, not a doctor, and not a crisis service.
          </strong>
        </p>

        <section className="mb-5">
          <h3 className="mb-1.5 text-sm font-semibold text-white">
            What happens to what you write
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Your messages are stored, encrypted, for 90 days, then deleted.
            They&apos;re sent to Groq, an AI provider, to generate replies. If
            you have an account, they&apos;re linked to it; if not, they&apos;re
            anonymous.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="mb-1.5 text-sm font-semibold text-white">
            What this can and can&apos;t do
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Serenity uses a small AI model to spot patterns in what you
            describe. Anything it mentions is a starting point for a
            conversation with someone qualified — never a diagnosis.
          </p>
        </section>

        <section className="mb-6 rounded-lg border border-red-900/60 bg-red-950/30 p-4">
          <h3 className="mb-1.5 text-sm font-semibold text-red-300">
            If you&apos;re in danger right now
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Call <strong className="text-white">123</strong> for an ambulance,
            or talk to someone on the mental health support line{" "}
            <strong className="text-white">16328</strong> — free, 24/7, and
            confidential. Serenity can&apos;t call anyone for you and nobody is
            monitoring these conversations.
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            onClick={accept}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            I understand — continue
          </button>
          <button
            onClick={onDecline}
            className="flex-1 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
