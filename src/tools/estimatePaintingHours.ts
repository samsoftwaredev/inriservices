export function estimatePaintingHours({
  wallSqFt = 0,
  ceilingSqFt = 0,
  trimLinearFt = 0,
  wallCoats = 2,
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
