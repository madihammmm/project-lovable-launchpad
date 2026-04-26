import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { createContact } from "@/lib/localPerfumes";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DreamScents" },
      { name: "description", content: "Send DreamScents a message through a backend contact API." },
      { property: "og:title", content: "Contact — DreamScents" },
      { property: "og:description", content: "Contact the dreamy perfume boutique." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);
    try {
      const contact = createContact(form);
      if (!contact) throw new Error("Valid name, email, and message are required.");
      setNotice({ type: "success", text: "Your message floated into our inbox. Thank you!" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
          <h1 className="mt-2 font-serif text-5xl font-bold">Send a scented note</h1>
          <p className="mt-4 max-w-lg leading-7 text-muted-foreground">Questions about a perfume, order, or collaboration? The backend processes and stores every contact submission.</p>
          <div className="mt-8 rounded-2xl border border-border/70 bg-card/55 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
            <p className="font-serif text-2xl font-bold">DreamScents Atelier</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Pearl Avenue, Lavender District<br />hello@dreamscents.example</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-[var(--shadow-elegant)] backdrop-blur-xl md:p-8">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">Name<input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" /></label>
            <label className="grid gap-2 text-sm font-semibold">Email<input required type="email" maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" /></label>
            <label className="grid gap-2 text-sm font-semibold">Message<textarea required minLength={5} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="form-input min-h-36" /></label>
          </div>
          {notice && <p className={`mt-5 rounded-2xl border p-4 text-sm ${notice.type === "success" ? "border-primary/25 text-primary" : "border-destructive/30 text-destructive"}`}>{notice.text}</p>}
          <button disabled={submitting} className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 disabled:opacity-60">
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
