import { FeatureType } from "@/interfaces/laborTypes";

export const getDefaultFeatureImage = (featureType: FeatureType): string => {
  const imageMap: Record<FeatureType, string> = {
    doors: "https://images.pexels.com/photos/3935330/pexels-photo-3935330.jpeg",
    cabinetry:
      "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
    flooring:
      "https://images.pexels.com/photos/3773572/pexels-photo-3773572.jpeg",
    ceilings:
      "https://images.pexels.com/photos/3773573/pexels-photo-3773573.jpeg",
    windows:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    outlets:
      "https://images.pexels.com/photos/1439518/pexels-photo-1439518.jpeg",
    switches:
      "https://images.pexels.com/photos/3773576/pexels-photo-3773576.jpeg",
    fixtures:
      "https://images.pexels.com/photos/112474/pexels-photo-112474.jpeg",
    trim: "https://images.pexels.com/photos/7031402/pexels-photo-7031402.jpeg",
    walls: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    closets:
      "https://images.pexels.com/photos/3965520/pexels-photo-3965520.jpeg",
    crownMolding:
      "https://images.pexels.com/photos/3773574/pexels-photo-3773574.jpeg",
    chairRail:
      "https://images.pexels.com/photos/6585721/pexels-photo-6585721.jpeg",
    baseboard:
      "https://images.pexels.com/photos/6585428/pexels-photo-6585428.jpeg",
    wainscoting:
      "https://images.pexels.com/photos/6585326/pexels-photo-6585326.jpeg",
    other: "https://images.pexels.com/photos/3651825/pexels-photo-3651825.jpeg",
  };

  return (
    imageMap[featureType] ||
    "https://images.pexels.com/photos/3773572/pexels-photo-3773572.jpeg"
  );
};
