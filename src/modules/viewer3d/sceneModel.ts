import type { Project } from "@/types";
import { DESIGN_CONSTANTS } from "@/data/designConstants";
import { getPanel } from "@/data/panelLibrary";
import { deriveGeometry, getSelectedLayout } from "@/modules/model/derive";

/**
 * Builds a simplified parametric scene description from the project model.
 * This is the placeholder for the 3D Engine output. Units: metres.
 * Axes: X along table width, Y up, Z along slope direction (south = +Z).
 */
export interface Box3 {
  pos: [number, number, number];
  size: [number, number, number];
  rot?: [number, number, number];
}

export interface SceneModel {
  panels: Box3[];
  columns: Box3[];
  rafters: Box3[];
  purlins: Box3[];
  footings: Box3[];
  extent: number;
}

const DEG = Math.PI / 180;

export function buildSceneModel(project: Project): SceneModel | null {
  const layout = getSelectedLayout(project);
  const geo = deriveGeometry(project);
  if (!layout || !geo) return null;

  const panel = getPanel(project.array.panelId);
  const pw = panel.widthMm / 1000;
  const pl = panel.lengthMm / 1000;
  const pt = panel.thicknessMm / 1000;
  const gap = DESIGN_CONSTANTS.geometry.panelGapMm / 1000;
  const tilt = project.designConfiguration.tiltAngleDeg * DEG;
  const clear = DESIGN_CONSTANTS.geometry.frontClearanceM;
  const tableGap = DESIGN_CONSTANTS.geometry.tableGapM;

  const tableW = geo.tableWidthM;
  const slope = geo.tableDepthM; // along the slope
  const depthZ = slope * Math.cos(tilt);
  const rise = slope * Math.sin(tilt);

  const model: SceneModel = { panels: [], columns: [], rafters: [], purlins: [], footings: [], extent: 0 };
  const totalX = layout.tables * tableW + (layout.tables - 1) * tableGap;
  const x0 = -totalX / 2;

  const frames = geo.raftersPerTable;
  const colSec = 0.15;
  const memberSec = 0.1;
  const purlinSec = 0.06;

  for (let tIdx = 0; tIdx < layout.tables; tIdx++) {
    const tx = x0 + tIdx * (tableW + tableGap);
    // frames along X
    for (let f = 0; f < frames; f++) {
      const fx = tx + (frames === 1 ? tableW / 2 : (f * tableW) / (frames - 1));
      const zFront = depthZ / 2;
      const zRear = -depthZ / 2;
      const hFront = clear;
      const hRear = clear + rise;
      model.columns.push({ pos: [fx, hFront / 2, zFront], size: [colSec, hFront, colSec] });
      model.columns.push({ pos: [fx, hRear / 2, zRear], size: [colSec, hRear, colSec] });
      model.footings.push({ pos: [fx, -0.35, zFront], size: [0.9, 0.7, 0.9] });
      model.footings.push({ pos: [fx, -0.35, zRear], size: [0.9, 0.7, 0.9] });
      // rafter — inclined member from front top to rear top
      model.rafters.push({
        pos: [fx, clear + rise / 2 + memberSec / 2, 0],
        size: [memberSec, memberSec, slope + 0.2],
        rot: [tilt, 0, 0],
      });
    }
    // purlins across X at each panel row boundary (2 per row)
    for (let r = 0; r < layout.rows; r++) {
      for (const frac of [0.25, 0.75]) {
        const s = -slope / 2 + r * (pl + gap) + frac * pl; // along slope from centre
        const y = clear + rise / 2 + memberSec + purlinSec / 2 - s * Math.sin(tilt);
        const z = s * Math.cos(tilt);
        model.purlins.push({ pos: [tx + tableW / 2, y, z], size: [tableW + 0.1, purlinSec, purlinSec], rot: [tilt, 0, 0] });
      }
    }
    // panels
    for (let r = 0; r < layout.rows; r++) {
      for (let c = 0; c < layout.columns; c++) {
        const s = -slope / 2 + r * (pl + gap) + pl / 2;
        const y = clear + rise / 2 + memberSec + purlinSec + pt / 2 - s * Math.sin(tilt);
        const z = s * Math.cos(tilt);
        const x = tx + c * (pw + gap) + pw / 2;
        model.panels.push({ pos: [x, y, z], size: [pw - 0.01, pt, pl], rot: [tilt, 0, 0] });
      }
    }
  }
  model.extent = Math.max(totalX, depthZ, 6);
  return model;
}
