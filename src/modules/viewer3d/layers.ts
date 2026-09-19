export type LayerKey = "panels" | "steel" | "foundations" | "reinforcement" | "anchorBolts" | "basePlates";

export interface LayerDef {
  key: LayerKey;
  label: string;
  defaultOn: boolean;
  /** true when the 3D Engine will supply geometry later — no geometry today */
  pendingEngine: boolean;
}

export const LAYERS: LayerDef[] = [
  { key: "panels", label: "PV Panels", defaultOn: true, pendingEngine: false },
  { key: "steel", label: "Steel Structure", defaultOn: true, pendingEngine: false },
  { key: "foundations", label: "Foundations", defaultOn: true, pendingEngine: false },
  { key: "reinforcement", label: "Reinforcement", defaultOn: false, pendingEngine: true },
  { key: "anchorBolts", label: "Anchor Bolts", defaultOn: false, pendingEngine: true },
  { key: "basePlates", label: "Base Plates", defaultOn: false, pendingEngine: true },
];

export type LayerState = Record<LayerKey, boolean>;

export const defaultLayerState = (): LayerState =>
  Object.fromEntries(LAYERS.map((l) => [l.key, l.defaultOn])) as LayerState;
