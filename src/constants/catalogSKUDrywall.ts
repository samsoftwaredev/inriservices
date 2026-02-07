import {
  AccessId,
  FinishId,
  ModifierId,
  OrientationId,
  PaintScopeId,
  ProtectionId,
  RepairTypeId,
  SizeBandId,
} from "@/types/skuDrywall";

export const repairTypes: { id: RepairTypeId; label: string }[] = [
  { id: "T1", label: "Nail pops / screw pops" },
  { id: "T2", label: "Small holes (nails/anchors)" },
  { id: "T3", label: "Medium hole (door knob / impact)" },
  { id: "T4", label: "Large hole / missing drywall" },
  { id: "T5", label: "Crack repair (straight crack)" },
  { id: "T6", label: "Crack repair (settlement / recurring risk)" },
  { id: "T7", label: "Seam / tape failure (bubble / peeling tape)" },
  { id: "T8", label: "Water damage (stain + softened board)" },
  { id: "T9", label: "Water damage (active leak evidence)" },
  { id: "T10", label: "Corner bead damage (outside corner)" },
  { id: "T11", label: "Inside corner damage" },
  { id: "T12", label: "Popcorn ceiling patch" },
  { id: "T13", label: "Knockdown / orange peel texture patch" },
  { id: "T14", label: "Smooth wall level-5 style patch" },
  { id: "T15", label: "Partial panel replacement (between studs)" },
  { id: "T16", label: "Full sheet replacement (4x8 / 4x12)" },
  { id: "T17", label: "Ceiling sag / fastener failure (re-screw + patch)" },
  { id: "T18", label: "Patch after electrical/plumbing access cut" },
  { id: "T19", label: "Patch after cabinet/backsplash/demo" },
  { id: "T20", label: "Patch after mold remediation / removed material" },
];

export const sizeBands: { id: SizeBandId; label: string }[] = [
  { id: "S0", label: 'Micro (≤ 2")' },
  { id: "S1", label: 'Small (2–6")' },
  { id: "S2", label: 'Medium (6–18")' },
  { id: "S3", label: 'Large (18–36")' },
  { id: "S4", label: "X-Large (36”+ / between studs)" },
  { id: "S5", label: "Full sheet (≥ 32 sq ft)" },
  { id: "S6", label: "Multi-area (2–5 patches)" },
  { id: "S7", label: "Whole-room set (6+ patches)" },
];

export const orientations: {
  id: OrientationId;
  label: string;
  multiplier: number;
}[] = [
  { id: "O1", label: "Wall", multiplier: 1.0 },
  { id: "O2", label: "Ceiling", multiplier: 1.25 },
  { id: "O3", label: "Wall + Ceiling (same room)", multiplier: 1.45 },
];

export const accessOptions: {
  id: AccessId;
  label: string;
  multiplier: number;
}[] = [
  { id: "A1", label: "0–8 ft (standard)", multiplier: 1.0 },
  { id: "A2", label: "9–12 ft (ladder)", multiplier: 1.15 },
  { id: "A3", label: "13–18 ft (tall ladder/scaffold)", multiplier: 1.35 },
  { id: "A4", label: "Stairwell / difficult angle", multiplier: 1.45 },
  { id: "A5", label: "Tight space", multiplier: 1.2 },
  { id: "A6", label: "Obstructions not moved", multiplier: 1.25 },
];

export const finishTypes: {
  id: FinishId;
  label: string;
  multiplier: number;
}[] = [
  { id: "F1", label: "Smooth (Level 4)", multiplier: 1.0 },
  { id: "F2", label: "Smooth (Level 5)", multiplier: 1.35 },
  { id: "F3", label: "Orange peel", multiplier: 1.1 },
  { id: "F4", label: "Knockdown", multiplier: 1.15 },
  { id: "F5", label: "Popcorn", multiplier: 1.25 },
  { id: "F6", label: "Skip trowel / custom", multiplier: 1.45 },
  { id: "F7", label: "Unknown / mixed", multiplier: 1.15 },
];

export const paintScopes: {
  id: PaintScopeId;
  label: string;
  bundle: "S1" | "S2" | "S3" | "S4" | "S5";
  multiplier: number;
}[] = [
  { id: "P0", label: "No paint (drywall only)", bundle: "S2", multiplier: 1.0 },
  { id: "P1", label: "Prime only", bundle: "S3", multiplier: 1.1 },
  {
    id: "P2",
    label: "Spot paint (no blend guarantee)",
    bundle: "S4",
    multiplier: 1.2,
  },
  {
    id: "P3",
    label: "Spot blend (best-effort)",
    bundle: "S4",
    multiplier: 1.3,
  },
  { id: "P4", label: "Paint 1 wall", bundle: "S5", multiplier: 1.6 },
  { id: "P5", label: "Paint all walls in room", bundle: "S5", multiplier: 2.2 },
  { id: "P6", label: "Paint full ceiling", bundle: "S5", multiplier: 1.9 },
  { id: "P7", label: "Paint wall + ceiling", bundle: "S5", multiplier: 2.6 },
];

export const protectionOptions: {
  id: ProtectionId;
  label: string;
  multiplier: number;
}[] = [
  { id: "H1", label: "Empty room", multiplier: 1.0 },
  { id: "H2", label: "Furnished room", multiplier: 1.1 },
  { id: "H3", label: "Occupied / living household", multiplier: 1.2 },
  { id: "H4", label: "Dust-sensitive environment", multiplier: 1.3 },
];

export const stepBundles: Record<
  "S1" | "S2" | "S3" | "S4" | "S5",
  { id: string; title: string; steps: string[] }
> = {
  S1: {
    id: "S1",
    title: "Patch & Prep",
    steps: [
      "Protect area",
      "Cut/clean damaged gypsum",
      "Backing (as needed)",
      "Install drywall piece",
      "Tape + coats",
      "Sand flat",
    ],
  },
  S2: {
    id: "S2",
    title: "Finish match",
    steps: [
      "Everything in Patch & Prep",
      "Feather edges",
      "Texture/smooth match",
      "Final sand / touch-up",
    ],
  },
  S3: {
    id: "S3",
    title: "Paint-ready",
    steps: [
      "Everything in Finish match",
      "Prime repaired area (appropriate primer)",
    ],
  },
  S4: {
    id: "S4",
    title: "Blend paint",
    steps: ["Everything in Paint-ready", "Paint spot blend (best-effort)"],
  },
  S5: {
    id: "S5",
    title: "Repaint section",
    steps: [
      "Everything in Paint-ready",
      "Repaint full wall/ceiling for uniform finish",
    ],
  },
};

export const modifiers: { id: ModifierId; label: string; amount: number }[] = [
  { id: "C1", label: "Stud/backing required", amount: 35 },
  { id: "C2", label: "Insulation replacement", amount: 45 },
  { id: "C3", label: "Vapor barrier present", amount: 25 },
  { id: "C5", label: "Metal framing", amount: 40 },

  { id: "W1", label: "Stain-block primer required", amount: 30 },
  { id: "W2", label: "Soft board removal required", amount: 60 },
  { id: "W3", label: "Suspected mold (scope limits)", amount: 0 }, // often "refer"
  { id: "W4", label: "Smoke/grease contamination prep", amount: 50 },

  { id: "R1", label: "Known settling crack (no guarantee)", amount: 0 },
  { id: "R2", label: "Remove prior bad repair", amount: 55 },

  { id: "TEX1", label: "Heavy texture (multiple passes)", amount: 45 },
  { id: "TEX2", label: "High-visibility match", amount: 35 },
];

// ✅ Base price by (T + S + O) can get huge.
// Start with a simple base by Size + RepairType class. Then multiply by Orientation/Access/Finish/Paint/Protection.
export const baseBySize: Record<SizeBandId, number> = {
  S0: 75,
  S1: 120,
  S2: 220,
  S3: 360,
  S4: 520,
  S5: 880,
  S6: 420,
  S7: 650,
};

// Optional: bump certain repair types
export const repairTypeAdders: Partial<Record<RepairTypeId, number>> = {
  T8: 60, // water damage
  T9: 0, // "stop & refer" usually
  T10: 45, // corner bead
  T12: 55, // popcorn
  T14: 80, // level 5
  T16: 120, // full sheet replacement complexity
};
