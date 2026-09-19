import { format, formatDistanceToNow } from "date-fns";

export const fmtDate = (iso: string) => format(new Date(iso), "dd MMM yyyy");
export const fmtRelative = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });
export const fmtNum = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
export const fmtM = (n: number) => `${fmtNum(n, 2)} m`;
export const fmtMm = (n: number) => `${fmtNum(n, 0)} mm`;
export const fmtKWp = (w: number) => `${fmtNum(w / 1000, 2)} kWp`;

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
