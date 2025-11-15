import { useState } from "react";
import { LocationData, Section, Customer } from "../interfaces/laborTypes";

export const useLocationData = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    address: "123 Main St",
    city: "Garland",
    state: "TX",
    zipCode: "75040",
    measurementUnit: "ft",
    floorPlan: 1,
    sections: [
      {
        id: "1",
        name: "Living Room",
        description: "Spacious living area",
        floorNumber: 1,
      },
      {
        id: "2",
        name: "Kitchen",
        description: "Modern kitchen area",
        floorNumber: 1,
      },
    ],
  });

  const updateLocationFromCustomer = (customer: Customer) => {
    setLocationData((prev) => ({
      ...prev,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
    }));
  };

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Room ${locationData.sections.length + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setLocationData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const removeSection = (sectionId: string) => {
    setLocationData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  };

  const updateSection = (updates: {
    id: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => {
    setLocationData((prevData) => {
      const updatedSections = prevData.sections.map((section) =>
        section.id === updates.id
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

  return {
    // State
    locationData,
    setLocationData,

    // Handlers
    updateLocationFromCustomer,
    addNewSection,
    removeSection,
    updateSection,
  };
};
