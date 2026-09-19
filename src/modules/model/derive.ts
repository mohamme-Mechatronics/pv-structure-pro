import type { ArrayLayout, BomItem, Project, StructureGeometry } from "@/types";
import { DESIGN_CONSTANTS } from "@/data/designConstants";
import { getPanel } from "@/data/panelLibrary";

/*
 * Pure derivations from the single parametric project model.
 * Everything here is MOCK/preliminary and is intended to be replaced by the
 * Array Layout, Geometry and BOM engines. Because all screens call these
 * functions with the same `Project`, changing an input (e.g. 48 → 72 panels)
 * updates every dependent view automatically.
 */

const DEG = Math.PI / 180;

/** MOCK layout generator — enumerates rows × columns × tables combos. */
export function deriveLayoutCandidates(project: Project): ArrayLayout[] {
  const { panelCount, panelId, area } = project.array;
  const panel = getPanel(panelId);
  const gap = DESIGN_CONSTANTS.geometry.panelGapMm / 1000;
  const tableGap = DESIGN_CONSTANTS.geometry.tableGapM;
  const tilt = DESIGN_CONSTANTS.geometry.tiltAngleDeg * DEG;
  const pw = panel.widthMm / 1000; // portrait: width along table
  const pl = panel.lengthMm / 1000; // portrait: length up the slope

  const out: ArrayLayout[] = [];
  for (const rows of [2, 3, 4]) {
    for (let tables = 1; tables <= 8; tables++) {
      const perTable = panelCount / tables;
      if (!Number.isInteger(perTable)) continue;
      const columns = perTable / rows;
      if (!Number.isInteger(columns) || columns < 2 || columns > 30) continue;
      const tableWidth = columns * pw + (columns - 1) * gap;
      const tableDepth = rows * pl * Math.cos(tilt) + (rows - 1) * gap;
      // tables placed side by side along the length of the site
      const footprintLength = tables * tableWidth + (tables - 1) * tableGap;
      const footprintWidth = tableDepth + DESIGN_CONSTANTS.geometry.frontClearanceM;
      const fits =
        (footprintLength <= area.lengthM && footprintWidth <= area.widthM) ||
        (footprintLength <= area.widthM && footprintWidth <= area.lengthM);
      const utilisation = Math.min(1, (footprintLength * footprintWidth) / (area.lengthM * area.widthM));
      out.push({
        id: `L-${rows}x${columns}x${tables}`,
        rows,
        columns,
        tables,
        label: `${rows} × ${columns} × ${tables}`,
        footprintWidthM: footprintWidth,
        footprintLengthM: footprintLength,
        fitsArea: fits,
        utilisation,
        isMock: true,
      });
    }
  }
  return out
    .sort((a, b) => Number(b.fitsArea) - Number(a.fitsArea) || a.tables - b.tables || a.rows - b.rows)
    .slice(0, 6);
}

export function getSelectedLayout(project: Project): ArrayLayout | null {
  if (!project.selectedLayoutId) return null;
  return deriveLayoutCandidates(project).find((l) => l.id === project.selectedLayoutId) ?? null;
}

/** MOCK geometry derivation — will be replaced by the Geometry Engine. */
export function deriveGeometry(project: Project): StructureGeometry | null {
  const layout = getSelectedLayout(project);
  if (!layout) return null;
  const panel = getPanel(project.array.panelId);
  const gap = DESIGN_CONSTANTS.geometry.panelGapMm / 1000;
  const tableWidth = layout.columns * (panel.widthMm / 1000) + (layout.columns - 1) * gap;
  const tableDepth = layout.rows * (panel.lengthMm / 1000) + (layout.rows - 1) * gap;
  const frames = Math.max(2, Math.ceil(tableWidth / 3.2) + 1); // frame spacing ≤ ~3.2 m (mock)
  const columnsPerTable = frames * 2; // front + rear column per frame
  const raftersPerTable = frames;
  const purlinsPerTable = layout.rows * 2;
  return {
    tableCount: layout.tables,
    tableWidthM: tableWidth,
    tableDepthM: tableDepth,
    tiltDeg: DESIGN_CONSTANTS.geometry.tiltAngleDeg,
    columnsPerTable,
    raftersPerTable,
    purlinsPerTable,
    columnsTotal: columnsPerTable * layout.tables,
    raftersTotal: raftersPerTable * layout.tables,
    purlinsTotal: purlinsPerTable * layout.tables,
    footingsTotal: columnsPerTable * layout.tables,
    frontClearanceM: DESIGN_CONSTANTS.geometry.frontClearanceM,
    isMock: true,
  };
}

/** MOCK BOM — quantities follow the model; specifications are placeholders. */
export function deriveBom(project: Project): BomItem[] {
  const panel = getPanel(project.array.panelId);
  const g = deriveGeometry(project);
  const m = DESIGN_CONSTANTS.materials;
  const na = "Pending engine";
  return [
    {
      item: "PV Module",
      description: panel.name,
      specification: `${panel.powerW} W · ${panel.lengthMm}×${panel.widthMm}×${panel.thicknessMm} mm`,
      quantity: project.array.panelCount,
      unit: "no.",
      remarks: "Panel Library (mock dimensions)",
    },
    { item: "Column", description: "Steel column", specification: `Section TBD · ${m.steelGrade}`, quantity: g?.columnsTotal ?? null, unit: "no.", remarks: na },
    { item: "Rafter", description: "Inclined rafter", specification: `Section TBD · ${m.steelGrade}`, quantity: g?.raftersTotal ?? null, unit: "no.", remarks: na },
    { item: "Purlin", description: "Module support purlin", specification: `Section TBD · ${m.steelGrade}`, quantity: g?.purlinsTotal ?? null, unit: "no.", remarks: na },
    { item: "Base Plate", description: "Column base plate", specification: `Size TBD · ${m.steelGrade}`, quantity: g?.columnsTotal ?? null, unit: "no.", remarks: na },
    { item: "Anchor Bolt", description: "Cast-in anchor bolt", specification: "Dia./grade TBD", quantity: g ? g.columnsTotal * 4 : null, unit: "no.", remarks: "4 per base assumed (mock)" },
    { item: "Concrete Foundation", description: DESIGN_CONSTANTS.foundation.type, specification: `${m.concreteGrade} · size TBD`, quantity: g?.footingsTotal ?? null, unit: "no.", remarks: na },
    { item: "Rebar", description: "Footing reinforcement", specification: `${m.rebarGrade} · cover ${m.concreteCoverMm} mm`, quantity: null, unit: "kg", remarks: na },
  ];
}

export function deriveArrayPowerW(project: Project) {
  return getPanel(project.array.panelId).powerW * project.array.panelCount;
}
