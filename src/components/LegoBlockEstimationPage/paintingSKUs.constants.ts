// Most common “real-world” SKU presets you’ll quote all the time.
// Use these to power a “Quick Templates” dropdown that auto-fills the form.
//
// SKU format:
// (Surface) + (Unit) + (Scope) + (System) + (Prep) + (Sheen) + (Method) + (Access) + (Occupancy)
// + optional (ConditionModifiers) + optional (+AddOns)

export type SkuPreset = {
  id: string;
  name: string;
  sku: string;
  // Optional: pre-fill dimensions so you don’t have to parse sku later.
  dims?: {
    surface: string;
    unit: string;
    scope: string;
    system: string;
    prep: string;
    sheen: string;
    method: string;
    access: string;
    occupancy: string;
    conditions?: string[];
    addons?: string[];
  };
};

// ✅ Common combos (Dallas / real residential workflows)
export const COMMON_PAINTING_SKU_PRESETS: SkuPreset[] = [
  // -------------------------
  // INTERIOR WALLS (most common)
  // -------------------------
  {
    id: "int-walls-room-standard",
    name: "Interior Walls • Room • Standard (most common)",
    sku: "S1 U1 SC2 SYS2 PR2 F3 M1 A1 H2",
    dims: {
      surface: "S1",
      unit: "U1",
      scope: "SC2",
      system: "SYS2",
      prep: "PR2",
      sheen: "F3", // Eggshell
      method: "M1",
      access: "A1",
      occupancy: "H2",
    },
  },
  {
    id: "int-walls-one-wall-standard",
    name: "Interior • One Wall • Standard",
    sku: "S1 U1 SC1 SYS2 PR2 F3 M1 A1 H2",
    dims: {
      surface: "S1",
      unit: "U1",
      scope: "SC1",
      system: "SYS2",
      prep: "PR2",
      sheen: "F3",
      method: "M1",
      access: "A1",
      occupancy: "H2",
    },
  },
  {
    id: "int-walls-vacant-movein",
    name: "Interior Walls • Move-in/Vacant Repaint",
    sku: "S1 U6 SC7 SYS2 PR2 F3 M1 A1 H1",
    dims: {
      surface: "S1",
      unit: "U6",
      scope: "SC7",
      system: "SYS2",
      prep: "PR2",
      sheen: "F3",
      method: "M1",
      access: "A1",
      occupancy: "H1",
    },
  },
  {
    id: "int-walls-rental-turn",
    name: "Interior Walls • Rental Turn (fast)",
    sku: "S1 U6 SC8 SYS2 PR1 F3 M1 A1 H1 (+AD6)",
    dims: {
      surface: "S1",
      unit: "U6",
      scope: "SC8",
      system: "SYS2",
      prep: "PR1",
      sheen: "F3",
      method: "M1",
      access: "A1",
      occupancy: "H1",
      addons: ["AD6"], // same-day / premium turnaround
    },
  },

  // -------------------------
  // CEILINGS
  // -------------------------
  {
    id: "int-ceiling-flat-standard",
    name: "Ceiling • Room • Flat • Standard",
    sku: "S2 U1 SC3 SYS2 PR2 F1 M1 A1 H2",
    dims: {
      surface: "S2",
      unit: "U1",
      scope: "SC3", // walls+ceiling room scope, commonly sold together
      system: "SYS2",
      prep: "PR2",
      sheen: "F1", // Flat
      method: "M1",
      access: "A1",
      occupancy: "H2",
    },
  },
  {
    id: "int-ceiling-vaulted-stains",
    name: "Ceiling • Vaulted • Stains (common service call)",
    sku: "S2 U1 SC3 SYS4 PR3 F1 M1 A3 H2 (C4)",
    dims: {
      surface: "S2",
      unit: "U1",
      scope: "SC3",
      system: "SYS4", // stain block
      prep: "PR3",
      sheen: "F1",
      method: "M1",
      access: "A3", // vaulted
      occupancy: "H2",
      conditions: ["C4"], // smoke/stain damaged bucket (or use your stain condition)
    },
  },

  // -------------------------
  // WALLS + TRIM (room package)
  // -------------------------
  {
    id: "int-walls-trim-room",
    name: "Room Package • Walls + Trim • Standard",
    sku: "S1 U6 SC5 SYS2 PR2 F3 M1 A1 H2",
    dims: {
      surface: "S1",
      unit: "U6",
      scope: "SC5", // walls + trim
      system: "SYS2",
      prep: "PR2",
      sheen: "F3",
      method: "M1",
      access: "A1",
      occupancy: "H2",
    },
  },

  // -------------------------
  // TRIM / BASEBOARDS (linear feet)
  // -------------------------
  {
    id: "int-trim-enamel",
    name: "Trim/Baseboards • Enamel System (semi-gloss)",
    sku: "S3 U2 SC4 SYS5 PR2 F5 M1 A1 H2",
    dims: {
      surface: "S3",
      unit: "U2",
      scope: "SC4", // trim only
      system: "SYS5", // bonding primer system
      prep: "PR2",
      sheen: "F5", // Semi-gloss
      method: "M1",
      access: "A1",
      occupancy: "H2",
    },
  },

  // -------------------------
  // DOORS (per item)
  // -------------------------
  {
    id: "int-doors-enamel",
    name: "Doors • Per Door • Enamel (semi-gloss)",
    sku: "S4 U3 SC4 SYS5 PR2 F5 M1 A1 H2",
    dims: {
      surface: "S4",
      unit: "U3",
      scope: "SC4",
      system: "SYS5",
      prep: "PR2",
      sheen: "F5",
      method: "M1",
      access: "A1",
      occupancy: "H2",
    },
  },

  // -------------------------
  // CABINETS (per set)
  // -------------------------
  {
    id: "int-cabinets-standard-occupied",
    name: "Cabinets • Standard • Occupied Home",
    sku: "S6 U4 SC6 SYS5 PR3 F4 M4 A1 H3 (C5)",
    dims: {
      surface: "S6",
      unit: "U4", // per set
      scope: "SC6", // full interior/whole house bucket; many people still pick this for cabinets; adjust if you add cabinet-specific scope
      system: "SYS5", // bonding primer system
      prep: "PR3",
      sheen: "F4", // Satin is common for cabinets (or F5)
      method: "M4", // spray cabinets
      access: "A1",
      occupancy: "H3",
      conditions: ["C5"], // grease is common
    },
  },

  // -------------------------
  // EXTERIOR (full repaints)
  // -------------------------
  {
    id: "ext-full-exterior-standard",
    name: "Exterior • Full Repaint • Standard",
    sku: "S11 U6 SC9 SYS2 PR2 F4 M2 A5 H1 (E1)",
    dims: {
      surface: "S11", // siding
      unit: "U6", // package
      scope: "SC9",
      system: "SYS2",
      prep: "PR2",
      sheen: "F4", // Satin exterior common
      method: "M2", // spray+backroll
      access: "A5", // 2-story common
      occupancy: "H1",
      conditions: ["E1"], // pressure wash required often
    },
  },
  {
    id: "ext-trim-only",
    name: "Exterior • Trim Only",
    sku: "S15 U2 SC10 SYS2 PR2 F5 M1 A5 H1 (E2)",
    dims: {
      surface: "S15",
      unit: "U2",
      scope: "SC10",
      system: "SYS2",
      prep: "PR2",
      sheen: "F5", // Semi-gloss trim common
      method: "M1",
      access: "A5",
      occupancy: "H1",
      conditions: ["E2"], // heavy caulk windows/trim
    },
  },

  // -------------------------
  // FENCE / DECK (stain)
  // -------------------------
  {
    id: "ext-fence-stain",
    name: "Fence/Deck • Stain/Sealer",
    sku: "S17 U1 SC13 SYS7 PR2 F7 M2 A1 H1 (E1) (+AD7,+AD8)",
    dims: {
      surface: "S17",
      unit: "U1",
      scope: "SC13",
      system: "SYS7", // stain/sealer
      prep: "PR2",
      sheen: "F7", // specialty
      method: "M2",
      access: "A1",
      occupancy: "H1",
      conditions: ["E1"], // wash
      addons: ["AD7", "AD8"], // wash + landscaping protection (if you separate them)
    },
  },
];
