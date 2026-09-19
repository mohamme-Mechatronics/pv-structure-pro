import { createFileRoute } from "@tanstack/react-router";
import { ProjectInfoPage } from "@/pages/ProjectInfoPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/info")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Project Information — Solar Structural Design Platform" },
      { name: "description", content: "Project name and governorate for the solar structure project." },
      { property: "og:title", content: "Project Information — Solar Structural Design Platform" },
      { property: "og:description", content: "Project name and governorate for the solar structure project." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <ProjectInfoPage project={project} />;
}
