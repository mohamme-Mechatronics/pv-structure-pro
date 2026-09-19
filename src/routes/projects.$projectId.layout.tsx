import { createFileRoute } from "@tanstack/react-router";
import { LayoutSelectionPage } from "@/pages/LayoutSelectionPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/layout")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Layout Selection — Solar Structural Design Platform" },
      { name: "description", content: "Candidate PV array configurations for the selected panels and area." },
      { property: "og:title", content: "Layout Selection — Solar Structural Design Platform" },
      { property: "og:description", content: "Candidate PV array configurations for the selected panels and area." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <LayoutSelectionPage project={project} />;
}
