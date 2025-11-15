export const calculateArea = (dimensions: string): number => {
  const dims = dimensions.split("x").map((d) => parseFloat(d.trim()));
  if (dims.length === 2 && dims.every((d) => !isNaN(d))) {
    return dims[0] * dims[1];
  }
  return 0;
};

export const numberOfPaintGallons = (area: number): number => {
  const coveragePerGallon = 400; // square feet per gallon
  return Math.ceil(area / coveragePerGallon);
};

export const calculatePerimeter = (
  dimensions: string,
  roomHeight: number
): number => {
  const dims = dimensions.split("x").map((d) => parseFloat(d.trim()));
  if (dims.length === 2 && dims.every((d) => !isNaN(d))) {
    return (dims[0] + dims[0] + dims[1] + dims[1]) * roomHeight;
  }
  return 0;
};
