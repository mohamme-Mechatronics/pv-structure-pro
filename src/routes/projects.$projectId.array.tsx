import { createFileRoute } from "@tanstack/react-router";
import { SolarArrayPage } from "@/pages/SolarArrayPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/array")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Solar Array — Solar Structural Design Platform" },
      { name: "description", content: "PV panel count, module selection from the panel library and available area." },
      { property: "og:title", content: "Solar Array — Solar Structural Design Platform" },
      { property: "og:description", content: "PV panel count, module selection from the panel library and available area." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <SolarArrayPage project={project} />;
}
