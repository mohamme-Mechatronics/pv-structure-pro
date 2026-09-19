import type { ArrayLayout } from "@/types";

/** 2D plan diagram of an array layout (SVG). Tables side by side, rows stacked. */
export function LayoutDiagram({ layout, className }: { layout: ArrayLayout; className?: string }) {
  const { rows, columns, tables } = layout;
  const cellW = 6;
  const cellH = 11;
  const gap = 1;
  const tableGap = 5;
  const tableW = columns * (cellW + gap) - gap;
  const tableH = rows * (cellH + gap) - gap;
  const W = tables * tableW + (tables - 1) * tableGap;
  const H = tableH;
  const pad = 4;

  return (
    <svg viewBox={`${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`} className={className} preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: tables }).map((_, ti) => {
        const ox = ti * (tableW + tableGap);
        return (
          <g key={ti}>
            <rect x={ox - 1} y={-1} width={tableW + 2} height={tableH + 2} className="fill-none stroke-muted-foreground/40" strokeWidth={0.4} strokeDasharray="1.5 1" />
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: columns }).map((_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={ox + c * (cellW + gap)}
                  y={r * (cellH + gap)}
                  width={cellW}
                  height={cellH}
                  rx={0.4}
                  className="fill-primary/70 stroke-primary"
                  strokeWidth={0.3}
                />
              )),
            )}
          </g>
        );
      })}
    </svg>
  );
}
