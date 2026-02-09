import * as catalogDrywall from "@/constants/catalogSKUDrywall";
import * as catalogPainting from "@/constants/catalogSKUPainting";

/**
 * Searches for a single SKU code in the drywall catalogs
 */
const searchDrywallSKU = (sku: string): string | null => {
  const drywallCatalog = [
    ...catalogDrywall.repairTypes,
    ...catalogDrywall.sizeBands,
    ...catalogDrywall.orientations,
    ...catalogDrywall.accessOptions,
    ...catalogDrywall.finishTypes,
    ...catalogDrywall.paintScopes,
    ...catalogDrywall.protectionOptions,
    ...catalogDrywall.modifiers,
  ];

  const item = drywallCatalog.find((item) => item.id === sku);
  if (item) return item.label;

  return null;
};

/**
 * Searches for a single SKU code in the painting catalogs
 */
const searchPaintingSKU = (sku: string): string | null => {
  const paintingCatalog = [
    ...catalogPainting.SURFACES,
    ...catalogPainting.UNITS,
    ...catalogPainting.SCOPES,
    ...catalogPainting.SYSTEMS,
    ...catalogPainting.PREP,
    ...catalogPainting.SHEEN,
    ...catalogPainting.METHODS,
    ...catalogPainting.ACCESS,
    ...catalogPainting.OCCUPANCY,
    ...catalogPainting.CONDITIONS,
    ...catalogPainting.ADDONS,
  ];

  const item = paintingCatalog.find((item) => item.id === sku);
  if (item) return item.label;

  return null;
};

/**
 * Converts a compound SKU string (e.g., "T2 S1 O1 A1 F1 P1 H2") to a readable string
 * with all labels joined together
 *
 * @param skuString - The compound SKU string with space-separated codes
 * @param type - The type of SKU: "drywall" or "painting"
 * @returns A string with all labels, separated by " • "
 *
 * @example
 * // Returns: "Small holes (nails/anchors) • Small (2–6") • Wall • 0–8 ft (standard) • Smooth (Level 4) • Prime only • Furnished room"
 * getSKULabels("T2 S1 O1 A1 F1 P1 H2", "drywall")
 */
export const getSKULabels = (
  skuString: string,
  type: "drywall" | "painting",
): string => {
  // Split the SKU string into individual codes
  const skuCodes = skuString.trim().split(/\s+/);

  // Search function based on type
  const searchFunction =
    type === "drywall" ? searchDrywallSKU : searchPaintingSKU;

  // Map each code to its label
  const labels = skuCodes
    .map((code) => {
      const label = searchFunction(code);
      return label || code; // Fallback to the code itself if not found
    })
    .filter((label) => label); // Remove any empty results

  // Join labels with a separator
  return labels.join(" • ");
};

/**
 * Gets the label for a single SKU code
 *
 * @param sku - The single SKU code (e.g., "T2" or "S1")
 * @param type - The type of SKU: "drywall" or "painting"
 * @returns The label for the SKU, or the SKU itself if not found
 */
export const getSingleSKULabel = (
  sku: string,
  type: "drywall" | "painting",
): string => {
  const searchFunction =
    type === "drywall" ? searchDrywallSKU : searchPaintingSKU;

  return searchFunction(sku) || sku;
};
