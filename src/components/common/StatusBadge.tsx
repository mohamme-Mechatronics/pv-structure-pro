import { cn } from "@/lib/utils";
import { t } from "@/data/strings/en";

type StatusKey = keyof typeof t.status;

const STYLES: Partial<Record<StatusKey, string>> = {
  ready: "bg-success/15 text-success border-success/30",
  done: "bg-success/15 text-success border-success/30",
  generated: "bg-success/15 text-success border-success/30",
  designed: "bg-success/15 text-success border-success/30",
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  mock: "bg-warning/15 text-warning border-warning/30",
  outdated: "bg-warning/15 text-warning border-warning/30",
  running: "bg-info/15 text-info border-info/30",
  generating: "bg-info/15 text-info border-info/30",
  in_progress: "bg-info/15 text-info border-info/30",
  not_calculated: "bg-muted text-muted-foreground border-border",
  not_generated: "bg-muted text-muted-foreground border-border",
  queued: "bg-muted text-muted-foreground border-border",
  draft: "bg-muted text-muted-foreground border-border",
  skipped: "bg-muted text-muted-foreground border-border",
  comingSoon: "bg-muted text-muted-foreground border-dashed border-border",
};

export function StatusBadge({ status, className }: { status: StatusKey; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        STYLES[status] ?? STYLES.not_calculated,
        className,
      )}
    >
      {status === "running" || status === "generating" ? (
        <span className="size-1.5 animate-pulse rounded-full bg-current" />
      ) : (
        <span className="size-1.5 rounded-full bg-current opacity-70" />
      )}
      {t.status[status]}
    </span>
  );
}
