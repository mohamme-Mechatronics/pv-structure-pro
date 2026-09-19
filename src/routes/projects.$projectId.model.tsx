import { createFileRoute } from "@tanstack/react-router";
import { StructurePreviewPage } from "@/pages/StructurePreviewPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/model")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "3D Model — Solar Structural Design Platform" },
      { name: "description", content: "Interactive parametric 3D model of the solar mounting structure." },
      { property: "og:title", content: "3D Model — Solar Structural Design Platform" },
      { property: "og:description", content: "Interactive parametric 3D model of the solar mounting structure." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <StructurePreviewPage project={project} full />;
}
