/**
 * Privacy notice.
 *
 * Written to match what the code actually does, not what sounds reassuring.
 * Every claim here is checkable against the backend:
 *   - 90 days              -> db.RETENTION_DAYS, swept at startup
 *   - encrypted at rest    -> crypto.py, Fernet, message text and replies only
 *   - email in the clear   -> db.User.email, needed as a login identifier
 *   - sent to Groq         -> llm.py
 *   - "we can read them"   -> the app holds the key, so this is true
 *
 * If you change the retention window or the provider, change this page in the
 * same commit. A privacy notice that has drifted from the code is worse than
 * none, because people relied on it.
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-semibold">Privacy</h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Plain language, and accurate. Last updated August 2026.
      </p>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">What we store</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The messages you send and the replies you receive, encrypted. Also the
          non-personal parts of each exchange — which category the model
          suggested, how confident it was, how long your message was — which we
          use to tell whether the system is working properly. If you have an
          account, we store your email address and a scrambled version of your
          password that cannot be turned back into your password.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">How long</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Conversations are deleted 90 days after you last add to them. You can
          delete one immediately from within the chat at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Who else sees it</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your messages are sent to{" "}
          <a
            href="https://groq.com/privacy-policy"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Groq
          </a>
          , the AI provider that generates the replies. Nobody else receives
          them. We do not sell data and there is no advertising here.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">
          What encryption does and doesn&apos;t do
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your messages are encrypted in our database, so a stolen copy of it
          would be unreadable. But the application needs the key in order to
          work, which means{" "}
          <strong className="text-foreground">
            we are technically able to read your conversations
          </strong>
          . We are telling you this rather than implying otherwise. Nobody reads
          them as a matter of routine, and nobody is monitoring them in real
          time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">
          Using it without an account
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You can talk to Serenity without signing up. Those conversations
          aren&apos;t linked to you, and they also can&apos;t be recovered later
          — that&apos;s the trade.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">What Serenity is not</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          It is not a therapist, a doctor, or a crisis service, and it cannot
          contact anyone on your behalf. The model that reads your messages is
          small and gets things wrong often — roughly half the time on the kind
          of conversational writing people actually use. Anything it suggests is
          a starting point for a conversation with a qualified person, never a
          diagnosis.
        </p>
      </section>

      <section className="mb-8 rounded-lg border border-red-900/50 bg-red-950/20 p-5">
        <h2 className="mb-2 text-lg font-semibold">If you need help now</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ambulance: <strong className="text-foreground">123</strong>
          <br />
          Mental health support, free and 24/7:{" "}
          <strong className="text-foreground">16328</strong>
          <br />
          Befrienders Cairo:{" "}
          <strong className="text-foreground">762 1602</strong> or{" "}
          <strong className="text-foreground">762 2381</strong>
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Deleting your data</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use the reset option in a conversation to delete it immediately. To
          remove an account and everything attached to it, get in touch and we
          will do it.
        </p>
      </section>
    </div>
  );
}
