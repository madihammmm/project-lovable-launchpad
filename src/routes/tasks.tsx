import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import type { Task, TaskPriority, TaskStatus } from "@/server/tasksStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — FlowBoard" },
      { name: "description", content: "Manage your tasks: create, edit, and delete with ease." },
      { property: "og:title", content: "Tasks — FlowBoard" },
      { property: "og:description", content: "Full CRUD task board powered by a REST API." },
    ],
  }),
  component: TasksPage,
});

const STATUS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];
const PRIORITY: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function statusBadge(s: TaskStatus) {
  const map: Record<TaskStatus, string> = {
    todo: "bg-secondary text-secondary-foreground",
    "in-progress": "bg-accent/40 text-accent-foreground",
    done: "bg-primary/15 text-primary",
  };
  return map[s];
}

function priorityDot(p: TaskPriority) {
  return p === "high"
    ? "oklch(0.62 0.2 28)"
    : p === "medium"
      ? "oklch(0.75 0.15 75)"
      : "oklch(0.7 0.1 220)";
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

  async function load() {
    setLoading(true);
    const r = await fetch("/api/tasks");
    const j = await r.json();
    setTasks(j.tasks ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", status: "todo", priority: "medium" });
    setSubmitting(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    load();
  }

  async function handleSaveEdit(id: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm({});
    load();
  }

  async function handleQuickStatus(id: string, status: TaskStatus) {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const visible = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your Board</h1>
            <p className="mt-1 text-muted-foreground">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} · live REST API
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleCreate}
          className="mt-8 rounded-2xl border border-border bg-card p-6"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <h2 className="text-lg font-semibold">Add a task</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              required
              maxLength={200}
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {PRIORITY.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label} priority
                  </option>
                ))}
              </select>
            </div>
            <textarea
              maxLength={2000}
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="md:col-span-2 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--gradient-hero)" }}
            >
              {submitting ? "Adding..." : "Add task"}
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(["all", "todo", "in-progress", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                filter === f
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "all" ? "All" : STATUS.find((s) => s.value === f)?.label}{" "}
              <span className="ml-1 opacity-70">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-6 grid gap-3">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No tasks here yet.
            </div>
          ) : (
            visible.map((t) => {
              const editing = editingId === t.id;
              return (
                <div
                  key={t.id}
                  className="rounded-2xl border border-border bg-card p-5"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  {editing ? (
                    <div className="grid gap-3">
                      <input
                        defaultValue={t.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <textarea
                        defaultValue={t.description}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, description: e.target.value }))
                        }
                        className="min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          defaultValue={t.status}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, status: e.target.value as TaskStatus }))
                          }
                          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {STATUS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <select
                          defaultValue={t.priority}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              priority: e.target.value as TaskPriority,
                            }))
                          }
                          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {PRIORITY.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({});
                          }}
                          className="rounded-md border border-border px-4 py-1.5 text-sm hover:bg-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(t.id)}
                          className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: priorityDot(t.priority) }}
                            title={`${t.priority} priority`}
                          />
                          <h3 className="truncate text-base font-semibold">{t.title}</h3>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              statusBadge(t.status),
                            )}
                          >
                            {STATUS.find((s) => s.value === t.status)?.label}
                          </span>
                        </div>
                        {t.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={t.status}
                          onChange={(e) =>
                            handleQuickStatus(t.id, e.target.value as TaskStatus)
                          }
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                        >
                          {STATUS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            setEditingId(t.id);
                            setEditForm({});
                          }}
                          className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
