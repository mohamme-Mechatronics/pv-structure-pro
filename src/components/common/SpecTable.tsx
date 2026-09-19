import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SpecRow {
  label: string;
  value: ReactNode;
  unit?: string;
}

/** Compact label/value table for engineering parameters. */
export function SpecTable({ rows, className }: { rows: SpecRow[]; className?: string }) {
  return (
    <dl className={cn("divide-y text-sm", className)}>
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 py-1.5">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="num text-right">
            {r.value}
            {r.unit && <span className="ml-1 text-xs text-muted-foreground">{r.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
