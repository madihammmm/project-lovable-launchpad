import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — FlowBoard" },
      {
        name: "description",
        content:
          "FlowBoard is a full-stack demo: Express-style REST API, in-memory storage, and a responsive React frontend.",
      },
      { property: "og:title", content: "About — FlowBoard" },
      { property: "og:description", content: "Full-stack task manager built with TanStack Start." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-bold tracking-tight">About FlowBoard</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          FlowBoard is a complete full-stack demonstration project — built to show how a modern
          web app combines a REST API, in-memory storage, and a polished React frontend.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">Tech stack</h2>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          <li>• <strong className="text-foreground">Backend:</strong> TanStack Start server routes (Express-style routing & middleware)</li>
          <li>• <strong className="text-foreground">Storage:</strong> In-memory JavaScript store</li>
          <li>• <strong className="text-foreground">Frontend:</strong> React 19 + Tailwind CSS</li>
          <li>• <strong className="text-foreground">Routing:</strong> TanStack Router (file-based)</li>
          <li>• <strong className="text-foreground">Deployment:</strong> One click via Lovable / Vercel-ready</li>
        </ul>

        <h2 className="mt-12 text-2xl font-semibold">REST API</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card font-mono text-sm">
          {[
            ["GET", "/api/tasks", "List all tasks"],
            ["POST", "/api/tasks", "Create a new task"],
            ["GET", "/api/tasks/:id", "Get one task"],
            ["PUT", "/api/tasks/:id", "Update a task"],
            ["DELETE", "/api/tasks/:id", "Delete a task"],
          ].map(([m, p, d]) => (
            <div key={p + m} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
              <span className="w-16 rounded bg-secondary px-2 py-0.5 text-center text-xs font-bold text-secondary-foreground">
                {m}
              </span>
              <span className="font-semibold">{p}</span>
              <span className="ml-auto text-muted-foreground">{d}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
