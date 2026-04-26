import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import type { Perfume, PerfumeCategory } from "@/lib/localPerfumes";
import { categories, deletePerfume, listPerfumes, updatePerfume, validatePerfume } from "@/lib/localPerfumes";

function imageToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

export const Route = createFileRoute("/manage")({
  head: () => ({
    meta: [
      { title: "Manage Perfumes — DreamScents" },
      { name: "description", content: "Edit and delete DreamScents perfumes through PUT and DELETE APIs." },
      { property: "og:title", content: "Manage Perfumes — DreamScents" },
      { property: "og:description", content: "Full CRUD perfume management dashboard." },
    ],
  }),
  component: ManagePage,
});

function ManagePage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Perfume>>({});
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setPerfumes(listPerfumes());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(id: string) {
    const error = validatePerfume(editForm as Perfume);
    if (error) setNotice(error);
    else {
      updatePerfume(id, editForm);
      setNotice("Perfume updated successfully.");
    }
    setEditingId(null);
    setEditForm({});
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this perfume?")) return;
    deletePerfume(id);
    setNotice("Perfume deleted.");
    load();
  }

  async function uploadEditImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setNotice("Please upload an image file.");
    if (file.size > 2_000_000) return setNotice("Image must be under 2MB for localStorage.");
    const image = await imageToDataUrl(file);
    setEditForm((form) => ({ ...form, image }));
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin management</p>
        <h1 className="mt-2 font-serif text-5xl font-bold">Manage perfumes</h1>
        <p className="mt-3 text-muted-foreground">Edit details with PUT requests or delete products with DELETE requests.</p>
        {notice && <p className="mt-6 rounded-2xl border border-primary/25 bg-card/60 p-4 text-sm text-primary backdrop-blur">{notice}</p>}

        <div className="mt-8 grid gap-4">
          {loading ? <p className="text-muted-foreground">Loading perfumes...</p> : perfumes.map((perfume) => {
            const editing = editingId === perfume.id;
            return (
              <article key={perfume.id} className="rounded-2xl border border-border/70 bg-card/60 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                {editing ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <input defaultValue={perfume.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="form-input" />
                    <input defaultValue={perfume.brand} onChange={(e) => setEditForm((f) => ({ ...f, brand: e.target.value }))} className="form-input" />
                    <input type="number" defaultValue={perfume.price} onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))} className="form-input" />
                    <select defaultValue={perfume.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value as PerfumeCategory }))} className="form-input">{categories.map((cat) => <option key={cat}>{cat}</option>)}</select>
                    <input type="file" accept="image/*" onChange={uploadEditImage} className="form-input file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground md:col-span-2" />
                    {(editForm.image || perfume.image) && <img src={String(editForm.image || perfume.image)} alt={`${perfume.name} preview`} width={320} height={240} className="aspect-[4/3] w-full rounded-2xl object-cover md:col-span-2" />}
                    <textarea defaultValue={perfume.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} className="form-input min-h-24 md:col-span-2" />
                    <div className="flex gap-2 md:col-span-2">
                      <button onClick={() => save(perfume.id)} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Save</button>
                      <button onClick={() => { setEditingId(null); setEditForm({}); }} className="rounded-full border border-border px-5 py-2 text-sm font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <img src={perfume.image} alt={`${perfume.name} perfume bottle`} width={160} height={120} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover md:w-40" />
                    <div className="flex-1">
                      <h2 className="font-serif text-2xl font-bold">{perfume.name}</h2>
                      <p className="text-sm text-muted-foreground">{perfume.brand} · {perfume.category} · ${perfume.price}</p>
                      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{perfume.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(perfume.id); setEditForm(perfume); }} className="rounded-full border border-border px-5 py-2 text-sm font-bold hover:bg-secondary">Edit</button>
                      <button onClick={() => remove(perfume.id)} className="rounded-full border border-destructive/40 px-5 py-2 text-sm font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground">Delete</button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
