import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowBoard — Modern Task Manager" },
      {
        name: "description",
        content:
          "FlowBoard is a fast, beautiful task manager. Organize your work with full CRUD, priorities, and statuses.",
      },
      { property: "og:title", content: "FlowBoard — Modern Task Manager" },
      {
        property: "og:description",
        content: "Organize your work with a fast, beautiful task manager.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-soft)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              v1.0 · Live
            </span>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight md:text-6xl">
              Organize work with{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                effortless flow
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              FlowBoard is a clean, fast task manager with a full REST API backend. Create,
              update, and ship — all from one delightful place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/tasks"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-elegant)",
                }}
              >
                Open the board →
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-secondary"
              >
                Learn more
              </Link>
            </div>
          </div>
          <div
            className="relative rounded-3xl border border-border bg-card p-6"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <div className="space-y-3">
              {[
                { t: "Design landing hero", s: "done", c: "oklch(0.7 0.15 145)" },
                { t: "Wire up REST API", s: "in-progress", c: "oklch(0.75 0.15 75)" },
                { t: "Deploy to production", s: "todo", c: "oklch(0.62 0.18 28)" },
              ].map((row) => (
                <div
                  key={row.t}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: row.c }}
                    />
                    <span className="font-medium">{row.t}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{row.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Built for makers</h2>
        <p className="mt-2 text-muted-foreground">Everything you need, nothing you don't.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Full CRUD",
              body: "Create, read, update, and delete tasks via a clean REST API.",
            },
            {
              title: "Express-style backend",
              body: "Server routes power /api/tasks with proper status codes & validation.",
            },
            {
              title: "Responsive UI",
              body: "Looks gorgeous on phones, tablets, and ultrawides.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
