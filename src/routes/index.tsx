import { createFileRoute, Link } from "@tanstack/react-router";
import heroBottle from "@/assets/dreamscents-hero.jpg";
import { PerfumeCard } from "@/components/PerfumeCard";
import { SiteLayout } from "@/components/SiteLayout";
import { defaultPerfumes } from "@/lib/localPerfumes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DreamScents — Luxury Perfume Boutique" },
      {
        name: "description",
        content: "DreamScents is a dreamy full-stack perfume boutique with CRUD products, REST APIs, and responsive luxury UI.",
      },
      { property: "og:title", content: "DreamScents — Where Fragrance Meets Fantasy" },
      { property: "og:description", content: "Discover your signature scent in a romantic perfume boutique." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 bg-[var(--mist-gradient)]" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1fr_0.95fr] md:items-center md:py-20 lg:py-24">
          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-primary/20 bg-card/60 px-4 py-2 text-sm font-semibold text-primary backdrop-blur">
              DreamScents – Where Fragrance Meets Fantasy
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">
              Discover Your Signature Scent
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Step into a pastel dream of floral whispers, glowing oud, pearl mist, and romantic luxury perfumes crafted for unforgettable moments.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5">
                Shop perfumes
              </Link>
              <Link to="/add-perfume" className="rounded-full border border-border bg-card/70 px-7 py-3 text-sm font-bold backdrop-blur transition hover:-translate-y-0.5 hover:bg-secondary">
                Add perfume
              </Link>
            </div>
          </div>
          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-border/70 bg-card/50 shadow-[var(--shadow-elegant)] backdrop-blur-xl">
            <img src={heroBottle} alt="DreamScents perfume bottle with pastel mist" width={1280} height={896} className="h-full min-h-[340px] w-full object-cover" />
            <div className="absolute inset-0 bg-[var(--hero-veil)]" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl">
              <p className="font-serif text-2xl font-bold">Pearl Fantasy</p>
              <p className="text-sm text-muted-foreground">Iris powder · champagne petals · creamy sandalwood</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Featured perfumes</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">Bestsellers in bloom</h2>
          </div>
          <Link to="/shop" className="text-sm font-bold text-primary hover:underline">View full shop →</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {defaultPerfumes.slice(0, 3).map((perfume) => <PerfumeCard key={perfume.id} perfume={perfume} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Dreamy curation", "Every scent is organized by mood, category, and luxury notes so shoppers can find their fantasy faster."],
            ["Local product storage", "Products can be created, edited, deleted, searched, and saved in the browser with localStorage."],
            ["Vercel ready", "Deploy the frontend with default Vercel settings without needing a separate backend server."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-border/70 bg-card/55 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <div className="mb-4 text-2xl">✧</div>
              <h3 className="font-serif text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
