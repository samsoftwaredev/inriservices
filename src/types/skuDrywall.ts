// estimateTypes.ts
export type RepairTypeId =
  `T${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20}`;
export type SizeBandId = "S0" | "S1" | "S2" | "S3" | "S4" | "S5" | "S6" | "S7";
export type OrientationId = "O1" | "O2" | "O3";
export type AccessId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6";
export type FinishId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7";
export type PaintScopeId =
  | "P0"
  | "P1"
  | "P2"
  | "P3"
  | "P4"
  | "P5"
  | "P6"
  | "P7";
export type ProtectionId = "H1" | "H2" | "H3" | "H4";
export type ModifierId =
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "W1"
  | "W2"
  | "W3"
  | "W4"
  | "R1"
  | "R2"
  | "TEX1"
  | "TEX2";

export interface EstimateSelection {
  repairType?: RepairTypeId;
  size?: SizeBandId;
  orientation?: OrientationId;
  access?: AccessId;
  finish?: FinishId;
  paintScope?: PaintScopeId;
  protection?: ProtectionId;
  modifiers: ModifierId[];
  quantity: number; // number of patches / sets
  notes?: string;
}

export interface LineItem {
  title: string;
  description?: string;
  amount: number;
}

export interface EstimateResult {
  sku: string;
  bundleId: "S1" | "S2" | "S3" | "S4" | "S5";
  laborSubtotal: number;
  modifiersTotal: number;
  subtotal: number;
  tax: number;
  total: number;
  items: LineItem[];
}
