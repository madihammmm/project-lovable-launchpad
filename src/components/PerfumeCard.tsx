import heroBottle from "@/assets/dreamscents-hero.jpg";
import type { Perfume } from "@/lib/localPerfumes";

export function PerfumeCard({ perfume }: { perfume: Perfume }) {
  const image = perfume.image || heroBottle;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40">
        <img
          src={image}
          alt={`${perfume.name} perfume bottle`}
          width={640}
          height={480}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/75 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {perfume.category}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold">{perfume.name}</h3>
            <p className="text-sm text-muted-foreground">{perfume.brand}</p>
          </div>
          <p className="font-semibold text-primary">${perfume.price}</p>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{perfume.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="rounded-full border border-border bg-background/55 px-3 py-2 text-sm font-semibold transition hover:bg-secondary">
            ♡ Wishlist
          </button>
          <button className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
