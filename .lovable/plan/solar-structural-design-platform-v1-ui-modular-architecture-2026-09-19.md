# Solar Structural Design Platform — v1 (UI + Modular Architecture)

A professional engineering workspace for automated design of solar PV mounting structures. This version builds the complete navigation, the full mock workflow, the single parametric project model, and clean engine interfaces. No real engineering calculations, no fake PASS results.

## What the user will see

**Look and feel**: dark-by-default technical UI (CAD/structural-software style) with a light toggle. Monospace numerals for engineering values, dense but clean cards, tables, tabs, and status chips (`Ready`, `Pending`, `Not Calculated`, `Mock`). Font: IBM Plex Sans + IBM Plex Mono. Accent: a restrained engineering blue; amber reserved for "mock/preliminary" badges. No marketing sections, no chat UI.

**Shell**: collapsible left sidebar (icon-only mini mode on desktop, drawer on mobile) with a top bar showing project name, project type, governorate, and design status. Sidebar is split into two groups:
- Workspace: Dashboard, New Project
- Project (enabled once a project is open, ordered as the workflow): Project Information → Solar Array → Layout Selection → Structure Preview → Design Generation → Design Results → 3D Model → Drawings → BOM → Engineering Report → Project Settings

Each project screen has a footer stepper (Back / Next) so the main workflow can be followed linearly.

## Screens

1. **Dashboard** — New Project button, stats strip (projects, panels, designs generated), Recent Projects table: name, type, governorate, panel count, last modified, project status, design status. 4–5 mock projects.
2. **New Project** — four type cards: Ground Structure (active), Elevated Rooftop / Metal-Zinc Roof / Carport ("Coming Soon", disabled). Creates a project and continues.
3. **Project Information** — Project Name, Governorate dropdown (the 22 governorates of Yemen). No map/coordinates.
4. **Solar Array** — Number of panels, panel selector (580 W / 650 W / 770 W) fed from the Panel Library with a read-only spec card (marked MOCK DATA), Available Area width × length (m).
5. **Layout Selection** — mock candidate layouts (e.g. 2×6×4, 3×4×4, 4×3×4 for 48 panels), each with a 2D SVG array diagram, footprint dimensions and fit indicator vs. available area; single selection.
6. **Structure Preview** — React Three Fiber viewer (orbit: rotate/zoom/pan) rendering a simplified parametric structure from the selected layout: panels, columns, rafters, purlins, footings. Layer checkboxes: PV Panels ☑, Steel Structure ☑, Foundations ☑, Reinforcement ☐, Anchor Bolts ☐, Base Plates ☐ (last three render placeholders/no geometry yet).
7. **Design Generation** — Generate Design button; a pipeline runner steps through the 13 stages with mock timing and states (Queued / Running / Done). Banner states clearly that stages are simulated.
8. **Design Results** — results dashboard with cards per domain (Project Info, PV Array, Structure Geometry, Steel Members, Foundations, Anchor Bolts, Base Plates, Reinforcement). Derived geometry/array data is shown as `Ready`; engineering domains show `Not Calculated` / `Pending` — never PASS/FAIL.
9. **3D Model** — the full viewer (same component as preview) with layer panel and view presets (Iso, Plan, Front, Side) plus a "3D Engine not connected" notice.
10. **Drawings** — A3 sheet placeholders: General Arrangement, Plan, Elevation, Section, Foundation Detail, Base Plate Detail, Anchor Bolt Detail, Reinforcement Detail — each with a title block and "Drawing Engine pending".
11. **BOM** — table (Item, Description, Specification, Quantity, Unit, Remarks) with mock rows: PV Module, Column, Rafter, Purlin, Base Plate, Anchor Bolt, Concrete Foundation, Rebar. Quantities for panels/members derive from the project model; a "Preliminary / mock" banner is always shown.
12. **Engineering Report** — 13 numbered sections with a sticky table of contents; placeholder content per section, project info filled from the model.
13. **Project Settings** — read-only Design Constants panel (tilt, wind speed, grades, cover, codes, units, sheet size, foundation type) labelled "System constants — not editable here", plus project actions (rename, delete).

## Architecture (technical)

```text
src/
  routes/            TanStack file routes (thin wrappers over pages)
  pages/             one component per screen
  components/        layout (AppShell, AppSidebar, TopBar, WorkflowStepper),
                     ui (shadcn), common (StatusBadge, MockBanner, DataTable, SpecCard)
  modules/           feature modules per screen (forms, viewer, pipeline runner)
    viewer3d/        R3F Canvas, OrbitControls, layer system, parametric scene builders
  engines/           one folder per engine, each exporting an interface + placeholder impl
    registry.ts      engine registry (id, name, version, status: "stub" | "ready")
    types.ts         EngineContext, EngineResult<T>, EngineStatus
    input/ panelLibrary/ arrayLayout/ geometry/ load/ steelDesign/ connection/
    foundation/ rebar/ anchorBolt/ basePlate/ model3d/ drawing/ bom/ report/
  data/
    panelLibrary.ts  centralized mock panel library (580/650/770 W)
    governorates.ts  22 governorates
    mockProjects.ts  dashboard seeds
    designConstants.ts  centralized constants (tilt 15°, wind 38 m/s, S275, C25/30,
                     B500, cover 30 mm, ASCE 7-22, AISC 360-22, units mm/kN/MPa,
                     A3, Isolated Footing) — read-only from UI
    strings/en.ts    all UI text (RTL-ready; dir attribute driven by locale)
  types/             Project, PanelSpec, ArrayLayout, StructureGeometry, DesignRun,
                     StageStatus, BomItem, DrawingSheet, ReportSection
  utils/             formatting (units), ids, dates
  store/             zustand project store (single parametric model) persisted to localStorage
```

**Single parametric model**: one `Project` object in a zustand store. Screens never hold their own copies; derived views (layout candidates, geometry, 3D scene, BOM quantities, report data) are pure selectors/functions of the project. Changing panel count from 48 to 72 invalidates the selected layout, regenerates candidates, and re-derives preview/BOM automatically.

**Engine contract**: every engine implements `Engine<TInput, TOutput>` with `run(ctx): Promise<EngineResult<TOutput>>` and `status`. All 15 engines ship as stubs returning `{ status: "not_calculated" }`. The Design Generation pipeline is an ordered list of `{ stageId, engineId }`; each stage calls `registry.get(engineId).run()`, so a real engine replaces a stub with no UI changes.

**Dependencies to add**: zustand, three, @react-three/fiber, @react-three/drei, @types/three, lucide-react, shadcn components (sidebar, card, table, tabs, badge, button, input, select, checkbox, progress, dialog, tooltip, separator). 3D routes use `ssr: false`.

**Persistence**: local browser storage only for this version (no backend). Lovable Cloud can be added later for multi-user projects.

## Out of scope for v1
Real engineering calculations, actual drawing/report generation, PDF export, authentication, cloud storage, Arabic translation (only prepared for).
