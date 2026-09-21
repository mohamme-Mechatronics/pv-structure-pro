# Task 03 — Panel Library + Automatic Array/Layout Engine

Replace the mock layout enumerator with a real, deterministic geometric layout engine driven by a centralized panel library with real manufacturer dimensions. No visual redesign, no structural calculations.

## 1. Panel Library with real data

`src/data/panelLibrary.ts` becomes the single source of panel records:

- `PV-580` — JA Solar, JAM78S30 580-605/MR, 580 W, 2465 × 1134 × 35 mm, 31.1 kg
- `PV-650` — LONGi, LR7-72HVD-650M, 650 W, 2382 × 1134 × 30 mm, 32.5 kg
- `PV-770` — AIKO, Stellar, AIKO-A770-GRH78Dw, 770 W, 2465 × 1303 × 33 mm, 39.8 kg

Each record gains `manufacturer`, `model`, `series?`, and `source` metadata. Dimensions are real, so they are no longer flagged as mock; frame/mounting details stay marked preliminary. Projects keep storing only the panel ID — every module resolves dimensions through the library.

## 2. Layout constants

Add to the centralized design constants (no duplicates anywhere else):

- `DEFAULT_ROW_SPACING_MM = 1200`
- `DEFAULT_PANEL_GAP_MM = 20` (replaces the existing scattered 20 mm value)
- `DEFAULT_EDGE_CLEARANCE_MM = 50`

## 3. Layout engine (`src/engines/arrayLayout/`)

Pure TypeScript, no React imports.

- `factorPairs(n)` — all `rows × panelsPerRow` pairs where the product equals the requested count, generated algorithmically for any positive integer (no special cases).
- `generateLayoutOptions(input)` → `ArrayLayoutResult`, where input carries requested panel count, panel ID + resolved dimensions, available width/length (mm), orientation, panel gap, row spacing, edge clearance.
- Portrait convention: panel length is vertical, width is horizontal.
  - `arrayWidth = panelsPerRow × panelWidth + (panelsPerRow − 1) × panelGap + 2 × edgeClearance`
  - `arrayLength = rows × panelLength + (rows − 1) × rowSpacing + 2 × edgeClearance`
- Feasibility: both dimensions within the available area; otherwise `feasible: false` with a specific reason naming width, length, or both.
- `utilization = arrayArea / availableArea × 100`, labelled purely as geometric.
- Recommendation: deterministic rule — among feasible options, highest utilization that stays within the area, tie-broken by aspect ratio closest to the site, then fewest rows. No engineering claims.
- Both single row (`rows = 1`) and multiple rows come from the same algorithm; all candidates are returned, feasible and infeasible, sorted feasible-first.
- The existing stub engine wrapper is replaced by this real implementation and stays registered under the same engine id.

## 4. Data model

New types in `src/types/`: `LayoutOption` (id, rows, panelsPerRow, totalPanels, arrayWidthMm, arrayLengthMm, orientation, utilization, feasible, reason, rowSpacingMm, panelGapMm, edgeClearanceMm) and `ArrayLayoutResult` (requestedPanelCount, panelId, availableAreaWidthMm, availableAreaLengthMm, options, recommendedId).

The project stores the full selected layout snapshot (not just an id) so downstream pages can reproduce it. The existing `selectedLayoutId` field is kept in sync for compatibility, and a store migration (version bump) converts Task 02 projects: old layout ids are dropped and the layout simply needs reselecting — existing projects keep loading without errors.

## 5. Store and invalidation

`selectLayout` stores the whole `LayoutOption`. On any change to panel count, panel type, or available area, the store clears the selected layout when `selectedLayout.totalPanels !== panelCount`, the panel id differs, or the stored dimensions no longer match — downstream design status becomes outdated, exactly as today. Options are computed on render from current project state, so they regenerate with no reload and never go stale.

## 6. Pages (data only, no redesign)

- **Layout Selection** calls `generateLayoutOptions()` with live project data. Existing cards keep their look; their fields now show Layout `R × P`, Panels, Rows, Panels/Row, Array Width, Array Length, Utilization, Row Spacing, Panel Gap, Edge Clearance, and Feasible / Not Feasible with reason. Header text reads "Preliminary Layout". Single Row / Multiple Rows is shown from the rows value.
- **Layout diagram** renders rows × panelsPerRow instead of rows × columns × tables.
- **Structure Preview / 3D / Geometry / BOM / Report / Results / Project Summary** keep working by reading the selected layout from the project through the same adapter; geometry treats each row as a table row. No layout logic in components.

## 7. Tests

Add Vitest (dev dependency only) with `src/engines/arrayLayout/layoutEngine.test.ts` covering: 24/48/72 panel factor generation, `rows × panelsPerRow === requestedPanelCount` for every candidate, single-row and multi-row dimensions, spacing contributions of `(rows − 1) × 1200`, `(panelsPerRow − 1) × 20`, `2 × 50` edge clearance, sufficient vs insufficient area with reasons, utilization math, and the same 48-panel case across 580/650/770 W producing different dimensions.

## 8. Verification

Type check, Vitest run, production build, then a browser pass: create a project, select each panel power, check layouts regenerate on panel count / panel / area changes, confirm 48→72 invalidates the selection, confirm persistence after refresh, and confirm no new console errors.

## Out of scope

No structural, wind, foundation, rebar, anchor, or base plate calculations; no landscape orientation UI; no backend, auth, or new project types; no visual redesign.
