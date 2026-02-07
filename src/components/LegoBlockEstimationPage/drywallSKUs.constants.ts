// Drywall “real-world” SKU presets (most common quotes).
// Matches your drywall spec:
//
// SKU = (RepairType) + (SizeBand) + (Orientation) + (Access) + (Finish) + (PaintScope) + (Modifiers) + (Protection)
//
// Example: "T8 S2 O2 A2 F5 P6 (W1,W2) H3"

export type DrywallSkuPreset = {
  id: string;
  name: string;
  sku: string;
  // Optional: pre-fill so you don’t have to parse sku later
  dims?: {
    repairType: string; // T1..T20
    sizeBand: string; // S0..S7
    orientation: string; // O1..O3
    access: string; // A1..A6
    finish: string; // F1..F7
    paintScope: string; // P0..P7
    modifiers?: string[]; // C*/W*/R*/TEX*
    protection: string; // H1..H4
  };
};

export const COMMON_DRYWALL_SKU_PRESETS: DrywallSkuPreset[] = [
  // -------------------------
  // G1 — Holes (Walls)
  // -------------------------
  {
    id: "dw-small-hole-no-paint",
    name: "Small hole (anchors) • Wall • No paint (client paints)",
    sku: "T2 S1 O1 A1 F1 P0 H2",
    dims: {
      repairType: "T2",
      sizeBand: "S1",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P0",
      protection: "H2",
    },
  },
  {
    id: "dw-small-hole-prime",
    name: "Small hole (anchors) • Wall • Prime only",
    sku: "T2 S1 O1 A1 F1 P1 H2",
    dims: {
      repairType: "T2",
      sizeBand: "S1",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P1",
      protection: "H2",
    },
  },
  {
    id: "dw-small-hole-spot-blend",
    name: "Small hole (anchors) • Wall • Spot blend (most common)",
    sku: "T2 S1 O1 A1 F1 P3 H2",
    dims: {
      repairType: "T2",
      sizeBand: "S1",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      protection: "H2",
    },
  },
  {
    id: "dw-medium-hole-spot-blend-texture",
    name: "Medium hole (door knob) • Wall • Orange peel • Spot blend",
    sku: "T3 S2 O1 A1 F3 P3 H2",
    dims: {
      repairType: "T3",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F3",
      paintScope: "P3",
      protection: "H2",
    },
  },
  {
    id: "dw-large-hole-repaint-wall",
    name: "Large hole • Wall • Repaint full wall (uniform finish)",
    sku: "T4 S3 O1 A1 F3 P5 H2",
    dims: {
      repairType: "T4",
      sizeBand: "S3",
      orientation: "O1",
      access: "A1",
      finish: "F3",
      paintScope: "P5",
      protection: "H2",
    },
  },
  {
    id: "dw-access-cut-spot-blend",
    name: "Plumbing/Electrical access cut • Wall • Spot blend",
    sku: "T18 S2 O1 A1 F3 P3 H2",
    dims: {
      repairType: "T18",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F3",
      paintScope: "P3",
      protection: "H2",
    },
  },

  // -------------------------
  // G2 — Cracks & seams
  // -------------------------
  {
    id: "dw-straight-crack-spot-blend",
    name: "Straight crack • Wall • Smooth • Spot blend",
    sku: "T5 S2 O1 A1 F1 P3 H2",
    dims: {
      repairType: "T5",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      protection: "H2",
    },
  },
  {
    id: "dw-settling-crack-spot-blend-no-guarantee",
    name: "Settling crack • Wall • Smooth • Spot blend (no re-crack guarantee)",
    sku: "T6 S2 O1 A1 F1 P3 (R1) H2",
    dims: {
      repairType: "T6",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      modifiers: ["R1"],
      protection: "H2",
    },
  },
  {
    id: "dw-tape-failure-repaint-wall",
    name: "Tape failure • Wall • Smooth • Repaint full wall",
    sku: "T7 S3 O1 A1 F1 P5 H2",
    dims: {
      repairType: "T7",
      sizeBand: "S3",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P5",
      protection: "H2",
    },
  },

  // -------------------------
  // G3 — Corners
  // -------------------------
  {
    id: "dw-outside-corner-bead-spot-blend",
    name: "Outside corner bead • Wall • Spot blend",
    sku: "T10 S2 O1 A1 F1 P3 H2",
    dims: {
      repairType: "T10",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      protection: "H2",
    },
  },
  {
    id: "dw-inside-corner-spot-blend",
    name: "Inside corner • Wall • Spot blend",
    sku: "T11 S2 O1 A1 F1 P3 H2",
    dims: {
      repairType: "T11",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      protection: "H2",
    },
  },

  // -------------------------
  // G4 — Water damage (very common)
  // -------------------------
  {
    id: "dw-water-damage-wall-stainblock",
    name: "Water damage • Wall • Stain-block + soft board removal • Spot blend",
    sku: "T8 S2 O1 A1 F1 P3 (W1,W2) H3",
    dims: {
      repairType: "T8",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      modifiers: ["W1", "W2"],
      protection: "H3",
    },
  },
  {
    id: "dw-water-damage-ceiling-popcorn-repaint-ceiling",
    name: "Water damage • Popcorn ceiling • Stain-block + board replacement • Repaint full ceiling",
    sku: "T8 S2 O2 A2 F5 P6 (W1,W2) H3",
    dims: {
      repairType: "T8",
      sizeBand: "S2",
      orientation: "O2",
      access: "A2",
      finish: "F5",
      paintScope: "P6",
      modifiers: ["W1", "W2"],
      protection: "H3",
    },
  },
  {
    id: "dw-water-active-leak-stop-refer",
    name: "Active leak evidence • Stop & refer until leak fixed",
    sku: "T9 S2 O2 A1 F1 P0 (W2) H2",
    dims: {
      repairType: "T9",
      sizeBand: "S2",
      orientation: "O2",
      access: "A1",
      finish: "F1",
      paintScope: "P0",
      modifiers: ["W2"],
      protection: "H2",
    },
  },

  // -------------------------
  // G5 — Ceilings & texture
  // -------------------------
  {
    id: "dw-popcorn-patch-repaint-ceiling",
    name: "Popcorn patch • Ceiling • Repaint full ceiling",
    sku: "T12 S2 O2 A1 F5 P6 H2",
    dims: {
      repairType: "T12",
      sizeBand: "S2",
      orientation: "O2",
      access: "A1",
      finish: "F5",
      paintScope: "P6",
      protection: "H2",
    },
  },
  {
    id: "dw-knockdown-ceiling-patch-repaint-ceiling",
    name: "Knockdown/Orange peel patch • Ceiling • Repaint full ceiling",
    sku: "T13 S2 O2 A1 F4 P6 (TEX2) H2",
    dims: {
      repairType: "T13",
      sizeBand: "S2",
      orientation: "O2",
      access: "A1",
      finish: "F4",
      paintScope: "P6",
      modifiers: ["TEX2"],
      protection: "H2",
    },
  },
  {
    id: "dw-ceiling-sag-rescrew-popcorn-repaint",
    name: "Ceiling sag • Re-screw + patch • Popcorn • Repaint ceiling",
    sku: "T17 S3 O2 A2 F5 P6 (C1) H3",
    dims: {
      repairType: "T17",
      sizeBand: "S3",
      orientation: "O2",
      access: "A2",
      finish: "F5",
      paintScope: "P6",
      modifiers: ["C1"],
      protection: "H3",
    },
  },

  // -------------------------
  // G6 — Replacement (bigger jobs)
  // -------------------------
  {
    id: "dw-partial-panel-between-studs-repaint-wall",
    name: "Partial panel replacement • Between studs • Repaint wall",
    sku: "T15 S4 O1 A1 F1 P5 (C1) H2",
    dims: {
      repairType: "T15",
      sizeBand: "S4",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P5",
      modifiers: ["C1"],
      protection: "H2",
    },
  },
  {
    id: "dw-full-sheet-wall-repaint-wall",
    name: "Full sheet replacement • Wall • Repaint wall",
    sku: "T16 S5 O1 A1 F1 P5 (C1) H2",
    dims: {
      repairType: "T16",
      sizeBand: "S5",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P5",
      modifiers: ["C1"],
      protection: "H2",
    },
  },
  {
    id: "dw-full-sheet-ceiling-popcorn-repaint-ceiling",
    name: "Full sheet replacement • Ceiling • Popcorn • Repaint ceiling",
    sku: "T16 S5 O2 A2 F5 P6 (C1,TEX1) H3",
    dims: {
      repairType: "T16",
      sizeBand: "S5",
      orientation: "O2",
      access: "A2",
      finish: "F5",
      paintScope: "P6",
      modifiers: ["C1", "TEX1"],
      protection: "H3",
    },
  },

  // -------------------------
  // G7 — Multi-area packages
  // -------------------------
  {
    id: "dw-multi-small-holes-package",
    name: "Multi-area small holes • 2–5 patches • Spot blend",
    sku: "T2 S6 O1 A1 F1 P3 H2",
    dims: {
      repairType: "T2",
      sizeBand: "S6",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      protection: "H2",
    },
  },
  {
    id: "dw-nail-pops-whole-room",
    name: "Nail pops package • Whole-room set • Spot blend",
    sku: "T1 S7 O1 A1 F1 P3 H2",
    dims: {
      repairType: "T1",
      sizeBand: "S7",
      orientation: "O1",
      access: "A1",
      finish: "F1",
      paintScope: "P3",
      protection: "H2",
    },
  },

  // -------------------------
  // High-visibility smooth (hard blends)
  // -------------------------
  {
    id: "dw-level5-smooth-spot-blend",
    name: "Level-5 smooth patch • High visibility • Spot blend",
    sku: "T14 S2 O1 A1 F2 P3 (TEX2) H3",
    dims: {
      repairType: "T14",
      sizeBand: "S2",
      orientation: "O1",
      access: "A1",
      finish: "F2",
      paintScope: "P3",
      modifiers: ["TEX2"],
      protection: "H3",
    },
  },
];
