import { createFileRoute } from "@tanstack/react-router";
import { BomPage } from "@/pages/BomPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/bom")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Bill of Materials — Solar Structural Design Platform" },
      { name: "description", content: "Preliminary bill of materials for the solar mounting structure." },
      { property: "og:title", content: "Bill of Materials — Solar Structural Design Platform" },
      { property: "og:description", content: "Preliminary bill of materials for the solar mounting structure." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <BomPage project={project} />;
}
