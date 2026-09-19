import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import type { Project } from "@/types";
import { buildSceneModel } from "./sceneModel";
import { StructureScene } from "./StructureScene";
import { LAYERS, defaultLayerState, type LayerState } from "./layers";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewPreset = "iso" | "plan" | "front" | "side";

export function StructureViewer({
  project,
  className,
  showPresets = false,
}: {
  project: Project;
  className?: string;
  showPresets?: boolean;
}) {
  const model = useMemo(() => buildSceneModel(project), [project]);
  const [layers, setLayers] = useState<LayerState>(defaultLayerState);
  const [preset, setPreset] = useState<ViewPreset>("iso");

  if (!model) {
    return (
      <div className={cn("eng-grid flex items-center justify-center rounded-sm border bg-surface text-sm text-muted-foreground", className)}>
        Select an array layout to generate the structure preview.
      </div>
    );
  }

  const d = model.extent;
  const cam: Record<ViewPreset, [number, number, number]> = {
    iso: [d * 1.1, d * 0.8, d * 1.1],
    plan: [0, d * 2, 0.001],
    front: [0, d * 0.3, d * 1.8],
    side: [d * 1.8, d * 0.3, 0],
  };

  return (
    <div className={cn("relative overflow-hidden rounded-sm border bg-surface", className)}>
      <Canvas key={preset} shadows camera={{ position: cam[preset], fov: 45, near: 0.1, far: 1000 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <StructureScene model={model} layers={layers} />
        </Suspense>
        <OrbitControls makeDefault enablePan enableZoom enableRotate target={[0, 1, 0]} maxPolarAngle={Math.PI / 2 - 0.02} />
        <GizmoHelper alignment="bottom-right" margin={[56, 56]}>
          <GizmoViewport axisColors={["#e06c75", "#98c379", "#61afef"]} labelColor="white" />
        </GizmoHelper>
      </Canvas>

      {/* Layer panel */}
      <div className="absolute left-3 top-3 w-44 rounded-sm border bg-card/90 p-2 text-xs shadow-sm backdrop-blur">
        <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Layers</div>
        <div className="space-y-1.5">
          {LAYERS.map((l) => (
            <label key={l.key} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={layers[l.key]}
                onCheckedChange={(v) => setLayers((s) => ({ ...s, [l.key]: v === true }))}
                className="size-3.5"
              />
              <span className={cn(l.pendingEngine && "text-muted-foreground")}>{l.label}</span>
              {l.pendingEngine && <span className="ml-auto font-mono text-[9px] text-warning">ENGINE</span>}
            </label>
          ))}
        </div>
      </div>

      {showPresets && (
        <div className="absolute right-3 top-3 flex gap-1 rounded-sm border bg-card/90 p-1 backdrop-blur">
          {(["iso", "plan", "front", "side"] as ViewPreset[]).map((p) => (
            <Button key={p} size="sm" variant={preset === p ? "default" : "ghost"} className="h-6 px-2 font-mono text-[10px] uppercase" onClick={() => setPreset(p)}>
              {p}
            </Button>
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] text-muted-foreground">
        LMB rotate · RMB pan · wheel zoom · {model.panels.length} panels · {model.columns.length} columns · mock geometry
      </div>
    </div>
  );
}
