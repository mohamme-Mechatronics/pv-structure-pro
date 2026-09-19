import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — Solar Structural Design Platform" },
      { name: "description", content: "Overview of solar PV mounting structure projects, design status and engine registry." },
      { property: "og:title", content: "Dashboard — Solar Structural Design Platform" },
      { property: "og:description", content: "Overview of solar PV mounting structure projects, design status and engine registry." },
    ],
  }),
  component: DashboardPage,
});
