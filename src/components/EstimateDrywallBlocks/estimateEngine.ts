import {
  EstimateResult,
  EstimateSelection,
  LineItem,
} from "@/types/skuDrywall";
import {
  accessOptions,
  finishTypes,
  orientations,
  paintScopes,
  protectionOptions,
  modifiers,
  baseBySize,
  repairTypeAdders,
} from "@/constants/catalogSKUDrywall";

const byId = <T extends { id: string }>(arr: T[], id?: string) =>
  arr.find((x) => x.id === id);

export function buildSku(s: EstimateSelection) {
  const mods = [...s.modifiers].sort().join(",");
  return [
    s.repairType ?? "T?",
    s.size ?? "S?",
    s.orientation ?? "O?",
    s.access ?? "A?",
    s.finish ?? "F?",
    s.paintScope ?? "P?",
    mods ? `(${mods})` : "",
    s.protection ?? "H?",
  ]
    .filter(Boolean)
    .join(" ");
}

export function computeEstimate(selection: EstimateSelection): EstimateResult {
  const qty = Math.max(1, selection.quantity || 1);

  const orientation = byId(orientations, selection.orientation);
  const access = byId(accessOptions, selection.access);
  const finish = byId(finishTypes, selection.finish);
  const paint = byId(paintScopes, selection.paintScope);
  const protection = byId(protectionOptions, selection.protection);

  // Guard: if missing required selections, keep it stable
  const base = selection.size ? baseBySize[selection.size] : 0;
  const repairAdder = selection.repairType
    ? (repairTypeAdders[selection.repairType] ?? 0)
    : 0;

  const multiplier =
    (orientation?.multiplier ?? 1) *
    (access?.multiplier ?? 1) *
    (finish?.multiplier ?? 1) *
    (paint?.multiplier ?? 1) *
    (protection?.multiplier ?? 1);

  const laborSubtotal = Math.round((base + repairAdder) * multiplier * qty);

  const pickedMods = selection.modifiers
    .map((id) => modifiers.find((m) => m.id === id))
    .filter(Boolean) as { id: string; label: string; amount: number }[];

  const modifiersTotal = pickedMods.reduce((sum, m) => sum + m.amount, 0) * qty;

  const subtotal = laborSubtotal + modifiersTotal;

  // NOTE: You’ll likely compute tax from materials only in real life.
  // This is a placeholder "estimate tax" rule.
  const taxRate = 0.0825; // Dallas-ish
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  const bundleId = paint?.bundle ?? "S2";

  const items: LineItem[] = [
    {
      title: `Drywall repair (${qty}x)`,
      description: `Base ${selection.size ?? ""} + ${selection.repairType ?? ""} with multipliers`,
      amount: laborSubtotal,
    },
    ...pickedMods.map((m) => ({
      title: m.label,
      description: "Condition modifier / adder",
      amount: m.amount * qty,
    })),
    {
      title: "Estimated tax",
      description: `Tax rate ${(taxRate * 100).toFixed(2)}%`,
      amount: tax,
    },
  ];

  return {
    sku: buildSku(selection),
    bundleId,
    laborSubtotal,
    modifiersTotal,
    subtotal,
    tax,
    total,
    items,
  };
}
