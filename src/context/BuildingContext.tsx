"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { LocationData, RoomOverview } from "@/interfaces/laborTypes";
import { useClient } from "./ClientContext";
import { uuidv4 } from "@/tools";

interface DeleteConfirmationState {
  open: boolean;
  roomId: string | null;
  sectionName: string | null;
}

interface BuildingContextType {
  // State
  propertyData?: any;
  setPropertyData: React.Dispatch<React.SetStateAction<any | undefined>>;
  deleteConfirmation: DeleteConfirmationState;
  setDeleteConfirmation: React.Dispatch<
    React.SetStateAction<DeleteConfirmationState>
  >;
  currentBuildingId?: string;
  // Handlers
  addNewRoom: () => void;
  handleDeleteSectionClick: (roomId: string, sectionName: string) => void;
  handleDeleteCancel: () => void;
  handleDeleteConfirm: () => void;
  onRoomUpdate: (updates: {
    roomId: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => void;
  getAddresses: () => void;
}

const BuildingContext = createContext<BuildingContextType | undefined>(
  undefined
);

interface BuildingProviderProps {
  children: ReactNode;
}

export const BuildingProvider = ({ children }: BuildingProviderProps) => {
  const { propertyData, setPropertyData } = useClient();
  const [currentBuildingId, setCurrentBuildingId] = useState<
    string | undefined
  >();

  // Menu and dialog states
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      roomId: null,
      sectionName: null,
    });

  const addNewRoom = () => {};

  const handleDeleteSectionClick = (roomId: string, sectionName: string) => {
    setDeleteConfirmation({
      open: true,
      roomId,
      sectionName,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      open: false,
      roomId: null,
      sectionName: null,
    });
  };

  const handleDeleteConfirm = () => {};

  const onRoomUpdate = (updates: {
    roomId: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => {};

  const getAddresses = () => {};

  const value: BuildingContextType = {
    // State
    propertyData,
    setPropertyData,
    deleteConfirmation,
    setDeleteConfirmation,
    currentBuildingId,
    // Handlers
    addNewRoom,
    handleDeleteSectionClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    onRoomUpdate,
    getAddresses,
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
};

// Custom hook to use the context
export const useBuilding = (): BuildingContextType => {
  const context = useContext(BuildingContext);
  if (context === undefined) {
    throw new Error("useBuilding must be used within a BuildingProvider");
  }
  return context;
};
