import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./ThemeToggle";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useCurrentProject } from "@/store/projectStore";
import { t } from "@/data/strings/en";

export function TopBar() {
  const project = useCurrentProject();
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-card/60 px-3 backdrop-blur">
      <SidebarTrigger className="size-8" />
      <Separator orientation="vertical" className="mx-1 h-5!" />
      {project ? (
        <div className="flex min-w-0 flex-1 items-center gap-3 text-sm">
          <span className="truncate font-medium">{project.name}</span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            {t.projectTypes[project.type]}
            {project.governorate ? ` · ${project.governorate}` : ""}
          </span>
          <span className="ml-auto flex items-center gap-2">
            <StatusBadge status={project.designStatus} />
          </span>
        </div>
      ) : (
        <div className="flex-1 truncate text-sm font-medium">{t.app.name}</div>
      )}
      <ThemeToggle />
    </header>
  );
}
