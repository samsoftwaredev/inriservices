import { MeasurementUnit } from "@/interfaces/laborTypes";

/**
 * Converts a measurement value from the specified unit to feet
 * @param value - The numerical value to convert
 * @param fromUnit - The unit to convert from ("ft" | "m" | "in")
 * @returns The value converted to feet
 */
export const convertToFeet = (
  value: number,
  fromUnit: MeasurementUnit
): number => {
  if (value === 0) return 0;

  switch (fromUnit) {
    case "ft":
      return value; // Already in feet
    case "m":
      return value * 3.28084; // 1 meter = 3.28084 feet
    case "in":
      return value / 12; // 12 inches = 1 foot
    default:
      throw new Error(`Unsupported measurement unit: ${fromUnit}`);
  }
};

/**
 * Converts a measurement value from feet to the specified unit
 * @param value - The value in feet to convert
 * @param toUnit - The unit to convert to ("ft" | "m" | "in")
 * @returns The value converted to the target unit
 */
export const convertFromFeet = (
  value: number,
  toUnit: MeasurementUnit
): number => {
  if (value === 0) return 0;

  switch (toUnit) {
    case "ft":
      return value; // Already in feet
    case "m":
      return value / 3.28084; // 1 foot = 0.3048 meters
    case "in":
      return value * 12; // 1 foot = 12 inches
    default:
      throw new Error(`Unsupported measurement unit: ${toUnit}`);
  }
};

/**
 * Converts a measurement value from one unit to another
 * @param value - The numerical value to convert
 * @param fromUnit - The unit to convert from
 * @param toUnit - The unit to convert to
 * @returns The value converted to the target unit
 */
export const convertMeasurement = (
  value: number,
  fromUnit: MeasurementUnit,
  toUnit: MeasurementUnit
): number => {
  if (fromUnit === toUnit) return value;

  const valueInFeet = convertToFeet(value, fromUnit);
  return convertFromFeet(valueInFeet, toUnit);
};

/**
 * Formats a measurement value with its unit
 * @param value - The numerical value
 * @param unit - The measurement unit
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with value and unit
 */
export const formatMeasurement = (
  value: number,
  unit: MeasurementUnit,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)} ${unit}`;
};

/**
 * Gets the display name for a measurement unit
 * @param unit - The measurement unit
 * @returns The full name of the unit
 */
export const getUnitDisplayName = (unit: MeasurementUnit): string => {
  switch (unit) {
    case "ft":
      return "feet";
    case "m":
      return "meters";
    case "in":
      return "inches";
    default:
      return unit;
  }
};

/**
 * Conversion constants for reference
 */
export const CONVERSION_CONSTANTS = {
  METERS_TO_FEET: 3.28084,
  FEET_TO_METERS: 0.3048,
  INCHES_TO_FEET: 1 / 12,
  FEET_TO_INCHES: 12,
} as const;
