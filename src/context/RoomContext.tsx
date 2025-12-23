"use client";

import React, { createContext, useContext, useState } from "react";
import {
  MeasurementUnit,
  PaintBaseType,
  RoomData,
} from "@/interfaces/laborTypes";

interface RoomContextType {
  roomId: string;
  roomName: string;
  roomDescription: string;
  measurementUnit: MeasurementUnit;
  floorNumber: number;
  roomData: RoomData;
  updateRoom: (newRoomData: Partial<RoomData>) => void;
}

interface RoomProviderProps {
  children: React.ReactNode;
  roomId: string;
  roomName: string;
  roomDescription: string;
  measurementUnit: MeasurementUnit;
  floorNumber: number;
  updateProjectCost: (roomId: string, roomData: RoomData) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({
  children,
  roomId,
  roomName,
  roomDescription,
  measurementUnit,
  floorNumber,
  updateProjectCost,
}: RoomProviderProps) => {
  const defaultRoomData: RoomData = {
    // WallDimensions
    wallPaintCoats: 1,
    wallPerimeter: "",
    roomHeight: 0,
    wallPerimeterCalculated: 0,
    wallPaintBase: PaintBaseType.Latex,
    // BaseboardDimensions
    baseboardHeight: 0,
    baseboardPaintCoats: 1,
    baseboardPerimeter: "",
    baseboardPerimeterCalculated: 0,
    baseboardPaintBase: PaintBaseType.Latex,
    // chairRailDimensions
    chairRailPerimeter: "",
    chairRailHeight: 0,
    chairRailPaintCoats: 1,
    chairRailPerimeterCalculated: 0,
    chairRailPaintBase: PaintBaseType.Latex,
    // crownMoldingDimensions
    crownMoldingPerimeter: "",
    crownMoldingHeight: 0,
    crownMoldingPaintCoats: 1,
    crownMoldingPerimeterCalculated: 0,
    crownMoldingPaintBase: PaintBaseType.Latex,
    // wainscotingDimensions
    wainscotingPerimeter: "",
    wainscotingHeight: 0,
    wainscotingPaintCoats: 1,
    wainscotingPerimeterCalculated: 0,
    wainscotingPaintBase: PaintBaseType.Latex,
    // RoomData
    area: "",
    areaCalculated: 10,
    ceilingPaintCoats: 1,
    ceilingPaintBase: PaintBaseType.Latex,
    floorPaintCoats: 1,
    floorPaintBase: PaintBaseType.Latex,
    floorNumber: floorNumber,
    totalCost: 0,
    includeMaterialCosts: true,
    features: {
      outlets: [],
      switches: [],
      fixtures: [],
      ceilings: [],
      flooring: [],
      cabinetry: [],
      trim: [],
      walls: [],
      windows: [],
      doors: [],
      closets: [],
      crownMolding: [],
      chairRail: [],
      baseboard: [],
      wainscoting: [],
      other: [],
    },
  };

  const localStoredRoomData = localStorage.getItem(`roomData-${roomId}`);
  const [roomData, setRoomData] = useState<RoomData>({
    ...JSON.parse(localStoredRoomData || JSON.stringify(defaultRoomData)),
  });

  const updateRoom = (newRoomData: Partial<RoomData>) => {
    setRoomData((prevData) => {
      const updatedData = { ...prevData, ...newRoomData };
      updateProjectCost(roomId, roomData);
      localStorage.setItem(`roomData-${roomId}`, JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const value: RoomContextType = {
    roomId,
    roomName,
    roomDescription,
    measurementUnit,
    floorNumber,
    roomData,
    updateRoom,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
