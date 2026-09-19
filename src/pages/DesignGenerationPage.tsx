import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/PageHeader";
import { MockBanner } from "@/components/common/MockBanner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { DESIGN_PIPELINE } from "@/modules/design/pipeline";
import { engineRegistry } from "@/engines/registry";
import { useProjectStore } from "@/store/projectStore";
import type { Project } from "@/types";
import { t } from "@/data/strings/en";

export function DesignGenerationPage({ project }: { project: Project }) {
  const runDesign = useProjectStore((s) => s.runDesign);
  const run = project.designRun;
  const running = project.designStatus === "generating";
  const done = run?.stages.filter((s) => s.state === "done").length ?? 0;
  const pct = run ? Math.round((done / run.stages.length) * 100) : 0;
  const canRun = !!project.selectedLayoutId && !running;

  return (
    <div className="space-y-6">
      <PageHeader
        code="Step 05"
        title={t.nav.generate}
        description="Runs the design pipeline. Each stage resolves its engine from the registry."
        actions={
          <Button onClick={() => runDesign(project.id)} disabled={!canRun}>
            {run ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
            {run ? "Re-generate Design" : "Generate Design"}
          </Button>
        }
      />
      <MockBanner>
        Simulation only. All engines are placeholders — no structural calculation is performed and no engineering result is produced.
      </MockBanner>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Pipeline</span>
            <span className="flex items-center gap-3 font-mono text-xs font-normal text-muted-foreground">
              {done} / {DESIGN_PIPELINE.length} stages
              <StatusBadge status={project.designStatus} />
            </span>
          </CardTitle>
          <Progress value={pct} className="mt-2 h-1.5" />
        </CardHeader>
        <CardContent className="p-0">
          <ol className="divide-y">
            {DESIGN_PIPELINE.map((stage, i) => {
              const st = run?.stages.find((s) => s.stageId === stage.stageId);
              const engine = engineRegistry.get(stage.engineId);
              return (
                <li key={stage.stageId} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-4 py-2.5 text-sm sm:grid-cols-[2.5rem_1fr_1fr_auto]">
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{stage.label}</span>
                  <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">
                    {engine.name} · {engine.implStatus}
                    {st?.durationMs != null && ` · ${st.durationMs} ms`}
                  </span>
                  <StatusBadge status={st?.state ?? "queued"} />
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
      <WorkflowStepper projectId={project.id} step="generate" nextDisabled={!run || running} />
    </div>
  );
}
