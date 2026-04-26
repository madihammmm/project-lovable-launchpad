import { createFileRoute } from "@tanstack/react-router";
import { createPerfume, listPerfumes, validatePerfume } from "../../server/perfumeStore";

export const Route = createFileRoute("/api/perfumes")({
  server: {
    handlers: {
      GET: async () => Response.json({ perfumes: listPerfumes() }),
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const error = validatePerfume(body);
          if (error) return Response.json({ error }, { status: 400 });
          const perfume = createPerfume(body);
          return Response.json({ perfume }, { status: 201 });
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
      },
    },
  },
});
