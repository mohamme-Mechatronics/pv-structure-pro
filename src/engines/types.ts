import type { Project } from "@/types";
import type { DesignConstants } from "@/data/designConstants";

export type EngineId =
  | "input"
  | "panelLibrary"
  | "arrayLayout"
  | "geometry"
  | "load"
  | "steelDesign"
  | "connection"
  | "foundation"
  | "rebar"
  | "anchorBolt"
  | "basePlate"
  | "model3d"
  | "drawing"
  | "bom"
  | "report";

export type EngineImplStatus = "stub" | "ready";

export type EngineResultStatus = "ready" | "not_calculated" | "error";

export interface EngineContext {
  project: Project;
  constants: DesignConstants;
  /** Outputs of previously executed engines in the same run, keyed by engine id. */
  upstream: Partial<Record<EngineId, unknown>>;
}

export interface EngineResult<TOutput = unknown> {
  engineId: EngineId;
  status: EngineResultStatus;
  output?: TOutput;
  /** Human-readable notes, e.g. "stub — no calculation performed" */
  notes: string[];
  warnings: string[];
}

export interface Engine<TOutput = unknown> {
  id: EngineId;
  name: string;
  version: string;
  implStatus: EngineImplStatus;
  description: string;
  run(ctx: EngineContext): Promise<EngineResult<TOutput>>;
}

/**
 * Creates a placeholder engine. Stubs perform NO calculation and always
 * return `not_calculated`. Replace the `run` implementation to make it real.
 */
export function createStubEngine<TOutput = unknown>(
  def: Pick<Engine<TOutput>, "id" | "name" | "description">,
): Engine<TOutput> {
  return {
    ...def,
    version: "0.0.0-stub",
    implStatus: "stub",
    async run() {
      return {
        engineId: def.id,
        status: "not_calculated",
        notes: [`${def.name} is a placeholder — no calculation performed.`],
        warnings: [],
      };
    },
  };
}
