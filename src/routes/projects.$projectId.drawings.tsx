import { createFileRoute } from "@tanstack/react-router";
import { DrawingsPage } from "@/pages/DrawingsPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/drawings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Drawings — Solar Structural Design Platform" },
      { name: "description", content: "A3 drawing set: general arrangement, plan, elevation, sections and details." },
      { property: "og:title", content: "Drawings — Solar Structural Design Platform" },
      { property: "og:description", content: "A3 drawing set: general arrangement, plan, elevation, sections and details." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <DrawingsPage project={project} />;
}
