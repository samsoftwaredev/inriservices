"use client";

import {
  FeatureDetails,
  MeasurementUnit,
  PaintBaseType,
  RoomCollection,
} from "@/interfaces/laborTypes";
import { convertToFeet } from "@/tools/convertMeasurement";
import {
  calculatePaintGallons,
  convertHoursToDays,
  estimatePaintingHours,
} from "@/tools/estimatePaintingHours";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GallonsProviderProps = {
  children: ReactNode;
};

type GallonsContextType = {
  totalDays: number;
  mappingNames: { [key: string]: string };
  walls: RoomCollection;
  setWalls: React.Dispatch<React.SetStateAction<RoomCollection>>;
  crownMolding: RoomCollection;
  setCrownMolding: React.Dispatch<React.SetStateAction<RoomCollection>>;
  chairRail: RoomCollection;
  setChairRail: React.Dispatch<React.SetStateAction<RoomCollection>>;
  baseboard: RoomCollection;
  setBaseboard: React.Dispatch<React.SetStateAction<RoomCollection>>;
  wainscoting: RoomCollection;
  setWainscoting: React.Dispatch<React.SetStateAction<RoomCollection>>;
  ceiling: RoomCollection;
  setCeiling: React.Dispatch<React.SetStateAction<RoomCollection>>;
  floor: RoomCollection;
  setFloor: React.Dispatch<React.SetStateAction<RoomCollection>>;
  totalHours: number;
  totalGallons: number;
  totalGallonsBySection: {
    walls: number;
    crownMolding: number;
    chairRail: number;
    baseboard: number;
    wainscoting: number;
    ceiling: number;
    floor: number;
  };
  measurementUnit: MeasurementUnit;
  setMeasurementUnit: React.Dispatch<React.SetStateAction<MeasurementUnit>>;
  totalGallonsByBasePaint: {
    walls: { paintBase: string | null; totalPerimeter: number }[];
    crownMolding: { paintBase: string | null; totalPerimeter: number }[];
    chairRail: { paintBase: string | null; totalPerimeter: number }[];
    baseboard: { paintBase: string | null; totalPerimeter: number }[];
    wainscoting: { paintBase: string | null; totalPerimeter: number }[];
    ceiling: { paintBase: string | null; totalPerimeter: number }[];
    floor: { paintBase: string | null; totalPerimeter: number }[];
  };
};

const GallonsContext = createContext<GallonsContextType | undefined>(undefined);

export function aggregatePerimeterByPaintBase(features: FeatureDetails[]): {
  paintBase: PaintBaseType | null;
  totalPerimeter: number;
}[] {
  const map = new Map<PaintBaseType | null, number>();

  for (const feature of features) {
    const key = feature.paintBase; // can be null
    const perimeter = feature.perimeter ?? 0; // treat null as 0

    if (!map.has(key)) {
      map.set(key, perimeter);
    } else {
      map.set(key, (map.get(key) ?? 0) + perimeter);
    }
  }

  return Array.from(map.entries()).map(([paintBase, totalPerimeter]) => ({
    paintBase,
    totalPerimeter,
  }));
}

export const GallonsProvider = ({ children }: GallonsProviderProps) => {
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>("ft");
  const mappingNames = {
    walls: "Walls",
    crownMolding: "Crown Molding",
    chairRail: "Chair Rail",
    baseboard: "Baseboard",
    wainscoting: "Wainscoting",
    ceiling: "Ceiling",
    floor: "Floor",
  };
  const [walls, setWalls] = useState<RoomCollection>({});
  const [crownMolding, setCrownMolding] = useState<RoomCollection>({});
  const [chairRail, setChairRail] = useState<RoomCollection>({});
  const [baseboard, setBaseboard] = useState<RoomCollection>({});
  const [wainscoting, setWainscoting] = useState<RoomCollection>({});
  const [ceiling, setCeiling] = useState<RoomCollection>({});
  const [floor, setFloor] = useState<RoomCollection>({});

  const wallPerimeter = Object.values(walls).reduce((total, item) => {
    if (item.perimeter && item.coats)
      return total + (item.perimeter * item.coats || 0);
    return total;
  }, 0);

  const crownMoldingPerimeter = Object.values(crownMolding).reduce(
    (total, item) => {
      if (item.perimeter && item.coats)
        return total + (item.perimeter * item.coats || 0);
      return total;
    },
    0
  );

  const chairRailPerimeter = Object.values(chairRail).reduce((total, item) => {
    if (item.perimeter && item.coats)
      return total + (item.perimeter * item.coats || 0);
    return total;
  }, 0);

  const baseboardPerimeter = Object.values(baseboard).reduce((total, item) => {
    if (item.perimeter && item.coats)
      return total + (item.perimeter * item.coats || 0);
    return total;
  }, 0);

  const wainscotingPerimeter = Object.values(wainscoting).reduce(
    (total, item) => {
      if (item.perimeter && item.coats)
        return total + (item.perimeter * item.coats || 0);
      return total;
    },
    0
  );

  const ceilingPerimeter = Object.values(ceiling).reduce((total, item) => {
    if (item.perimeter && item.coats)
      return total + (item.perimeter * item.coats || 0);
    return total;
  }, 0);

  const floorPerimeter = Object.values(floor).reduce((total, item) => {
    if (item.perimeter && item.coats)
      return total + (item.perimeter * item.coats || 0);
    return total;
  }, 0);

  const totalProjectGallons = () => {
    const area: number = ceilingPerimeter + floorPerimeter;
    const perimeter: number =
      wallPerimeter +
      crownMoldingPerimeter +
      chairRailPerimeter +
      baseboardPerimeter +
      wainscotingPerimeter;

    const total =
      calculatePaintGallons(Math.abs(perimeter), 1, measurementUnit) +
      calculatePaintGallons(Math.abs(area), 1, measurementUnit, 1, true);
    return total;
  };

  const totalGallonsBySection = {
    walls: calculatePaintGallons(wallPerimeter, 1, measurementUnit),
    crownMolding: calculatePaintGallons(
      crownMoldingPerimeter,
      1,
      measurementUnit
    ),
    chairRail: calculatePaintGallons(chairRailPerimeter, 1, measurementUnit),
    baseboard: calculatePaintGallons(baseboardPerimeter, 1, measurementUnit),
    wainscoting: calculatePaintGallons(
      wainscotingPerimeter,
      1,
      measurementUnit
    ),
    ceiling: calculatePaintGallons(
      ceilingPerimeter,
      1,
      measurementUnit,
      1,
      true
    ),
    floor: calculatePaintGallons(floorPerimeter, 1, measurementUnit, 1, true),
  };

  const totalHours = estimatePaintingHours({
    wallSqFt: convertToFeet(wallPerimeter, measurementUnit),
    ceilingSqFt: convertToFeet(ceilingPerimeter, measurementUnit, true),
    trimLinearFt:
      convertToFeet(crownMoldingPerimeter, measurementUnit) +
      convertToFeet(chairRailPerimeter, measurementUnit) +
      convertToFeet(baseboardPerimeter, measurementUnit) +
      convertToFeet(wainscotingPerimeter, measurementUnit),
  });

  const totalGallonsByBasePaint = {
    walls: aggregatePerimeterByPaintBase(Object.values(walls)),
    crownMolding: aggregatePerimeterByPaintBase(Object.values(crownMolding)),
    chairRail: aggregatePerimeterByPaintBase(Object.values(chairRail)),
    baseboard: aggregatePerimeterByPaintBase(Object.values(baseboard)),
    wainscoting: aggregatePerimeterByPaintBase(Object.values(wainscoting)),
    ceiling: aggregatePerimeterByPaintBase(Object.values(ceiling)),
    floor: aggregatePerimeterByPaintBase(Object.values(floor)),
  };

  const value: GallonsContextType = {
    walls,
    setWalls,
    crownMolding,
    setCrownMolding,
    chairRail,
    setChairRail,
    baseboard,
    setBaseboard,
    wainscoting,
    setWainscoting,
    ceiling,
    setCeiling,
    floor,
    setFloor,
    totalGallons: totalProjectGallons(),
    totalGallonsByBasePaint,
    totalGallonsBySection,
    mappingNames,
    totalHours,
    totalDays: convertHoursToDays(totalHours),
    measurementUnit,
    setMeasurementUnit,
  };

  return React.createElement(GallonsContext.Provider, { value }, children);
};

// Custom hook to use the context
export const useGallons = (): GallonsContextType => {
  const context = useContext(GallonsContext);
  if (context === undefined) {
    throw new Error("useGallons must be used within a GallonsProvider");
  }
  return context;
};
