// Central domain types for the single parametric project model.
// Every screen, engine and derived view reads from these types — never duplicate them.

export type ProjectType = "ground" | "elevated_rooftop" | "metal_roof" | "carport";
export type ProjectStatus = "draft" | "in_progress" | "designed";
export type DesignStatus = "not_generated" | "generating" | "generated" | "outdated";

export type PanelId = "PV-580" | "PV-650" | "PV-770";

export interface PanelSpec {
  id: PanelId;
  name: string;
  powerW: number;
  /** mm — MOCK placeholder */
  lengthMm: number;
  /** mm — MOCK placeholder */
  widthMm: number;
  /** mm — MOCK placeholder */
  thicknessMm: number;
  /** kg — MOCK placeholder */
  weightKg: number;
  frame: { heightMm: number; widthMm: number; material: string };
  mounting: { clampZoneMm: [number, number]; clampType: string; mountingHoles: number };
  isMock: boolean;
}

export interface AvailableArea {
  /** m */
  widthM: number;
  /** m */
  lengthM: number;
}

export interface ArrayInput {
  panelCount: number;
  panelId: PanelId;
  area: AvailableArea;
}

/** rows × columns × tables — e.g. 2 × 6 × 4 */
export interface ArrayLayout {
  id: string;
  rows: number;
  columns: number;
  tables: number;
  label: string;
  /** m — derived footprint */
  footprintWidthM: number;
  footprintLengthM: number;
  fitsArea: boolean;
  utilisation: number;
  isMock: boolean;
}

export interface StructureGeometry {
  tableCount: number;
  tableWidthM: number;
  tableDepthM: number;
  tiltDeg: number;
  columnsPerTable: number;
  raftersPerTable: number;
  purlinsPerTable: number;
  footingsTotal: number;
  columnsTotal: number;
  raftersTotal: number;
  purlinsTotal: number;
  frontClearanceM: number;
  isMock: boolean;
}

export type StageState = "queued" | "running" | "done" | "skipped";

export interface StageRun {
  stageId: string;
  engineId: string;
  label: string;
  state: StageState;
  /** ms */
  durationMs?: number;
  note?: string;
}

export interface DesignRun {
  id: string;
  startedAt: string;
  finishedAt?: string;
  stages: StageRun[];
}

/**
 * Per-project snapshot of the system design constants.
 * Stamped automatically at project creation — never entered by the user.
 */
export interface DesignConfiguration {
  tiltAngleDeg: number;
  windSpeedMs: number;
  steelGrade: string;
  concreteGrade: string;
  rebarGrade: string;
  concreteCoverMm: number;
  designCodes: { loads: string; steel: string };
  units: { length: string; force: string; stress: string };
  drawingSize: "A3";
  foundationType: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  governorate: string | null;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  designStatus: DesignStatus;
  array: ArrayInput;
  designConfiguration: DesignConfiguration;
  selectedLayoutId: string | null;
  designRun: DesignRun | null;
}

/** Payload collected by the New Project wizard. */
export interface NewProjectInput {
  name: string;
  type: ProjectType;
  governorate: string;
  panelCount: number;
  panelId: PanelId;
  area: AvailableArea;
}

export type ResultStatus = "ready" | "pending" | "not_calculated" | "mock";

export interface BomItem {
  item: string;
  description: string;
  specification: string;
  quantity: number | null;
  unit: string;
  remarks: string;
}

export interface DrawingSheet {
  id: string;
  number: string;
  title: string;
  scale: string;
  sheetSize: "A3";
  status: ResultStatus;
}

export interface ReportSection {
  id: string;
  number: number;
  title: string;
  engineId: string;
  status: ResultStatus;
}
