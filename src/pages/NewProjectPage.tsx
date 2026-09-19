import { useNavigate } from "@tanstack/react-router";
import { Building2, Car, Layers, Warehouse } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useProjectStore } from "@/store/projectStore";
import type { ProjectType } from "@/types";
import { t } from "@/data/strings/en";
import { cn } from "@/lib/utils";

const TYPES: { type: ProjectType; icon: typeof Layers; desc: string; active: boolean }[] = [
  { type: "ground", icon: Layers, desc: "Ground-mounted fixed-tilt tables on steel frames with isolated footings.", active: true },
  { type: "elevated_rooftop", icon: Building2, desc: "Elevated frames over flat concrete roofs.", active: false },
  { type: "metal_roof", icon: Warehouse, desc: "Rail systems clamped to metal / zinc sheet roofs.", active: false },
  { type: "carport", icon: Car, desc: "Cantilever or portal carport canopies.", active: false },
];

export function NewProjectPage() {
  const createProject = useProjectStore((s) => s.createProject);
  const navigate = useNavigate();

  const create = (type: ProjectType) => {
    const p = createProject(type);
    navigate({ to: "/projects/$projectId/info", params: { projectId: p.id } });
  };

  return (
    <div className="space-y-6">
      <PageHeader code="Step 00" title={t.nav.newProject} description="Select the structure type. Only Ground Structure is available in this release." />
      <div className="grid gap-3 sm:grid-cols-2">
        {TYPES.map(({ type, icon: Icon, desc, active }) => (
          <button
            key={type}
            disabled={!active}
            onClick={() => create(type)}
            className={cn(
              "group flex items-start gap-4 rounded-sm border bg-card p-4 text-left transition-colors",
              active ? "hover:border-primary hover:bg-accent/40" : "cursor-not-allowed opacity-60",
            )}
          >
            <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-sm border", active ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground")}>
              <Icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{t.projectTypes[type]}</span>
                <StatusBadge status={active ? "active" : "comingSoon"} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
