import { createFileRoute } from "@tanstack/react-router";
import { findTask, updateTask, deleteTask } from "../../server/tasksStore";

export const Route = createFileRoute("/api/tasks/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const t = findTask(params.id);
        if (!t) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json({ task: t });
      },
      PUT: async ({ request, params }) => {
        try {
          const body = await request.json();
          const t = updateTask(params.id, body);
          if (!t) return Response.json({ error: "Not found" }, { status: 404 });
          return Response.json({ task: t });
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
      },
      DELETE: async ({ params }) => {
        const ok = deleteTask(params.id);
        if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json({ success: true });
      },
    },
  },
});
