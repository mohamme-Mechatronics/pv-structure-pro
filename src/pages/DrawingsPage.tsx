import { PageHeader } from "@/components/common/PageHeader";
import { MockBanner } from "@/components/common/MockBanner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { DESIGN_CONSTANTS } from "@/data/designConstants";
import type { DrawingSheet, Project } from "@/types";
import { t } from "@/data/strings/en";

const SHEETS: Omit<DrawingSheet, "status">[] = [
  { id: "ga", number: "S-001", title: "General Arrangement", scale: "1:100", sheetSize: "A3" },
  { id: "plan", number: "S-101", title: "Plan", scale: "1:100", sheetSize: "A3" },
  { id: "elev", number: "S-201", title: "Elevation", scale: "1:50", sheetSize: "A3" },
  { id: "sect", number: "S-301", title: "Section", scale: "1:25", sheetSize: "A3" },
  { id: "fnd", number: "S-401", title: "Foundation Detail", scale: "1:20", sheetSize: "A3" },
  { id: "bp", number: "S-501", title: "Base Plate Detail", scale: "1:5", sheetSize: "A3" },
  { id: "ab", number: "S-502", title: "Anchor Bolt Detail", scale: "1:5", sheetSize: "A3" },
  { id: "rb", number: "S-601", title: "Reinforcement Detail", scale: "1:20", sheetSize: "A3" },
];

export function DrawingsPage({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <PageHeader code="Step 08" title={t.nav.drawings} description={`Drawing set · sheet size ${DESIGN_CONSTANTS.drawings.sheetSize} · ${SHEETS.length} sheets.`} />
      <MockBanner>Drawing Engine pending — sheets are placeholders with title blocks only.</MockBanner>
      <div className="grid gap-4 md:grid-cols-2">
        {SHEETS.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-sm border bg-card">
            {/* A3 landscape proportion 420 × 297 */}
            <div className="eng-grid relative aspect-[420/297] border-b">
              <div className="absolute inset-3 border border-foreground/40">
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  {t.common.engineNotConnected}
                </div>
                {/* title block */}
                <div className="absolute bottom-0 right-0 grid w-56 grid-cols-2 border-l border-t border-foreground/40 bg-card font-mono text-[9px]">
                  <div className="col-span-2 border-b border-foreground/40 px-1.5 py-0.5 font-semibold uppercase">{s.title}</div>
                  <div className="border-b border-r border-foreground/40 px-1.5 py-0.5">Project</div>
                  <div className="truncate border-b border-foreground/40 px-1.5 py-0.5">{project.name}</div>
                  <div className="border-b border-r border-foreground/40 px-1.5 py-0.5">Sheet</div>
                  <div className="border-b border-foreground/40 px-1.5 py-0.5">{s.number}</div>
                  <div className="border-r border-foreground/40 px-1.5 py-0.5">Scale / Size</div>
                  <div className="px-1.5 py-0.5">{s.scale} / {s.sheetSize}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <span><span className="mr-2 font-mono text-xs text-muted-foreground">{s.number}</span>{s.title}</span>
              <StatusBadge status={project.designRun ? "pending" : "not_calculated"} />
            </div>
          </div>
        ))}
      </div>
      <WorkflowStepper projectId={project.id} step="drawings" />
    </div>
  );
}
