import { createFileRoute } from "@tanstack/react-router";
import { tasks, createTask } from "../../server/tasksStore";

export const Route = createFileRoute("/api/tasks")({
  server: {
    handlers: {
      GET: async () => Response.json({ tasks }),
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          if (!body?.title || typeof body.title !== "string") {
            return Response.json({ error: "Title is required" }, { status: 400 });
          }
          const task = createTask(body);
          return Response.json({ task }, { status: 201 });
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
      },
    },
  },
});
