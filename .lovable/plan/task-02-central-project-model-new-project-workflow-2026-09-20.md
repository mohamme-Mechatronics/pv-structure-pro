# Task 02 — Central Project Model & New Project Workflow

No visual redesign. Colors, typography, sidebar, dashboard, cards, navigation, 3D viewer and page layouts stay exactly as approved. The one new screen (the creation wizard) is built from the existing cards, inputs and step styling.

## What changes

### 1. Project model completed
The project record already holds id, name, type, governorate, status, timestamps and the array inputs. Two gaps get closed:

- Each project stores its own **design configuration** (tilt angle, wind speed, steel/concrete/rebar grade, concrete cover, design codes, units, drawing size, foundation type), copied automatically from the central system constants when the project is created. Still read-only for the user — Project Settings keeps showing them exactly as it does now, just sourced from the project instead of the global table.
- The array keeps a single panel selection; panel power (580 / 650 / 770 W) is what the user picks, and all dimensions and technical properties stay in the central panel library, marked as mock.

Existing saved projects are upgraded in place on load, so nothing stored in the browser is lost.

### 2. New Project becomes a guided 5-step flow
Today "New Project" creates a project immediately with placeholder values. It becomes:

```text
Step 0  Structure type      (existing cards; Ground active, others Coming Soon)
Step 1  Project name
Step 2  Governorate
Step 3  Solar array         panel count, panel power, area width, area length
Step 4  Review              project summary before creation
Step 5  Create              -> stored, set active, opens Project Information
```

Back / Next controls reuse the existing stepper look. Next stays disabled until the current step is valid. Nothing is written to the store until the user confirms on Review.

### 3. Validation (input-level only, no engineering checks)
- Project name: required
- Governorate: required
- Panel count: required, positive whole number
- Panel power: one of 580 / 650 / 770
- Area width and length: positive numbers

The same rules run in the wizard and on the Project Information and Solar Array pages, shown as small inline messages under the field in the existing muted/destructive text style.

### 4. Reusable project summary
A single summary component showing project name, type, governorate, panel count, panel power, available area, selected layout and status. Used on the wizard Review step, and reused on Design Results and the Engineering Report where those pages currently repeat the same rows.

### 5. Single source of truth confirmed
Every project page continues to read the active project from the one store — no page-local project data. Pages are audited for any leftover values read from anywhere other than the project, and switched over. Persistence keeps using the existing browser storage, so a project survives navigation and refresh.

## Technical notes

- `src/types/index.ts`: add `DesignConfiguration` interface and `designConfiguration` field on `Project`; add `panelPowerW` mapping helper types for the panel library.
- `src/data/designConstants.ts`: export a `createDefaultDesignConfiguration()` factory returning the constants as a plain project-level object; `DESIGN_CONSTANT_ROWS` becomes a function of a project's config so Settings renders per-project values.
- `src/store/projectStore.ts`: `createProject(input)` takes the wizard payload (name, governorate, type, panelCount, panelId, area) instead of only a type, and stamps the default design configuration. Bump the persisted store to `ssdp-projects-v2` with a `migrate` that fills `designConfiguration` on existing records. `MOCK_PROJECTS` seeds get the same field.
- `src/lib/validation.ts` (new): pure zod schemas + field-level helpers shared by wizard and pages.
- `src/pages/NewProjectPage.tsx`: local wizard state (`useState`, not the store) with a step machine; commits once via `createProject` then `navigate` to `/projects/$projectId/info`.
- `src/components/common/ProjectSummary.tsx` (new): built on the existing `SpecTable`/card primitives.
- Panel selection maps power → `PanelId` through the existing `PANEL_LIBRARY`; no new panel data.
- No routes added or removed; no backend, auth, or new dependencies.

## Verification

Create a project through the wizard, walk every project page, change the panel count and confirm it updates everywhere it appears, refresh the browser to confirm the project persists, then run the type check and production build and clear any console errors.
