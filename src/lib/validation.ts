import type { PanelId } from "@/types";
import { PANEL_LIST } from "@/data/panelLibrary";

/**
 * Basic input validation only — no engineering validation.
 * Shared by the New Project wizard and the project input pages so both
 * enforce exactly the same rules against the single project model.
 */

export const PANEL_POWERS = PANEL_LIST.map((p) => p.powerW);

export const validateProjectName = (v: string): string | null =>
  v.trim().length === 0 ? "Project name is required." : null;

export const validateGovernorate = (v: string | null): string | null =>
  !v ? "Governorate is required." : null;

export const validatePanelCount = (v: number): string | null => {
  if (!Number.isFinite(v)) return "Panel count is required.";
  if (!Number.isInteger(v)) return "Panel count must be a whole number.";
  if (v <= 0) return "Panel count must be greater than zero.";
  return null;
};

export const validatePanelPower = (v: number): string | null =>
  PANEL_POWERS.includes(v) ? null : `Panel power must be one of ${PANEL_POWERS.join(" / ")} W.`;

export const validatePanelId = (v: PanelId | null): string | null =>
  v && PANEL_LIST.some((p) => p.id === v) ? null : "Select a panel power.";

export const validateDimension = (v: number, label: string): string | null => {
  if (!Number.isFinite(v)) return `${label} is required.`;
  if (v <= 0) return `${label} must be greater than zero.`;
  return null;
};

export const validateAreaWidth = (v: number) => validateDimension(v, "Available area width");
export const validateAreaLength = (v: number) => validateDimension(v, "Available area length");
