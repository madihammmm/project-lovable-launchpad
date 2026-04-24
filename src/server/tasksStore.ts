// In-memory data store for tasks (singleton across server route handlers)
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __TASKS_STORE__: Task[] | undefined;
}

function seed(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      title: "Welcome to FlowBoard",
      description: "Click any task to edit. Use the form to add new ones.",
      status: "todo",
      priority: "high",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Try the API",
      description: "Visit /api/tasks to see the REST endpoint in action.",
      status: "in-progress",
      priority: "medium",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Deploy the project",
      description: "One click and you are live.",
      status: "done",
      priority: "low",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export const tasks: Task[] = (globalThis.__TASKS_STORE__ ??= seed());

export function findTask(id: string) {
  return tasks.find((t) => t.id === id);
}

export function createTask(input: Partial<Task>): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    title: String(input.title ?? "").trim().slice(0, 200) || "Untitled",
    description: String(input.description ?? "").trim().slice(0, 2000),
    status: (input.status as TaskStatus) ?? "todo",
    priority: (input.priority as TaskPriority) ?? "medium",
    createdAt: now,
    updatedAt: now,
  };
  tasks.unshift(task);
  return task;
}

export function updateTask(id: string, patch: Partial<Task>): Task | null {
  const t = findTask(id);
  if (!t) return null;
  if (patch.title !== undefined) t.title = String(patch.title).trim().slice(0, 200) || t.title;
  if (patch.description !== undefined) t.description = String(patch.description).trim().slice(0, 2000);
  if (patch.status !== undefined) t.status = patch.status as TaskStatus;
  if (patch.priority !== undefined) t.priority = patch.priority as TaskPriority;
  t.updatedAt = new Date().toISOString();
  return t;
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}
