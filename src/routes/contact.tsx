import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FlowBoard" },
      { name: "description", content: "Get in touch with the FlowBoard team." },
      { property: "og:title", content: "Contact — FlowBoard" },
      { property: "og:description", content: "Send a message to the FlowBoard team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.includes("@") || form.message.trim().length < 5) {
      setError("Please fill all fields with a valid email and message (5+ chars).");
      return;
    }
    // Persist as a task with the message — exercises POST /api/tasks
    const r = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Contact from ${form.name}`,
        description: `${form.email}\n\n${form.message}`,
        status: "todo",
        priority: "medium",
      }),
    });
    if (r.ok) {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question? Send us a note — it'll land on the team's board.
        </p>

        {sent ? (
          <div
            className="mt-8 rounded-2xl border border-border bg-card p-8 text-center"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <h2 className="text-xl font-semibold">Thanks! 🎉</h2>
            <p className="mt-2 text-muted-foreground">
              Your message was added to the board. We'll be in touch.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Send another
            </button>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <input
              placeholder="Your name"
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="email"
              placeholder="you@example.com"
              maxLength={200}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Your message"
              maxLength={2000}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-hero)" }}
            >
              Send message
            </button>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}
