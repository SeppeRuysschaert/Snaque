"use client";

import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // honeypot (anti-spam): echte users laten dit leeg
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    message.trim().length >= 5;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          website, // honeypot
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Verzenden mislukt");
      }
      setDone(true);
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setError(err.message ?? "Er ging iets mis");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main className="isolate mx-auto max-w-3xl px-4 py-6 md:py-10 text-slate-100">
        <section className="relative overflow-hidden rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Bedankt!</h1>
            <p className="mt-2 text-slate-300">
              Je bericht is verzonden. We antwoorden zo snel mogelijk.
            </p>
            <button
              className="mt-5 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
              onClick={() => setDone(false)}
            >
              Nog een bericht sturen
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="isolate mx-auto max-w-3xl px-4 py-6 md:py-10 text-slate-100">
      <section className="relative overflow-hidden rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
        <div className="p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Contact</h1>
            <p className="mt-1 text-sm text-slate-400">Stuur ons een bericht — we antwoorden snel.</p>
            <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-sky-400/40 to-emerald-400/40" />
          </header>

          <form onSubmit={submit} className="space-y-4">
            {/* Honeypot: verstopte input, bots vullen dit vaak in */}
            <div className="hidden">
              <label>
                Laat dit veld leeg
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1" htmlFor="email">
                Jouw e-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#0f1418] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="jij@voorbeeld.be"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1" htmlFor="message">
                Bericht
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg bg-[#0f1418] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Waarmee kunnen we helpen?"
              />
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={!valid || sending}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold
                ${valid ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-amber-500/40 text-black/60"}
                ring-1 ring-amber-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
              >
                {sending ? "Versturen…" : "Versturen"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
