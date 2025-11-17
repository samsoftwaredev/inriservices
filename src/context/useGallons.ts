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
  totalGallons: {
    walls: number;
    crownMolding: number;
    chairRail: number;
    baseboard: number;
  };
};

const GallonsContext = createContext<GallonsContextType | undefined>(undefined);

export const GallonsProvider = ({ children }: GallonsProviderProps) => {
  const mappingNames = {
    walls: "Walls",
    crownMolding: "Crown Molding",
    chairRail: "Chair Rail",
    baseboard: "Baseboard",
  };
  const [walls, setWalls] = useState<RoomCollection>({});
  const [crownMolding, setCrownMolding] = useState<RoomCollection>({});
  const [chairRail, setChairRail] = useState<RoomCollection>({});
  const [baseboard, setBaseboard] = useState<RoomCollection>({});

  const projectTotalGallons = (collection: RoomCollection) => {
    return Object.values(collection).reduce((total, item) => {
      return total + (item.gallons || 0);
    }, 0);
  };

  const totalGallons = {
    walls: projectTotalGallons(walls),
    crownMolding: projectTotalGallons(crownMolding),
    chairRail: projectTotalGallons(chairRail),
    baseboard: projectTotalGallons(baseboard),
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
    totalGallons,
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
