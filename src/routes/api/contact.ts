import { createFileRoute } from "@tanstack/react-router";
import { createContact } from "../../server/perfumeStore";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const contact = createContact(body);
          if (!contact) return Response.json({ error: "Valid name, email, and message are required." }, { status: 400 });
          return Response.json({ contact, success: true }, { status: 201 });
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
      },
    },
  },
});
