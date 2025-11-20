import { MeasurementUnit } from "@/interfaces/laborTypes";
import { convertToFeet } from "./convertMeasurement";
import { numberOfPaintGallons } from "@/components/ProInteriorEstimate/laborCalc";

export function estimatePaintingHours({
  wallSqFt = 0,
  ceilingSqFt = 0,
  trimLinearFt = 0,
  wallCoats = 1,
  ceilingCoats = 1,
  trimCoats = 1,
  wallSpeed = 150, // sqft/hr per coat
  ceilingSpeed = 120, // sqft/hr per coat
  trimSpeed = 50, // linear ft/hr per coat
  efficiency = 1, // <1 = faster crew, >1 = slower
}) {
  const wallHours = (wallSqFt / wallSpeed) * wallCoats;
  const ceilingHours = (ceilingSqFt / ceilingSpeed) * ceilingCoats;
  const trimHours = (trimLinearFt / trimSpeed) * trimCoats;

  const total = (wallHours + ceilingHours + trimHours) * efficiency;
  return Number(total.toFixed(2));
}

export function convertHoursToDays(hours: number, hoursPerDay: number = 8) {
  return Math.ceil(hours / hoursPerDay);
}

export const calculatePaintGallons = (
  perimeter: number | string,
  coatsFromEditData: number | undefined,
  measurementUnit: MeasurementUnit,
  defaultCoats: number = 1
): number => {
  const numPerimeter =
    typeof perimeter === "string" ? parseFloat(perimeter) : perimeter;
  if (!numPerimeter || numPerimeter <= 0) {
    return 0;
  }

  const coats = coatsFromEditData || defaultCoats;
  const convertedToFeet = convertToFeet(numPerimeter * coats, measurementUnit);
  const baseGallons = numberOfPaintGallons(convertedToFeet);
  return baseGallons;
};

export const calculatePaintGallonsForArea = (
  area: number | string,
  coatsFromEditData: number | undefined,
  measurementUnit: MeasurementUnit,
  defaultCoats: number = 1
): number => {
  let inchesSquared = false;
  if (measurementUnit === "in") inchesSquared = true;

  const numArea = typeof area === "string" ? parseFloat(area) : area;
  if (!numArea || numArea <= 0) {
    return 0;
  }

  const coats = coatsFromEditData || defaultCoats;

  const convertedToFeet =
    convertToFeet(numArea, measurementUnit, inchesSquared) * coats;
  const baseGallons = numberOfPaintGallons(convertedToFeet);
  return baseGallons;
};
