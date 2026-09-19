import {
  Box,
  ClipboardList,
  FileText,
  Grid3x3,
  Info,
  LayoutGrid,
  ListChecks,
  Play,
  Settings,
  SunMedium,
  Table2,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import { t } from "@/data/strings/en";

export type StepKey =
  | "info"
  | "array"
  | "layout"
  | "preview"
  | "generate"
  | "results"
  | "model"
  | "drawings"
  | "bom"
  | "report"
  | "settings";

export interface WorkflowStep {
  key: StepKey;
  label: string;
  icon: LucideIcon;
  /** route path relative to /projects/$projectId */
  to: `/projects/$projectId/${StepKey}`;
  inWorkflow: boolean;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { key: "info", label: t.nav.info, icon: Info, to: "/projects/$projectId/info", inWorkflow: true },
  { key: "array", label: t.nav.array, icon: SunMedium, to: "/projects/$projectId/array", inWorkflow: true },
  { key: "layout", label: t.nav.layout, icon: LayoutGrid, to: "/projects/$projectId/layout", inWorkflow: true },
  { key: "preview", label: t.nav.preview, icon: Grid3x3, to: "/projects/$projectId/preview", inWorkflow: true },
  { key: "generate", label: t.nav.generate, icon: Play, to: "/projects/$projectId/generate", inWorkflow: true },
  { key: "results", label: t.nav.results, icon: ListChecks, to: "/projects/$projectId/results", inWorkflow: true },
  { key: "model", label: t.nav.model, icon: Box, to: "/projects/$projectId/model", inWorkflow: true },
  { key: "drawings", label: t.nav.drawings, icon: PenTool, to: "/projects/$projectId/drawings", inWorkflow: true },
  { key: "bom", label: t.nav.bom, icon: Table2, to: "/projects/$projectId/bom", inWorkflow: true },
  { key: "report", label: t.nav.report, icon: FileText, to: "/projects/$projectId/report", inWorkflow: true },
  { key: "settings", label: t.nav.settings, icon: Settings, to: "/projects/$projectId/settings", inWorkflow: false },
];

export const stepIndex = (key: StepKey) => WORKFLOW_STEPS.findIndex((s) => s.key === key);

// Keep ClipboardList referenced for future use in dashboard summaries.
export const MISC_ICONS = { ClipboardList };
