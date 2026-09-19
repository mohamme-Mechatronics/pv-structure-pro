import { createFileRoute } from "@tanstack/react-router";
import { DesignResultsPage } from "@/pages/DesignResultsPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/results")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Design Results — Solar Structural Design Platform" },
      { name: "description", content: "Engineering results dashboard with per-domain status indicators." },
      { property: "og:title", content: "Design Results — Solar Structural Design Platform" },
      { property: "og:description", content: "Engineering results dashboard with per-domain status indicators." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <DesignResultsPage project={project} />;
}
