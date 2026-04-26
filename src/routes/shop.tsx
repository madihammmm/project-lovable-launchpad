import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PerfumeCard } from "@/components/PerfumeCard";
import { SiteLayout } from "@/components/SiteLayout";
import type { Perfume, PerfumeCategory } from "@/lib/localPerfumes";
import { categories, listPerfumes } from "@/lib/localPerfumes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Perfumes — DreamScents" },
      { name: "description", content: "Search and filter DreamScents perfumes by name and category." },
      { property: "og:title", content: "Shop Perfumes — DreamScents" },
      { property: "og:description", content: "Browse floral, oud, fresh, luxury, and sweet perfumes." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | PerfumeCategory>("All");

  useEffect(() => {
    try {
      setPerfumes(listPerfumes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const visible = useMemo(() => {
    return perfumes.filter((perfume) => {
      const matchesSearch = perfume.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || perfume.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [perfumes, search, category]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Perfume shop</p>
          <h1 className="mt-2 font-serif text-5xl font-bold">Choose your aura</h1>
          <p className="mt-3 text-muted-foreground">Search the collection, filter by fragrance family, and save your favorites to the wishlist/cart UI.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-border/70 bg-card/55 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search perfume by name..."
              className="rounded-full border border-input bg-background/65 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-2 overflow-x-auto">
              {(["All", ...categories] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition",
                    category === item ? "bg-primary text-primary-foreground" : "bg-background/65 text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-muted-foreground">Loading dreamy perfumes...</p>
        ) : error ? (
          <p className="mt-10 rounded-2xl border border-destructive/30 bg-card/70 p-5 text-destructive">{error}</p>
        ) : visible.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No perfumes match your search.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((perfume) => <PerfumeCard key={perfume.id} perfume={perfume} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
