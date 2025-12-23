"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { LocationData, Section } from "@/interfaces/laborTypes";
import { useCustomer } from "./CustomerContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DeleteConfirmationState {
  open: boolean;
  sectionId: string | null;
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
  handleDeleteSectionClick: (sectionId: string, sectionName: string) => void;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentCustomer } = useCustomer();
  const [currentBuildingId, setCurrentBuildingId] = useState<
    string | undefined
  >();
  const [buildingData, setBuildingData] = useState<LocationData | undefined>();

  const updateQuery = (buildingId?: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (buildingId) {
      current.set("buildingId", buildingId);
    } else {
      current.delete("buildingId");
    }
    // controlled navigation
    router.push(`${pathname}?${current.toString()}`);
  };

  const updateLocalStorage = (buildingId?: string) => {
    if (buildingId) {
      localStorage.setItem("currentBuildingId", buildingId);
    } else {
      localStorage.removeItem("currentBuildingId");
    }
  };

  const getBuilding = () => {
    return currentCustomer?.buildings[0];
  };

  const getBuildingById = (id: string) => {
    const buildingIndex = currentCustomer?.buildings.findIndex(
      (building) => building.id === id
    );
    return buildingIndex !== undefined && buildingIndex >= 0
      ? buildingIndex
      : undefined;
  };

  useEffect(() => {
    const building = getBuilding();
    setBuildingData(building);
    updateQuery(building?.id);
    updateLocalStorage(building?.id);
  }, [searchParams, currentCustomer, currentBuildingId]);

  // Menu and dialog states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      sectionId: null,
      sectionName: null,
    });

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Room ${buildingData?.sections.length! + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setBuildingData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: [...prev.sections, newSection],
      };
    });
  };

  const handleDeleteSectionClick = (sectionId: string, sectionName: string) => {
    setDeleteConfirmation({
      open: true,
      sectionId,
      sectionName,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      open: false,
      sectionId: null,
      sectionName: null,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.sectionId) {
      setBuildingData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.filter(
            (section) => section.id !== deleteConfirmation.sectionId
          ),
        };
      });
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
      const updatedSections = prevData.sections.map((section) =>
        section.id === updates.roomId
          ? {
              ...section,
              name: updates.roomName,
              description: updates.roomDescription,
              floorNumber: updates.floorNumber,
            }
          : section
      );
      return {
        ...prevData,
        sections: updatedSections,
      };
    });
  };

  const getAddresses = useCallback((): { id: string; address: string }[] => {
    return (
      currentCustomer?.buildings.map((building) => ({
        id: building.id,
        address: building.address,
      })) || []
    );
  }, [currentCustomer]);

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
