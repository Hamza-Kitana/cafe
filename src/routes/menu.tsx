import { createFileRoute } from "@tanstack/react-router";
import { MenuPage } from "@/pages/MenuPage";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "The Menu — Layali Café | Amman" },
      {
        name: "description",
        content:
          "Specialty coffee, hot and cold drinks, mocktails, fresh juices, desserts and shisha at Layali café on Rainbow Street, Amman.",
      },
      { property: "og:title", content: "The Menu — Layali Café" },
    ],
  }),
  component: MenuPage,
});
