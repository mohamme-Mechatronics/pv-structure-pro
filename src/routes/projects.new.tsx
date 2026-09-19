import { createFileRoute } from "@tanstack/react-router";
import { NewProjectPage } from "@/pages/NewProjectPage";

export const Route = createFileRoute("/projects/new")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "New Project — Solar Structural Design Platform" },
      { name: "description", content: "Select a solar structure type to start a new design project." },
      { property: "og:title", content: "New Project — Solar Structural Design Platform" },
      { property: "og:description", content: "Select a solar structure type to start a new design project." },
    ],
  }),
  component: NewProjectPage,
});
