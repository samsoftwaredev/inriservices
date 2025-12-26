"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  Customer,
  LocationData,
  RoomData,
  Section,
} from "@/interfaces/laborTypes";
import { useCustomer } from "./CustomerContext";
import { usePathname, useRouter } from "next/navigation";
import { useProjectCost } from "./ProjectCostContext";

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
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  deleteConfirmation: DeleteConfirmationState;
  setDeleteConfirmation: React.Dispatch<
    React.SetStateAction<DeleteConfirmationState>
  >;
  currentBuildingId?: string;
  // Handlers
  addNewSection: () => void;
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
  customer?: Customer;
}

export const BuildingProvider = ({
  children,
  customer,
}: BuildingProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentBuildingId, setCurrentBuildingId] = useState<
    string | undefined
  >();
  const [buildingData, setBuildingData] = useState<LocationData | undefined>(
    customer?.buildings[0]
  );

  const updateQuery = (buildingId?: string) => {
    const current = new URLSearchParams(window.location.search);
    if (buildingId) {
      current.set("buildingId", buildingId);
    } else {
      current.delete("buildingId");
    }
    // controlled navigation
    router.replace(`${pathname}?${current.toString()}`);
  };

  const updateLocalStorage = (buildingId?: string) => {
    if (buildingId) {
      localStorage.setItem("currentBuildingId", buildingId);
    } else {
      localStorage.removeItem("currentBuildingId");
    }
  };

  const getBuilding = () => {
    return customer?.buildings[0];
  };

  const getBuildingById = (id: string) => {
    const buildingIndex = customer?.buildings.findIndex(
      (building) => building.id === id
    );
    return buildingIndex !== undefined && buildingIndex >= 0
      ? buildingIndex
      : undefined;
  };

  // useEffect(() => {
  //   const building = getBuilding();
  //   setBuildingData(building);
  //   updateQuery(building?.id);
  //   updateLocalStorage(building?.id);
  //   setCurrentBuildingId(building?.id);
  // }, [currentCustomer, buildingData?.rooms.length]);

  // Menu and dialog states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      roomId: null,
      sectionName: null,
    });

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Room ${buildingData?.rooms.length! + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setBuildingData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rooms: [...prev.rooms, newSection],
      };
    });
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
      customer?.buildings.map((building) => ({
        id: building.id,
        address: building.address,
      })) || []
    );
  }, [customer]);

  const value: BuildingContextType = {
    // State
    buildingData,
    setBuildingData,
    anchorEl,
    setAnchorEl,
    deleteConfirmation,
    setDeleteConfirmation,
    currentBuildingId,
    // Handlers
    addNewSection,
    handleDeleteSectionClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    onRoomUpdate,
    getAddresses,
  };

  return React.createElement(BuildingContext.Provider, { value }, children);
};

// Custom hook to use the context
export const useBuilding = (): BuildingContextType => {
  const context = useContext(BuildingContext);
  if (context === undefined) {
    throw new Error("useBuilding must be used within a BuildingProvider");
  }
  return context;
};
