import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useProject, useProjectStore } from "@/store/projectStore";

export const Route = createFileRoute("/projects/$projectId")({
  ssr: false,
  component: ProjectLayout,
});

function ProjectLayout() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  const setCurrent = useProjectStore((s) => s.setCurrent);

  useEffect(() => {
    setCurrent(project ? projectId : null);
  }, [projectId, project, setCurrent]);

  if (!project) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">Project not found.</p>
        <Link to="/" className="text-sm text-primary underline">Back to Dashboard</Link>
      </div>
    );
  }
  return <Outlet />;
}
