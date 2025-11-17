"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type GallonsProviderProps = {
  children: ReactNode;
};

type FeatureDetails = {
  coats: number | null;
  gallons: number | null;
  height: number | null;
};

type RoomCollection = {
  [key: string]: FeatureDetails;
};

type GallonsContextType = {
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

  const calculatePaintArea = () => {
    const wallsValues = Object.values(walls).reduce((total, item) => {
      return total + (item.gallons || 0);
    }, 0);
    const crownMoldingValues = Object.values(crownMolding).reduce(
      (total, item) => {
        return total + (item.gallons || 0);
      },
      0
    );
    const chairRailValues = Object.values(chairRail).reduce((total, item) => {
      return total + (item.gallons || 0);
    }, 0);
    const baseboardValues = Object.values(baseboard).reduce((total, item) => {
      return total + (item.gallons || 0);
    }, 0);
    const wainscotingValues = Object.values(wainscoting).reduce(
      (total, item) => {
        return total + (item.gallons || 0);
      },
      0
    );
    const ceilingValues = Object.values(ceiling).reduce((total, item) => {
      return total + (item.gallons || 0);
    }, 0);
    const floorValues = Object.values(floor).reduce((total, item) => {
      return total + (item.gallons || 0);
    }, 0);
    return (
      wallsValues -
      crownMoldingValues -
      chairRailValues -
      baseboardValues -
      wainscotingValues +
      ceilingValues +
      floorValues
    );
  };

  const projectTotalGallons = (collection: RoomCollection) => {
    calculatePaintArea();
    return Object.values(collection).reduce((total, item) => {
      return total + (item.gallons || 0);
    }, 0);
  };

  const totalGallonsBySection = {
    walls: projectTotalGallons(walls),
    crownMolding: projectTotalGallons(crownMolding),
    chairRail: projectTotalGallons(chairRail),
    baseboard: projectTotalGallons(baseboard),
    wainscoting: projectTotalGallons(wainscoting),
    ceiling: projectTotalGallons(ceiling),
    floor: projectTotalGallons(floor),
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
    totalGallons: calculatePaintArea(),
    totalGallonsBySection,
    mappingNames,
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
