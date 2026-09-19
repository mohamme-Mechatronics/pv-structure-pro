import type { PanelId, PanelSpec } from "@/types";

/**
 * Centralized Panel Library.
 *
 * !!! MOCK DATA !!!
 * All dimensions, weights and mounting values below are placeholders.
 * Real manufacturer datasheet values will replace them later through the
 * Panel Library Engine. The UI must never ask the user for these values.
 */
export const PANEL_LIBRARY: Record<PanelId, PanelSpec> = {
  "PV-580": {
    id: "PV-580",
    name: "580 W Module",
    powerW: 580,
    lengthMm: 2278,
    widthMm: 1134,
    thicknessMm: 35,
    weightKg: 28.5,
    frame: { heightMm: 35, widthMm: 30, material: "Anodised aluminium" },
    mounting: { clampZoneMm: [400, 600], clampType: "Mid/End clamp", mountingHoles: 8 },
    isMock: true,
  },
  "PV-650": {
    id: "PV-650",
    name: "650 W Module",
    powerW: 650,
    lengthMm: 2384,
    widthMm: 1303,
    thicknessMm: 35,
    weightKg: 34.0,
    frame: { heightMm: 35, widthMm: 30, material: "Anodised aluminium" },
    mounting: { clampZoneMm: [400, 650], clampType: "Mid/End clamp", mountingHoles: 8 },
    isMock: true,
  },
  "PV-770": {
    id: "PV-770",
    name: "770 W Module",
    powerW: 770,
    lengthMm: 2384,
    widthMm: 1303,
    thicknessMm: 33,
    weightKg: 38.0,
    frame: { heightMm: 33, widthMm: 30, material: "Anodised aluminium" },
    mounting: { clampZoneMm: [400, 650], clampType: "Mid/End clamp", mountingHoles: 8 },
    isMock: true,
  },
};

export const PANEL_LIST: PanelSpec[] = Object.values(PANEL_LIBRARY);

export const getPanel = (id: PanelId): PanelSpec => PANEL_LIBRARY[id];
