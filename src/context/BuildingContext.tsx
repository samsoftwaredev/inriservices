"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { LocationData, Section } from "@/interfaces/laborTypes";
import { useCustomer } from "./CustomerContext";

interface DeleteConfirmationState {
  open: boolean;
  sectionId: string | null;
  sectionName: string | null;
}

interface BuildingContextType {
  // State
  buildingData: LocationData;
  setBuildingData: React.Dispatch<React.SetStateAction<LocationData>>;
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  deleteConfirmation: DeleteConfirmationState;
  setDeleteConfirmation: React.Dispatch<
    React.SetStateAction<DeleteConfirmationState>
  >;
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
}

const BuildingContext = createContext<BuildingContextType | undefined>(
  undefined
);

interface BuildingProviderProps {
  children: ReactNode;
}

export const BuildingProvider = ({ children }: BuildingProviderProps) => {
  const { currentCustomer } = useCustomer();
  const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0);
  const [buildingData, setBuildingData] = useState<LocationData>(
    currentCustomer.buildings[currentBuildingIndex]
    // { address: "123 Main St",
    // city: "Garland",
    // state: "TX",
    // zipCode: "75040",
    // measurementUnit: "ft",
    // floorPlan: 1,
    // sections: [
    //   {
    //     id: "1",
    //     name: "Living Room",
    //     description: "Spacious living area",
    //     floorNumber: 1,
    //   },
    //   {
    //     id: "2",
    //     name: "Kitchen",
    //     description: "Modern kitchen area",
    //     floorNumber: 1,
    //   },
    // ]
    // },
  );

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
      name: `Room ${buildingData.sections.length + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setBuildingData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
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
      setBuildingData((prev) => ({
        ...prev,
        sections: prev.sections.filter(
          (section) => section.id !== deleteConfirmation.sectionId
        ),
      }));
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

  const value: BuildingContextType = {
    // State
    buildingData,
    setBuildingData,
    anchorEl,
    setAnchorEl,
    deleteConfirmation,
    setDeleteConfirmation,
    // Handlers
    addNewSection,
    handleDeleteSectionClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    onRoomUpdate,
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
