/** --------------------------------
 *  Types (Dimensions)
 *  -------------------------------- */
export type SurfaceId =
  | "S1" // walls
  | "S2" // ceiling
  | "S3" // trim/baseboards
  | "S4" // doors
  | "S5" // jambs
  | "S6" // cabinets
  | "S7" // built-ins
  | "S8" // rails
  | "S9" // accent wall
  | "S10" // bathroom/humidity
  | "S11" // siding
  | "S12" // brick/masonry paintable
  | "S13" // stucco
  | "S14" // fascia/soffit
  | "S15" // exterior trim
  | "S16" // garage door
  | "S17" // fence/deck
  | "S18"; // pergola/patio cover

export type UnitId = "U1" | "U2" | "U3" | "U4" | "U5" | "U6";
export type ScopeId =
  | "SC1"
  | "SC2"
  | "SC3"
  | "SC4"
  | "SC5"
  | "SC6"
  | "SC7"
  | "SC8"
  | "SC9"
  | "SC10"
  | "SC11"
  | "SC12"
  | "SC13";
export type SystemId =
  | "SYS1"
  | "SYS2"
  | "SYS3"
  | "SYS4"
  | "SYS5"
  | "SYS6"
  | "SYS7";
export type PrepId = "PR1" | "PR2" | "PR3" | "PR4";
export type SheenId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7";
export type MethodId = "M1" | "M2" | "M3" | "M4" | "M5";
export type AccessId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6";
export type OccupancyId = "H1" | "H2" | "H3" | "H4" | "H5";

export type ConditionId =
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "R1"
  | "R2"
  | "R3"
  | "K1"
  | "K2"
  | "K3"
  | "E1"
  | "E2"
  | "E3";

export type AddonId =
  | "AD1"
  | "AD2"
  | "AD3"
  | "AD4"
  | "AD5"
  | "AD6"
  | "AD7"
  | "AD8"
  | "AD9"
  | "AD10";

export type BundleId = "P1" | "P2" | "P3" | "P4" | "P5";

export type LineItem = {
  id: string;
  title: string;
  qty: number;
  unitPrice: number;
  note?: string;
};

export type EstimateState = {
  customerName: string;
  address: string;

  surface?: SurfaceId;
  unit?: UnitId;
  scope?: ScopeId;
  system?: SystemId;
  prep?: PrepId;
  sheen?: SheenId;
  method?: MethodId;
  access?: AccessId;
  occupancy?: OccupancyId;

  // quantity depends on unit: sqft, linear ft, items, sets, elevations, packages
  quantity: number;

  conditions: ConditionId[];
  addons: AddonId[];

  notes: string;
};
