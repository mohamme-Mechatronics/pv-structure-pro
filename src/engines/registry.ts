import type { Engine, EngineId } from "./types";
import { inputEngine } from "./input";
import { panelLibraryEngine } from "./panelLibrary";
import { arrayLayoutEngine } from "./arrayLayout";
import { geometryEngine } from "./geometry";
import { loadEngine } from "./load";
import { steelDesignEngine } from "./steelDesign";
import { connectionEngine } from "./connection";
import { foundationEngine } from "./foundation";
import { rebarEngine } from "./rebar";
import { anchorBoltEngine } from "./anchorBolt";
import { basePlateEngine } from "./basePlate";
import { model3dEngine } from "./model3d";
import { drawingEngine } from "./drawing";
import { bomEngine } from "./bom";
import { reportEngine } from "./report";

/**
 * Engine registry. The design pipeline resolves engines by id from here, so a
 * real engine can replace a stub without touching any UI code.
 */
const ENGINES: Record<EngineId, Engine> = {
  input: inputEngine,
  panelLibrary: panelLibraryEngine,
  arrayLayout: arrayLayoutEngine,
  geometry: geometryEngine,
  load: loadEngine,
  steelDesign: steelDesignEngine,
  connection: connectionEngine,
  foundation: foundationEngine,
  rebar: rebarEngine,
  anchorBolt: anchorBoltEngine,
  basePlate: basePlateEngine,
  model3d: model3dEngine,
  drawing: drawingEngine,
  bom: bomEngine,
  report: reportEngine,
};

export const engineRegistry = {
  get: (id: EngineId): Engine => ENGINES[id],
  list: (): Engine[] => Object.values(ENGINES),
};
