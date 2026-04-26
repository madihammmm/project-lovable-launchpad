import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import type { PerfumeCategory } from "@/lib/localPerfumes";
import { categories, createPerfume, validatePerfume } from "@/lib/localPerfumes";

export const Route = createFileRoute("/add-perfume")({
  head: () => ({
    meta: [
      { title: "Add Perfume — DreamScents" },
      { name: "description", content: "Add a new perfume to the DreamScents backend API." },
      { property: "og:title", content: "Add Perfume — DreamScents" },
      { property: "og:description", content: "Create perfume products through a connected POST API form." },
    ],
  }),
  component: AddPerfumePage,
});

const initialForm = { name: "", brand: "", price: "", category: "Floral" as PerfumeCategory, description: "", image: "" };

function AddPerfumePage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);
    try {
      const payload = { ...form, price: Number(form.price) };
      const error = validatePerfume(payload);
      if (error) throw new Error(error);
      createPerfume(payload);
      setNotice({ type: "success", text: "Perfume added successfully. It is now available in the shop." });
      setForm(initialForm);
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Create product</p>
          <h1 className="mt-2 font-serif text-5xl font-bold">Add a new perfume</h1>
          <p className="mt-4 leading-7 text-muted-foreground">This form submits to the backend POST API and stores the product in the current data store.</p>
          <div className="mt-8 rounded-2xl border border-border/70 bg-card/55 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
            <p className="font-serif text-2xl font-bold">Required fields</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✧ Name and brand</li>
              <li>✧ Positive price</li>
              <li>✧ Category, description, and optional image URL</li>
            </ul>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-[var(--shadow-elegant)] backdrop-blur-xl md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name"><input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" /></Field>
            <Field label="Brand"><input required maxLength={120} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="form-input" /></Field>
            <Field label="Price"><input required min="1" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="form-input" /></Field>
            <Field label="Category"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as PerfumeCategory })} className="form-input">{categories.map((cat) => <option key={cat}>{cat}</option>)}</select></Field>
            <Field label="Image URL"><input maxLength={1000} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="form-input" /></Field>
            <Field label="Description" className="md:col-span-2"><textarea required maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input min-h-32" /></Field>
          </div>
          {notice && <p className={`mt-5 rounded-2xl border p-4 text-sm ${notice.type === "success" ? "border-primary/25 text-primary" : "border-destructive/30 text-destructive"}`}>{notice.text}</p>}
          <button disabled={submitting} className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 disabled:opacity-60">
            {submitting ? "Adding perfume..." : "Add perfume"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`grid gap-2 text-sm font-semibold ${className}`}><span>{label}</span>{children}</label>;
}
