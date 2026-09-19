import { createFileRoute } from "@tanstack/react-router";
import { DesignGenerationPage } from "@/pages/DesignGenerationPage";
import { useProject } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId/generate")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Design Generation — Solar Structural Design Platform" },
      { name: "description", content: "Run the modular design pipeline across all engineering engines." },
      { property: "og:title", content: "Design Generation — Solar Structural Design Platform" },
      { property: "og:description", content: "Run the modular design pipeline across all engineering engines." },
    ],
  }),
  component: Page,
});

function Page() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  if (!project) return null;
  return <DesignGenerationPage project={project} />;
}
