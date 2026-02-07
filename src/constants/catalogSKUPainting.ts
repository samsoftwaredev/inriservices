import {
  AccessId,
  AddonId,
  BundleId,
  ConditionId,
  MethodId,
  OccupancyId,
  PrepId,
  ScopeId,
  SheenId,
  SurfaceId,
  SystemId,
  UnitId,
} from "@/types/skuPainting";

/** --------------------------------
 *  Catalog (labels + pricing knobs)
 *  -------------------------------- */
export const SURFACES: Array<{
  id: SurfaceId;
  label: string;
  group: "interior" | "exterior";
}> = [
  { id: "S1", label: "Walls", group: "interior" },
  { id: "S2", label: "Ceiling", group: "interior" },
  { id: "S3", label: "Trim/Baseboards", group: "interior" },
  { id: "S4", label: "Doors", group: "interior" },
  { id: "S5", label: "Door frames / jambs", group: "interior" },
  { id: "S6", label: "Cabinets (boxes + doors)", group: "interior" },
  { id: "S7", label: "Built-ins / shelving", group: "interior" },
  { id: "S8", label: "Stair rails / banisters", group: "interior" },
  { id: "S9", label: "Accent wall / feature wall", group: "interior" },
  { id: "S10", label: "Bathroom / high-humidity areas", group: "interior" },

  { id: "S11", label: "Siding (wood/fiber cement/vinyl)", group: "exterior" },
  {
    id: "S12",
    label: "Brick (painted) / masonry (paintable)",
    group: "exterior",
  },
  { id: "S13", label: "Stucco", group: "exterior" },
  { id: "S14", label: "Fascia/soffit", group: "exterior" },
  { id: "S15", label: "Exterior trim", group: "exterior" },
  { id: "S16", label: "Garage door", group: "exterior" },
  { id: "S17", label: "Fence / deck staining/painting", group: "exterior" },
  { id: "S18", label: "Pergola / patio cover", group: "exterior" },
];

export const UNITS: Array<{ id: UnitId; label: string; qtyLabel: string }> = [
  { id: "U1", label: "ft²", qtyLabel: "Square feet" },
  { id: "U2", label: "linear ft", qtyLabel: "Linear feet" },
  { id: "U3", label: "per item", qtyLabel: "Items" },
  { id: "U4", label: "per set", qtyLabel: "Sets" },
  { id: "U5", label: "per elevation", qtyLabel: "Elevations" },
  { id: "U6", label: "package", qtyLabel: "Packages" },
];

export const SCOPES: Array<{
  id: ScopeId;
  label: string;
  group: "interior" | "exterior";
}> = [
  { id: "SC1", label: "One wall", group: "interior" },
  { id: "SC2", label: "All walls (room)", group: "interior" },
  { id: "SC3", label: "Walls + ceiling (room)", group: "interior" },
  { id: "SC4", label: "Trim only (room)", group: "interior" },
  { id: "SC5", label: "Walls + trim (room)", group: "interior" },
  { id: "SC6", label: "Full interior (whole house)", group: "interior" },
  { id: "SC7", label: "Move-in / vacant repaint", group: "interior" },
  { id: "SC8", label: "Rental turn (fast turnaround)", group: "interior" },

  { id: "SC9", label: "Full exterior repaint", group: "exterior" },
  { id: "SC10", label: "Trim only", group: "exterior" },
  { id: "SC11", label: "Siding only", group: "exterior" },
  { id: "SC12", label: "1–2 elevations", group: "exterior" },
  { id: "SC13", label: "Fence/deck only", group: "exterior" },
];

export const SYSTEMS: Array<{ id: SystemId; label: string }> = [
  { id: "SYS1", label: "2 coats (no primer included)" },
  { id: "SYS2", label: "Spot-prime + 2 coats" },
  { id: "SYS3", label: "Full prime + 2 coats" },
  { id: "SYS4", label: "Stain-block prime + 2 coats" },
  { id: "SYS5", label: "Bonding primer + 2 coats (slick surfaces/cabinets)" },
  { id: "SYS6", label: "Elastomeric system (some exterior stucco/masonry)" },
  { id: "SYS7", label: "Stain/Sealer system (fence/deck)" },
];

export const PREP: Array<{ id: PrepId; label: string; bundle: BundleId }> = [
  { id: "PR1", label: "Light", bundle: "P1" },
  { id: "PR2", label: "Standard", bundle: "P2" },
  { id: "PR3", label: "Heavy", bundle: "P3" },
  { id: "PR4", label: "Restoration", bundle: "P4" },
];

export const SHEEN: Array<{ id: SheenId; label: string }> = [
  { id: "F1", label: "Flat" },
  { id: "F2", label: "Matte" },
  { id: "F3", label: "Eggshell" },
  { id: "F4", label: "Satin" },
  { id: "F5", label: "Semi-gloss" },
  { id: "F6", label: "Gloss" },
  { id: "F7", label: "Specialty" },
];

export const METHODS: Array<{ id: MethodId; label: string }> = [
  { id: "M1", label: "Brush & roll" },
  { id: "M2", label: "Spray + backroll (exterior)" },
  { id: "M3", label: "Spray only" },
  { id: "M4", label: "Spray cabinets (masking/booth setup)" },
  { id: "M5", label: "Hybrid (spray trim/doors, roll walls)" },
];

export const ACCESS: Array<{ id: AccessId; label: string; mult: number }> = [
  { id: "A1", label: "0–8 ft", mult: 1.0 },
  { id: "A2", label: "9–12 ft", mult: 1.15 },
  { id: "A3", label: "13–18 ft / vaulted", mult: 1.35 },
  { id: "A4", label: "Stairwell / angled", mult: 1.45 },
  { id: "A5", label: "Two-story exterior", mult: 1.55 },
  { id: "A6", label: "Difficult access (lot lines/landscaping)", mult: 1.35 },
];

export const OCCUPANCY: Array<{
  id: OccupancyId;
  label: string;
  mult: number;
}> = [
  { id: "H1", label: "Vacant", mult: 1.0 },
  { id: "H2", label: "Furnished", mult: 1.1 },
  { id: "H3", label: "Occupied household", mult: 1.2 },
  { id: "H4", label: "Dust-sensitive containment", mult: 1.35 },
  { id: "H5", label: "Pet-heavy home", mult: 1.2 },
];

export const CONDITIONS: Array<{
  id: ConditionId;
  label: string;
  adder: number;
  note?: string;
}> = [
  { id: "C1", label: "Glossy surface (degloss/bonding primer)", adder: 60 },
  { id: "C2", label: "Chalky exterior (wash + primer)", adder: 120 },
  { id: "C3", label: "Peeling paint (scrape/sand heavy)", adder: 180 },
  { id: "C4", label: "Previously smoke-damaged", adder: 150 },
  { id: "C5", label: "Heavy grease (kitchen cabinets/walls)", adder: 120 },

  {
    id: "R1",
    label: "Minor drywall patching included (up to X)",
    adder: 0,
    note: "Included",
  },
  {
    id: "R2",
    label: "Significant drywall repair needed",
    adder: 0,
    note: "Separate line item",
  },
  { id: "R3", label: "Wood rot repair", adder: 0, note: "Separate line item" },

  { id: "K1", label: "Deep reds/yellows (extra coat likely)", adder: 90 },
  { id: "K2", label: "Drastic color change (full prime)", adder: 140 },
  { id: "K3", label: "High-contrast cut-ins (extra labor)", adder: 80 },

  { id: "E1", label: "Pressure wash required", adder: 150 },
  { id: "E2", label: "Caulk windows/trim heavy", adder: 140 },
  { id: "E3", label: "Rusted metal (rust inhibitor system)", adder: 160 },
];

export const ADDONS: Array<{ id: AddonId; label: string; adder: number }> = [
  { id: "AD1", label: "Remove/install outlet covers", adder: 35 },
  { id: "AD2", label: "Furniture moving (light)", adder: 75 },
  { id: "AD3", label: "Furniture moving (heavy)", adder: 175 },
  { id: "AD4", label: "Masking plastic full-room tent", adder: 220 },
  { id: "AD5", label: "Popcorn removal coordination", adder: 0 }, // usually separate project
  { id: "AD6", label: "Same-day turnaround premium", adder: 150 },

  { id: "AD7", label: "Pressure wash (add-on)", adder: 175 },
  { id: "AD8", label: "Landscaping protection", adder: 120 },
  { id: "AD9", label: "Minor carpentry touch-ups", adder: 90 },
  { id: "AD10", label: "Gutter whitening/cleanup add-on", adder: 120 },
];
