import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WORKFLOW_STEPS, stepIndex, type StepKey } from "@/modules/workflow/steps";
import { t } from "@/data/strings/en";

const flow = WORKFLOW_STEPS.filter((s) => s.inWorkflow);

export function WorkflowStepper({
  projectId,
  step,
  nextDisabled,
}: {
  projectId: string;
  step: StepKey;
  nextDisabled?: boolean;
}) {
  const i = flow.findIndex((s) => s.key === step);
  if (i < 0) return null;
  const prev = flow[i - 1];
  const next = flow[i + 1];
  return (
    <div className="mt-8 flex items-center justify-between border-t pt-4">
      <div>
        {prev && (
          <Button asChild variant="outline" size="sm">
            <Link to={prev.to} params={{ projectId }}>
              <ChevronLeft className="size-4" /> {t.common.back}: {prev.label}
            </Link>
          </Button>
        )}
      </div>
      <div className="font-mono text-xs text-muted-foreground">
        Step {String(stepIndex(step) + 1).padStart(2, "0")} / {flow.length}
      </div>
      <div>
        {next && (
          <Button asChild size="sm" className={nextDisabled ? "pointer-events-none opacity-50" : undefined}>
            <Link to={next.to} params={{ projectId }} disabled={!!nextDisabled} aria-disabled={!!nextDisabled}>
              {t.common.next}: {next.label} <ChevronRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
