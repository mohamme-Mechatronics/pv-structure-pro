import type { EngineId } from "@/engines/types";

/**
 * Ordered design pipeline. Each stage maps to exactly one engine id in the
 * registry. The runner calls `engineRegistry.get(engineId).run(ctx)` — today
 * every engine is a stub, so the run is a simulation with mock timing.
 */
export interface PipelineStage {
  stageId: string;
  engineId: EngineId;
  label: string;
  /** mock duration for the simulated run */
  mockMs: number;
}

export const DESIGN_PIPELINE: PipelineStage[] = [
  { stageId: "input", engineId: "input", label: "Input Processing", mockMs: 400 },
  { stageId: "array", engineId: "arrayLayout", label: "Array Generation", mockMs: 500 },
  { stageId: "geometry", engineId: "geometry", label: "Geometry Generation", mockMs: 600 },
  { stageId: "load", engineId: "load", label: "Load Calculation", mockMs: 700 },
  { stageId: "steel", engineId: "steelDesign", label: "Steel Design", mockMs: 900 },
  { stageId: "connection", engineId: "connection", label: "Connection Design", mockMs: 600 },
  { stageId: "foundation", engineId: "foundation", label: "Foundation Design", mockMs: 800 },
  { stageId: "rebar", engineId: "rebar", label: "Reinforcement Design", mockMs: 500 },
  { stageId: "anchor", engineId: "anchorBolt", label: "Anchor Bolt Design", mockMs: 500 },
  { stageId: "model3d", engineId: "model3d", label: "3D Model Generation", mockMs: 700 },
  { stageId: "drawing", engineId: "drawing", label: "Drawing Generation", mockMs: 800 },
  { stageId: "bom", engineId: "bom", label: "BOM Generation", mockMs: 400 },
  { stageId: "report", engineId: "report", label: "Report Generation", mockMs: 600 },
];
