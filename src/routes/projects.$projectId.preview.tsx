import { createFileRoute } from "@tanstack/react-router";
import { StructurePreviewPage } from "@/pages/StructurePreviewPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/preview")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Structure Preview — Solar Structural Design Platform" },
      { name: "description", content: "Simplified 3D preview of panels, steel structure and foundations." },
      { property: "og:title", content: "Structure Preview — Solar Structural Design Platform" },
      { property: "og:description", content: "Simplified 3D preview of panels, steel structure and foundations." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <StructurePreviewPage project={project} />;
}
