import { createFileRoute } from "@tanstack/react-router";
import { deletePerfume, findPerfume, updatePerfume, validatePerfume } from "../../server/perfumeStore";

export const Route = createFileRoute("/api/perfumes/")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const perfume = findPerfume(params.id);
        if (!perfume) return Response.json({ error: "Perfume not found" }, { status: 404 });
        return Response.json({ perfume });
      },
      PUT: async ({ request, params }) => {
        try {
          const body = await request.json();
          const current = findPerfume(params.id);
          if (!current) return Response.json({ error: "Perfume not found" }, { status: 404 });
          const error = validatePerfume({ ...current, ...body });
          if (error) return Response.json({ error }, { status: 400 });
          const perfume = updatePerfume(params.id, body);
          return Response.json({ perfume });
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
      },
      DELETE: async ({ params }) => {
        const deleted = deletePerfume(params.id);
        if (!deleted) return Response.json({ error: "Perfume not found" }, { status: 404 });
        return Response.json({ success: true });
      },
    },
  },
});
