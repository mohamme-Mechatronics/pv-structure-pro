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

/**
 * Factory stamping the system constants onto a new project.
 * Every project carries its own immutable copy so future engine versions can
 * change the constants without rewriting existing projects.
 */
export function createDefaultDesignConfiguration(): DesignConfiguration {
  return {
    tiltAngleDeg: DESIGN_CONSTANTS.geometry.tiltAngleDeg,
    windSpeedMs: DESIGN_CONSTANTS.loads.windSpeedMs,
    steelGrade: DESIGN_CONSTANTS.materials.steelGrade,
    concreteGrade: DESIGN_CONSTANTS.materials.concreteGrade,
    rebarGrade: DESIGN_CONSTANTS.materials.rebarGrade,
    concreteCoverMm: DESIGN_CONSTANTS.materials.concreteCoverMm,
    designCodes: { loads: DESIGN_CONSTANTS.codes.loads, steel: DESIGN_CONSTANTS.codes.steel },
    units: { ...DESIGN_CONSTANTS.units },
    drawingSize: DESIGN_CONSTANTS.drawings.sheetSize,
    foundationType: DESIGN_CONSTANTS.foundation.type,
  };
}

/** Flat list for read-only display in Project Settings and the report. */
export function designConstantRows(c: DesignConfiguration): { group: string; label: string; value: string }[] {
  return [
    { group: "Geometry", label: "Tilt Angle", value: `${c.tiltAngleDeg}°` },
    { group: "Loads", label: "Basic Wind Speed", value: `${c.windSpeedMs} m/s` },
    { group: "Materials", label: "Steel Grade", value: c.steelGrade },
    { group: "Materials", label: "Concrete Grade", value: c.concreteGrade },
    { group: "Materials", label: "Rebar Grade", value: c.rebarGrade },
    { group: "Materials", label: "Concrete Cover", value: `${c.concreteCoverMm} mm` },
    { group: "Design Codes", label: "Loads", value: c.designCodes.loads },
    { group: "Design Codes", label: "Steel", value: c.designCodes.steel },
    { group: "Units", label: "Length", value: c.units.length },
    { group: "Units", label: "Force", value: c.units.force },
    { group: "Units", label: "Stress", value: c.units.stress },
    { group: "Drawings", label: "Sheet Size", value: c.drawingSize },
    { group: "Foundation", label: "Foundation Type", value: c.foundationType },
  ];
}
