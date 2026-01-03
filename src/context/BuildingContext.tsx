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
  buildingData?: LocationData;
  setBuildingData: React.Dispatch<
    React.SetStateAction<LocationData | undefined>
  >;
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
  getAddresses: () => { id: string; address: string }[];
}

const BuildingContext = createContext<BuildingContextType | undefined>(
  undefined
);

interface BuildingProviderProps {
  children: ReactNode;
}

export const BuildingProvider = ({ children }: BuildingProviderProps) => {
  const { buildingData, setBuildingData } = useClient();
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

  const addNewRoom = () => {
    const id = uuidv4();
    const newRoom: RoomOverview = {
      id,
      name: `Room ${id.slice(0, 8)}`,
      description: "New room section",
      floorNumber: 1,
    };

    setBuildingData((previousBuildingData) => ({
      ...previousBuildingData!,
      rooms: previousBuildingData?.rooms
        ? [...previousBuildingData.rooms, newRoom]
        : [newRoom],
    }));
  };

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

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.roomId) {
      const copyBuildingData = { ...buildingData! };
      copyBuildingData.rooms = copyBuildingData.rooms.filter(
        (room) => room.id !== deleteConfirmation.roomId
      );
      setBuildingData(copyBuildingData);
      // If no rooms left, reset building data
      if (copyBuildingData.rooms.length === 0) {
        setBuildingData(undefined);
      }
    }
    handleDeleteCancel();
  };

  const onRoomUpdate = (updates: {
    roomId: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => {
    setBuildingData((prevData) => {
      if (!prevData) return prevData;
      const updatedRooms = prevData.rooms.map((room) =>
        room.id === updates.roomId
          ? {
              ...room,
              name: updates.roomName,
              description: updates.roomDescription,
              floorNumber: updates.floorNumber,
            }
          : room
      );
      return {
        ...prevData,
        rooms: updatedRooms,
      };
    });
  };

  const getAddresses = useCallback((): { id: string; address: string }[] => {
    return (
      buildingData?.rooms.map((room) => ({
        id: room.id,
        address: room.name,
      })) || []
    );
  }, [buildingData]);

  const value: BuildingContextType = {
    // State
    buildingData,
    setBuildingData,
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
