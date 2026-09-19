import { createFileRoute } from "@tanstack/react-router";
import { ReportPage } from "@/pages/ReportPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/report")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Engineering Report — Solar Structural Design Platform" },
      { name: "description", content: "Structural engineering report sections for the solar structure design." },
      { property: "og:title", content: "Engineering Report — Solar Structural Design Platform" },
      { property: "og:description", content: "Structural engineering report sections for the solar structure design." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <ReportPage project={project} />;
}
