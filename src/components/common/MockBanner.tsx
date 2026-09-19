import { TriangleAlert } from "lucide-react";
import { t } from "@/data/strings/en";
import { cn } from "@/lib/utils";

export function MockBanner({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-sm border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-foreground",
        className,
      )}
    >
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" />
      <span>{children ?? t.common.mockBanner}</span>
    </div>
  );
}
