/**
 * Centralized system design constants.
 *
 * These are NOT user-editable from project input screens. They are read by the
 * engineering engines and exposed read-only in Project Settings. Future engine
 * configuration will update this object through the engineering system only.
 */
export const DESIGN_CONSTANTS = {
  geometry: {
    tiltAngleDeg: 15,
    frontClearanceM: 0.8,
    tableGapM: 0.5,
    panelGapMm: 20,
  },
  loads: {
    windSpeedMs: 38,
  },
  materials: {
    steelGrade: "S275",
    concreteGrade: "C25/30",
    rebarGrade: "B500",
    concreteCoverMm: 30,
  },
  codes: {
    loads: "ASCE 7-22",
    steel: "AISC 360-22",
  },
  units: {
    length: "mm",
    force: "kN",
    stress: "MPa",
  },
  drawings: {
    sheetSize: "A3" as const,
  },
  foundation: {
    type: "Isolated Footing",
  },
} as const;

export type DesignConstants = typeof DESIGN_CONSTANTS;

/** Flat list for read-only display in Project Settings and the report. */
export const DESIGN_CONSTANT_ROWS: { group: string; label: string; value: string }[] = [
  { group: "Geometry", label: "Tilt Angle", value: `${DESIGN_CONSTANTS.geometry.tiltAngleDeg}°` },
  { group: "Loads", label: "Basic Wind Speed", value: `${DESIGN_CONSTANTS.loads.windSpeedMs} m/s` },
  { group: "Materials", label: "Steel Grade", value: DESIGN_CONSTANTS.materials.steelGrade },
  { group: "Materials", label: "Concrete Grade", value: DESIGN_CONSTANTS.materials.concreteGrade },
  { group: "Materials", label: "Rebar Grade", value: DESIGN_CONSTANTS.materials.rebarGrade },
  { group: "Materials", label: "Concrete Cover", value: `${DESIGN_CONSTANTS.materials.concreteCoverMm} mm` },
  { group: "Design Codes", label: "Loads", value: DESIGN_CONSTANTS.codes.loads },
  { group: "Design Codes", label: "Steel", value: DESIGN_CONSTANTS.codes.steel },
  { group: "Units", label: "Length", value: DESIGN_CONSTANTS.units.length },
  { group: "Units", label: "Force", value: DESIGN_CONSTANTS.units.force },
  { group: "Units", label: "Stress", value: DESIGN_CONSTANTS.units.stress },
  { group: "Drawings", label: "Sheet Size", value: DESIGN_CONSTANTS.drawings.sheetSize },
  { group: "Foundation", label: "Foundation Type", value: DESIGN_CONSTANTS.foundation.type },
];
