import { createFileRoute } from "@tanstack/react-router";
import { ProjectSettingsPage } from "@/pages/ProjectSettingsPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Project Settings — Solar Structural Design Platform" },
      { name: "description", content: "Project options and read-only system design constants." },
      { property: "og:title", content: "Project Settings — Solar Structural Design Platform" },
      { property: "og:description", content: "Project options and read-only system design constants." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <ProjectSettingsPage project={project} />;
}
