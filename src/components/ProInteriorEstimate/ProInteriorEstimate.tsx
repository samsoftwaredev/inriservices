"use client";

import React, { useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import CustomerHeader from "./CustomerHeader";
import CustomerInfoCard from "./CustomerInfoCard";
import CustomerSelectionMenu from "./CustomerSelectionMenu";
import NewCustomerDialog from "./NewCustomerDialog";
import ProjectSettings from "./ProjectSettings";
import Room from "./Room";
import { Customer, LocationData, Section } from "./laborTypes";

const ProInteriorEstimate = () => {
  // Sample previous customers data
  const [previousCustomers, setPreviousCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      contact: "Jane Smith",
      phone: "(123) 456-7890",
      email: "jane.smith@example.com",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
    {
      id: "2",
      name: "Alice Johnson",
      contact: "Bob Wilson",
      phone: "(555) 123-4567",
      email: "bob.wilson@email.com",
      address: "456 Oak Avenue",
      city: "Springfield",
      state: "TX",
      zipCode: "67890",
    },
    {
      id: "3",
      name: "Michael Brown",
      contact: "Sarah Brown",
      phone: "(333) 555-7777",
      email: "sarah.brown@gmail.com",
      address: "789 Pine Street",
      city: "Riverside",
      state: "FL",
      zipCode: "54321",
    },
  ]);

  const [currentCustomer, setCurrentCustomer] = useState<Customer>({
    id: "1",
    name: "John Doe",
    contact: "Jane Smith",
    phone: "(123) 456-7890",
    email: "jane.smith@example.com",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
  });

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

  // Menu and dialog states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);

  const handleSelectPreviousCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setLocationData({
      ...locationData,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
    });
    setAnchorEl(null);
  };

  const handleSaveNewCustomer = (newCustomerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: Date.now().toString(),
    };

    setCurrentCustomer(newCustomer);
    setPreviousCustomers([...previousCustomers, newCustomer]);
    setLocationData({
      ...locationData,
      address: newCustomer.address,
      city: newCustomer.city,
      state: newCustomer.state,
      zipCode: newCustomer.zipCode,
    });
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCurrentCustomer(updatedCustomer);
    setPreviousCustomers(
      previousCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    setLocationData({
      ...locationData,
      address: updatedCustomer.address,
      city: updatedCustomer.city,
      state: updatedCustomer.state,
      zipCode: updatedCustomer.zipCode,
    });
  };

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Room ${locationData.sections.length + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setLocationData({
      ...locationData,
      sections: [...locationData.sections, newSection],
    });
  };

  const onRoomUpdate = (updates: {
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

  return (
    <Box sx={{ p: 3 }}>
      <CustomerHeader
        locationData={locationData}
        onAddCustomerClick={setAnchorEl}
      />

      <CustomerInfoCard
        currentCustomer={currentCustomer}
        onCustomerUpdate={handleCustomerUpdate}
      />

      <CustomerSelectionMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        previousCustomers={previousCustomers}
        onSelectCustomer={handleSelectPreviousCustomer}
        onCreateNewCustomer={() => setNewCustomerDialogOpen(true)}
      />

      <NewCustomerDialog
        open={newCustomerDialogOpen}
        onClose={() => setNewCustomerDialogOpen(false)}
        onSaveCustomer={handleSaveNewCustomer}
      />

      <Divider sx={{ my: 3 }} />

      <ProjectSettings
        locationData={locationData}
        setLocationData={setLocationData}
      />

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Work Sections</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewSection}
          sx={{ ml: 2 }}
        >
          Add Section
        </Button>
      </Box>

      {locationData.sections.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No sections added yet.
        </Typography>
      )}

      {locationData.sections.map((section) => (
        <Box key={section.id} sx={{ mb: 2 }}>
          <Room
            onRoomUpdate={onRoomUpdate}
            roomName={section.name}
            roomDescription={section.description}
            measurementUnit={locationData.measurementUnit}
            floorNumber={section.floorNumber}
            id={section.id}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProInteriorEstimate;
