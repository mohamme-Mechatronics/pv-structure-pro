/**
 * All UI text lives here so an Arabic (RTL) locale can be added later.
 * Locale direction is applied on <html dir> from `locale.dir`.
 */
export const en = {
  locale: { code: "en", dir: "ltr" as const },
  app: { name: "Solar Structural Design Platform", short: "SSDP", version: "v0.1 · UI preview" },
  nav: {
    workspace: "Workspace",
    project: "Project",
    dashboard: "Dashboard",
    newProject: "New Project",
    info: "Project Information",
    array: "Solar Array",
    layout: "Layout Selection",
    preview: "Structure Preview",
    generate: "Design Generation",
    results: "Design Results",
    model: "3D Model",
    drawings: "Drawings",
    bom: "BOM",
    report: "Engineering Report",
    settings: "Project Settings",
  },
  status: {
    ready: "Ready",
    pending: "Pending",
    not_calculated: "Not Calculated",
    mock: "Mock",
    draft: "Draft",
    in_progress: "In Progress",
    designed: "Designed",
    not_generated: "Not Generated",
    generating: "Generating",
    generated: "Generated",
    outdated: "Outdated",
    queued: "Queued",
    running: "Running",
    done: "Done",
    skipped: "Skipped",
    comingSoon: "Coming Soon",
    active: "Active",
  },
  projectTypes: {
    ground: "Ground Structure",
    elevated_rooftop: "Elevated Rooftop",
    metal_roof: "Metal / Zinc Roof",
    carport: "Carport",
  },
  common: {
    back: "Back",
    next: "Next",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    noProject: "No project open",
    mockBanner: "Preliminary / mock data — engineering engines not yet connected.",
    engineNotConnected: "Engine not connected",
  },
};

export type Strings = typeof en;
export const t = en;
