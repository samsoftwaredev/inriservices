"use client";

import { numberOfPaintGallons } from "@/components/ProInteriorEstimate/laborCalc";
import {
  convertHoursToDays,
  estimatePaintingHours,
} from "@/tools/estimatePaintingHours";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GallonsProviderProps = {
  children: ReactNode;
};

type FeatureDetails = {
  coats: number | null;
  perimeter: number | null;
};

type RoomCollection = {
  [key: string]: FeatureDetails;
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
};

const GallonsContext = createContext<GallonsContextType | undefined>(undefined);

export const GallonsProvider = ({ children }: GallonsProviderProps) => {
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

  const wallCoats = Object.values(walls).reduce((total, item) => {
    return total + (item.coats || 0);
  }, 0);

  const crownMoldingPerimeter = Object.values(crownMolding).reduce(
    (total, item) => {
      if (item.perimeter && item.coats)
        return total + (item.perimeter * item.coats || 0);
      return total;
    },
    0
  );

  const crownMoldingCoats = Object.values(crownMolding).reduce(
    (total, item) => {
      return total + (item.coats || 0);
    },
    0
  );

  const chairRailPerimeter = Object.values(chairRail).reduce((total, item) => {
    if (item.perimeter && item.coats)
      return total + (item.perimeter * item.coats || 0);
    return total;
  }, 0);

  const chairRailCoats = Object.values(chairRail).reduce((total, item) => {
    return total + (item.coats || 0);
  }, 0);

  const baseboardPerimeter = Object.values(baseboard).reduce((total, item) => {
    if (item.perimeter && item.coats)
      return total + (item.perimeter * item.coats || 0);
    return total;
  }, 0);

  const baseboardCoats = Object.values(baseboard).reduce((total, item) => {
    return total + (item.coats || 0);
  }, 0);

  const wainscotingPerimeter = Object.values(wainscoting).reduce(
    (total, item) => {
      if (item.perimeter && item.coats)
        return total + (item.perimeter * item.coats || 0);
      return total;
    },
    0
  );

  const wainscotingCoats = Object.values(wainscoting).reduce((total, item) => {
    return total + (item.coats || 0);
  }, 0);

  const ceilingCoats = Object.values(ceiling).reduce((total, item) => {
    return total + (item.coats || 0);
  }, 0);

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

  const floorCoats = Object.values(floor).reduce((total, item) => {
    return total + (item.coats || 0);
  }, 0);

  const totalProjectGallons = (
    areaPerimeter: number = wallPerimeter +
      crownMoldingPerimeter +
      chairRailPerimeter +
      baseboardPerimeter +
      wainscotingPerimeter +
      ceilingPerimeter +
      floorPerimeter
  ) => {
    return numberOfPaintGallons(Math.abs(areaPerimeter));
  };

  const totalGallonsPerArea = (areaPerimeter: number) => {
    return numberOfPaintGallons(areaPerimeter);
  };

  const totalGallonsBySection = {
    walls: totalGallonsPerArea(wallPerimeter),
    crownMolding: totalGallonsPerArea(crownMoldingPerimeter),
    chairRail: totalGallonsPerArea(chairRailPerimeter),
    baseboard: totalGallonsPerArea(baseboardPerimeter),
    wainscoting: totalGallonsPerArea(wainscotingPerimeter),
    ceiling: totalGallonsPerArea(ceilingPerimeter),
    floor: totalGallonsPerArea(floorPerimeter),
  };

  const totalHours = estimatePaintingHours({
    wallSqFt: wallPerimeter,
    ceilingSqFt: ceilingPerimeter,
    trimLinearFt:
      crownMoldingPerimeter +
      chairRailPerimeter +
      baseboardPerimeter +
      wainscotingPerimeter,
    wallCoats: wallCoats,
    ceilingCoats: ceilingCoats,
    trimCoats:
      baseboardCoats + chairRailCoats + crownMoldingCoats + wainscotingCoats,
  });

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
    totalGallonsBySection,
    mappingNames,
    totalHours,
    totalDays: convertHoursToDays(totalHours),
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
