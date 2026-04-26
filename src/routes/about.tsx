import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DreamScents" },
      { name: "description", content: "DreamScents assignment requirements, API routes, and deployment stack." },
      { property: "og:title", content: "About — DreamScents" },
      { property: "og:description", content: "A complete full-stack perfume website with CRUD and contact APIs." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Project overview</p>
        <h1 className="mt-2 font-serif text-5xl font-bold">DreamScents full-stack website</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Built for the assignment with a React frontend, REST APIs, in-memory runtime storage here, plus a separate Express + MongoDB Atlas backend package for Render or Railway deployment.</p>
        <div className="mt-10 overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          {[
            ["GET", "/api/perfumes", "Fetch all perfumes"],
            ["GET", "/api/perfumes/:id", "Fetch one perfume"],
            ["POST", "/api/perfumes", "Add perfume"],
            ["PUT", "/api/perfumes/:id", "Update perfume"],
            ["DELETE", "/api/perfumes/:id", "Delete perfume"],
            ["POST", "/api/contact", "Save contact submission"],
          ].map(([method, path, desc]) => (
            <div key={`${method}-${path}`} className="grid gap-2 border-b border-border/70 px-4 py-4 text-sm last:border-0 md:grid-cols-[90px_1fr_1.2fr]">
              <span className="rounded-full bg-secondary px-3 py-1 text-center font-bold text-secondary-foreground">{method}</span>
              <code className="font-semibold">{path}</code>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
