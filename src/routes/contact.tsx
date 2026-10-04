import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Layali Café | Rainbow Street, Amman" },
      {
        name: "description",
        content:
          "Call, WhatsApp or visit Layali café on Rainbow Street, Jabal Amman. Open every night 4 PM — 2 AM.",
      },
      { property: "og:title", content: "Contact — Layali Café" },
    ],
  }),
  component: ContactPage,
});
